
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client for browser (client-side)
export const supabaseBrowser = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY 
);

// Initialize Supabase client for server (server-side)
export const supabaseServer = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY 
);