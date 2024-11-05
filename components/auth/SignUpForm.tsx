import React, { useState,useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { UserPlus, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { registerSchema } from '../../utils/validation';

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  company: string;
  acceptTerms: boolean;
}

export default function SignUpForm() {
  const { t } = useTranslation();
  const { user, signUp } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    company: '',
    acceptTerms: false
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) {
      navigate('/'); // Redirect to homepage
    }
  }, [user, navigate]);

  const validateField = (name: string, value: string | boolean) => {
    try {
      if (name === 'confirmPassword') {
        registerSchema.parse({ ...formData, [name]: value });
        setValidationErrors(prev => ({ ...prev, [name]: '' }));
      } else if (name === 'password') {
        registerSchema.parse({ ...formData, [name]: value });
        setValidationErrors(prev => ({ ...prev, [name]: '', confirmPassword: '' }));
      } else {
        setValidationErrors(prev => ({ ...prev, [name]: '' }));
      }
    } catch (err) {
      if (err instanceof Error) {
        setValidationErrors(prev => ({ ...prev, [name]: err.message }));
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    validateField(name, newValue);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!formData.acceptTerms) {
        throw new Error(t('auth.errors.acceptTerms'));
      }

      // Validate all form data
      registerSchema.parse(formData);

      // Attempt signup
      await signUp(formData.email, formData.password, {
        data: {
          full_name: formData.fullName,
          company: formData.company
        }
      });

      // Show success message and redirect
      navigate('/login', {
        state: {
          message: t('auth.verificationEmailSent')
        }
      });
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(t('auth.errors.unknownError'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {t('auth.createAccount')}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {t('auth.alreadyHaveAccount')}{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
              {t('auth.signInInstead')}
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 p-4 flex items-start">
              <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 mr-2" />
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}

          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                {t('auth.fullName')}
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                value={formData.fullName}
                onChange={handleChange}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder={t('auth.fullNamePlaceholder')}
              />
              {validationErrors.fullName && (
                <p className="mt-1 text-xs text-red-600">{validationErrors.fullName}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                {t('auth.emailAddress')}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder={t('auth.emailPlaceholder')}
              />
              {validationErrors.email && (
                <p className="mt-1 text-xs text-red-600">{validationErrors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                {t('auth.company')}
              </label>
              <input
                id="company"
                name="company"
                type="text"
                value={formData.company}
                onChange={handleChange}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder={t('auth.companyPlaceholder')}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                {t('auth.password')}
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder={t('auth.passwordPlaceholder')}
              />
              {validationErrors.password && (
                <p className="mt-1 text-xs text-red-600">{validationErrors.password}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                {t('auth.confirmPassword')}
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder={t('auth.confirmPasswordPlaceholder')}
              />
              {validationErrors.confirmPassword && (
                <p className="mt-1 text-xs text-red-600">{validationErrors.confirmPassword}</p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="text-sm">
              <h3 className="font-medium text-gray-700 mb-2">{t('auth.passwordRequirements.title')}</h3>
              <ul className="list-disc pl-5 space-y-1 text-gray-600">
                <li>{t('auth.passwordRequirements.length')}</li>
                <li>{t('auth.passwordRequirements.uppercase')}</li>
                <li>{t('auth.passwordRequirements.lowercase')}</li>
                <li>{t('auth.passwordRequirements.number')}</li>
                <li>{t('auth.passwordRequirements.special')}</li>
              </ul>
            </div>

            <div className="flex items-center">
              <input
                id="acceptTerms"
                name="acceptTerms"
                type="checkbox"
                checked={formData.acceptTerms}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="acceptTerms" className="ml-2 block text-sm text-gray-900">
                {t('auth.acceptTerms')}{' '}
                <Link to="/terms" className="text-blue-600 hover:text-blue-500">
                  {t('auth.termsAndConditions')}
                </Link>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading || !formData.acceptTerms}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <UserPlus className="h-5 w-5 mr-2" />
                  {t('auth.signUp')}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}