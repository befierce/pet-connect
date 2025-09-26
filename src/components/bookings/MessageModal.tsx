import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Paperclip, Clock } from 'lucide-react';
import { BookingData, Message } from '../../types/booking';

interface MessageModalProps {
  booking: BookingData;
  onClose: () => void;
}

const MESSAGE_TEMPLATES = [
  "Thank you for your booking! I'm looking forward to connecting with [pet name].",
  "I've reviewed your payment and everything looks good. Your session is confirmed!",
  "Could you please provide more details about [pet name]'s recent behavior?",
  "Your session has been completed. I'll send over the detailed notes shortly.",
  "Thank you for choosing our services. Please don't hesitate to reach out with any questions.",
];

export const MessageModal: React.FC<MessageModalProps> = ({ booking, onClose }) => {
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>(booking.communications);
  const [showTemplates, setShowTemplates] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: `msg-${Date.now()}`,
      senderId: 'practitioner',
      senderName: 'You',
      content: newMessage.trim(),
      timestamp: new Date().toISOString(),
      read: true,
      attachments: [],
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
    setShowTemplates(false);

    // Focus back to textarea
    textareaRef.current?.focus();
  };

  const handleTemplateSelect = (template: string) => {
    const personalizedTemplate = template.replace('[pet name]', booking.petInfo.name);
    setNewMessage(personalizedTemplate);
    setShowTemplates(false);
    textareaRef.current?.focus();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true });
    }
  };

  const isOwnMessage = (message: Message) => message.senderId === 'practitioner';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] sm:max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">
              Messages with {booking.clientInfo.name}
            </h2>
            <p className="text-xs sm:text-sm text-gray-600">
              Regarding {booking.petInfo.name}'s {booking.sessionDetails.type} session
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-6 sm:py-8">
              <div className="text-gray-400 mb-2">No messages yet</div>
              <p className="text-xs sm:text-sm text-gray-600">Start a conversation with {booking.clientInfo.name}</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${isOwnMessage(message) ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    isOwnMessage(message)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-xs sm:text-sm">{message.content}</p>
                  <div className={`flex items-center justify-end mt-1 text-xs ${
                    isOwnMessage(message) ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    <Clock className="w-3 h-3 mr-1" />
                    {formatTimestamp(message.timestamp)}
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Templates */}
        {showTemplates && (
          <div className="border-t border-gray-200 p-3 sm:p-4 bg-gray-50 max-h-48 overflow-y-auto">
            <div className="text-xs sm:text-sm font-medium text-gray-700 mb-2">Quick Templates:</div>
            <div className="space-y-2">
              {MESSAGE_TEMPLATES.map((template, index) => (
                <button
                  key={index}
                  onClick={() => handleTemplateSelect(template)}
                  className="block w-full text-left p-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-100 rounded border"
                >
                  {template.replace('[pet name]', booking.petInfo.name)}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Message Input */}
        <div className="border-t border-gray-200 p-3 sm:p-4">
          <div className="flex items-end space-x-2">
            <button
              onClick={() => setShowTemplates(!showTemplates)}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded flex-shrink-0"
              title="Message templates"
            >
              <Paperclip className="w-4 h-4" />
            </button>
            
            <div className="flex-1">
              <textarea
                ref={textareaRef}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`Message ${booking.clientInfo.name}...`}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-base sm:text-sm"
                rows={2}
              />
            </div>
            
            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};