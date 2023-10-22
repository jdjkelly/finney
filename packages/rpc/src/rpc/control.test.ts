import BitcoinRPC from '../client';
import { expect, it, describe, mock, afterAll, afterEach } from 'bun:test';

const bitcoinRPC = new BitcoinRPC();

const originalFetch = global.fetch;

afterEach(() => { 
  global.fetch = originalFetch  
});

describe('getmemoryinfo', () => {
  it('returns memory info', async () => {
    global.fetch = mock(() => {
      return Promise.resolve({
        json: () => Promise.resolve({
          result: {
            locked: {
              used: 0,
              free: 0,
              total: 0,
              locked: 0,
              chunks_used: 0,
              chunks_free: 0
            }
          }
        })
      }) as unknown as Promise<Response>;
    });

    const memoryInfo = await bitcoinRPC.getmemoryinfo();

    expect(memoryInfo.result).not.toBeUndefined();
    expect(typeof(memoryInfo.result) === 'object').toBe(true);
  });
});

describe('uptime', () => {
  it('returns an uptime', async () => {
    global.fetch = mock(() => {
      return Promise.resolve({
        json: () => Promise.resolve({
          result: 1
        })
      }) as unknown as Promise<Response>;
    });

    const uptime = await bitcoinRPC.uptime();

    expect(uptime.result).toBeGreaterThan(0);
  });
});

describe('help', () => {
  it('returns a help message for all commands', async () => {
    global.fetch = mock(() => {
      return Promise.resolve({
        json: () => Promise.resolve({
          result: `== Blockchain ==
          getbestblockhash
          getblock "blockhash" ( verbosity )
          getblockchaininfo
          getblockcount`
        })
      }) as unknown as Promise<Response>;
    });

    const help = await bitcoinRPC.help();

    expect(help.result).not.toBeUndefined();
  });

  it('returns a help message for an individual command', async () => {
    global.fetch = mock(() => {
      return Promise.resolve({
        json: () => Promise.resolve({
          result: `help ( "command" )

          List all commands, or get help for a specified command.
          
          Arguments:
          1. command    (string, optional, default=all commands) The command to get help on
          
          Result:
          "str"    (string) The help text`
        })
      }) as unknown as Promise<Response>;
    });

    const help = await bitcoinRPC.help({ command: 'help' });

    expect(help.result?.slice(0, 18)).toBe('help ( "command" )');
  });
});