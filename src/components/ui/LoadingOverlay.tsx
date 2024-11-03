import React from 'react';
import CoinFlip from './CoinFlip';

interface LoadingOverlayProps {
  message?: string;
}

export default function LoadingOverlay({ message = 'Loading...' }: LoadingOverlayProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="rounded-lg bg-white p-8 shadow-xl">
        <CoinFlip size="lg" message={message} />
      </div>
    </div>
  );
}