// Blockchain RPCs

// getbestblockhash
// Returns the hash of the best (tip) block in the most-work fully-validated chain.
export type getbestblockhash = string;

// @todo represent the version here / getrawtx
// getblock "blockhash" ( verbosity )
// If verbosity is 0, returns a string that is serialized, hex-encoded data for block ‘hash’.
// If verbosity is 1, returns an Object with information about block ‘hash’.
// If verbosity is 2, returns an Object with information about block ‘hash’ and information about each transaction.
export interface getblock {
  // the block hash (same as provided)
  hash: string;
  // The number of confirmations, or -1 if the block is not on the main chain
  confirmations: number;
  // The block size
  size: number;
  //  The block size excluding witness data
  strippedsize: number;
  // The block weight as defined in BIP 141
  weight: number;
  // The block height or index
  height: number;
  // The block version
  version: number;
  // The block version formatted in hexadecimal
  versionHex: string;
  // The merkle root
  merkleroot: string;
  // The transaction ids
  tx: string[];
  // The block time expressed in UNIX epoch time
  time: number;
  // The median block time expressed in UNIX epoch time
  mediantime: number;
  // The nonce
  nonce: number;
  // The bits
  bits: string;
  // The difficulty
  difficulty: number;
  // Expected number of hashes required to produce the chain up to this block (in hex)
  chainwork: string;
  // The number of transactions in the block
  nTx: number;
  // The hash of the previous block
  previousblockhash: string;
  // The hash of the next block
  nextblockhash: string;
}

// getblockchaininfo
// Returns an object containing various state info regarding blockchain processing.
export interface getblockchaininfo {
  // current network name (main, test, regtest)
  chain: string;
  // the height of the most-work fully-validated chain. The genesis block has height 0
  blocks: number;
  // the current number of headers we have validated
  headers: number;
  // the hash of the currently best block
  bestblockhash: string;
  // the current difficulty
  difficulty: number;
  // median time for the current best block
  mediantime: number;
  // estimate of verification progress [0..1]
  verificationprogress: number;
  // (debug information) estimate of whether this node is in Initial Block Download mode
  initialblockdownload: boolean;
  // total amount of work in active chain, in hexadecimal
  chainwork: string;
  // the estimated size of the block and undo files on disk
  size_on_disk: number;
  // if the blocks are subject to pruning
  pruned: boolean;
  // lowest-height complete block stored (only present if pruning is enabled)
  pruneheight: number;
  // whether automatic pruning is enabled (only present if pruning is enabled)
  automatic_pruning: boolean;
  // the target size used by pruning (only present if automatic pruning is enabled)
  prune_target_size: number;
  // status of softforks
  softforks: {
    // name of the softfork
    [key: string]: {
      // one of "buried", "bip9"
      type: 'buried' | 'bip9';
      // status of bip9 softforks (only for "bip9" type)
      bip9?: {
        // one of "defined", "started", "locked_in", "active", "failed"
        status: 'defined' | 'started' | 'locked_in' | 'active' | 'failed';
        // the bit (0-28) in the block version field used to signal this softfork (only for "started" status)
        bit: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28;
        // the minimum median time past of a block at which the bit gains its meaning
        start_time: number;
        // the median time past of a block at which the deployment is considered failed if not yet locked in
        timeout: number;
        // height of the first block to which the status applies
        since: number;
        // numeric statistics about BIP9 signalling for a softfork (only for "started" status)
        statistics?: {
          // the length in blocks of the BIP9 signalling period
          period: number;
          // the number of blocks with the version bit set required to activate the feature
          threshold: number;
          // the number of blocks elapsed since the beginning of the current period
          elapsed: number;
          // the number of blocks with the version bit set in the current period
          count: number;
          // returns false if there are not enough blocks left in this period to pass activation threshold
          possible: boolean;
        }
      },
      // height of the first block which the rules are or will be enforced (only for "buried" type, or "bip9" type with "active" status)
      height?: number;
      // true if the rules are enforced for the mempool and the next block
      active: boolean;
    }
  },
  // any network and blockchain warnings
  warnings: string;
}

// getblockcount
// Returns the height of the most-work fully-validated chain.
// The genesis block has height 0.
export type getblockcount = number;

// getblockfilter "blockhash" ( "filtertype" )
// Retrieve a BIP 157 content filter for a particular block.
export interface getblockfilter {
  // the hex-encoded filter data
  filter: string;
  // the hex-encoded filter header
  header: string;
}

// getblockhash height
// Returns hash of block in best-block-chain at height provided.
export type getblockhash = string;

// @todo
// getblockheader "blockhash" ( verbose )
// If verbose is false, returns a string that is serialized, hex-encoded data for blockheader ‘hash’.
// If verbose is true, returns an Object with information about blockheader ‘hash’.
export interface getblockheader {
  
}

// @todo these are optional - default is all though
// getblockstats hash_or_height ( stats )
// Compute per block statistics for a given window. All amounts are in satoshis. 
// It won’t work for some heights with pruning.
export interface getblockstats {
  // Average fee in the block
  avgfee: number;
  // Average feerate (in satoshis per virtual byte)
  avgfeerate: number;
  // Average transaction size
  avgtxsize: number;
  // Block hash (to check for potential reorgs)
  blockhash: string;
  // Feerates at the 10th, 25th, 50th, 75th, and 90th percentile of the block
  feerate_percentiles: [number, number, number, number, number];
  // The height of the block
  height: number;
  // The number of inputs (excluding coinbase)
  ins: number;
  // Maximum fee in the block
  maxfee: number;
  // Maximum feerate (in satoshis per virtual byte)
  maxfeerate: number;
  // Maximum transaction size
  maxtxsize: number;
  // Truncated median fee in the block
  medianfee: number;
  // The block median time past
  mediantime: number;
  // Truncated median transaction size
  mediantxsize: number;
  // Minimum fee in the block
  minfee: number;
  // Minimum feerate (in satoshis per virtual byte)
  minfeerate: number;
  // Minimum transaction size
  mintxsize: number;
  // The number of outputs
  outs: number;
  // The block subsidy
  subsidy: number;
  // Total size of all segwit transactions
  swtotal_size: number;
  // Total weight of all segwit transctions
  swtotal_weight: number;
  // The number of segwit transactions
  swtxs: number;
  // The block time
  time: number;
  // Total amount of fees in all outputs (excluding coinbase and thus reward [ie subsidy + totalfee])
  total_out: number;
  // Total size of all non-coinbase transactions
  total_size: number;
  // Total weight of all non-coinbase transactions
  total_weight: number;
  // The fee total
  totalfee: number;
  // The number of transactions (excluding coinbase)
  txs: number;
  // The increase/decrease in the number of unspent outputs
  utxo_increase: number;
  // The increase/decrease in size for the utxo index (not discounting op_return and similar)
  utxo_size_inc: number;
}

// getchaintips
// getchaintxstats
// getdifficulty
// getmempoolancestors
// getmempooldescendants
// getmempoolentry
// getmempoolinfo
// getrawmempool
// gettxout
// gettxoutproof
// gettxoutsetinfo
// preciousblock
// pruneblockchain
// savemempool
// scantxoutset
// verifychain
// verifytxoutproof
