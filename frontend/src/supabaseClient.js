// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

let supabase

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey)
} else {
  // Stub: mock the methods you use for UI development
  // Helper to allow method chaining (e.g., .select().order())
  const chainable = {
    select: function() { return this; },
    order: function() { return this; },
    eq: function() { return this; },
    insert: async () => ({ data: [], error: null }),
    update: async () => ({ data: [], error: null }),
    delete: async () => ({ data: [], error: null }),
    single: function() { return this; },
    // Add more chainable methods as needed
    then: function(resolve) { return Promise.resolve({ data: [], error: null }).then(resolve); },
  };
  supabase = {
    from: () => Object.create(chainable),
    auth: {
      signInWithPassword: async () => ({ data: null, error: null }),
      signUp: async () => ({ data: null, error: null }),
      signOut: async () => ({ error: null }),
    },
  }
}

export default supabase
export { supabase }
