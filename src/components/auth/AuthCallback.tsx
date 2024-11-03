import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../utils/supabase';
import LoadingSpinner from '../LoadingSpinner';
import { useTranslation } from 'react-i18next';

export default function AuthCallback() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { error } = await supabase.auth.getSession();
        if (error) throw error;

        // Get the hash parameters
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');

        if (accessToken && refreshToken) {
          // Set the session
          await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          });
        }

        // Redirect to the dashboard
        navigate('/dashboard', {
          replace: true,
          state: { message: t('auth.signInSuccess') }
        });
      } catch (error) {
        console.error('Error handling auth callback:', error);
        navigate('/login', {
          replace: true,
          state: { error: t('auth.errors.authCallbackError') }
        });
      }
    };

    handleAuthCallback();
  }, [navigate, t]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <LoadingSpinner message={t('auth.processingAuth')} />
    </div>
  );
}