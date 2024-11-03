export interface TranslationMap {
  [key: string]: string | TranslationMap;
}

export interface TranslationFile {
  [namespace: string]: TranslationMap;
}

export interface MissingTranslations {
  [language: string]: string[];
}