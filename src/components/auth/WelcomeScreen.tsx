import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Sparkles } from 'lucide-react';

const WelcomeScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-lavender-100 via-cream to-peach-50 flex flex-col items-center justify-center p-6">
      <div className="text-center max-w-sm mx-auto">
        {/* Pet Illustration Placeholder */}
        <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-lavender-200 to-teal-200 rounded-full flex items-center justify-center animate-bounce-gentle">
          <div className="relative">
            <Heart className="w-16 h-16 text-purple-primary" />
            <Sparkles className="w-6 h-6 text-peach-400 absolute -top-2 -right-2 animate-pulse" />
          </div>
        </div>

        {/* Welcome Text */}
        <h1 className="text-3xl font-bold text-gray-800 mb-4 font-poppins">
          Welcome to
          <span className="block text-purple-primary">PetConnect</span>
        </h1>
        
        <p className="text-gray-600 mb-8 leading-relaxed">
          Connect hearts, heal souls. Join our community of certified pet communicators and help families understand their beloved companions.
        </p>

        {/* Benefits List */}
        <div className="space-y-3 mb-10 text-left">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
            <span className="text-sm text-gray-700">Connect with pet families worldwide</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-lavender-400 rounded-full"></div>
            <span className="text-sm text-gray-700">Manage bookings & sessions easily</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-peach-400 rounded-full"></div>
            <span className="text-sm text-gray-700">Build your spiritual practice</span>
          </div>
        </div>

        {/* CTA Button */}
        <div className="space-y-4">
          <button
            onClick={() => navigate('/signup')}
            className="w-full bg-purple-primary text-white py-4 rounded-2xl font-semibold text-lg shadow-soft hover:bg-purple-dark transition-all duration-300 transform hover:scale-105"
          >
            Get Started
          </button>

          <button
            onClick={() => navigate('/login')}
            className="w-full py-4 border-2 border-purple-primary text-purple-primary rounded-2xl font-semibold text-lg hover:bg-purple-primary hover:text-white transition-all duration-300 transform hover:scale-105"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;