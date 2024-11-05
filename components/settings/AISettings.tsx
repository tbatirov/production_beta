import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Brain, AlertCircle, Loader2 } from 'lucide-react';
import { AISettings as AISettingsType } from '../../utils/settings/apiSettings';
import { getAISettings, saveAISettings, validateOpenAIKey } from '../../utils/settings/apiSettings';
import { logger } from '../../utils/logger';

interface AISettingsProps {
  onSave?: (settings: AISettingsType) => Promise<void>;
}

export default function AISettingsPanel({ onSave }: AISettingsProps) {
  const { t } = useTranslation();
  const [settings, setSettings] = useState<AISettingsType>(getAISettings());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [keyValid, setKeyValid] = useState<boolean | null>(null);

  useEffect(() => {
    validateCurrentKey();
  }, []);

  const validateCurrentKey = async () => {
    try {
      const isValid = await validateOpenAIKey();
      setKeyValid(isValid);
    } catch (err) {
      setKeyValid(false);
      logger.error('Error validating OpenAI key:', err);
    }
  };

  const handleToggle = async () => {
    try {
      setLoading(true);
      setError(null);

      const newSettings = {
        ...settings,
        enabled: !settings.enabled
      };

      // If enabling AI, validate the API key first
      if (newSettings.enabled) {
        const isValid = await validateOpenAIKey();
        if (!isValid) {
          setError('Invalid or missing OpenAI API key');
          return;
        }
      }

      saveAISettings(newSettings);
      setSettings(newSettings);
      await onSave?.(newSettings);
      
      logger.info('AI settings updated successfully', { enabled: newSettings.enabled });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update AI settings');
      logger.error('Error updating AI settings:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Brain className="h-6 w-6 text-blue-500" />
          <h2 className="text-xl font-bold text-gray-900">AI Analysis Settings</h2>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 rounded-lg flex items-start">
          <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 mr-2" />
          <span className="text-sm text-red-700">{error}</span>
        </div>
      )}

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-900">Enable AI Analysis</h3>
            <p className="text-sm text-gray-500">
              Use artificial intelligence to analyze financial statements
            </p>
          </div>
          <button
            type="button"
            onClick={handleToggle}
            disabled={loading}
            className={`
              relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
              transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
              ${settings.enabled ? 'bg-blue-500' : 'bg-gray-200'}
              ${loading ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            <span
              className={`
                pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 
                transition duration-200 ease-in-out
                ${settings.enabled ? 'translate-x-5' : 'translate-x-0'}
              `}
            />
          </button>
        </div>

        {settings.enabled && (
          <>
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Brain className="h-5 w-5 text-blue-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    AI Analysis Status
                  </h3>
                  <div className="mt-2 text-sm text-blue-700">
                    {loading ? (
                      <div className="flex items-center">
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Checking API connection...
                      </div>
                    ) : keyValid ? (
                      <div className="text-green-700">
                        ✓ API connection verified
                      </div>
                    ) : (
                      <div className="text-red-700">
                        ✗ API connection failed
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Active Features
              </h4>
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                <li>Automated financial statement analysis</li>
                <li>Smart ratio calculations and benchmarking</li>
                <li>Trend detection and insights</li>
                <li>Customized recommendations</li>
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
}