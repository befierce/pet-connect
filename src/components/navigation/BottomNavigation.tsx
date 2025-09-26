import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, MessageCircle, Calendar, User } from 'lucide-react';

const BottomNavigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
      path: '/dashboard',
      badge: null,
    },
    {
      id: 'inquiries',
      label: 'Inquiries',
      icon: MessageCircle,
      path: '/inquiries',
      badge: 2, // Mock notification count
    },
    {
      id: 'bookings',
      label: 'Bookings',
      icon: Calendar,
      path: '/bookings',
      badge: null,
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
      path: '/profile',
      badge: null,
    },
  ];

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 safe-area-pb">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`relative flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200 ${
                active
                  ? 'text-purple-primary bg-purple-primary/10'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="relative">
                <Icon className={`w-6 h-6 ${active ? 'text-purple-primary' : ''}`} />
                {item.badge && (
                  <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                    {item.badge}
                  </div>
                )}
              </div>
              <span className={`text-xs mt-1 font-medium ${
                active ? 'text-purple-primary' : 'text-gray-500'
              }`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;