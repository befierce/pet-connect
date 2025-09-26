import React, { useState } from 'react';
import { Video, Upload, Play, X } from 'lucide-react';
import { useOnboarding } from '../../../contexts/OnboardingContext';

const IntroVideoStep: React.FC = () => {
  const { data, updateData } = useOnboarding();
  const [videoUrl, setVideoUrl] = useState(data.introVideo || '');
  const [isUploading, setIsUploading] = useState(false);

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (100MB limit)
      if (file.size > 100 * 1024 * 1024) {
        alert('File size must be less than 100MB');
        return;
      }

      setIsUploading(true);
      
      // In a real app, you'd upload to a server
      setTimeout(() => {
        const mockUrl = URL.createObjectURL(file);
        setVideoUrl(mockUrl);
        updateData({ introVideo: mockUrl });
        setIsUploading(false);
      }, 2000);
    }
  };

  const removeVideo = () => {
    setVideoUrl('');
    updateData({ introVideo: '' });
  };

  const videoTips = [
    'Keep it between 2-3 minutes',
    'Introduce yourself and your approach',
    'Speak clearly and warmly',
    'Show your personality',
    'Mention your experience',
    'Good lighting and audio quality',
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 font-poppins">
          Intro Video
        </h2>
        <p className="text-gray-600">
          Help clients get to know you with a personal introduction
        </p>
      </div>

      {/* Video Upload/Display */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        {videoUrl ? (
          <div className="space-y-4">
            <div className="relative bg-gray-900 rounded-xl overflow-hidden">
              <video
                src={videoUrl}
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
                <span className="text-sm text-gray-600">Replace Video</span>
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
          <div className="text-center py-8">
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
                    Upload a 2-3 minute introduction video (max 100MB)
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

      {/* Video Tips */}
      <div className="bg-lavender-50 rounded-xl p-4">
        <h3 className="font-semibold text-gray-800 mb-3">Video Tips</h3>
        <div className="grid grid-cols-1 gap-2">
          {videoTips.map((tip, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-lavender-400 rounded-full"></div>
              <span className="text-sm text-gray-600">{tip}</span>
            </div>
          ))}
        </div>
      </div>

      {/* What to Include */}
      <div className="bg-teal-50 rounded-xl p-4">
        <h3 className="font-semibold text-gray-800 mb-2">What to Include</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <p><strong>Opening:</strong> "Hi, I'm [Name] and I'm a certified pet communicator..."</p>
          <p><strong>Experience:</strong> Briefly mention your years of experience and training</p>
          <p><strong>Approach:</strong> Describe your communication style and what makes you unique</p>
          <p><strong>Closing:</strong> "I look forward to connecting with you and your beloved pet"</p>
        </div>
      </div>

      {/* Technical Requirements */}
      <div className="bg-peach-50 rounded-xl p-4">
        <h3 className="font-semibold text-gray-800 mb-2">Technical Requirements</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Maximum file size: 100MB</li>
          <li>• Recommended length: 2-3 minutes</li>
          <li>• Formats: MP4, MOV, AVI</li>
          <li>• Good lighting and clear audio</li>
          <li>• Horizontal (landscape) orientation preferred</li>
        </ul>
      </div>
    </div>
  );
};

export default IntroVideoStep;