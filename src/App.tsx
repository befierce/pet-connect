import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { OnboardingProvider } from './contexts/OnboardingContext';

// Auth Components
import WelcomeScreen from './components/auth/WelcomeScreen';
import LoginScreen from './components/auth/LoginScreen';
import SignupScreen from './components/auth/SignupScreen';

// Onboarding Components
import OnboardingFlow from './components/onboarding/OnboardingFlow';

// Main App Components
import Dashboard from './components/dashboard/Dashboard';
import InquiriesModule from './components/inquiries/InquiriesModule';
import BookingsModule from './components/bookings/BookingsModule';
import ProfileModule from './components/profile/ProfileModule';
import BottomNavigation from './components/navigation/BottomNavigation';

// Layout Component
const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-cream font-inter">
      <main className="pb-20">{children}</main>
      <BottomNavigation />
    </div>
  );
};

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isProfileComplete, loading, profile } = useAuth();
  const location = useLocation();

  console.log("🛡️ === PROTECTED ROUTE RENDER ===", {
    timestamp: new Date().toISOString(),
    pathname: location.pathname,
    userExists: !!user,
    userId: user?.id,
    userEmail: user?.email,
    isProfileComplete,
    loading,
    profileExists: !!profile,
    profileSummary: profile ? {
      id: profile.id,
      email: profile.email,
      role: profile.role,
      display_name: profile.display_name,
      location: profile.location,
      experience_level: profile.experience_level,
      contact_methods: profile.contact_methods,
      hasRequiredFields: !!(profile.role && profile.display_name && profile.location && profile.experience_level)
    } : null
  });

  if (loading) {
    console.log("⏳ ProtectedRoute: Still loading, showing spinner", {
      pathname: location.pathname,
      timestamp: new Date().toISOString()
    });
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sage mx-auto mb-4"></div>
          <p className="text-gray-700">Loading your account...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/welcome" replace />;
  }

  if (user && !isProfileComplete) {
    return <Navigate to="/onboarding" replace />;
  }

  return <AppLayout>{children}</AppLayout>;
};

// Auth Route Component
const AuthRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isProfileComplete, loading } = useAuth();
  const location = useLocation();

  console.log("🔐 === AUTH ROUTE RENDER ===", {
    timestamp: new Date().toISOString(),
    pathname: location.pathname,
    userExists: !!user,
    userId: user?.id,
    userEmail: user?.email,
    isProfileComplete,
    loading,
  });

  // Show loading for auth-dependent routes
  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sage mx-auto mb-4"></div>
          <p className="text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }

  // Onboarding route checks
  if (location.pathname === '/onboarding') {
    if (!user) {
      return <Navigate to="/welcome" replace />;
    }
    if (isProfileComplete) {
      return <Navigate to="/dashboard" replace />;
    }
    return <>{children}</>;
  }

  // For welcome route, always allow
  if (location.pathname === '/welcome') {
    return <>{children}</>;
  }

  // For login/signup routes, redirect if already authenticated
  if (location.pathname === '/login' || location.pathname === '/signup') {
    if (user) {
      if (isProfileComplete) {
        return <Navigate to="/dashboard" replace />;
      } else {
        return <Navigate to="/onboarding" replace />;
      }
    }
    return <>{children}</>;
  }

  return <>{children}</>;
};

function AppContent() {
  return (
    <Router>
      <Routes>
        {/* Public Welcome (unguarded, always available) */}
        <Route path="/welcome" element={<WelcomeScreen />} />

        {/* Auth Routes */}
        <Route path="/login" element={<AuthRoute><LoginScreen /></AuthRoute>} />
        <Route path="/signup" element={<AuthRoute><SignupScreen /></AuthRoute>} />

        {/* Onboarding Route */}
        <Route
          path="/onboarding"
          element={
            <AuthRoute>
              <OnboardingProvider>
                <OnboardingFlow />
              </OnboardingProvider>
            </AuthRoute>
          }
        />

        {/* Protected Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/inquiries/*" element={<ProtectedRoute><InquiriesModule /></ProtectedRoute>} />
        <Route path="/bookings/*" element={<ProtectedRoute><BookingsModule /></ProtectedRoute>} />
        <Route path="/profile/*" element={<ProtectedRoute><ProfileModule /></ProtectedRoute>} />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/welcome" replace />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
