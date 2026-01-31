/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_HUBSPOT_ACCESS_TOKEN?: string;

  // Supabase removed — keep optional only if some legacy code still references it
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_PUBLISHABLE_KEY?: string;
  readonly VITE_SUPABASE_PROJECT_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
