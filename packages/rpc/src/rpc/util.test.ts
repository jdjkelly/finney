import BitcoinRPC from '../client.js';
import { expect, it, describe } from 'bun:test';

const bitcoinRPC = new BitcoinRPC();

describe('getdescriptorinfo', () => {
  it('analyzes a descriptor', async () => {
    const descriptorInfo = await bitcoinRPC.getdescriptorinfo({ descriptor: 'wsh(multi(1,xpub661MyMwAqRbcFW31YEwpkMuc5THy2PSt5bDMsktWQcFF8syAmRUapSCGu8ED9W6oDMSgv6Zz8idoc4a6mr8BDzTJY47LJhkJ8UB7WEGuduB/1/0/*,xpub69H7F5d8KSRgmmdJg2KhpAK8SR3DjMwAdkxj3ZuxV27CprR9LgpeyGmXUbC6wb7ERfvrnKZjXoUmmDznezpbZb7ap6r1D3tgFxHmwMkQTPH/0/0/*))' });
    expect(descriptorInfo.result).not.toBeUndefined();
    expect(descriptorInfo.result?.isrange).toBe(true);
    expect(descriptorInfo.result?.issolvable).toBe(true);
    expect(descriptorInfo.result?.hasprivatekeys).toBe(false);
  });
});

describe('validateaddress', () => {
  it('returns address validation information', async () => {
    const validateAddress = await bitcoinRPC.validateaddress({ address: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq' });
    expect(validateAddress.result).not.toBeUndefined();
    expect(validateAddress.result?.isvalid).toBe(true);
  });
});