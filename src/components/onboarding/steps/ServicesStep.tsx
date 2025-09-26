import React, { useState } from 'react';
import { Plus, Trash2, Heart, Brain, Sparkles, MessageCircle } from 'lucide-react';
import { useOnboarding } from '../../../contexts/OnboardingContext';

interface Service {
  id: string;
  title: string;
  duration: number;
  price: number;
  description: string;
}

const ServicesStep: React.FC = () => {
  const { data, updateData } = useOnboarding();
  const [services, setServices] = useState<Service[]>(data.services || []);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newService, setNewService] = useState({
    title: '',
    duration: 60,
    price: 0,
    description: '',
  });

  const serviceTemplates = [
    {
      icon: MessageCircle,
      title: 'Animal Communication Session',
      duration: 60,
      price: 120,
      description: 'Connect with your pet to understand their thoughts, feelings, and needs.',
    },
    {
      icon: Heart,
      title: 'Pet Trauma Healing',
      duration: 90,
      price: 150,
      description: 'Help your pet heal from past trauma through energy work and communication.',
    },
    {
      icon: Brain,
      title: 'Behavioral Consultation',
      duration: 45,
      price: 100,
      description: 'Address behavioral issues by understanding your pet\'s perspective.',
    },
    {
      icon: Sparkles,
      title: 'End-of-Life Support',
      duration: 60,
      price: 130,
      description: 'Provide comfort and communication during your pet\'s transition.',
    },
  ];

  const addService = (service: Omit<Service, 'id'>) => {
    const newServiceWithId = {
      ...service,
      id: Date.now().toString(),
    };
    const updatedServices = [...services, newServiceWithId];
    setServices(updatedServices);
    updateData({ services: updatedServices });
    setShowAddForm(false);
    setNewService({ title: '', duration: 60, price: 0, description: '' });
  };

  const removeService = (id: string) => {
    const updatedServices = services.filter(s => s.id !== id);
    setServices(updatedServices);
    updateData({ services: updatedServices });
  };

  const addFromTemplate = (template: typeof serviceTemplates[0]) => {
    addService({
      title: template.title,
      duration: template.duration,
      price: template.price,
      description: template.description,
    });
  };

  const handleAddCustomService = () => {
    if (newService.title && newService.price > 0) {
      addService(newService);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 font-poppins">
          Your Services
        </h2>
        <p className="text-gray-600">
          Add the services you offer to help pet families
        </p>
      </div>

      {/* Current Services */}
      {services.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-800">Your Services</h3>
          {services.map((service) => (
            <div key={service.id} className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800">{service.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                    <span>{service.duration} minutes</span>
                    <span>${service.price}</span>
                  </div>
                </div>
                <button
                  onClick={() => removeService(service.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {services.length === 0 && (
        <div className="text-center py-8 bg-gray-50 rounded-xl">
          <Heart className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-800 mb-1">No services added yet</h3>
          <p className="text-gray-600 text-sm">Add your first service to get started</p>
        </div>
      )}

      {/* Service Templates */}
      {!showAddForm && (
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-800">Quick Add Templates</h3>
          <div className="grid gap-3">
            {serviceTemplates.map((template, index) => {
              const Icon = template.icon;
              return (
                <button
                  key={index}
                  onClick={() => addFromTemplate(template)}
                  className="bg-white border border-gray-200 rounded-xl p-4 text-left hover:border-purple-primary hover:bg-purple-50 transition-all duration-200"
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-purple-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">{template.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                        <span>{template.duration} min</span>
                        <span>${template.price}</span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Add Custom Service Form */}
      {showAddForm ? (
        <div className="bg-white rounded-xl p-4 border border-gray-200 space-y-4">
          <h3 className="font-semibold text-gray-800">Add Custom Service</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Service Title *
            </label>
            <input
              type="text"
              value={newService.title}
              onChange={(e) => setNewService(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-primary focus:border-transparent"
              placeholder="e.g., Animal Communication Session"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration (minutes) *
              </label>
              <select
                value={newService.duration}
                onChange={(e) => setNewService(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-primary focus:border-transparent"
              >
                <option value={30}>30 minutes</option>
                <option value={45}>45 minutes</option>
                <option value={60}>60 minutes</option>
                <option value={90}>90 minutes</option>
                <option value={120}>120 minutes</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price ($) *
              </label>
              <input
                type="number"
                value={newService.price}
                onChange={(e) => setNewService(prev => ({ ...prev, price: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-primary focus:border-transparent"
                placeholder="120"
                min="1"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              value={newService.description}
              onChange={(e) => setNewService(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-primary focus:border-transparent resize-none"
              placeholder="Describe what this service includes..."
            />
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleAddCustomService}
              disabled={!newService.title || !newService.description || newService.price <= 0}
              className="flex-1 bg-purple-primary text-white py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-dark transition-colors"
            >
              Add Service
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowAddForm(true)}
          className="w-full flex items-center justify-center space-x-2 py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-purple-primary hover:text-purple-primary transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Add Custom Service</span>
        </button>
      )}
    </div>
  );
};

export default ServicesStep;