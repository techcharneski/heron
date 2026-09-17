import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://odvntvzicsetvlrpjswk.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  "sb_publishable_GISateRhvxzuugnXVY0-ig_w2nf45jt";
const supabaseServiceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9kdm50dnppY3NldHZscnBqc3drIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4OTU4NTE1NiwiZXhwIjoyMTA1MTYxMTU2fQ.ckp5ZGKLbVIFHf4Ch9AC3UKLYpXJ8VwsYt23X6N700c";

if (!supabaseUrl) {
  console.warn("NEXT_PUBLIC_SUPABASE_URL não está configurado!");
}

// Client público para leitura
export const supabasePublic = createClient(supabaseUrl, supabaseAnonKey);

// Client com chave de serviço (Server-side admin operations)
export const supabaseAdmin = createClient(
  supabaseUrl,
  supabaseServiceRoleKey,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);
