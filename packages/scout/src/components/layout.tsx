import { FC } from "hono/jsx";
import BitcoinContext, { bitcoinRPC } from "../context/bitcoin";

import { memo } from "hono/jsx";

const Head = memo(() => {
  const css = `
    table {
      width: 100%;
      border: 1px solid black;
      text-align: left;
      padding: 0.5rem;

      caption {
        margin-bottom: 1rem;
        font-weight: bold;
        text-align: left;
      }
    }

    body {
      display: grid;
      grid-template-columns: 1fr;
      grid-row-gap: 1.5rem;
      grid-auto-rows: max-content;
    }
  `;

  return (
    <head>
      <style>{css}</style>
    </head>
  );
});

const Layout: FC = (props) => {
  return (
    <html style={{ fontFamily: "monospace" }}>
      <Head />
      <BitcoinContext.Provider value={bitcoinRPC}>
        <body>{props.children}</body>
      </BitcoinContext.Provider>
    </html>
  );
};

export default Layout;
