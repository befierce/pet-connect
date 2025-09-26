import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const SignupScreen: React.FC = () => {
  const navigate = useNavigate();
  const { signUp, user, loading, error: authError } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Navigate to onboarding when user is authenticated
  useEffect(() => {
    if (user && !loading && !isLoading) {
      console.log('User authenticated, navigating to onboarding...');
      navigate('/onboarding', { replace: true });
    }
  }, [user, loading, navigate, isLoading]);

  // Redirect if already authenticated
  if (user && !loading) {
    return <Navigate to="/onboarding" replace />;
  }

  const validateField = (name: string, value: string) => {
    const errors: Record<string, string> = {};

    switch (name) {
      case 'name':
        if (!value.trim()) {
          errors.name = 'Full name is required';
        } else if (value.trim().length < 2) {
          errors.name = 'Name must be at least 2 characters';
        }
        break;
      case 'email':
        if (!value.trim()) {
          errors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errors.email = 'Please enter a valid email address';
        }
        break;
      case 'password':
        if (!value) {
          errors.password = 'Password is required';
        } else if (value.length < 6) {
          errors.password = 'Password must be at least 6 characters';
        } else if (!/(?=.*[a-z])(?=.*[A-Z])/.test(value)) {
          errors.password = 'Password must contain both uppercase and lowercase letters';
        }
        break;
      case 'confirmPassword':
        if (!value) {
          errors.confirmPassword = 'Please confirm your password';
        } else if (value !== formData.password) {
          errors.confirmPassword = 'Passwords do not match';
        }
        break;
    }

    return errors;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear general error when user starts typing
    if (error) setError('');

    // Validate field and update validation errors
    const fieldErrors = validateField(name, value);
    setValidationErrors(prev => ({
      ...prev,
      ...fieldErrors,
      // Clear error for this field if validation passes
      ...(Object.keys(fieldErrors).length === 0 ? { [name]: '' } : {})
    }));

    // Also validate confirmPassword when password changes
    if (name === 'password' && formData.confirmPassword) {
      const confirmErrors = validateField('confirmPassword', formData.confirmPassword);
      setValidationErrors(prev => ({
        ...prev,
        ...confirmErrors
      }));
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    // Validate all fields
    Object.entries(formData).forEach(([key, value]) => {
      const fieldErrors = validateField(key, value);
      Object.assign(errors, fieldErrors);
    });

    // Check terms acceptance
    if (!termsAccepted) {
      setError('Please accept the terms and conditions');
      return false;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setError('');

    try {
      const result = await signUp(formData.email, formData.password, formData.name);
      
      if (result.user) {
        // Success will be handled by useEffect redirect
        console.log('Signup successful');
      } else {
        setError('Account creation failed. Please try again.');
      }
    } catch (err: any) {
      console.error('Signup error:', err);
      
      // Handle specific error cases
      if (err.message?.includes('User already registered')) {
        setError('An account with this email already exists. Please sign in instead or use a different email address.');
      } else if (err.message?.includes('Password should be at least 6 characters')) {
        setError('Password must be at least 6 characters long.');
      } else if (err.message?.includes('Signup requires a valid password')) {
        setError('Please enter a valid password.');
      } else {
        setError(err.message || 'Failed to create account. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = Object.values(formData).every(value => value.trim()) &&
                     Object.values(validationErrors).every(error => !error) &&
                     termsAccepted;

  const getInputClassName = (fieldName: string) => {
    const baseClass = "w-full pl-12 pr-4 py-4 border rounded-xl focus:ring-2 focus:ring-purple-primary focus:border-transparent bg-white text-base transition-colors";
    const hasError = validationErrors[fieldName];
    
    if (hasError) {
      return `${baseClass} border-red-300 bg-red-50`;
    }
    
    const hasValue = formData[fieldName as keyof typeof formData].trim();
    if (hasValue && !hasError) {
      return `${baseClass} border-green-300 bg-green-50`;
    }
    
    return `${baseClass} border-gray-200`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-lavender-50 via-cream to-peach-50 p-6 flex flex-col items-center justify-center">
      <div className="max-w-sm w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 font-poppins">Join PetConnect</h1>
          <p className="text-gray-600">Create your account to get started</p>
        </div>
        
        {/* Error Display */}
        {(error || authError) && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-red-800 text-sm font-medium">Registration Error</p>
              <p className="text-red-700 text-sm mt-1">{error || authError}</p>
            </div>
          </div>
        )}

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={getInputClassName('name')}
                placeholder="Enter your full name"
                required
                autoComplete="name"
              />
              {formData.name.trim() && !validationErrors.name && (
                <CheckCircle className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
              )}
            </div>
            {validationErrors.name && (
              <p className="text-red-600 text-xs mt-1 flex items-center">
                <AlertCircle className="w-3 h-3 mr-1" />
                {validationErrors.name}
              </p>
            )}
          </div>

          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={getInputClassName('email')}
                placeholder="Enter your email"
                required
                autoComplete="email"
              />
              {formData.email.trim() && !validationErrors.email && (
                <CheckCircle className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
              )}
            </div>
            {validationErrors.email && (
              <p className="text-red-600 text-xs mt-1 flex items-center">
                <AlertCircle className="w-3 h-3 mr-1" />
                {validationErrors.email}
              </p>
            )}
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password *
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={getInputClassName('password')}
                placeholder="Create a secure password"
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {validationErrors.password && (
              <p className="text-red-600 text-xs mt-1 flex items-center">
                <AlertCircle className="w-3 h-3 mr-1" />
                {validationErrors.password}
              </p>
            )}
            <div className="mt-2 text-xs text-gray-500">
              Password must be at least 6 characters with uppercase and lowercase letters
            </div>
          </div>

          {/* Confirm Password Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password *
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={getInputClassName('confirmPassword')}
                placeholder="Confirm your password"
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {validationErrors.confirmPassword && (
              <p className="text-red-600 text-xs mt-1 flex items-center">
                <AlertCircle className="w-3 h-3 mr-1" />
                {validationErrors.confirmPassword}
              </p>
            )}
          </div>

          {/* Terms Agreement */}
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="terms"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="mt-1 w-4 h-4 text-purple-primary border-gray-300 rounded focus:ring-purple-primary"
            />
            <label htmlFor="terms" className="text-sm text-gray-600">
              I agree to the{' '}
              <button type="button" className="text-purple-primary hover:underline font-medium">
                Terms of Service
              </button>{' '}
              and{' '}
              <button type="button" className="text-purple-primary hover:underline font-medium">
                Privacy Policy
              </button>
            </label>
          </div>

          {/* Sign Up Button */}
          <button
            type="submit"
            disabled={isLoading || !isFormValid}
            className="w-full bg-purple-primary text-white py-4 rounded-xl font-semibold shadow-soft hover:bg-purple-dark transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* Sign In Link */}
        <div className="text-center mt-8 pt-6 border-t border-gray-200">
          <p className="text-gray-600 text-sm">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-purple-primary font-semibold hover:underline"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupScreen;