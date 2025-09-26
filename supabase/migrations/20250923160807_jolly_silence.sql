/*
  # Fix RLS policies for profiles table

  1. Security Updates
    - Drop existing policies that use incorrect uid() function
    - Create new policies using correct auth.uid() function
    - Ensure authenticated users can create and update their own profiles
    - Allow authenticated users to view all profiles (needed for app functionality)

  2. Policy Changes
    - INSERT: Allow users to create profiles with their own auth.uid()
    - UPDATE: Allow users to update only their own profiles
    - SELECT: Allow authenticated users to view profiles (for communicator discovery)
*/

-- Drop existing policies that have incorrect syntax
DROP POLICY IF EXISTS "Allow authenticated users to create their own profile" ON profiles;
DROP POLICY IF EXISTS "Allow authenticated users to update their own profile" ON profiles;
DROP POLICY IF EXISTS "Allow authenticated users to view profiles" ON profiles;

-- Create corrected policies using auth.uid() instead of uid()
CREATE POLICY "Allow authenticated users to create their own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Allow authenticated users to update their own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Allow authenticated users to view profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (true);