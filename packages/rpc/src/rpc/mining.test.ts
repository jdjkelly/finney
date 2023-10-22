import BitcoinRPC from '../client';
import { expect, it, describe, mock, afterEach } from 'bun:test';

const bitcoinRPC = new BitcoinRPC();

const originalFetch = global.fetch;

afterEach(() => { 
  global.fetch = originalFetch  
});

describe('getmininginfo', () => {
  it('returns mininig info', async () => {
    global.fetch = mock(() => {
      return Promise.resolve({
        json: () => Promise.resolve({
          result: {
            blocks: 0,
            currentblockweight: 0,
            currentblocktx: 0,
            difficulty: 0,
            networkhashps: 0,
            pooledtx: 0,
            chain: 'test',
            warnings: ''
          }
        })
      }) as unknown as Promise<Response>;
    })

    const miningInfo = await bitcoinRPC.getmininginfo();

    expect(miningInfo.result).not.toBeUndefined();
    expect(typeof(miningInfo.result) === 'object').toBe(true);
  });
});