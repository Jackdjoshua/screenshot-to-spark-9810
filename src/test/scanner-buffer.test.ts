import {it,expect,vi} from 'vitest';
import {createScannerBuffer} from '@/lib/scanner-buffer';
it('waits 250 ms after the last line before reading a multiline tag',()=>{vi.useFakeTimers();const read=vi.fn();const buffer=createScannerBuffer(read);buffer.push('RACQR/1 ABBEY-0042');vi.advanceTimersByTime(200);buffer.push('RACQR/1 ABBEY-0042\nName: Player');vi.advanceTimersByTime(249);expect(read).not.toHaveBeenCalled();vi.advanceTimersByTime(1);expect(read).toHaveBeenCalledExactlyOnceWith('RACQR/1 ABBEY-0042\nName: Player');vi.useRealTimers();});
