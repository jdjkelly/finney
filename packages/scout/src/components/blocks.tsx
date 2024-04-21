import BitcoinRPC, { GetBlockVerbosity1 } from "@finney/rpc";
import { FC, useContext } from "hono/jsx";
import BitcoinContext from "../context/bitcoin";

async function fetchBlocksSequentially(
  initialBlockhash: string,
  bitcoinRPC: BitcoinRPC,
) {
  let blockhash = initialBlockhash;
  const blocks = [];

  for (let i = 0; i < 15; i++) {
    try {
      const { result, error } = await bitcoinRPC.getblock({ blockhash });
      if (error) {
        console.error("Error fetching block:", error);
        break; // Exit the loop in case of error
      }
      blockhash = result.previousblockhash!; // Assuming result is never null when error is null
      blocks.push(result);
    } catch (error) {
      console.error("Unexpected error fetching block:", error);
      break; // Exit the loop in case of unexpected error
    }
  }

  return blocks;
}

const formatBytes = (b: number) => {
  const i = ~~(Math.log2(b) / 10);
  return (b / Math.pow(1024, i)).toFixed(2) + ("KMGTPEZY"[i - 1] || "") + "B";
};

export const Blocks: FC<{ blocks?: GetBlockVerbosity1[] }> = ({ blocks }) => {
  return (
    <table>
      <caption>Recent blocks</caption>
      <thead>
        <tr>
          <th>Hash</th>
          <th>Height</th>
          <th>Weight</th>
          <th>Difficulty</th>
          <th>Time</th>
          <th>nTx</th>
          <th>Size</th>
        </tr>
      </thead>
      <tbody>
        {!blocks ? (
          <tr>
            <td>loading...</td>
          </tr>
        ) : (
          blocks?.map((block) => {
            return (
              <tr>
                <td>{block?.hash}</td>
                <td>
                  {block?.height} / {block?.confirmations}
                </td>
                <td>{block?.weight}</td>
                <td>{parseInt(block?.difficulty).toPrecision(4)}</td>
                <td>{new Date(block?.time * 1000).toLocaleString()}</td>
                <td>{block?.nTx}</td>
                <td>{formatBytes(block?.size!)}</td>
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  );
};

export const BlocksWithData: FC = async () => {
  const bitcoinRPC = useContext(BitcoinContext);
  const { result: bestblockhash } = await bitcoinRPC.getbestblockhash();

  const blocks = await fetchBlocksSequentially(bestblockhash!, bitcoinRPC);

  return <Blocks blocks={blocks} />;
};
