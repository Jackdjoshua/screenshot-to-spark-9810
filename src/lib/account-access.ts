export type AccountType = 'player' | 'stringer';
export function canCreateClub(type: AccountType | null | undefined) { return type === 'stringer'; }
export function playerNavigation(type: AccountType | null | undefined) { return type === 'player'; }
// Short, shareable club access code. Uses an ambiguity-free alphabet.
export function generateClubCode() {
  const alphabet = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, value => alphabet[value % alphabet.length]).join('').toLowerCase();
}
