export interface ScriptPubKey {
  // Disassembly of the public key script
  asm: string;
  // Inferred descriptor for the output
  desc: string;
  // The raw public key script bytes, hex-encoded
  hex: string;
  // The type, eg 'pubkeyhash'
  type: 'nonstandard' | 'pubkey' | 'pubkeyhash' | 'scripthash' | 'multisig' | 'nulldata' | 'witness_v0_scripthash' | 'witness_v0_keyhash' | 'witness_v1_taproot' | 'witness_unknown';
  // The Bitcoin address (only if a well-defined address exists)
  addresses?: string;
}

export interface Vout {
  // The value in BTC
  value: number;
  // index
  n: number;
  scriptPubKey: ScriptPubKey;
}

export interface Vin {
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
}

export interface GetRawTransaction {
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
  vin: Vin[];
  vout: Vout[]
}

export type GetRawTransactionHexEncoded = string;

export interface DecodeRawTransaction {
  // The transaction id
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
  vin: Vin[];
  vout: Vout[];
}

export interface AnalyzePsbt {
  inputs?: Array<{
    // Whether a UTXO is provided
    has_utxo: boolean;
    // Whether the input is finalized
    is_final: boolean;
    // Things that are missing that are required to complete this input
    missing?: {
      // Public key ID, hash160 of the public key, of a public key whose BIP 32 derivation path is missing
      pubkeys?: string[];
      // Public key ID, hash160 of the public key, of a public key whose signature is missing
      signatures?: string[];
      // Hash160 of the redeemScript that is missing
      redeemscript?: string;
      // SHA256 of the witnessScript that is missing
      witnessscript?: string;
    }
    // Role of the next person that this input needs to go to
    next?: string;
  }>;
  // Estimated vsize of the final signed transaction
  estimated_vsize?: number;
  // Estimated feerate of the final signed transaction in BTC/kvB. Shown only if all UTXO slots in the PSBT have been filled
  estimated_feerate?: number;
  // The transaction fee paid. Shown only if all UTXO slots in the PSBT have been filled
  fee?: number;
  // Role of the next person that this psbt needs to go to
  next?: string;
  // Error message (if there is one)
  error?: string;
}

export type CombinePsbt = string;

export type CombineRawTransaction = string;

export type ConvertToPsbt = string;

export type CreatePsbt = string;

export type CreateRawTransaction = string;

export interface DecodePsbt {
  // The decoded network-serialized unsigned transaction.
  tx: DecodeRawTransaction;
  global_xpubs: Array<{
    // The extended public key this path corresponds to
    xpub: string;
    // The fingerprint of the master key
    master_fingerprint: string;
    // The path
    path: string;
  }>;
  // The PSBT version number. Not to be confused with the unsigned transaction version
  psbt_version: number;
  // The global proprietary map
  proprietary: Array<{
    // The hex string for the proprietary identifier
    identifier: string;
    // The number for the subtype
    subtype: number;
    // The hex for the key
    key: string;
    // The hex for the value
    value: string;
  }>;
  // The unknown global fields
  unknown: Array<{
    // An unknown key-value pair
    [key: string]: string;
  }>;
  inputs: Array<{
    // Decoded network transaction for non-witness UTXOs
    non_witness_utxo?: DecodeRawTransaction;
    // Transaction output for witness UTXOs
    witness_utxo?: {
      // The value in BTC
      scriptPubKey: {
        // Disassembly of the public key script
        asm: string;
        // Inferred descriptor for the output
        desc: string;
        // The raw public key script bytes, hex-encoded
        hex: string;
        // The type, eg 'pubkeyhash'
        type: string;
        // The Bitcoin address (only if a well-defined address exists)
        address?: string;
      }
    };
    partial_signatures?: {
      // The public key and signature that corresponds to it.
      pubkey: string;
    }
    // The sighash type to be used
    sighash_type?: string;
    redeem_script?: {
      // Disassembly of the redeem script
      asm: string;
      // The raw redeem script bytes, hex-encoded
      hex: string;
      // The type, eg 'pubkeyhash'
      type: string;
    };
    witness_script?: {
      // Disassembly of the witness script
      asm: string;
      // The raw witness script bytes, hex-encoded
      hex: string;
      // The type, eg 'pubkeyhash'
      type: string;
    }
    bip32_derivs?: Array<{
      // The public key with the derivation path as the value.
      pubkey: string;
      // The fingerprint of the master key
      master_fingerprint: string;
      // The path
      path: string;
    }>;
    final_scriptSig?: {
      // Disassembly of the final signature script
      asm: string;
      // The raw final signature script bytes, hex-encoded
      hex: string;
    };
    final_scriptwitness?: string[];
    ripemd160_preimages?: {
      // The hash and preimage that corresponds to it.
      [key: string]: string;
    };
    sha256_preimages?: {
      // The hash and preimage that corresponds to it.
      [key: string]: string;
    };
    hash160_preimages?: {
      // The hash and preimage that corresponds to it.
      [key: string]: string;
    };
    hash256_preimages?: {
      // The hash and preimage that corresponds to it.
      [key: string]: string;
    }
    // hex-encoded signature for the Taproot key path spend
    taproot_key_path_sig?: string;
    taproot_script_path_sigs?: Array<{
      // The signature for the pubkey and leaf hash combination
      pubkey: string;
      // The leaf hash for this signature
      leaf_hash: string;
      // The signature itself
      sig: string;
    }>;
    taproot_scripts: Array<{
      // A leaf script
      script: string;
      // The version number for the leaf script
      leaf_ver: number;
      // The control blocks for this script
      control_blocks: string[];
    }>;
    taproot_bip32_derivs: Array<{
      // The x-only public key this path corresponds to
      pubkey: string;
      // The fingerprint of the master key
      master_fingerprint: string;
      // The path
      path: string;
      // The hashes of the leaves this pubkey appears in
      leaf_hashes: string[];
    }>;
    // The hex-encoded Taproot x-only internal key
    taproot_internal_key?: string;
    // The hex-encoded Taproot merkle root
    taproot_merkle_root?: string;
    // The unknown input fields
    unknown: {
      [key: string]: string;
    };
    // The input proprietary map
    proprietary: Array<{
      // The hex string for the proprietary identifier
      identifier: string;
      // The number for the subtype
      subtype: number;
      // The hex for the key
      key: string;
      // The hex for the value
      value: string;
    }>;
  }>;
  outputs: Array<{
    redeem_script?: {
      // Disassembly of the redeem script
      asm: string;
      // The raw redeem script bytes, hex-encoded
      hex: string;
      // The type, eg 'pubkeyhash'
      type: string;
    };
    witness_script?: {
      // Disassembly of the witness script
      asm: string;
      // The raw witness script bytes, hex-encoded
      hex: string;
      // The type, eg 'pubkeyhash'
      type: string;
    }
    bip32_derivs?: Array<{
      // The public key with the derivation path as the value.
      pubkey: string;
      // The fingerprint of the master key
      master_fingerprint: string;
      // The path
      path: string;
    }>;
    // The hex-encoded Taproot x-only internal key
    taproot_internal_key?: string;
    // The tuples that make up the Taproot tree, in depth first search order
    taproot_tree?: Array<{
      // The depth of this element in the tree
      depth: number;
      // The version of this leaf
      leaf_ver: number;
      // The hex-encoded script itself
      script: string;
    }>;
    taproot_bip32_derivs?: Array<{
      // The x-only public key this path corresponds to
      pubkey: string;
      // The fingerprint of the master key
      master_fingerprint: string;
      // The path
      path: string;
      // The hashes of the leaves this pubkey appears in
      leaf_hashes: string[];
    }>;
    // The unknown output fields
    unknown: {
      [key: string]: string;
    };
    // The output proprietary map
    proprietary: Array<{
      // The hex string for the proprietary identifier
      identifier: string;
      // The number for the subtype
      subtype: number;
      // The hex for the key
      key: string;
      // The hex for the value
      value: string;
    }>;
  }>;
  // The transaction fee paid if all UTXOs slots in the PSBT have been filled.
  fee?: number;
}

export interface DecodeRawTransaction {
  // The transaction id
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
  vin: Vin[];
  vout: Vout[]; 
}

export interface DecodeScript {
  // Script public key
  asm: string;
  // Inferred descriptor for the script
  desc: string;
  // The output type (e.g. nonstandard, pubkey, pubkeyhash, scripthash, multisig, nulldata, witness_v0_scripthash, witness_v0_keyhash, witness_v1_taproot, witness_unknown)
  type: string;
  // The Bitcoin address (only if a well-defined address exists)
  address?: string;
  // address of P2SH script wrapping this redeem script (not returned for types that should not be wrapped)
  p2sh?: string;
  // Result of a witness script public key wrapping this redeem script (not returned for types that should not be wrapped)
  segwit?: {
    // String representation of the script public key
    asm: string;
    // Hex string of the script public key
    hex: string;
    // The type of the script public key (e.g. witness_v0_keyhash or witness_v0_scripthash)
    type: string;
    // The Bitcoin address (only if a well-defined address exists)
    address?: string;
    // Inferred descriptor for the script
    desc: string;
    // address of the P2SH script wrapping this witness redeem script
    'p2sh-segwit': string;
  }
}

export interface FinalizePsbt {
  // The base64-encoded partially signed transaction if not extracted
  psbt?: string;
  // The hex-encoded network transaction if extracted
  hex?: string;
  // If the transaction has a complete set of signatures
  complete: boolean;
}

export interface FundrawtransactionInputOptions {
  // For a transaction with existing inputs, automatically include more if they are not enough.
  add_inputs?: boolean;
  // Include inputs that are not safe to spend (unconfirmed transactions from outside keys and unconfirmed replacement transactions).
  // Warning: the resulting transaction may become invalid if one of the unsafe inputs disappears.
  // If that happens, you will need to fund the transaction with different inputs and republish it.
  include_unsafe?: boolean;
  // The bitcoin address to receive the change
  changeAddress?: string;
  // The index of the change output
  changePosition?: number;
  // The output type to use. Only valid if changeAddress is not specified. Options are "legacy", "p2sh-segwit", "bech32", and "bech32m".
  change_type?: 'legacy' | 'p2sh-segwit' | 'bech32' | 'bech32m';
  // Also select inputs which are watch only.
  // Only solvable inputs can be used. Watch-only destinations are solvable if the public key and/or output script was imported,
  // e.g. with 'importpubkey' or 'importmulti' with the 'pubkeys' or 'desc' field.
  includeWatching?: boolean;
  // Lock selected unspent outputs
  lockUnspents?: boolean;
  // Specify a fee rate in sat/vB.
  fee_rate?: number | string;
  // Specify a fee rate in BTC/kvB.
  feeRate?: number | string;
  // The integers.
  // The fee will be equally deducted from the amount of each specified output.
  // Those recipients will receive less bitcoins than you enter in their corresponding amount field.
  // If no outputs are specified here, the sender pays the fee.
  subtractFeeFromOutputs?: number[];
  // Inputs and their corresponding weights
  inputWeights?: {
    // The transaction id
    txid: string;
    // The output index
    vout: number;
    // The maximum weight of the input
    weight: number;
  };
  // Confirmation target in blocks
  conf_target?: number;
  // The fee estimate mode, must be one of (case insensitive):
  // "unset"
  // "economical"
  // "conservative"
  estimate_mode?: 'unset' | 'economical' | 'conservative';
  // Marks this transaction as BIP125-replaceable.
  // Allows this transaction to be replaced by a transaction with higher fees
  replaceable?: boolean;
  // Keys and scripts needed for producing a final transaction with a dummy signature.
  // Used for fee estimation during coin selection.
  solving_data: {
    // Public keys involved in this transaction.
    pubkeys: string[];
    // Scripts involved in this transaction.
    scripts: string[];
    // Descriptors that provide solving data for this transaction.
    descriptors: string[];
  }
}

export interface FundRawTransaction {
  // The resulting raw transaction (hex-encoded string)
  hex: string;
  // Fee in BTC the resulting transaction pays
  fee: number;
  // The position of the added change output, or -1
  changepos: number;
}

export type JoinPsbts = string;

export type SendRawTransaction = string;

export interface SignRawTransactionWithKey { 
  // The hex-encoded raw transaction with signature(s)
  hex: string;
  // If the transaction has a complete set of signatures
  complete: boolean;
  // Script verification errors (if there are any)
  errors?: Array<{
    // The hash of the referenced, previous transaction
    txid: string;
    // The index of the output to spent and used as input
    vout: number;
    witness: string[];
    // The hex-encoded signature script
    scriptSig: string;
    // Script sequence number
    sequence: number;
    // Verification or signing error related to the input
    error: string;
  }>
}

export type TestMempoolAccept = Array<{
  // The transaction hash in hex
  txid: string;
  // The transaction witness hash in hex
  wtxid: string;
  // Package validation error, if any (only possible if rawtxs had more than 1 transaction).
  package_error?: string;
  // Whether this tx would be accepted to the mempool and pass client-specified maxfeerate. If not present, the tx was not fully validated due to a failure in another tx in the list.
  allowed?: boolean;
  // Virtual transaction size as defined in BIP 141. This is different from actual serialized size for witness transactions as witness data is discounted (only present when 'allowed' is true)
  vsize?: number;
  // Transaction fees (only present if 'allowed' is true)
  fees?: {
    // transaction fee in BTC
    base: number;
  }
  // Rejection string (only present when 'allowed' is false)
  'reject-reason'?: string;
}>;

export type UtxoUpdatePsbt = string;