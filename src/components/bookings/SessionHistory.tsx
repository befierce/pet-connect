import React, { useState } from 'react';
import { Star, MessageCircle, Edit, Calendar, FileText, Download, User, Heart, CheckCircle, XCircle, Clock } from 'lucide-react';
import { BookingData } from '../../types/booking';
import { SessionNotesModal } from './SessionNotesModal';
import { MessageModal } from './MessageModal';

interface SessionHistoryProps {
  bookings: BookingData[];
}

export const SessionHistory: React.FC<SessionHistoryProps> = ({ bookings }) => {
  const [selectedBooking, setSelectedBooking] = useState<BookingData | null>(null);
  const [messageBookingId, setMessageBookingId] = useState<string | null>(null);
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  const toggleCardExpansion = (bookingId: string) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(bookingId)) {
      newExpanded.delete(bookingId);
    } else {
      newExpanded.add(bookingId);
    }
    setExpandedCards(newExpanded);
  };

  const renderStarRating = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-2 text-sm text-gray-600">
          {rating > 0 ? `(${rating}/5)` : 'Not rated'}
        </span>
      </div>
    );
  };

  const getStatusIcon = (status: BookingData['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'no-show':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: BookingData['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'no-show':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const exportSessionData = (booking: BookingData) => {
    const sessionData = {
      'Session ID': booking.id,
      'Client': booking.clientInfo.name,
      'Pet': booking.petInfo.name,
      'Service Type': booking.sessionDetails.type,
      'Date': formatDate(booking.createdAt),
      'Duration': `${booking.sessionDetails.duration} minutes`,
      'Amount': `$${booking.paymentInfo.amount}`,
      'Rating': booking.notes.rating > 0 ? `${booking.notes.rating}/5` : 'Not rated',
      'Status': booking.status,
      'Session Summary': booking.notes.sessionSummary,
      'Insights': booking.notes.insights,
      'Recommendations': booking.notes.recommendations,
    };

    const csv = Object.entries(sessionData)
      .map(([key, value]) => `"${key}","${value}"`)
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `session-${booking.id}-${booking.petInfo.name.toLowerCase()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Sort bookings by completion date (most recent first)
  const sortedBookings = [...bookings].sort((a, b) => {
    const dateA = new Date(a.notes.completedAt || a.updatedAt);
    const dateB = new Date(b.notes.completedAt || b.updatedAt);
    return dateB.getTime() - dateA.getTime();
  });

  if (bookings.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No session history</h3>
        <p className="text-gray-600">Completed sessions will appear here</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {sortedBookings.map((booking) => {
          const isExpanded = expandedCards.has(booking.id);
          const hasDetailedNotes = booking.notes.sessionSummary || booking.notes.insights || booking.notes.recommendations;

          return (
            <div key={booking.id} className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow mx-1 sm:mx-0">
              <div className="p-4 sm:p-6">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center space-x-3 min-w-0 flex-1">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                    </div>
                    
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">{booking.clientInfo.name}</h3>
                        {getStatusIcon(booking.status)}
                      </div>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-xs sm:text-sm text-gray-600 mt-1 gap-1 sm:gap-0">
                        <div className="flex items-center space-x-1">
                          <Heart className="w-4 h-4" />
                          <span className="truncate">{booking.petInfo.name} • {booking.petInfo.type}</span>
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(booking.notes.completedAt || booking.updatedAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-base sm:text-lg font-semibold text-gray-900">
                        ${booking.paymentInfo.amount}
                      </div>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}>
                        {booking.status.replace('-', ' ')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Session Details */}
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="text-xs sm:text-sm font-medium text-gray-700">Service Type</div>
                    <div className="text-xs sm:text-sm text-gray-900 capitalize">
                      {booking.sessionDetails.type} ({booking.sessionDetails.duration} min)
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-xs sm:text-sm font-medium text-gray-700">Session Rating</div>
                    <div className="mt-1">
                      {renderStarRating(booking.notes.rating)}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-xs sm:text-sm font-medium text-gray-700">Follow-up</div>
                    <div className="text-xs sm:text-sm text-gray-900">
                      {booking.notes.followUpNeeded ? (
                        <span className="text-amber-600 font-medium">Required</span>
                      ) : (
                        <span className="text-gray-500">None</span>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-xs sm:text-sm font-medium text-gray-700">Pet Age</div>
                    <div className="text-xs sm:text-sm text-gray-900">
                      {booking.petInfo.age ? `${booking.petInfo.age} years` : 'Unknown'}
                    </div>
                  </div>
                </div>

                {/* Session Notes Preview */}
                {hasDetailedNotes && !isExpanded && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <div className="text-xs sm:text-sm font-medium text-blue-900 mb-1">Session Summary:</div>
                    <div className="text-xs sm:text-sm text-blue-800 line-clamp-3">
                      {booking.notes.sessionSummary || 'No summary available'}
                    </div>
                  </div>
                )}

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="mt-4 space-y-4">
                    {/* Full Notes */}
                    {booking.notes.sessionSummary && (
                      <div className="border-t border-gray-200 pt-4">
                        <div className="text-xs sm:text-sm font-medium text-gray-700 mb-2">Session Summary</div>
                        <div className="text-xs sm:text-sm text-gray-600 bg-gray-50 p-3 rounded">
                          {booking.notes.sessionSummary}
                        </div>
                      </div>
                    )}

                    {booking.notes.insights && (
                      <div>
                        <div className="text-xs sm:text-sm font-medium text-gray-700 mb-2">Key Insights</div>
                        <div className="text-xs sm:text-sm text-gray-600 bg-blue-50 p-3 rounded">
                          {booking.notes.insights}
                        </div>
                      </div>
                    )}

                    {booking.notes.recommendations && (
                      <div>
                        <div className="text-xs sm:text-sm font-medium text-gray-700 mb-2">Recommendations</div>
                        <div className="text-xs sm:text-sm text-gray-600 bg-green-50 p-3 rounded">
                          {booking.notes.recommendations}
                        </div>
                      </div>
                    )}

                    {booking.notes.nextSteps.length > 0 && (
                      <div>
                        <div className="text-xs sm:text-sm font-medium text-gray-700 mb-2">Next Steps</div>
                        <ul className="text-xs sm:text-sm text-gray-600 space-y-1">
                          {booking.notes.nextSteps.map((step, index) => (
                            <li key={index} className="flex items-start space-x-2">
                              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>{step}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Client Information */}
                    <div className="border-t border-gray-200 pt-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <div className="text-xs sm:text-sm font-medium text-gray-700 mb-2">Client Details</div>
                          <div className="space-y-1 text-xs sm:text-sm text-gray-600">
                            <div>Email: {booking.clientInfo.email}</div>
                            <div>Phone: {booking.clientInfo.phone}</div>
                            <div>Total sessions: {booking.petInfo.previousSessions + 1}</div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="text-xs sm:text-sm font-medium text-gray-700 mb-2">Pet Information</div>
                          <div className="space-y-1 text-xs sm:text-sm text-gray-600">
                            <div>Type: {booking.petInfo.type}</div>
                            {booking.petInfo.breed && <div>Breed: {booking.petInfo.breed}</div>}
                            {booking.petInfo.specialNeeds && <div>Special needs: {booking.petInfo.specialNeeds}</div>}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="mt-4 sm:mt-6 flex flex-wrap items-center gap-2 sm:gap-3">
                  <button
                    onClick={() => setSelectedBooking(booking)}
                    className="inline-flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg text-xs sm:text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    <span className="hidden sm:inline">Edit Notes</span>
                    <span className="sm:hidden">Edit</span>
                  </button>
                  
                  <button
                    onClick={() => setMessageBookingId(booking.id)}
                    className="inline-flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span className="hidden sm:inline">View Messages</span>
                    <span className="sm:hidden">Messages</span>
                  </button>
                  
                  <button
                    onClick={() => exportSessionData(booking)}
                    className="inline-flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span className="hidden sm:inline">Export</span>
                    <span className="sm:hidden">Export</span>
                  </button>
                  
                  <button
                    onClick={() => toggleCardExpansion(booking.id)}
                    className="inline-flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 text-blue-600 text-xs sm:text-sm font-medium hover:text-blue-800 transition-colors"
                  >
                    {isExpanded ? 'Show Less' : 'Show More'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modals */}
      {selectedBooking && (
        <SessionNotesModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onSave={(updatedNotes) => {
            // In a real app, this would update the backend
            console.log('Updated notes:', updatedNotes);
            setSelectedBooking(null);
          }}
        />
      )}

      {messageBookingId && (
        <MessageModal
          booking={bookings.find(b => b.id === messageBookingId)!}
          onClose={() => setMessageBookingId(null)}
        />
      )}
    </>
  );
};