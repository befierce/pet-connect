import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Clock, AlertCircle, CheckCircle, X, Eye } from 'lucide-react';

interface Inquiry {
  id: string;
  clientName: string;
  petName: string;
  petType: string;
  serviceType: string;
  preferredTime: string;
  message: string;
  timestamp: string;
  status: 'new' | 'active' | 'declined';
  urgent: boolean;
  avatar?: string;
}

const InquiriesList: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'new' | 'active' | 'declined'>('new');
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchInquiries();
    }
  }, [user, activeTab]);

  const fetchInquiries = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('inquiries')
        .select(`
          *,
          client:profiles!inquiries_client_id_fkey(full_name, display_name)
        `)
        .eq('communicator_id', user.id)
        .eq('status', activeTab)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedInquiries: Inquiry[] = (data || []).map(inquiry => ({
        id: inquiry.id,
        clientName: inquiry.client?.display_name || inquiry.client?.full_name || 'Unknown Client',
        petName: inquiry.pet_name,
        petType: inquiry.pet_type,
        serviceType: inquiry.service_type,
        preferredTime: inquiry.preferred_time || 'Flexible',
        message: inquiry.message,
        timestamp: getTimeAgo(inquiry.created_at),
        status: inquiry.status,
        urgent: inquiry.is_urgent || false,
      }));

      setInquiries(formattedInquiries);
    } catch (error) {
      console.error('Error fetching inquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  };

  const filteredInquiries = inquiries.filter(inquiry => inquiry.status === activeTab);

  const getTabCounts = () => {
    return {
      new: inquiries.filter(i => i.status === 'new').length,
      active: inquiries.filter(i => i.status === 'active').length,
      declined: inquiries.filter(i => i.status === 'declined').length,
    };
  };

  const tabCounts = getTabCounts();

  const handleQuickAccept = (inquiryId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    acceptInquiry(inquiryId);
  };

  const acceptInquiry = async (inquiryId: string) => {
    try {
      const { error } = await supabase
        .from('inquiries')
        .update({ status: 'active' })
        .eq('id', inquiryId);

      if (error) throw error;
      fetchInquiries(); // Refresh the list
    } catch (error) {
      console.error('Error accepting inquiry:', error);
    }
  };

  const handlePreview = (inquiryId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/inquiries/${inquiryId}`);
  };

  if (loading) {
    return (
      <div className="p-4 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Tabs */}
      <div className="mb-6">
        <div className="flex space-x-1 bg-gray-100 rounded-xl p-1">
          {[
            { key: 'new', label: 'New', count: tabCounts.new },
            { key: 'active', label: 'Active', count: tabCounts.active },
            { key: 'declined', label: 'Declined', count: tabCounts.declined },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-lg font-medium text-sm transition-all ${
                activeTab === tab.key
                  ? 'bg-white text-purple-primary shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                  activeTab === tab.key
                    ? 'bg-purple-100 text-purple-primary'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Inquiries List */}
      <div className="space-y-3">
        {filteredInquiries.length > 0 ? (
          filteredInquiries.map((inquiry) => (
            <div
              key={inquiry.id}
              onClick={() => navigate(`/inquiries/${inquiry.id}`)}
              className={`bg-white rounded-xl p-4 border cursor-pointer transition-all hover:shadow-md ${
                inquiry.urgent ? 'border-orange-200 bg-orange-50' : 'border-gray-200'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-primary font-semibold">
                      {inquiry.clientName.charAt(0)}
                    </span>
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-gray-800">{inquiry.clientName}</h3>
                      {inquiry.urgent && (
                        <span className="px-2 py-0.5 bg-orange-100 text-orange-800 text-xs rounded-full font-medium">
                          Urgent
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{inquiry.petName} • {inquiry.petType}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center space-x-1 text-gray-500 text-sm">
                    <Clock className="w-4 h-4" />
                    <span>{inquiry.timestamp}</span>
                  </div>
                </div>
              </div>

              {/* Service Info */}
              <div className="bg-gray-50 rounded-lg p-3 mb-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-600">Service:</span>
                    <p className="font-medium text-gray-800">{inquiry.serviceType}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Preferred Time:</span>
                    <p className="font-medium text-gray-800">{inquiry.preferredTime}</p>
                  </div>
                </div>
              </div>

              {/* Message Preview */}
              <div className="mb-4">
                <p className="text-gray-700 text-sm line-clamp-3">
                  {inquiry.message}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2">
                {activeTab === 'new' && (
                  <>
                    <button
                      onClick={(e) => handleQuickAccept(inquiry.id, e)}
                      className="flex items-center space-x-1 px-3 py-2 bg-purple-primary text-white rounded-lg text-sm font-medium hover:bg-purple-dark transition-colors"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Accept</span>
                    </button>
                    
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center space-x-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      <span>Decline</span>
                    </button>
                  </>
                )}
                
                <button
                  onClick={(e) => handlePreview(inquiry.id, e)}
                  className="flex items-center space-x-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors ml-auto"
                >
                  <Eye className="w-4 h-4" />
                  <span>View</span>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-800 mb-1">
              {activeTab === 'new' && 'No new inquiries'}
              {activeTab === 'active' && 'No active inquiries'}
              {activeTab === 'declined' && 'No declined inquiries'}
            </h3>
            <p className="text-gray-600 text-sm">
              {activeTab === 'new' && 'New inquiries will appear here'}
              {activeTab === 'active' && 'Accepted inquiries will appear here'}
              {activeTab === 'declined' && 'Declined inquiries will appear here'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InquiriesList;