import React, { useState } from 'react';
import { Globe, Instagram, Youtube, ExternalLink } from 'lucide-react';
import { useOnboarding } from '../../../contexts/OnboardingContext';

const SocialLinksStep: React.FC = () => {
  const { data, updateData } = useOnboarding();
  const [socialLinks, setSocialLinks] = useState(data.socialLinks || {});

  const handleLinkChange = (platform: string, value: string) => {
    const updatedLinks = {
      ...socialLinks,
      [platform]: value,
    };
    setSocialLinks(updatedLinks);
    updateData({ socialLinks: updatedLinks });
  };

  const socialPlatforms = [
    {
      key: 'website',
      label: 'Website',
      icon: Globe,
      placeholder: 'https://yourwebsite.com',
      description: 'Your personal or business website',
    },
    {
      key: 'instagram',
      label: 'Instagram',
      icon: Instagram,
      placeholder: 'https://instagram.com/yourusername',
      description: 'Share your spiritual journey and pet connections',
    },
    {
      key: 'youtube',
      label: 'YouTube',
      icon: Youtube,
      placeholder: 'https://youtube.com/yourchannel',
      description: 'Educational videos about pet communication',
    },
  ];

  const validateUrl = (url: string) => {
    if (!url) return true; // Empty is valid
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const getLinksCount = () => {
    return Object.values(socialLinks).filter(link => link && link.trim()).length;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 font-poppins">
          Social Links
        </h2>
        <p className="text-gray-600">
          Connect your social media and website to build credibility
        </p>
      </div>

      {/* Links Count */}
      <div className="bg-purple-50 rounded-xl p-4 text-center">
        <ExternalLink className="w-8 h-8 text-purple-primary mx-auto mb-2" />
        <p className="text-purple-primary font-semibold">
          {getLinksCount()} link{getLinksCount() !== 1 ? 's' : ''} added
        </p>
        <p className="text-sm text-gray-600 mt-1">
          Social links help clients learn more about you
        </p>
      </div>

      {/* Social Platform Inputs */}
      <div className="space-y-4">
        {socialPlatforms.map((platform) => {
          const Icon = platform.icon;
          const value = socialLinks[platform.key] || '';
          const isValid = validateUrl(value);
          
          return (
            <div key={platform.key} className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Icon className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{platform.label}</h3>
                  <p className="text-sm text-gray-600">{platform.description}</p>
                </div>
              </div>
              
              <div>
                <input
                  type="url"
                  value={value}
                  onChange={(e) => handleLinkChange(platform.key, e.target.value)}
                  className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-purple-primary focus:border-transparent ${
                    !isValid ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'
                  }`}
                  placeholder={platform.placeholder}
                />
                {!isValid && value && (
                  <p className="text-red-600 text-sm mt-1">Please enter a valid URL</p>
                )}
                {value && isValid && (
                  <div className="flex items-center space-x-2 mt-2">
                    <ExternalLink className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-green-600">Valid link added</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Benefits */}
      <div className="bg-teal-50 rounded-xl p-4">
        <h3 className="font-semibold text-gray-800 mb-2">Why Add Social Links?</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Build trust and credibility with potential clients</li>
          <li>• Showcase your expertise and experience</li>
          <li>• Let clients see your personality and approach</li>
          <li>• Provide additional ways for clients to connect</li>
        </ul>
      </div>

      {/* Privacy Note */}
      <div className="bg-peach-50 rounded-xl p-4">
        <h3 className="font-semibold text-gray-800 mb-2">Privacy & Professional Presence</h3>
        <p className="text-sm text-gray-600">
          Only add social media accounts that maintain a professional image. 
          These links will be visible to potential clients on your profile page. 
          You can always update or remove these links later.
        </p>
      </div>

      {/* Optional Note */}
      <div className="bg-gray-50 rounded-xl p-4 text-center">
        <p className="text-sm text-gray-600">
          <strong>Note:</strong> All social links are optional. You can skip this step 
          and add links later from your profile settings.
        </p>
      </div>
    </div>
  );
};

export default SocialLinksStep;