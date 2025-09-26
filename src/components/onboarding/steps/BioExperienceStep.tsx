import React, { useState } from 'react';
import { useOnboarding } from '../../../contexts/OnboardingContext';

const BioExperienceStep: React.FC = () => {
  const { data, updateData } = useOnboarding();
  const [bio, setBio] = useState(data.bio || '');
  const [experience, setExperience] = useState(data.experience || '');

  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newBio = e.target.value;
    setBio(newBio);
    updateData({ bio: newBio });
  };

  const handleExperienceChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newExperience = e.target.value;
    setExperience(newExperience);
    updateData({ experience: newExperience });
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 font-poppins">
          Tell Your Story
        </h2>
        <p className="text-gray-600">
          Share your journey and experience in pet communication
        </p>
      </div>

      {/* Bio Section */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          About You *
        </label>
        <textarea
          value={bio}
          onChange={handleBioChange}
          rows={4}
          className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-primary focus:border-transparent bg-white resize-none"
          placeholder="Tell clients about yourself, your approach to pet communication, and what makes you unique..."
          required
        />
        <div className="flex justify-between items-center mt-2">
          <p className="text-xs text-gray-500">
            This will appear on your profile page
          </p>
          <span className="text-xs text-gray-400">
            {bio.length}/500
          </span>
        </div>
      </div>

      {/* Experience Section */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your Experience *
        </label>
        <textarea
          value={experience}
          onChange={handleExperienceChange}
          rows={4}
          className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-primary focus:border-transparent bg-white resize-none"
          placeholder="Describe your experience with pet communication, training, certifications, and any special techniques you use..."
          required
        />
        <div className="flex justify-between items-center mt-2">
          <p className="text-xs text-gray-500">
            Help clients understand your expertise
          </p>
          <span className="text-xs text-gray-400">
            {experience.length}/500
          </span>
        </div>
      </div>

      {/* Writing Tips */}
      <div className="bg-teal-50 rounded-xl p-4">
        <h3 className="font-semibold text-gray-800 mb-2">Writing Tips</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Be authentic and speak from the heart</li>
          <li>• Mention your years of experience or training</li>
          <li>• Share what drew you to pet communication</li>
          <li>• Include any specializations (trauma, behavior, etc.)</li>
        </ul>
      </div>

      {/* Example Bio */}
      <div className="bg-peach-50 rounded-xl p-4">
        <h3 className="font-semibold text-gray-800 mb-2">Example</h3>
        <p className="text-sm text-gray-600 italic">
          "I've been communicating with animals for over 8 years, helping families understand their beloved companions. My gentle approach focuses on creating a safe space for both pets and their humans to heal and connect more deeply..."
        </p>
      </div>
    </div>
  );
};

export default BioExperienceStep;