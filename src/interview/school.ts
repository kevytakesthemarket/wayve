const KNOWN: Record<string, string> = {
  'northwestern.edu': 'Northwestern',
  'u.northwestern.edu': 'Northwestern',
  'umich.edu': 'Michigan',
  'ucla.edu': 'UCLA',
  'berkeley.edu': 'Berkeley',
  'stanford.edu': 'Stanford',
  'columbia.edu': 'Columbia',
  'nyu.edu': 'NYU',
  'uchicago.edu': 'UChicago',
  'uiuc.edu': 'Illinois',
  'illinois.edu': 'Illinois',
  'wisc.edu': 'Wisconsin',
  'osu.edu': 'Ohio State',
  'psu.edu': 'Penn State',
  'gatech.edu': 'Georgia Tech',
  'cmu.edu': 'Carnegie Mellon',
  'mit.edu': 'MIT',
  'harvard.edu': 'Harvard',
  'yale.edu': 'Yale',
  'princeton.edu': 'Princeton',
  'brown.edu': 'Brown',
  'cornell.edu': 'Cornell',
  'dartmouth.edu': 'Dartmouth',
  'upenn.edu': 'Penn',
  'usc.edu': 'USC',
  'utexas.edu': 'UT Austin',
  'uw.edu': 'Washington',
  'washington.edu': 'Washington',
};

function titleCase(value: string): string {
  return value
    .split(/[-_]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

/** Derive a readable school name from an email. Mock-friendly; swap for a registrar list later. */
export function schoolFromEmail(email: string): string {
  const match = email.trim().toLowerCase().match(/@([^@\s]+)$/);
  if (!match) return 'your school';
  let domain = match[1];
  if (KNOWN[domain]) return KNOWN[domain];
  domain = domain.replace(/^(mail|students|student|email|u|alumni)\./, '');
  if (KNOWN[domain]) return KNOWN[domain];
  const stripped = domain.replace(/\.edu$/, '').replace(/\.ac\.[a-z]{2,3}$/, '');
  const parts = stripped.split('.').filter(Boolean);
  const slug = parts[parts.length - 1] || '';
  if (!slug || slug.length < 2) return 'your school';
  return titleCase(slug);
}

export function looksLikeEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}
