import { FC, useContext } from "hono/jsx";
import BitcoinContext from "../context/bitcoin";
import { formatBytes } from "../utils";
import { GetBlockchainInfo } from "@finney/rpc";

export const BlockchainInfo: FC<{ info?: GetBlockchainInfo }> = ({ info }) => {
  return (
    <table>
      <caption>Blockchain Info</caption>
      <thead>
        <th>Chain</th>
        <th>Blocks</th>
        <th>Best blockhash</th>
        <th>Difficulty</th>
        <th>Time</th>
        <th>Chainwork</th>
        <th>Disk size</th>
        <th>Pruned</th>
      </thead>
      <tbody>
        {!info ? (
          <tr>
            <td>loading...</td>
          </tr>
        ) : (
          <tr>
            <td>{info.chain}</td>
            <td>
              {info.blocks} / {info.headers} /{" "}
              {info.verificationprogress.toLocaleString("en", {
                style: "percent",
              })}
            </td>
            <td>{info.bestblockhash}</td>
            <td>{parseInt(info.difficulty).toPrecision(4)}</td>
            <td>{new Date(info.time * 1000).toLocaleString()}</td>
            <td>{parseInt(info.chainwork, 16).toPrecision(4)}</td>
            <td>{formatBytes(info.size_on_disk)}</td>
            <td>{info.pruned.toString()}</td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export const BlockchainInfoWithData: FC = async () => {
  const bitcoinRPC = useContext(BitcoinContext);
  const { result, error } = await bitcoinRPC.getblockchaininfo();

  return <BlockchainInfo info={result!} />;
};
