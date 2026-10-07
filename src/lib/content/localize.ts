import type { Scenario } from './scenarios';
import { scenariosFr } from './scenarios-fr';
import { scenariosFr2 } from './scenarios-fr-2';
import type { Language } from '../i18n/dict';

const FR: Record<string, Scenario> = { ...scenariosFr, ...scenariosFr2 };

const CATEGORY_FR: Record<string, string> = {
  'Everyday scams': 'Arnaques du quotidien',
  'Social engineering': 'Ingénierie sociale',
  Malware: 'Malwares',
  'Account security': 'Comptes et accès',
  'Safe browsing': 'Navigation sûre',
  'Job scams': 'Arnaques à l’emploi',
  'Student scams': 'Arnaques étudiants',
  'Email threats': 'Emails piégés',
};

export function localizeScenario(s: Scenario, lang: Language): Scenario {
  if (lang !== 'fr') return s;
  const fr = FR[s.id];
  if (!fr) return s;
  return { ...fr, category: CATEGORY_FR[fr.category] ?? fr.category };
}

/** Scenario ids missing a French version (should stay empty). */
export function missingFrench(ids: string[]): string[] {
  return ids.filter((id) => !FR[id]);
}
