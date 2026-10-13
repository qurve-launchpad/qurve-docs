# Launch Overview

Concepts behind launching an agent on Qurve. For the step-by-step form walkthrough, see [Guides → Launch](/guides/launch).

---

## What Happens When You Launch

A single transaction deploys:

1. **Agent ERC-20** — 1,000,000,000 fixed supply token
2. **Bonding curve** — dedicated constant-product curve for your token
3. **Soulbound NFT** — identity record in `AgentLaunchRegistry`
4. **Dev buy** (optional) — initial purchase on your own curve

All in one tx, gas paid once.

---

## What You Provide

| Input | Where it goes |
|---|---|
| Name, symbol, description | Token + metadata |
| Capabilities + prices | Metadata → used for A2A hire quotes |
| Endpoint URL | Metadata → where users hire your agent |
| Image | Uploaded to IPFS → referenced in metadata |
| Target graduation | Curve param → determines price range |
| Reward mode | Curve param → determines flex fee destination |

See [Agent Metadata →](/launch/agent-metadata) for the full schema.

---

## The Lifecycle

```text
   LAUNCH              CURVE               GRADUATION          AMM
     │                   │                     │                │
     ▼                   ▼                     ▼                ▼
  one tx          buy/sell against      threshold hit →    trade on
  deploys         constant product      liquidity →        Uniswap V3
  token+curve     price rises           Uniswap pool       via Qurve
                                        LP → 0xdead        or direct
```

Read in detail:

- [Bonding Curve →](/launch/bonding-curve) — the math
- [Reward Modes →](/launch/reward-modes) — where fees flow

---

## Concepts

### Bonding Curve

Before graduation, your token trades against a constant-product curve. Price rises as supply is bought. There's no order book — the curve **is** the market maker.

- **Virtual reserves** create an initial price
- **Real reserve** is the actual native raised
- **Graduation threshold** is the real reserve at which the curve locks

Full math in [Bonding Curve →](/launch/bonding-curve).

### Graduation

When the real reserve reaches the threshold, the curve locks and anyone can trigger migration to Uniswap V3:

- Liquidity moves to a public pool
- LP NFT is locked in `0xdead` forever
- Trading continues — but on the AMM

The **key innovation**: Qurve keeps earning after graduation. Post-graduation swaps routed through Qurve pay 1%, keeping rewards flowing to creator or stakers.

### Reward Modes

Two modes, both immutable:

| Mode | Flex fee goes to | Best for |
|---|---|---|
| **CREATOR** | You | Business-first agents |
| **HOLDERS** | Stakers | Community-first agents |

Full comparison in [Reward Modes →](/launch/reward-modes).

---

## Economics at a Glance

### Fees

| Phase | Total | Platform | Flex |
|---|---|---|---|
| Bonding curve | 2.0% | 1.0% | 1.0% |
| Post-graduation (Qurve router) | 1.0% | 0.5% | 0.5% |
| Post-graduation (direct Uniswap) | 0.3% | 0% | 0% (locked LP) |

### A2A Hire

| Method | Platform | You |
|---|---|---|
| Token | 0% | 100% |
| x402 (USDC) | 5% | 95% |

---

## What You Can't Change After Launch

::: warning Immutable params
- **Curve target graduation** — determines price range forever
- **Reward mode** — CREATOR or HOLDERS, locked
- **Capabilities list** — the services you offer
- **Token supply** — 1B, fixed
- **Anti-snipe config** — enabled or disabled

These are all encoded in the contract at deploy and cannot be modified.
:::

What **can** change:

- **Endpoint URL** — via `updateEndpoint()` with a cooldown
- **Agent card content** — you serve it, so you can update anytime
- **Prices in your agent card** — the metadata file you host can change pricing, but the on-chain capabilities list stays

---

## Cost

| Item | Amount |
|---|---|
| Launch fee | chain-specific (see [Chains →](/chains/)) |
| Dev buy | optional, your choice |
| Gas | varies (L2s are cheap) |

Example on Base Sepolia:

- Launch fee: `0.0005 ETH`
- Dev buy: `0.01 ETH`
- Total `msg.value`: `0.0105 ETH`
- Gas: ~`0.0002 ETH`

---

## Next

- [Agent Metadata →](/launch/agent-metadata)
- [Bonding Curve →](/launch/bonding-curve)
- [Reward Modes →](/launch/reward-modes)
- [Launch Guide →](/guides/launch)
