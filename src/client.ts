import { randomUUID } from 'crypto';
import { 
  getbestblockhash, 
  getblock,
  getblockchaininfo,
  getblockcount,
  getblockfilter,
  getblockhash,
  getblockstats
} from './rpc/blockchain.js';

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
        params
      })
    })

    return await request.json() as RPCResponse<T>;
  }

  // Returns the hash of the best (tip) block in the most-work fully-validated chain.
  public async getbestblockhash(): Promise<RPCResponse<getbestblockhash>> {
    return await this.request<getbestblockhash>('getbestblockhash');
  }

  // @todo represent the version here / getrawtx
  // If verbosity is 0, returns a string that is serialized, hex-encoded data for block ‘hash’.
  // If verbosity is 1, returns an Object with information about block ‘hash’.
  // If verbosity is 2, returns an Object with information about block ‘hash’ and information about each transaction.
  public async getblock(blockhash: string, verbosity: number = 0): Promise<RPCResponse<getblock>> {
    return await this.request('getblock', [blockhash, verbosity]);
  }

  // Returns an object containing various state info regarding blockchain processing.
  public async getblockchaininfo(): Promise<RPCResponse<getblockchaininfo>> {
    return await this.request('getblockchaininfo');
  }

  // Returns the height of the most-work fully-validated chain.
  // The genesis block has height 0.
  public async getblockcount(): Promise<RPCResponse<getblockcount>> {
    return await this.request('getblockcount');
  }

  // Retrieve a BIP 157 content filter for a particular block.
  public async getblockfilter(blockhash: string, filtertype: string = 'basic'): Promise<RPCResponse<getblockfilter>> {
    return await this.request('getblockfilter', [blockhash, filtertype]);
  }

  public async getblockhash(height: number): Promise<RPCResponse<getblockhash>> {
    return await this.request('getblockhash', [height]);
  }

  // @todo cana the response know about keys to expect from stats option?
  public async getblockstats(blockhash: string, stats?: (keyof getblockstats)[]): Promise<RPCResponse<getblockstats>> {
    return await this.request('getblockstats', [blockhash, stats]);
  }
}
