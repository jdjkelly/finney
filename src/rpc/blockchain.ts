import { scriptPubKey, type getrawtransaction } from './rawtransactions.js';

export type getbestblockhash = string;

// @todo clean up for verbosity mode 3
export type getblock = 
  // verbosity 0
  string | ({ // verbosity 1 
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
  // The hash of the previous block (if available)
  previousblockhash?: string;
  // The hash of the next block (if available)
  nextblockhash?: string;
} & ({ // verbosity 2
 tx: (getrawtransaction & {fee?: number})[] 
}));

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

export type getblockcount = number;

export interface getblockfilter {
  // the hex-encoded filter data
  filter: string;
  // the hex-encoded filter header
  header: string;
}

export type getblockfrompeer = Record<string, never>;

export type getblockhash = string;

// @todo use a generic instead of union to indicate type of verbosity
export type getblockheader = string | {
  // the block hash (same as provided)
  hash: string;
  // The number of confirmations, or -1 if the block is not on the main chain
  confirmations: number;
  // The block height or index
  height: number;
  // The block version
  version: number;
  // The block version formatted in hexadecimal
  versionHex: string;
  // The merkle root
  merkleroot: string;
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
  // Expected number of hashes required to produce the current chain
  chainwork: string;
  // The number of transaction in the block
  nTx: number;
  // The hash of the previous block
  previousblockhash: string;
  // The hash of the next block
  nextblockhash: string;
}

export interface getblockstats {
  // Average fee in the block
  avgfee?: number;
  // Average feerate (in satoshis per virtual byte)
  avgfeerate?: number;
  // Average transaction size
  avgtxsize?: number;
  // Block hash (to check for potential reorgs)
  blockhash?: string;
  // Feerates at the 10th, 25th, 50th, 75th, and 90th percentile of the block
  feerate_percentiles?: [number, number, number, number, number];
  // The height of the block
  height?: number;
  // The number of inputs (excluding coinbase)
  ins?: number;
  // Maximum fee in the block
  maxfee?: number;
  // Maximum feerate (in satoshis per virtual byte)
  maxfeerate?: number;
  // Maximum transaction size
  maxtxsize?: number;
  // Truncated median fee in the block
  medianfee?: number;
  // The block median time past
  mediantime?: number;
  // Truncated median transaction size
  mediantxsize?: number;
  // Minimum fee in the block
  minfee?: number;
  // Minimum feerate (in satoshis per virtual byte)
  minfeerate?: number;
  // Minimum transaction size
  mintxsize?: number;
  // The number of outputs
  outs?: number;
  // The block subsidy
  subsidy?: number;
  // Total size of all segwit transactions
  swtotal_size?: number;
  // Total weight of all segwit transctions
  swtotal_weight?: number;
  // The number of segwit transactions
  swtxs?: number;
  // The block time
  time?: number;
  // Total amount of fees in all outputs (excluding coinbase and thus reward [ie subsidy + totalfee])
  total_out?: number;
  // Total size of all non-coinbase transactions
  total_size?: number;
  // Total weight of all non-coinbase transactions
  total_weight?: number;
  // The fee total
  totalfee?: number;
  // The number of transactions (excluding coinbase)
  txs?: number;
  // The increase/decrease in the number of unspent outputs
  utxo_increase?: number;
  // The increase/decrease in size for the utxo index (not discounting op_return and similar)
  utxo_size_inc?: number;
}

export type getchaintips = [
  {
    // height of the chain tip
    height: number;
    // block hash of the tip
    hash: string;
    // zero for main chain, otherwise length of branch connecting the tip to the main chain
    branchlen: number;
    // status of the chain, "active" for the main chain
    status: 'active' | 'invalid' | 'headers-only' | 'valid-fork' | 'valid-headers';
  }
]

export interface getchaintxstats {
  // The timestamp for the final block in the window, expressed in UNIX epoch time
  time: number;
  // The total number of transactions in the chain up to that point
  txcount: number;
  // The hash of the final block in the window
  window_final_block_hash: string;
  // The height of the final block in the window
  window_final_block_height: number;
  // Size of the window in number of blocks
  window_block_count: number;
  // The number of transactions in the window. Only returned if "window_block_count" is > 0
  window_tx_count?: number;
  // The window's average transaction rate in transactions per second. Only returned if "window_block_count" is > 0
  window_interval?: number;
  // The average rate of transactions per second in the window. Only returned if "window_interval" is > 0
  tx_rate?: number;
}

export interface getdeploymentinfo {
  // requested block hash (or tip)
  hash: string;
  // requested block height (or tip)
  height: number;
  deployments: {
    // name of the deployment
    [key: string]: {
      // one of "buried", "bip9"
      type: 'buried' | 'bip9';
      // height of the first block which the rules are or will be enforced (only for "buried" type, or "bip9" type with "active" status)
      height?: number;
      // true if the rules are enforced for the mempool and the next block
      active: boolean;
      // status of bip9 softforks (only for "bip9" type)
      bip9?: {
        // the bit (0-28) in the block version field used to signal this softfork (only for "started" and "locked_in" status)
        bit?: number;
        // the minimum median time past of a block at which the bit gains its meaning
        start_time: number;
        // the median time past of a block at which the deployment is considered failed if not yet locked in
        timeout: number;
        // minimum height of blocks for which the rules may be enforced
        min_activation_height: number;
        // status of deployment at specified block (one of "defined", "started", "locked_in", "active", "failed")
        status: 'defined' | 'started' | 'locked_in' | 'active' | 'failed';
        // height of the first block to which the status applies
        since: number;
        // status of deployment at the next block
        status_next: 'defined' | 'started' | 'locked_in' | 'active' | 'failed';
        // numeric statistics about signalling for a softfork (only for "started" and "locked_in" status)
        statistics?: {
          // the length in blocks of the signalling period
          period: number;
          // the number of blocks with the version bit set required to activate the feature (only for "started" status)
          threshold: number;
          // the number of blocks elapsed since the beginning of the current period
          elapsed: number;
          // the number of blocks with the version bit set in the current period
          count: number;
          // returns false if there are not enough blocks left in this period to pass activation threshold (only for "started" status)
          possible: boolean;
        }
        // indicates blocks that signalled with a # and blocks that did not with a -
        signalling?: string;
      }
    }
  }
}

export type getdifficulty = number;

export interface mempooltx {
  // virtual transaction size as defined in BIP 141. This is different from actual serialized size for witness transactions as witness data is discounted.
  vsize: number;
  // transaction weight as defined in BIP 141.
  weight: number;
  // local time transaction entered pool in seconds since 1 Jan 1970 GMT
  time: number;
  // block height when transaction entered pool
  height: number;
  // number of in-mempool descendant transactions (including this one)
  descendantcount: number;
  // virtual transaction size of in-mempool descendants (including this one)
  descendantsize: number;
  // number of in-mempool ancestor transactions (including this one)
  ancestorcount: number;
  // virtual transaction size of in-mempool ancestors (including this one)
  ancestorsize: number;
  // hash of serialized transaction, including witness data
  wtxid: string;
  fees: {
    // transaction fee in BTC
    base: number;
    // transaction fee with fee deltas used for mining priority in BTC
    modified: number;
    // modified fees (see above) of in-mempool ancestors (including this one) in BTC
    ancestor: number;
    // modified fees (see above) of in-mempool descendants (including this one) in BTC
    descendant: number;
  };
  // unconfirmed transactions used as inputs for this transaction
  depends: string[];
  // unconfirmed transactions spending outputs from this transaction
  spentby: string[];
  // Whether this transaction could be replaced due to BIP125 (replace-by-fee)
  'bip125-replaceable': boolean;
  // Whether this transaction is currently unbroadcast (initial broadcast not yet acknowledged by any peers)
  unbroadcast: boolean;
}

// @todo use a generic instead of union to indicate type of verbosity
export type getmempoolancestors = string[] | {
  [key: string]: mempooltx
}

// @todo use a generic instead of union to indicate type of verbosity
export type getmempooldescendants = string[] | {
  [key: string]: mempooltx
}

export type getmempoolentry = mempooltx;

export interface getmempoolinfo {
  // True if the mempool is fully loaded
  loaded: boolean;
  // Current tx count
  size: number;
  // Sum of all virtual transaction sizes as defined in BIP 141. Differs from actual serialized size because witness data is discounted
  bytes: number;
  // Total memory usage for the mempool
  usage: number;
  // Total fees for the mempool in BTC, ignoring modified fees through prioritisetransaction
  total_fee: number;
  // Maximum memory usage for the mempool
  maxmempool: number;
  // Minimum fee rate in BTC/kvB for tx to be accepted. Is the maximum of minrelaytxfee and minimum mempool fee
  mempoolminfee: number;
  // Current minimum relay fee for transactions
  minrelaytxfee: number;
  // minimum fee rate increment for mempool limiting or replacement in BTC/kvB
  incrementalrelayfee: number;
  // Current number of transactions that haven't passed initial broadcast yet
  unbroadcastcount: number;
  // True if the mempool accepts RBF without replaceability signaling inspection
  fullrbf: boolean;
}

export type getrawmempool = string[] | {
  [key: string]: mempooltx;
} | { 
  txids: string[],
  // The mempool sequence value
  mempool_sequence: number;
}

export type gettxout = null | {
  // The hash of the block at the tip of the chain
  bestblock: string;
  // The number of confirmations
  confirmations: number;
  // The transaction value in BTC
  value: number;
  scriptPubKey: scriptPubKey;
  // Coinbase or not
  coinbase: boolean;
}

export type gettxoutproof = string;

export interface gettxoutsetinfo {
  // The block height (index) of the returned statistics
  height: number;
  // The hash of the block at which these statistics are calculated
  bestblock: string;
  // The number of unspent transaction outputs
  txouts: number;
  // Database-independent, meaningless metric indicating the UTXO set size
  bogosize: number;
  // The serialized hash (only present if 'hash_serialized_2' hash_type is chosen)
  hash_serialized_2?: string;
  // The serialized hash (only present if 'muhash' hash_type is chosen)
  muhash?: string;
  // The number of transactions with unspent outputs (not available when coinstatsindex is used)
  transactions?: number;
  // The estimated size of the chainstate on disk in bytes (not available when coinstatsindex is used)
  disk_size?: number;
  // The total amount of coins in the UTXO set
  total_amount: number;
  // The total amount of coins permanently excluded from the UTXO set (only available if coinstatsindex is used)
  total_unspendable_amount?: number;
  // Info on amounts in the block at this block height (only available if coinstatsindex is used)
  block_info?: {
    // Total amount of all prevouts spent in this block
    prevout_spent: number;
    // Coinbase subsidy amount of this block
    coinbase: number;
    // Total amount of new outputs created by this block
    new_outputs_ex_coinbase: number;
    // Total amount of unspendable outputs created in this block
    unspendable: number;
    // Detailed view of the unspendable categories
    unspendables: {
      // The unspendable amount of the Genesis block subsidy
      genesis_block: number;
      // Transactions overridden by duplicates (no longer possible with BIP30)
      bip30: number;
      // Amounts sent to scripts that are unspendable (for example OP_RETURN outputs)
      scripts: number;
      // Fee rewards that miners did not claim in their coinbase transaction
      unclaimed_rewards: number;
    }
  }
}

export type gettxspendingprevout = [{
  // the transaction id of the checked output
  txid: string;
  // the vout value of the checked output
  vout: number;
  // the transaction id of the mempool transaction spending this output (omitted if unspent)
  spendingtxid?: string;
}];

export type preciousblock = null;

export type pruneblockchain = number;

export interface savemempool {
  // the directory and file where the mempool was saved
  filename: string;  
}

// @todo make this generic across status
export type scantxoutset = {
  // Whether the scan was completed
  success: boolean;
  // The number of unspent transaction outputs scanned
  txouts: number;
  // The current block height (index)
  height: number;
  // The hash of the block at the tip of the chain
  bestblock: string;
  unspents: [
    {
      // The transaction id
      txid: string;
      // The vout value
      vout: number;
      // The script key
      scriptPubKey: string;
      // A specialized descriptor for the matched scriptPubKey
      desc: string;
      // The total amount in BTC of the unspent output
      amount: number;
      // Height of the unspent transaction output
      height: number;
    }
  ]
  // The total amount of all found unspent outputs in BTC
  total_amount: number;
} | boolean | {
  // Approximate percent complete
  progress: number;
}

export type verifychain = boolean;

export type verifytxoutproof = string[];