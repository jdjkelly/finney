import BitcoinRPC from '../client.js';
import { expect, it, describe } from 'bun:test';

const bitcoinRPC = new BitcoinRPC();

const GENESIS = '000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f';

describe('getblockhash', () => {
  it('returns the block hash for genesis', async () => {
    const blockhash = await bitcoinRPC.getblockhash(0);
    expect(blockhash.result).toBe(GENESIS);
  });
});

describe('getblock', () => {
  it('returns the block for genesis', async () => {
    const block = await bitcoinRPC.getblock(GENESIS);
    expect(typeof(block.result) === 'object' && block.result?.hash).toBe(GENESIS);
  });

  it('returns an error when the hash does not exist', async () => {
    const block = await bitcoinRPC.getblock('badhash');
    expect(block.error?.message).toBe('blockhash must be of length 64 (not 7, for \'badhash\')');
  });

  it('when the verbosity is 0, return hex-encoded data for block hash', async () => {
    const block = await bitcoinRPC.getblock(GENESIS, 0);
    expect(block.result).toBe('0100000000000000000000000000000000000000000000000000000000000000000000003ba3edfd7a7b12b27ac72c3e67768f617fc81bc3888a51323a9fb8aa4b1e5e4a29ab5f49ffff001d1dac2b7c0101000000010000000000000000000000000000000000000000000000000000000000000000ffffffff4d04ffff001d0104455468652054696d65732030332f4a616e2f32303039204368616e63656c6c6f72206f6e206272696e6b206f66207365636f6e64206261696c6f757420666f722062616e6b73ffffffff0100f2052a01000000434104678afdb0fe5548271967f1a67130b7105cd6a828e03909a67962e0ea1f61deb649f6bc3f4cef38c4f35504e51ec112de5c384df7ba0b8d578a4c702b6bf11d5fac00000000');
  });
});

describe('getblockheader', () => {
  it('returns the block header for genesis', async () => {
    const blockheader = await bitcoinRPC.getblockheader(GENESIS);
    // @todo need to support generic instead of union
    expect(typeof(blockheader.result) === 'object' && blockheader.result?.hash).toBe(GENESIS);
  });
});

describe('getchaintips', () => {
  it('returns the chain tips', async () => {
    const chaintips = await bitcoinRPC.getchaintips();
    expect(chaintips.result?.filter((tip) => tip.status == 'active').length).toBe(1);
  });
});

describe('getdifficulty', () => {
  it('returns the difficulty', async () => {
    const difficulty = await bitcoinRPC.getdifficulty();
    expect(difficulty.result).toBeGreaterThan(1);
  });
});