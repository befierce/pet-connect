/*
  # Complete PetConnect Database Schema

  1. New Tables
    - `profiles` - User profiles for communicators and pet parents
    - `pets` - Pet information owned by users
    - `services` - Services offered by communicators
    - `bookings` - Session bookings between clients and communicators
    - `messages` - Messages within booking conversations
    - `session_notes` - Notes from completed sessions
    - `certifications` - Communicator certifications
    - `reviews` - Client reviews for communicators
    - `inquiries` - Initial inquiries from clients

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies for data access
    - Ensure users can only access their own data

  3. Functions
    - Add trigger function for updating timestamps
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    display_name TEXT,
    role TEXT NOT NULL CHECK (role IN ('communicator', 'parent')),
    bio TEXT,
    experience TEXT,
    location TEXT,
    profile_picture TEXT,
    phone_number TEXT,
    timezone TEXT DEFAULT 'America/New_York',
    is_online BOOLEAN DEFAULT false,
    is_verified BOOLEAN DEFAULT false,
    experience_level TEXT CHECK (experience_level IN ('beginner', 'intermediate', 'expert')),
    animal_types TEXT[] DEFAULT '{}',
    service_categories TEXT[] DEFAULT '{}',
    social_links JSONB DEFAULT '{}',
    contact_methods JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pets table
CREATE TABLE IF NOT EXISTS pets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    breed TEXT,
    age INTEGER,
    gender TEXT,
    photo TEXT,
    special_needs TEXT,
    personality_traits TEXT[],
    medical_conditions TEXT[],
    behavioral_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Services table
CREATE TABLE IF NOT EXISTS services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    communicator_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    duration INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    service_type TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    communicator_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
    service_id UUID REFERENCES services(id) ON DELETE SET NULL,
    status TEXT NOT NULL DEFAULT 'payment-pending' CHECK (status IN ('payment-pending', 'payment-confirmed', 'scheduled', 'in-progress', 'completed', 'cancelled', 'no-show')),
    scheduled_date DATE,
    scheduled_time TIME,
    duration INTEGER NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    payment_method TEXT,
    payment_proof TEXT,
    transaction_id TEXT,
    paid_at TIMESTAMPTZ,
    platform TEXT CHECK (platform IN ('zoom', 'meet', 'phone', 'in-person')),
    meeting_link TEXT,
    special_requests TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file', 'system')),
    attachments TEXT[],
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Session notes table
CREATE TABLE IF NOT EXISTS session_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    communicator_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    pre_session_notes TEXT,
    session_summary TEXT,
    insights TEXT,
    recommendations TEXT,
    private_notes TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    follow_up_needed BOOLEAN DEFAULT false,
    next_steps TEXT[],
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Certifications table
CREATE TABLE IF NOT EXISTS certifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    issuer TEXT NOT NULL,
    issue_date DATE NOT NULL,
    certificate_image TEXT,
    is_verified BOOLEAN DEFAULT false,
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    communicator_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    is_public BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inquiries table
CREATE TABLE IF NOT EXISTS inquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    communicator_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    pet_name TEXT NOT NULL,
    pet_type TEXT NOT NULL,
    service_type TEXT NOT NULL,
    message TEXT NOT NULL,
    preferred_time TEXT,
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'active', 'declined', 'converted')),
    is_urgent BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

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

-- Create triggers for updated_at columns
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pets_updated_at BEFORE UPDATE ON pets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_session_notes_updated_at BEFORE UPDATE ON session_notes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_inquiries_updated_at BEFORE UPDATE ON inquiries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

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
CREATE POLICY "Users can view public profiles" ON profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Pets policies
CREATE POLICY "Pet owners can manage their pets" ON pets FOR ALL TO authenticated USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Communicators can view pets in their bookings" ON pets FOR SELECT TO authenticated USING (
    EXISTS (
        SELECT 1 FROM bookings 
        WHERE bookings.pet_id = pets.id 
        AND bookings.communicator_id = auth.uid()
    )
);

-- Services policies
CREATE POLICY "Anyone can view active services" ON services FOR SELECT TO authenticated USING (is_active = true);
CREATE POLICY "Communicators can manage their services" ON services FOR ALL TO authenticated USING (auth.uid() = communicator_id) WITH CHECK (auth.uid() = communicator_id);

-- Bookings policies
CREATE POLICY "Users can view their bookings" ON bookings FOR SELECT TO authenticated USING (auth.uid() = client_id OR auth.uid() = communicator_id);
CREATE POLICY "Clients can create bookings" ON bookings FOR INSERT TO authenticated WITH CHECK (auth.uid() = client_id);
CREATE POLICY "Users can update their bookings" ON bookings FOR UPDATE TO authenticated USING (auth.uid() = client_id OR auth.uid() = communicator_id) WITH CHECK (auth.uid() = client_id OR auth.uid() = communicator_id);

-- Messages policies
CREATE POLICY "Users can view messages in their bookings" ON messages FOR SELECT TO authenticated USING (
    EXISTS (
        SELECT 1 FROM bookings 
        WHERE bookings.id = messages.booking_id 
        AND (bookings.client_id = auth.uid() OR bookings.communicator_id = auth.uid())
    )
);
CREATE POLICY "Users can send messages in their bookings" ON messages FOR INSERT TO authenticated WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
        SELECT 1 FROM bookings 
        WHERE bookings.id = messages.booking_id 
        AND (bookings.client_id = auth.uid() OR bookings.communicator_id = auth.uid())
    )
);
CREATE POLICY "Users can update their messages" ON messages FOR UPDATE TO authenticated USING (auth.uid() = sender_id) WITH CHECK (auth.uid() = sender_id);

-- Session notes policies
CREATE POLICY "Communicators can manage session notes" ON session_notes FOR ALL TO authenticated USING (auth.uid() = communicator_id) WITH CHECK (auth.uid() = communicator_id);
CREATE POLICY "Clients can view session notes for their bookings" ON session_notes FOR SELECT TO authenticated USING (
    EXISTS (
        SELECT 1 FROM bookings 
        WHERE bookings.id = session_notes.booking_id 
        AND bookings.client_id = auth.uid()
    )
);

-- Certifications policies
CREATE POLICY "Users can manage their certifications" ON certifications FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Anyone can view verified certifications" ON certifications FOR SELECT TO authenticated USING (is_verified = true);

-- Reviews policies
CREATE POLICY "Anyone can view public reviews" ON reviews FOR SELECT TO authenticated USING (is_public = true);
CREATE POLICY "Clients can create reviews for their bookings" ON reviews FOR INSERT TO authenticated WITH CHECK (
    auth.uid() = client_id AND
    EXISTS (
        SELECT 1 FROM bookings 
        WHERE bookings.id = reviews.booking_id 
        AND bookings.client_id = auth.uid() 
        AND bookings.status = 'completed'
    )
);
CREATE POLICY "Users can update their reviews" ON reviews FOR UPDATE TO authenticated USING (auth.uid() = client_id) WITH CHECK (auth.uid() = client_id);

-- Inquiries policies
CREATE POLICY "Users can view their inquiries" ON inquiries FOR SELECT TO authenticated USING (auth.uid() = client_id OR auth.uid() = communicator_id);
CREATE POLICY "Clients can create inquiries" ON inquiries FOR INSERT TO authenticated WITH CHECK (auth.uid() = client_id);
CREATE POLICY "Users can update their inquiries" ON inquiries FOR UPDATE TO authenticated USING (auth.uid() = client_id OR auth.uid() = communicator_id) WITH CHECK (auth.uid() = client_id OR auth.uid() = communicator_id);