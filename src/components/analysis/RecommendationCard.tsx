import React from 'react';
import { useTranslation } from 'react-i18next';
import { AlertCircle, CheckCircle, Clock, Wrench } from 'lucide-react';

interface RecommendationCardProps {
  recommendation: {
    title: string;
    description: string;
    impact: 'high' | 'medium' | 'low';
    complexity: 'high' | 'medium' | 'low';
    resources: string[];
  };
  urgency: 'immediate' | 'short-term' | 'long-term';
}

export default function RecommendationCard({
  recommendation,
  urgency
}: RecommendationCardProps) {
  const { t } = useTranslation();

  const getUrgencyColor = () => {
    switch (urgency) {
      case 'immediate':
        return 'border-red-200 bg-red-50';
      case 'short-term':
        return 'border-yellow-200 bg-yellow-50';
      case 'long-term':
        return 'border-green-200 bg-green-50';
    }
  };

  const getImpactColor = () => {
    switch (recommendation.impact) {
      case 'high':
        return 'text-red-700 bg-red-100';
      case 'medium':
        return 'text-yellow-700 bg-yellow-100';
      case 'low':
        return 'text-green-700 bg-green-100';
    }
  };

  const getComplexityColor = () => {
    switch (recommendation.complexity) {
      case 'high':
        return 'text-red-700 bg-red-100';
      case 'medium':
        return 'text-yellow-700 bg-yellow-100';
      case 'low':
        return 'text-green-700 bg-green-100';
    }
  };

  return (
    <div className={`rounded-lg border p-4 ${getUrgencyColor()}`}>
      <div className="flex items-start justify-between mb-3">
        <h4 className="text-sm font-medium">{recommendation.title}</h4>
        <div className="flex items-center space-x-2">
          <span className={`text-xs px-2 py-1 rounded-full ${getImpactColor()}`}>
            {t(`analysis.impact.${recommendation.impact}`)}
          </span>
          <span className={`text-xs px-2 py-1 rounded-full ${getComplexityColor()}`}>
            {t(`analysis.complexity.${recommendation.complexity}`)}
          </span>
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-3">{recommendation.description}</p>

      {recommendation.resources.length > 0 && (
        <div className="mt-3">
          <h5 className="text-xs font-medium text-gray-700 mb-2 flex items-center">
            <Wrench className="h-3 w-3 mr-1" />
            {t('analysis.requiredResources')}
          </h5>
          <ul className="text-xs text-gray-600 space-y-1">
            {recommendation.resources.map((resource, index) => (
              <li key={index} className="flex items-center">
                <CheckCircle className="h-3 w-3 mr-1 text-gray-400" />
                {resource}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}