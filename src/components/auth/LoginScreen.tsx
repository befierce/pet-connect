import React, { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { Eye, EyeOff, Mail, Lock, AlertCircle } from 'lucide-react'

const LoginScreen: React.FC = () => {
  const { signIn, user, loading, isProfileComplete, error: authError } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  // Redirect if already authenticated
  if (user && !loading) {
    if (isProfileComplete) {
      return <Navigate to="/dashboard" replace />
    } else {
      return <Navigate to="/onboarding" replace />
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    // Clear errors when user starts typing
    if (error) setError(null)
  }

  const validateForm = () => {
    if (!formData.email.trim()) {
      setError('Email is required')
      return false
    }
    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address')
      return false
    }
    if (!formData.password) {
      setError('Password is required')
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    try {
      setIsLoading(true)
      setError(null)
      
      await signIn(formData.email, formData.password)
      // Navigation will be handled by the redirect logic above
    } catch (err: any) {
      console.error('Login error:', err)
      
      // Handle specific error messages
      if (err.message?.includes('Invalid login credentials')) {
        setError('Invalid email or password. Please check your credentials and try again.')
      } else if (err.message?.includes('Email not confirmed')) {
        setError('Please check your email and click the confirmation link before signing in.')
      } else if (err.message?.includes('Too many requests')) {
        setError('Too many login attempts. Please wait a moment before trying again.')
      } else {
        setError(err.message || 'An error occurred during sign in. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const isFormValid = formData.email.trim() && formData.password

  return (
    <div className="min-h-screen bg-gradient-to-br from-lavender-50 via-cream to-peach-50 flex items-center justify-center p-6">
      <div className="max-w-sm w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 font-poppins">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your PetConnect account</p>
        </div>

        {/* Error Display */}
        {(error || authError) && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-red-800 text-sm font-medium">Sign In Error</p>
              <p className="text-red-700 text-sm mt-1">{error || authError}</p>
            </div>
          </div>
        )}

        {/* Sign In Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-primary focus:border-transparent bg-white text-base"
                placeholder="Enter your email"
                required
                autoComplete="email"
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-12 pr-12 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-primary focus:border-transparent bg-white text-base"
                placeholder="Enter your password"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={isLoading || !isFormValid}
            className="w-full bg-purple-primary text-white py-4 rounded-xl font-semibold shadow-soft hover:bg-purple-dark transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Forgot Password Link */}
        <div className="text-center mt-6">
          <button
            type="button"
            className="text-purple-primary hover:underline text-sm font-medium"
            onClick={() => {
              // TODO: Implement forgot password functionality
              alert('Forgot password functionality coming soon!')
            }}
          >
            Forgot your password?
          </button>
        </div>

        {/* Sign Up Link */}
        <div className="text-center mt-8 pt-6 border-t border-gray-200">
          <p className="text-gray-600 text-sm">
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/signup')}
              className="text-purple-primary font-semibold hover:underline"
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginScreen