-- Create role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policy for user_roles (admins can view all)
CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Create applications table
CREATE TABLE public.applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    
    -- Main Info
    first_name TEXT NOT NULL,
    middle_name TEXT,
    last_name TEXT NOT NULL,
    date_of_birth TEXT,
    nationality TEXT,
    
    -- Contact
    email TEXT,
    mobile TEXT,
    whatsapp TEXT,
    other_number TEXT,
    instagram TEXT,
    tiktok TEXT,
    website TEXT,
    
    -- Address
    governorate TEXT,
    district TEXT,
    area TEXT,
    
    -- Languages (stored as JSONB)
    languages JSONB DEFAULT '[]'::jsonb,
    language_levels JSONB DEFAULT '{}'::jsonb,
    
    -- Appearance
    eye_color TEXT,
    hair_color TEXT,
    hair_type TEXT,
    hair_length TEXT,
    skin_tone TEXT,
    
    -- Measurements
    height TEXT,
    weight TEXT,
    pant_size TEXT,
    jacket_size TEXT,
    shoe_size TEXT,
    waist TEXT,
    bust TEXT,
    hips TEXT,
    shoulders TEXT,
    
    -- Talents & Sports (stored as JSONB)
    talents JSONB DEFAULT '[]'::jsonb,
    talent_levels JSONB DEFAULT '{}'::jsonb,
    sports JSONB DEFAULT '[]'::jsonb,
    sport_levels JSONB DEFAULT '{}'::jsonb,
    
    -- Experience & Availability
    experience TEXT,
    has_passport BOOLEAN DEFAULT false,
    willing_to_travel BOOLEAN DEFAULT false,
    car_availability TEXT,
    is_brand_ambassador BOOLEAN DEFAULT false,
    
    -- Photos (array of storage URLs)
    photo_urls TEXT[] DEFAULT '{}'::text[]
);

-- Enable RLS on applications
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Anyone can insert applications (public form)
CREATE POLICY "Anyone can insert applications"
ON public.applications
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Only admins can view applications
CREATE POLICY "Admins can view all applications"
ON public.applications
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can update applications
CREATE POLICY "Admins can update applications"
ON public.applications
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can delete applications
CREATE POLICY "Admins can delete applications"
ON public.applications
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Create storage bucket for application photos
INSERT INTO storage.buckets (id, name, public) VALUES ('application-photos', 'application-photos', true);

-- Storage policies - anyone can upload photos
CREATE POLICY "Anyone can upload application photos"
ON storage.objects
FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'application-photos');

-- Public read access for photos
CREATE POLICY "Public read access for application photos"
ON storage.objects
FOR SELECT
TO anon, authenticated
USING (bucket_id = 'application-photos');
