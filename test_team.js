import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wmmbswlajfwahiaadtxc.supabase.co'
const supabaseKey = 'sb_publishable_xFVcgTS2Gb0750W2WQjENA_4ufhJaJF'
const supabase = createClient(supabaseUrl, supabaseKey)

async function test() {
  const { data: members, error } = await supabase.from('team_members').select('*')
  console.log("Members:", members?.length)
  if (members && members.length > 0) {
    console.log("First member keys:", Object.keys(members[0]))
    console.log("First member bio:", members[0].bio)
    console.log("First member is_active type:", typeof members[0].is_active, members[0].is_active)
  }
  
  const alumni = members?.filter(m => !m.is_active)
  console.log("Alumni count:", alumni?.length)

  const { data: photos, error2 } = await supabase.from('group_photos').select('*')
  console.log("Group photos count:", photos?.length)
}

test()
