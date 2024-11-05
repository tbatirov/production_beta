import React from 'react';
import RatioCard from './RatioCard';

interface RatioSectionProps {
  title: string;
  ratios: Record<string, number>;
  benchmarks: Record<string, number>;
  descriptions: Record<string, string>;
  isPercentage?: boolean;
}

export default function RatioSection({
  title,
  ratios,
  benchmarks,
  descriptions,
  isPercentage = false
}: RatioSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(ratios).map(([key, value]) => (
          <RatioCard
            key={key}
            label={key.split(/(?=[A-Z])/).join(' ')}
            value={value}
            benchmark={benchmarks[key] || 1}
            isPercentage={isPercentage}
            description={descriptions[key]}
          />
        ))}
      </div>
    </div>
  );
}