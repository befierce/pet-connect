import React, { useState } from 'react';
import { User, MapPin, Star } from 'lucide-react';
import { useOnboarding } from '../../../contexts/OnboardingContext';
import { useAuth } from '../../../contexts/AuthContext';

const EssentialIdentityStep: React.FC = () => {
  const { data, updateData } = useOnboarding();
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState(data.displayName || '');
  const [location, setLocation] = useState(data.location || '');
  const [experienceLevel, setExperienceLevel] = useState(data.experienceLevel || '');

  // Pre-populate display name from user metadata if not already set
  React.useEffect(() => {
    if (!displayName && user?.user_metadata?.full_name) {
      const name = user.user_metadata.full_name;
      setDisplayName(name);
      updateData({ displayName: name });
    }
  }, [user, displayName, updateData]);

  const handleDisplayNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDisplayName = e.target.value;
    setDisplayName(newDisplayName);
    updateData({ displayName: newDisplayName });
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLocation = e.target.value;
    setLocation(newLocation);
    updateData({ location: newLocation });
  };

  const handleExperienceLevelChange = (level: 'beginner' | 'intermediate' | 'expert') => {
    setExperienceLevel(level);
    updateData({ experienceLevel: level });
  };

  const experienceLevels = [
    {
      id: 'beginner',
      title: 'New to Pet Communication',
      description: 'Just starting my journey (0-2 years)',
      icon: '🌱',
    },
    {
      id: 'intermediate',
      title: 'Developing My Practice',
      description: 'Building experience (2-5 years)',
      icon: '🌿',
    },
    {
      id: 'expert',
      title: 'Experienced Communicator',
      description: 'Established practice (5+ years)',
      icon: '🌳',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-teal-100 to-blue-100 rounded-full flex items-center justify-center">
          <User className="w-8 h-8 text-teal-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2 font-poppins">
          Complete Your Profile
        </h2>
        <p className="text-gray-600 text-sm">
          This information helps pet families connect with you
        </p>
      </div>

      {/* Display Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          How should clients know you? *
        </label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={displayName}
            onChange={handleDisplayNameChange}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-base"
            placeholder="e.g., Sarah or Dr. Sarah Johnson"
            required
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          This can be different from your full name if you prefer
        </p>
      </div>

      {/* Location */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Location *
        </label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={location}
            onChange={handleLocationChange}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-base"
            placeholder="City, State or Country"
            required
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Helps clients find local communicators (e.g., "San Francisco, CA" or "Remote Worldwide")
        </p>
      </div>

      {/* Experience Level */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Experience Level *
        </label>
        <div className="space-y-3">
          {experienceLevels.map((level) => {
            const isSelected = experienceLevel === level.id;
            
            return (
              <button
                key={level.id}
                onClick={() => handleExperienceLevelChange(level.id as 'beginner' | 'intermediate' | 'expert')}
                className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                  isSelected
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{level.icon}</span>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{level.title}</h3>
                    <p className="text-sm text-gray-600">{level.description}</p>
                  </div>
                  {isSelected && (
                    <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                      <Star className="w-4 h-4 text-white fill-current" />
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Encouragement */}
      <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-xl p-4 border border-teal-100">
        <div className="text-center">
          <h4 className="font-semibold text-teal-900 mb-1">
            Every Journey is Sacred ✨
          </h4>
          <p className="text-sm text-teal-800">
            Whether you're just beginning or have years of experience, your gift matters and pet families need you.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EssentialIdentityStep;