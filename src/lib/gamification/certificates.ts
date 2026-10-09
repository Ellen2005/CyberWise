// Client-side completion certificates. The ID is deterministic from
// (user, plan) so re-renders and reinstalls show the same credential.

export function certificateIdFor(userId: string, planId: string): string {
  const input = `${userId}::${planId}::wisetap-v1`;
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (Math.imul(hash, 31) + input.charCodeAt(i)) | 0;
  }
  const body = Math.abs(hash).toString(36).toUpperCase().padStart(7, '0').slice(-7);
  return `WT-${body}`;
}

export function isValidCertificateId(id: string): boolean {
  return /^WT-[0-9A-Z]{7}$/.test(id);
}
