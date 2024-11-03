import React, { createContext, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../utils/supabase';
import { logger } from '../utils/logger';

interface User {
  id: string;
  email: string;
  fullName: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, data?: Record<string, any>) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      logger.info('Initializing authentication');
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;

        if (session?.user) {
          logger.info('Found existing session', { userId: session.user.id });
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('id, email, full_name')
            .eq('auth_user_id', session.user.id)
            .single();

          if (userError) throw userError;

          if (userData) {
            logger.info('User data retrieved successfully', { userId: userData.id });
            setUser({
              id: userData.id,
              email: userData.email,
              fullName: userData.full_name
            });
          }
        } else {
          logger.info('No active session found');
        }
      } catch (error) {
        logger.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    logger.info('Attempting sign in', { email });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      if (data.user) {
        logger.info('Sign in successful', { userId: data.user.id });
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('id, email, full_name')
          .eq('auth_user_id', data.user.id)
          .single();

        if (userError) throw userError;

        setUser({
          id: userData.id,
          email: userData.email,
          fullName: userData.full_name
        });
      }
    } catch (error) {
      logger.error('Sign in error:', error);
      throw new Error(t('auth.errors.invalidCredentials'));
    }
  };

  const signUp = async (email: string, password: string, data?: Record<string, any>) => {
    logger.info('Attempting sign up', { email });
    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: data?.fullName,
            company: data?.company
          }
        }
      });

      if (error) throw error;

      logger.info('Sign up successful', { userId: authData.user?.id });
    } catch (error) {
      logger.error('Sign up error:', error);
      throw new Error(t('auth.errors.emailInUse'));
    }
  };

  const signOut = async () => {
    logger.info('Attempting sign out');
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setUser(null);
      logger.info('Sign out successful');
    } catch (error) {
      logger.error('Sign out error:', error);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    logger.info('Attempting password reset', { email });
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;

      logger.info('Password reset email sent successfully');
    } catch (error) {
      logger.error('Password reset error:', error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}