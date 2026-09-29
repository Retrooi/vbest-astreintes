import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qzckqtcboejipveedeec.supabase.co' 
const supabaseKey = 'sb_publishable_F8F12gZK75SbjdpSVbLIJg_KBqqb6vV'

export const supabase = createClient(supabaseUrl, supabaseKey)