import Sats from '../client.js';
import { expect, it, describe } from 'bun:test';

const sats = new Sats();

describe('getwalletinfo', () => {
  it('returns an error because no wallet is loaded', async () => {
    const info = await sats.getwalletinfo();
    expect(info.error?.message).toBe('No wallet is loaded. Load a wallet using loadwallet or create a new one with createwallet. (Note: A default wallet is no longer automatically created)');
  });
});