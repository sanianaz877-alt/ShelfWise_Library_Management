/* Optional Supabase configuration.
   Keep USE_SUPABASE=false until you have entered your own project credentials.
   Never use a Supabase service_role key in browser code. */
window.LIBRARY_CONFIG = {
  USE_SUPABASE: false,
  SUPABASE_URL: "https://YOUR-PROJECT.supabase.co",
  SUPABASE_ANON_KEY: "YOUR_SUPABASE_ANON_KEY",
  LIBRARY_NAME: "ShelfWise Library",
  LOAN_DAYS: 14,
  FINE_PER_DAY: 20,
  CURRENCY: "PKR"
};
