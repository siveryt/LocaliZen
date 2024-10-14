import { LanguageCode } from './LanguageList';

// Define a type for translation states
type TranslationState = 'translated' | 'new' | 'needs_review';

interface TranslationCatalog {
  sourceLanguage: LanguageCode;
  strings: Record<string, TranslationString>;
  version: string;
}

interface TranslationString {
  shouldTranslate?: boolean;
  localizations?: Record<LanguageCode, Localization>;
  comment?: string;
}

interface Localization {
  stringUnit: {
    state: TranslationState;
    value: string;
  };
}
