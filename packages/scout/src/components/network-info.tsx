import { FC, useContext } from "hono/jsx";
import BitcoinContext from "../context/bitcoin";

export const NetworkInfo: FC = async () => {
  const bitcoinRPC = useContext(BitcoinContext);
  const { result, error } = await bitcoinRPC.getnetworkinfo();

  return (
    <table>
      <caption>Network Info</caption>
      <thead>
        <th>Version</th>
        <th>Subversion</th>
        <th>Protocol</th>
        <th>Connections</th>
        <th>Networks</th>
        <th>Relay fee</th>
        <th>Local services</th>
        <th>Time offset</th>
        <th>Active</th>
      </thead>
      <tbody>
        <tr>
          <td>{result.version}</td>
          <td>{result.subversion}</td>
          <td>{result.protocolversion}</td>
          <td>
            {result.connections} (↧{result.connections_in} / ↥
            {result.connections_out})
          </td>
          <td>{result.networks.map((network) => network.name).join(", ")}</td>
          <td>₿{result.relayfee}</td>
          <td>{result.localservicesnames.join(", ")}</td>
          <td>{result.timeoffset}</td>
          <td>{result.networkactive ? "⊨" : "⊭"}</td>
        </tr>
      </tbody>
    </table>
  );
};
