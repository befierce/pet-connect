/*
  # Fix RLS policies for profiles table

  1. Security Updates
    - Drop existing problematic policies
    - Create new policies with correct auth.uid() function
    - Ensure authenticated users can manage their own profiles
    - Allow public viewing of profiles for the app functionality

  2. Policy Changes
    - INSERT: Allow authenticated users to create their own profile
    - UPDATE: Allow authenticated users to update their own profile  
    - SELECT: Allow authenticated users to view all profiles (needed for app functionality)
*/

-- Drop existing policies that may be causing issues
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view public profiles" ON profiles;

-- Create new INSERT policy for authenticated users to create their own profile
CREATE POLICY "Allow authenticated users to create their own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create new UPDATE policy for authenticated users to update their own profile
CREATE POLICY "Allow authenticated users to update their own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create new SELECT policy to allow authenticated users to view profiles
-- This is needed for the app to function properly (viewing other communicators, etc.)
CREATE POLICY "Allow authenticated users to view profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (true);

-- Ensure RLS is enabled on the profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;