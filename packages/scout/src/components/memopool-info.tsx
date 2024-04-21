import { FC, useContext } from "hono/jsx";
import BitcoinContext from "../context/bitcoin";
import { formatBytes } from "../utils";

export const MempoolInfo: FC = async () => {
  const bitcoinRPC = useContext(BitcoinContext);
  const { result, error } = await bitcoinRPC.getmempoolinfo();

  return (
    <table>
      <caption>Mempool Info</caption>
      <thead>
        <th>Loaded</th>
        <th>Size</th>
        <th>Bytes</th>
        <th>Usage</th>
        <th>Total Fee</th>
        <th>Max mempool</th>
        <th>Mempool minfee</th>
        <th>Min relay fee</th>
        <th>Incremental relay fee</th>
        <th>Unbroadcast count</th>
        <th>Full RBF</th>
      </thead>
      <tbody>
        <tr>
          <td>{result.loaded ? "⊨" : "⊭"}</td>
          <td>{result.size}</td>
          <td>{formatBytes(result.bytes)}</td>
          <td>{formatBytes(result.usage)}</td>
          <td>₿{result.total_fee}</td>
          <td>{formatBytes(result.maxmempool)}</td>
          <td>₿{result.mempoolminfee}</td>
          <td>₿{result.minrelaytxfee}</td>
          <td>₿{result.incrementalrelayfee}</td>
          <td>{result.unbroadcastcount}</td>
          <td>{result.fullrbf ? "⊨" : "⊭"}</td>
        </tr>
      </tbody>
    </table>
  );
};
