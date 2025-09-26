import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Camera, Save, User } from 'lucide-react';

const EditProfile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    bio: "I've been communicating with animals for over 8 years, helping families understand their beloved companions.",
    experience: "Certified Animal Communicator with specialization in trauma healing and behavioral consultation.",
    profilePicture: user?.profilePicture || '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const mockUrl = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, profilePicture: mockUrl }));
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    updateUser({
      name: formData.name,
      profilePicture: formData.profilePicture,
    });
    
    setIsLoading(false);
  };

  return (
    <div className="p-4 space-y-6">
      {/* Profile Picture */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Profile Picture</h2>
        
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-soft">
              {formData.profilePicture ? (
                <img
                  src={formData.profilePicture}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-12 h-12 text-gray-400" />
              )}
            </div>
            
            <label className="absolute bottom-0 right-0 w-8 h-8 bg-purple-primary rounded-full flex items-center justify-center cursor-pointer shadow-soft hover:bg-purple-dark transition-colors">
              <Camera className="w-4 h-4 text-white" />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>
          
          <p className="text-sm text-gray-500 text-center">
            Upload a professional photo that represents your practice
          </p>
        </div>
      </div>

      {/* Basic Information */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-primary focus:border-transparent bg-white"
              placeholder="Enter your full name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={user?.email || ''}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-500"
              disabled
            />
            <p className="text-xs text-gray-500 mt-1">
              Email cannot be changed. Contact support if needed.
            </p>
          </div>
        </div>
      </div>

      {/* About You */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">About You</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bio *
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-primary focus:border-transparent bg-white resize-none"
              placeholder="Tell clients about yourself and your approach..."
              required
            />
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-gray-500">
                This appears on your profile page
              </p>
              <span className="text-xs text-gray-400">
                {formData.bio.length}/500
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Experience *
            </label>
            <textarea
              name="experience"
              value={formData.experience}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-primary focus:border-transparent bg-white resize-none"
              placeholder="Describe your experience and expertise..."
              required
            />
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-gray-500">
                Help clients understand your expertise
              </p>
              <span className="text-xs text-gray-400">
                {formData.experience.length}/500
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <button
          onClick={handleSave}
          disabled={isLoading || !formData.name || !formData.bio}
          className="w-full flex items-center justify-center space-x-2 py-4 bg-purple-primary text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-dark transition-colors"
        >
          <Save className="w-5 h-5" />
          <span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
        </button>
      </div>

      {/* Tips */}
      <div className="bg-teal-50 rounded-xl p-4">
        <h3 className="font-semibold text-gray-800 mb-2">Profile Tips</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Use a clear, professional photo</li>
          <li>• Write in a warm, authentic voice</li>
          <li>• Mention your specializations</li>
          <li>• Include years of experience</li>
          <li>• Keep it concise but informative</li>
        </ul>
      </div>
    </div>
  );
};

export default EditProfile;