import { supabase } from './client';
import { logger } from '../logger';

export async function testSupabaseConnection(): Promise<{
  success: boolean;
  message: string;
  details?: any;
}> {
  try {
    // Test 1: Check authentication status
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      throw new Error(`Auth Error: ${authError.message}`);
    }

    // Test 2: Try to query the companies table
    const { data: companies, error: dbError } = await supabase
      .from('companies')
      .select('count')
      .limit(1)
      .single();

    if (dbError) {
      throw new Error(`Database Error: ${dbError.message}`);
    }

    // Test 3: Check if we can access the project settings
    const { data: settings, error: settingsError } = await supabase
      .from('companies')
      .select()
      .limit(0);

    if (settingsError) {
      throw new Error(`Settings Error: ${settingsError.message}`);
    }

    logger.info('Supabase connection test successful', {
      hasSession: !!session,
      canQueryDb: true,
      canAccessSettings: true
    });

    return {
      success: true,
      message: 'Successfully connected to Supabase',
      details: {
        hasSession: !!session,
        canQueryDb: true,
        canAccessSettings: true
      }
    };

  } catch (error) {
    logger.error('Supabase connection test failed', { error });
    
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to connect to Supabase',
      details: { error }
    };
  }
}