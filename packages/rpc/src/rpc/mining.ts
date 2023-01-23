export interface getblocktemplate_template_request {
  // This must be set to "template", "proposal" (see BIP 23), or omitted
  mode?: string;
  // A list of strings
  capabilities?: ('longpoll' | 'coinbasevalue' | 'proposal' | 'serverlist' | 'workid')[];
  // A list of strings
  rules: ['segwit'] & string[];
}

// @todo support generic here
export type GetBlockTemplate = null | string | {
  // The preferred block version
  version: number;
  // specific block rules that are to be enforced
  rules: string[];
  // set of pending, supported versionbit (BIP 9) softfork deployments
  vbavailable: {
    // identifies the bit number as indicating acceptance and readiness for the named softfork rule
    rulename: number;
  };
  capabilities: string[];
  // bit mask of versionbits the server requires set in submissions
  vbrequired: number;
  // The hash of current highest block
  previousblockhash: string;
  // contents of non-coinbase transactions that should be included in the next block
  transactions: [{
    // transaction data encoded in hexadecimal (byte-for-byte)
    data: string;
    // transaction id encoded in little-endian hexadecimal
    txid: string;
    // hash encoded in little-endian hexadecimal (including witness data)
    hash: string;
    // transactions before this one (by 1-based index in 'transactions' list) that must be present in the final block if this one is
    depends: number[];
    // difference in value between transaction inputs and outputs (in satoshis); for coinbase transactions, this is a negative Number of the total collected block fees (ie, not including the block subsidy); if key is not present, fee is unknown and clients MUST NOT assume there isn't one
    fee: number;
    // total SigOps cost, as counted for purposes of block limits; if key is not present, sigop cost is unknown and clients MUST NOT assume it is zero
    sigops: number;
    // total transaction weight, as counted for purposes of block limits
    weight: number;
  }];
  // data that should be included in the coinbase's scriptSig content
  coinbaseaux: {
    // values must be in the coinbase (keys may be ignored)
    key: string;
  };
  // maximum allowable input to coinbase transaction, including the generation award and transaction fees (in satoshis)
  coinbasevalue: number;
  // an id to include with a request to longpoll on an update to this template
  longpollid: string;
  // The hash target
  target: string;
  // The minimum timestamp appropriate for the next block time, expressed in UNIX epoch time
  mintime: number;
  // list of ways the block template may be changed
  mutable: string[];
  // A range of valid nonces
  noncerange: string;
  // limit of sigops in blocks
  sigoplimit: number;
  // limit of block size
  sizelimit: number;
  // limit of block weight
  weightlimit: number;
  // current timestamp in UNIX epoch time
  curtime: number;
  // compressed target of next block
  bits: string;
  // The height of the next block
  height: number;
  // Only on signet
  signet_challenge?: string;
  // a valid witness commitment for the unmodified block template
  default_witness_commitment?: string;
}

export interface GetMiningInfo {
  // The current block
  blocks: number;
  // The block weight of the last assembled block (only present if a block was ever assembled)
  currentblockweight?: number;
  // The number of block transactions of the last assembled block (only present if a block was ever assembled)
  currentblocktx?: number;
  // The current difficulty
  difficulty: number;
  // The network hashes per second
  networkhashps: number;
  // The size of the mempool
  pooledtx: number;
  // current network name (main, test, signet, regtest)
  chain: 'main' | 'test' | 'signet' | 'regtest';
  // any network and blockchain warnings
  warnings: string;
}

export type GetNetworkHashps = number;

export type PrioritiseTransaction = boolean;

export type SubmitBlock = null | string;

export type SubmitHeader = null;