-- Disable RLS temporarily to drop existing policies without issues
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- Drop existing policies to ensure a clean slate
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

-- Re-enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create new policies with auth.uid()

-- Policy for INSERT: Allows authenticated users to create their own profile
CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT TO authenticated
WITH CHECK (auth.uid() = id);

-- Policy for UPDATE: Allows authenticated users to update their own profile
CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Policy for SELECT: Allows authenticated users to view all profiles
CREATE POLICY "Users can view all profiles"
ON public.profiles FOR SELECT TO authenticated
USING (true);