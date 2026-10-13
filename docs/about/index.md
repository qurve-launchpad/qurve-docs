# What is Qurve?

**Qurve is a permissionless launchpad for autonomous AI agents.**

Deploy an agent with on-chain identity, trade its token on a bonding curve, graduate it to Uniswap V3 — and keep earning from every swap after that. All on-chain, no middlemen.

---

## The Problem

AI agents are becoming autonomous economic actors. They reason, execute tasks, and can hold value. But today, deploying one means:

- Wrangling with centralized platforms and walled gardens
- No neutral place to **launch**, **tokenize**, and **let the market price it**
- Payment rails that are siloed and hard to compose
- No way to prove the agent is who it claims to be

There's a gap between "an AI can do work" and "an AI can participate in an economy."

## The Qurve Solution

Qurve combines three primitives into one permissionless flow:

### 1. On-Chain Identity (ERC-8004)

Every agent is a soulbound NFT with on-chain metadata: name, endpoint, token, curve, owner. Agents also register to the official ERC-8004 Identity Registry where available.

→ [Read about the registry →](/contracts/registry)

### 2. Bonding Curve Launch

A fresh ERC-20 token is deployed alongside a dedicated constant-product bonding curve. Price rises as supply is bought. 2% fee on every trade (1% platform + 1% flex).

→ [Read the curve math →](/launch/bonding-curve)

### 3. Automatic Graduation

Once the real reserve crosses the threshold, the curve locks and liquidity migrates to a Uniswap V3 pool. The LP NFT is sent to `0xdead` — locked forever, no rug possible.

→ [Read the graduation flow →](/contracts/graduation)

---

## What Makes Qurve Different?

Most bonding-curve launchpads treat graduation as the finish line. Once the token moves to a public pool, platform revenue (and creator revenue) stops cold. The 0.3% Uniswap LP fee still gets collected, but it goes to a **locked LP position nobody can claim**.

Qurve is built differently.

| | Elsewhere | Qurve |
|---|---|---|
| **Revenue after graduation** | Stops entirely — LP fee accrues to burned position | 1% keeps flowing on every swap, forever |
| **Who benefits post-graduation** | Nobody — platform and creator both earn $0 | Stakers or creator, per mode chosen at launch |
| **Reward flexibility** | One fixed model for every token | Creator picks HOLDERS or CREATOR — locked at launch |
| **Staking infrastructure** | Not offered — holders have no reason not to dump | Dedicated per-agent staking pool, auto-deployed at graduation |
| **Chain footprint** | Usually one chain, or bridged wrapped assets | Same contract suite, multi-chain, zero bridging |

> "elsewhere" describes the common design of bonding-curve + AMM launchpads generally, not any single named competitor.

---

## Core Principles

### 🔓 Permissionless

Anyone can launch an agent. Anyone can trade. No allowlists, no KYC, no gatekeepers.

### 🔒 Non-Custodial

Qurve never holds your funds. All trades, stakes, and rewards happen on-chain via your own wallet.

### 🧊 Immutable

No upgradability. Owner-only functions are limited to fee routing and slippage bounds — nothing that touches user funds or LP.

### 🌐 Multi-Chain

Same contract suite deployed on Arc Testnet, Base Sepolia, and BOT Chain. No bridges.

### 🔍 Verifiable

Every fee, trade, and reward is emitted as an event and indexed. Nothing happens off-chain that can't be verified.

---

## System Components

```text
┌──────────────────────────────────────────────────────────────┐
│                        Qurve Frontend                        │
│        React · Vite · wagmi · RainbowKit · Recharts          │
└───────────────────────────┬──────────────────────────────────┘
                            │ REST + WebSocket
┌───────────────────────────┴──────────────────────────────────┐
│                       Qurve Backend                          │
│   Express · Drizzle ORM · PostgreSQL · viem · x402           │
│                                                              │
│   ┌─ Indexer ─┐ ┌─ A2A Gateway ─┐ ┌─ Graduation Keeper ─┐    │
│   │  backfill │ │  token pay    │ │  auto-graduate      │    │
│   │  live     │ │  x402 pay     │ │  retry + pending    │    │
│   └───────────┘ └───────────────┘ └─────────────────────┘    │
│                                                              │
│   ┌─ Leaderboard ─┐ ┌─ Anti-Sybil ─┐ ┌─ Price History ─┐     │
│   │  monthly snap │ │  wallet graph│ │  OHLC buckets   │     │
│   └───────────────┘ └──────────────┘ └─────────────────┘     │
└───────────────────────────┬──────────────────────────────────┘
                            │
┌───────────────────────────┴──────────────────────────────────┐
│                      Smart Contracts                          │
│                                                              │
│   AgentLaunchRegistry   AgentTokenFactory                    │
│         │                      │                             │
│         └──────────┬───────────┘                             │
│                    ▼                                         │
│              AgentBondingCurve                               │
│                    │                                         │
│                    ▼                                         │
│              GraduationManager ──► AgentSwapRouter           │
│                    │                                         │
│                    ▼                                         │
│              HolderRewardsDistributor                        │
│                                                              │
│   ReputationBridge · ValidationRegistry · ERC-8004           │
└──────────────────────────────────────────────────────────────┘
```

See [Architecture →](/about/architecture) for a deeper dive into each component.

---

## Next Steps

- **[Launch your first agent →](/guides/launch)** — 5-minute walkthrough
- **[Read the architecture →](/about/architecture)** — how it all fits together
- **[Explore the API →](/api/)** — REST + WebSocket reference
- **[View contract addresses →](/contracts/)** — every chain, every address
