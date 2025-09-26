import React, { useState } from 'react';
import { Camera, User } from 'lucide-react';
import { useOnboarding } from '../../../contexts/OnboardingContext';

const ProfilePictureStep: React.FC = () => {
  const { data, updateData } = useOnboarding();
  const [name, setName] = useState(data.name || '');
  const [profilePicture, setProfilePicture] = useState(data.profilePicture || '');

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setName(newName);
    updateData({ name: newName });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you'd upload to a server and get back a URL
      const mockUrl = URL.createObjectURL(file);
      setProfilePicture(mockUrl);
      updateData({ profilePicture: mockUrl });
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 font-poppins">
          Let's Get Started
        </h2>
        <p className="text-gray-600">
          Add your profile picture and name to help clients connect with you
        </p>
      </div>

      {/* Profile Picture Upload */}
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-soft">
            {profilePicture ? (
              <img
                src={profilePicture}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-16 h-16 text-gray-400" />
            )}
          </div>
          
          <label className="absolute bottom-0 right-0 w-10 h-10 bg-purple-primary rounded-full flex items-center justify-center cursor-pointer shadow-soft hover:bg-purple-dark transition-colors">
            <Camera className="w-5 h-5 text-white" />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        </div>
        
        <p className="text-sm text-gray-500 text-center">
          Upload a professional photo that represents your spiritual practice
        </p>
      </div>

      {/* Name Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Full Name *
        </label>
        <input
          type="text"
          value={name}
          onChange={handleNameChange}
          className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-primary focus:border-transparent bg-white"
          placeholder="Enter your full name"
          required
        />
        <p className="text-xs text-gray-500 mt-2">
          This is how clients will see your name on the platform
        </p>
      </div>

      {/* Tips */}
      <div className="bg-lavender-50 rounded-xl p-4">
        <h3 className="font-semibold text-gray-800 mb-2">Profile Tips</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Use a clear, friendly photo where your face is visible</li>
          <li>• Choose a name that feels authentic and professional</li>
          <li>• This will be the first impression for potential clients</li>
        </ul>
      </div>
    </div>
  );
};

export default ProfilePictureStep;