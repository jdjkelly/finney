import BitcoinRPC from '../client.js';
import { expect, it, describe } from 'bun:test';

const bitcoinRPC = new BitcoinRPC();

describe('getmininginfo', () => {
  it('returns mininig info', async () => {
    const miningInfo = await bitcoinRPC.getmininginfo();
    expect(miningInfo.result).not.toBeUndefined();
    expect(typeof(miningInfo.result) === 'object').toBe(true);
  });
});