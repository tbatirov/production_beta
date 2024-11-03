// AI Analysis Settings
export interface AISettings {
  enabled: boolean;
  model?: string;
  temperature?: number;
}

// Default settings
export const defaultAISettings: AISettings = {
  enabled: true,
  model: 'gpt-4o',
  temperature: 0,
};
