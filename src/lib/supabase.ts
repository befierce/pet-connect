import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

console.log("env", supabaseUrl);
console.log("env", supabaseAnonKey);
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase environment variables:", {
    url: supabaseUrl ? "Set" : "Missing",
    key: supabaseAnonKey ? "Set" : "Missing",
  });
  throw new Error(
    "Missing Supabase environment variables. Please check your .env file and ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// Database types
export interface Profile {
  id: string;
  email: string;
  full_name: string;
  display_name?: string;
  role: "communicator" | "parent";
  bio?: string;
  experience?: string;
  location?: string;
  profile_picture?: string;
  phone_number?: string;
  timezone?: string;
  is_online?: boolean;
  is_verified?: boolean;
  experience_level?: "beginner" | "intermediate" | "expert";
  animal_types?: string[];
  service_categories?: string[];
  social_links?: Record<string, any>;
  contact_methods?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export interface Pet {
  id: string;
  owner_id: string;
  name: string;
  type: string;
  breed?: string;
  age?: number;
  gender?: string;
  photo?: string;
  special_needs?: string;
  personality_traits?: string[];
  medical_conditions?: string[];
  behavioral_notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Service {
  id: string;
  communicator_id: string;
  title: string;
  description: string;
  duration: number;
  price: number;
  service_type: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Booking {
  id: string;
  client_id: string;
  communicator_id: string;
  pet_id: string;
  service_id?: string;
  status:
    | "payment-pending"
    | "payment-confirmed"
    | "scheduled"
    | "in-progress"
    | "completed"
    | "cancelled"
    | "no-show";
  scheduled_date?: string;
  scheduled_time?: string;
  duration: number;
  amount: number;
  currency?: string;
  payment_method?: string;
  payment_proof?: string;
  transaction_id?: string;
  paid_at?: string;
  platform?: "zoom" | "meet" | "phone" | "in-person";
  meeting_link?: string;
  special_requests?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Message {
  id: string;
  booking_id: string;
  sender_id: string;
  content: string;
  message_type?: "text" | "image" | "file" | "system";
  attachments?: string[];
  is_read?: boolean;
  created_at?: string;
}

export interface SessionNote {
  id: string;
  booking_id: string;
  communicator_id: string;
  pre_session_notes?: string;
  session_summary?: string;
  insights?: string;
  recommendations?: string;
  private_notes?: string;
  rating?: number;
  follow_up_needed?: boolean;
  next_steps?: string[];
  completed_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Inquiry {
  id: string;
  client_id: string;
  communicator_id?: string;
  pet_name: string;
  pet_type: string;
  service_type: string;
  message: string;
  preferred_time?: string;
  status?: "new" | "active" | "declined" | "converted";
  is_urgent?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Review {
  id: string;
  booking_id: string;
  client_id: string;
  communicator_id: string;
  rating: number;
  review_text?: string;
  is_public?: boolean;
  created_at?: string;
}

export interface Certification {
  id: string;
  user_id: string;
  name: string;
  issuer: string;
  issue_date: string;
  certificate_image?: string;
  is_verified?: boolean;
  verified_at?: string;
  created_at?: string;
}

// Helper functions for database operations
export const createProfile = async (
  userId: string,
  email: string,
  fullName: string
) => {
  const { data, error } = await supabase
    .from("profiles")
    .insert({
      id: userId,
      email: email,
      full_name: fullName,
      display_name: fullName,
      role: "communicator",
      location: "",
      experience_level: "beginner",
      contact_methods: {},
      animal_types: [],
      service_categories: [],
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error && error.code !== "PGRST116") throw error;
  return data;
};

export const updateProfile = async (
  userId: string,
  updates: Partial<Profile>
) => {
  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", userId)
    .select()
    .single();

  if (error) throw error;
  return data;
};
