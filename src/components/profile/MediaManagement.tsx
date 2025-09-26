import React, { useState } from 'react';
import { Video, Image, Plus, X, Upload, Play } from 'lucide-react';

const MediaManagement: React.FC = () => {
  const [introVideo, setIntroVideo] = useState<string>('');
  const [portfolioImages, setPortfolioImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 100 * 1024 * 1024) {
        alert('File size must be less than 100MB');
        return;
      }

      setIsUploading(true);
      
      setTimeout(() => {
        const mockUrl = URL.createObjectURL(file);
        setIntroVideo(mockUrl);
        setIsUploading(false);
      }, 2000);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    files.forEach(file => {
      if (portfolioImages.length < 6) {
        const mockUrl = URL.createObjectURL(file);
        setPortfolioImages(prev => [...prev, mockUrl]);
      }
    });
  };

  const removeVideo = () => {
    setIntroVideo('');
  };

  const removeImage = (index: number) => {
    setPortfolioImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="p-4 space-y-6">
      {/* Intro Video Section */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Intro Video</h2>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Video className="w-4 h-4" />
            <span>Max 100MB, 2-3 minutes</span>
          </div>
        </div>

        {introVideo ? (
          <div className="space-y-4">
            <div className="relative bg-gray-900 rounded-xl overflow-hidden">
              <video
                src={introVideo}
                controls
                className="w-full h-48 object-cover"
                poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%236b7280'%3EIntro Video%3C/text%3E%3C/svg%3E"
              >
                Your browser does not support the video tag.
              </video>
              
              <button
                onClick={removeVideo}
                className="absolute top-2 right-2 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-green-600">
                <Play className="w-4 h-4" />
                <span className="text-sm font-medium">Video uploaded successfully</span>
              </div>
              
              <label className="flex items-center space-x-2 px-4 py-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <Upload className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">Replace</span>
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-xl">
            {isUploading ? (
              <div className="space-y-4">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-primary"></div>
                </div>
                <p className="text-gray-600">Uploading your video...</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                  <Video className="w-8 h-8 text-gray-400" />
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">No video uploaded yet</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Upload a 2-3 minute introduction video
                  </p>
                  
                  <label className="inline-flex items-center space-x-2 px-6 py-3 bg-purple-primary text-white rounded-xl cursor-pointer hover:bg-purple-dark transition-colors">
                    <Upload className="w-5 h-5" />
                    <span>Upload Video</span>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleVideoUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Portfolio Images Section */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Portfolio Images</h2>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Image className="w-4 h-4" />
            <span>{portfolioImages.length}/6 images</span>
          </div>
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
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

        {/* Empty State */}
        {portfolioImages.length === 0 && (
          <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-xl">
            <Image className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-800 mb-1">No images uploaded yet</h3>
            <p className="text-gray-600 text-sm mb-4">Add photos that showcase your practice</p>
            
            <label className="inline-flex items-center space-x-2 px-6 py-3 bg-purple-primary text-white rounded-xl cursor-pointer hover:bg-purple-dark transition-colors">
              <Plus className="w-5 h-5" />
              <span>Add Images</span>
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
      </div>

      {/* Guidelines */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-lavender-50 rounded-xl p-4">
          <h3 className="font-semibold text-gray-800 mb-2">Video Guidelines</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Keep it 2-3 minutes long</li>
            <li>• Good lighting and clear audio</li>
            <li>• Introduce yourself warmly</li>
            <li>• Mention your experience</li>
            <li>• Show your personality</li>
          </ul>
        </div>

        <div className="bg-teal-50 rounded-xl p-4">
          <h3 className="font-semibold text-gray-800 mb-2">Image Guidelines</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• High-quality, well-lit photos</li>
            <li>• Professional and appropriate</li>
            <li>• Show your workspace or practice</li>
            <li>• Include animals with permission</li>
            <li>• Reflect your spiritual approach</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MediaManagement;