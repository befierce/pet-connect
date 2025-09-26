/*
# Complete Pet Communication Platform Database Schema

This migration creates the complete database schema for the pet communication platform,
including all tables, relationships, security policies, and necessary functions.

## Tables Created:
1. profiles - User profiles for communicators and pet parents
2. pets - Pet information owned by users
3. services - Services offered by communicators
4. bookings - Session bookings between clients and communicators
5. messages - Communication messages within bookings
6. session_notes - Session notes and summaries
7. certifications - Communicator certifications
8. reviews - Client reviews for communicators
9. inquiries - Initial inquiries from clients to communicators

## Security:
- Row Level Security (RLS) enabled on all tables
- Appropriate policies for data access control
- User authentication integration

## Performance:
- Indexes on frequently queried columns
- Optimized foreign key relationships
*/

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- =====================================================
-- PROFILES TABLE - User profiles for the platform
-- =====================================================

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

-- Create indexes for profiles
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_location ON profiles(location);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

-- Enable RLS on profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view public profiles" ON profiles
    FOR SELECT TO authenticated
    USING (true);

CREATE POLICY "Users can insert their own profile" ON profiles
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
    FOR UPDATE TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Create trigger for profiles updated_at
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- PETS TABLE - Pet information
-- =====================================================

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

-- Create indexes for pets
CREATE INDEX IF NOT EXISTS idx_pets_owner_id ON pets(owner_id);

-- Enable RLS on pets
ALTER TABLE pets ENABLE ROW LEVEL SECURITY;

-- Pets policies
CREATE POLICY "Pet owners can manage their pets" ON pets
    FOR ALL TO authenticated
    USING (auth.uid() = owner_id)
    WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Communicators can view pets in their bookings" ON pets
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM bookings 
            WHERE bookings.pet_id = pets.id 
            AND bookings.communicator_id = auth.uid()
        )
    );

-- Create trigger for pets updated_at
CREATE TRIGGER update_pets_updated_at
    BEFORE UPDATE ON pets
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- SERVICES TABLE - Services offered by communicators
-- =====================================================

CREATE TABLE IF NOT EXISTS services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    communicator_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    duration INTEGER NOT NULL, -- in minutes
    price DECIMAL(10,2) NOT NULL,
    service_type TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for services
CREATE INDEX IF NOT EXISTS idx_services_communicator_id ON services(communicator_id);
CREATE INDEX IF NOT EXISTS idx_services_active ON services(is_active);

-- Enable RLS on services
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Services policies
CREATE POLICY "Anyone can view active services" ON services
    FOR SELECT TO authenticated
    USING (is_active = true);

CREATE POLICY "Communicators can manage their services" ON services
    FOR ALL TO authenticated
    USING (auth.uid() = communicator_id)
    WITH CHECK (auth.uid() = communicator_id);

-- Create trigger for services updated_at
CREATE TRIGGER update_services_updated_at
    BEFORE UPDATE ON services
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- BOOKINGS TABLE - Session bookings
-- =====================================================

CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    communicator_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
    service_id UUID REFERENCES services(id) ON DELETE SET NULL,
    status TEXT NOT NULL DEFAULT 'payment-pending' CHECK (
        status IN ('payment-pending', 'payment-confirmed', 'scheduled', 'in-progress', 'completed', 'cancelled', 'no-show')
    ),
    scheduled_date DATE,
    scheduled_time TIME,
    duration INTEGER NOT NULL, -- in minutes
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

-- Create indexes for bookings
CREATE INDEX IF NOT EXISTS idx_bookings_client_id ON bookings(client_id);
CREATE INDEX IF NOT EXISTS idx_bookings_communicator_id ON bookings(communicator_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_scheduled_date ON bookings(scheduled_date);

-- Enable RLS on bookings
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Bookings policies
CREATE POLICY "Users can view their bookings" ON bookings
    FOR SELECT TO authenticated
    USING (auth.uid() = client_id OR auth.uid() = communicator_id);

CREATE POLICY "Clients can create bookings" ON bookings
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Users can update their bookings" ON bookings
    FOR UPDATE TO authenticated
    USING (auth.uid() = client_id OR auth.uid() = communicator_id)
    WITH CHECK (auth.uid() = client_id OR auth.uid() = communicator_id);

-- Create trigger for bookings updated_at
CREATE TRIGGER update_bookings_updated_at
    BEFORE UPDATE ON bookings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- MESSAGES TABLE - Communication within bookings
-- =====================================================

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

-- Create indexes for messages
CREATE INDEX IF NOT EXISTS idx_messages_booking_id ON messages(booking_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);

-- Enable RLS on messages
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Messages policies
CREATE POLICY "Users can view messages in their bookings" ON messages
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM bookings 
            WHERE bookings.id = messages.booking_id 
            AND (bookings.client_id = auth.uid() OR bookings.communicator_id = auth.uid())
        )
    );

CREATE POLICY "Users can send messages in their bookings" ON messages
    FOR INSERT TO authenticated
    WITH CHECK (
        auth.uid() = sender_id AND
        EXISTS (
            SELECT 1 FROM bookings 
            WHERE bookings.id = messages.booking_id 
            AND (bookings.client_id = auth.uid() OR bookings.communicator_id = auth.uid())
        )
    );

CREATE POLICY "Users can update their messages" ON messages
    FOR UPDATE TO authenticated
    USING (auth.uid() = sender_id)
    WITH CHECK (auth.uid() = sender_id);

-- =====================================================
-- SESSION_NOTES TABLE - Session notes and summaries
-- =====================================================

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

-- Create indexes for session_notes
CREATE INDEX IF NOT EXISTS idx_session_notes_booking_id ON session_notes(booking_id);

-- Enable RLS on session_notes
ALTER TABLE session_notes ENABLE ROW LEVEL SECURITY;

-- Session notes policies
CREATE POLICY "Communicators can manage session notes" ON session_notes
    FOR ALL TO authenticated
    USING (auth.uid() = communicator_id)
    WITH CHECK (auth.uid() = communicator_id);

CREATE POLICY "Clients can view session notes for their bookings" ON session_notes
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM bookings 
            WHERE bookings.id = session_notes.booking_id 
            AND bookings.client_id = auth.uid()
        )
    );

-- Create trigger for session_notes updated_at
CREATE TRIGGER update_session_notes_updated_at
    BEFORE UPDATE ON session_notes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- CERTIFICATIONS TABLE - Communicator certifications
-- =====================================================

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

-- Create indexes for certifications
CREATE INDEX IF NOT EXISTS idx_certifications_user_id ON certifications(user_id);

-- Enable RLS on certifications
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;

-- Certifications policies
CREATE POLICY "Users can manage their certifications" ON certifications
    FOR ALL TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anyone can view verified certifications" ON certifications
    FOR SELECT TO authenticated
    USING (is_verified = true);

-- =====================================================
-- REVIEWS TABLE - Client reviews for communicators
-- =====================================================

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

-- Create indexes for reviews
CREATE INDEX IF NOT EXISTS idx_reviews_communicator_id ON reviews(communicator_id);

-- Enable RLS on reviews
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Reviews policies
CREATE POLICY "Anyone can view public reviews" ON reviews
    FOR SELECT TO authenticated
    USING (is_public = true);

CREATE POLICY "Clients can create reviews for their bookings" ON reviews
    FOR INSERT TO authenticated
    WITH CHECK (
        auth.uid() = client_id AND
        EXISTS (
            SELECT 1 FROM bookings 
            WHERE bookings.id = reviews.booking_id 
            AND bookings.client_id = auth.uid() 
            AND bookings.status = 'completed'
        )
    );

CREATE POLICY "Users can update their reviews" ON reviews
    FOR UPDATE TO authenticated
    USING (auth.uid() = client_id)
    WITH CHECK (auth.uid() = client_id);

-- =====================================================
-- INQUIRIES TABLE - Initial inquiries from clients
-- =====================================================

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

-- Create indexes for inquiries
CREATE INDEX IF NOT EXISTS idx_inquiries_communicator_id ON inquiries(communicator_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON inquiries(status);

-- Enable RLS on inquiries
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

-- Inquiries policies
CREATE POLICY "Users can view their inquiries" ON inquiries
    FOR SELECT TO authenticated
    USING (auth.uid() = client_id OR auth.uid() = communicator_id);

CREATE POLICY "Clients can create inquiries" ON inquiries
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Users can update their inquiries" ON inquiries
    FOR UPDATE TO authenticated
    USING (auth.uid() = client_id OR auth.uid() = communicator_id)
    WITH CHECK (auth.uid() = client_id OR auth.uid() = communicator_id);

-- Create trigger for inquiries updated_at
CREATE TRIGGER update_inquiries_updated_at
    BEFORE UPDATE ON inquiries
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- SAMPLE DATA INSERTION (Optional - for testing)
-- =====================================================

-- Note: This section is commented out by default
-- Uncomment and modify as needed for testing purposes

/*
-- Insert sample communicator profile (replace with actual user ID from auth.users)
INSERT INTO profiles (id, email, full_name, display_name, role, bio, location, experience_level, animal_types, service_categories, contact_methods)
VALUES (
    'your-user-id-here', -- Replace with actual user ID
    'communicator@example.com',
    'Sarah Johnson',
    'Sarah',
    'communicator',
    'Experienced animal communicator specializing in trauma healing and behavioral issues.',
    'San Francisco, CA',
    'expert',
    ARRAY['dogs', 'cats', 'horses'],
    ARRAY['communication', 'trauma-healing', 'behavioral'],
    '{"email": true, "phone": true, "video": true}'::jsonb
) ON CONFLICT (id) DO NOTHING;

-- Insert sample service
INSERT INTO services (communicator_id, title, description, duration, price, service_type)
VALUES (
    'your-user-id-here', -- Replace with actual user ID
    'Animal Communication Session',
    'Connect with your pet to understand their thoughts, feelings, and needs.',
    60,
    120.00,
    'communication'
) ON CONFLICT DO NOTHING;
*/

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE 'Database schema setup completed successfully!';
    RAISE NOTICE 'Tables created: profiles, pets, services, bookings, messages, session_notes, certifications, reviews, inquiries';
    RAISE NOTICE 'Row Level Security enabled on all tables';
    RAISE NOTICE 'Indexes and triggers created for optimal performance';
END $$;