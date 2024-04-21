import { FC, useContext } from "hono/jsx";
import { Suspense } from "hono/jsx/streaming";
import BitcoinContext from "../../context/bitcoin";
import { GetRawTransaction } from "@finney/rpc/src/rpc/rawtransactions";

const Block: FC<{ hash: string }> = async ({ hash }) => {
  const bitcoinRPC = useContext(BitcoinContext);
  const { result: block } = await bitcoinRPC.getblock({
    blockhash: hash,
    verbosity: 2
  });

  return (
    <ul>
    {block?.tx.map((tx: GetRawTransaction) => (
      <li key={tx.txid}>{tx.txid} ({tx.vsize})
      </li>
    ))}
    </ul>
  );
};


export default ({ hash }: { hash: string}) => {
  return (
    <Block hash={hash}/>
  );
};