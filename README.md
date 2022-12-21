# sats

A dependency-free TypeScript client for Bitcoin Core's JSON-RPC.

* Targets 100% coverage of the JSON-RPC
* Exports types for each RPC response
* Dependency-free (aside from development dependencies)
* Targets the Bun runtime first

## Usage

Copy `.env.template` to `.env` and replace the values with those for your node. Otherwise, set them in the environment.

Then, import 
```
import Sats from 'client.js';

const sats = new Sats();
```

## Coverage
- [ ] Blockchain RPCs
  - [x] getbestblockhash
  - [o] getblock
  - [x] getblockchaininfo
  - [x] getblockcount
  - [x] getblockfilter
  - [x] getblockfrompeer
  - [x] getblockhash
  - [x] getblockheader
  - [x] getblockstats
  - [x] getchaintips
  - [x] getchaintxstats
  - [x] getdeploymentinfo
  - [x] getdifficulty
  - [x] getmempoolancestors
  - [x] getmempooldescendants
  - [x] getmempoolentry
  - [x] getmempoolinfo
  - [x] getrawmempool
  - [x] gettxout
  - [x] gettxoutproof
  - [x] gettxoutsetinfo
  - [x] preciousblock
  - [x] pruneblockchain
  - [x] savemempool
  - [x] scantxoutset
  - [x] verifychain
  - [x] verifytxoutproof
- [x] Control RPCs
  - [x] getmemoryinfo
  - [x] getrpcinfo
  - [x] help
  - [x] logging
  - [x] stop
  - [x] uptime
- [ ] Mining RPCs
  - [ ] getblocktemplate
  - [ ] getmininginfo
  - [ ] getnetworkhashps
  - [ ] prioritisetransaction
  - [ ] submitblock
  - [ ] submitheader
- [ ] Network RPCs
  - [ ] addnode
  - [ ] clearbanned
  - [ ] disconnectnode
  - [ ] getaddednodeinfo
  - [ ] getconnectioncount
  - [ ] getnettotals
  - [ ] getnetworkinfo
  - [ ] getnodeaddresses
  - [ ] getpeerinfo
  - [ ] listbanned
  - [ ] ping
  - [ ] setban
  - [ ] setnetworkactive
- [ ] Rawtransactions RPCs
  - [ ] analyzepsbt
  - [ ] combinepsbt
  - [ ] combinerawtransaction
  - [ ] converttopsbt
  - [ ] createpsbt
  - [ ] createrawtransaction
  - [ ] decodepsbt
  - [ ] decoderawtransaction
  - [ ] decodescript
  - [ ] finalizepsbt
  - [ ] fundrawtransaction
  - [ ] getrawtransaction
  - [ ] joinpsbts
  - [ ] sendrawtransaction
  - [ ] signrawtransactionwithkey
  - [ ] testmempoolaccept
  - [ ] utxoupdatepsbt
- [ ] Signer RPCs
  - [ ] enumeratesigners
- [ ] Util RPCs
- [ ] Wallet RPCs