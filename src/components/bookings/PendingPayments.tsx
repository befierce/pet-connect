import React, { useState } from 'react';
import { Clock, DollarSign, Eye, Check, X, MessageCircle, Calendar, User, Heart, AlertCircle } from 'lucide-react';
import { BookingData } from '../../types/booking';
import { PaymentReceiptModal } from './PaymentReceiptModal';
import { MessageModal } from './MessageModal';

interface PendingPaymentsProps {
  bookings: BookingData[];
}

export const PendingPayments: React.FC<PendingPaymentsProps> = ({ bookings }) => {
  const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null);
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

  const handleAcceptPayment = (bookingId: string) => {
    // In a real app, this would call an API
    console.log('Accepting payment for booking:', bookingId);
  };

  const handleDeclinePayment = (bookingId: string) => {
    // In a real app, this would call an API
    console.log('Declining payment for booking:', bookingId);
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  };

  const getUrgencyLevel = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const hours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (hours > 48) return 'high';
    if (hours > 24) return 'medium';
    return 'low';
  };

  if (bookings.length === 0) {
    return (
      <div className="text-center py-12">
        <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No pending payments</h3>
        <p className="text-gray-600">All payments have been processed</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {bookings.map((booking) => {
          const isExpanded = expandedCards.has(booking.id);
          const urgency = getUrgencyLevel(booking.createdAt);
          const unreadMessages = booking.communications.filter(msg => !msg.read).length;

          return (
            <div
              key={booking.id}
              className={`bg-white rounded-lg border shadow-sm transition-all duration-200 hover:shadow-md mx-1 sm:mx-0 ${
                urgency === 'high' ? 'border-red-200' : urgency === 'medium' ? 'border-yellow-200' : 'border-gray-200'
              }`}
            >
              {/* Urgency indicator */}
              {urgency !== 'low' && (
                <div className={`h-1 rounded-t-lg ${urgency === 'high' ? 'bg-red-500' : 'bg-yellow-500'}`} />
              )}

              <div className="p-4 sm:p-6">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center space-x-3 min-w-0 flex-1">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                    </div>
                    
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">{booking.clientInfo.name}</h3>
                        {urgency === 'high' && <AlertCircle className="w-4 h-4 text-red-500" />}
                      </div>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-xs sm:text-sm text-gray-600 mt-1 gap-1 sm:gap-0">
                        <div className="flex items-center space-x-1">
                          <Heart className="w-4 h-4" />
                          <span className="truncate">{booking.petInfo.name} • {booking.petInfo.type}</span>
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{getTimeAgo(booking.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {unreadMessages > 0 && (
                      <div className="w-2 h-2 bg-red-500 rounded-full" />
                    )}
                    
                    <div className="text-right">
                      <div className="text-base sm:text-lg font-semibold text-gray-900">
                        ${booking.paymentInfo.amount}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-500 capitalize">
                        {booking.paymentInfo.method.replace('-', ' ')}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Session Details */}
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="text-xs sm:text-sm font-medium text-gray-700">Service Type</div>
                    <div className="text-xs sm:text-sm text-gray-900 capitalize">
                      {booking.sessionDetails.type} ({booking.sessionDetails.duration} min)
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-xs sm:text-sm font-medium text-gray-700">Pet Details</div>
                    <div className="text-xs sm:text-sm text-gray-900">
                      {booking.petInfo.breed && `${booking.petInfo.breed} • `}
                      {booking.petInfo.age} years old
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-xs sm:text-sm font-medium text-gray-700">Previous Sessions</div>
                    <div className="text-xs sm:text-sm text-gray-900">
                      {booking.petInfo.previousSessions} sessions
                    </div>
                  </div>
                </div>

                {/* Special Requests */}
                {booking.sessionDetails.specialRequests && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <div className="text-xs sm:text-sm font-medium text-blue-900 mb-1">Special Requests:</div>
                    <div className="text-xs sm:text-sm text-blue-800">{booking.sessionDetails.specialRequests}</div>
                  </div>
                )}

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="mt-4 space-y-4">
                    <div className="border-t border-gray-200 pt-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <div className="text-xs sm:text-sm font-medium text-gray-700 mb-2">Client Information</div>
                          <div className="space-y-1 text-xs sm:text-sm text-gray-600">
                            <div>Email: {booking.clientInfo.email}</div>
                            <div>Phone: {booking.clientInfo.phone}</div>
                            <div>Timezone: {booking.clientInfo.timezone}</div>
                            <div>Client since: {new Date(booking.clientInfo.joinedDate).toLocaleDateString()}</div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="text-xs sm:text-sm font-medium text-gray-700 mb-2">Payment Information</div>
                          <div className="space-y-1 text-xs sm:text-sm text-gray-600">
                            <div>Amount: ${booking.paymentInfo.amount} {booking.paymentInfo.currency}</div>
                            <div>Method: {booking.paymentInfo.method.replace('-', ' ')}</div>
                            {booking.paymentInfo.transactionId && (
                              <div>Transaction ID: {booking.paymentInfo.transactionId}</div>
                            )}
                          </div>
                        </div>
                      </div>

                      {booking.petInfo.specialNeeds && (
                        <div className="mt-4">
                          <div className="text-xs sm:text-sm font-medium text-gray-700 mb-1">Special Needs:</div>
                          <div className="text-xs sm:text-sm text-gray-600">{booking.petInfo.specialNeeds}</div>
                        </div>
                      )}
                    </div>

                    {/* Recent Messages Preview */}
                    {booking.communications.length > 0 && (
                      <div className="border-t border-gray-200 pt-4">
                        <div className="text-xs sm:text-sm font-medium text-gray-700 mb-2">Recent Messages</div>
                        <div className="space-y-2">
                          {booking.communications.slice(-2).map((message) => (
                            <div key={message.id} className="bg-gray-50 p-3 rounded">
                              <div className="flex justify-between items-start mb-1">
                                <span className="text-xs sm:text-sm font-medium text-gray-900">{message.senderName}</span>
                                <span className="text-xs text-gray-500">
                                  {new Date(message.timestamp).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-xs sm:text-sm text-gray-600">{message.content}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="mt-4 sm:mt-6 flex flex-wrap items-center gap-2 sm:gap-3">
                  {booking.paymentInfo.proofImage && (
                    <button
                      onClick={() => setSelectedReceipt(booking.paymentInfo.proofImage!)}
                      className="inline-flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      <span className="hidden sm:inline">View Receipt</span>
                      <span className="sm:hidden">Receipt</span>
                    </button>
                  )}
                  
                  <button
                    onClick={() => handleAcceptPayment(booking.id)}
                    className="inline-flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg text-xs sm:text-sm font-medium hover:bg-green-700 transition-colors"
                  >
                    <Check className="w-4 h-4" />
                    <span className="hidden sm:inline">Accept Payment</span>
                    <span className="sm:hidden">Accept</span>
                  </button>
                  
                  <button
                    onClick={() => handleDeclinePayment(booking.id)}
                    className="inline-flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 border border-red-300 text-red-700 rounded-lg text-xs sm:text-sm font-medium hover:bg-red-50 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    <span className="hidden sm:inline">Decline</span>
                    <span className="sm:hidden">Decline</span>
                  </button>
                  
                  <button
                    onClick={() => setMessageBookingId(booking.id)}
                    className="inline-flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span className="hidden sm:inline">Message Client</span>
                    <span className="sm:hidden">Message</span>
                    {unreadMessages > 0 && (
                      <span className="ml-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                        {unreadMessages}
                      </span>
                    )}
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
      {selectedReceipt && (
        <PaymentReceiptModal
          imageUrl={selectedReceipt}
          onClose={() => setSelectedReceipt(null)}
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