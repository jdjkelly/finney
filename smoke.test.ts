import Sats from './src/client.js';
import { expect, it } from 'bun:test';

it('instantiates a new Sats client', () => {
  const sats = new Sats();
  expect(sats).not.toBeUndefined();
});