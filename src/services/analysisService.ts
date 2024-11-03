import { supabase } from '../utils/supabase';
import { FinancialAnalysis, GeneratedStatements } from '../utils/types';
import { calculateFinancialRatios } from '../utils/ratioCalculator';
import { logger } from '../utils/logger';
import i18next from 'i18next';

export async function validateAnalysisData(
  statements: GeneratedStatements,
  ratios: any,
  analysis: any
): Promise<string | null> {
  if (!statements.balanceSheet || !statements.incomeStatement) {
    return 'Balance Sheet and Income Statement are required';
  }

  if (!ratios || typeof ratios !== 'object') {
    return 'Invalid ratios data';
  }

  if (!analysis || typeof analysis !== 'object') {
    return 'Invalid analysis data';
  }

  return null;
}

export async function saveAnalysis(
  companyId: string,
  period: string,
  statements: GeneratedStatements
): Promise<FinancialAnalysis> {
  try {
    // Validate session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session?.user) {
      throw new Error('Authentication required');
    }

    // Validate period format (YYYY-MM)
    if (!/^\d{4}-\d{2}$/.test(period)) {
      throw new Error('Invalid period format. Use YYYY-MM');
    }

    // Validate period is not in the future
    const currentPeriod = new Date().toISOString().slice(0, 7);
    if (period > currentPeriod) {
      throw new Error('Analysis cannot be saved for future dates');
    }

    // Calculate financial ratios
    const ratios = calculateFinancialRatios(statements);

    // Generate analysis based on current language
    const currentLanguage = i18next.language || 'en';
    const analysis = generateAnalysisInLanguage(ratios, currentLanguage);

    // Validate data before saving
    const validationError = await validateAnalysisData(statements, ratios, analysis);
    if (validationError) {
      throw new Error(validationError);
    }

    const analysisData = {
      company_id: companyId,
      period,
      statements,
      ratios,
      analysis,
      metadata: {
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        status: 'final' as const,
        version: '1.0',
        language: currentLanguage,
        user_id: session.user.id
      }
    };

    // Verify company exists and user has access
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .select('id')
      .eq('id', companyId)
      .eq('user_id', session.user.id)
      .single();

    if (companyError || !company) {
      throw new Error('Company not found or access denied');
    }

    // Check for existing analysis
    const { data: existing, error: existingError } = await supabase
      .from('financial_analysis')
      .select('id')
      .eq('company_id', companyId)
      .eq('period', period)
      .maybeSingle();

    if (existingError) {
      throw existingError;
    }

    let result;

    if (existing) {
      // Update existing analysis
      const { data, error } = await supabase
        .from('financial_analysis')
        .update(analysisData)
        .eq('id', existing.id)
        .select()
        .single();

      if (error) throw error;
      result = data;
    } else {
      // Insert new analysis
      const { data, error } = await supabase
        .from('financial_analysis')
        .insert([analysisData])
        .select()
        .single();

      if (error) throw error;
      result = data;
    }

    logger.info('Analysis saved successfully', {
      companyId,
      period,
      analysisId: result.id,
      language: currentLanguage
    });

    return result;
  } catch (error) {
    logger.error('Error saving analysis:', error);
    throw error;
  }
}

function generateAnalysisInLanguage(ratios: any, language: string): any {
  // Generate analysis text based on the current language
  const analysis = {
    summary: '',
    strengths: [] as string[],
    weaknesses: [] as string[],
    recommendations: [] as string[],
    trends: {
      revenue: { trend: 'stable' as const, percentage: 0 },
      profitability: { trend: 'stable' as const, percentage: 0 },
      cashFlow: { trend: 'stable' as const, percentage: 0 }
    }
  };

  // Set analysis text based on language
  switch (language) {
    case 'ru':
      analysis.summary = 'Финансовый анализ компании';
      if (ratios.liquidity.currentRatio > 2) {
        analysis.strengths.push('Сильная позиция ликвидности');
      }
      if (ratios.profitability.netProfitMargin < 5) {
        analysis.weaknesses.push('Низкая рентабельность');
      }
      if (ratios.leverage.debtRatio > 0.6) {
        analysis.recommendations.push('Рассмотрите стратегии снижения долга');
      }
      break;

    case 'uz':
      analysis.summary = 'Kompaniyaning moliyaviy tahlili';
      if (ratios.liquidity.currentRatio > 2) {
        analysis.strengths.push('Kuchli likvidlik pozitsiyasi');
      }
      if (ratios.profitability.netProfitMargin < 5) {
        analysis.weaknesses.push('Past rentabellik');
      }
      if (ratios.leverage.debtRatio > 0.6) {
        analysis.recommendations.push('Qarz strategiyalarini ko\'rib chiqing');
      }
      break;

    default: // English
      analysis.summary = 'Company Financial Analysis';
      if (ratios.liquidity.currentRatio > 2) {
        analysis.strengths.push('Strong liquidity position');
      }
      if (ratios.profitability.netProfitMargin < 5) {
        analysis.weaknesses.push('Low profitability');
      }
      if (ratios.leverage.debtRatio > 0.6) {
        analysis.recommendations.push('Consider debt reduction strategies');
      }
      break;
  }

  return analysis;
}

export async function getAnalysisHistory(companyId: string): Promise<FinancialAnalysis[]> {
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session?.user) {
      throw new Error('Authentication required');
    }

    const { data, error } = await supabase
      .from('financial_analysis')
      .select('*')
      .eq('company_id', companyId)
      .order('period', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    logger.error('Error fetching analysis history:', error);
    throw error;
  }
}

export async function getAnalysisByPeriod(
  companyId: string,
  period: string
): Promise<FinancialAnalysis | null> {
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session?.user) {
      throw new Error('Authentication required');
    }

    const { data, error } = await supabase
      .from('financial_analysis')
      .select('*')
      .eq('company_id', companyId)
      .eq('period', period)
      .maybeSingle();

    if (error) throw error;
    return data;
  } catch (error) {
    logger.error('Error fetching analysis by period:', error);
    throw error;
  }
}

export async function deleteAnalysis(id: string): Promise<void> {
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session?.user) {
      throw new Error('Authentication required');
    }

    const { error } = await supabase
      .from('financial_analysis')
      .delete()
      .eq('id', id);

    if (error) throw error;

    logger.info('Analysis deleted successfully', { analysisId: id });
  } catch (error) {
    logger.error('Error deleting analysis:', error);
    throw error;
  }
}