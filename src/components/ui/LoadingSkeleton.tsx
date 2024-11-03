import React from 'react';

interface LoadingSkeletonProps {
  className?: string;
}

export default function LoadingSkeleton({ className = '' }: LoadingSkeletonProps) {
  return (
    <div className={`animate-pulse rounded bg-gray-200 ${className}`}>
      <div className="sr-only">Loading...</div>
    </div>
  );
}