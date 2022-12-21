import Sats from '../client.js';
import { expect, it, describe } from 'bun:test';

const sats = new Sats();

describe('uptime', () => {
  it('returns an uptime', async () => {
    const uptime = await sats.uptime();
    expect(uptime.result).toBeGreaterThan(0);
  });
});

describe('help', () => {
  it('returns a help message for all commands', async () => {
    const help = await sats.help();
    expect(help.result).not.toBeUndefined();
  });

  it('returns a help message for an individual command', async () => {
    const help = await sats.help('help');
    expect(help.result.slice(0, 18)).toBe('help ( "command" )');
  });
});