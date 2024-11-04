import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { AlertCircle, Clock, Lightbulb, TrendingUp } from 'lucide-react';
import { FinancialRatios } from '../../utils/types';
import { getCachedRecommendations } from '../../utils/ai/recommendationsAI';
import RecommendationCard from './RecommendationCard';
import LoadingSpinner from '../LoadingSpinner';
import { logger } from '../../utils/logger';

interface StrategicRecommendationsProps {
  id: string,
  ratios: FinancialRatios;
  industry: string;
}

export default function StrategicRecommendations({
  id,
  ratios, 
  industry 
}: StrategicRecommendationsProps) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<any>(null);

  useEffect(() => {
    const loadRecommendations = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getCachedRecommendations(id, ratios, industry);
        setRecommendations(data);
      } catch (err) {
        logger.error('Error loading recommendations:', err);
        setError(err instanceof Error ? err.message : 'Failed to load recommendations');
      } finally {
        setLoading(false);
      }
    };

    loadRecommendations();
  }, [ratios, industry]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="bg-red-50 rounded-lg p-4">
        <div className="flex items-start">
          <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 mr-2" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  if (!recommendations) return null;

  return (
    <div className="space-y-6">
      {/* Summary Section */}
      <div className="bg-blue-50 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <Lightbulb className="h-6 w-6 text-blue-500 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-medium text-blue-900 mb-2">
              {t('analysis.summary')}
            </h3>
            <p className="text-sm text-blue-800">{recommendations.summary}</p>
          </div>
        </div>
      </div>

      {/* Industry Context */}
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <TrendingUp className="h-6 w-6 text-gray-500 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {t('analysis.industryContext')}
            </h3>
            <p className="text-sm text-gray-700">{recommendations.industryContext}</p>
          </div>
        </div>
      </div>

      {/* Recommendations Sections */}
      <div className="space-y-6">
        {/* Immediate Actions */}
        <section>
          <h3 className="text-lg font-medium text-red-900 mb-4 flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            {t('analysis.immediateActions')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendations.recommendations.immediate.map((rec: any, index: number) => (
              <RecommendationCard
                key={index}
                recommendation={rec}
                urgency="immediate"
              />
            ))}
          </div>
        </section>

        {/* Short-term Actions */}
        <section>
          <h3 className="text-lg font-medium text-yellow-900 mb-4 flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            {t('analysis.shortTermActions')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendations.recommendations.shortTerm.map((rec: any, index: number) => (
              <RecommendationCard
                key={index}
                recommendation={rec}
                urgency="short-term"
              />
            ))}
          </div>
        </section>

        {/* Long-term Actions */}
        <section>
          <h3 className="text-lg font-medium text-green-900 mb-4 flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            {t('analysis.longTermActions')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendations.recommendations.longTerm.map((rec: any, index: number) => (
              <RecommendationCard
                key={index}
                recommendation={rec}
                urgency="long-term"
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}