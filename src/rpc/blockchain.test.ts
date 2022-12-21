import Sats from '../client.js';
import { expect, it, describe } from 'bun:test';

const sats = new Sats();

describe('getblockhash', () => {
  it('returns the block hash for genesis', async () => {
    const blockhash = await sats.getblockhash(0);
    expect(blockhash.result).toBe('000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f');
  });
});

describe('getblockheader', () => {
  it('returns the block header for genesis', async () => {
    const blockheader = await sats.getblockheader('000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f');
    // @todo need to support generic instead of union
    expect(blockheader.result.hash).toBe('000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f');
  });
});

describe('getchaintips', () => {
  it('returns the chain tips', async () => {
    const chaintips = await sats.getchaintips();
    expect(chaintips.result.filter((tip) => tip.status == 'active').length).toBe(1);
  });
})

describe('getdifficulty', () => {
  it('returns the difficulty', async () => {
    const difficulty = await sats.getdifficulty();
    expect(difficulty.result).toBeGreaterThan(1);
  });
})