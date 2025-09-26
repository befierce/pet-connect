import React, { useState } from 'react';
import { Calendar, Clock, Video, Phone, MessageCircle, ExternalLink, User, Heart } from 'lucide-react';
import { BookingData } from '../../types/booking';
import { MessageModal } from './MessageModal';

interface ConfirmedSessionsProps {
  bookings: BookingData[];
}

export const ConfirmedSessions: React.FC<ConfirmedSessionsProps> = ({ bookings }) => {
  const [messageBookingId, setMessageBookingId] = useState<string | null>(null);

  const isToday = (dateString: string) => {
    const today = new Date();
    const sessionDate = new Date(dateString);
    return today.toDateString() === sessionDate.toDateString();
  };

  const isTomorrow = (dateString: string) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const sessionDate = new Date(dateString);
    return tomorrow.toDateString() === sessionDate.toDateString();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isToday(dateString)) return 'Today';
    if (isTomorrow(dateString)) return 'Tomorrow';
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const canJoinSession = (booking: BookingData) => {
    if (!booking.sessionDetails.scheduledDate) return false;
    const sessionDate = new Date(booking.sessionDetails.scheduledDate);
    const today = new Date();
    const diffInHours = (today.getTime() - sessionDate.getTime()) / (1000 * 60 * 60);
    return isToday(booking.sessionDetails.scheduledDate) && diffInHours >= -1 && diffInHours <= 1;
  };

  const getSessionIcon = (platform?: string) => {
    switch (platform) {
      case 'zoom':
      case 'meet':
        return <Video className="w-4 h-4" />;
      case 'phone':
        return <Phone className="w-4 h-4" />;
      default:
        return <Video className="w-4 h-4" />;
    }
  };

  const handleJoinSession = (booking: BookingData) => {
    if (booking.sessionDetails.meetingLink) {
      window.open(booking.sessionDetails.meetingLink, '_blank');
    }
  };

  // Sort bookings by date and time
  const sortedBookings = [...bookings].sort((a, b) => {
    if (!a.sessionDetails.scheduledDate || !b.sessionDetails.scheduledDate) return 0;
    const dateA = new Date(`${a.sessionDetails.scheduledDate}T${a.sessionDetails.scheduledTime || '00:00'}`);
    const dateB = new Date(`${b.sessionDetails.scheduledDate}T${b.sessionDetails.scheduledTime || '00:00'}`);
    return dateA.getTime() - dateB.getTime();
  });

  if (bookings.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No confirmed sessions</h3>
        <p className="text-gray-600">Your upcoming sessions will appear here</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {sortedBookings.map((booking) => {
          const unreadMessages = booking.communications.filter(msg => !msg.read).length;
          const canJoin = canJoinSession(booking);

          return (
            <div key={booking.id} className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow mx-1 sm:mx-0">
              <div className="p-4 sm:p-6">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center space-x-3 min-w-0 flex-1">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                    </div>
                    
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">{booking.clientInfo.name}</h3>
                        {isToday(booking.sessionDetails.scheduledDate || '') && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 flex-shrink-0">
                            Today
                          </span>
                        )}
                      </div>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-xs sm:text-sm text-gray-600 mt-1 gap-1 sm:gap-0">
                        <div className="flex items-center space-x-1">
                          <Heart className="w-4 h-4" />
                          <span className="truncate">{booking.petInfo.name} • {booking.petInfo.type}</span>
                        </div>
                        
                        {booking.petInfo.previousSessions > 0 && (
                          <span>{booking.petInfo.previousSessions} previous sessions</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-base sm:text-lg font-semibold text-gray-900">
                      ${booking.paymentInfo.amount}
                    </div>
                    <div className="text-xs sm:text-sm text-green-600 font-medium">Confirmed</div>
                  </div>
                </div>

                {/* Session Details */}
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <div>
                      <div className="text-xs sm:text-sm font-medium text-gray-700">Date</div>
                      <div className="text-xs sm:text-sm text-gray-900">
                        {booking.sessionDetails.scheduledDate ? formatDate(booking.sessionDetails.scheduledDate) : 'TBD'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <div>
                      <div className="text-xs sm:text-sm font-medium text-gray-700">Time</div>
                      <div className="text-xs sm:text-sm text-gray-900">
                        {booking.sessionDetails.scheduledTime ? formatTime(booking.sessionDetails.scheduledTime) : 'TBD'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {getSessionIcon(booking.sessionDetails.platform)}
                    <div>
                      <div className="text-xs sm:text-sm font-medium text-gray-700">Platform</div>
                      <div className="text-xs sm:text-sm text-gray-900 capitalize">
                        {booking.sessionDetails.platform || 'TBD'}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-xs sm:text-sm font-medium text-gray-700">Duration</div>
                    <div className="text-xs sm:text-sm text-gray-900">
                      {booking.sessionDetails.duration} minutes
                    </div>
                  </div>
                </div>

                {/* Service Type and Special Requests */}
                <div className="mt-4 space-y-3">
                  <div className="flex items-center space-x-4">
                    <div className="text-xs sm:text-sm font-medium text-gray-700">Service:</div>
                    <div className="text-xs sm:text-sm text-gray-900 capitalize">
                      {booking.sessionDetails.type.replace('-', ' ')} Session
                    </div>
                  </div>

                  {booking.sessionDetails.specialRequests && (
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="text-xs sm:text-sm font-medium text-blue-900 mb-1">Special Requests:</div>
                      <div className="text-xs sm:text-sm text-blue-800">{booking.sessionDetails.specialRequests}</div>
                    </div>
                  )}

                  {booking.notes.preSession && (
                    <div className="p-3 bg-yellow-50 rounded-lg">
                      <div className="text-xs sm:text-sm font-medium text-yellow-900 mb-1">Pre-Session Notes:</div>
                      <div className="text-xs sm:text-sm text-yellow-800">{booking.notes.preSession}</div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="mt-4 sm:mt-6 flex flex-wrap items-center gap-2 sm:gap-3">
                  {canJoin && booking.sessionDetails.meetingLink && (
                    <button
                      onClick={() => handleJoinSession(booking)}
                      className="inline-flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg text-xs sm:text-sm font-medium hover:bg-green-700 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span className="hidden sm:inline">Join Session</span>
                      <span className="sm:hidden">Join</span>
                    </button>
                  )}
                  
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
                  
                  <button className="inline-flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                    <Calendar className="w-4 h-4" />
                    <span className="hidden sm:inline">Reschedule</span>
                    <span className="sm:hidden">Reschedule</span>
                  </button>

                  {booking.sessionDetails.meetingLink && (
                    <a
                      href={booking.sessionDetails.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 text-blue-600 text-xs sm:text-sm font-medium hover:text-blue-800 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span className="hidden sm:inline">Meeting Link</span>
                      <span className="sm:hidden">Link</span>
                    </a>
                  )}
                </div>

                {/* Client Contact Info */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs sm:text-sm text-gray-600 gap-1 sm:gap-0">
                    <span className="truncate">Contact: {booking.clientInfo.email}</span>
                    <span className="truncate">{booking.clientInfo.phone}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {messageBookingId && (
        <MessageModal
          booking={bookings.find(b => b.id === messageBookingId)!}
          onClose={() => setMessageBookingId(null)}
        />
      )}
    </>
  );
};