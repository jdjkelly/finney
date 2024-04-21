import { FC, useContext } from "hono/jsx";
import BitcoinContext from "../context/bitcoin";
import { GetBlockStats } from "@finney/rpc";

export const GetblockStats: FC<{ blockstats?: GetBlockStats }> = async ({
  blockstats,
}) => {
  return (
    <table>
      <caption>Best Block Stats</caption>
      <thead>
        <th>Feerate %</th>
        <th>Max feerate</th>
        <th>Min feerate</th>
        <th>Max fee</th>
        <th>Subsidy</th>
        <th>Total Fee</th>
        <th>Avg tx size</th>
        <th>Ins</th>
        <th>Outs</th>
      </thead>
      <tbody>
        {!blockstats ? (
          <tr>
            <td>loading...</td>
          </tr>
        ) : (
          <tr>
            <td>
              {blockstats.feerate_percentiles
                ?.map((rate, index) => {
                  const percentiles = [null, "¼", "½", "¾", null];
                  if (percentiles[index] === null) return null;
                  return (
                    <>
                      {percentiles[index]} {rate}
                    </>
                  );
                })
                .filter((rate) => rate)
                .join(", ")}{" "}
              sats/vB
            </td>
            <td>{blockstats.maxfeerate} sats/vB</td>
            <td>{blockstats.minfeerate} sats/vB</td>
            <td>
              ₿
              {blockstats.maxfee
                ? blockstats.maxfee / 100000000
                : blockstats.maxfee}
            </td>
            <td>
              ₿
              {blockstats.subsidy
                ? blockstats.subsidy / 100000000
                : blockstats.subsidy}
            </td>
            <td>
              ₿
              {blockstats.totalfee
                ? blockstats.totalfee / 100000000
                : blockstats.totalfee}
            </td>
            <td>{blockstats.avgtxsize}vB</td>
            <td>{blockstats.ins}</td>
            <td>{blockstats.outs}</td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export const GetblockStatsWithData: FC = async () => {
  const bitcoinRPC = useContext(BitcoinContext);
  const { result: bestblockhash } = await bitcoinRPC.getbestblockhash();
  const { result, error } = await bitcoinRPC.getblockstats({
    hash_or_height: bestblockhash!,
  });

  return <GetblockStats blockstats={result!} />;
};
