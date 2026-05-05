import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wmmbswlajfwahiaadtxc.supabase.co'
const supabaseKey = 'sb_publishable_xFVcgTS2Gb0750W2WQjENA_4ufhJaJF'
const supabase = createClient(supabaseUrl, supabaseKey)

async function test() {
  const { data: members, error } = await supabase.from('team_members').select('*')
  
  const alumniByYear = (() => {
    const alumni = members.filter(m => !m.is_active);
    return alumni.reduce((acc, member) => {
      const year = member.end_year ? member.end_year.toString() : 'Unknown';
      if (!acc[year]) acc[year] = [];
      acc[year].push(member);
      return acc;
    }, {});
  })();
  
  console.log("alumniByYear:", JSON.stringify(alumniByYear, null, 2));

  const alumniYears = Object.keys(alumniByYear).sort((a, b) => {
      if (a === 'Unknown') return 1;
      if (b === 'Unknown') return -1;
      return Number(b) - Number(a);
  });
  
  console.log("alumniYears:", alumniYears);

  // Test SVG generation
  for (const year of alumniYears) {
      for (const member of alumniByYear[year]) {
          const sum = (member.first_name + member.last_name).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
          console.log(`Member: ${member.first_name} ${member.last_name}, SVG sum: ${sum}`);
      }
  }
}

test()
