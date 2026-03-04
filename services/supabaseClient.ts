import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wcoazggipgdwubiaxggf.supabase.co';
const supabaseAnonKey = 'sb_publishable_htLa1c4bSp-xy97Bz3mN7Q_jcgxbqvr';

export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
