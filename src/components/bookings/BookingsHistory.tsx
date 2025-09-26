import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter, Download, MessageCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { BookingData, SearchFilters } from '../../types/booking';
import { PendingPayments } from './PendingPayments';
import { ConfirmedSessions } from './ConfirmedSessions';
import { SessionHistory } from './SessionHistory';
import SearchFilterBar from './SearchFilterBar';

export const BookingsHistory: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'pending' | 'confirmed' | 'history'>('pending');
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    sortBy: 'date',
    sortOrder: 'desc',
  });

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

  const fetchBookings = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          client:profiles!bookings_client_id_fkey(
            id, full_name, display_name, email, phone_number, timezone
          ),
          pet:pets(
            id, name, type, breed, age, photo, special_needs
          ),
          service:services(
            title, description
          ),
          session_notes(
            pre_session_notes, session_summary, insights, recommendations,
            private_notes, rating, follow_up_needed, next_steps, completed_at
          ),
          messages(
            id, sender_id, content, created_at, is_read
          )
        `)
        .eq('communicator_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedBookings: BookingData[] = (data || []).map(booking => ({
        id: booking.id,
        clientInfo: {
          id: booking.client?.id || '',
          name: booking.client?.display_name || booking.client?.full_name || 'Unknown Client',
          email: booking.client?.email || '',
          phone: booking.client?.phone_number || '',
          timezone: booking.client?.timezone || 'America/New_York',
          joinedDate: booking.created_at?.split('T')[0] || '',
        },
        petInfo: {
          id: booking.pet?.id || '',
          name: booking.pet?.name || 'Unknown Pet',
          type: booking.pet?.type || 'Unknown',
          breed: booking.pet?.breed,
          age: booking.pet?.age,
          photo: booking.pet?.photo,
          specialNeeds: booking.pet?.special_needs,
          previousSessions: 0, // Would need separate query
        },
        sessionDetails: {
          id: booking.id,
          type: booking.service?.title?.toLowerCase().includes('communication') ? 'communication' :
                booking.service?.title?.toLowerCase().includes('behavioral') ? 'behavioral' :
                booking.service?.title?.toLowerCase().includes('healing') ? 'healing' : 'communication',
          duration: booking.duration,
          scheduledDate: booking.scheduled_date,
          scheduledTime: booking.scheduled_time,
          platform: booking.platform,
          meetingLink: booking.meeting_link,
          specialRequests: booking.special_requests,
        },
        paymentInfo: {
          amount: booking.amount,
          currency: booking.currency || 'USD',
          method: booking.payment_method || 'bank-transfer',
          proofImage: booking.payment_proof,
          transactionId: booking.transaction_id,
          paidAt: booking.paid_at,
        },
        status: booking.status,
        notes: booking.session_notes?.[0] || {
          preSession: '',
          sessionSummary: '',
          insights: '',
          recommendations: '',
          privateNotes: '',
          rating: 0,
          followUpNeeded: false,
          nextSteps: [],
        },
        communications: (booking.messages || []).map((msg: any) => ({
          id: msg.id,
          senderId: msg.sender_id,
          senderName: msg.sender_id === user.id ? 'You' : booking.client?.display_name || 'Client',
          content: msg.content,
          timestamp: msg.created_at,
          read: msg.is_read,
          attachments: [],
        })),
        createdAt: booking.created_at,
        updatedAt: booking.updated_at,
      }));

      setBookings(formattedBookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter bookings based on active tab and search filters
  const filteredBookings = useMemo(() => {
    let filtered = bookings;

    // Filter by tab
    switch (activeTab) {
      case 'pending':
        filtered = filtered.filter(booking => booking.status === 'payment-pending');
        break;
      case 'confirmed':
        filtered = filtered.filter(booking => 
          booking.status === 'scheduled' || booking.status === 'payment-confirmed'
        );
        break;
      case 'history':
        filtered = filtered.filter(booking => 
          booking.status === 'completed' || booking.status === 'cancelled' || booking.status === 'no-show'
        );
        break;
    }

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(booking =>
        booking.clientInfo.name.toLowerCase().includes(query) ||
        booking.petInfo.name.toLowerCase().includes(query) ||
        booking.sessionDetails.type.toLowerCase().includes(query)
      );
    }

    // Apply additional filters
    if (filters.status?.length) {
      filtered = filtered.filter(booking => filters.status!.includes(booking.status));
    }

    if (filters.serviceType?.length) {
      filtered = filtered.filter(booking => filters.serviceType!.includes(booking.sessionDetails.type));
    }

    if (filters.clientName) {
      filtered = filtered.filter(booking =>
        booking.clientInfo.name.toLowerCase().includes(filters.clientName!.toLowerCase())
      );
    }

    if (filters.petName) {
      filtered = filtered.filter(booking =>
        booking.petInfo.name.toLowerCase().includes(filters.petName!.toLowerCase())
      );
    }

    // Apply date range filter
    if (filters.dateRange) {
      filtered = filtered.filter(booking => {
        const bookingDate = new Date(booking.createdAt);
        const startDate = new Date(filters.dateRange!.start);
        const endDate = new Date(filters.dateRange!.end);
        return bookingDate >= startDate && bookingDate <= endDate;
      });
    }

    // Apply amount filters
    if (filters.minAmount) {
      filtered = filtered.filter(booking => booking.paymentInfo.amount >= filters.minAmount!);
    }

    if (filters.maxAmount) {
      filtered = filtered.filter(booking => booking.paymentInfo.amount <= filters.maxAmount!);
    }

    // Sort results
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (filters.sortBy) {
        case 'date':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'amount':
          comparison = a.paymentInfo.amount - b.paymentInfo.amount;
          break;
        case 'client':
          comparison = a.clientInfo.name.localeCompare(b.clientInfo.name);
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
      }
      
      return filters.sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [bookings, activeTab, searchQuery, filters]);

  const getTabCounts = () => {
    const pending = bookings.filter(b => b.status === 'payment-pending').length;
    const confirmed = bookings.filter(b => 
      b.status === 'scheduled' || b.status === 'payment-confirmed'
    ).length;
    const history = bookings.filter(b => 
      b.status === 'completed' || b.status === 'cancelled' || b.status === 'no-show'
    ).length;
    
    return { pending, confirmed, history };
  };

  const tabCounts = getTabCounts();

  const handleExportData = () => {
    const csvContent = filteredBookings.map(booking => ({
      'Booking ID': booking.id,
      'Client': booking.clientInfo.name,
      'Pet': booking.petInfo.name,
      'Service': booking.sessionDetails.type,
      'Amount': booking.paymentInfo.amount,
      'Status': booking.status,
      'Created': new Date(booking.createdAt).toLocaleDateString(),
    }));
    
    // Convert to CSV and trigger download
    const headers = Object.keys(csvContent[0]).join(',');
    const rows = csvContent.map(row => Object.values(row).join(','));
    const csv = [headers, ...rows].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bookings-${activeTab}-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="py-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Bookings & History</h1>
                <p className="text-sm sm:text-base text-gray-600">Manage your pet communication sessions</p>
              </div>
              
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="inline-flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  <Filter className="w-4 h-4" />
                  <span className="hidden sm:inline">Filters</span>
                </button>
                
                <button
                  onClick={handleExportData}
                  className="inline-flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg text-xs sm:text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Export</span>
                </button>
              </div>
            </div>

            {/* Search Bar */}
            <div className="mt-6">
              <div className="relative w-full sm:max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search bookings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base sm:text-sm"
                />
              </div>
            </div>

            {/* Filter Bar */}
            {showFilters && (
              <SearchFilterBar
                filters={filters}
                onFiltersChange={setFilters}
                onClose={() => setShowFilters(false)}
              />
            )}

            {/* Tabs */}
            <div className="mt-6 border-b border-gray-200">
              <nav className="-mb-px flex space-x-4 sm:space-x-8 overflow-x-auto">
                <button
                  onClick={() => setActiveTab('pending')}
                  className={`py-2 px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap flex-shrink-0 ${
                    activeTab === 'pending'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="sm:hidden">Pending</span>
                  <span className="hidden sm:inline">Pending Payments</span>
                  {tabCounts.pending > 0 && (
                    <span className="ml-1 sm:ml-2 inline-flex items-center px-1.5 sm:px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      {tabCounts.pending}
                    </span>
                  )}
                </button>
                
                <button
                  onClick={() => setActiveTab('confirmed')}
                  className={`py-2 px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap flex-shrink-0 ${
                    activeTab === 'confirmed'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="sm:hidden">Confirmed</span>
                  <span className="hidden sm:inline">Confirmed Sessions</span>
                  {tabCounts.confirmed > 0 && (
                    <span className="ml-1 sm:ml-2 inline-flex items-center px-1.5 sm:px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {tabCounts.confirmed}
                    </span>
                  )}
                </button>
                
                <button
                  onClick={() => setActiveTab('history')}
                  className={`py-2 px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap flex-shrink-0 ${
                    activeTab === 'history'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="sm:hidden">History</span>
                  <span className="hidden sm:inline">Session History</span>
                  {tabCounts.history > 0 && (
                    <span className="ml-1 sm:ml-2 inline-flex items-center px-1.5 sm:px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {tabCounts.history}
                    </span>
                  )}
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-8">
        {activeTab === 'pending' && <PendingPayments bookings={filteredBookings} />}
        {activeTab === 'confirmed' && <ConfirmedSessions bookings={filteredBookings} />}
        {activeTab === 'history' && <SessionHistory bookings={filteredBookings} />}
        
        {filteredBookings.length === 0 && (
          <div className="text-center py-12">
            <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
            <p className="text-gray-600">
              {searchQuery || Object.keys(filters).some(key => key !== 'query' && key !== 'sortBy' && key !== 'sortOrder' && filters[key as keyof SearchFilters])
                ? 'Try adjusting your search or filters'
                : 'Your bookings will appear here'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};