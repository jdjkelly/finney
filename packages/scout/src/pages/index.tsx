import { FC } from "hono/jsx";
import { Suspense } from "hono/jsx/streaming";
import {
  BlockchainInfo,
  BlockchainInfoWithData,
} from "../components/blockchain-info";
import { Blocks, BlocksWithData } from "../components/blocks";
import {
  GetblockStats,
  GetblockStatsWithData,
} from "../components/getblock-stats";
import Layout from "../components/layout";
import { MempoolInfo } from "../components/memopool-info";
import { NetworkInfo } from "../components/network-info";

const Index: FC = () => {
  return (
    <Layout>
      <Suspense fallback={<BlockchainInfo />}>
        <BlockchainInfoWithData />
      </Suspense>
      <Suspense fallback={<GetblockStats />}>
        <GetblockStatsWithData />
      </Suspense>
      <Suspense fallback={<div>loading...</div>}>
        <MempoolInfo />
      </Suspense>
      <Suspense fallback={<div>loading...</div>}>
        <NetworkInfo />
      </Suspense>
      <Suspense fallback={<Blocks />}>
        <BlocksWithData />
      </Suspense>
    </Layout>
  );
};

export default Index;
