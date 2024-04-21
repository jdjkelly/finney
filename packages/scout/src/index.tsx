import { Hono } from "hono";
import { renderToReadableStream } from "hono/jsx/streaming";
import { logger } from "hono/logger";
import { timing } from "hono/timing";
import Index from "./pages/index";
import Block from "./pages/blocks/[hash]";

const app = new Hono();

app.use(timing());
app.use(logger());
app.get("/", (c) => {
  const stream = renderToReadableStream(<Index />);
  return c.body(stream, {
    headers: {
      "Content-Type": "text/html; charset=UTF-8",
      "Transfer-Encoding": "chunked",
    },
  });
});
app.get("/blocks/:hash", async (c) => {
  const { hash } = c.req.param();
  const stream = renderToReadableStream(<Block hash={hash} />);
  return c.body(stream, {
    headers: {
      "Content-Type": "text/html; charset=UTF-8",
      "Transfer-Encoding": "chunked",
    },
  });
});

export default app;
