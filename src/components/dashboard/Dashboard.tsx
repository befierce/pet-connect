import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Calendar, MessageCircle, Clock, Settings, Play, Users, ToggleLeft, ToggleRight } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user, profile, updateProfile } = useAuth();
  const [stats, setStats] = useState({
    newInquiries: 0,
    confirmedBookings: 0,
    completedSessions: 0,
    rating: 0,
  });
  const [todaySessions, setTodaySessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && profile) {
      fetchDashboardData();
    }
  }, [user, profile]);

  const fetchDashboardData = async () => {
    if (!user || !profile) return;

    try {
      setLoading(true);

      // Fetch inquiries count
      const { count: inquiriesCount } = await supabase
        .from('inquiries')
        .select('*', { count: 'exact', head: true })
        .eq('communicator_id', user.id)
        .eq('status', 'new');

      // Fetch confirmed bookings count
      const { count: bookingsCount } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .eq('communicator_id', user.id)
        .in('status', ['payment-confirmed', 'scheduled']);

      // Fetch completed sessions this month
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { count: completedCount } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .eq('communicator_id', user.id)
        .eq('status', 'completed')
        .gte('updated_at', startOfMonth.toISOString());

      // Fetch average rating
      const { data: reviews } = await supabase
        .from('reviews')
        .select('rating')
        .eq('communicator_id', user.id);

      const avgRating = reviews && reviews.length > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
        : 0;

      // Fetch today's sessions
      const today = new Date().toISOString().split('T')[0];
      const { data: sessions } = await supabase
        .from('bookings')
        .select(`
          *,
          client:profiles!bookings_client_id_fkey(full_name, display_name),
          pet:pets(name, type),
          service:services(title)
        `)
        .eq('communicator_id', user.id)
        .eq('scheduled_date', today)
        .in('status', ['scheduled', 'payment-confirmed'])
        .order('scheduled_time');

      setStats({
        newInquiries: inquiriesCount || 0,
        confirmedBookings: bookingsCount || 0,
        completedSessions: completedCount || 0,
        rating: Math.round(avgRating * 10) / 10,
      });

      setTodaySessions(sessions || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleOnlineStatus = async () => {
    if (!profile) return;
    
    try {
      await updateProfile({ is_online: !profile.is_online });
    } catch (error) {
      console.error('Error updating online status:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-800 font-poppins">
              Welcome back, {profile?.display_name || profile?.full_name || 'there'}
            </h1>
            <p className="text-gray-600 text-sm">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          
          {/* Online Status Toggle */}
          <button
            onClick={toggleOnlineStatus}
            className="flex items-center space-x-2"
          >
            {profile?.is_online ? (
              <ToggleRight className="w-8 h-8 text-green-500" />
            ) : (
              <ToggleLeft className="w-8 h-8 text-gray-400" />
            )}
            <div className="text-right">
              <p className="text-sm font-medium text-gray-800">
                {profile?.is_online ? 'Online' : 'Offline'}
              </p>
              <p className="text-xs text-gray-500">
                {profile?.is_online ? 'Available for bookings' : 'Not accepting bookings'}
              </p>
            </div>
          </button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{stats.newInquiries}</p>
                <p className="text-sm text-gray-600">New Inquiries</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{stats.confirmedBookings}</p>
                <p className="text-sm text-gray-600">Confirmed</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{stats.completedSessions}</p>
                <p className="text-sm text-gray-600">This Month</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <span className="text-yellow-600 font-bold">★</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{stats.rating}</p>
                <p className="text-sm text-gray-600">Rating</p>
              </div>
            </div>
          </div>
        </div>

        {/* Today's Sessions */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Today's Sessions</h2>
          </div>
          
          {todaySessions.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {todaySessions.map((session) => (
                <div key={session.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-purple-primary font-semibold text-sm">
                          {(session.client?.display_name || session.client?.full_name || 'U').charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">
                          {session.client?.display_name || session.client?.full_name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {session.pet?.name} • {session.service?.title || 'Session'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-semibold text-gray-800">
                        {session.scheduled_time ? new Date(`2000-01-01T${session.scheduled_time}`).toLocaleTimeString('en-US', { 
                          hour: 'numeric', 
                          minute: '2-digit', 
                          hour12: true 
                        }) : 'TBD'}
                      </p>
                      <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        Confirmed
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-800 mb-1">No sessions today</h3>
              <p className="text-gray-600 text-sm">Enjoy your free day!</p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
          
          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center space-x-3 p-3 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors">
              <Settings className="w-5 h-5 text-purple-primary" />
              <span className="text-sm font-medium text-gray-800">Update Profile</span>
            </button>
            
            <button className="flex items-center space-x-3 p-3 bg-teal-50 rounded-xl hover:bg-teal-100 transition-colors">
              <MessageCircle className="w-5 h-5 text-teal-600" />
              <span className="text-sm font-medium text-gray-800">Go to Chat</span>
            </button>
            
            <button className="flex items-center space-x-3 p-3 bg-peach-50 rounded-xl hover:bg-peach-100 transition-colors">
              <Play className="w-5 h-5 text-peach-600" />
              <span className="text-sm font-medium text-gray-800">Start Session</span>
            </button>
            
            <button className="flex items-center space-x-3 p-3 bg-lavender-50 rounded-xl hover:bg-lavender-100 transition-colors">
              <Calendar className="w-5 h-5 text-lavender-600" />
              <span className="text-sm font-medium text-gray-800">View Calendar</span>
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Recent Activity</h2>
          </div>
          
          <div className="p-4 space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Sarah Johnson</span> booked a session for Luna
              </p>
              <span className="text-xs text-gray-400">2h ago</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <p className="text-sm text-gray-600">
                New inquiry from <span className="font-medium">Maria Santos</span>
              </p>
              <span className="text-xs text-gray-400">4h ago</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <p className="text-sm text-gray-600">
                Session completed with <span className="font-medium">Emily Rodriguez</span>
              </p>
              <span className="text-xs text-gray-400">1d ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;