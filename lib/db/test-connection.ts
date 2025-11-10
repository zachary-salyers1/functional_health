import { supabase } from './supabase';

/**
 * Test database connection by fetching biomarkers
 */
export async function testDatabaseConnection() {
  try {
    console.log('🔍 Testing Supabase connection...');

    // Try to fetch biomarkers (should be empty or have seed data)
    const { data, error } = await supabase
      .from('biomarkers')
      .select('id, name, category')
      .limit(5);

    if (error) {
      console.error('❌ Database connection failed:', error);
      return false;
    }

    console.log('✅ Database connection successful!');
    console.log(`📊 Found ${data?.length || 0} biomarkers`);

    if (data && data.length > 0) {
      console.log('Sample biomarkers:', data);
    }

    return true;
  } catch (err) {
    console.error('❌ Unexpected error:', err);
    return false;
  }
}

/**
 * Check if required tables exist
 */
export async function checkTablesExist() {
  const requiredTables = [
    'users',
    'biomarkers',
    'interventions',
    'research_studies',
    'user_lab_uploads',
    'user_biomarker_results',
    'generated_protocols',
    'protocol_recommendations'
  ];

  console.log('🔍 Checking for required tables...');

  for (const table of requiredTables) {
    try {
      const { error } = await supabase.from(table).select('id').limit(1);

      if (error) {
        console.error(`❌ Table "${table}" not found or accessible:`, error.message);
      } else {
        console.log(`✅ Table "${table}" exists`);
      }
    } catch (err) {
      console.error(`❌ Error checking table "${table}":`, err);
    }
  }
}

// Run tests if executed directly
if (require.main === module) {
  (async () => {
    await testDatabaseConnection();
    console.log('\n');
    await checkTablesExist();
  })();
}
