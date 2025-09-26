/*
  # Pet Communication Platform Database Schema

  1. New Tables
    - `profiles` - User profiles for pet communicators and pet parents
    - `pets` - Pet information and details
    - `services` - Services offered by communicators
    - `bookings` - Session bookings and appointments
    - `messages` - Communication between users
    - `session_notes` - Notes from completed sessions
    - `certifications` - User certifications and credentials
    - `reviews` - Reviews and ratings for communicators

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Ensure users can only access their own data or public information

  3. Features
    - User authentication integration
    - File storage for images and documents
    - Real-time messaging capabilities
    - Booking and scheduling system
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  display_name text,
  role text NOT NULL CHECK (role IN ('communicator', 'parent')),
  bio text,
  experience text,
  location text,
  profile_picture text,
  phone_number text,
  timezone text DEFAULT 'America/New_York',
  is_online boolean DEFAULT false,
  is_verified boolean DEFAULT false,
  experience_level text CHECK (experience_level IN ('beginner', 'intermediate', 'expert')),
  animal_types text[] DEFAULT '{}',
  service_categories text[] DEFAULT '{}',
  social_links jsonb DEFAULT '{}',
  contact_methods jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Pets table
CREATE TABLE IF NOT EXISTS pets (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  type text NOT NULL,
  breed text,
  age integer,
  gender text,
  photo text,
  special_needs text,
  personality_traits text[],
  medical_conditions text[],
  behavioral_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Services table
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  communicator_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  duration integer NOT NULL, -- in minutes
  price decimal(10,2) NOT NULL,
  service_type text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  communicator_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  pet_id uuid REFERENCES pets(id) ON DELETE CASCADE NOT NULL,
  service_id uuid REFERENCES services(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'payment-pending' CHECK (status IN ('payment-pending', 'payment-confirmed', 'scheduled', 'in-progress', 'completed', 'cancelled', 'no-show')),
  scheduled_date date,
  scheduled_time time,
  duration integer NOT NULL,
  amount decimal(10,2) NOT NULL,
  currency text DEFAULT 'USD',
  payment_method text,
  payment_proof text,
  transaction_id text,
  paid_at timestamptz,
  platform text CHECK (platform IN ('zoom', 'meet', 'phone', 'in-person')),
  meeting_link text,
  special_requests text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id uuid REFERENCES bookings(id) ON DELETE CASCADE NOT NULL,
  sender_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  message_type text DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file', 'system')),
  attachments text[],
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Session notes table
CREATE TABLE IF NOT EXISTS session_notes (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id uuid REFERENCES bookings(id) ON DELETE CASCADE NOT NULL,
  communicator_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  pre_session_notes text,
  session_summary text,
  insights text,
  recommendations text,
  private_notes text,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  follow_up_needed boolean DEFAULT false,
  next_steps text[],
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Certifications table
CREATE TABLE IF NOT EXISTS certifications (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  issuer text NOT NULL,
  issue_date date NOT NULL,
  certificate_image text,
  is_verified boolean DEFAULT false,
  verified_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id uuid REFERENCES bookings(id) ON DELETE CASCADE NOT NULL,
  client_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  communicator_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text text,
  is_public boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Inquiries table (for initial contact before booking)
CREATE TABLE IF NOT EXISTS inquiries (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  communicator_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  pet_name text NOT NULL,
  pet_type text NOT NULL,
  service_type text NOT NULL,
  message text NOT NULL,
  preferred_time text,
  status text DEFAULT 'new' CHECK (status IN ('new', 'active', 'declined', 'converted')),
  is_urgent boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view public profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Pets policies
CREATE POLICY "Pet owners can manage their pets"
  ON pets FOR ALL
  TO authenticated
  USING (auth.uid() = owner_id);

CREATE POLICY "Communicators can view pets in their bookings"
  ON pets FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM bookings 
      WHERE bookings.pet_id = pets.id 
      AND bookings.communicator_id = auth.uid()
    )
  );

-- Services policies
CREATE POLICY "Anyone can view active services"
  ON services FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Communicators can manage their services"
  ON services FOR ALL
  TO authenticated
  USING (auth.uid() = communicator_id);

-- Bookings policies
CREATE POLICY "Users can view their bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (auth.uid() = client_id OR auth.uid() = communicator_id);

CREATE POLICY "Clients can create bookings"
  ON bookings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Users can update their bookings"
  ON bookings FOR UPDATE
  TO authenticated
  USING (auth.uid() = client_id OR auth.uid() = communicator_id);

-- Messages policies
CREATE POLICY "Users can view messages in their bookings"
  ON messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM bookings 
      WHERE bookings.id = messages.booking_id 
      AND (bookings.client_id = auth.uid() OR bookings.communicator_id = auth.uid())
    )
  );

CREATE POLICY "Users can send messages in their bookings"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM bookings 
      WHERE bookings.id = booking_id 
      AND (bookings.client_id = auth.uid() OR bookings.communicator_id = auth.uid())
    )
  );

CREATE POLICY "Users can update their messages"
  ON messages FOR UPDATE
  TO authenticated
  USING (auth.uid() = sender_id);

-- Session notes policies
CREATE POLICY "Communicators can manage session notes"
  ON session_notes FOR ALL
  TO authenticated
  USING (auth.uid() = communicator_id);

CREATE POLICY "Clients can view session notes for their bookings"
  ON session_notes FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM bookings 
      WHERE bookings.id = session_notes.booking_id 
      AND bookings.client_id = auth.uid()
    )
  );

-- Certifications policies
CREATE POLICY "Anyone can view verified certifications"
  ON certifications FOR SELECT
  TO authenticated
  USING (is_verified = true);

CREATE POLICY "Users can manage their certifications"
  ON certifications FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Reviews policies
CREATE POLICY "Anyone can view public reviews"
  ON reviews FOR SELECT
  TO authenticated
  USING (is_public = true);

CREATE POLICY "Clients can create reviews for their bookings"
  ON reviews FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = client_id AND
    EXISTS (
      SELECT 1 FROM bookings 
      WHERE bookings.id = booking_id 
      AND bookings.client_id = auth.uid()
      AND bookings.status = 'completed'
    )
  );

CREATE POLICY "Users can update their reviews"
  ON reviews FOR UPDATE
  TO authenticated
  USING (auth.uid() = client_id);

-- Inquiries policies
CREATE POLICY "Users can view their inquiries"
  ON inquiries FOR SELECT
  TO authenticated
  USING (auth.uid() = client_id OR auth.uid() = communicator_id);

CREATE POLICY "Clients can create inquiries"
  ON inquiries FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Users can update their inquiries"
  ON inquiries FOR UPDATE
  TO authenticated
  USING (auth.uid() = client_id OR auth.uid() = communicator_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_location ON profiles(location);
CREATE INDEX IF NOT EXISTS idx_pets_owner_id ON pets(owner_id);
CREATE INDEX IF NOT EXISTS idx_services_communicator_id ON services(communicator_id);
CREATE INDEX IF NOT EXISTS idx_services_active ON services(is_active);
CREATE INDEX IF NOT EXISTS idx_bookings_client_id ON bookings(client_id);
CREATE INDEX IF NOT EXISTS idx_bookings_communicator_id ON bookings(communicator_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_scheduled_date ON bookings(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_messages_booking_id ON messages(booking_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_session_notes_booking_id ON session_notes(booking_id);
CREATE INDEX IF NOT EXISTS idx_certifications_user_id ON certifications(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_communicator_id ON reviews(communicator_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_communicator_id ON inquiries(communicator_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON inquiries(status);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pets_updated_at BEFORE UPDATE ON pets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_session_notes_updated_at BEFORE UPDATE ON session_notes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_inquiries_updated_at BEFORE UPDATE ON inquiries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();