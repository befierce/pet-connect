import React, { useState } from 'react';
import { Plus, X, Image } from 'lucide-react';
import { useOnboarding } from '../../../contexts/OnboardingContext';

const PortfolioStep: React.FC = () => {
  const { data, updateData } = useOnboarding();
  const [portfolioImages, setPortfolioImages] = useState<string[]>(data.portfolioImages || []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    files.forEach(file => {
      if (file && portfolioImages.length < 6) {
        // In a real app, you'd upload to a server
        const mockUrl = URL.createObjectURL(file);
        const updatedImages = [...portfolioImages, mockUrl];
        setPortfolioImages(updatedImages);
        updateData({ portfolioImages: updatedImages });
      }
    });
  };

  const removeImage = (index: number) => {
    const updatedImages = portfolioImages.filter((_, i) => i !== index);
    setPortfolioImages(updatedImages);
    updateData({ portfolioImages: updatedImages });
  };

  const portfolioIdeas = [
    'Your meditation or healing space',
    'Certificates and awards displayed',
    'You with animals (with permission)',
    'Peaceful nature scenes that inspire you',
    'Your workspace or consultation area',
    'Spiritual tools you use (crystals, cards, etc.)',
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 font-poppins">
          Portfolio Images
        </h2>
        <p className="text-gray-600">
          Share images that represent your practice and approach
        </p>
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-2 gap-3">
        {portfolioImages.map((image, index) => (
          <div key={index} className="relative group">
            <img
              src={image}
              alt={`Portfolio ${index + 1}`}
              className="w-full h-32 object-cover rounded-xl border border-gray-200"
            />
            <button
              onClick={() => removeImage(index)}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
        
        {/* Add Image Button */}
        {portfolioImages.length < 6 && (
          <label className="w-full h-32 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-purple-primary hover:bg-purple-50 transition-colors">
            <Plus className="w-6 h-6 text-gray-400 mb-1" />
            <span className="text-sm text-gray-500">Add Image</span>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        )}
      </div>

      {/* Image Count */}
      <div className="text-center">
        <p className="text-sm text-gray-600">
          {portfolioImages.length} of 6 images added
        </p>
      </div>

      {/* Empty State */}
      {portfolioImages.length === 0 && (
        <div className="text-center py-8 bg-gray-50 rounded-xl">
          <Image className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-800 mb-1">No images uploaded yet</h3>
          <p className="text-gray-600 text-sm mb-4">Add photos that showcase your practice</p>
          
          <label className="inline-flex items-center space-x-2 px-6 py-3 bg-purple-primary text-white rounded-xl cursor-pointer hover:bg-purple-dark transition-colors">
            <Plus className="w-5 h-5" />
            <span>Add First Image</span>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        </div>
      )}

      {/* Portfolio Ideas */}
      <div className="bg-lavender-50 rounded-xl p-4">
        <h3 className="font-semibold text-gray-800 mb-3">Portfolio Ideas</h3>
        <div className="grid grid-cols-1 gap-2">
          {portfolioIdeas.map((idea, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-lavender-400 rounded-full"></div>
              <span className="text-sm text-gray-600">{idea}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Guidelines */}
      <div className="bg-teal-50 rounded-xl p-4">
        <h3 className="font-semibold text-gray-800 mb-2">Image Guidelines</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• High-quality, well-lit photos work best</li>
          <li>• Avoid blurry or pixelated images</li>
          <li>• Keep images professional and appropriate</li>
          <li>• Only include animals with owner permission</li>
          <li>• Images should reflect your spiritual practice</li>
        </ul>
      </div>

      {/* Privacy Note */}
      <div className="bg-peach-50 rounded-xl p-4">
        <h3 className="font-semibold text-gray-800 mb-2">Privacy & Consent</h3>
        <p className="text-sm text-gray-600">
          Only upload images you have permission to use. If including pets or people, 
          ensure you have their consent. These images will be visible to potential clients 
          on your profile page.
        </p>
      </div>
    </div>
  );
};

export default PortfolioStep;