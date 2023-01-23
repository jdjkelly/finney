import BitcoinRPC from '../client.js';
import { expect, it, describe } from 'bun:test';

const bitcoinRPC = new BitcoinRPC();

describe('getmemoryinfo', () => {
  it('returns memory info', async () => {
    const memoryInfo = await bitcoinRPC.getmemoryinfo();
    expect(memoryInfo.result).not.toBeUndefined();
    expect(typeof(memoryInfo.result) === 'object').toBe(true);
  });

  it('returns object when asking for stats', async () => {
    const memoryInfo = await bitcoinRPC.getmemoryinfo({ mode: 'stats' });
    expect(memoryInfo.result).not.toBeUndefined();
    expect(typeof(memoryInfo.result) === 'object').toBe(true);
  });
});

describe('uptime', () => {
  it('returns an uptime', async () => {
    const uptime = await bitcoinRPC.uptime();
    expect(uptime.result).toBeGreaterThan(0);
  });
});

describe('help', () => {
  it('returns a help message for all commands', async () => {
    const help = await bitcoinRPC.help();
    expect(help.result).not.toBeUndefined();
  });

  it('returns a help message for an individual command', async () => {
    const help = await bitcoinRPC.help({ command: 'help' });
    expect(help.result?.slice(0, 18)).toBe('help ( "command" )');
  });
});