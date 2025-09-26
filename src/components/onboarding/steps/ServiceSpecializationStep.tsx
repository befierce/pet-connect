import React, { useState } from 'react';
import { Heart, Sparkles } from 'lucide-react';
import { useOnboarding } from '../../../contexts/OnboardingContext';

const ServiceSpecializationStep: React.FC = () => {
  const { data, updateData } = useOnboarding();
  const [animalTypes, setAnimalTypes] = useState<string[]>(data.animalTypes || []);
  const [serviceCategories, setServiceCategories] = useState<string[]>(data.serviceCategories || []);

  const handleAnimalTypeToggle = (type: string) => {
    const updatedTypes = animalTypes.includes(type)
      ? animalTypes.filter(t => t !== type)
      : [...animalTypes, type];
    
    setAnimalTypes(updatedTypes);
    updateData({ animalTypes: updatedTypes });
  };

  const handleServiceCategoryToggle = (category: string) => {
    const updatedCategories = serviceCategories.includes(category)
      ? serviceCategories.filter(c => c !== category)
      : [...serviceCategories, category];
    
    setServiceCategories(updatedCategories);
    updateData({ serviceCategories: updatedCategories });
  };

  const animalTypeOptions = [
    { id: 'dogs', label: 'Dogs', emoji: '🐕' },
    { id: 'cats', label: 'Cats', emoji: '🐱' },
    { id: 'horses', label: 'Horses', emoji: '🐴' },
    { id: 'birds', label: 'Birds', emoji: '🦜' },
    { id: 'rabbits', label: 'Rabbits', emoji: '🐰' },
    { id: 'reptiles', label: 'Reptiles', emoji: '🦎' },
    { id: 'farm-animals', label: 'Farm Animals', emoji: '🐄' },
    { id: 'all-animals', label: 'All Animals', emoji: '🌟' },
  ];

  const serviceCategoryOptions = [
    { id: 'communication', label: 'Animal Communication', description: 'Connect with pets telepathically' },
    { id: 'behavioral', label: 'Behavioral Issues', description: 'Address unwanted behaviors' },
    { id: 'trauma-healing', label: 'Trauma Healing', description: 'Help pets heal from past trauma' },
    { id: 'end-of-life', label: 'End-of-Life Support', description: 'Comfort during transitions' },
    { id: 'lost-pets', label: 'Lost Pet Communication', description: 'Help locate missing pets' },
    { id: 'energy-healing', label: 'Energy Healing', description: 'Reiki and energy work' },
    { id: 'mediumship', label: 'Pet Mediumship', description: 'Connect with pets who have passed' },
    { id: 'general', label: 'General Wellness', description: 'Overall health and happiness' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
          <Heart className="w-8 h-8 text-purple-600" />
        </div>
        <p className="text-gray-600 text-sm">
          Select what resonates with your gifts and experience
        </p>
      </div>

      {/* Animal Types */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          What animals do you work with? *
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {animalTypeOptions.map((animal) => {
            const isSelected = animalTypes.includes(animal.id);
            
            return (
              <button
                key={animal.id}
                onClick={() => handleAnimalTypeToggle(animal.id)}
                className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                  isSelected
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="text-center">
                  <span className="text-2xl mb-1 block">{animal.emoji}</span>
                  <span className="text-sm font-medium text-gray-800">{animal.label}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Service Categories */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          What services do you offer? *
        </h3>
        <div className="space-y-3">
          {serviceCategoryOptions.map((service) => {
            const isSelected = serviceCategories.includes(service.id);
            
            return (
              <button
                key={service.id}
                onClick={() => handleServiceCategoryToggle(service.id)}
                className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                  isSelected
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800">{service.label}</h4>
                    <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                  </div>
                  {isSelected && (
                    <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center ml-3">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selection Summary */}
      {(animalTypes.length > 0 || serviceCategories.length > 0) && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
          <h4 className="font-semibold text-purple-900 mb-2">Your Specialties:</h4>
          <div className="space-y-2">
            {animalTypes.length > 0 && (
              <div>
                <span className="text-sm text-purple-800">
                  <strong>Animals:</strong> {animalTypes.length} selected
                </span>
              </div>
            )}
            {serviceCategories.length > 0 && (
              <div>
                <span className="text-sm text-purple-800">
                  <strong>Services:</strong> {serviceCategories.length} selected
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Skip Option Note */}
      <div className="bg-blue-50 rounded-xl p-4">
        <div className="flex items-start space-x-3">
          <Sparkles className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-900 text-sm">Not sure yet?</h4>
            <p className="text-blue-800 text-sm mt-1">
              You can skip this step and we'll help you create a general service. You can always add specialties later.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceSpecializationStep;