import {describe,it,expect} from 'vitest';
import {safeAuthDestination} from '@/lib/auth-navigation';
describe('private workspace login destinations',()=>{
 it('preserves a protected profile destination',()=>expect(safeAuthDestination('/profile#edit')).toBe('/profile#edit'));
 it('preserves printed QR fragments through sign-in',()=>expect(safeAuthDestination('/#/j?v=1&i=123')).toBe('/#/j?v=1&i=123'));
 it('rejects external sign-in redirects',()=>{expect(safeAuthDestination('https://example.com')).toBe('/');expect(safeAuthDestination('//example.com')).toBe('/');});
 it('never redirects back into sign-in',()=>expect(safeAuthDestination('/auth')).toBe('/'));
});