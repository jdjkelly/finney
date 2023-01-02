import { randomUUID } from 'crypto';
import { Result } from './result.js';
import {
  getbestblockhash,
  getblock,
  getblockchaininfo,
  getblockcount,
  getblockfilter,
  getblockfrompeer,
  getblockhash,
  getblockheader,
  getblockInputVerbosity,
  getblockstats,
  getblockVerbosity0,
  getblockVerbosity1,
  getblockVerbosity2,
  getblockVerbosity3,
  getchaintips,
  getchaintxstats,
  getdeploymentinfo,
  getdifficulty,
  getmempoolancestors,
  getmempoolancestorsSimple,
  getmempoolancestorsVerbose,
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
import {
  getmemoryinfo,
  getrpcinfo,
  help,
  logging,
  loggingcategory,
  stop,
  uptime
} from './rpc/control.js';
import { getblocktemplate, getblocktemplate_template_request, getmininginfo, getnetworkhashps, prioritisetransaction, submitblock, submitheader } from './rpc/mining.js';
import { addnode, clearbanned, disconnectnode, getaddednodeinfo, getconnectioncount, getnettotals, getnetworkinfo, getnodeaddresses, getpeerinfo, listbanned, ping, setban, setnetworkactive } from './rpc/network.js';
import { analyzepsbt, combinepsbt, combinerawtransaction, converttopsbt, createpsbt, createrawtransaction, decodepsbt, decoderawtransaction, decodescript, finalizepsbt, fundrawtransaction, fundrawtransactionInputOptions, getrawtransaction, joinpsbts, sendrawtransaction, signrawtransactionwithkey, testmempoolaccept, utxoupdatepsbt } from './rpc/rawtransactions.js';
import { enumeratesigners } from './rpc/signer.js';
import { createmultisig, deriveaddresses, estimatesmartfee, getdescriptorinfo, getindexinfo, signmessagewithprivkey, validateaddress, verifymessage } from './rpc/util.js';
import { abandontransaction, abortrescan, addmultisigaddress, backupwallet, bumpfee, createwallet, dumpprivkey, encryptwallet, getaddressesbylabel, getaddressinfo, getbalance, getbalances, getnewaddress, getrawchangeaddress, getreceivedbyaddress, getreceivedbylabel, gettransaction, getunconfirmedbalance, getwalletinfo, importaddress, importdescriptors, importmulti, importprivkey, importprunedfunds, importpubkey, importwallet, keypoolrefill, listaddressgroupings, listdescriptors, listlabels, listlockunspent, listreceivedbyaddress, listreceivedbylabel, listsinceblock, listtransactions, listunspent, listwalletdir, listwallets, loadwallet, lockunspent, migratewallet, newkeypool, psbtbumpfee, removeprunedfunds, rescanblockchain, restorewallet, send, sendall, sendallOptionsInput, sendmany, sendOptionsInput, sendtoaddress, sethdseed, setlabel, settxfee, setwalletflag, signmessage, signrawtransactionwithwallet, simulaterawtransaction, unloadwallet, upgradewallet, walletcreatefundedpsbt, walletcreatefundedpsbtOptionsInput, walletdisplayaddress, walletlock, walletpassphrase, walletpassphrasechange, walletprocesspsbt } from './rpc/wallet.js';
import { getzmqnotifications } from './rpc/zmq.js';

type RPCResponse<T> = RPCResponseOk<T> | RPCResponseError;

interface RPCResponseOk<T> {
  result: T;
  error: null;
  id: string;
}

interface RPCResponseError {
  result: null;
  error: {
    code: number;
    message: string;
  };
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
  public async getblock(blockhash: string, verbosity?: getblockInputVerbosity): Promise<RPCResponse<getblock>> {
    switch (verbosity) {
      case getblockInputVerbosity.ZERO:
        return await this.request<getblockVerbosity0>('getblock', [blockhash, verbosity]);
      case getblockInputVerbosity.ONE: 
        return await this.request<getblockVerbosity1>('getblock', [blockhash, verbosity]);
      case getblockInputVerbosity.TWO: 
        return await this.request<getblockVerbosity2>('getblock', [blockhash, verbosity]);
      case getblockInputVerbosity.THREE:
        return await this.request<getblockVerbosity3>('getblock', [blockhash, verbosity]);
      case undefined:
        return await this.request<getblockVerbosity1>('getblock', [blockhash, verbosity]);
    }
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
  public async getmempoolancestors(txid: string, verbose?: boolean): Promise<RPCResponse<getmempoolancestors>> {
    if (verbose) {
      return await this.request<getmempoolancestorsVerbose>('getmempoolancestors', [txid, verbose]);
    } else {
      return await this.request<getmempoolancestorsSimple>('getmempoolancestors', [txid, verbose]);
    }
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
  public async gettxspendingprevout(outputs: Array<{ txid: string, vout: number }>): Promise<RPCResponse<gettxspendingprevout>> {
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
  public async scantxoutset(action: 'start' | 'abort' | 'status', scanobjects: Array<{ descriptor: { desc: string, range: number | [number, number] } }>): Promise<RPCResponse<scantxoutset>> {
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

  /*
  getblocktemplate ( "template_request" )

  If the request parameters include a 'mode' key, that is used to explicitly select between the default 'template' request or a 'proposal'.
  It returns data needed to construct a block to work on.
  For full specification, see BIPs 22, 23, 9, and 145:
      https://github.com/bitcoin/bips/blob/master/bip-0022.mediawiki
      https://github.com/bitcoin/bips/blob/master/bip-0023.mediawiki
      https://github.com/bitcoin/bips/blob/master/bip-0009.mediawiki#getblocktemplate_changes
      https://github.com/bitcoin/bips/blob/master/bip-0145.mediawiki

  Arguments:
  1. template_request         (json object, optional, default={}) Format of the template
      {
        "mode": "str",       (string, optional) This must be set to "template", "proposal" (see BIP 23), or omitted
        "capabilities": [    (json array, optional) A list of strings
          "str",             (string) client side supported feature, 'longpoll', 'coinbasevalue', 'proposal', 'serverlist', 'workid'
          ...
        ],
        "rules": [           (json array, required) A list of strings
          "segwit",          (string, required) (literal) indicates client side segwit support
          "str",             (string) other client side supported softfork deployment
          ...
        ],
      }
  */
  public async getblocktemplate(template_request?: getblocktemplate_template_request): Promise<RPCResponse<getblocktemplate>> {
    return await this.request<getblocktemplate>('getblocktemplate', [template_request]);
  }

  /*
  getmininginfo

  Returns a json object containing mining-related information.
  */
  public async getmininginfo(): Promise<RPCResponse<getmininginfo>> {
    return await this.request<getmininginfo>('getmininginfo');
  }

  /*
  getnetworkhashps ( nblocks height )

  Returns the estimated network hashes per second based on the last n blocks.
  Pass in [blocks] to override # of blocks, -1 specifies since last difficulty change.
  Pass in [height] to estimate the network speed at the time when a certain block was found.

  Arguments:
  1. nblocks    (numeric, optional, default=120) The number of blocks, or -1 for blocks since last difficulty change.
  2. height     (numeric, optional, default=-1) To estimate at the time of the given height.
  */
  public async getnetworkhashps(nblocks?: number, height?: number): Promise<RPCResponse<getnetworkhashps>> {
    return await this.request<getnetworkhashps>('getnetworkhashps', [nblocks, height]);
  }

  /*
  prioritisetransaction "txid" ( dummy ) fee_delta

  Accepts the transaction into mined blocks at a higher (or lower) priority

  Arguments:
  1. txid         (string, required) The transaction id.
  2. dummy        (numeric, optional) API-Compatibility for previous API. Must be zero or null.
                  DEPRECATED. For forward compatibility use named arguments and omit this parameter.
  3. fee_delta    (numeric, required) The fee value (in satoshis) to add (or subtract, if negative).
                  Note, that this value is not a fee rate. It is a value to modify absolute fee of the TX.
                  The fee is not actually paid, only the algorithm for selecting transactions into a block
                  considers the transaction as it would have paid a higher (or lower) fee.
  */
  public async prioritisetransaction(txid: string, dummy: 0 | null = null, fee_delta: number): Promise<RPCResponse<prioritisetransaction>> {
    return await this.request<prioritisetransaction>('prioritisetransaction', [txid, dummy, fee_delta]);
  }

  /* 
  submitblock "hexdata" ( "dummy" )

  Attempts to submit new block to network.
  See https://en.bitcoin.it/wiki/BIP_0022 for full specification.

  Arguments:
  1. hexdata    (string, required) the hex-encoded block data to submit
  2. dummy      (string, optional, default=ignored) dummy value, for compatibility with BIP22. This value is ignored.
  */
  public async submitblock(hexdata: string, dummy?: string): Promise<RPCResponse<submitblock>> {
    return await this.request<submitblock>('submitblock', [hexdata, dummy]);
  }

  /*
  submitheader "hexdata"

  Decode the given hexdata as a header and submit it as a candidate chain tip if valid.
  Throws when the header is invalid.

  Arguments:
  1. hexdata    (string, required) the hex-encoded block header data
  */
  public async submitheader(hexdata: string): Promise<RPCResponse<submitheader>> {
    return await this.request<submitheader>('submitheader', [hexdata]);
  }

  // Network RPC

  /*
  addnode "node" "command"

  Attempts to add or remove a node from the addnode list.
  Or try a connection to a node once.
  Nodes added using addnode (or -connect) are protected from DoS disconnection and are not required to be
  full nodes/support SegWit as other outbound peers are (though such peers will not be synced from).
  Addnode connections are limited to 8 at a time and are counted separately from the -maxconnections limit.

  Arguments:
  1. node       (string, required) The node (see getpeerinfo for nodes)
  2. command    (string, required) 'add' to add a node to the list, 'remove' to remove a node from the list, 'onetry' to try a connection to the node once
  */
  public async addnode(node: string, command: 'add' | 'remove' | 'onetry'): Promise<RPCResponse<addnode>> {
    return await this.request<addnode>('addnode', [node, command]);
  }

  /*
  clearbanned

  Clear all banned IPs.
  */
  public async clearbanned(): Promise<RPCResponse<clearbanned>> {
    return await this.request<clearbanned>('clearbanned');
  }

  /*
  disconnectnode ( "address" nodeid )

  Immediately disconnects from the specified peer node.

  Strictly one out of 'address' and 'nodeid' can be provided to identify the node.

  To disconnect by nodeid, either set 'address' to the empty string, or call using the named 'nodeid' argument only.

  Arguments:
  1. address    (string, optional, default=fallback to nodeid) The IP address/port of the node
  2. nodeid     (numeric, optional, default=fallback to address) The node ID (see getpeerinfo for node IDs)
  */
  public async disconnectnode(address?: string, nodeid?: number): Promise<RPCResponse<disconnectnode>> {
    return await this.request<disconnectnode>('disconnectnode', [address, nodeid]);
  }

  /*
  getaddednodeinfo ( "node" )

  Returns information about the given added node, or all added nodes
  (note that onetry addnodes are not listed here)

  Arguments:
  1. node    (string, optional, default=all nodes) If provided, return information about this specific node, otherwise all nodes are returned.
  */
  public async getaddednodeinfo(node?: string): Promise<RPCResponse<getaddednodeinfo>> {
    return await this.request<getaddednodeinfo>('getaddednodeinfo', [node]);
  }

  /*
  getconnectioncount

  Returns the number of connections to other nodes.
  */
  public async getconnectioncount(): Promise<RPCResponse<getconnectioncount>> {
    return await this.request<getconnectioncount>('getconnectioncount');
  }

  /*
  getnettotals

  Returns information about network traffic, including bytes in, bytes out,
  and current time.
  */
  public async getnettotals(): Promise<RPCResponse<getnettotals>> {
    return await this.request<getnettotals>('getnettotals');
  }

  /*
  getnetworkinfo

  Returns an object containing various state info regarding P2P networking.
  */
  public async getnetworkinfo(): Promise<RPCResponse<getnetworkinfo>> {
    return await this.request<getnetworkinfo>('getnetworkinfo');
  }

  /*
  getnodeaddresses ( count "network" )

  Return known addresses, after filtering for quality and recency.
  These can potentially be used to find new peers in the network.
  The total number of addresses known to the node may be higher.

  Arguments:
  1. count      (numeric, optional, default=1) The maximum number of addresses to return. Specify 0 to return all known addresses.
  2. network    (string, optional, default=all networks) Return only addresses of the specified network. Can be one of: ipv4, ipv6, onion, i2p, cjdns.
  */
  public async getnodeaddresses(count?: number, network?: 'ipv4' | 'ipv6' | 'onion' | 'i2p' | 'cjdns'): Promise<RPCResponse<getnodeaddresses>> {
    return await this.request<getnodeaddresses>('getnodeaddresses', [count, network]);
  }

  /*
  getpeerinfo

  Returns data about each connected network peer as a json array of objects.
  */
  public async getpeerinfo(): Promise<RPCResponse<getpeerinfo>> {
    return await this.request<getpeerinfo>('getpeerinfo');
  }

  /*
  listbanned

  List all manually banned IPs/Subnets.
  */
  public async listbanned(): Promise<RPCResponse<listbanned>> {
    return await this.request<listbanned>('listbanned');
  }

  /*
  ping

  Requests that a ping be sent to all other nodes, to measure ping time.
  Results provided in getpeerinfo, pingtime and pingwait fields are decimal seconds.
  Ping command is handled in queue with all other commands, so it measures processing backlog, not just network ping.
  */
  public async ping(): Promise<RPCResponse<ping>> {
    return await this.request<ping>('ping');
  }

  /*
  setban "subnet" "command" ( bantime absolute )

  Attempts to add or remove an IP/Subnet from the banned list.

  Arguments:
  1. subnet      (string, required) The IP/Subnet (see getpeerinfo for nodes IP) with an optional netmask (default is /32 = single IP)
  2. command     (string, required) 'add' to add an IP/Subnet to the list, 'remove' to remove an IP/Subnet from the list
  3. bantime     (numeric, optional, default=0) time in seconds how long (or until when if [absolute] is set) the IP is banned (0 or empty means using the default time of 24h which can also be overwritten by the -bantime startup argument)
  4. absolute    (boolean, optional, default=false) If set, the bantime must be an absolute timestamp expressed in UNIX epoch time
  */
  public async setban(subnet: string, command: 'add' | 'remove', bantime?: number, absolute?: boolean): Promise<RPCResponse<setban>> {
    return await this.request<setban>('setban', [subnet, command, bantime, absolute]);
  }

  /*
  setnetworkactive state

  Disable/enable all p2p network activity.

  Arguments:
  1. state    (boolean, required) true to enable networking, false to disable
  */
  public async setnetworkactive(state: boolean): Promise<RPCResponse<setnetworkactive>> {
    return await this.request<setnetworkactive>('setnetworkactive', [state]);
  }

  // Raw Transactions RPC
  
  /* 
  analyzepsbt "psbt"

  Analyzes and provides information about the current status of a PSBT and its inputs

  Arguments:
  1. psbt    (string, required) A base64 string of a PSBT
  */
  public async analyzepsbt(psbt: string): Promise<RPCResponse<analyzepsbt>> {
    return await this.request<analyzepsbt>('analyzepsbt', [psbt]);
  }

  /*
  combinepsbt ["psbt",...]

  Combine multiple partially signed Bitcoin transactions into one transaction.
  Implements the Combiner role.

  Arguments:
  1. txs            (json array, required) The base64 strings of partially signed transactions
      [
        "psbt",    (string) A base64 string of a PSBT
        ...
      ]
  */
  public async combinepsbt(txs: string[]): Promise<RPCResponse<combinepsbt>> {
    return await this.request<combinepsbt>('combinepsbt', [txs]);
  }

  /*
  combinerawtransaction ["hexstring",...]

  Combine multiple partially signed transactions into one transaction.
  The combined transaction may be another partially signed transaction or a 
  fully signed transaction.

  Arguments:
  1. txs                 (json array, required) The hex strings of partially signed transactions
      [
        "hexstring",    (string) A hex-encoded raw transaction
        ...
      ]
  */
  public async combinerawtransaction(txs: string[]): Promise<RPCResponse<combinerawtransaction>> {
    return await this.request<combinerawtransaction>('combinerawtransaction', [txs]);
  }

  /*
  converttopsbt "hexstring" ( permitsigdata iswitness )

  Converts a network serialized transaction to a PSBT. This should be used only with createrawtransaction and fundrawtransaction
  createpsbt and walletcreatefundedpsbt should be used for new applications.

  Arguments:
  1. hexstring        (string, required) The hex string of a raw transaction
  2. permitsigdata    (boolean, optional, default=false) If true, any signatures in the input will be discarded and conversion
                      will continue. If false, RPC will fail if any signatures are present.
  3. iswitness        (boolean, optional, default=depends on heuristic tests) Whether the transaction hex is a serialized witness transaction.
                      If iswitness is not present, heuristic tests will be used in decoding.
                      If true, only witness deserialization will be tried.
                      If false, only non-witness deserialization will be tried.
                      This boolean should reflect whether the transaction has inputs
                      (e.g. fully valid, or on-chain transactions), if known by the caller.
  */
  public async converttopsbt(hexstring: string, permitsigdata?: boolean, iswitness?: boolean): Promise<RPCResponse<converttopsbt>> {
    return await this.request<converttopsbt>('converttopsbt', [hexstring, permitsigdata, iswitness]);
  }

  /*
  createpsbt [{"txid":"hex","vout":n,"sequence":n},...] [{"address":amount,...},{"data":"hex"},...] ( locktime replaceable )

  Creates a transaction in the Partially Signed Transaction format.
  Implements the Creator role.

  Arguments:
  1. inputs                      (json array, required) The inputs
      [
        {                       (json object)
          "txid": "hex",        (string, required) The transaction id
          "vout": n,            (numeric, required) The output number
          "sequence": n,        (numeric, optional, default=depends on the value of the 'replaceable' and 'locktime' arguments) The sequence number
        },
        ...
      ]
  2. outputs                     (json array, required) The outputs (key-value pairs), where none of the keys are duplicated.
                                That is, each address can only appear once and there can only be one 'data' object.
                                For compatibility reasons, a dictionary, which holds the key-value pairs directly, is also
                                accepted as second parameter.
      [
        {                       (json object)
          "address": amount,    (numeric or string, required) A key-value pair. The key (string) is the bitcoin address, the value (float or string) is the amount in BTC
          ...
        },
        {                       (json object)
          "data": "hex",        (string, required) A key-value pair. The key must be "data", the value is hex-encoded data
        },
        ...
      ]
  3. locktime                    (numeric, optional, default=0) Raw locktime. Non-0 value also locktime-activates inputs
  4. replaceable                 (boolean, optional, default=true) Marks this transaction as BIP125-replaceable.
                                Allows this transaction to be replaced by a transaction with higher fees. If provided, it is an error if explicit sequence numbers are incompatible.
  */
  public async createpsbt(
    inputs: {
      txid: string, vout: number, sequence?: number
    },
    outputs: Array<{
      [key: string]: string | number;
    } | { data: string }>,
    locktime?: number,
    replaceable?: boolean
  ): Promise<RPCResponse<createpsbt>> {
    return await this.request<createpsbt>('createpsbt', [inputs, outputs, locktime, replaceable]);
  }

  /*
  createrawtransaction [{"txid":"hex","vout":n,"sequence":n},...] [{"address":amount,...},{"data":"hex"},...] ( locktime replaceable )

  Create a transaction spending the given inputs and creating new outputs.
  Outputs can be addresses or data.
  Returns hex-encoded raw transaction.
  Note that the transaction's inputs are not signed, and
  it is not stored in the wallet or transmitted to the network.

  Arguments:
  1. inputs                      (json array, required) The inputs
      [
        {                       (json object)
          "txid": "hex",        (string, required) The transaction id
          "vout": n,            (numeric, required) The output number
          "sequence": n,        (numeric, optional, default=depends on the value of the 'replaceable' and 'locktime' arguments) The sequence number
        },
        ...
      ]
  2. outputs                     (json array, required) The outputs (key-value pairs), where none of the keys are duplicated.
                                That is, each address can only appear once and there can only be one 'data' object.
                                For compatibility reasons, a dictionary, which holds the key-value pairs directly, is also
                                accepted as second parameter.
      [
        {                       (json object)
          "address": amount,    (numeric or string, required) A key-value pair. The key (string) is the bitcoin address, the value (float or string) is the amount in BTC
          ...
        },
        {                       (json object)
          "data": "hex",        (string, required) A key-value pair. The key must be "data", the value is hex-encoded data
        },
        ...
      ]
  3. locktime                    (numeric, optional, default=0) Raw locktime. Non-0 value also locktime-activates inputs
  4. replaceable                 (boolean, optional, default=true) Marks this transaction as BIP125-replaceable.
                                Allows this transaction to be replaced by a transaction with higher fees. If provided, it is an error if explicit sequence numbers are incompatible.
  */
  public async createrawtransaction(
    inputs: {
      txid: string, vout: number, sequence?: number
    },
    outputs: Array<{
      [key: string]: string | number;
    } | { data: string }>,
    locktime?: number,
    replaceable?: boolean
  ): Promise<RPCResponse<createrawtransaction>> {
    return await this.request<createrawtransaction>('createrawtransaction', [inputs, outputs, locktime, replaceable]);
  }

  /*
  decodepsbt "psbt"

  Return a JSON object representing the serialized, base64-encoded partially signed Bitcoin transaction.

  Arguments:
  1. psbt    (string, required) The PSBT base64 string
  */
  public async decodepsbt(psbt: string): Promise<RPCResponse<decodepsbt>> {
    return await this.request<decodepsbt>('decodepsbt', [psbt]);
  }

  /*
  decoderawtransaction "hexstring" ( iswitness )

  Return a JSON object representing the serialized, hex-encoded transaction.

  Arguments:
  1. hexstring    (string, required) The transaction hex string
  2. iswitness    (boolean, optional, default=depends on heuristic tests) Whether the transaction hex is a serialized witness transaction.
                  If iswitness is not present, heuristic tests will be used in decoding.
                  If true, only witness deserialization will be tried.
                  If false, only non-witness deserialization will be tried.
                  This boolean should reflect whether the transaction has inputs
                  (e.g. fully valid, or on-chain transactions), if known by the caller.
  */
  public async decoderawtransaction(hexstring: string, iswitness?: boolean): Promise<RPCResponse<decoderawtransaction>> {
    return await this.request<decoderawtransaction>('decoderawtransaction', [hexstring, iswitness]);
  }

  /*
  decodescript "hexstring"

  Decode a hex-encoded script.

  Arguments:
  1. hexstring    (string, required) the hex-encoded script
  */
  public async decodescript(hexstring: string): Promise<RPCResponse<decodescript>> {
    return await this.request<decodescript>('decodescript', [hexstring]);
  }

  /*
  finalizepsbt "psbt" ( extract )

  Finalize the inputs of a PSBT. If the transaction is fully signed, it will produce a
  network serialized transaction which can be broadcast with sendrawtransaction. Otherwise a PSBT will be
  created which has the final_scriptSig and final_scriptWitness fields filled for inputs that are complete.
  Implements the Finalizer and Extractor roles.

  Arguments:
  1. psbt       (string, required) A base64 string of a PSBT
  2. extract    (boolean, optional, default=true) If true and the transaction is complete,
                extract and return the complete transaction in normal network serialization instead of the PSBT.
  */
  public async finalizepsbt(psbt: string, extract?: boolean): Promise<RPCResponse<finalizepsbt>> {
    return await this.request<finalizepsbt>('finalizepsbt', [psbt, extract]);
  }

  /*
  fundrawtransaction "hexstring" ( options iswitness )

  If the transaction has no inputs, they will be automatically selected to meet its out value.
  It will add at most one change output to the outputs.
  No existing outputs will be modified unless "subtractFeeFromOutputs" is specified.
  Note that inputs which were signed may need to be resigned after completion since in/outputs have been added.
  The inputs added will not be signed, use signrawtransactionwithkey
  or signrawtransactionwithwallet for that.
  All existing inputs must either have their previous output transaction be in the wallet
  or be in the UTXO set. Solving data must be provided for non-wallet inputs.
  Note that all inputs selected must be of standard form and P2SH scripts must be
  in the wallet using importaddress or addmultisigaddress (to calculate fees).
  You can see whether this is the case by checking the "solvable" field in the listunspent output.
  Only pay-to-pubkey, multisig, and P2SH versions thereof are currently supported for watch-only

  Arguments:
  1. hexstring                          (string, required) The hex string of the raw transaction
  2. options                            (json object, optional) for backward compatibility: passing in a true instead of an object will result in {"includeWatching":true}
      {
        "add_inputs": bool,            (boolean, optional, default=true) For a transaction with existing inputs, automatically include more if they are not enough.
        "include_unsafe": bool,        (boolean, optional, default=false) Include inputs that are not safe to spend (unconfirmed transactions from outside keys and unconfirmed replacement transactions).
                                        Warning: the resulting transaction may become invalid if one of the unsafe inputs disappears.
                                        If that happens, you will need to fund the transaction with different inputs and republish it.
        "changeAddress": "str",        (string, optional, default=automatic) The bitcoin address to receive the change
        "changePosition": n,           (numeric, optional, default=random) The index of the change output
        "change_type": "str",          (string, optional, default=set by -changetype) The output type to use. Only valid if changeAddress is not specified. Options are "legacy", "p2sh-segwit", "bech32", and "bech32m".
        "includeWatching": bool,       (boolean, optional, default=true for watch-only wallets, otherwise false) Also select inputs which are watch only.
                                        Only solvable inputs can be used. Watch-only destinations are solvable if the public key and/or output script was imported,
                                        e.g. with 'importpubkey' or 'importmulti' with the 'pubkeys' or 'desc' field.
        "lockUnspents": bool,          (boolean, optional, default=false) Lock selected unspent outputs
        "fee_rate": amount,            (numeric or string, optional, default=not set, fall back to wallet fee estimation) Specify a fee rate in sat/vB.
        "feeRate": amount,             (numeric or string, optional, default=not set, fall back to wallet fee estimation) Specify a fee rate in BTC/kvB.
        "subtractFeeFromOutputs": [    (json array, optional, default=[]) The integers.
                                        The fee will be equally deducted from the amount of each specified output.
                                        Those recipients will receive less bitcoins than you enter in their corresponding amount field.
                                        If no outputs are specified here, the sender pays the fee.
          vout_index,                  (numeric) The zero-based output index, before a change output is added.
          ...
        ],
        "input_weights": [             (json array, optional) Inputs and their corresponding weights
          "txid",                      (string, required) The transaction id
          vout,                        (numeric, required) The output index
          weight,                      (numeric, required) The maximum weight for this input, including the weight of the outpoint and sequence number. Note that serialized signature sizes are not guaranteed to be consistent, so the maximum DER signatures size of 73 bytes should be used when considering ECDSA signatures.Remember to convert serialized sizes to weight units when necessary.
          ...
        ],
        "conf_target": n,              (numeric, optional, default=wallet -txconfirmtarget) Confirmation target in blocks
        "estimate_mode": "str",        (string, optional, default="unset") The fee estimate mode, must be one of (case insensitive):
                                        "unset"
                                        "economical"
                                        "conservative"
        "replaceable": bool,           (boolean, optional, default=wallet default) Marks this transaction as BIP125-replaceable.
                                        Allows this transaction to be replaced by a transaction with higher fees
        "solving_data": {              (json object, optional) Keys and scripts needed for producing a final transaction with a dummy signature.
                                        Used for fee estimation during coin selection.
          "pubkeys": [                 (json array, optional, default=[]) Public keys involved in this transaction.
            "pubkey",                  (string) A public key
            ...
          ],
          "scripts": [                 (json array, optional, default=[]) Scripts involved in this transaction.
            "script",                  (string) A script
            ...
          ],
          "descriptors": [             (json array, optional, default=[]) Descriptors that provide solving data for this transaction.
            "descriptor",              (string) A descriptor
            ...
          ],
        },
      }
  3. iswitness                          (boolean, optional, default=depends on heuristic tests) Whether the transaction hex is a serialized witness transaction.
                                        If iswitness is not present, heuristic tests will be used in decoding.
                                        If true, only witness deserialization will be tried.
                                        If false, only non-witness deserialization will be tried.
                                        This boolean should reflect whether the transaction has inputs
                                        (e.g. fully valid, or on-chain transactions), if known by the caller.
  */
  public async fundrawtransaction(
    hexstring: string,
    options?: fundrawtransactionInputOptions,
    iswitness?: boolean,
  ): Promise<RPCResponse<fundrawtransaction>> {
    return await this.request<fundrawtransaction>('fundrawtransaction', [hexstring, options, iswitness]);
  }

  /*
  getrawtransaction "txid" ( verbose "blockhash" )

  Return the raw transaction data.

  By default, this call only returns a transaction if it is in the mempool. If -txindex is enabled
  and no blockhash argument is passed, it will return the transaction if it is in the mempool or any block.
  If a blockhash argument is passed, it will return the transaction if
  the specified block is available and the transaction is in that block.

  Hint: Use gettransaction for wallet transactions.

  If verbose is 'true', returns an Object with information about 'txid'.
  If verbose is 'false' or omitted, returns a string that is serialized, hex-encoded data for 'txid'.

  Arguments:
  1. txid         (string, required) The transaction id
  2. verbose      (boolean, optional, default=false) If false, return a string, otherwise return a json object
  3. blockhash    (string, optional) The block in which to look for the transaction
  */
  public async getrawtransaction(txid: string, verbose?: boolean, blockhash?: string): Promise<RPCResponse<getrawtransaction>> {
    return await this.request<getrawtransaction>('getrawtransaction', [txid, verbose, blockhash]);
  }

  /*
  joinpsbts ["psbt",...]

  Joins multiple distinct PSBTs with different inputs and outputs into one PSBT with inputs and outputs from all of the PSBTs
  No input in any of the PSBTs can be in more than one of the PSBTs.

  Arguments:
  1. txs            (json array, required) The base64 strings of partially signed transactions
      [
        "psbt",    (string, required) A base64 string of a PSBT
        ...
      ]
  */
  public async joinpsbts(txs: string[]): Promise<RPCResponse<joinpsbts>> {
    return await this.request<joinpsbts>('joinpsbts', [txs]);
  }

  /*
  sendrawtransaction "hexstring" ( maxfeerate )

  Submit a raw transaction (serialized, hex-encoded) to local node and network.

  The transaction will be sent unconditionally to all peers, so using sendrawtransaction
  for manual rebroadcast may degrade privacy by leaking the transaction's origin, as
  nodes will normally not rebroadcast non-wallet transactions already in their mempool.

  A specific exception, RPC_TRANSACTION_ALREADY_IN_CHAIN, may throw if the transaction cannot be added to the mempool.

  Related RPCs: createrawtransaction, signrawtransactionwithkey

  Arguments:
  1. hexstring     (string, required) The hex string of the raw transaction
  2. maxfeerate    (numeric or string, optional, default="0.10") Reject transactions whose fee rate is higher than the specified value, expressed in BTC/kvB.
                  Set to 0 to accept any fee rate.
  */
  public async sendrawtransaction(hexstring: string, maxfeerate?: number | string): Promise<RPCResponse<sendrawtransaction>> {
    return await this.request<sendrawtransaction>('sendrawtransaction', [hexstring, maxfeerate]);
  }

  /*
  signrawtransactionwithkey "hexstring" ["privatekey",...] ( [{"txid":"hex","vout":n,"scriptPubKey":"hex","redeemScript":"hex","witnessScript":"hex","amount":amount},...] "sighashtype" )

  Sign inputs for raw transaction (serialized, hex-encoded).
  The second argument is an array of base58-encoded private
  keys that will be the only keys used to sign the transaction.
  The third optional argument (may be null) is an array of previous transaction outputs that
  this transaction depends on but may not yet be in the block chain.

  Arguments:
  1. hexstring                        (string, required) The transaction hex string
  2. privkeys                         (json array, required) The base58-encoded private keys for signing
      [
        "privatekey",                (string) private key in base58-encoding
        ...
      ]
  3. prevtxs                          (json array, optional) The previous dependent transaction outputs
      [
        {                            (json object)
          "txid": "hex",             (string, required) The transaction id
          "vout": n,                 (numeric, required) The output number
          "scriptPubKey": "hex",     (string, required) script key
          "redeemScript": "hex",     (string) (required for P2SH) redeem script
          "witnessScript": "hex",    (string) (required for P2WSH or P2SH-P2WSH) witness script
          "amount": amount,          (numeric or string) (required for Segwit inputs) the amount spent
        },
        ...
      ]
  4. sighashtype                      (string, optional, default="DEFAULT for Taproot, ALL otherwise") The signature hash type. Must be one of:
                                      "DEFAULT"
                                      "ALL"
                                      "NONE"
                                      "SINGLE"
                                      "ALL|ANYONECANPAY"
                                      "NONE|ANYONECANPAY"
                                      "SINGLE|ANYONECANPAY"
  */
  public async signrawtransactionwithkey(
    hexstring: string,
    privkeys: string[],
    prevtxs?: Array<{
      txid: string;
      vout: number;
      scriptPubKey: string;
      redeemScript?: string;
      witnessScript?: string;
      amount?: number | string;
    }>,
    sighashtype?: string
  ): Promise<RPCResponse<signrawtransactionwithkey>> {
    return await this.request<signrawtransactionwithkey>('signrawtransactionwithkey', [hexstring, privkeys, prevtxs, sighashtype]);
  }

  /*
  testmempoolaccept ["rawtx",...] ( maxfeerate )

  Returns result of mempool acceptance tests indicating if raw transaction(s) (serialized, hex-encoded) would be accepted by mempool.

  If multiple transactions are passed in, parents must come before children and package policies apply: the transactions cannot conflict with any mempool transactions or each other.

  If one transaction fails, other transactions may not be fully validated (the 'allowed' key will be blank).

  The maximum number of transactions allowed is 25.

  This checks if transactions violate the consensus or policy rules.

  See sendrawtransaction call.

  Arguments:
  1. rawtxs          (json array, required) An array of hex strings of raw transactions.
      [
        "rawtx",    (string)
        ...
      ]
  2. maxfeerate      (numeric or string, optional, default="0.10") Reject transactions whose fee rate is higher than the specified value, expressed in BTC/kvB
  */
  public async testmempoolaccept(rawtxs: string[], maxfeerate?: number | string): Promise<RPCResponse<testmempoolaccept>> {
    return await this.request<testmempoolaccept>('testmempoolaccept', [rawtxs, maxfeerate]);
  }

  /*
  utxoupdatepsbt "psbt" ( ["",{"desc":"str","range":n or [n,n]},...] )

  Updates all segwit inputs and outputs in a PSBT with data from output descriptors, the UTXO set or the mempool.

  Arguments:
  1. psbt                          (string, required) A base64 string of a PSBT
  2. descriptors                   (json array, optional) An array of either strings or objects
      [
        "",                       (string) An output descriptor
        {                         (json object) An object with an output descriptor and extra information
          "desc": "str",          (string, required) An output descriptor
          "range": n or [n,n],    (numeric or array, optional, default=1000) Up to what index HD chains should be explored (either end or [begin,end])
        },
        ...
      ]
  */
  public async utxoupdatepsbt(
    psbt: string,
    descriptors?: Array<string | {
      desc: string;
      range?: number | [number, number];
    }>,
  ): Promise<RPCResponse<utxoupdatepsbt>> {
    return await this.request<utxoupdatepsbt>('utxoupdatepsbt', [psbt, descriptors]);
  }

  // Signer RPC

  /*
  enumeratesigners

  Returns a list of external signers from -signer.
  */
  public async enumeratesigners(): Promise<RPCResponse<enumeratesigners>> {
    return await this.request<enumeratesigners>('enumeratesigners');
  }

  // Util RPC

  /*
  createmultisig nrequired ["key",...] ( "address_type" )

  Creates a multi-signature address with n signature of m keys required.
  It returns a json object with the address and redeemScript.

  Arguments:
  1. nrequired       (numeric, required) The number of required signatures out of the n keys.
  2. keys            (json array, required) The hex-encoded public keys.
      [
        "key",      (string) The hex-encoded public key
        ...
      ]
  3. address_type    (string, optional, default="legacy") The address type to use. Options are "legacy", "p2sh-segwit", and "bech32".
  */
  public async createmultisig(nrequired: number, keys: string[], address_type?: 'legacy' | 'p2sh-segwit' | 'bech32'): Promise<RPCResponse<createmultisig>> {
    return await this.request<createmultisig>('createmultisig', [nrequired, keys, address_type]);
  }

  /*
  deriveaddresses "descriptor" ( range )

  Derives one or more addresses corresponding to an output descriptor.
  Examples of output descriptors are:
      pkh(<pubkey>)                        P2PKH outputs for the given pubkey
      wpkh(<pubkey>)                       Native segwit P2PKH outputs for the given pubkey
      sh(multi(<n>,<pubkey>,<pubkey>,...)) P2SH-multisig outputs for the given threshold and pubkeys
      raw(<hex script>)                    Outputs whose scriptPubKey equals the specified hex scripts

  In the above, <pubkey> either refers to a fixed public key in hexadecimal notation, or to an xpub/xprv optionally followed by one
  or more path elements separated by "/", where "h" represents a hardened child key.
  For more information on output descriptors, see the documentation in the doc/descriptors.md file.

  Arguments:
  1. descriptor    (string, required) The descriptor.
  2. range         (numeric or array, optional) If a ranged descriptor is used, this specifies the end or the range (in [begin,end] notation) to derive.
  */
  public async deriveaddresses(descriptor: string, range?: number | number[]): Promise<RPCResponse<deriveaddresses>> {
    return await this.request<deriveaddresses>('deriveaddresses', [descriptor, range]);
  }

  /*
  estimatesmartfee conf_target ( "estimate_mode" )

  Estimates the approximate fee per kilobyte needed for a transaction to begin
  confirmation within conf_target blocks if possible and return the number of blocks
  for which the estimate is valid. Uses virtual transaction size as defined
  in BIP 141 (witness data is discounted).

  Arguments:
  1. conf_target      (numeric, required) Confirmation target in blocks (1 - 1008)
  2. estimate_mode    (string, optional, default="conservative") The fee estimate mode.
                      Whether to return a more conservative estimate which also satisfies
                      a longer history. A conservative estimate potentially returns a
                      higher feerate and is more likely to be sufficient for the desired
                      target, but is not as responsive to short term drops in the
                      prevailing fee market. Must be one of (case insensitive):
                      "unset"
                      "economical"
                      "conservative"
  */
  public async estimatesmartfee(conf_target: number, estimate_mode?: 'unset' | 'economical' | 'conservative'): Promise<RPCResponse<estimatesmartfee>> {
    return await this.request<estimatesmartfee>('estimatesmartfee', [conf_target, estimate_mode]);
  }

  /*
  getdescriptorinfo "descriptor"

  Analyses a descriptor.

  Arguments:
  1. descriptor    (string, required) The descriptor.
  */
  public async getdescriptorinfo(descriptor: string): Promise<RPCResponse<getdescriptorinfo>> {
    return await this.request<getdescriptorinfo>('getdescriptorinfo', [descriptor]);
  }

  /*
  getindexinfo ( "index_name" )

  Returns the status of one or all available indices currently running in the node.

  Arguments:
  1. index_name    (string, optional) Filter results for an index with a specific name.
  */
  public async getindexinfo(index_name?: string): Promise<RPCResponse<getindexinfo>> {
    return await this.request<getindexinfo>('getindexinfo', [index_name]);
  }

  /*
  signmessagewithprivkey "privkey" "message"

  Sign a message with the private key of an address

  Arguments:
  1. privkey    (string, required) The private key to sign the message with.
  2. message    (string, required) The message to create a signature of.
  */
  public async signmessagewithprivkey(privkey: string, message: string): Promise<RPCResponse<signmessagewithprivkey>> {
    return await this.request<signmessagewithprivkey>('signmessagewithprivkey', [privkey, message]);
  }

  /*
  validateaddress "address"

  Return information about the given bitcoin address.

  Arguments:
  1. address    (string, required) The bitcoin address to validate
  */
  public async validateaddress(address: string): Promise<RPCResponse<validateaddress>> {
    return await this.request<validateaddress>('validateaddress', [address]);
  }

  /*
  verifymessage "address" "signature" "message"

  Verify a signed message.

  Arguments:
  1. address      (string, required) The bitcoin address to use for the signature.
  2. signature    (string, required) The signature provided by the signer in base 64 encoding (see signmessage).
  3. message      (string, required) The message that was signed.
  */
  public async verifymessage(address: string, signature: string, message: string): Promise<RPCResponse<verifymessage>> {
    return await this.request<verifymessage>('verifymessage', [address, signature, message]);
  }

  // Wallet RPC

  /*
  abandontransaction "txid"

  Mark in-wallet transaction <txid> as abandoned
  This will mark this transaction and all its in-wallet descendants as abandoned which will allow
  for their inputs to be respent.  It can be used to replace "stuck" or evicted transactions.
  It only works on transactions which are not included in a block and are not currently in the mempool.
  It has no effect on transactions which are already abandoned.

  Arguments:
  1. txid    (string, required) The transaction id
  */
  public async abandontransaction(txid: string): Promise<RPCResponse<abandontransaction>> {
    return await this.request<abandontransaction>('abandontransaction', [txid]);
  }

  /*
  abortrescan

  Stops current wallet rescan triggered by an RPC call, e.g. by an importprivkey call.
  Note: Use "getwalletinfo" to query the scanning progress.
  */
  public async abortrescan(): Promise<RPCResponse<abortrescan>> {
    return await this.request<abortrescan>('abortrescan');
  }

  /*
  addmultisigaddress nrequired ["key",...] ( "label" "address_type" )

  Add an nrequired-to-sign multisignature address to the wallet. Requires a new wallet backup.
  Each key is a Bitcoin address or hex-encoded public key.
  This functionality is only intended for use with non-watchonly addresses.
  See `importaddress` for watchonly p2sh address support.
  If 'label' is specified, assign address to that label.

  Arguments:
  1. nrequired       (numeric, required) The number of required signatures out of the n keys or addresses.
  2. keys            (json array, required) The bitcoin addresses or hex-encoded public keys
      [
        "key",      (string) bitcoin address or hex-encoded public key
        ...
      ]
  3. label           (string, optional) A label to assign the addresses to.
  4. address_type    (string, optional, default=set by -addresstype) The address type to use. Options are "legacy", "p2sh-segwit", and "bech32".
  */
  public async addmultisigaddress(nrequired: number, keys: string[], label?: string, address_type?: 'legacy' | 'p2sh-segwit' | 'bech32'): Promise<RPCResponse<addmultisigaddress>> {
    return await this.request<addmultisigaddress>('addmultisigaddress', [nrequired, keys, label, address_type]);
  }

  /*
  backupwallet "destination"

  Safely copies current wallet file to destination, which can be a directory or a path with filename.

  Arguments:
  1. destination    (string, required) The destination directory or file
  */
  public async backupwallet(destination: string): Promise<RPCResponse<backupwallet>> {
    return await this.request<backupwallet>('backupwallet', [destination]);
  }

  /*
  bumpfee "txid" ( options )

  Bumps the fee of an opt-in-RBF transaction T, replacing it with a new transaction B.
  An opt-in RBF transaction with the given txid must be in the wallet.
  The command will pay the additional fee by reducing change outputs or adding inputs when necessary.
  It may add a new change output if one does not already exist.
  All inputs in the original transaction will be included in the replacement transaction.
  The command will fail if the wallet or mempool contains a transaction that spends one of T's outputs.
  By default, the new fee will be calculated automatically using the estimatesmartfee RPC.
  The user can specify a confirmation target for estimatesmartfee.
  Alternatively, the user can specify a fee rate in sat/vB for the new transaction.
  At a minimum, the new fee rate must be high enough to pay an additional new relay fee (incrementalfee
  returned by getnetworkinfo) to enter the node's mempool.
  * WARNING: before version 0.21, fee_rate was in BTC/kvB. As of 0.21, fee_rate is in sat/vB. *

  Arguments:
  1. txid                           (string, required) The txid to be bumped
  2. options                        (json object, optional)
      {
        "conf_target": n,          (numeric, optional, default=wallet -txconfirmtarget) Confirmation target in blocks
                                    
        "fee_rate": amount,        (numeric or string, optional, default=not set, fall back to wallet fee estimation) 
                                    Specify a fee rate in sat/vB instead of relying on the built-in fee estimator.
                                    Must be at least 1.000 sat/vB higher than the current transaction fee rate.
                                    WARNING: before version 0.21, fee_rate was in BTC/kvB. As of 0.21, fee_rate is in sat/vB.
                                    
        "replaceable": bool,       (boolean, optional, default=true) Whether the new transaction should still be
                                    marked bip-125 replaceable. If true, the sequence numbers in the transaction will
                                    be left unchanged from the original. If false, any input sequence numbers in the
                                    original transaction that were less than 0xfffffffe will be increased to 0xfffffffe
                                    so the new transaction will not be explicitly bip-125 replaceable (though it may
                                    still be replaceable in practice, for example if it has unconfirmed ancestors which
                                    are replaceable).
                                    
        "estimate_mode": "str",    (string, optional, default="unset") The fee estimate mode, must be one of (case insensitive):
                                    "unset"
                                    "economical"
                                    "conservative"
      }
  */
  public async bumpfee(txid: string, options?: { conf_target?: number, fee_rate?: number | string, replaceable?: boolean, estimate_mode?: 'unset' | 'economical' | 'conservative' }): Promise<RPCResponse<bumpfee>> {
    return await this.request<bumpfee>('bumpfee', [txid, options]);
  }

  /*
  createwallet "wallet_name" ( disable_private_keys blank "passphrase" avoid_reuse descriptors load_on_startup external_signer )

  Creates and loads a new wallet.

  Arguments:
  1. wallet_name             (string, required) The name for the new wallet. If this is a path, the wallet will be created at the path location.
  2. disable_private_keys    (boolean, optional, default=false) Disable the possibility of private keys (only watchonlys are possible in this mode).
  3. blank                   (boolean, optional, default=false) Create a blank wallet. A blank wallet has no keys or HD seed. One can be set using sethdseed.
  4. passphrase              (string, optional) Encrypt the wallet with this passphrase.
  5. avoid_reuse             (boolean, optional, default=false) Keep track of coin reuse, and treat dirty and clean coins differently with privacy considerations in mind.
  6. descriptors             (boolean, optional, default=true) Create a native descriptor wallet. The wallet will use descriptors internally to handle address creation. Setting to "false" will create a legacy wallet; however, the legacy wallet type is being deprecated and support for creating and opening legacy wallets will be removed in the future.
  7. load_on_startup         (boolean, optional) Save wallet name to persistent settings and load on startup. True to add wallet to startup list, false to remove, null to leave unchanged.
  8. external_signer         (boolean, optional, default=false) Use an external signer such as a hardware wallet. Requires -signer to be configured. Wallet creation will fail if keys cannot be fetched. Requires disable_private_keys and descriptors set to true.
  */
  public async createwallet(wallet_name: string, disable_private_keys?: boolean, blank?: boolean, passphrase?: string, avoid_reuse?: boolean, descriptors?: boolean, load_on_startup?: boolean, external_signer?: boolean): Promise<RPCResponse<createwallet>> {
    return await this.request<createwallet>('createwallet', [wallet_name, disable_private_keys, blank, passphrase, avoid_reuse, descriptors, load_on_startup, external_signer]);
  }

  /*
  dumpprivkey "address"

  Reveals the private key corresponding to 'address'.
  Then the importprivkey can be used with this output

  Arguments:
  1. address    (string, required) The bitcoin address for the private key
  */
  public async dumpprivkey(address: string): Promise<RPCResponse<dumpprivkey>> {
    return await this.request<dumpprivkey>('dumpprivkey', [address]);
  }

  /*
  encryptwallet "passphrase"

  Encrypts the wallet with 'passphrase'. This is for first time encryption.
  After this, any calls that interact with private keys such as sending or signing 
  will require the passphrase to be set prior the making these calls.
  Use the walletpassphrase call for this, and then walletlock call.
  If the wallet is already encrypted, use the walletpassphrasechange call.

  Arguments:
  1. passphrase    (string, required) The pass phrase to encrypt the wallet with. It must be at least 1 character, but should be long.
  */
  public async encryptwallet(passphrase: string): Promise<RPCResponse<encryptwallet>> {
    return await this.request<encryptwallet>('encryptwallet', [passphrase]);
  }

  /*
  getaddressesbylabel "label"

  Returns the list of addresses assigned the specified label.

  Arguments:
  1. label    (string, required) The label.
  */
  public async getaddressesbylabel(label: string): Promise<RPCResponse<getaddressesbylabel>> {
    return await this.request<getaddressesbylabel>('getaddressesbylabel', [label]);
  }

  /*
  getaddressinfo "address"

  Return information about the given bitcoin address.
  Some of the information will only be present if the address is in the active wallet.

  Arguments:
  1. address    (string, required) The bitcoin address for which to get information.
  */
  public async getaddressinfo(address: string): Promise<RPCResponse<getaddressinfo>> {
    return await this.request<getaddressinfo>('getaddressinfo', [address]);
  }

  /*
  getbalance ( "dummy" minconf include_watchonly avoid_reuse )

  Returns the total available balance.
  The available balance is what the wallet considers currently spendable, and is
  thus affected by options which limit spendability such as -spendzeroconfchange.

  Arguments:
  1. dummy                (string, optional) Remains for backward compatibility. Must be excluded or set to "*".
  2. minconf              (numeric, optional, default=0) Only include transactions confirmed at least this many times.
  3. include_watchonly    (boolean, optional, default=true for watch-only wallets, otherwise false) Also include balance in watch-only addresses (see 'importaddress')
  4. avoid_reuse          (boolean, optional, default=true) (only available if avoid_reuse wallet flag is set) Do not include balance in dirty outputs; addresses are considered dirty if they have previously been used in a transaction.
  */
  public async getbalance(dummy?: string, minconf?: number, include_watchonly?: boolean, avoid_reuse?: boolean): Promise<RPCResponse<getbalance>> {
    return await this.request<getbalance>('getbalance', [dummy, minconf, include_watchonly, avoid_reuse]);
  }

  /*
  getbalances

  Returns an object with all balances in BTC.
  */
  public async getbalances(): Promise<RPCResponse<getbalances>> {
    return await this.request<getbalances>('getbalances');
  }

  /*
  getnewaddress ( "label" "address_type" )

  Returns a new Bitcoin address for receiving payments.
  If 'label' is specified, it is added to the address book 
  so payments received with the address will be associated with 'label'.

  Arguments:
  1. label           (string, optional, default="") The label name for the address to be linked to. It can also be set to the empty string "" to represent the default label. The label does not need to exist, it will be created if there is no label by the given name.
  2. address_type    (string, optional, default=set by -addresstype) The address type to use. Options are "legacy", "p2sh-segwit", "bech32", and "bech32m".
  */
  public async getnewaddress(label?: string, address_type?: string): Promise<RPCResponse<getnewaddress>> {
    return await this.request<getnewaddress>('getnewaddress', [label, address_type]);
  }

  /*
  getrawchangeaddress ( "address_type" )

  Returns a new Bitcoin address, for receiving change.
  This is for use with raw transactions, NOT normal use.

  Arguments:
  1. address_type    (string, optional, default=set by -changetype) The address type to use. Options are "legacy", "p2sh-segwit", "bech32", and "bech32m".
  */
  public async getrawchangeaddress(address_type?: 'legacy' | 'p2sh-segwit' | 'bech32' | 'bech32m'): Promise<RPCResponse<getrawchangeaddress>> {
    return await this.request<getrawchangeaddress>('getrawchangeaddress', [address_type]);
  }

  /*
  getreceivedbyaddress "address" ( minconf include_immature_coinbase )

  Returns the total amount received by the given address in transactions with at least minconf confirmations.

  Arguments:
  1. address                      (string, required) The bitcoin address for transactions.
  2. minconf                      (numeric, optional, default=1) Only include transactions confirmed at least this many times.
  3. include_immature_coinbase    (boolean, optional, default=false) Include immature coinbase transactions.
  */
  public async getreceivedbyaddress(address: string, minconf?: number, include_immature_coinbase?: boolean): Promise<RPCResponse<getreceivedbyaddress>> {
    return await this.request<getreceivedbyaddress>('getreceivedbyaddress', [address, minconf, include_immature_coinbase]);
  }

  /*
  getreceivedbylabel "label" ( minconf include_immature_coinbase )

  Returns the total amount received by addresses with <label> in transactions with at least [minconf] confirmations.

  Arguments:
  1. label                        (string, required) The selected label, may be the default label using "".
  2. minconf                      (numeric, optional, default=1) Only include transactions confirmed at least this many times.
  3. include_immature_coinbase    (boolean, optional, default=false) Include immature coinbase transactions.
  */
  public async getreceivedbylabel(label: string, minconf?: number, include_immature_coinbase?: boolean): Promise<RPCResponse<getreceivedbylabel>> {
    return await this.request<getreceivedbylabel>('getreceivedbylabel', [label, minconf, include_immature_coinbase]);
  }

  /*
  gettransaction "txid" ( include_watchonly verbose )

  Get detailed information about in-wallet transaction <txid>

  Arguments:
  1. txid                 (string, required) The transaction id
  2. include_watchonly    (boolean, optional, default=true for watch-only wallets, otherwise false) Whether to include watch-only addresses in balance calculation and details[]
  3. verbose              (boolean, optional, default=false) Whether to include a `decoded` field containing the decoded transaction (equivalent to RPC decoderawtransaction)
  */
  public async gettransaction(txid: string, include_watchonly?: boolean, verbose?: boolean): Promise<RPCResponse<gettransaction>> {
    return await this.request<gettransaction>('gettransaction', [txid, include_watchonly, verbose]);
  }

  /*
  getunconfirmedbalance

  DEPRECATED
  Identical to getbalances().mine.untrusted_pending
  */
  public async getunconfirmedbalance(): Promise<RPCResponse<getunconfirmedbalance>> {
    return await this.request<getunconfirmedbalance>('getunconfirmedbalance');
  }

  /*
  getwalletinfo

  Returns an object containing various wallet state info.
  */
  public async getwalletinfo(): Promise<RPCResponse<getwalletinfo>> {
    return await this.request<getwalletinfo>('getwalletinfo');
  }

  /*
  importaddress "address" ( "label" rescan p2sh )

  Adds an address or script (in hex) that can be watched as if it were in your wallet but cannot be used to spend. Requires a new wallet backup.

  Note: This call can take over an hour to complete if rescan is true, during that time, other rpc calls
  may report that the imported address exists but related transactions are still missing, leading to temporarily incorrect/bogus balances and unspent outputs until rescan completes.
  The rescan parameter can be set to false if the key was never used to create transactions. If it is set to false,
  but the key was used to create transactions, rescanblockchain needs to be called with the appropriate block range.
  If you have the full public key, you should call importpubkey instead of this.
  Hint: use importmulti to import more than one address.

  Note: If you import a non-standard raw script in hex form, outputs sending to it will be treated
  as change, and not show up in many RPCs.
  Note: Use "getwalletinfo" to query the scanning progress.
  Note: This command is only compatible with legacy wallets. Use "importdescriptors" with "addr(X)" for descriptor wallets.

  Arguments:
  1. address    (string, required) The Bitcoin address (or hex-encoded script)
  2. label      (string, optional, default="") An optional label
  3. rescan     (boolean, optional, default=true) Scan the chain and mempool for wallet transactions.
  4. p2sh       (boolean, optional, default=false) Add the P2SH version of the script as well
  */
  public async importaddress(address: string, label?: string, rescan?: boolean, p2sh?: boolean): Promise<RPCResponse<importaddress>> {
    return await this.request<importaddress>('importaddress', [address, label, rescan, p2sh]);
  }

  /*
  importdescriptors "requests"

  Import descriptors. This will trigger a rescan of the blockchain based on the earliest timestamp of all descriptors being imported. Requires a new wallet backup.

  Note: This call can take over an hour to complete if using an early timestamp; during that time, other rpc calls
  may report that the imported keys, addresses or scripts exist but related transactions are still missing.

  Arguments:
  1. requests                                 (json array, required) Data to be imported
      [
        {                                    (json object)
          "desc": "str",                     (string, required) Descriptor to import.
          "active": bool,                    (boolean, optional, default=false) Set this descriptor to be the active descriptor for the corresponding output type/externality
          "range": n or [n,n],               (numeric or array) If a ranged descriptor is used, this specifies the end or the range (in the form [begin,end]) to import
          "next_index": n,                   (numeric) If a ranged descriptor is set to active, this specifies the next index to generate addresses from
          "timestamp": timestamp | "now",    (integer / string, required) Time from which to start rescanning the blockchain for this descriptor, in UNIX epoch time
                                              Use the string "now" to substitute the current synced blockchain time.
                                              "now" can be specified to bypass scanning, for outputs which are known to never have been used, and
                                              0 can be specified to scan the entire blockchain. Blocks up to 2 hours before the earliest timestamp
                                              of all descriptors being imported will be scanned as well as the mempool.
          "internal": bool,                  (boolean, optional, default=false) Whether matching outputs should be treated as not incoming payments (e.g. change)
          "label": "str",                    (string, optional, default="") Label to assign to the address, only allowed with internal=false. Disabled for ranged descriptors
        },
        ...
      ]
  */
  public async importdescriptors(requests: Array<{
    desc: string;
    active?: boolean;
    range: number | [number, number];
    next_index: number;
    timestamp: number | 'now';
    internal?: boolean;
    label?: string;
  }>): Promise<RPCResponse<importdescriptors>> {
    return await this.request<importdescriptors>('importdescriptors', [requests]);
  }

  /*
  importmulti "requests" ( "options" )

  Import addresses/scripts (with private or public keys, redeem script (P2SH)), optionally rescanning the blockchain from the earliest creation time of the imported scripts. Requires a new wallet backup.
  If an address/script is imported without all of the private keys required to spend from that address, it will be watchonly. The 'watchonly' option must be set to true in this case or a warning will be returned.
  Conversely, if all the private keys are provided and the address/script is spendable, the watchonly option must be set to false, or a warning will be returned.

  Note: This call can take over an hour to complete if rescan is true, during that time, other rpc calls
  may report that the imported keys, addresses or scripts exist but related transactions are still missing.
  The rescan parameter can be set to false if the key was never used to create transactions. If it is set to false,
  but the key was used to create transactions, rescanblockchain needs to be called with the appropriate block range.
  Note: Use "getwalletinfo" to query the scanning progress.

  Arguments:
  1. requests                                                         (json array, required) Data to be imported
      [
        {                                                            (json object)
          "desc": "str",                                             (string) Descriptor to import. If using descriptor, do not also provide address/scriptPubKey, scripts, or pubkeys
          "scriptPubKey": "<script>" | { "address":"<address>" },    (string / json, required) Type of scriptPubKey (string for script, json for address). Should not be provided if using a descriptor
          "timestamp": timestamp | "now",                            (integer / string, required) Creation time of the key expressed in UNIX epoch time,
                                                                      or the string "now" to substitute the current synced blockchain time. The timestamp of the oldest
                                                                      key will determine how far back blockchain rescans need to begin for missing wallet transactions.
                                                                      "now" can be specified to bypass scanning, for keys which are known to never have been used, and
                                                                      0 can be specified to scan the entire blockchain. Blocks up to 2 hours before the earliest key
                                                                      creation time of all keys being imported by the importmulti call will be scanned.
          "redeemscript": "str",                                     (string) Allowed only if the scriptPubKey is a P2SH or P2SH-P2WSH address/scriptPubKey
          "witnessscript": "str",                                    (string) Allowed only if the scriptPubKey is a P2SH-P2WSH or P2WSH address/scriptPubKey
          "pubkeys": [                                               (json array, optional, default=[]) Array of strings giving pubkeys to import. They must occur in P2PKH or P2WPKH scripts. They are not required when the private key is also provided (see the "keys" argument).
            "pubKey",                                                (string)
            ...
          ],
          "keys": [                                                  (json array, optional, default=[]) Array of strings giving private keys to import. The corresponding public keys must occur in the output or redeemscript.
            "key",                                                   (string)
            ...
          ],
          "range": n or [n,n],                                       (numeric or array) If a ranged descriptor is used, this specifies the end or the range (in the form [begin,end]) to import
          "internal": bool,                                          (boolean, optional, default=false) Stating whether matching outputs should be treated as not incoming payments (also known as change)
          "watchonly": bool,                                         (boolean, optional, default=false) Stating whether matching outputs should be considered watchonly.
          "label": "str",                                            (string, optional, default="") Label to assign to the address, only allowed with internal=false
          "keypool": bool,                                           (boolean, optional, default=false) Stating whether imported public keys should be added to the keypool for when users request new addresses. Only allowed when wallet private keys are disabled
        },
        ...
      ]
  2. options                                                          (json object, optional)
      {
        "rescan": bool,                                              (boolean, optional, default=true) Scan the chain and mempool for wallet transactions after all imports.
      }
  */

  public async importmulti(
    requests: Array<{
      desc: string;
      scriptPubKey: string | { address: string };
      timestamp: number | 'now';
      redeemscript: string;
      witnessscript: string;
      pubkeys: string[];
      keys: string[];
      range: number | [number, number];
      internal?: boolean;
      watchonly?: boolean;
      label?: string;
      keypool?: boolean;
    }>,
    options?: {
      rescan?: boolean;
    }
  ): Promise<RPCResponse<importmulti>> {
    return await this.request<importmulti>('importmulti', [requests, options]);
  }

  /*
  importprivkey "privkey" ( "label" rescan )

  Adds a private key (as returned by dumpprivkey) to your wallet. Requires a new wallet backup.
  Hint: use importmulti to import more than one private key.

  Note: This call can take over an hour to complete if rescan is true, during that time, other rpc calls
  may report that the imported key exists but related transactions are still missing, leading to temporarily incorrect/bogus balances and unspent outputs until rescan completes.
  The rescan parameter can be set to false if the key was never used to create transactions. If it is set to false,
  but the key was used to create transactions, rescanblockchain needs to be called with the appropriate block range.
  Note: Use "getwalletinfo" to query the scanning progress.

  Arguments:
  1. privkey    (string, required) The private key (see dumpprivkey)
  2. label      (string, optional, default=current label if address exists, otherwise "") An optional label
  3. rescan     (boolean, optional, default=true) Scan the chain and mempool for wallet transactions.
  */
  public async importprivkey(privkey: string, label?: string, rescan?: boolean): Promise<RPCResponse<importprivkey>> {
    return await this.request<importprivkey>('importprivkey', [privkey, label, rescan]);
  }

  /*
  importprunedfunds "rawtransaction" "txoutproof"

  Imports funds without rescan. Corresponding address or script must previously be included in wallet. Aimed towards pruned wallets. The end-user is responsible to import additional transactions that subsequently spend the imported outputs or rescan after the point in the blockchain the transaction is included.

  Arguments:
  1. rawtransaction    (string, required) A raw transaction in hex funding an already-existing address in wallet
  2. txoutproof        (string, required) The hex output from gettxoutproof that contains the transaction
  */
  public async importprunedfunds(rawtransaction: string, txoutproof: string): Promise<RPCResponse<importprunedfunds>> {
    return await this.request<importprunedfunds>('importprunedfunds', [rawtransaction, txoutproof]);
  }

  /*
  importpubkey "pubkey" ( "label" rescan )

  Adds a public key (in hex) that can be watched as if it were in your wallet but cannot be used to spend. Requires a new wallet backup.
  Hint: use importmulti to import more than one public key.

  Note: This call can take over an hour to complete if rescan is true, during that time, other rpc calls
  may report that the imported pubkey exists but related transactions are still missing, leading to temporarily incorrect/bogus balances and unspent outputs until rescan completes.
  The rescan parameter can be set to false if the key was never used to create transactions. If it is set to false,
  but the key was used to create transactions, rescanblockchain needs to be called with the appropriate block range.
  Note: Use "getwalletinfo" to query the scanning progress.

  Arguments:
  1. pubkey    (string, required) The hex-encoded public key
  2. label     (string, optional, default="") An optional label
  3. rescan    (boolean, optional, default=true) Scan the chain and mempool for wallet transactions.
  */
  public async importpubkey(pubkey: string, label?: string, rescan?: boolean): Promise<RPCResponse<importpubkey>> {
    return await this.request<importpubkey>('importpubkey', [pubkey, label, rescan]);
  }

  /*
  importwallet "filename"

  Imports keys from a wallet dump file (see dumpwallet). Requires a new wallet backup to include imported keys.
  Note: Blockchain and Mempool will be rescanned after a successful import. Use "getwalletinfo" to query the scanning progress.

  Arguments:
  1. filename    (string, required) The wallet file
  */
  public async importwallet(filename: string): Promise<RPCResponse<importwallet>> {
    return await this.request<importwallet>('importwallet', [filename]);
  }

  /*
  keypoolrefill ( newsize )

  Fills the keypool.
  Requires wallet passphrase to be set with walletpassphrase call if wallet is encrypted.

  Arguments:
  1. newsize    (numeric, optional, default=1000, or as set by -keypool) The new keypool size
  */
  public async keypoolrefill(newsize?: number): Promise<RPCResponse<keypoolrefill>> {
    return await this.request<keypoolrefill>('keypoolrefill', [newsize]);
  }

  /*
  listaddressgroupings

  Lists groups of addresses which have had their common ownership
  made public by common use as inputs or as the resulting change
  in past transactions
  */
  public async listaddressgroupings(): Promise<RPCResponse<listaddressgroupings>> {
    return await this.request<listaddressgroupings>('listaddressgroupings');
  }

  /*
  listdescriptors ( private )

  List descriptors imported into a descriptor-enabled wallet.

  Arguments:
  1. private    (boolean, optional, default=false) Show private descriptors.
  */
  public async listdescriptors(_private?: boolean): Promise<RPCResponse<listdescriptors>> {
    return await this.request<listdescriptors>('listdescriptors', [_private]);
  }

  /*
  listlabels ( "purpose" )

  Returns the list of all labels, or labels that are assigned to addresses with a specific purpose.

  Arguments:
  1. purpose    (string, optional) Address purpose to list labels for ('send','receive'). An empty string is the same as not providing this argument.
  */
  public async listlabels(purpose?: string): Promise<RPCResponse<listlabels>> {
    return await this.request<listlabels>('listlabels', [purpose]);
  }

  /*
  listlockunspent

  Returns list of temporarily unspendable outputs.
  See the lockunspent call to lock and unlock transactions for spending.
  */
  public async listlockunspent(): Promise<RPCResponse<listlockunspent>> {
    return await this.request<listlockunspent>('listlockunspent');
  }

  /*
  listreceivedbyaddress ( minconf include_empty include_watchonly "address_filter" include_immature_coinbase )

  List balances by receiving address.

  Arguments:
  1. minconf                      (numeric, optional, default=1) The minimum number of confirmations before payments are included.
  2. include_empty                (boolean, optional, default=false) Whether to include addresses that haven't received any payments.
  3. include_watchonly            (boolean, optional, default=true for watch-only wallets, otherwise false) Whether to include watch-only addresses (see 'importaddress')
  4. address_filter               (string, optional) If present and non-empty, only return information on this address.
  5. include_immature_coinbase    (boolean, optional, default=false) Include immature coinbase transactions.
  */
  public async listreceivedbyaddress(minconf?: number, include_empty?: boolean, include_watchonly?: boolean, address_filter?: string, include_immature_coinbase?: boolean): Promise<RPCResponse<listreceivedbyaddress>> {
    return await this.request<listreceivedbyaddress>('listreceivedbyaddress', [minconf, include_empty, include_watchonly, address_filter, include_immature_coinbase]);
  }

  /*
  listreceivedbylabel ( minconf include_empty include_watchonly include_immature_coinbase )

  List received transactions by label.

  Arguments:
  1. minconf                      (numeric, optional, default=1) The minimum number of confirmations before payments are included.
  2. include_empty                (boolean, optional, default=false) Whether to include labels that haven't received any payments.
  3. include_watchonly            (boolean, optional, default=true for watch-only wallets, otherwise false) Whether to include watch-only addresses (see 'importaddress')
  4. include_immature_coinbase    (boolean, optional, default=false) Include immature coinbase transactions.
  */
  public async listreceivedbylabel(minconf?: number, include_empty?: boolean, include_watchonly?: boolean, include_immature_coinbase?: boolean): Promise<RPCResponse<listreceivedbylabel>> {
    return await this.request<listreceivedbylabel>('listreceivedbylabel', [minconf, include_empty, include_watchonly, include_immature_coinbase]);
  }

  /*
  listsinceblock ( "blockhash" target_confirmations include_watchonly include_removed include_change )

  Get all transactions in blocks since block [blockhash], or all transactions if omitted.
  If "blockhash" is no longer a part of the main chain, transactions from the fork point onward are included.
  Additionally, if include_removed is set, transactions affecting the wallet which were removed are returned in the "removed" array.

  Arguments:
  1. blockhash               (string, optional) If set, the block hash to list transactions since, otherwise list all transactions.
  2. target_confirmations    (numeric, optional, default=1) Return the nth block hash from the main chain. e.g. 1 would mean the best block hash. Note: this is not used as a filter, but only affects [lastblock] in the return value
  3. include_watchonly       (boolean, optional, default=true for watch-only wallets, otherwise false) Include transactions to watch-only addresses (see 'importaddress')
  4. include_removed         (boolean, optional, default=true) Show transactions that were removed due to a reorg in the "removed" array
                            (not guaranteed to work on pruned nodes)
  5. include_change          (boolean, optional, default=false) Also add entries for change outputs.
  */
  public async listsinceblock(blockhash?: string, target_confirmations?: number, include_watchonly?: boolean, include_removed?: boolean, include_change?: boolean): Promise<RPCResponse<listsinceblock>> {
    return await this.request<listsinceblock>('listsinceblock', [blockhash, target_confirmations, include_watchonly, include_removed, include_change]);
  }

  /*
  listtransactions ( "label" count skip include_watchonly )

  If a label name is provided, this will return only incoming transactions paying to addresses with the specified label.

  Returns up to 'count' most recent transactions skipping the first 'from' transactions.

  Arguments:
  1. label                (string, optional) If set, should be a valid label name to return only incoming transactions
                          with the specified label, or "*" to disable filtering and return all transactions.
  2. count                (numeric, optional, default=10) The number of transactions to return
  3. skip                 (numeric, optional, default=0) The number of transactions to skip
  4. include_watchonly    (boolean, optional, default=true for watch-only wallets, otherwise false) Include transactions to watch-only addresses (see 'importaddress')
  */
  public async listtransactions(label?: string, count?: number, skip?: number, include_watchonly?: boolean): Promise<RPCResponse<listtransactions>> {
    return await this.request<listtransactions>('listtransactions', [label, count, skip, include_watchonly]);
  }

  /*
  listunspent ( minconf maxconf ["address",...] include_unsafe query_options )

  Returns array of unspent transaction outputs
  with between minconf and maxconf (inclusive) confirmations.
  Optionally filter to only include txouts paid to specified addresses.

  Arguments:
  1. minconf                            (numeric, optional, default=1) The minimum confirmations to filter
  2. maxconf                            (numeric, optional, default=9999999) The maximum confirmations to filter
  3. addresses                          (json array, optional, default=[]) The bitcoin addresses to filter
      [
        "address",                     (string) bitcoin address
        ...
      ]
  4. include_unsafe                     (boolean, optional, default=true) Include outputs that are not safe to spend
                                        See description of "safe" attribute below.
  5. query_options                      (json object, optional) JSON with query options
      {
        "minimumAmount": amount,       (numeric or string, optional, default="0.00") Minimum value of each UTXO in BTC
        "maximumAmount": amount,       (numeric or string, optional, default=unlimited) Maximum value of each UTXO in BTC
        "maximumCount": n,             (numeric, optional, default=unlimited) Maximum number of UTXOs
        "minimumSumAmount": amount,    (numeric or string, optional, default=unlimited) Minimum sum value of all UTXOs in BTC
      }
  */
  public async listunspent(
    minconf?: number,
    maxconf?: number,
    addresses?: string[],
    include_unsafe?: boolean,
    query_options?: {
      minimumAmount?: number | string,
      maximumAmount?: number | string,
      maximumCount?: number,
      minimumSumAmount?: number | string,
    }
  ): Promise<RPCResponse<listunspent>> {
    return await this.request<listunspent>('listunspent', [minconf, maxconf, addresses, include_unsafe, query_options]);
  }

  /*
  listwalletdir

  Returns a list of wallets in the wallet directory.
  */
  public async listwalletdir(): Promise<RPCResponse<listwalletdir>> {
    return await this.request<listwalletdir>('listwalletdir');
  }

  /*
  listwallets

  Returns a list of currently loaded wallets.
  For full information on the wallet, use "getwalletinfo"
  */
  public async listwallets(): Promise<RPCResponse<listwallets>> {
    return await this.request<listwallets>('listwallets');
  }

  /*
  loadwallet "filename" ( load_on_startup )

  Loads a wallet from a wallet file or directory.
  Note that all wallet command-line options used when starting bitcoind will be
  applied to the new wallet.

  Arguments:
  1. filename           (string, required) The wallet directory or .dat file.
  2. load_on_startup    (boolean, optional) Save wallet name to persistent settings and load on startup. True to add wallet to startup list, false to remove, null to leave unchanged.
  */
  public async loadwallet(filename: string, load_on_startup?: boolean): Promise<RPCResponse<loadwallet>> {
    return await this.request<loadwallet>('loadwallet', [filename, load_on_startup]);
  }

  /*
  lockunspent unlock ( [{"txid":"hex","vout":n},...] persistent )

  Updates list of temporarily unspendable outputs.
  Temporarily lock (unlock=false) or unlock (unlock=true) specified transaction outputs.
  If no transaction outputs are specified when unlocking then all current locked transaction outputs are unlocked.
  A locked transaction output will not be chosen by automatic coin selection, when spending bitcoins.
  Manually selected coins are automatically unlocked.
  Locks are stored in memory only, unless persistent=true, in which case they will be written to the
  wallet database and loaded on node start. Unwritten (persistent=false) locks are always cleared
  (by virtue of process exit) when a node stops or fails. Unlocking will clear both persistent and not.
  Also see the listunspent call

  Arguments:
  1. unlock                  (boolean, required) Whether to unlock (true) or lock (false) the specified transactions
  2. transactions            (json array, optional, default=[]) The transaction outputs and within each, the txid (string) vout (numeric).
      [
        {                   (json object)
          "txid": "hex",    (string, required) The transaction id
          "vout": n,        (numeric, required) The output number
        },
        ...
      ]
  3. persistent              (boolean, optional, default=false) Whether to write/erase this lock in the wallet database, or keep the change in memory only. Ignored for unlocking.
  */
  public async lockunspent(unlock: boolean, transactions?: Array<{ txid: string, vout: number }>, persistent?: boolean): Promise<RPCResponse<lockunspent>> {
    return await this.request<lockunspent>('lockunspent', [unlock, transactions, persistent]);
  }

  /*
  migratewallet

  EXPERIMENTAL warning: This call may not work as expected and may be changed in future releases

  Migrate the wallet to a descriptor wallet.
  A new wallet backup will need to be made.

  The migration process will create a backup of the wallet before migrating. This backup
  file will be named <wallet name>-<timestamp>.legacy.bak and can be found in the directory
  for this wallet. In the event of an incorrect migration, the backup can be restored using restorewallet.
  Requires wallet passphrase to be set with walletpassphrase call if wallet is encrypted.
  */
  public async migratewallet(): Promise<RPCResponse<migratewallet>> {
    return await this.request<migratewallet>('migratewallet');
  }

  /*
  newkeypool

  Entirely clears and refills the keypool.
  WARNING: On non-HD wallets, this will require a new backup immediately, to include the new keys.
  When restoring a backup of an HD wallet created before the newkeypool command is run, funds received to
  new addresses may not appear automatically. They have not been lost, but the wallet may not find them.
  This can be fixed by running the newkeypool command on the backup and then rescanning, so the wallet
  re-generates the required keys.
  Requires wallet passphrase to be set with walletpassphrase call if wallet is encrypted.
  */
  public async newkeypool(): Promise<RPCResponse<newkeypool>> {
    return await this.request<newkeypool>('newkeypool');
  }

  /*
  psbtbumpfee "txid" ( options )

  Bumps the fee of an opt-in-RBF transaction T, replacing it with a new transaction B.
  Returns a PSBT instead of creating and signing a new transaction.
  An opt-in RBF transaction with the given txid must be in the wallet.
  The command will pay the additional fee by reducing change outputs or adding inputs when necessary.
  It may add a new change output if one does not already exist.
  All inputs in the original transaction will be included in the replacement transaction.
  The command will fail if the wallet or mempool contains a transaction that spends one of T's outputs.
  By default, the new fee will be calculated automatically using the estimatesmartfee RPC.
  The user can specify a confirmation target for estimatesmartfee.
  Alternatively, the user can specify a fee rate in sat/vB for the new transaction.
  At a minimum, the new fee rate must be high enough to pay an additional new relay fee (incrementalfee
  returned by getnetworkinfo) to enter the node's mempool.
  * WARNING: before version 0.21, fee_rate was in BTC/kvB. As of 0.21, fee_rate is in sat/vB. *

  Arguments:
  1. txid                           (string, required) The txid to be bumped
  2. options                        (json object, optional)
      {
        "conf_target": n,          (numeric, optional, default=wallet -txconfirmtarget) Confirmation target in blocks
                                    
        "fee_rate": amount,        (numeric or string, optional, default=not set, fall back to wallet fee estimation) 
                                    Specify a fee rate in sat/vB instead of relying on the built-in fee estimator.
                                    Must be at least 1.000 sat/vB higher than the current transaction fee rate.
                                    WARNING: before version 0.21, fee_rate was in BTC/kvB. As of 0.21, fee_rate is in sat/vB.
                                    
        "replaceable": bool,       (boolean, optional, default=true) Whether the new transaction should still be
                                    marked bip-125 replaceable. If true, the sequence numbers in the transaction will
                                    be left unchanged from the original. If false, any input sequence numbers in the
                                    original transaction that were less than 0xfffffffe will be increased to 0xfffffffe
                                    so the new transaction will not be explicitly bip-125 replaceable (though it may
                                    still be replaceable in practice, for example if it has unconfirmed ancestors which
                                    are replaceable).
                                    
        "estimate_mode": "str",    (string, optional, default="unset") The fee estimate mode, must be one of (case insensitive):
                                    "unset"
                                    "economical"
                                    "conservative"
      }
  */
  public async psbtbumpfee(
    txid: string,
    options?: {
      conf_target?: number,
      fee_rate?: number,
      replaceable?: boolean,
      estimate_mode?: 'unset' | 'economic' | 'conservative'
    }): Promise<RPCResponse<psbtbumpfee>> {
    return await this.request<psbtbumpfee>('psbtbumpfee', [txid, options]);
  }

  /*
  removeprunedfunds "txid"

  Deletes the specified transaction from the wallet. Meant for use with pruned wallets and as a companion to importprunedfunds. This will affect wallet balances.

  Arguments:
  1. txid    (string, required) The hex-encoded id of the transaction you are deleting
  */
  public async removeprunedfunds(txid: string): Promise<RPCResponse<removeprunedfunds>> {
    return await this.request<removeprunedfunds>('removeprunedfunds', [txid]);
  }

  /*
  rescanblockchain ( start_height stop_height )

  Rescan the local blockchain for wallet related transactions.
  Note: Use "getwalletinfo" to query the scanning progress.

  Arguments:
  1. start_height    (numeric, optional, default=0) block height where the rescan should start
  2. stop_height     (numeric, optional) the last block height that should be scanned. If none is provided it will rescan up to the tip at return time of this call.
  */
  public async rescanblockchain(start_height?: number, stop_height?: number): Promise<RPCResponse<rescanblockchain>> {
    return await this.request<rescanblockchain>('rescanblockchain', [start_height, stop_height]);
  }

  /*
  restorewallet "wallet_name" "backup_file" ( load_on_startup )

  Restore and loads a wallet from backup.

  Arguments:
  1. wallet_name        (string, required) The name that will be applied to the restored wallet
  2. backup_file        (string, required) The backup file that will be used to restore the wallet.
  3. load_on_startup    (boolean, optional) Save wallet name to persistent settings and load on startup. True to add wallet to startup list, false to remove, null to leave unchanged.
  */
  public async restorewallet(wallet_name: string, backup_file: string, load_on_startup?: boolean): Promise<RPCResponse<restorewallet>> {
    return await this.request<restorewallet>('restorewallet', [wallet_name, backup_file, load_on_startup]);
  }

  /*
  send [{"address":amount,...},{"data":"hex"},...] ( conf_target "estimate_mode" fee_rate options )

  EXPERIMENTAL warning: this call may be changed in future releases.

  Send a transaction.

  Arguments:
  1. outputs                               (json array, required) The outputs (key-value pairs), where none of the keys are duplicated.
                                          That is, each address can only appear once and there can only be one 'data' object.
                                          For convenience, a dictionary, which holds the key-value pairs directly, is also accepted.
      [
        {                                 (json object)
          "address": amount,              (numeric or string, required) A key-value pair. The key (string) is the bitcoin address, the value (float or string) is the amount in BTC
          ...
        },
        {                                 (json object)
          "data": "hex",                  (string, required) A key-value pair. The key must be "data", the value is hex-encoded data
        },
        ...
      ]
  2. conf_target                           (numeric, optional, default=wallet -txconfirmtarget) Confirmation target in blocks
  3. estimate_mode                         (string, optional, default="unset") The fee estimate mode, must be one of (case insensitive):
                                          "unset"
                                          "economical"
                                          "conservative"
  4. fee_rate                              (numeric or string, optional, default=not set, fall back to wallet fee estimation) Specify a fee rate in sat/vB.
  5. options                               (json object, optional)
      {
        "add_inputs": bool,               (boolean, optional, default=false when "inputs" are specified, true otherwise) Automatically include coins from the wallet to cover the target amount.
                                          
        "include_unsafe": bool,           (boolean, optional, default=false) Include inputs that are not safe to spend (unconfirmed transactions from outside keys and unconfirmed replacement transactions).
                                          Warning: the resulting transaction may become invalid if one of the unsafe inputs disappears.
                                          If that happens, you will need to fund the transaction with different inputs and republish it.
        "add_to_wallet": bool,            (boolean, optional, default=true) When false, returns a serialized transaction which will not be added to the wallet or broadcast
        "change_address": "str",          (string, optional, default=automatic) The bitcoin address to receive the change
        "change_position": n,             (numeric, optional, default=random) The index of the change output
        "change_type": "str",             (string, optional, default=set by -changetype) The output type to use. Only valid if change_address is not specified. Options are "legacy", "p2sh-segwit", "bech32" and "bech32m".
        "fee_rate": amount,               (numeric or string, optional, default=not set, fall back to wallet fee estimation) Specify a fee rate in sat/vB.
        "include_watching": bool,         (boolean, optional, default=true for watch-only wallets, otherwise false) Also select inputs which are watch only.
                                          Only solvable inputs can be used. Watch-only destinations are solvable if the public key and/or output script was imported,
                                          e.g. with 'importpubkey' or 'importmulti' with the 'pubkeys' or 'desc' field.
        "inputs": [                       (json array, optional, default=[]) Specify inputs instead of adding them automatically. A JSON array of JSON objects
          "txid",                         (string, required) The transaction id
          vout,                           (numeric, required) The output number
          sequence,                       (numeric, required) The sequence number
          weight,                         (numeric, optional, default=Calculated from wallet and solving data) The maximum weight for this input, including the weight of the outpoint and sequence number. Note that signature sizes are not guaranteed to be consistent, so the maximum DER signatures size of 73 bytes should be used when considering ECDSA signatures.Remember to convert serialized sizes to weight units when necessary.
          ...
        ],
        "locktime": n,                    (numeric, optional, default=0) Raw locktime. Non-0 value also locktime-activates inputs
        "lock_unspents": bool,            (boolean, optional, default=false) Lock selected unspent outputs
        "psbt": bool,                     (boolean, optional, default=automatic) Always return a PSBT, implies add_to_wallet=false.
        "subtract_fee_from_outputs": [    (json array, optional, default=[]) Outputs to subtract the fee from, specified as integer indices.
                                          The fee will be equally deducted from the amount of each specified output.
                                          Those recipients will receive less bitcoins than you enter in their corresponding amount field.
                                          If no outputs are specified here, the sender pays the fee.
          vout_index,                     (numeric) The zero-based output index, before a change output is added.
          ...
        ],
        "conf_target": n,                 (numeric, optional, default=wallet -txconfirmtarget) Confirmation target in blocks
        "estimate_mode": "str",           (string, optional, default="unset") The fee estimate mode, must be one of (case insensitive):
                                          "unset"
                                          "economical"
                                          "conservative"
        "replaceable": bool,              (boolean, optional, default=wallet default) Marks this transaction as BIP125-replaceable.
                                          Allows this transaction to be replaced by a transaction with higher fees
        "solving_data": {                 (json object, optional) Keys and scripts needed for producing a final transaction with a dummy signature.
                                          Used for fee estimation during coin selection.
          "pubkeys": [                    (json array, optional, default=[]) Public keys involved in this transaction.
            "pubkey",                     (string) A public key
            ...
          ],
          "scripts": [                    (json array, optional, default=[]) Scripts involved in this transaction.
            "script",                     (string) A script
            ...
          ],
          "descriptors": [                (json array, optional, default=[]) Descriptors that provide solving data for this transaction.
            "descriptor",                 (string) A descriptor
            ...
          ],
        },
      }
  */
  public async send(
    outputs: Array<{
      [key: string]: string | number;
    } | { data: string }>,
    conf_target?: number,
    estimate_mode?: 'unset' | 'economical' | 'conservative',
    fee_rate?: number | string,
    options?: sendOptionsInput
  ): Promise<RPCResponse<send>> {
    return await this.request<send>('send', [outputs, conf_target, estimate_mode, fee_rate, options]);
  }

  /*
  sendall ["address",{"address":amount,...},...] ( conf_target "estimate_mode" fee_rate options )

  EXPERIMENTAL warning: this call may be changed in future releases.

  Spend the value of all (or specific) confirmed UTXOs in the wallet to one or more recipients.
  Unconfirmed inbound UTXOs and locked UTXOs will not be spent. Sendall will respect the avoid_reuse wallet flag.
  If your wallet contains many small inputs, either because it received tiny payments or as a result of accumulating change, consider using `send_max` to exclude inputs that are worth less than the fees needed to spend them.

  Arguments:
  1. recipients                       (json array, required) The sendall destinations. Each address may only appear once.
                                      Optionally some recipients can be specified with an amount to perform payments, but at least one address must appear without a specified amount.
                                      
      [
        "address",                   (string, required) A bitcoin address which receives an equal share of the unspecified amount.
        {                            (json object)
          "address": amount,         (numeric or string, required) A key-value pair. The key (string) is the bitcoin address, the value (float or string) is the amount in BTC
          ...
        },
        ...
      ]
  2. conf_target                      (numeric, optional, default=wallet -txconfirmtarget) Confirmation target in blocks
  3. estimate_mode                    (string, optional, default="unset") The fee estimate mode, must be one of (case insensitive):
                                      "unset"
                                      "economical"
                                      "conservative"
  4. fee_rate                         (numeric or string, optional, default=not set, fall back to wallet fee estimation) Specify a fee rate in sat/vB.
  5. options                          (json object, optional)
      {
        "add_to_wallet": bool,       (boolean, optional, default=true) When false, returns the serialized transaction without broadcasting or adding it to the wallet
        "fee_rate": amount,          (numeric or string, optional, default=not set, fall back to wallet fee estimation) Specify a fee rate in sat/vB.
        "include_watching": bool,    (boolean, optional, default=true for watch-only wallets, otherwise false) Also select inputs which are watch-only.
                                      Only solvable inputs can be used. Watch-only destinations are solvable if the public key and/or output script was imported,
                                      e.g. with 'importpubkey' or 'importmulti' with the 'pubkeys' or 'desc' field.
        "inputs": [                  (json array, optional, default=[]) Use exactly the specified inputs to build the transaction. Specifying inputs is incompatible with send_max.
          {                          (json object)
            "txid": "hex",           (string, required) The transaction id
            "vout": n,               (numeric, required) The output number
            "sequence": n,           (numeric, optional, default=depends on the value of the 'replaceable' and 'locktime' arguments) The sequence number
          },
          ...
        ],
        "locktime": n,               (numeric, optional, default=0) Raw locktime. Non-0 value also locktime-activates inputs
        "lock_unspents": bool,       (boolean, optional, default=false) Lock selected unspent outputs
        "psbt": bool,                (boolean, optional, default=automatic) Always return a PSBT, implies add_to_wallet=false.
        "send_max": bool,            (boolean, optional, default=false) When true, only use UTXOs that can pay for their own fees to maximize the output amount. When 'false' (default), no UTXO is left behind. send_max is incompatible with providing specific inputs.
        "conf_target": n,            (numeric, optional, default=wallet -txconfirmtarget) Confirmation target in blocks
        "estimate_mode": "str",      (string, optional, default="unset") The fee estimate mode, must be one of (case insensitive):
                                      "unset"
                                      "economical"
                                      "conservative"
        "replaceable": bool,         (boolean, optional, default=wallet default) Marks this transaction as BIP125-replaceable.
                                      Allows this transaction to be replaced by a transaction with higher fees
        "solving_data": {            (json object, optional) Keys and scripts needed for producing a final transaction with a dummy signature.
                                      Used for fee estimation during coin selection.
          "pubkeys": [               (json array, optional, default=[]) Public keys involved in this transaction.
            "pubkey",                (string) A public key
            ...
          ],
          "scripts": [               (json array, optional, default=[]) Scripts involved in this transaction.
            "script",                (string) A script
            ...
          ],
          "descriptors": [           (json array, optional, default=[]) Descriptors that provide solving data for this transaction.
            "descriptor",            (string) A descriptor
            ...
          ],
        },
      }
  */
  public async sendall(
    recipients: Array<string | { [key: string]: string | number }>,
    conf_target?: number,
    estimate_mode?: 'unset' | 'economical' | 'conservative',
    fee_rate?: number | string,
    options?: sendallOptionsInput
  ): Promise<RPCResponse<sendall>> {
    return await this.request<sendall>('sendall', [recipients, conf_target, estimate_mode, fee_rate, options]);
  }

  /*
  sendmany "" {"address":amount,...} ( minconf "comment" ["address",...] replaceable conf_target "estimate_mode" fee_rate verbose )

  Send multiple times. Amounts are double-precision floating point numbers.
  Requires wallet passphrase to be set with walletpassphrase call if wallet is encrypted.

  Arguments:
  1. dummy                     (string, required) Must be set to "" for backwards compatibility.
  2. amounts                   (json object, required) The addresses and amounts
      {
        "address": amount,    (numeric or string, required) The bitcoin address is the key, the numeric amount (can be string) in BTC is the value
        ...
      }
  3. minconf                   (numeric, optional) Ignored dummy value
  4. comment                   (string, optional) A comment
  5. subtractfeefrom           (json array, optional) The addresses.
                              The fee will be equally deducted from the amount of each selected address.
                              Those recipients will receive less bitcoins than you enter in their corresponding amount field.
                              If no addresses are specified here, the sender pays the fee.
      [
        "address",            (string) Subtract fee from this address
        ...
      ]
  6. replaceable               (boolean, optional, default=wallet default) Signal that this transaction can be replaced by a transaction (BIP 125)
  7. conf_target               (numeric, optional, default=wallet -txconfirmtarget) Confirmation target in blocks
  8. estimate_mode             (string, optional, default="unset") The fee estimate mode, must be one of (case insensitive):
                              "unset"
                              "economical"
                              "conservative"
  9. fee_rate                  (numeric or string, optional, default=not set, fall back to wallet fee estimation) Specify a fee rate in sat/vB.
  10. verbose                  (boolean, optional, default=false) If true, return extra infomration about the transaction.
  */
  public async sendmany(
    dummy: '',
    amounts:  { [key: string]: number | string },
    minconf?: number,
    comment?: string,
    subtractfeefrom?: string[],
    replaceable?: boolean,
    conf_target?: number,
    estimate_mode?: 'unset' | 'economical' | 'conservative',
    fee_rate?: number | string,
    verbose?: boolean
  ): Promise<RPCResponse<sendmany>> {
    return await this.request<sendmany>('sendmany', [dummy, amounts, minconf, comment, subtractfeefrom, replaceable, conf_target, estimate_mode, fee_rate, verbose]);
  }

  /*
  sendtoaddress "address" amount ( "comment" "comment_to" subtractfeefromamount replaceable conf_target "estimate_mode" avoid_reuse fee_rate verbose )

  Send an amount to a given address.
  Requires wallet passphrase to be set with walletpassphrase call if wallet is encrypted.

  Arguments:
  1. address                  (string, required) The bitcoin address to send to.
  2. amount                   (numeric or string, required) The amount in BTC to send. eg 0.1
  3. comment                  (string, optional) A comment used to store what the transaction is for.
                              This is not part of the transaction, just kept in your wallet.
  4. comment_to               (string, optional) A comment to store the name of the person or organization
                              to which you're sending the transaction. This is not part of the 
                              transaction, just kept in your wallet.
  5. subtractfeefromamount    (boolean, optional, default=false) The fee will be deducted from the amount being sent.
                              The recipient will receive less bitcoins than you enter in the amount field.
  6. replaceable              (boolean, optional, default=wallet default) Signal that this transaction can be replaced by a transaction (BIP 125)
  7. conf_target              (numeric, optional, default=wallet -txconfirmtarget) Confirmation target in blocks
  8. estimate_mode            (string, optional, default="unset") The fee estimate mode, must be one of (case insensitive):
                              "unset"
                              "economical"
                              "conservative"
  9. avoid_reuse              (boolean, optional, default=true) (only available if avoid_reuse wallet flag is set) Avoid spending from dirty addresses; addresses are considered
                              dirty if they have previously been used in a transaction. If true, this also activates avoidpartialspends, grouping outputs by their addresses.
  10. fee_rate                (numeric or string, optional, default=not set, fall back to wallet fee estimation) Specify a fee rate in sat/vB.
  11. verbose                 (boolean, optional, default=false) If true, return extra information about the transaction.
  */
  public async sendtoaddress(
    address: string,
    amount: number | string,
    comment?: string,
    comment_to?: string,
    subtractfeefromamount?: boolean,
    replaceable?: boolean,
    conf_target?: number,
    estimate_mode?: 'unset' | 'economical' | 'conservative',
    avoid_reuse?: boolean,
    fee_rate?: number | string,
    verbose?: boolean
  ): Promise<RPCResponse<sendtoaddress>> {
    return await this.request<sendtoaddress>('sendtoaddress', [address, amount, comment, comment_to, subtractfeefromamount, replaceable, conf_target, estimate_mode, avoid_reuse, fee_rate, verbose]);
  }

  /*
  sethdseed ( newkeypool "seed" )

  Set or generate a new HD wallet seed. Non-HD wallets will not be upgraded to being a HD wallet. Wallets that are already
  HD will have a new HD seed set so that new keys added to the keypool will be derived from this new seed.

  Note that you will need to MAKE A NEW BACKUP of your wallet after setting the HD wallet seed.
  Requires wallet passphrase to be set with walletpassphrase call if wallet is encrypted.

  Arguments:
  1. newkeypool    (boolean, optional, default=true) Whether to flush old unused addresses, including change addresses, from the keypool and regenerate it.
                  If true, the next address from getnewaddress and change address from getrawchangeaddress will be from this new seed.
                  If false, addresses (including change addresses if the wallet already had HD Chain Split enabled) from the existing
                  keypool will be used until it has been depleted.
  2. seed          (string, optional, default=random seed) The WIF private key to use as the new HD seed.
                  The seed value can be retrieved using the dumpwallet command. It is the private key marked hdseed=1
  */
  public async sethdseed(newkeypool?: boolean, seed?: string): Promise<RPCResponse<sethdseed>> {
    return await this.request<sethdseed>('sethdseed', [newkeypool, seed]);
  }

  /*
  setlabel "address" "label"

  Sets the label associated with the given address.

  Arguments:
  1. address    (string, required) The bitcoin address to be associated with a label.
  2. label      (string, required) The label to assign to the address.
  */
  public async setlabel(address: string, label: string): Promise<RPCResponse<setlabel>> {
    return await this.request<setlabel>('setlabel', [address, label]);
  }

  /*
  settxfee amount

  Set the transaction fee rate in BTC/kvB for this wallet. Overrides the global -paytxfee command line parameter.
  Can be deactivated by passing 0 as the fee. In that case automatic fee selection will be used by default.

  Arguments:
  1. amount    (numeric or string, required) The transaction fee rate in BTC/kvB
  */
  public async settxfee(amount: number | string): Promise<RPCResponse<settxfee>> {
    return await this.request<settxfee>('settxfee', [amount]);
  }

  /*
  setwalletflag "flag" ( value )

  Change the state of the given wallet flag for a wallet.

  Arguments:
  1. flag     (string, required) The name of the flag to change. Current available flags: avoid_reuse
  2. value    (boolean, optional, default=true) The new state.
  */
  public async setwalletflag(flag: 'avoid_reuse', value?: boolean): Promise<RPCResponse<setwalletflag>> {
    return await this.request<setwalletflag>('setwalletflag', [flag, value]);
  }

  /*
  signmessage "address" "message"

  Sign a message with the private key of an address
  Requires wallet passphrase to be set with walletpassphrase call if wallet is encrypted.

  Arguments:
  1. address    (string, required) The bitcoin address to use for the private key.
  2. message    (string, required) The message to create a signature of.
  */
  public async signmessage(address: string, message: string): Promise<RPCResponse<signmessage>> {
    return await this.request<signmessage>('signmessage', [address, message]);
  }

  /*
  signrawtransactionwithwallet "hexstring" ( [{"txid":"hex","vout":n,"scriptPubKey":"hex","redeemScript":"hex","witnessScript":"hex","amount":amount},...] "sighashtype" )

  Sign inputs for raw transaction (serialized, hex-encoded).
  The second optional argument (may be null) is an array of previous transaction outputs that
  this transaction depends on but may not yet be in the block chain.
  Requires wallet passphrase to be set with walletpassphrase call if wallet is encrypted.

  Arguments:
  1. hexstring                        (string, required) The transaction hex string
  2. prevtxs                          (json array, optional) The previous dependent transaction outputs
      [
        {                            (json object)
          "txid": "hex",             (string, required) The transaction id
          "vout": n,                 (numeric, required) The output number
          "scriptPubKey": "hex",     (string, required) script key
          "redeemScript": "hex",     (string) (required for P2SH) redeem script
          "witnessScript": "hex",    (string) (required for P2WSH or P2SH-P2WSH) witness script
          "amount": amount,          (numeric or string) (required for Segwit inputs) the amount spent
        },
        ...
      ]
  3. sighashtype                      (string, optional, default="DEFAULT for Taproot, ALL otherwise") The signature hash type. Must be one of
                                      "DEFAULT"
                                      "ALL"
                                      "NONE"
                                      "SINGLE"
                                      "ALL|ANYONECANPAY"
                                      "NONE|ANYONECANPAY"
                                      "SINGLE|ANYONECANPAY"
  */
  public async signrawtransactionwithwallet(
    hexstring: string,
    prevtxs?: Array<{
      txid: string,
      vout: number,
      scriptPubKey: string,
      redeemScript?: string,
      witnessScript?: string,
      amount?: number | string 
    }>,
    sighashtype?: 'DEFAULT' | 'ALL' | 'NONE' | 'SINGLE' | 'ALL|ANYONECANPAY' | 'NONE|ANYONECANPAY' | 'SINGLE|ANYONECANPAY'
  ): Promise<RPCResponse<signrawtransactionwithwallet>> {
    return await this.request<signrawtransactionwithwallet>('signrawtransactionwithwallet', [hexstring, prevtxs, sighashtype]);
  }

  /*
  simulaterawtransaction ( ["rawtx",...] {"include_watchonly":bool,...} )

  Calculate the balance change resulting in the signing and broadcasting of the given transaction(s).

  Arguments:
  1. rawtxs                            (json array, optional) An array of hex strings of raw transactions.
                                      
      [
        "rawtx",                      (string)
        ...
      ]
  2. options                           (json object, optional) Options
      {
        "include_watchonly": bool,    (boolean, optional, default=true for watch-only wallets, otherwise false) Whether to include watch-only addresses (see RPC importaddress)
        ...
      }
  */
  public async simulaterawtransaction(rawtsx?: string[], options?: { include_watchonly?: boolean }): Promise<RPCResponse<simulaterawtransaction>> {
    return await this.request<simulaterawtransaction>('simulaterawtransaction', [rawtsx, options]);
  }

  /*
  unloadwallet ( "wallet_name" load_on_startup )

  Unloads the wallet referenced by the request endpoint otherwise unloads the wallet specified in the argument.
  Specifying the wallet name on a wallet endpoint is invalid.

  Arguments:
  1. wallet_name        (string, optional, default=the wallet name from the RPC endpoint) The name of the wallet to unload. If provided both here and in the RPC endpoint, the two must be identical.
  2. load_on_startup    (boolean, optional) Save wallet name to persistent settings and load on startup. True to add wallet to startup list, false to remove, null to leave unchanged.
  */
  public async unloadwallet(wallet_name?: string, load_on_startup?: boolean): Promise<RPCResponse<unloadwallet>> {
    return await this.request<unloadwallet>('unloadwallet', [wallet_name, load_on_startup]);
  }

  /*
  upgradewallet ( version )

  Upgrade the wallet. Upgrades to the latest version if no version number is specified.
  New keys may be generated and a new wallet backup will need to be made.

  Arguments:
  1. version    (numeric, optional, default=169900) The version number to upgrade to. Default is the latest wallet version.
  */
  public async upgradewallet(version?: number): Promise<RPCResponse<upgradewallet>> {
    return await this.request<upgradewallet>('upgradewallet', [version]);
  }

  /*
  walletcreatefundedpsbt ( [{"txid":"hex","vout":n,"sequence":n,"weight":n},...] ) [{"address":amount,...},{"data":"hex"},...] ( locktime options bip32derivs )

  Creates and funds a transaction in the Partially Signed Transaction format.
  Implements the Creator and Updater roles.
  All existing inputs must either have their previous output transaction be in the wallet
  or be in the UTXO set. Solving data must be provided for non-wallet inputs.

  Arguments:
  1. inputs                             (json array, optional) Leave empty to add inputs automatically. See add_inputs option.
      [
        {                              (json object)
          "txid": "hex",               (string, required) The transaction id
          "vout": n,                   (numeric, required) The output number
          "sequence": n,               (numeric, optional, default=depends on the value of the 'locktime' and 'options.replaceable' arguments) The sequence number
          "weight": n,                 (numeric, optional, default=Calculated from wallet and solving data) The maximum weight for this input, including the weight of the outpoint and sequence number. Note that signature sizes are not guaranteed to be consistent, so the maximum DER signatures size of 73 bytes should be used when considering ECDSA signatures.Remember to convert serialized sizes to weight units when necessary.
        },
        ...
      ]
  2. outputs                            (json array, required) The outputs (key-value pairs), where none of the keys are duplicated.
                                        That is, each address can only appear once and there can only be one 'data' object.
                                        For compatibility reasons, a dictionary, which holds the key-value pairs directly, is also
                                        accepted as second parameter.
      [
        {                              (json object)
          "address": amount,           (numeric or string, required) A key-value pair. The key (string) is the bitcoin address, the value (float or string) is the amount in BTC
          ...
        },
        {                              (json object)
          "data": "hex",               (string, required) A key-value pair. The key must be "data", the value is hex-encoded data
        },
        ...
      ]
  3. locktime                           (numeric, optional, default=0) Raw locktime. Non-0 value also locktime-activates inputs
  4. options                            (json object, optional)
      {
        "add_inputs": bool,            (boolean, optional, default=false when "inputs" are specified, true otherwise) Automatically include coins from the wallet to cover the target amount.
                                        
        "include_unsafe": bool,        (boolean, optional, default=false) Include inputs that are not safe to spend (unconfirmed transactions from outside keys and unconfirmed replacement transactions).
                                        Warning: the resulting transaction may become invalid if one of the unsafe inputs disappears.
                                        If that happens, you will need to fund the transaction with different inputs and republish it.
        "changeAddress": "str",        (string, optional, default=automatic) The bitcoin address to receive the change
        "changePosition": n,           (numeric, optional, default=random) The index of the change output
        "change_type": "str",          (string, optional, default=set by -changetype) The output type to use. Only valid if changeAddress is not specified. Options are "legacy", "p2sh-segwit", "bech32", and "bech32m".
        "includeWatching": bool,       (boolean, optional, default=true for watch-only wallets, otherwise false) Also select inputs which are watch only
        "lockUnspents": bool,          (boolean, optional, default=false) Lock selected unspent outputs
        "fee_rate": amount,            (numeric or string, optional, default=not set, fall back to wallet fee estimation) Specify a fee rate in sat/vB.
        "feeRate": amount,             (numeric or string, optional, default=not set, fall back to wallet fee estimation) Specify a fee rate in BTC/kvB.
        "subtractFeeFromOutputs": [    (json array, optional, default=[]) The outputs to subtract the fee from.
                                        The fee will be equally deducted from the amount of each specified output.
                                        Those recipients will receive less bitcoins than you enter in their corresponding amount field.
                                        If no outputs are specified here, the sender pays the fee.
          vout_index,                  (numeric) The zero-based output index, before a change output is added.
          ...
        ],
        "conf_target": n,              (numeric, optional, default=wallet -txconfirmtarget) Confirmation target in blocks
        "estimate_mode": "str",        (string, optional, default="unset") The fee estimate mode, must be one of (case insensitive):
                                        "unset"
                                        "economical"
                                        "conservative"
        "replaceable": bool,           (boolean, optional, default=wallet default) Marks this transaction as BIP125-replaceable.
                                        Allows this transaction to be replaced by a transaction with higher fees
        "solving_data": {              (json object, optional) Keys and scripts needed for producing a final transaction with a dummy signature.
                                        Used for fee estimation during coin selection.
          "pubkeys": [                 (json array, optional, default=[]) Public keys involved in this transaction.
            "pubkey",                  (string) A public key
            ...
          ],
          "scripts": [                 (json array, optional, default=[]) Scripts involved in this transaction.
            "script",                  (string) A script
            ...
          ],
          "descriptors": [             (json array, optional, default=[]) Descriptors that provide solving data for this transaction.
            "descriptor",              (string) A descriptor
            ...
          ],
        },
      }
  5. bip32derivs                        (boolean, optional, default=true) Include BIP 32 derivation paths for public keys if we know them
  */
  public async walletcreatefundedpsbt(
    inputs: Array<{
      txid: string;
      vout: number;
      sequence?: number;
      weight?: number;
    }>,
    outputs: Array<{
      [key: string]: string | number;
    } | { data: string }>,
    locktime?: number,
    options?: walletcreatefundedpsbtOptionsInput,
    bip32derivs?: boolean
  ): Promise<RPCResponse<walletcreatefundedpsbt>> {
    return await this.request<walletcreatefundedpsbt>('walletcreatefundedpsbt', [inputs, outputs, locktime, options, bip32derivs]);
  }

  /*
  walletdisplayaddress "address"

  Display address on an external signer for verification.
  */
  public async walletdisplayaddress(address: string): Promise<RPCResponse<walletdisplayaddress>> {
    return await this.request<walletdisplayaddress>('walletdisplayaddress', [address]);
  }

  /*
  walletlock

  Removes the wallet encryption key from memory, locking the wallet.
  After calling this method, you will need to call walletpassphrase again
  before being able to call any methods which require the wallet to be unlocked.
  */
  public async walletlock(): Promise<RPCResponse<walletlock>> {
    return await this.request<walletlock>('walletlock');
  }

  /*
  walletpassphrase "passphrase" timeout

  Stores the wallet decryption key in memory for 'timeout' seconds.
  This is needed prior to performing transactions related to private keys such as sending bitcoins

  Note:
  Issuing the walletpassphrase command while the wallet is already unlocked will set a new unlock
  time that overrides the old one.

  Arguments:
  1. passphrase    (string, required) The wallet passphrase
  2. timeout       (numeric, required) The time to keep the decryption key in seconds; capped at 100000000 (~3 years).
  */
  public async walletpassphrase(passphrase: string, timeout: number): Promise<RPCResponse<walletpassphrase>> {
    return await this.request<walletpassphrase>('walletpassphrase', [passphrase, timeout]);
  }

  /*
  walletpassphrasechange "oldpassphrase" "newpassphrase"

  Changes the wallet passphrase from 'oldpassphrase' to 'newpassphrase'.

  Arguments:
  1. oldpassphrase    (string, required) The current passphrase
  2. newpassphrase    (string, required) The new passphrase
  */
  public async walletpassphrasechange(oldpassphrase: string, newpassphrase: string): Promise<RPCResponse<walletpassphrasechange>> {
    return await this.request<walletpassphrasechange>('walletpassphrasechange', [oldpassphrase, newpassphrase]);
  }

  /*
  walletprocesspsbt "psbt" ( sign "sighashtype" bip32derivs finalize )

  Update a PSBT with input information from our wallet and then sign inputs
  that we can sign for.
  Requires wallet passphrase to be set with walletpassphrase call if wallet is encrypted.

  Arguments:
  1. psbt           (string, required) The transaction base64 string
  2. sign           (boolean, optional, default=true) Also sign the transaction when updating (requires wallet to be unlocked)
  3. sighashtype    (string, optional, default="DEFAULT for Taproot, ALL otherwise") The signature hash type to sign with if not specified by the PSBT. Must be one of
                    "DEFAULT"
                    "ALL"
                    "NONE"
                    "SINGLE"
                    "ALL|ANYONECANPAY"
                    "NONE|ANYONECANPAY"
                    "SINGLE|ANYONECANPAY"
  4. bip32derivs    (boolean, optional, default=true) Include BIP 32 derivation paths for public keys if we know them
  5. finalize       (boolean, optional, default=true) Also finalize inputs if possible
  */
  public async walletprocesspsbt(
    psbt: string,
    sign?: boolean,
    sighashtype?: 'DEFAULT' | 'ALL' | 'NONE' | 'SINGLE' | 'ALL|ANYONECANPAY' | 'NONE|ANYONECANPAY' | 'SINGLE|ANYONECANPAY',
    bip32derivs?: boolean,
    finalize?: boolean
  ): Promise<RPCResponse<walletprocesspsbt>> {
    return await this.request<walletprocesspsbt>('walletprocesspsbt', [psbt, sign, sighashtype, bip32derivs, finalize]);
  }

  // ZMQ RPC

  /*
  getzmqnotifications

  Returns information about the active ZeroMQ notifications.
  */
  public async getzmqnotifications(): Promise<RPCResponse<getzmqnotifications>> {
    return await this.request<getzmqnotifications>('getzmqnotifications');
  }
}

