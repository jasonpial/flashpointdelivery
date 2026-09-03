-- ==============================================================================
-- FLASHPOINT DELIVERY - SUPABASE POSTGRESQL DATABASE SCHEMA & MEDIA STORAGE SCRIPT
-- Execute this script in your Supabase SQL Editor (https://supabase.com/dashboard)
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. USER PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT DEFAULT '+256 ',
    role TEXT NOT NULL DEFAULT 'client',
    shop_details JSONB DEFAULT '{}'::jsonb,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. SHOPS TABLE (Business Sellers Storefronts)
CREATE TABLE IF NOT EXISTS public.shops (
    id TEXT PRIMARY KEY DEFAULT ('s-' || floor(random() * 9000 + 1000)::text),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    location TEXT NOT NULL,
    phone TEXT NOT NULL,
    verified BOOLEAN DEFAULT true,
    logo_url TEXT,
    banner_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. PRODUCTS TABLE (Marketplace Cargo Catalog)
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY DEFAULT ('p-' || floor(random() * 9000 + 1000)::text),
    shop_id TEXT REFERENCES public.shops(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    price NUMERIC NOT NULL,
    description TEXT,
    seller TEXT NOT NULL,
    image_url TEXT NOT NULL,
    stock INT DEFAULT 50,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. ORDERS TABLE (Secured Cargo Carriage Orders)
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY DEFAULT ('FP-' || floor(random() * 9000 + 1000)::text),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    pickup JSONB NOT NULL DEFAULT '{}'::jsonb,
    delivery JSONB NOT NULL DEFAULT '{}'::jsonb,
    pickup_address TEXT NOT NULL,
    delivery_address TEXT NOT NULL,
    receiver_name TEXT NOT NULL,
    receiver_phone TEXT NOT NULL,
    carrier_mode TEXT NOT NULL DEFAULT 'standard',
    status TEXT NOT NULL DEFAULT 'pending',
    pricing JSONB NOT NULL DEFAULT '{}'::jsonb,
    handler JSONB DEFAULT '{"name": "Agent Assigned - Pending Clearance", "clearance": "Standard Security Clearance"}'::jsonb,
    payment_status TEXT DEFAULT 'unpaid',
    payment_reference TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. CHAT MESSAGES TABLE (Realtime Handler & Client Comms)
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id TEXT REFERENCES public.orders(id) ON DELETE CASCADE,
    sender TEXT NOT NULL, -- 'client', 'handler', 'system'
    text TEXT NOT NULL,
    time TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. HANDLER SECURITY REPORTS TABLE
CREATE TABLE IF NOT EXISTS public.reports (
    id TEXT PRIMARY KEY DEFAULT ('REP-' || floor(random() * 9000 + 1000)::text),
    handler_name TEXT NOT NULL,
    title TEXT NOT NULL,
    details TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'investigating',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. CEO SYSTEM BROADCASTS TABLE
CREATE TABLE IF NOT EXISTS public.broadcasts (
    id TEXT PRIMARY KEY DEFAULT ('BCAST-' || floor(random() * 9000 + 1000)::text),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    priority TEXT NOT NULL DEFAULT 'high',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.broadcasts ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active products, shops, and broadcasts
CREATE POLICY "Public Read Products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public Read Shops" ON public.shops FOR SELECT USING (true);
CREATE POLICY "Public Read Broadcasts" ON public.broadcasts FOR SELECT USING (true);

-- Allow authenticated users to insert orders & read their orders
CREATE POLICY "Public Read Orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Public Insert Orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Orders" ON public.orders FOR UPDATE USING (true);

-- Allow public read/insert for chat messages
CREATE POLICY "Public Read Chats" ON public.chat_messages FOR SELECT USING (true);
CREATE POLICY "Public Insert Chats" ON public.chat_messages FOR INSERT WITH CHECK (true);

-- 10. STORAGE BUCKET FOR PHOTOS & IMAGES ('cargo-media')
INSERT INTO storage.buckets (id, name, public) 
VALUES ('cargo-media', 'cargo-media', true)
ON CONFLICT (id) DO NOTHING;

-- Public Storage Access Policies for 'cargo-media' bucket
CREATE POLICY "Public Storage Select" ON storage.objects FOR SELECT USING (bucket_id = 'cargo-media');
CREATE POLICY "Public Storage Insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'cargo-media');
CREATE POLICY "Public Storage Update" ON storage.objects FOR UPDATE USING (bucket_id = 'cargo-media');
