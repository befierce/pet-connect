import React, { useState } from 'react';
import { Heart, Users, Check } from 'lucide-react';
import { useOnboarding } from '../../../contexts/OnboardingContext';

const RoleSelectionStep: React.FC = () => {
  const { data, updateData } = useOnboarding();
  const [selectedRole, setSelectedRole] = useState<'communicator' | 'parent' | ''>(data.role || '');
  const [termsAccepted, setTermsAccepted] = useState(data.termsAccepted || false);

  const handleRoleSelect = (role: 'communicator' | 'parent') => {
    setSelectedRole(role);
    updateData({ role });
  };

  const handleTermsChange = (accepted: boolean) => {
    setTermsAccepted(accepted);
    updateData({ termsAccepted: accepted });
  };

  const roles = [
    {
      id: 'communicator',
      title: 'Pet Communicator',
      description: 'I provide spiritual communication and healing services for pets',
      icon: Heart,
      benefits: [
        'Create your service listings',
        'Connect with pet families',
        'Manage bookings and sessions',
        'Build your healing practice'
      ],
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      id: 'parent',
      title: 'Pet Parent',
      description: 'I\'m looking for communication and healing services for my pet',
      icon: Users,
      benefits: [
        'Find certified communicators',
        'Book healing sessions',
        'Get insights about your pet',
        'Access ongoing support'
      ],
      gradient: 'from-teal-500 to-blue-500'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-6">
        <p className="text-gray-600 text-sm">
          Help us personalize your experience
        </p>
      </div>

      {/* Role Selection */}
      <div className="space-y-4">
        {roles.map((role) => {
          const Icon = role.icon;
          const isSelected = selectedRole === role.id;
          
          return (
            <button
              key={role.id}
              onClick={() => handleRoleSelect(role.id as 'communicator' | 'parent')}
              className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                isSelected
                  ? 'border-purple-500 bg-purple-50 shadow-lg'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
              }`}
            >
              <div className="flex items-start space-x-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-r ${role.gradient}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-800">{role.title}</h3>
                    {isSelected && (
                      <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-600 mt-1 mb-3">
                    {role.description}
                  </p>
                  
                  <div className="space-y-1">
                    {role.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                        <span className="text-xs text-gray-600">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Terms and Conditions */}
      <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/50">
        <div className="flex items-start space-x-3">
          <button
            onClick={() => handleTermsChange(!termsAccepted)}
            className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
              termsAccepted
                ? 'bg-purple-500 border-purple-500'
                : 'border-gray-300 hover:border-purple-400'
            }`}
          >
            {termsAccepted && <Check className="w-3 h-3 text-white" />}
          </button>
          
          <div className="flex-1">
            <p className="text-sm text-gray-700 leading-relaxed">
              I agree to the{' '}
              <button className="text-purple-600 hover:underline font-medium">
                Terms of Service
              </button>{' '}
              and{' '}
              <button className="text-purple-600 hover:underline font-medium">
                Privacy Policy
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Welcome Message */}
      {selectedRole && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
          <div className="text-center">
            <h4 className="font-semibold text-purple-900 mb-1">
              Welcome to PetConnect! 🎉
            </h4>
            <p className="text-sm text-purple-800">
              {selectedRole === 'communicator' 
                ? "Let's set up your profile so pet families can find you"
                : "Let's help you find the perfect communicator for your beloved pet"
              }
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleSelectionStep;