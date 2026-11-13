import {describe,it,expect} from 'vitest';
import {canCreateClub,playerNavigation} from '@/lib/account-access';
describe('account permissions',()=>{
 it('players cannot create clubs',()=>expect(canCreateClub('player')).toBe(false));
 it('stringers can create clubs',()=>expect(canCreateClub('stringer')).toBe(true));
 it('unconfigured accounts cannot create clubs',()=>expect(canCreateClub(null)).toBe(false));
 it('players receive the reduced navigation',()=>{expect(playerNavigation('player')).toBe(true);expect(playerNavigation('stringer')).toBe(false);});
});