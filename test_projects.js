import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wmmbswlajfwahiaadtxc.supabase.co'
const supabaseKey = 'sb_publishable_xFVcgTS2Gb0750W2WQjENA_4ufhJaJF'
const supabase = createClient(supabaseUrl, supabaseKey)

async function test() {
  const { data, error } = await supabase.from('projects').select('*')
  console.log("Error:", error)
  console.log("Data length:", data ? data.length : 0)
}

test()
