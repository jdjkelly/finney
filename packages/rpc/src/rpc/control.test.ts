import BitcoinRPC from '../client.js';
import { expect, it, describe } from 'bun:test';

const bitcoinRPC = new BitcoinRPC();

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
    const help = await bitcoinRPC.help('help');
    expect(help.result.slice(0, 18)).toBe('help ( "command" )');
  });
});