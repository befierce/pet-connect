import React, { useState } from 'react';
import { Sparkles, DollarSign, Clock } from 'lucide-react';
import { useOnboarding } from '../../../contexts/OnboardingContext';

const FirstServiceStep: React.FC = () => {
  const { data, updateData } = useOnboarding();
  const [service, setService] = useState(data.firstService || {
    id: '',
    title: '',
    duration: 60,
    price: 0,
    description: '',
  });

  const handleServiceChange = (field: string, value: any) => {
    const updatedService = { ...service, [field]: value };
    setService(updatedService);
    updateData({ firstService: updatedService });
  };

  const serviceTemplates = [
    {
      title: 'Animal Communication Session',
      duration: 60,
      price: 120,
      description: 'Connect with your pet to understand their thoughts, feelings, and needs through telepathic communication.',
    },
    {
      title: 'Pet Behavioral Consultation',
      duration: 45,
      price: 100,
      description: 'Address behavioral issues by understanding your pet\'s perspective and providing guidance for positive change.',
    },
    {
      title: 'Energy Healing Session',
      duration: 90,
      price: 150,
      description: 'Provide healing energy work to support your pet\'s physical, emotional, and spiritual wellbeing.',
    },
    {
      title: 'Pet Trauma Healing',
      duration: 75,
      price: 140,
      description: 'Help your pet heal from past trauma through gentle communication and energy healing techniques.',
    },
  ];

  const handleTemplateSelect = (template: typeof serviceTemplates[0]) => {
    const newService = {
      id: Date.now().toString(),
      ...template,
    };
    setService(newService);
    updateData({ firstService: newService });
  };

  const durationOptions = [30, 45, 60, 75, 90, 120];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full flex items-center justify-center">
          <Sparkles className="w-8 h-8 text-yellow-600" />
        </div>
        <p className="text-gray-600 text-sm">
          Create your signature service offering
        </p>
      </div>

      {/* Quick Templates */}
      <div>
        <h3 className="text-sm font-semibold text-gray-800 mb-3">
          Quick Start Templates (tap to use):
        </h3>
        <div className="space-y-2">
          {serviceTemplates.map((template, index) => (
            <button
              key={index}
              onClick={() => handleTemplateSelect(template)}
              className="w-full p-3 bg-white border border-gray-200 rounded-xl text-left hover:border-purple-300 hover:bg-purple-50 transition-all duration-200"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800 text-sm">{template.title}</h4>
                  <p className="text-xs text-gray-600 mt-1 line-clamp-2">{template.description}</p>
                </div>
                <div className="text-right ml-3">
                  <div className="text-sm font-semibold text-gray-800">${template.price}</div>
                  <div className="text-xs text-gray-500">{template.duration} min</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Service Form */}
      <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/50">
        <h3 className="text-sm font-semibold text-gray-800 mb-4">
          Or create your own:
        </h3>
        
        <div className="space-y-4">
          {/* Service Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Service Name *
            </label>
            <input
              type="text"
              value={service.title}
              onChange={(e) => handleServiceChange('title', e.target.value)}
              className="w-full px-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-base"
              placeholder="e.g., Animal Communication Session"
              required
            />
          </div>

          {/* Duration and Price */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration *
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select
                  value={service.duration}
                  onChange={(e) => handleServiceChange('duration', parseInt(e.target.value))}
                  className="w-full pl-9 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-base appearance-none"
                >
                  {durationOptions.map(duration => (
                    <option key={duration} value={duration}>
                      {duration} min
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price *
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="number"
                  value={service.price}
                  onChange={(e) => handleServiceChange('price', parseInt(e.target.value) || 0)}
                  className="w-full pl-9 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-base"
                  placeholder="120"
                  min="1"
                  required
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              value={service.description}
              onChange={(e) => handleServiceChange('description', e.target.value)}
              rows={3}
              className="w-full px-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white resize-none text-base"
              placeholder="Describe what clients can expect from this service..."
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              {service.description.length}/200 characters
            </p>
          </div>
        </div>
      </div>

      {/* Service Preview */}
      {service.title && service.price > 0 && (
        <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-xl p-4 border border-green-100">
          <h4 className="font-semibold text-green-900 mb-2">Service Preview:</h4>
          <div className="bg-white rounded-lg p-3">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h5 className="font-semibold text-gray-800">{service.title}</h5>
                <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                  <span>{service.duration} minutes</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-gray-800">${service.price}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Encouragement */}
      <div className="bg-yellow-50 rounded-xl p-4">
        <div className="flex items-start space-x-3">
          <Sparkles className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-yellow-900 text-sm">Your First Service</h4>
            <p className="text-yellow-800 text-sm mt-1">
              Don't worry about making it perfect! You can always add more services and update details later. The important thing is to get started.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FirstServiceStep;