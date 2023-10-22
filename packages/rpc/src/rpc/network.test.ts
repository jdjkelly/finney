import BitcoinRPC from '../client';
import { expect, it, describe, mock, afterEach } from 'bun:test';

const bitcoinRPC = new BitcoinRPC();

const originalFetch = global.fetch;

afterEach(() => { 
  global.fetch = originalFetch  
});

describe('getconnectioncount', () => {
  it('returns the number of connections', async () => {
    global.fetch = mock(() => {
      return Promise.resolve({
        json: () => Promise.resolve({
          result: 1
        })
      }) as unknown as Promise<Response>;
    });

    const connectionCount = await bitcoinRPC.getconnectioncount();
    
    expect(connectionCount.result).toBeGreaterThan(0);
  });
});