import { supabase } from './client';
import { FinancialAnalysis, GeneratedStatements } from '../types';
import { logger } from '../logger';
import { calculateFinancialRatios } from '../ratioCalculator';

export async function saveAnalysis(
  companyId: string,
  period: string,
  statements: GeneratedStatements
): Promise<FinancialAnalysis> {
  try {
    logger.info('Starting analysis save', { companyId, period });

    // Get current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session?.user) {
      logger.error('Authentication required for saving analysis');
      throw new Error('Authentication required');
    }

    // Calculate ratios
    const ratios = statements.ratios;

    // Generate analysis summary
    const analysis = {
      summary: 'Financial analysis summary',
      strengths: [
        ratios.profitability.netProfitMargin > 15 ? 'Strong profit margins' : '',
        ratios.liquidity.currentRatio > 2 ? 'Healthy liquidity position' : '',
        ratios.efficiency.assetTurnover > 1.5 ? 'Efficient asset utilization' : ''
      ].filter(Boolean),
      weaknesses: [
        ratios.profitability.netProfitMargin < 5 ? 'Low profit margins' : '',
        ratios.liquidity.currentRatio < 1 ? 'Poor liquidity position' : '',
        ratios.leverage.debtRatio > 0.7 ? 'High debt levels' : ''
      ].filter(Boolean),
      recommendations: [
        ratios.liquidity.currentRatio < 1.5 ? 'Improve working capital management' : '',
        ratios.leverage.debtRatio > 0.5 ? 'Consider debt reduction strategies' : '',
        ratios.efficiency.inventoryTurnover < 6 ? 'Optimize inventory management' : ''
      ].filter(Boolean),
      trends: {
        revenue: { trend: 'up' as const, percentage: 10 },
        profitability: { trend: 'up' as const, percentage: 5 },
        cashFlow: { trend: 'stable' as const, percentage: 0 }
      }
    };
    console.log(statements)
    // Format the data for insertion
    const analysisData = {
      company_id: companyId,
      period,
      statements:statements.statements,
      analysis:statements.analysis,
      ratios,
      metadata: {
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        status: 'final' as const,
        version: '1.0',
        user_id: session.user.id
      }
    };
    console.log('Kevottiii')
    // Check if analysis already exists for this period
    const { data: existing, error: existingError } = await supabase
      .from('financial_analysis')
      .select('id')
      .eq('company_id', companyId)
      .eq('period', period)
      .maybeSingle();

    if (existingError) {
      logger.error('Error checking existing analysis:', existingError);
      throw new Error('Failed to check existing analysis');
    }

    let result;

    if (existing) {
      logger.info('Updating existing analysis', { analysisId: existing.id });
      const { data, error: updateError } = await supabase
        .from('financial_analysis')
        .update(analysisData)
        .eq('id', existing.id)
        .select()
        .single();

      if (updateError) {
        logger.error('Error updating analysis:', updateError);
        throw new Error(`Failed to update analysis: ${updateError.message}`);
      }
      result = data;
    } else {
      logger.info('Creating new analysis');
      const { data, error: insertError } = await supabase
        .from('financial_analysis')
        .insert([analysisData])
        .select()
        .single();

      if (insertError) {
        logger.error('Error inserting analysis:', insertError);
        throw new Error(`Failed to insert analysis: ${insertError.message}`);
      }
      result = data;
    }

    logger.info('Analysis saved successfully', { analysisId: result.id });
    return result as FinancialAnalysis;
  } catch (error) {
    logger.error('Error in saveAnalysis:', error);
    throw error;
  }
}

export async function getAnalysisHistory(companyId: string): Promise<FinancialAnalysis[]> {
  try {
    logger.info('Fetching analysis history', { companyId });
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session?.user) {
      logger.error('Authentication required for fetching analysis history');
      throw new Error('Authentication required');
    }

    const { data, error } = await supabase
      .from('financial_analysis')
      .select('*')
      .eq('company_id', companyId)
      .order('period', { ascending: false });

    if (error) {
      logger.error('Error fetching analysis history:', error);
      throw new Error(`Failed to fetch analysis history: ${error.message}`);
    }

    logger.info('Analysis history fetched successfully', { count: data.length });
    return data as FinancialAnalysis[];
  } catch (error) {
    logger.error('Error in getAnalysisHistory:', error);
    throw error;
  }
}

export async function getAnalysisByPeriod(
  companyId: string,
  period: string
): Promise<FinancialAnalysis | null> {
  try {
    logger.info('Fetching analysis by period', { companyId, period });
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session?.user) {
      logger.error('Authentication required for fetching analysis');
      throw new Error('Authentication required');
    }

    const { data, error } = await supabase
      .from('financial_analysis')
      .select('*')
      .eq('company_id', companyId)
      .eq('period', period)
      .maybeSingle();

    if (error) {
      logger.error('Error fetching analysis:', error);
      throw new Error(`Failed to fetch analysis: ${error.message}`);
    }

    logger.info('Analysis fetched successfully', { found: !!data });
    return data as FinancialAnalysis | null;
  } catch (error) {
    logger.error('Error in getAnalysisByPeriod:', error);
    throw error;
  }
}

export async function deleteAnalysis(id: string): Promise<void> {
  try {
    logger.info('Deleting analysis', { analysisId: id });
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session?.user) {
      logger.error('Authentication required for deleting analysis');
      throw new Error('Authentication required');
    }

    const { error } = await supabase
      .from('financial_analysis')
      .delete()
      .eq('id', id);

    if (error) {
      logger.error('Error deleting analysis:', error);
      throw new Error(`Failed to delete analysis: ${error.message}`);
    }

    logger.info('Analysis deleted successfully');
  } catch (error) {
    logger.error('Error in deleteAnalysis:', error);
    throw error;
  }
}