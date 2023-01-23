import BitcoinRPC from '../client.js';
import { expect, it, describe } from 'bun:test';

const bitcoinRPC = new BitcoinRPC();

describe('getconnectioncount', () => {
  it('returns the number of connections', async () => {
    const connectionCount = await bitcoinRPC.getconnectioncount();
    expect(connectionCount.result).toBeGreaterThan(0);
  });
});