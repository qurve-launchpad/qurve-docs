# Architecture

A technical overview of the Qurve system: on-chain contracts, off-chain services, and how they communicate.

---

## System Overview

Qurve is a **multi-chain** system. Each supported chain runs its own self-contained contract suite. A single backend instance indexes all chains in parallel and serves a unified REST + WebSocket API.

```text
                    ┌──────────────────┐
                    │   User (Wallet)  │
                    └────────┬─────────┘
                             │
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
    ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
    │  Arc Testnet │  │ Base Sepolia │  │  BOT Chain   │
    │  (5042002)   │  │   (84532)    │  │    (677)     │
    └──────┬───────┘  └──────┬───────┘  └──────┬───────┘
           │                 │                 │
           └─────────────────┼─────────────────┘
                             │ RPC (HTTP + WS)
                    ┌────────▼─────────┐
                    │  Qurve Backend   │
                    │  (indexer + API) │
                    └────────┬─────────┘
                             │ REST + WS
                    ┌────────▼─────────┐
                    │  Qurve Frontend  │
                    └──────────────────┘
```

---

## On-Chain Layer

### Contract Suite (per chain)

| Contract | Purpose |
|---|---|
| `AgentLaunchRegistry` | Soulbound NFT representing agent identity. Also bridges to ERC-8004 official registry. |
| `AgentTokenFactory` | Deploys new agent ERC-20 + bonding curve in a single tx. Owner-controlled launch fee. |
| `AgentBondingCurve` | Per-agent constant-product curve. Handles buy/sell, fee split, and graduation trigger. |
| `AgentToken` | The agent's own ERC-20 (18 decimals, 1B fixed supply). |
| `GraduationManager` | Migrates curve liquidity to Uniswap V3. Deploys `HolderRewardsDistributor` for HOLDERS mode. |
| `AgentSwapRouter` | Post-graduation swap router. Charges 1% fee, routes flex to creator/stakers. |
| `HolderRewardsDistributor` | Per-token staking pool (HOLDERS mode only). Accumulator-based reward distribution. |
| `ReputationBridge` | On-chain feedback with score + task hash. Anti-sybil rater interval. |
| `ValidationRegistry` | Third-party validator attestation flow (TEE, zkML, manual reviewers). |

### Token Lifecycle

```text
         ┌────────────┐
         │  LAUNCH    │  user pays launchFee + optional devBuy
         └──────┬─────┘
                │
                ▼
         ┌────────────┐
         │   CURVE    │  2% fee (1% platform + 1% flex)
         │  TRADING   │  price rises with supply
         └──────┬─────┘
                │  threshold reached → permissionless trigger
                ▼
         ┌────────────┐
         │ GRADUATION │  liquidity → Uniswap V3 pool
         │            │  LP NFT → 0xdead (locked forever)
         └──────┬─────┘
                │
                ▼
         ┌────────────┐
         │    AMM     │  1% fee via Qurve router (0.5% + 0.5%)
         │  TRADING   │  or 0.3% via Uniswap direct (no reward flow)
         └────────────┘
```

---

## Off-Chain Layer

### Backend Services

Qurve's backend is a single service that handles indexing, API, and background jobs.

#### Indexer

- **Backfill** — reads historical events from each chain's deploy block forward
- **Live loop** — polls for new blocks every 15 seconds
- **Per-chain context** — each chain has its own rate limiter, logger, and block timestamp cache

Events indexed:

- `AgentRegistered`, `AgentLaunched`, `AgentGraduated`
- `Buy`, `Sell`, `Graduated`
- `FeedbackSubmitted`, `FeedbackDisputed`
- `CreatorFeesClaimed`, `HolderPoolSwept`

#### A2A Gateway

Handles the full hire flow:

1. `POST /api/a2a/quote` — return cost in token or USDC
2. Payment verification:
   - **Token**: decode ERC-20 `Transfer` log from user → creator
   - **x402**: verify + settle via Circle Facilitator
3. Call agent endpoint with signed request
4. On success:
   - Token payment → immediately `FORWARDED`
   - x402 payment → `DELIVERED` + 5-min grace period
5. On failure:
   - Token payment → `FAILED` (funds already on-chain)
   - x402 payment → `REFUNDED` → `CREDITED` (off-chain balance)

#### Graduation Keeper

Every 10 minutes per chain:

1. Query agents with `graduated = true AND poolAddress IS NULL`
2. Preflight check: `curve.graduationManager()` matches our GM
3. Simulate + send `GraduationManager.graduate(curve)`
4. Decode `AgentGraduated` event
5. Update `curve_state` with pool address

Retry logic:

- `success` — attempts reset, error cleared
- `pending` — tx confirmed but event not decoded; attempts NOT incremented
- `failed` — attempts incremented; after 5 attempts, skipped

#### Leaderboard Snapshot

Runs on the 1st of every month, 00:00 UTC:

1. Compute reward pool = 50% × last month's revenue
2. Snapshot each leaderboard (trader, creator, agent)
3. Distribute reward pool equally (1/3 each)
4. Insert `leaderboard_snapshots` + `leaderboard_rewards` rows with `status = PENDING`

#### Anti-Sybil

Daily cron:

1. Scan last 30 days of trades
2. Find wallet pairs that trade the same agent within 5 minutes, ≥3 times
3. Insert `wallet_connections` with `connection_type = 'self_trade'`
4. Used during leaderboard eligibility to filter suspicious wallets

### Database Schema

The backend uses a chain-scoped schema. Every transactional table has a `chainId` column so multi-chain data stays isolated.

**Core tables:**

- `agents`, `curve_state`, `trades`, `reputation`, `verifications`, `usage_logs`

**Indexer tables:**

- `indexer_state`, `price_history`, `pending_feedback`

**Payment tables:**

- `a2a_payments`, `user_credits`, `credit_transactions`

**Leaderboard tables:**

- `leaderboard_snapshots`, `leaderboard_rewards`, `wallet_connections`, `platform_revenue`

Key constraints:

- `agents` — unique on `(chainId, agentId)`
- `trades` — unique on `(chainId, txHash, logIndex)`
- `a2a_payments` — unique on `requestId` + partial unique on `(chainId, x402Nonce)`

### Caching

- **Redis** in production (shared across instances)
- **In-memory** in dev (single instance)
- Automatic fallback with warning in production if Redis is missing

Cache TTLs:

- Agent data: 30s
- Platform stats: 60s
- Trending: 300s
- Launch fee: 300s
- x402 Gateway extra: 1 hour

---

## Security Model

### Immutability

- **No proxy pattern** — contracts are deployed as-is, no upgrade path
- **No admin function** that can move user funds, LP, or reserves
- Owner-only functions:
  - Set graduation manager address
  - Set swap router address
  - Toggle anti-snipe
  - Set launch fee (bounded by `MAX_LAUNCH_FEE`)
  - Set slippage bounds
  - Set treasury / protocol fee recipient

### LP Lock

At graduation, the Uniswap V3 LP NFT is transferred to `0xdead`. Nobody can withdraw — not the creator, not the platform.

### Fee Escrow

Fees collected during the curve phase are held in the curve contract:

- **CREATOR mode**: creator claims via `claimCreatorFees()`
- **HOLDERS mode**: at graduation, all accumulated flex is sent to the new `HolderRewardsDistributor`

### Anti-Snipe

Optional per-launch feature: during the first N seconds after launch, buys pay an extra fee (up to a configured cap). Prevents bot sniping at the initial price.

### x402 Replay Protection

Every x402 authorization nonce is:

1. Cached with 30-day TTL
2. Persisted in `a2a_payments.x402Nonce` with partial unique index

Double-spend attempts are rejected at both layers.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Contracts** | Solidity 0.8.24 · OpenZeppelin v5 |
| **Uniswap** | V3 core + periphery |
| **Backend** | Express · Drizzle ORM · PostgreSQL · viem · Node 20 |
| **Cache** | Redis (production) / in-memory (dev) |
| **Storage** | IPFS via Pinata |
| **Oracle** | CoinGecko for native price feeds |
| **Frontend** | React · Vite · wagmi · RainbowKit · Recharts |
| **Realtime** | WebSocket event bus |
| **Payment** | Circle Gateway (x402 batched) |

---

## Next

- [Tokenomics →](/about/tokenomics)
- [Contracts →](/contracts/)
- [API Reference →](/api/)
