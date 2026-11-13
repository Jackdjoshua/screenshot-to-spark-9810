import {describe,it,expect} from 'vitest';
import {jobInput,jobPatch,toJobInsert,toLegacy} from '@/lib/racqr-api';
const input={racket:'Wilson Blade',mainsString:'ALU Power',mainsTension:52};
describe('Migrated API contracts',()=>{
 it('maps original camel-case job fields and defaults crosses to mains',()=>expect(toJobInsert(jobInput.parse(input),'club-1')).toMatchObject({club_id:'club-1',racket:'Wilson Blade',mains_string:'ALU Power',mains_tension:52,crosses_tension:52}));
 it('returns original camel-case fields',()=>expect(toLegacy({job_number:'ABBEY-0042',payment_status:'u'})).toEqual({jobNumber:'ABBEY-0042',paymentStatus:'u'}));
 it('rejects club reassignment in patches',()=>expect(jobPatch.safeParse({clubId:'forged'}).success).toBe(false));
 it('rejects negative tensions',()=>expect(jobInput.safeParse({...input,mainsTension:-1}).success).toBe(false));
});
