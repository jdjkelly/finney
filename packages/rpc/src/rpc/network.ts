export type AddNode = null;

export type ClearBanned = null;

export type DisconnectNode = null;

export type GetAddedNodeInfo = {
  // The node IP address or name (as provided to addnode)
  addednode: string;
  // If connected
  connected: boolean;
  // Only when connected = true
  addresses?: [{
    // The bitcoin server IP and port we're connected to
    address: string;
    // connection, inbound or outbound
    connected: 'inbound' | 'outbound';
  }]
}[];

export type GetConnectionCount = number;

export interface GetNetTotals {
  // Total bytes received
  totalbytesrecv: number;
  // Total bytes sent
  totalbytessent: number;
  // Current UNIX epoch time in milliseconds
  timemillis: number;
  uploadtarget: {
    // Length of the measuring timeframe in seconds
    timeframe: number;
    // Target in bytes
    target: number;
    // True if target is reached
    target_reached: boolean;
    // True if serving historical blocks
    serve_historical_blocks: boolean;
    // Bytes left in current time cycle
    bytes_left_in_cycle: number;
    // Seconds left in current time cycle
    time_left_in_cycle: number;
  }
}

export interface GetNetworkInfo {
  // the server version
  version: number;
  // the server subversion string
  subversion: string;
  // the protocol version
  protocolversion: number;
  // the services we offer to the network
  localservices: string;
  // the services we offer to the network, in human-readable form
  localservicesnames: string[];
  // true if transaction relay is requested from peers
  localrelay: boolean;
  // the time offset
  timeoffset: number;
  // the total number of connections
  connections: number;
  // the number of inbound connections
  connections_in: number;
  // the number of outbound connections
  connections_out: number;
  // whether p2p networking is enabled
  networkactive: boolean;
  // information per network
  networks: Array<{
    // network (ipv4, ipv6, onion, i2p, cjdns)
    name: 'ipv4' | 'ipv6' | 'onion' | 'i2p' | 'cjdns';
    // is the network limited using -onlynet?
    limited: boolean;
    // is the network reachable?
    reachable: boolean;
    // ("host:port") the proxy that is used for this network, or empty if none
    proxy: string;
    // Whether randomized credentials are used
    proxy_randomize_credentials: boolean;
  }>;
  // minimum relay fee rate for transactions in BTC/kvB
  relayfee: number;
  // minimum fee rate increment for mempool limiting or replacement in BTC/kvB
  incrementalfee: number;
  // list of local addresses
  localaddresses: Array<{
    // network address
    address: string;
    // network port
    port: number;
    // relative score
    score: number;
  }>;
  // any network and blockchain warnings
  warnings: string;
}

export type GetNodeAddresses = Array<{
  // The UNIX epoch time when the node was last seen
  time: number;
  // The services offered by the node
  services: string;
  // The address of the node
  address: string;
  // The port number of the node
  port: number;
  // The network (ipv4, ipv6, onion, i2p, cjdns) the node connected through
  network: 'ipv4' | 'ipv6' | 'onion' | 'i2p' | 'cjdns';
}>

export type GetPeerInfo = {
  // Peer index
  id: number;
  // (host:port) The IP address and port of the peer
  addr: string;
  // (ip:port) Bind address of the connection to the peer
  addrbind?: string;
  // (ip:port) Local address as reported by the peer
  addrlocal?: string;
  // Network (ipv4, ipv6, onion, i2p, cjdns, not_publicly_routable)
  network: 'ipv4' | 'ipv6' | 'onion' | 'i2p' | 'cjdns' | 'not_publicly_routable';
  // The AS in the BGP route to the peer used for diversifying peer selection (only available if the asmap config flag is set)
  mapped_as?: number;
  // The services offered
  services: string;
  // the services offered, in human-readable form
  servicesnames: string[];
  // Whether peer has asked us to relay transactions to it
  relaytxes: boolean;
  // The UNIX epoch time of the last send
  lastsend: number;
  // The UNIX epoch time of the last receive
  lastrecv: number;
  // The UNIX epochh time of the last valid transaction received from this peer
  last_transaction: number;
  // The UNIX epoch time of the last block received from this peer
  last_block: number;
  // The total bytes sent
  bytessent: number;
  // The total bytes received
  bytesrecv: number;
  // The UNIX epoch time of the connection
  conntime: number;
  // The time offset in seconds
  timeoffset: number;
  // ping time (if available)
  pingtime?: number;
  // minimum observed ping time (if any at all)
  minping?: number;
  // ping wait (if non-zero)
  pingwait?: number;
  // The peer version, such as 70001
  version: number;
  // The string version
  subver: string;
  // Inbound (true) or Outbound (false)
  inbound: boolean;
  // Whether we selected peer as (compact blocks) high-bandwidth peer
  bip152_hb_to: boolean;
  // Whether peer selected us as (compact blocks) high-bandwidth peer
  bip152_hb_from: boolean;
  // The starting height (block) of the peer
  startingheight: number;
  // The current height of header pre-synchronization with this peer, or -1 if no low-work sync is in progress
  presynced_headers: number;
  // The last header we have in common with this peer
  synced_headers: number;
  // The last block we have in common with this peer
  synced_blocks: number;
  // The heights of blocks we're currently asking from this peer
  inflight: number[];
  // Whether we participate in address relay with this peer
  addr_relay_enabled: boolean;
  // The total number of addresses processed, excluding those dropped due to rate limiting
  addr_processed?: number;
  // The total number of addresses dropped due to rate limiting
  addr_rate_limited?: number;
  // Any special permissions that have been granted to this peer
  permissions: ('bloomfilter' | 'noban' | 'forcerelay' | 'relay' | 'relay' | 'mempool' | 'download' | 'addr')[];
  // The minimum fee rate for transactions this peer accepts
  minfeefilter?: number;
  // The total bytes sent aggregated by message type
  bytessent_per_msg: {
    [key: string]: number;
  },
  // The total bytes received aggregated by message type
  bytesrecv_per_msg: {
    [key: string]: number;
  }
  // Type of connection
  connection_type: 'outbound-full-relay' | 'block-relay-only' | 'inbound' | 'manual' | 'feeler' | 'addr-fetch';
}[]

export type ListBanned = Array<{
  // The IP/Subnet of the banned node
  address: string;
  // The UNIX epoch time the ban was created
  banned_created: number;
  // The UNIX epoch time the ban expires
  banned_until: number;
  // The ban duration, in seconds
  ban_duration: number;
  // The time remaining until the ban expires, in seconds
  time_remaining: number;
}>

export type Ping = null;

export type SetBan = null;

export type SetNetworkActive = boolean;