import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client for browser (client-side)
export const supabaseBrowser = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://xocwhhqlebylgutnnlmx.supabase.co",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhvY3doaHFsZWJ5bGd1dG5ubG14Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU2MDYyNTYsImV4cCI6MjA3MTE4MjI1Nn0.25Gv6pYFzMZSWOXk3yGeV_sadZndoSaynQ0a-d5C5p8"
);

// Initialize Supabase client for server (server-side)
export const supabaseServer = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://xocwhhqlebylgutnnlmx.supabase.co",
    process.env.SUPABASE_SERVICE_ROLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhvY3doaHFsZWJ5bGd1dG5ubG14Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTYwNjI1NiwiZXhwIjoyMDcxMTgyMjU2fQ.IDGUNDVAAgBFw7v5VKI3M9LhIsuKMwuJj-OrxZxqMuM"
);