import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Edit, 
  Award, 
  Video, 
  Image, 
  Settings, 
  LogOut, 
  Star,
  Calendar,
  MessageCircle,
  Globe,
  Instagram,
  Youtube
} from 'lucide-react';

const ProfileMain: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();
  const [services, setServices] = useState<any[]>([]);
  const [certifications, setCertifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProfileData();
    }
  }, [user]);

  const fetchProfileData = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Fetch services
      const { data: servicesData } = await supabase
        .from('services')
        .select('*')
        .eq('communicator_id', user.id)
        .eq('is_active', true);

      // Fetch certifications
      const { data: certificationsData } = await supabase
        .from('certifications')
        .select('*')
        .eq('user_id', user.id);

      setServices(servicesData || []);
      setCertifications(certificationsData || []);
    } catch (error) {
      console.error('Error fetching profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    {
      icon: Edit,
      label: 'Edit Profile',
      description: 'Update your bio, services, and availability',
      path: '/profile/edit',
      color: 'purple',
    },
    {
      icon: Award,
      label: 'Manage Services',
      description: 'Add, edit, or remove your service offerings',
      path: '/profile/services',
      color: 'green',
    },
    {
      icon: Award,
      label: 'Certifications',
      description: 'Manage your certificates and credentials',
      path: '/profile/certifications',
      color: 'teal',
    },
    {
      icon: Video,
      label: 'Media Management',
      description: 'Update intro video and portfolio images',
      path: '/profile/media',
      color: 'peach',
    },
    {
      icon: Settings,
      label: 'Settings',
      description: 'Notifications, privacy, and account settings',
      path: '/profile/settings',
      color: 'lavender',
    },
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      purple: 'bg-purple-50 text-purple-600',
      teal: 'bg-teal-50 text-teal-600',
      peach: 'bg-peach-50 text-peach-600',
      lavender: 'bg-lavender-50 text-lavender-600',
    };
    return colors[color as keyof typeof colors] || colors.purple;
  };

  if (loading) {
    return (
      <div className="p-4 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      {/* Profile Header */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center">
            <span className="text-purple-primary font-bold text-2xl">
              {(profile?.display_name || profile?.full_name || 'U').charAt(0)}
            </span>
          </div>
          
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-800">
              {profile?.display_name || profile?.full_name}
            </h2>
            <p className="text-gray-600">{profile?.email}</p>
            
            <div className="flex items-center space-x-2 mt-2">
              <span className="text-sm text-gray-600 capitalize">
                {profile?.experience_level} • {profile?.location}
              </span>
            </div>
          </div>
        </div>

        {/* Bio */}
        {profile?.bio && (
          <div className="mb-4">
            <h3 className="font-semibold text-gray-800 mb-2">About</h3>
            <p className="text-gray-700 text-sm leading-relaxed">{profile.bio}</p>
          </div>
        )}

        {/* Social Links */}
        {profile?.social_links && Object.keys(profile.social_links).length > 0 && (
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Connect</h3>
            <div className="flex space-x-3">
              {profile.social_links.website && (
                <div className="flex items-center space-x-1 text-sm text-gray-600">
                  <Globe className="w-4 h-4" />
                  <span>Website</span>
                </div>
              )}
              {profile.social_links.instagram && (
                <div className="flex items-center space-x-1 text-sm text-gray-600">
                  <Instagram className="w-4 h-4" />
                  <span>Instagram</span>
                </div>
              )}
              {profile.social_links.youtube && (
                <div className="flex items-center space-x-1 text-sm text-gray-600">
                  <Youtube className="w-4 h-4" />
                  <span>YouTube</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Services */}
      {services.length > 0 && (
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <h3 className="font-semibold text-gray-800 mb-3">Your Services</h3>
          <div className="space-y-3">
            {services.map((service) => (
              <div key={service.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">{service.title}</p>
                  <p className="text-sm text-gray-600">{service.duration} minutes</p>
                </div>
                <span className="font-semibold text-gray-800">${service.price}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Specializations */}
      {((profile?.animal_types && profile.animal_types.length > 0) || 
        (profile?.service_categories && profile.service_categories.length > 0)) && (
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <h3 className="font-semibold text-gray-800 mb-3">Your Specializations</h3>
          
          {profile.animal_types && profile.animal_types.length > 0 && (
            <div className="mb-3">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Animals I work with:</h4>
              <div className="flex flex-wrap gap-2">
                {profile.animal_types.map((animal, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full font-medium"
                  >
                    {animal.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {profile.service_categories && profile.service_categories.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Services I offer:</h4>
              <div className="flex flex-wrap gap-2">
                {profile.service_categories.map((category, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-teal-100 text-teal-800 text-sm rounded-full font-medium"
                  >
                    {category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Contact Methods */}
      {profile?.contact_methods && Object.keys(profile.contact_methods).length > 0 && (
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <h3 className="font-semibold text-gray-800 mb-3">How Clients Can Reach Me</h3>
          <div className="space-y-2">
            {Object.entries(profile.contact_methods).map(([method, enabled]) => {
              if (!enabled) return null;
              
              const methodLabels = {
                email: 'Email',
                phone: 'Phone Calls',
                whatsapp: 'WhatsApp',
                video: 'Video Calls',
                inPerson: 'In-Person Sessions'
              };
              
              return (
                <div key={method} className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">
                    {methodLabels[method as keyof typeof methodLabels] || method}
                  </span>
                </div>
              );
            })}
            
            {profile.phone_number && (
              <div className="mt-2 pt-2 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  <strong>Phone:</strong> {profile.phone_number}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Certifications Preview */}
      {certifications.length > 0 && (
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-gray-800">Certifications</h3>
            <button
              onClick={() => navigate('/profile/certifications')}
              className="text-purple-primary text-sm font-medium hover:underline"
            >
              View All
            </button>
          </div>
          
          <div className="space-y-2">
            {certifications.slice(0, 2).map((cert) => (
              <div key={cert.id} className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                <Award className="w-5 h-5 text-purple-primary" />
                <div className="flex-1">
                  <p className="font-medium text-gray-800 text-sm">{cert.name}</p>
                  <p className="text-xs text-gray-600">{cert.issuer}</p>
                </div>
                {cert.is_verified && (
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Menu Items */}
      <div className="space-y-3">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="w-full bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-all text-left"
            >
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getColorClasses(item.color)}`}>
                  <Icon className="w-6 h-6" />
                </div>
                
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{item.label}</h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Logout */}
      <button
        onClick={signOut}
        className="w-full bg-white rounded-xl p-4 border border-red-200 hover:bg-red-50 transition-colors text-left"
      >
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
            <LogOut className="w-6 h-6 text-red-600" />
          </div>
          
          <div>
            <h3 className="font-semibold text-red-600">Sign Out</h3>
            <p className="text-sm text-red-500">Sign out of your account</p>
          </div>
        </div>
      </button>
    </div>
  );
};

export default ProfileMain;