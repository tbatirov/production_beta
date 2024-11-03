import { logger } from '../logger';

export interface AISettings {
  enabled: boolean;
  model: string;
  temperature: number;
}

const defaultAISettings: AISettings = {
  enabled: true,
  model: 'gpt-4o',
  temperature: 0,
};

export function getAISettings(): AISettings {
  try {
    const savedSettings = localStorage.getItem('aiSettings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      return { ...defaultAISettings, ...parsed };
    }
  } catch (error) {
    logger.error('Error reading AI settings:', error);
  }
  return defaultAISettings;
}

export function getOpenAIKey(): string | null {
  const key = import.meta.env.VITE_OPENAI_API_KEY;
  if (!key) {
    logger.error('OpenAI API key not configured');
    return null;
  }
  return key;
}

export async function validateOpenAIKey(): Promise<boolean> {
  const key = getOpenAIKey();
  if (!key) return false;

  try {
    const response = await fetch('https://api.openai.com/v1/models', {
      headers: {
        Authorization: `Bearer ${key}`,
      },
    });

    if (!response.ok) {
      logger.error('OpenAI key validation failed:', response.statusText);
      return false;
    }

    return true;
  } catch (error) {
    logger.error('Error validating OpenAI key:', error);
    return false;
  }
}

export function saveAISettings(settings: Partial<AISettings>): void {
  try {
    const currentSettings = getAISettings();
    const newSettings = { ...currentSettings, ...settings };
    localStorage.setItem('aiSettings', JSON.stringify(newSettings));
    logger.info('AI settings saved successfully');
  } catch (error) {
    logger.error('Error saving AI settings:', error);
    throw error;
  }
}
