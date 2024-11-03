import React from 'react';

interface CoinFlipProps {
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
  message?: string;
}

export default function CoinFlip({ size = 'md', fullScreen = false, message }: CoinFlipProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const coin = (
    <div className="flex flex-col items-center justify-center space-y-2">
      <div className={`${sizeClasses[size]} relative animate-flip`}>
        {/* Front face */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-100 via-gray-300 to-gray-100 shadow-lg backface-hidden">
          <div className="absolute inset-[2px] rounded-full bg-gradient-to-br from-gray-200 via-gray-100 to-gray-300 flex items-center justify-center">
            {/* 3D edge effect */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-gray-400 to-transparent opacity-20"></div>
            <span className="text-gray-600 font-bold text-[0.6em] relative z-10">$</span>
          </div>
          {/* Metallic shine effect */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tl from-white via-transparent to-transparent opacity-40"></div>
        </div>

        {/* Back face */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-200 via-gray-400 to-gray-200 shadow-lg backface-hidden [transform:rotateY(180deg)]">
          <div className="absolute inset-[2px] rounded-full bg-gradient-to-br from-gray-300 via-gray-200 to-gray-400 flex items-center justify-center">
            {/* 3D edge effect */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-gray-500 to-transparent opacity-20"></div>
            <span className="text-gray-700 font-bold text-[0.6em] relative z-10">¢</span>
          </div>
          {/* Metallic shine effect */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tl from-white via-transparent to-transparent opacity-40"></div>
        </div>
      </div>
      {message && <p className="text-sm text-gray-500">{message}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-gray-50/75 flex items-center justify-center z-50">
        {coin}
      </div>
    );
  }

  return coin;
}