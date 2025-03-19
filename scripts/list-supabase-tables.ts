import { createClient } from '@supabase/supabase-js';

// Supabase credentials (hardcoded for script)
const supabaseUrl = 'https://bagwndxmhslkgyyorgqn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhZ3duZHhtaHNsa2d5eW9yZ3FuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE1NDc5NzIsImV4cCI6MjA1NzEyMzk3Mn0.6myoVEeLoN1ny_oHKJY5ri3tOupCaEXbcCU9tgMPEF0';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase configuration');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function listTables() {
  console.log('Connecting to Supabase...');
  console.log(`URL: ${supabaseUrl}`);
  
  try {
    // Use the rpc function to query information_schema
    const { data, error } = await supabase
      .rpc('list_tables')
      .select('*');
    
    if (error) {
      console.error('Error with RPC method:', error);
      
      // Fallback - try direct SQL query
      console.log('Trying alternative method...');
      const { data: tables, error: sqlError } = await supabase
        .from('users') // Try to access a known table to see if it exists
        .select('*')
        .limit(1);
      
      if (sqlError) {
        console.log('Error accessing users table:', sqlError);
        
        // Just try to list some known tables based on our schema
        const knownTables = [
          'users', 
          'personas', 
          'campaigns', 
          'simulation_data',
          'user_api_settings',
          'marketing_resources',
          'marketing_knowledge_base',
          'user_marketing_knowledge',
          'industry_benchmarks',
          'brand_performance_data',
          'user_profiles',
          'connections',
          'projects',
          'posts',
          'comments',
          'achievements'
        ];
        
        console.log('\nAttempting to check known tables:');
        
        for (const tableName of knownTables) {
          console.log(`Checking if '${tableName}' exists...`);
          const { error: tableError } = await supabase
            .from(tableName)
            .select('*')
            .limit(1);
          
          if (tableError) {
            console.log(`  ❌ Table '${tableName}' does not exist or is not accessible`);
          } else {
            console.log(`  ✅ Table '${tableName}' exists`);
          }
        }
      } else {
        console.log('Users table exists:', tables);
      }
      
      return;
    }
    
    console.log('\nTables in your Supabase database:');
    if (data && data.length > 0) {
      data.forEach((table, index) => {
        console.log(`${index + 1}. ${table.table_name}`);
      });
    } else {
      console.log('No tables found in the public schema.');
    }
  } catch (error) {
    console.error('Error fetching tables:', error);
  }
}

listTables();