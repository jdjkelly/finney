export interface scriptPubKey {
  // Disassembly of the public key script
  asm: string;
  // Inferred descriptor for the output
  desc: string;
  // The raw public key script bytes, hex-encoded
  hex: string;
  // The type, eg 'pubkeyhash'
  type: string;
  // The Bitcoin address (only if a well-defined address exists)
  addresses?: string;
}

export type getrawtransaction = string | {
  // Whether specified block is in the active chain or not (only present with explicit "blockhash" argument)
  in_active_chain?: boolean;
  // the block hash
  blockhash?: string;
  // The confirmations
  confirmations: number;
  // The block time expressed in UNIX epoch time
  blocktime: number;
  // Same as "blocktime"
  time: number;
  // The serialized, hex-encoded data for 'txid'
  hex: string;
  // The transaction id (same as provided)
  txid: string;
  // The transaction hash (differs from txid for witness transactions)
  hash: string;
  // The serialized transaction size
  size: number;
  // The virtual transaction size (differs from size for witness transactions)
  vsize: number;
  // The transaction's weight (between vsize*4-3 and vsize*4)
  weight: number;
  // The version
  version: number;
  // The lock time
  locktime: number;
  vin: {
    // The coinbase value (only if coinbase transaction)
    coinbase?: string;
    // The transaction id (if not coinbase transaction)
    txid?: string;
    // The output number (if not coinbase transaction)
    vout?: number;
    // The script (if not coinbase transaction)
    scriptSig?: {
      // Disassembly of the signature script
      asm: string;
      // The raw signature script bytes, hex-encoded
      hex: string;
    };
    // hex-encoded witness data (if any)
    txinwitness?: string[];
    // The script sequence number
    sequence: number;
  }[];
  vout: {
    // The value in BTC
    value: number;
    // index
    n: number;
    scriptPubKey: scriptPubKey;
  }[]
}