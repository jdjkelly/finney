export type getmemoryinfo = string | {
  // Information about locked memory manager
  locked: {
    // Number of bytes used
    used: number;
    // Number of bytes available in current arenas
    free: number;
    // Total number of bytes managed
    total: number;
    // Amount of bytes that succeeded locking. If this number is smaller than total, locking pages failed at some point and key data could be swapped to disk.
    locked: number;
    // Number allocated chunks
    chunks_used: number;
    // Number unused chunks
    chunks_free: number;
  }
}

export interface getrpcinfo {
  // All active commands
  active_commands: Array<{
    // The name of the RPC command
    method: string;
    // The running time in microseconds
    duration: number;
  }>;
  // The complete file path to the debug log
  logpath: string;
}

export type help = string;

export type loggingcategory = 'addrman' | 'bench' | 'blockstorage' | 'cmpctblock' | 'coindb' | 'estimatefee' | 'http' | 'i2p' | 'ipc' | 'leveldb' | 'libevent' | 'mempool' | 'mempoolrej' | 'net' | 'proxy' | 'prune' | 'qt' | 'rand' | 'reindex' | 'rpc' | 'selectcoins' | 'tor' | 'util' | 'validation' | 'walletdb' | 'zmq';

export interface logging {
  [key: string]: boolean;
}

export type stop = string;

export type uptime = number;