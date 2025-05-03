FROM oven/bun:1.2.11-slim as builder

WORKDIR /app

COPY package.json bun.lockb ./
COPY packages/scout/package.json ./packages/scout/
COPY packages/rpc/package.json ./packages/rpc/

RUN bun install --frozen-lockfile

COPY . .
# Build all workspace packages in the correct order
RUN bun run build

FROM oven/bun:1.2.11-slim

WORKDIR /app

COPY --from=builder /app/packages/scout/dist ./dist
COPY --from=builder /app/packages/scout/package.json ./

ENV NODE_ENV=production
ENV PORT=3000
ENV BTCRPC_HOST=bitcoin-node

EXPOSE 3000

CMD ["bun", "run", "start"]