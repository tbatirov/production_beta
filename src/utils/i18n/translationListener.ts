import { logger } from '../logger';
import fs from 'fs';
import path from 'path';
import i18next from 'i18next';
import OpenAI from 'openai';

const TRANSLATION_DIR = 'src/i18n/locales';
const SUPPORTED_LANGUAGES = ['en', 'ru', 'uz'];

interface TranslationFiles {
  [language: string]: {
    path: string;
    content: Record<string, any>;
  };
}

export class TranslationListener {
  private translationFiles: TranslationFiles = {};
  private newLabels: Set<string> = new Set();
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.VITE_OPENAI_API_KEY
    });
    this.loadTranslationFiles();
    this.watchTranslations();
  }

  private loadTranslationFiles() {
    try {
      SUPPORTED_LANGUAGES.forEach(lang => {
        const filePath = path.join(TRANSLATION_DIR, `${lang}.json`);
        const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        this.translationFiles[lang] = { path: filePath, content };
      });
      logger.info('Translation files loaded successfully');
    } catch (error) {
      logger.error('Error loading translation files:', error);
    }
  }

  private async translateLabel(label: string, targetLang: string): Promise<string> {
    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [{
          role: "system",
          content: `You are a professional translator. Translate the following label to ${targetLang} maintaining the context and natural language feel. Only return the translation, nothing else.`
        }, {
          role: "user",
          content: label
        }],
        temperature: 0.3,
        max_tokens: 100
      });

      return response.choices[0].message.content?.trim() || label;
    } catch (error) {
      logger.error(`Error translating label to ${targetLang}:`, error);
      return label;
    }
  }

  private async addNewTranslation(label: string, namespace: string, key: string) {
    try {
      // Skip if label already exists in all languages
      if (SUPPORTED_LANGUAGES.every(lang => 
        this.translationFiles[lang].content[namespace]?.[key])) {
        return;
      }

      // Add to English first (source language)
      if (!this.translationFiles['en'].content[namespace]) {
        this.translationFiles['en'].content[namespace] = {};
      }
      this.translationFiles['en'].content[namespace][key] = label;

      // Translate to other languages
      for (const lang of SUPPORTED_LANGUAGES.filter(l => l !== 'en')) {
        if (!this.translationFiles[lang].content[namespace]) {
          this.translationFiles[lang].content[namespace] = {};
        }
        
        const translation = await this.translateLabel(label, lang);
        this.translationFiles[lang].content[namespace][key] = translation;
      }

      // Save all translation files
      this.saveTranslationFiles();
      logger.info(`New translation added for label: ${label}`);
    } catch (error) {
      logger.error('Error adding new translation:', error);
    }
  }

  private saveTranslationFiles() {
    try {
      Object.entries(this.translationFiles).forEach(([lang, { path, content }]) => {
        fs.writeFileSync(path, JSON.stringify(content, null, 2), 'utf-8');
      });
      logger.info('Translation files saved successfully');
    } catch (error) {
      logger.error('Error saving translation files:', error);
    }
  }

  private watchTranslations() {
    // Watch for new translations through i18next
    i18next.on('missingKey', (language: string, namespace: string, key: string, value: string) => {
      const labelKey = `${namespace}:${key}`;
      if (!this.newLabels.has(labelKey)) {
        this.newLabels.add(labelKey);
        this.addNewTranslation(value, namespace, key);
        logger.info(`New label detected: ${labelKey}`);
      }
    });
  }

  // Method to manually add a new label
  public async addLabel(namespace: string, key: string, value: string) {
    await this.addNewTranslation(value, namespace, key);
  }

  // Method to get missing translations
  public getMissingTranslations(): Record<string, string[]> {
    const missing: Record<string, string[]> = {};
    
    SUPPORTED_LANGUAGES.forEach(lang => {
      missing[lang] = [];
      const englishContent = this.translationFiles['en'].content;
      
      Object.entries(englishContent).forEach(([namespace, labels]) => {
        Object.keys(labels).forEach(key => {
          if (!this.translationFiles[lang].content[namespace]?.[key]) {
            missing[lang].push(`${namespace}:${key}`);
          }
        });
      });
    });

    return missing;
  }

  // Method to validate translations
  public validateTranslations(): boolean {
    let isValid = true;
    const englishContent = this.translationFiles['en'].content;

    SUPPORTED_LANGUAGES.forEach(lang => {
      if (lang === 'en') return;

      Object.entries(englishContent).forEach(([namespace, labels]) => {
        Object.keys(labels).forEach(key => {
          if (!this.translationFiles[lang].content[namespace]?.[key]) {
            isValid = false;
            logger.warn(`Missing translation for ${lang}: ${namespace}:${key}`);
          }
        });
      });
    });

    return isValid;
  }
}

// Create and export singleton instance
export const translationListener = new TranslationListener();