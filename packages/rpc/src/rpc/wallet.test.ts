import BitcoinRPC from '../client';
import { expect, it, describe, afterEach, mock } from 'bun:test';

const bitcoinRPC = new BitcoinRPC();

const originalFetch = global.fetch;

afterEach(() => { 
  global.fetch = originalFetch  
});

describe('getwalletinfo', () => {
  it('returns an error because no wallet is loaded', async () => {
    global.fetch = mock(() => {
      return Promise.resolve({
        json: () => Promise.resolve({
          result: null,
          error: {
            code: -18,
            message: 'No wallet is loaded. Load a wallet using loadwallet or create a new one with createwallet. (Note: A default wallet is no longer automatically created)'
          },
          id: 'e8a5256f-6370-4528-a2b1-026d3e99e14e'
        })
      }) as unknown as Promise<Response>;
    });

    const info = await bitcoinRPC.getwalletinfo();

    expect(info.error?.message).toBe('No wallet is loaded. Load a wallet using loadwallet or create a new one with createwallet. (Note: A default wallet is no longer automatically created)');
  });
});