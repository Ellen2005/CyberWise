'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { dictionaries, type Dict, type Language } from '@/lib/i18n/dict';

type LanguageContextValue = {
  lang: Language;
  setLang: (lang: Language) => void;
  t: Dict;
};

const LanguageContext = React.createContext<LanguageContextValue | undefined>(undefined);

const STORAGE_KEY = 'wisetap-lang';

function detect(): Language {
  if (typeof window === 'undefined') return 'en';
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'fr' || stored === 'en') return stored;
  } catch { /* private mode */ }
  return window.navigator.language.toLowerCase().startsWith('fr') ? 'fr' : 'en';
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = React.useState<Language>('en');

  React.useEffect(() => {
    const initial = detect();
    setLangState(initial);
    document.documentElement.lang = initial;
  }, []);

  const setLang = React.useCallback((next: Language) => {
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch { /* private mode */ }
    document.documentElement.lang = next;
    setLangState(next);
  }, []);

  const value = React.useMemo(
    () => ({ lang, setLang, t: dictionaries[lang] }),
    [lang, setLang]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = React.useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}

export function LanguageToggle() {
  const { lang, setLang } = useLanguage();
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setLang(lang === 'en' ? 'fr' : 'en')}
      aria-label={lang === 'en' ? 'Passer en français' : 'Switch to English'}
      className="min-h-[36px] font-semibold"
    >
      {lang === 'en' ? 'FR' : 'EN'}
    </Button>
  );
}
