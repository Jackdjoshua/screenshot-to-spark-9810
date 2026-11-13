export type AccountType = 'player' | 'stringer';
export function canCreateClub(type: AccountType | null | undefined) { return type === 'stringer'; }
export function playerNavigation(type: AccountType | null | undefined) { return type === 'player'; }