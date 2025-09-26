import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, X, MessageCircle, Clock, Mail, Phone } from 'lucide-react';

const InquiryDetails: React.FC = () => {
  const { inquiryId } = useParams();
  const navigate = useNavigate();

  // Mock data - in real app, this would be fetched based on inquiryId
  const inquiry = {
    id: inquiryId,
    clientName: 'Maria Santos',
    petName: 'Luna',
    petType: 'Rescue Cat',
    serviceType: 'Pet Trauma Healing',
    preferredTime: 'Weekend mornings',
    contact: 'maria.santos@email.com',
    message: 'I recently adopted Luna from a shelter and she\'s been hiding under the bed for weeks. The shelter mentioned she had a rough past but didn\'t give many details. I want to help her feel safe and understand her past trauma so I can provide the best care possible. She only comes out at night to eat and use the litter box. I\'m worried she\'s not bonding with me and might be suffering in silence.',
    timestamp: '5 hours ago',
    status: 'new',
    urgent: true,
  };

  const handleAccept = () => {
    // In real app, this would call API to accept inquiry
    console.log('Accepting inquiry:', inquiryId);
    navigate(`/inquiries/${inquiryId}/chat`);
  };

  const handleDecline = () => {
    // In real app, this would call API to decline inquiry
    console.log('Declining inquiry:', inquiryId);
    navigate('/inquiries');
  };

  return (
    <div className="p-4">
      {/* Status Badge */}
      <div className="mb-4">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800 border border-orange-200">
          Pending Review
        </span>
      </div>

      {/* Client & Pet Info */}
      <div className="bg-white rounded-xl p-4 border border-gray-200 mb-4">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
            <span className="text-purple-primary font-bold text-xl">
              {inquiry.clientName.charAt(0)}
            </span>
          </div>
          
          <div>
            <h2 className="text-xl font-bold text-gray-800">{inquiry.clientName}</h2>
            <p className="text-gray-600">{inquiry.petName} • {inquiry.petType}</p>
            <div className="flex items-center space-x-1 text-gray-500 text-sm mt-1">
              <Clock className="w-4 h-4" />
              <span>{inquiry.timestamp}</span>
            </div>
          </div>
        </div>

        {/* Service Details */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-800 mb-3">New Inquiry Details</h3>
          
          <div className="grid grid-cols-1 gap-3">
            <div>
              <span className="text-sm text-gray-600">Preferred Service</span>
              <p className="font-medium text-gray-800">{inquiry.serviceType}</p>
            </div>
            
            <div>
              <span className="text-sm text-gray-600">Preferred Time</span>
              <p className="font-medium text-gray-800">{inquiry.preferredTime}</p>
            </div>
            
            <div>
              <span className="text-sm text-gray-600">Contact</span>
              <p className="font-medium text-gray-800">{inquiry.contact}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Message */}
      <div className="bg-white rounded-xl p-4 border border-gray-200 mb-6">
        <h3 className="font-semibold text-gray-800 mb-3">Message from {inquiry.clientName}</h3>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-gray-700 leading-relaxed">{inquiry.message}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          onClick={handleAccept}
          className="w-full flex items-center justify-center space-x-2 py-4 bg-purple-primary text-white rounded-xl font-semibold hover:bg-purple-dark transition-colors"
        >
          <CheckCircle className="w-5 h-5" />
          <span>Accept Inquiry</span>
        </button>
        
        <button
          onClick={handleDecline}
          className="w-full flex items-center justify-center space-x-2 py-4 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
        >
          <X className="w-5 h-5" />
          <span>Decline</span>
        </button>
      </div>

      {/* Help Text */}
      <div className="mt-6 bg-blue-50 rounded-xl p-4">
        <h4 className="font-semibold text-blue-900 mb-2">What happens next?</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Accepting opens a chat with {inquiry.clientName}</li>
          <li>• You can discuss details and coordinate payment</li>
          <li>• Schedule the session once payment is confirmed</li>
        </ul>
      </div>
    </div>
  );
};

export default InquiryDetails;