import React from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, User } from 'lucide-react';

// Components
import ProfileMain from './ProfileMain';
import EditProfile from './EditProfile';
import ServicesManagement from './ServicesManagement';
import CertificationsView from './CertificationsView';
import MediaManagement from './MediaManagement';
import Settings from './Settings';

const ProfileModule: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMainView = location.pathname === '/profile';

  const handleBack = () => {
    if (location.pathname.includes('/profile/')) {
      navigate('/profile');
    }
  };

  const getPageTitle = () => {
    if (location.pathname.includes('/edit')) return 'Edit Profile';
    if (location.pathname.includes('/certifications')) return 'Certifications';
    if (location.pathname.includes('/media')) return 'Media Management';
    if (location.pathname.includes('/settings')) return 'Settings';
    return 'Profile';
  };

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center justify-between">
          {!isMainView ? (
            <button
              onClick={handleBack}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-700" />
            </button>
          ) : (
            <div></div>
          )}
          
          <h1 className="text-xl font-semibold text-gray-800">{getPageTitle()}</h1>
          
          <div className="w-10"></div>
        </div>
      </div>

      {/* Routes */}
      <Routes>
        <Route path="/" element={<ProfileMain />} />
        <Route path="/edit" element={<EditProfile />} />
        <Route path="/services" element={<ServicesManagement />} />
        <Route path="/certifications" element={<CertificationsView />} />
        <Route path="/media" element={<MediaManagement />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </div>
  );
};

export default ProfileModule;