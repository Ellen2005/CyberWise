export type KevNewsItem = {
  title: string;
  source: string;
  date: string;
  description: string;
  link: string;
  imageId: string;
  verified: boolean;
};

type KevEntry = {
  cveID: string;
  vendorProject: string;
  product: string;
  vulnerabilityName: string;
  dateAdded: string;
  shortDescription: string;
  requiredAction: string;
};

/** Fetch the CISA Known Exploited Vulnerabilities catalog (public, no key). */
export async function fetchKevItems(max = 20): Promise<KevNewsItem[]> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 10000);
  try {
    const res = await fetch(
      'https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json',
      { signal: ctrl.signal, next: { revalidate: 21600 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    const vulns: KevEntry[] = (data.vulnerabilities ?? []).slice(0, 60);
    vulns.sort((a, b) => (b.dateAdded > a.dateAdded ? 1 : -1));
    return vulns.slice(0, max).map((v, i) => ({
      title: `${v.vendorProject} ${v.product}: ${v.vulnerabilityName}`,
      source: 'CISA Known Exploited Vulnerabilities',
      date: v.dateAdded,
      description: `${v.shortDescription} Required action: ${v.requiredAction}`,
      link: `https://nvd.nist.gov/vuln/detail/${v.cveID}`,
      imageId: `news${(i % 20) + 1}`,
      verified: true,
    }));
  } catch {
    return [];
  } finally {
    clearTimeout(timer);
  }
}
