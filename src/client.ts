import { randomUUID } from 'crypto';
import { 
  getbestblockhash, 
  getblock,
  getblockchaininfo,
  getblockcount,
  getblockfilter,
  getblockfrompeer,
  getblockhash,
  getblockheader,
  getblockstats,
  getchaintips,
  getchaintxstats,
  getdeploymentinfo,
  getdifficulty,
  getmempoolancestors,
  getmempooldescendants,
  getmempoolentry,
  getmempoolinfo,
  getrawmempool,
  gettxout,
  gettxoutproof,
  gettxoutsetinfo,
  gettxspendingprevout,
  preciousblock,
  pruneblockchain,
  savemempool,
  scantxoutset,
  verifychain,
  verifytxoutproof
} from './rpc/blockchain.js';
import { getmemoryinfo, getrpcinfo, help, logging, loggingcategory, stop, uptime } from './rpc/control.js';

interface RPCResponse<T> {
  result: T;
  error: any;
  id: string;
}

export default class Sats {
  username: string;
  password: string;
  host: string;
  port: number;

  constructor(
    { username = process.env.RPC_USERNAME, password = process.env.RPC_PASSWORD, host = process.env.RPC_HOST, port = 8332 }: 
    { username?: string, password?: string, host?: string, port?: number } = {}
  ) {
    if (!username) throw new Error('username is required');
    if (!password) throw new Error('password is required');

    this.username = username;
    this.password = password;
    this.host = host ?? '127.0.0.1';
    this.port = port;
  }

  async request<T>(method: string, params: any[] = []): Promise<RPCResponse<T>> {
    const request = await fetch(`http://${this.host}:${this.port}`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`${this.username}:${this.password}`)}`,
      },
      body: JSON.stringify({
        jsonrpc: '1.0',
        id: randomUUID(),
        method,
        params: params.filter((param) => param !== undefined)
      })
    })

    return await request.json() as RPCResponse<T>;
  }

  // Blockchain RPC

  /*
  getbestblockhash

  Returns the hash of the best (tip) block in the most-work fully-validated chain.
  */
  public async getbestblockhash(): Promise<RPCResponse<getbestblockhash>> {
    return await this.request<getbestblockhash>('getbestblockhash');
  }

  /*
  getblock "blockhash" ( verbosity )

  If verbosity is 0, returns a string that is serialized, hex-encoded data for block 'hash'.
  If verbosity is 1, returns an Object with information about block <hash>.
  If verbosity is 2, returns an Object with information about block <hash> and information about each transaction.
  If verbosity is 3, returns an Object with information about block <hash> and information about each transaction, including prevout information for inputs (only for unpruned blocks in the current best chain).

  Arguments:
  1. blockhash    (string, required) The block hash
  2. verbosity    (numeric, optional, default=1) 0 for hex-encoded data, 1 for a JSON object, 2 for JSON object with transaction data, and 3 for JSON object with transaction data including prevout information for inputs
  */
  public async getblock(blockhash: string, verbosity?: 0 | 1 | 2 | 3): Promise<RPCResponse<getblock>> {
    return await this.request<getblock>('getblock', [blockhash, verbosity]);
  }

  /*
  getblockchaininfo

  Returns an object containing various state info regarding blockchain processing.
  */
  public async getblockchaininfo(): Promise<RPCResponse<getblockchaininfo>> {
    return await this.request('getblockchaininfo');
  }

  /*
  getblockcount

  Returns the height of the most-work fully-validated chain.
  The genesis block has height 0.
  */
  public async getblockcount(): Promise<RPCResponse<getblockcount>> {
    return await this.request('getblockcount');
  }

  /*
  getblockfilter "blockhash" ( "filtertype" )

  Retrieve a BIP 157 content filter for a particular block.

  Arguments:
  1. blockhash     (string, required) The hash of the block
  2. filtertype    (string, optional, default="basic") The type name of the filter
  */
  public async getblockfilter(blockhash: string, filtertype: string = 'basic'): Promise<RPCResponse<getblockfilter>> {
    return await this.request('getblockfilter', [blockhash, filtertype]);
  }

  /*
  getblockfrompeer "blockhash" peer_id

  Attempt to fetch block from a given peer.

  We must have the header for this block, e.g. using submitheader.
  Subsequent calls for the same block and a new peer will cause the response from the previous peer to be ignored.

  Returns an empty JSON object if the request was successfully scheduled.
  */
  public async getblockfrompeer(blockhash: string, peer_id: string): Promise<RPCResponse<getblockfrompeer>> {
    return await this.request('getblockfrompeer', [blockhash, peer_id]);
  }

  /*
  getblockhash height

  Returns hash of block in best-block-chain at height provided.

  Arguments:
  1. height    (numeric, required) The height index
  */
  public async getblockhash(height: number): Promise<RPCResponse<getblockhash>> {
    return await this.request('getblockhash', [height]);
  }

  /*
  getblockheader "blockhash" ( verbose )

  If verbose is false, returns a string that is serialized, hex-encoded data for blockheader 'hash'.
  If verbose is true, returns an Object with information about blockheader <hash>.

  Arguments:
  1. blockhash    (string, required) The block hash
  2. verbose      (boolean, optional, default=true) true for a json object, false for the hex-encoded data
  */
  public async getblockheader(blockhash: string, verbose: boolean = true): Promise<RPCResponse<getblockheader>> {
    return await this.request<getblockheader>('getblockheader', [blockhash, verbose]);
  }

  /*
  getblockstats hash_or_height ( stats )

  Compute per block statistics for a given window. All amounts are in satoshis.
  It won't work for some heights with pruning.

  Arguments:
  1. hash_or_height    (string or numeric, required) The block hash or height of the target block
  2. stats             (json array, optional, default=all values) Values to plot (see result below)
      [
        "height",     (string) Selected statistic
        "time",       (string) Selected statistic
        ...
      ]
  */
  public async getblockstats(hash_or_height: string | number, stats?: (keyof getblockstats)[]): Promise<RPCResponse<getblockstats>> {
    // @todo can the response know about keys to expect from stats option?
    return await this.request<getblockstats>('getblockstats', [hash_or_height, stats]);
  }

  /*
  getchaintips

  Return information about all known tips in the block tree, including the main chain as well as orphaned branches.
  */
  public async getchaintips(): Promise<RPCResponse<getchaintips>> {
    return await this.request<getchaintips>('getchaintips');
  }

  /*
  getchaintxstats ( nblocks "blockhash" )

  Compute statistics about the total number and rate of transactions in the chain.

  Arguments:
  1. nblocks      (numeric, optional, default=one month) Size of the window in number of blocks
  2. blockhash    (string, optional, default=chain tip) The hash of the block that ends the window.
  */
  public async getchaintxstats(nblocks?: number, blockhash?: string): Promise<RPCResponse<getchaintxstats>> {
    return await this.request<getchaintxstats>('getchaintxstats', [nblocks, blockhash]);
  }

  /*
  getdeploymentinfo ( "blockhash" )

  Returns an object containing various state info regarding deployments of consensus changes.

  Arguments:
  1. blockhash    (string, optional, default="hash of current chain tip") The block hash at which to query deployment state
  */
  public async getdeploymentinfo(blockhash?: string): Promise<RPCResponse<getdeploymentinfo>> {
    return await this.request<getdeploymentinfo>('getdeploymentinfo', [blockhash]);
  }

  /*
  getdifficulty

  Returns the proof-of-work difficulty as a multiple of the minimum difficulty.
  */
  public async getdifficulty(): Promise<RPCResponse<getdifficulty>> {
    return await this.request<getdifficulty>('getdifficulty');
  }

  /*
  getmempoolancestors "txid" ( verbose )

  If txid is in the mempool, returns all in-mempool ancestors.

  Arguments:
  1. txid       (string, required) The transaction id (must be in mempool)
  2. verbose    (boolean, optional, default=false) True for a json object, false for array of transaction ids
  */
  // @todo can we type the response based on verbosity?
  public async getmempoolancestors(txid: string, verbose?: boolean): Promise<RPCResponse<getmempoolancestors>> {
    return await this.request<getmempoolancestors>('getmempoolancestors', [txid, verbose]);
  }

  /*
  getmempooldescendants "txid" ( verbose )

  If txid is in the mempool, returns all in-mempool descendants.

  Arguments:
  1. txid       (string, required) The transaction id (must be in mempool)
  2. verbose    (boolean, optional, default=false) True for a json object, false for array of transaction ids
  */
  // @todo can we type the response based on verbosity?
  public async getmempooldescendants(txid: string, verbose?: boolean): Promise<RPCResponse<getmempooldescendants>> {
    return await this.request<getmempooldescendants>('getmempooldescendants', [txid, verbose]);
  }

  /*
  getmempoolentry "txid"

  Returns mempool data for given transaction

  Arguments:
  1. txid    (string, required) The transaction id (must be in mempool)
  */
  public async getmempoolentry(txid: string): Promise<RPCResponse<getmempoolentry>> {
    return await this.request<getmempoolentry>('getmempoolentry', [txid]);
  }

  /*
  getmempoolinfo

  Returns details on the active state of the TX memory pool.
  */
  public async getmempoolinfo(): Promise<RPCResponse<getmempoolinfo>> {
    return await this.request<getmempoolinfo>('getmempoolinfo');
  }

  /*
  getrawmempool ( verbose mempool_sequence )

  Returns all transaction ids in memory pool as a json array of string transaction ids.

  Hint: use getmempoolentry to fetch a specific transaction from the mempool.

  Arguments:
  1. verbose             (boolean, optional, default=false) True for a json object, false for array of transaction ids
  2. mempool_sequence    (boolean, optional, default=false) If verbose=false, returns a json object with transaction list and mempool sequence number attached.
  */
  public async getrawmempool(verbose?: boolean, mempool_sequence?: boolean): Promise<RPCResponse<getrawmempool>> {
    return await this.request<getrawmempool>('getrawmempool', [verbose, mempool_sequence]);
  }

  /*
  gettxout "txid" n ( include_mempool )

  Returns details about an unspent transaction output.

  Arguments:
  1. txid               (string, required) The transaction id
  2. n                  (numeric, required) vout number
  3. include_mempool    (boolean, optional, default=true) Whether to include the mempool. Note that an unspent output that is spent in the mempool won't appear.
  */
  public async gettxout(txid: string, n: number, include_mempool?: boolean): Promise<RPCResponse<gettxout>> {
    return await this.request<gettxout>('gettxout', [txid, n, include_mempool]);
  }

  /*
  gettxoutproof ["txid",...] ( "blockhash" )

  Returns a hex-encoded proof that "txid" was included in a block.

  NOTE: By default this function only works sometimes. This is when there is an
  unspent output in the utxo for this transaction. To make it always work,
  you need to maintain a transaction index, using the -txindex command line option or
  specify the block in which the transaction is included manually (by blockhash).

  Arguments:
  1. txids          (json array, required) The txids to filter
      [
        "txid",    (string) A transaction hash
        ...
      ]
  2. blockhash      (string, optional) If specified, looks for txid in the block with this hash
  */
  public async gettxoutproof(txids: string[], blockhash?: string): Promise<RPCResponse<gettxoutproof>> {
    return await this.request<gettxoutproof>('gettxoutproof', [txids, blockhash]);
  }

  /*
  gettxoutsetinfo ( "hash_type" hash_or_height use_index )

  Returns statistics about the unspent transaction output set.
  Note this call may take some time if you are not using coinstatsindex.

  Arguments:
  1. hash_type         (string, optional, default="hash_serialized_2") Which UTXO set hash should be calculated. Options: 'hash_serialized_2' (the legacy algorithm), 'muhash', 'none'.
  2. hash_or_height    (string or numeric, optional, default=the current best block) The block hash or height of the target height (only available with coinstatsindex).
  3. use_index         (boolean, optional, default=true) Use coinstatsindex, if available.
  */
  public async gettxoutsetinfo(hash_type?: 'hash_serialized_2' | 'muhash' | 'none', hash_or_height?: string | number, use_index?: boolean): Promise<RPCResponse<gettxoutsetinfo>> {
    return await this.request<gettxoutsetinfo>('gettxoutsetinfo', [hash_type, hash_or_height, use_index]);
  }

  /*
  gettxspendingprevout [{"txid":"hex","vout":n},...]

  Scans the mempool to find transactions spending any of the given outputs

  Arguments:
  1. outputs                 (json array, required) The transaction outputs that we want to check, and within each, the txid (string) vout (numeric).
      [
        {                   (json object)
          "txid": "hex",    (string, required) The transaction id
          "vout": n,        (numeric, required) The output number
        },
        ...
      ]
  */
  public async gettxspendingprevout(outputs: { txid: string, vout: number }[]): Promise<RPCResponse<gettxspendingprevout>> {
    return await this.request<gettxspendingprevout>('gettxspendingprevout', [outputs]);
  }

  /*
  preciousblock "blockhash"

  Treats a block as if it were received before others with the same work.

  A later preciousblock call can override the effect of an earlier one.

  The effects of preciousblock are not retained across restarts.

  Arguments:
  1. blockhash    (string, required) the hash of the block to mark as precious
  */
  public async preciousblock(blockhash: string): Promise<RPCResponse<preciousblock>> {
    return await this.request<preciousblock>('preciousblock', [blockhash]);
  }

  /*
  pruneblockchain height

  Arguments:
  1. height    (numeric, required) The block height to prune up to. May be set to a discrete height, or to a UNIX epoch time
              to prune blocks whose block time is at least 2 hours older than the provided timestamp.
  */
  public async pruneblockchain(height: number): Promise<RPCResponse<pruneblockchain>> {
    return await this.request<pruneblockchain>('pruneblockchain', [height]);
  }

  /* 
  savemempool

  Dumps the mempool to disk. It will fail until the previous dump is fully loaded.
  */
  public async savemempool(): Promise<RPCResponse<savemempool>> {
    return await this.request<savemempool>('savemempool');
  }

  /*
  scantxoutset "action" ( [scanobjects,...] )

  Scans the unspent transaction output set for entries that match certain output descriptors.
  Examples of output descriptors are:
      addr(<address>)                      Outputs whose scriptPubKey corresponds to the specified address (does not include P2PK)
      raw(<hex script>)                    Outputs whose scriptPubKey equals the specified hex scripts
      combo(<pubkey>)                      P2PK, P2PKH, P2WPKH, and P2SH-P2WPKH outputs for the given pubkey
      pkh(<pubkey>)                        P2PKH outputs for the given pubkey
      sh(multi(<n>,<pubkey>,<pubkey>,...)) P2SH-multisig outputs for the given threshold and pubkeys

  In the above, <pubkey> either refers to a fixed public key in hexadecimal notation, or to an xpub/xprv optionally followed by one
  or more path elements separated by "/", and optionally ending in "/*" (unhardened), or "/*'" or "/*h" (hardened) to specify all
  unhardened or hardened child keys.
  In the latter case, a range needs to be specified by below if different from 1000.
  For more information on output descriptors, see the documentation in the doc/descriptors.md file.

  Arguments:
  1. action                        (string, required) The action to execute
                                  "start" for starting a scan
                                  "abort" for aborting the current scan (returns true when abort was successful)
                                  "status" for progress report (in %) of the current scan
  2. scanobjects                   (json array) Array of scan objects. Required for "start" action
                                  Every scan object is either a string descriptor or an object:
      [
        "descriptor",             (string) An output descriptor
        {                         (json object) An object with output descriptor and metadata
          "desc": "str",          (string, required) An output descriptor
          "range": n or [n,n],    (numeric or array, optional, default=1000) The range of HD chain indexes to explore (either end or [begin,end])
        },
        ...
      ]
  */
  public async scantxoutset(action: 'start' | 'abort' | 'status', scanobjects: { descriptor: { desc: string, range: number | [number, number] }}[]): Promise<RPCResponse<scantxoutset>> {
    return await this.request<scantxoutset>('scantxoutset', [action, scanobjects]);
  }

  /*
  verifychain ( checklevel nblocks )

  Verifies blockchain database.

  Arguments:
  1. checklevel    (numeric, optional, default=3, range=0-4) How thorough the block verification is:
                  - level 0 reads the blocks from disk
                  - level 1 verifies block validity
                  - level 2 verifies undo data
                  - level 3 checks disconnection of tip blocks
                  - level 4 tries to reconnect the blocks
                  - each level includes the checks of the previous levels
  2. nblocks       (numeric, optional, default=6, 0=all) The number of blocks to check.
  */
  public async verifychain(checklevel?: 0 | 1 | 2 | 3 | 4, nblocks?: number): Promise<RPCResponse<verifychain>> {
    return await this.request<verifychain>('verifychain', [checklevel, nblocks]);
  }

  /*
  verifytxoutproof "proof"

  Verifies that a proof points to a transaction in a block, returning the transaction it commits to
  and throwing an RPC error if the block is not in our best chain

  Arguments:
  1. proof    (string, required) The hex-encoded proof generated by gettxoutproof
  */
  public async verifytxoutproof(proof: string): Promise<RPCResponse<verifytxoutproof>> {
    return await this.request<verifytxoutproof>('verifytxoutproof', [proof]);
  }

  // Control RPC

  /*
  getmemoryinfo ( "mode" )

  Returns an object containing information about memory usage.

  Arguments:
  1. mode    (string, optional, default="stats") determines what kind of information is returned.
             - "stats" returns general statistics about memory usage in the daemon.
             - "mallocinfo" returns an XML string describing low-level heap state (only available if compiled with glibc 2.10+).
  */
  public async getmemoryinfo(mode?: 'stats' | 'mallocinfo'): Promise<RPCResponse<getmemoryinfo>> {
    return await this.request<getmemoryinfo>('getmemoryinfo', [mode]);
  }

  /* 
  getrpcinfo

  Returns details of the RPC server.
  */
  public async getrpcinfo(): Promise<RPCResponse<getrpcinfo>> {
    return await this.request<getrpcinfo>('getrpcinfo');
  }

  /*
  help ( "command" )

  List all commands, or get help for a specified command.

  Arguments:
  1. command    (string, optional, default=all commands) The command to get help on
  */
  public async help(command?: string): Promise<RPCResponse<help>> {
    return await this.request<help>('help', [command]);
  }

  /*
  logging ( ["include_category",...] ["exclude_category",...] )

  Gets and sets the logging configuration.
  When called without an argument, returns the list of categories with status that are currently being debug logged or not.
  When called with arguments, adds or removes categories from debug logging and return the lists above.
  The arguments are evaluated in order "include", "exclude".
  If an item is both included and excluded, it will thus end up being excluded.
  The valid logging categories are: addrman, bench, blockstorage, cmpctblock, coindb, estimatefee, http, i2p, ipc, leveldb, libevent, mempool, mempoolrej, net, proxy, prune, qt, rand, reindex, rpc, selectcoins, tor, util, validation, walletdb, zmq
  In addition, the following are available as category names with special meanings:
    - "all",  "1" : represent all logging categories.
    - "none", "0" : even if other logging categories are specified, ignore all of them.

  Arguments:
  1. include                    (json array, optional) The categories to add to debug logging
      [
        "include_category",    (string) the valid logging category
        ...
      ]
  2. exclude                    (json array, optional) The categories to remove from debug logging
      [
        "exclude_category",    (string) the valid logging category
        ...
      ]
  */
  public async logging(include?: loggingcategory[], exclude?: loggingcategory[]): Promise<RPCResponse<logging>> {
    return await this.request<logging>('logging', [include, exclude]);
  }

  /*
  stop

  Request a graceful shutdown of Bitcoin Core.
  */
  public async stop(): Promise<RPCResponse<stop>> {
    return await this.request<stop>('stop');
  }

  /*
  uptime

  Returns the total uptime of the server.
  */
  public async uptime(): Promise<RPCResponse<uptime>> {
    return await this.request<uptime>('uptime');
  }

  // Mining RPC
}

