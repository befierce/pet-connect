/*
  # Fix RLS policies for profiles table

  1. Security Changes
    - Drop existing policies that use incorrect uid() function
    - Create new policies using correct auth.uid() function
    - Allow authenticated users to insert and update their own profiles
    - Allow authenticated users to view all profiles

  This fixes the RLS policy violations preventing profile creation and updates.
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Allow authenticated users to create their own profile" ON profiles;
DROP POLICY IF EXISTS "Allow authenticated users to update their own profile" ON profiles;
DROP POLICY IF EXISTS "Allow authenticated users to view profiles" ON profiles;

-- Create new policies with correct auth.uid() function
CREATE POLICY "Users can insert their own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view all profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (true);