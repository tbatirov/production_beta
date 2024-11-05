import React from 'react';
import CoinFlip from './ui/CoinFlip';

interface LoadingSpinnerProps {
  fullScreen?: boolean;
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function LoadingSpinner({ 
  fullScreen = false, 
  message,
  size = 'md' 
}: LoadingSpinnerProps) {
  return <CoinFlip fullScreen={fullScreen} message={message} size={size} />;
}