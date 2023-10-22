import BitcoinRPC from '../client';
import { expect, it, describe, afterEach, mock } from 'bun:test';

const bitcoinRPC = new BitcoinRPC();

const originalFetch = global.fetch;

afterEach(() => { 
  global.fetch = originalFetch  
});

const GENESIS = '000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f';
const GENESIS_BLOCK = '0100000000000000000000000000000000000000000000000000000000000000000000003ba3edfd7a7b12b27ac72c3e67768f617fc81bc3888a51323a9fb8aa4b1e5e4a29ab5f49ffff001d1dac2b7c0101000000010000000000000000000000000000000000000000000000000000000000000000ffffffff4d04ffff001d0104455468652054696d65732030332f4a616e2f32303039204368616e63656c6c6f72206f6e206272696e6b206f66207365636f6e64206261696c6f757420666f722062616e6b73ffffffff0100f2052a01000000434104678afdb0fe5548271967f1a67130b7105cd6a828e03909a67962e0ea1f61deb649f6bc3f4cef38c4f35504e51ec112de5c384df7ba0b8d578a4c702b6bf11d5fac00000000';
const GENESIS_BLOCK_HEADER = '0100000000000000000000000000000000000000000000000000000000000000000000003ba3edfd7a7b12b27ac72c3e67768f617fc81bc3888a51323a9fb8aa4b1e5e4a29ab5f49ffff001d1dac2b7c';

describe('getblockhash', () => {
  it('returns the block hash for genesis', async () => {
    global.fetch = mock(() => {
      return Promise.resolve({
        json: () => Promise.resolve({
          result: GENESIS
        })
      }) as unknown as Promise<Response>;
    });

    const blockhash = await bitcoinRPC.getblockhash({ height: 0 });

    expect(blockhash.result).toBe(GENESIS);
  });
});

describe('getblock', () => {
  it('returns the block for genesis', async () => {
    global.fetch = mock(() => {
      return Promise.resolve({
        json: () => Promise.resolve({
          result: {
            hash: "000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f",
            confirmations: 809246,
            height: 0,
            version: 1,
            versionHex: "00000001",
            merkleroot: "4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b",
            time: 1231006505,
            mediantime: 1231006505,
            nonce: 2083236893,
            bits: "1d00ffff",
            difficulty: 1,
            chainwork: "0000000000000000000000000000000000000000000000000000000100010001",
            nTx: 1,
            nextblockhash: "00000000839a8e6886ab5951d76f411475428afc90947ee320161bbf18eb6048",
            strippedsize: 285,
            size: 285,
            weight: 1140,
            tx: [ "4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b" ]
          }
        })
      }) as unknown as Promise<Response>;
    })

    const block = await bitcoinRPC.getblock({ blockhash: GENESIS });

    expect(typeof(block.result) === 'object' && block.result?.hash).toBe(GENESIS);
  });

  it('returns an error when the hash does not exist', async () => {
    global.fetch = mock(() => {
      return Promise.resolve({
        json: () => Promise.resolve({
          error: {
            code: -5,
            message: "Block not found"
          }
        })
      }) as unknown as Promise<Response>;
    })
    
    const block = await bitcoinRPC.getblock({ blockhash: '0000000000000000000000000000000000000000000000000000000000000000' });
        
    expect(block.error?.message).toBe('Block not found');
  });

  it('when the verbosity is 0, return hex-encoded data for block hash', async () => {
    global.fetch = mock(() => {
      return Promise.resolve({
        json: () => Promise.resolve({
          result: GENESIS_BLOCK
        })
      }) as unknown as Promise<Response>;
    });

    const block = await bitcoinRPC.getblock({ blockhash: GENESIS, verbosity: 0 });
    
    expect(block.result).toBe(GENESIS_BLOCK);
  });
});

describe('getblockheader', () => {
  it('returns the block header for genesis', async () => {
    global.fetch = mock(() => {
      return Promise.resolve({
        json: () => Promise.resolve({
          result: {
            hash: "000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f",
            confirmations: 809246,
            height: 0,
            version: 1,
            versionHex: "00000001",
            merkleroot: "4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b",
            time: 1231006505,
            mediantime: 1231006505,
            nonce: 2083236893,
            bits: "1d00ffff",
            difficulty: 1,
            chainwork: "0000000000000000000000000000000000000000000000000000000100010001",
            nTx: 1,
            nextblockhash: "00000000839a8e6886ab5951d76f411475428afc90947ee320161bbf18eb6048"
          }
        })
      }) as unknown as Promise<Response>;
    })

    const blockheader = await bitcoinRPC.getblockheader({ blockhash: GENESIS });

    expect(blockheader.result?.hash).toBe(GENESIS);
  });

  it('returns the hex for genesis when verbose is false', async () => {
    global.fetch = mock(() => {
      return Promise.resolve({
        json: () => Promise.resolve({
          result: GENESIS_BLOCK_HEADER
        })
      }) as unknown as Promise<Response>;
    });

    const blockheader = await bitcoinRPC.getblockheader({ blockhash: GENESIS, verbose: false });

    expect(blockheader.result).toBe(GENESIS_BLOCK_HEADER);
  });
});

describe('getmempoolancestors', () => {
  it('returns the mempool ancestors for a transaction', async () => {
    global.fetch = mock(() => {
      return Promise.resolve({
        json: () => Promise.resolve({
          error: {
            code: -5,
            message: "Transaction not in mempool"
          }
        })
      }) as unknown as Promise<Response>;
    });
    
    const mempoolancestors = await bitcoinRPC.getmempoolancestors({ txid: '0000000000000000000000000000000000000000000000000000000000000000' });

    expect(mempoolancestors.error?.message).toBe('Transaction not in mempool');
  });
});

describe('getmempooldescendants', () => {
  it('returns the mempool descendants for a transaction', async () => {
    global.fetch = mock(() => {
      return Promise.resolve({
        json: () => Promise.resolve({
          error: {
            code: -5,
            message: "Transaction not in mempool"
          }
        })
      }) as unknown as Promise<Response>;
    });

    const mempooldescendants = await bitcoinRPC.getmempooldescendants({ txid: '0000000000000000000000000000000000000000000000000000000000000000' });

    expect(mempooldescendants.error?.message).toBe('Transaction not in mempool');
  });
});

describe('getrawmempool', () => {
  it('returns the raw mempool', async () => {
    global.fetch = mock(() => {
      return Promise.resolve({
        json: () => Promise.resolve({
          result: [
            "23ea43b94084e7be879df870d1afd4bf1c7c2d06fd55b07a6320f69ee4467095", "837f5f9aceeca2cc7f85880eb7819807d76c88eb465207d4ed6eea616ea47dab",
            "cbf47b199c760ec1ccfdee2d0b889951698a040320dd9a0935a0af9dc69efdda", "abf21d4f530e0b98a233bc80a1706940f52ba5fd19340ded1c4e446f13fbf0d7",
            "991d40eec3cdcbb3d48f1eed63addddebec966f634dda5fc38e09af09e389311", "ffcd56db000b4cf636290b28b64a058d95c989fc2266b2422985056294890568",
            "38628c15bee86c47cc2a327ca5f1a156127a6fe972560231ed1643a5d540e78f", "e9dafbe9aeb527726cd6678734ab3598d13a6a49fcba2bc034a08ea487281f74",
            "876dd35fb2e34f56b137dd3c82fdbceafc09e9a1597c0e634c9475819db72026", "6bd0731239b3538df5db4194a61e4e92fc4e23f6be25cbfc3d987968e73db7f0"
          ]
        })
      }) as unknown as Promise<Response>;
    });

    const rawmempool = await bitcoinRPC.getrawmempool({ verbose: false });

    expect(rawmempool.result?.length).toBeGreaterThan(0);
  });
});

describe('getchaintips', () => {
  it('returns the chain tips', async () => {
    global.fetch = mock(() => {
      return Promise.resolve({
        json: () => Promise.resolve({
          result: [
            {
              height: 810453,
              hash: "0000000000000000000434bd6587447ca27d771dacd85a21bd118f580f05d001",
              branchlen: 1208,
              status: "headers-only"
            }, {
              height: 809245,
              hash: "000000000000000000028ddc68bcec55d3a887ecb1dd64e3f360bfc19acc1dfb",
              branchlen: 0,
              status: "active"
            }, {
              height: 800786,
              hash: "000000000000000000020e419bbdd75f21609d5a050a24bafe45b73a1574127d",
              branchlen: 1,
              status: "valid-headers"
            }, {
              height: 792379,
              hash: "000000000000000000032956cbfd8721abe0572d81542e75e38e6185312bee09",
              branchlen: 1,
              status: "valid-fork"
            }, {
              height: 789603,
              hash: "00000000000000000002cf6c7ae527fb21ce7721a7772c1da2998aa866b8a37a",
              branchlen: 1,
              status: "valid-fork"
            }, {
              height: 789147,
              hash: "000000000000000000044390f8c5e9cfec8b27ba6d876d3cb7986b961f0eb30d",
              branchlen: 1,
              status: "valid-fork"
            }, {
              height: 789135,
              hash: "0000000000000000000271e983f5999ee41b8fada533ffeb77a750e7d3a47c31",
              branchlen: 1,
              status: "headers-only"
            }, {
              height: 788837,
              hash: "00000000000000000002f51100fafb5c60b2dc9623554c219afef3cf398cecbe",
              branchlen: 1,
              status: "valid-fork"
            }, {
              height: 777172,
              hash: "0000000000000000000215ac1b6fd564d8d4707631f6b77273521eb1e242cf28",
              branchlen: 1,
              status: "valid-headers"
            }, {
              height: 772981,
              hash: "0000000000000000000682990a0dae862b48e0451d619938215dd47ed9560200",
              branchlen: 1,
              status: "valid-fork"
            }, {
              height: 759781,
              hash: "000000000000000000025edbf5ea025e4af2674b318ba82206f70681d97ca162",
              branchlen: 1,
              status: "valid-headers"
            }, {
              height: 733430,
              hash: "00000000000000000006ead1cff09f279f7beb31a7290c2a603b0776d98dc334",
              branchlen: 1,
              status: "valid-headers"
            }, {
              height: 714637,
              hash: "00000000000000000009f819d004fea5bcb77bda25f4906d0a39e79c9ba19590",
              branchlen: 1,
              status: "valid-headers"
            }, {
              height: 714367,
              hash: "0000000000000000000b2e70d7675bc7b4e89d384d0e6e1a7ecc2779e1d93244",
              branchlen: 1,
              status: "valid-headers"
            }
          ]
        })
      }) as unknown as Promise<Response>;
    });

    const chaintips = await bitcoinRPC.getchaintips();

    expect(chaintips.result?.filter((tip) => tip.status == 'active').length).toBe(1);
  });
});

describe('getdifficulty', () => {
  it('returns the difficulty', async () => {
    global.fetch = mock(() => {
      return Promise.resolve({
        json: () => Promise.resolve({
          result: 57119871304635.31
        })
      }) as unknown as Promise<Response>;
    });

    const difficulty = await bitcoinRPC.getdifficulty();

    expect(difficulty.result).toBeGreaterThan(1);
  });
});