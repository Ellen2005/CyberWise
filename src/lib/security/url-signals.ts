// Client-side URL signal explainer. Static signals only — no verdicts, no network calls.
// "No warning detected" is NEVER presented as "guaranteed safe".

export type UrlSignal = {
  level: 'warn' | 'info';
  label: string;
  detail: string;
};

export type UrlAnalysis = {
  input: string;
  signals: UrlSignal[];
};

const SHORTENERS = new Set([
  'bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'ow.ly', 'is.gd', 'buff.ly',
  'adf.ly', 'shorte.st', 'cutt.ly', 'rebrand.ly', 'shorturl.at',
]);

function rootDomain(host: string): string {
  if (/^\d+\.\d+\.\d+\.\d+$/.test(host) || host.startsWith('[')) return host;
  const parts = host.split('.');
  return parts.length <= 2 ? host : parts.slice(-2).join('.');
}

export function analyzeUrl(raw: string): UrlAnalysis {
  const input = raw.trim();
  let text = input;
  if (!/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(text)) text = 'https://' + text;

  let url: URL;
  try {
    url = new URL(text);
  } catch {
    // Browsers and Node reject malformed internationalized domains outright —
    // that rejection is itself a signal worth explaining.
    const signals: UrlSignal[] = [
      { level: 'warn', label: 'Not a valid URL', detail: 'This does not parse as a web address. Treat it as suspicious and do not open it.' },
    ];
    if (/xn--/i.test(input)) {
      signals.push({
        level: 'warn',
        label: 'Unusual domain encoding (punycode)',
        detail: 'The address uses encoded special characters that your browser refuses to resolve. Attackers use lookalike letters from other alphabets — never open such links.',
      });
    }
    return { input, signals };
  }

  const signals: UrlSignal[] = [];
  const host = url.hostname.toLowerCase();

  if (url.protocol === 'http:') {
    signals.push({ level: 'warn', label: 'Not encrypted (http)', detail: 'Data you send can be read in transit. Never enter passwords or payments on http pages.' });
  } else if (url.protocol !== 'https:') {
    signals.push({ level: 'warn', label: `Unusual scheme (${url.protocol})`, detail: 'Web pages use https. Anything else deserves caution.' });
  }

  if (/^\d+\.\d+\.\d+\.\d+$/.test(host) || host.startsWith('[')) {
    signals.push({ level: 'warn', label: 'IP address instead of a name', detail: 'Legitimate sites use domain names. Bare IP addresses are common in phishing and malware links.' });
  }

  if (host.includes('xn--')) {
    signals.push({ level: 'warn', label: 'Special characters in domain (punycode)', detail: 'Attackers use lookalike letters from other alphabets (e.g. paypaI vs paypal). Inspect letter by letter.' });
  }

  if (SHORTENERS.has(rootDomain(host))) {
    signals.push({ level: 'warn', label: 'Shortened link', detail: 'Shorteners hide the real destination. Expand it (or avoid it) before deciding.' });
  }

  const subDepth = host.split('.').length - 2;
  if (subDepth >= 2) {
    signals.push({ level: 'warn', label: 'Many subdomains', detail: `"${host}" stacks names to bury the real domain, which is "${rootDomain(host)}". Read right-to-left up to the first slash.` });
  }

  if (/[@]/.test(url.username + url.password) || url.username) {
    signals.push({ level: 'warn', label: '"@" trick or credentials in URL', detail: 'Everything before @ in a URL is ignored by the browser for navigation — attackers abuse this to fake destinations.' });
  }

  if (url.port && !['80', '443', ''].includes(url.port)) {
    signals.push({ level: 'info', label: `Unusual port (:${url.port})`, detail: 'Normal sites use default ports. Odd ports merit a second look.' });
  }

  if (/(login|signin|verify|secure|account|update|confirm|bank|payment)/i.test(url.pathname + url.search)) {
    signals.push({ level: 'info', label: 'Login/action keywords in path', detail: 'Pages asking you to log in or verify deserve the full check: type the official address yourself instead.' });
  }

  signals.push({
    level: 'info',
    label: `Real domain: ${rootDomain(host)}`,
    detail: 'Ask: do you recognize this exact domain as the real service? When unsure, navigate there yourself instead of tapping.',
  });

  return { input, signals };
}
