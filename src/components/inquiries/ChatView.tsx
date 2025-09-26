import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Send, Paperclip, Image, DollarSign } from 'lucide-react';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  type: 'text' | 'system' | 'payment' | 'image';
  metadata?: any;
}

const ChatView: React.FC = () => {
  const { inquiryId } = useParams();
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      senderId: 'client',
      senderName: 'Maria Santos',
      content: 'I recently adopted Luna from a shelter and she\'s been hiding under the bed for weeks. The shelter mentioned she had a rough past but didn\'t give many details. I want to help her feel safe and understand her past trauma so I can provide the best care possible. She only comes out at night to eat and use the litter box. I\'m worried she\'s not bonding with me and might be suffering in silence.',
      timestamp: '2024-01-15T10:30:00Z',
      type: 'text',
    },
    {
      id: '2',
      senderId: 'system',
      senderName: 'System',
      content: 'Inquiry accepted! You can now chat with Maria Santos about Luna.',
      timestamp: '2024-01-15T13:44:00Z',
      type: 'system',
    },
  ]);
  
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
      id: Date.now().toString(),
      senderId: 'practitioner',
      senderName: 'You',
      content: newMessage.trim(),
      timestamp: new Date().toISOString(),
      type: 'text',
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
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

  const quickReplies = [
    "Thank you for reaching out about Luna. I'd love to help her heal.",
    "I specialize in trauma healing for rescue animals. When would work best for you?",
    "Could you tell me more about Luna's current behavior patterns?",
    "I'll need payment confirmation before we schedule the session.",
  ];

  return (
    <div className="flex flex-col h-screen bg-cream">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => {
          if (message.type === 'system') {
            return (
              <div key={message.id} className="flex justify-center">
                <div className="bg-green-100 text-green-800 px-4 py-2 rounded-xl text-sm max-w-xs text-center">
                  {message.content}
                  <div className="text-xs text-green-600 mt-1">
                    {formatTimestamp(message.timestamp)}
                  </div>
                </div>
              </div>
            );
          }

          return (
            <div
              key={message.id}
              className={`flex ${isOwnMessage(message) ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                  isOwnMessage(message)
                    ? 'bg-purple-primary text-white'
                    : 'bg-white text-gray-900 border border-gray-200'
                }`}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>
                <div className={`text-xs mt-2 ${
                  isOwnMessage(message) ? 'text-purple-100' : 'text-gray-500'
                }`}>
                  {formatTimestamp(message.timestamp)}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Replies */}
      <div className="px-4 py-2 bg-white border-t border-gray-200">
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {quickReplies.map((reply, index) => (
            <button
              key={index}
              onClick={() => setNewMessage(reply)}
              className="flex-shrink-0 px-3 py-2 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
            >
              {reply}
            </button>
          ))}
        </div>
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex items-end space-x-3">
          {/* Attachment Button */}
          <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
            <Paperclip className="w-5 h-5" />
          </button>

          {/* Payment Button */}
          <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
            <DollarSign className="w-5 h-5" />
          </button>

          {/* Text Input */}
          <div className="flex-1">
            <textarea
              ref={textareaRef}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-primary focus:border-transparent resize-none max-h-32"
              rows={1}
            />
          </div>

          {/* Send Button */}
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="p-3 bg-purple-primary text-white rounded-full hover:bg-purple-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatView;