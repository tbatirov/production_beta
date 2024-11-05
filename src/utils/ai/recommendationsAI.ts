import { logger } from '../logger';
import { getAISettings, getOpenAIKey } from '../settings/apiSettings';
import { FinancialRatios } from '../types';
import { ratioBenchmarks } from '../../components/analysis/RatioBenchmarks';
import i18n from '../../i18n';


interface RecommendationResponse {
  recommendations: {
    immediate: Array<{
      title: string;
      description: string;
      impact: 'high' | 'medium' | 'low';
      complexity: 'high' | 'medium' | 'low';
      resources: string[];
    }>;
    shortTerm: Array<{
      title: string;
      description: string;
      impact: 'high' | 'medium' | 'low';
      complexity: 'high' | 'medium' | 'low';
      resources: string[];
    }>;
    longTerm: Array<{
      title: string;
      description: string;
      impact: 'high' | 'medium' | 'low';
      complexity: 'high' | 'medium' | 'low';
      resources: string[];
    }>;
  };
  summary: string;
  industryContext: string;
}

export async function generateStrategicRecommendations(
  ratios: FinancialRatios,
  industry: string
): Promise<RecommendationResponse> {
  const aiSettings = getAISettings();
  const OPENAI_API_KEY = getOpenAIKey();

  if (!aiSettings.enabled) {
    throw new Error('AI analysis is disabled');
  }

  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key is not configured');
  }

  try {
    const prompt = `Analyze the following financial ratios for a company in the ${industry} industry and provide strategic recommendations in "${i18n.language}" language:

Current Ratios:
${JSON.stringify(ratios, null, 2)}

Industry Benchmarks:
${JSON.stringify(ratioBenchmarks, null, 2)}

Provide recommendations in the following JSON format:
{
  "recommendations": {
    "immediate": [
      {
        "title": "string",
        "description": "string",
        "impact": "high" | "medium" | "low",
        "complexity": "high" | "medium" | "low",
        "resources": ["string"]
      }
    ],
    "shortTerm": [...],
    "longTerm": [...]
  },
  "summary": "Overall analysis summary",
  "industryContext": "Industry-specific context and trends"
}

Consider:
1. Significant deviations from industry benchmarks
2. Industry-specific challenges and opportunities
3. Current market conditions
4. Resource requirements and implementation complexity
5. Potential impact on business performance

Prioritize recommendations based on:
1. Urgency of implementation
2. Expected impact on financial health
3. Resource requirements
4. Implementation complexity
5. Risk factors

Ensure recommendations are:
1. Specific and actionable
2. Realistic and achievable
3. Measurable and time-bound
4. Aligned with industry best practices
5. Cost-effective`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are a financial analysis AI expert. Provide strategic recommendations based on financial ratios.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.2,
        response_format: { type: 'json_object' },
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const result = await response.json();
    const content = result.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('Empty response from OpenAI API');
    }

    const recommendations = JSON.parse(content);
    logger.info('Strategic recommendations generated successfully',recommendations);
    
    return recommendations;
  } catch (error) {
    logger.error('Error generating strategic recommendations:', error);
    throw error;
  }
}

// Cache implementation for recommendations
const recommendationsCache = new Map<string, { data: RecommendationResponse; timestamp: number }>();
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export async function getCachedRecommendations(
  id: string,
  ratios: FinancialRatios,
  industry: string
): Promise<RecommendationResponse> {
  const cacheKey = id;
  const cached = recommendationsCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    logger.info('Using cached recommendations');
    return cached.data;
  }

  try {
    console.log('AI REQUEST STARTING!!!!!!!',id)
    const recommendations = await generateStrategicRecommendations(ratios, industry);
    recommendationsCache.set(cacheKey, {
      data: recommendations,
      timestamp: Date.now(),
    });
    return recommendations;
  } catch (error) {
    logger.error('Error getting recommendations:', error);
    
    if (cached) {
      logger.info('Using expired cache as fallback');
      return cached.data;
    }
    
    throw error;
  }
}