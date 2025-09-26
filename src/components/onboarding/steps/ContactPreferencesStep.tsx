import React, { useState } from 'react';
import { Mail, Phone, MessageCircle, Video, MapPin, Check } from 'lucide-react';
import { useOnboarding } from '../../../contexts/OnboardingContext';

const ContactPreferencesStep: React.FC = () => {
  const { data, updateData } = useOnboarding();
  const [contactMethods, setContactMethods] = useState(data.contactMethods || {
    email: false,
    phone: false,
    whatsapp: false,
    video: false,
    inPerson: false,
  });
  const [phoneNumber, setPhoneNumber] = useState(data.phoneNumber || '');

  const handleContactMethodToggle = (method: keyof typeof contactMethods) => {
    const updatedMethods = {
      ...contactMethods,
      [method]: !contactMethods[method],
    };
    setContactMethods(updatedMethods);
    updateData({ contactMethods: updatedMethods });
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPhoneNumber = e.target.value;
    setPhoneNumber(newPhoneNumber);
    updateData({ phoneNumber: newPhoneNumber });
  };

  const contactOptions = [
    {
      id: 'email',
      title: 'Email',
      description: 'Receive inquiries and communicate via email',
      icon: Mail,
      color: 'blue',
      recommended: true,
    },
    {
      id: 'phone',
      title: 'Phone Calls',
      description: 'Direct phone calls for consultations',
      icon: Phone,
      color: 'green',
    },
    {
      id: 'whatsapp',
      title: 'WhatsApp',
      description: 'Quick messaging and voice notes',
      icon: MessageCircle,
      color: 'green',
    },
    {
      id: 'video',
      title: 'Video Calls',
      description: 'Zoom, Google Meet, or FaceTime sessions',
      icon: Video,
      color: 'purple',
      popular: true,
    },
    {
      id: 'inPerson',
      title: 'In-Person',
      description: 'Meet clients and pets in person',
      icon: MapPin,
      color: 'orange',
    },
  ];

  const getColorClasses = (color: string, isSelected: boolean) => {
    const colors = {
      blue: isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white hover:border-blue-300',
      green: isSelected ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-white hover:border-green-300',
      purple: isSelected ? 'border-purple-500 bg-purple-50' : 'border-gray-200 bg-white hover:border-purple-300',
      orange: isSelected ? 'border-orange-500 bg-orange-50' : 'border-gray-200 bg-white hover:border-orange-300',
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getIconColorClasses = (color: string) => {
    const colors = {
      blue: 'text-blue-600',
      green: 'text-green-600',
      purple: 'text-purple-600',
      orange: 'text-orange-600',
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const selectedCount = Object.values(contactMethods).filter(Boolean).length;
  const hasPhoneOrWhatsApp = contactMethods.phone || contactMethods.whatsapp;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-100 to-teal-100 rounded-full flex items-center justify-center">
          <MessageCircle className="w-8 h-8 text-green-600" />
        </div>
        <p className="text-gray-600 text-sm">
          Choose at least one way for pet families to reach you
        </p>
      </div>

      {/* Contact Methods */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          How can clients contact you? *
        </h3>
        
        {contactOptions.map((option) => {
          const Icon = option.icon;
          const isSelected = contactMethods[option.id as keyof typeof contactMethods];
          
          return (
            <button
              key={option.id}
              onClick={() => handleContactMethodToggle(option.id as keyof typeof contactMethods)}
              className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left ${getColorClasses(option.color, isSelected)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-white shadow-sm`}>
                    <Icon className={`w-5 h-5 ${getIconColorClasses(option.color)}`} />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-semibold text-gray-800">{option.title}</h4>
                      {option.recommended && (
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                          Recommended
                        </span>
                      )}
                      {option.popular && (
                        <span className="px-2 py-0.5 bg-purple-100 text-purple-800 text-xs rounded-full font-medium">
                          Popular
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                  </div>
                </div>
                
                {isSelected && (
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Phone Number Input */}
      {hasPhoneOrWhatsApp && (
        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/50">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number {hasPhoneOrWhatsApp ? '*' : '(Optional)'}
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="tel"
              value={phoneNumber}
              onChange={handlePhoneNumberChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-base"
              placeholder="+1 (555) 123-4567"
              required={hasPhoneOrWhatsApp}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Required for phone calls and WhatsApp communication
          </p>
        </div>
      )}

      {/* Selection Summary */}
      {selectedCount > 0 && (
        <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-xl p-4 border border-green-100">
          <h4 className="font-semibold text-green-900 mb-2">
            Great! You've selected {selectedCount} contact method{selectedCount > 1 ? 's' : ''}:
          </h4>
          <div className="flex flex-wrap gap-2">
            {Object.entries(contactMethods)
              .filter(([_, selected]) => selected)
              .map(([method, _]) => {
                const option = contactOptions.find(opt => opt.id === method);
                return (
                  <span
                    key={method}
                    className="px-3 py-1 bg-white rounded-full text-sm font-medium text-green-800 border border-green-200"
                  >
                    {option?.title}
                  </span>
                );
              })}
          </div>
        </div>
      )}

      {/* Completion Message */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
        <div className="text-center">
          <h4 className="font-semibold text-purple-900 mb-1">
            🎉 Almost Ready!
          </h4>
          <p className="text-sm text-purple-800">
            You're about to join our community of pet communicators. Pet families are waiting to connect with you!
          </p>
        </div>
      </div>

      {/* Privacy Note */}
      <div className="bg-blue-50 rounded-xl p-4">
        <div className="flex items-start space-x-3">
          <MessageCircle className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-900 text-sm">Your Privacy Matters</h4>
            <p className="text-blue-800 text-sm mt-1">
              Your contact information is only shared with clients after you accept their inquiry. You're always in control.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPreferencesStep;