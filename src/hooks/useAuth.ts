import { useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase, Profile, createProfile, getProfile, updateProfile as updateProfileDb } from '../lib/supabase'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    const handleInitialAuth = async () => {
      try {
        console.log('🔄 Starting initial auth check...')
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()

        if (!mounted) return

        if (sessionError) {
          console.error('❌ Session error:', sessionError)
          setError(sessionError.message)
          setUser(null)
          setProfile(null)
        } else if (session?.user) {
          console.log('✅ Session found, user:', session.user.id)
          setUser(session.user)
          await fetchProfile(session.user.id)
        } else {
          console.log('ℹ️ No active session')
          setUser(null)
          setProfile(null)
        }
      } catch (err) {
        console.error('💥 Initial auth error:', err)
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Authentication error')
          setUser(null)
          setProfile(null)
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    handleInitialAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return

        console.log('🔄 Auth state change:', event, session?.user?.id)
        
        try {
          setError(null)
          setUser(session?.user ?? null)

          if (session?.user) {
            await fetchProfile(session.user.id)
          } else {
            setProfile(null)
          }
        } catch (err) {
          console.error('❌ Auth state change error:', err)
          setError(err instanceof Error ? err.message : 'Authentication error')
          setProfile(null)
        } finally {
          setLoading(false)
        }
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const fetchProfile = async (userId: string) => {
    try {
      console.log('🔄 Fetching profile for user:', userId)
      const profileData = await getProfile(userId)
      
      if (profileData) {
        console.log('✅ Profile found:', profileData.id)
        setProfile(profileData)
      } else {
        console.log('ℹ️ No profile found, user needs onboarding')
        setProfile(null)
      }
    } catch (err) {
      console.error('❌ Profile fetch error:', err)
      setProfile(null)
      throw err
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('🔄 Signing in user:', email)
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email: email.trim().toLowerCase(), 
        password 
      })
      
      if (error) {
        console.error('❌ Sign in error:', error)
        throw error
      }
      
      console.log('✅ Sign in successful:', data.user?.id)
      return data
    } catch (err) {
      console.error('💥 Sign in failed:', err)
      setError(err instanceof Error ? err.message : 'Sign in failed')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('🔄 Signing up user:', typeof(email))
      console.log('🔄 Signing up user:', typeof(password))
      console.log('🔄 Signing up user:', typeof(fullName))
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase()!,
        password,
        options: { 
          data: { 
            full_name: fullName.trim() 
          } 
        },
      })

      if (error) {
        console.error('❌ Sign up error:', error)
        throw error
      }

      if (data.user) {
        console.log('✅ User created:', data.user.id)
        
        // Create profile immediately
        try {
          const profileData = await createProfile(data.user.id, data.user.email!, fullName.trim())
          console.log('✅ Profile created:', profileData.id)
          setProfile(profileData)
        } catch (profileError) {
          console.error('❌ Profile creation error:', profileError)
          // Don't throw here, user is created but profile failed
          setProfile(null)
        }
      }

      return data
    } catch (err) {
      console.error('💥 Sign up failed:', err)
      setError(err instanceof Error ? err.message : 'Sign up failed')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      console.log('🔄 Signing out...')
      
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      setUser(null)
      setProfile(null)
      setError(null)
      console.log('✅ Signed out successfully')
    } catch (err) {
      console.error('❌ Sign out error:', err)
      setError(err instanceof Error ? err.message : 'Sign out failed')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) throw new Error('No user logged in')

    try {
      console.log('🔄 Updating profile:', user.id)
      const updatedProfile = await updateProfileDb(user.id, updates)
      setProfile(updatedProfile)
      console.log('✅ Profile updated successfully')
      return updatedProfile
    } catch (err) {
      console.error('❌ Profile update error:', err)
      setError(err instanceof Error ? err.message : 'Profile update failed')
      throw err
    }
  }

  const isProfileComplete = () => {
    if (!profile || loading) return false

    const requiredFields = {
      role: profile.role,
      display_name: profile.display_name,
      location: profile.location,
      experience_level: profile.experience_level,
    }

    const missingFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value || (typeof value === 'string' && value.trim() === ''))
      .map(([key]) => key)

    const hasContactMethods = profile.contact_methods && 
      typeof profile.contact_methods === 'object' &&
      Object.values(profile.contact_methods).some(method => method === true)

    const isComplete = missingFields.length === 0 && 
                      profile.location !== '' && 
                      hasContactMethods

    console.log('🔍 Profile completeness check:', {
      missingFields,
      hasContactMethods,
      isComplete
    })

    return isComplete
  }
  
  return {
    user,
    profile,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    updateProfile,
    isProfileComplete: isProfileComplete(),
  }
}