'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Gauge, ArrowLeft, Loader2 } from 'lucide-react';
import { useUser, useFirestore } from '@/firebase';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/components/language-provider';

type Dim = 'Account Security' | 'Scam Awareness' | 'Device Safety' | 'Privacy';
type Opt = { text: string; score: number };
type Q = { id: string; dim: Dim; text: string; options: Opt[] };

type Lang = 'en' | 'fr';

const DIMS: Record<Lang, Record<Dim, string>> = {
  en: { 'Account Security': 'Account Security', 'Scam Awareness': 'Scam Awareness', 'Device Safety': 'Device Safety', Privacy: 'Privacy' },
  fr: { 'Account Security': 'Sécurité des comptes', 'Scam Awareness': 'Vigilance arnaques', 'Device Safety': 'Sécurité de l’appareil', Privacy: 'Vie privée' },
};

const QUESTION_TEXT: Record<Lang, Record<string, { text: string; options: string[] }>> = {
  en: {
    'pw-reuse': { text: 'Do you reuse passwords across accounts?', options: ['Yes, mostly the same one', 'A few variations', 'Unique passwords (manager or written safely)'] },
    mfa: { text: 'Is MFA enabled on your email and money accounts?', options: ['What is MFA?', 'On some accounts', 'On all important accounts'] },
    otp: { text: 'Would you share an OTP with someone claiming to be support?', options: ['Yes, if they sound official', 'Only my bank', 'Never, with anyone'] },
    links: { text: 'A message says you won money. First move?', options: ['Tap the link to check', 'Reply asking if it is real', 'Verify independently, never via the link'] },
    jobs: { text: 'A recruiter asks for a processing fee. You…', options: ['Pay — the salary is worth it', 'Send documents first', 'Verify the company, never pay to be hired'] },
    'verify-offers': { text: 'Do you verify job offers or prizes before acting?', options: ['Rarely', 'Sometimes', 'Always, through official channels'] },
    apk: { text: 'Do you install APKs from outside official stores?', options: ['Often (free apps, data apps)', 'Rarely', 'Never — Play Store / App Store only'] },
    updates: { text: 'Are your phone and apps updated?', options: ['Updates off / very old version', 'Sometimes', 'Automatic updates on'] },
    backup: { text: 'Do you back up important photos and documents?', options: ['No backup', 'Somewhere, outdated', 'Yes, recent backup'] },
    overshare: { text: 'What do you post publicly?', options: ['Location, ID cards, daily routine', 'Photos, rarely personal details', 'Minimal — private profile, no sensitive posts'] },
    wifi: { text: 'On public Wi-Fi, you…', options: ['Log into everything normally', 'Browse but avoid banking', 'Use mobile data / VPN for sensitive stuff'] },
  },
  fr: {
    'pw-reuse': { text: 'Réutilisez-vous les mêmes mots de passe ?', options: ['Oui, souvent le même', 'Quelques variantes', 'Uniques (gestionnaire ou notés en sécurité)'] },
    mfa: { text: 'La double authentification est-elle active sur vos comptes mail et argent ?', options: ['C’est quoi ?', 'Sur certains comptes', 'Sur tous les comptes importants'] },
    otp: { text: 'Donneriez-vous un code OTP à quelqu’un se disant du support ?', options: ['Oui, s’il a l’air officiel', 'Seulement à ma banque', 'Jamais, à personne'] },
    links: { text: 'Un message dit que vous avez gagné de l’argent. Premier réflexe ?', options: ['Toucher le lien pour vérifier', 'Répondre pour demander si c’est vrai', 'Vérifier par soi-même, jamais via le lien'] },
    jobs: { text: 'Un recruteur demande des frais de dossier. Vous…', options: ['Payez — le salaire en vaut la peine', 'Envoyez d’abord les documents', 'Vérifiez l’entreprise, ne payez jamais pour être embauché'] },
    'verify-offers': { text: 'Vérifiez-vous offres et lots avant d’agir ?', options: ['Rarement', 'Parfois', 'Toujours, via les canaux officiels'] },
    apk: { text: 'Installez-vous des APK hors des boutiques officielles ?', options: ['Souvent (apps gratuites, data)', 'Rarement', 'Jamais — Play Store / App Store uniquement'] },
    updates: { text: 'Votre téléphone et vos applis sont-ils à jour ?', options: ['Mises à jour off / très vieux', 'Parfois', 'Mises à jour automatiques'] },
    backup: { text: 'Sauvegardez-vous photos et documents importants ?', options: ['Aucune sauvegarde', 'Quelque part, dépassée', 'Oui, récente'] },
    overshare: { text: 'Que publiez-vous en public ?', options: ['Lieu, pièces d’identité, routine', 'Photos, rarement de détails', 'Minimum — profil privé, rien de sensible'] },
    wifi: { text: 'Sur un Wi-Fi public, vous…', options: ['Tout normalement', 'Naviguez mais évitez la banque', 'Données mobiles / VPN pour le sensible'] },
  },
};

const SCORES: Record<string, number[]> = {
  'pw-reuse': [0, 40, 100],
  mfa: [0, 50, 100],
  otp: [0, 30, 100],
  links: [0, 30, 100],
  jobs: [0, 20, 100],
  'verify-offers': [20, 60, 100],
  apk: [0, 50, 100],
  updates: [20, 60, 100],
  backup: [0, 50, 100],
  overshare: [0, 60, 100],
  wifi: [20, 60, 100],
};

const DIM_OF: Record<string, Dim> = {
  'pw-reuse': 'Account Security', mfa: 'Account Security', otp: 'Account Security',
  links: 'Scam Awareness', jobs: 'Scam Awareness', 'verify-offers': 'Scam Awareness',
  apk: 'Device Safety', updates: 'Device Safety', backup: 'Device Safety',
  overshare: 'Privacy', wifi: 'Privacy',
};

const QUESTION_IDS = Object.keys(DIM_OF);

function buildQuestions(lang: Lang): Q[] {
  return QUESTION_IDS.map((id) => ({
    id,
    dim: DIM_OF[id],
    text: QUESTION_TEXT[lang][id].text,
    options: QUESTION_TEXT[lang][id].options.map((text, i) => ({ text, score: SCORES[id][i] })),
  }));
}

const PATHS: Record<Dim, { title: string; href: string; why: string }> = {
  'Account Security': { title: 'Password Security + MFA lessons', href: '/learn/password-security', why: 'Unique passwords and a second lock stop most takeovers.' },
  'Scam Awareness': { title: 'Scenarios: Everyday scams', href: '/scenarios', why: 'Practice the exact patterns scammers use on you.' },
  'Device Safety': { title: 'Malware & Ransomware lesson', href: '/learn/malware-and-ransomware', why: 'Updates, stores-only installs, and backups.' },
  Privacy: { title: 'Spam + safe browsing guides', href: '/simulators/spam', why: 'Share less, verify networks, handle spam safely.' },
};

const PATHS_FR: Record<Dim, { title: string; why: string }> = {
  'Account Security': { title: 'Leçons mots de passe + MFA', why: 'Mots de passe uniques et second verrou contre les piratages.' },
  'Scam Awareness': { title: 'Scénarios : arnaques du quotidien', why: 'Pratiquez les schémas exacts des arnaqueurs.' },
  'Device Safety': { title: 'Leçon malwares et rançongiciels', why: 'Mises à jour, boutiques officielles, sauvegardes.' },
  Privacy: { title: 'Guides spam et navigation sûre', why: 'Partagez moins, vérifiez les réseaux, gérez le spam.' },
};

export default function RiskCheckPage() {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [done, setDone] = useState(false);
  const [saving, setSaving] = useState(false);
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const { t, lang } = useLanguage();
  const QUESTIONS = buildQuestions(lang);

  const dims = (Object.keys(PATHS) as Dim[]).map((dim) => {
    const qs = QUESTIONS.filter((q) => q.dim === dim);
    const got = qs.reduce((s, q) => s + (answers[q.id] ?? 0), 0);
    return { dim, pct: Math.round((got / (qs.length * 100)) * 100), answered: qs.every((q) => answers[q.id] !== undefined) };
  });
  const allAnswered = QUESTIONS.every((q) => answers[q.id] !== undefined);
  const overall = Math.round(dims.reduce((s, d) => s + d.pct, 0) / dims.length);
  const weakest = [...dims].sort((a, b) => a.pct - b.pct)[0];

  const save = async () => {
    setDone(true);
    if (!user || !firestore) {
      toast({ title: t.risk.resultReady, description: t.risk.signInSave });
      return;
    }
    setSaving(true);
    try {
      await setDoc(doc(collection(firestore, 'users', user.uid, 'riskChecks')), {
        scores: Object.fromEntries(dims.map((d) => [d.dim, d.pct])),
        overall,
        weakest: weakest.dim,
        createdAt: serverTimestamp(),
      });
      toast({ title: t.risk.saved, description: `${t.risk.overall}: ${overall}%. ${t.risk.savedDesc}` });
    } catch {
      toast({ variant: 'destructive', title: 'Could not save', description: 'Try again.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-5 p-4 md:p-8">
      <Link href="/" className="flex w-fit items-center gap-2 text-sm text-muted-foreground hover:text-primary">
        <ArrowLeft className="h-4 w-4" /> {t.nav.dashboard}
      </Link>
      <div className="flex items-center gap-3">
        <Gauge className="h-10 w-10 text-primary" />
        <div>
          <h1 className="font-headline text-3xl font-bold md:text-4xl">{t.risk.title}</h1>
          <p className="text-muted-foreground">{t.risk.subtitle}</p>
        </div>
      </div>

      {!done ? (
        <Card>
          <CardHeader><CardTitle className="font-headline">{t.risk.cardTitle}</CardTitle><CardDescription>{Object.keys(answers).length}/{QUESTIONS.length} {t.risk.answered}</CardDescription></CardHeader>
          <CardContent className="space-y-6">
            {QUESTIONS.map((q, i) => (
              <div key={q.id} className="space-y-2 border-b pb-5 last:border-0">
                <p className="font-medium">{i + 1}. {q.text} <span className="text-xs text-muted-foreground">({DIMS[lang][q.dim]})</span></p>
                <RadioGroup
                  value={answers[q.id] !== undefined ? String(answers[q.id]) : ''}
                  onValueChange={(v) => setAnswers((a) => ({ ...a, [q.id]: Number(v) }))}
                  className="space-y-2"
                >
                  {q.options.map((o, j) => (
                    <div key={j} className="flex items-start gap-2 rounded-md border p-3">
                      <RadioGroupItem value={String(o.score)} id={`${q.id}-${j}`} />
                      <Label htmlFor={`${q.id}-${j}`} className="cursor-pointer font-normal">{o.text}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            ))}
            <Button onClick={save} disabled={!allAnswered || saving} className="min-h-[48px] w-full sm:w-auto">
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{t.risk.seeProfile}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <Card className="border-primary/40">
            <CardHeader><CardTitle className="font-headline text-2xl">{t.risk.overall}: {overall}%</CardTitle><CardDescription>{overall >= 75 ? t.risk.strong : overall >= 45 ? t.risk.mixed : t.risk.exposed}</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              {dims.map((d) => (
                <div key={d.dim}>
                  <div className="mb-1 flex justify-between text-sm"><span className="font-medium">{DIMS[lang][d.dim]}</span><span>{d.pct}%</span></div>
                  <Progress value={d.pct} aria-label={`${DIMS[lang][d.dim]} ${d.pct} percent`} />
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="font-headline">{t.risk.yourPath} {DIMS[lang][weakest.dim]} {t.risk.first} ({weakest.pct}%)</CardTitle><CardDescription>{lang === 'fr' ? PATHS_FR[weakest.dim].why : PATHS[weakest.dim].why}</CardDescription></CardHeader>
            <CardContent className="flex flex-col gap-2 sm:flex-row">
              <Button asChild className="min-h-[44px]"><Link href={PATHS[weakest.dim].href}>{lang === 'fr' ? PATHS_FR[weakest.dim].title : PATHS[weakest.dim].title}</Link></Button>
              <Button asChild variant="outline" className="min-h-[44px]"><Link href="/scenarios">{t.risk.practiceScenarios}</Link></Button>
            </CardContent>
          </Card>
          <Button variant="outline" onClick={() => { setDone(false); }} className="min-h-[44px]">{t.risk.retake}</Button>
        </div>
      )}
    </main>
  );
}
