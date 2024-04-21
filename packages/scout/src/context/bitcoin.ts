import BitcoinRPC from "@finney/rpc";
import { createContext } from "hono/jsx";

export const bitcoinRPC = new BitcoinRPC({
  authenticated: false,
  host: process.env.BTCRPC_HOST,
  protocol: "https"
});

export const BitcoinContext = createContext(bitcoinRPC);

export default BitcoinContext;
