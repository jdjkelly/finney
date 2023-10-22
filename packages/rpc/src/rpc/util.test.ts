import BitcoinRPC from '../client';
import { expect, it, describe, afterEach, mock } from 'bun:test';

const bitcoinRPC = new BitcoinRPC();

const originalFetch = global.fetch;

afterEach(() => { 
  global.fetch = originalFetch  
});

describe('getdescriptorinfo', () => {
  it('analyzes a descriptor', async () => {
    global.fetch = mock(() => {
      return Promise.resolve({
        json: () => Promise.resolve({
          result: {
            descriptor: "wsh(multi(1,xpub661MyMwAqRbcFW31YEwpkMuc5THy2PSt5bDMsktWQcFF8syAmRUapSCGu8ED9W6oDMSgv6Zz8idoc4a6mr8BDzTJY47LJhkJ8UB7WEGuduB/1/0/*,xpub69H7F5d8KSRgmmdJg2KhpAK8SR3DjMwAdkxj3ZuxV27CprR9LgpeyGmXUbC6wb7ERfvrnKZjXoUmmDznezpbZb7ap6r1D3tgFxHmwMkQTPH/0/0/*))#t2zpj2eu",
            checksum: "t2zpj2eu",
            isrange: true,
            issolvable: true,
            hasprivatekeys: false
          }
        })
      }) as unknown as Promise<Response>;
    });

    const descriptorInfo = await bitcoinRPC.getdescriptorinfo({ descriptor: 'wsh(multi(1,xpub661MyMwAqRbcFW31YEwpkMuc5THy2PSt5bDMsktWQcFF8syAmRUapSCGu8ED9W6oDMSgv6Zz8idoc4a6mr8BDzTJY47LJhkJ8UB7WEGuduB/1/0/*,xpub69H7F5d8KSRgmmdJg2KhpAK8SR3DjMwAdkxj3ZuxV27CprR9LgpeyGmXUbC6wb7ERfvrnKZjXoUmmDznezpbZb7ap6r1D3tgFxHmwMkQTPH/0/0/*))' });
    
    expect(descriptorInfo.result).not.toBeUndefined();
    expect(descriptorInfo.result?.isrange).toBe(true);
    expect(descriptorInfo.result?.issolvable).toBe(true);
    expect(descriptorInfo.result?.hasprivatekeys).toBe(false);
  });
});

describe('validateaddress', () => {
  it('returns address validation information', async () => {
    global.fetch = mock(() => {
      return Promise.resolve({
        json: () => Promise.resolve({
          result: {
            isvalid: true,
            address: "bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq",
            scriptPubKey: "0014e8df018c7e326cc253faac7e46cdc51e68542c42",
            isscript: false,
            iswitness: true,
            witness_version: 0,
            witness_program: "e8df018c7e326cc253faac7e46cdc51e68542c42"
          }
        })
      }) as unknown as Promise<Response>;
    });

    const validateAddress = await bitcoinRPC.validateaddress({ address: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq' });

    expect(validateAddress.result).not.toBeUndefined();
    expect(validateAddress.result?.isvalid).toBe(true);
  });
});