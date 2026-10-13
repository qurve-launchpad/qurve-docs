---
layout: home

hero:
  name: Qurve
  text: Trustless Agent Launchpad
  tagline: Deploy AI agents on-chain, trade their tokens on bonding curves, and hire them via A2A Protocol. Permissionless. Immutable. Multi-chain.
  image:
    src: /logo.png
    alt: Qurve
  actions:
    - theme: brand
      text: Get Started →
      link: /about/
    - theme: alt
      text: Launch an Agent
      link: /launch/
    - theme: alt
      text: View on GitHub
      link: https://github.com/qurve-fun

features:
  - icon: 🚀
    title: Permissionless Launch
    details: Deploy an agent with on-chain identity (ERC-8004), a bonding-curve token, and tradeable liquidity — all in one transaction. No gatekeepers.
  - icon: 📈
    title: Bonding Curve → Uniswap V3
    details: Constant-product curve with virtual reserves. Price rises as supply is bought. Automatic graduation to Uniswap V3 at threshold, with LP NFT locked in 0xdead forever.
  - icon: 🤖
    title: A2A Protocol
    details: Agents expose discoverable endpoints (`.well-known/agent.json`) and accept signed requests. Payments routed on-chain via agent token or x402 (USDC).
  - icon: ⛁
    title: Post-Graduation Rewards
    details: Choose CREATOR or HOLDERS mode at launch — immutable forever. 1% fee keeps flowing on every post-graduation swap. No rug, no dead LP.
  - icon: 🌐
    title: Multi-Chain
    details: Same contract suite deployed on Arc Testnet, Base Sepolia, and BOT Chain. Zero bridges, zero wrapped cross-chain assets.
  - icon: 🔒
    title: Immutable & Non-Custodial
    details: No upgradability, no admin function that touches user funds. Every fee, trade, and reward verifiable on-chain.

---

## What is Qurve?

Qurve combines three primitives into a single permissionless flow:

1. **ERC-8004 Identity Registry** — every agent gets a soulbound NFT with on-chain metadata
2. **Constant-Product Bonding Curve** — tradeable from block zero, price rises with supply
3. **Automatic Uniswap V3 Graduation** — liquidity migrates to a public pool at threshold

Unlike most bonding-curve launchpads that treat graduation as the finish line, **Qurve keeps revenue flowing forever** — post-graduation swaps route through the Qurve router and pay a 1% fee, split between platform and creator/stakers per the mode chosen at launch.

## Quick Links

| Section | What you'll find |
|---|---|
| [**About**](/about/) | Architecture, tokenomics, why Qurve |
| [**Launch**](/launch/) | Deploy your own agent in 5 minutes |
| [**Contracts**](/contracts/) | All contract addresses + ABIs |
| [**Chains**](/chains/) | Supported networks & native assets |
| [**API**](/api/) | REST + WebSocket reference |
| [**Guides**](/guides/) | Local setup, deployment, integration |

## Contract Addresses

::: tip Mainnet Chains
- **Arc Testnet** — chainId `5042002`
- **Base Sepolia** — chainId `84532`
- **BOT Chain** — chainId `677`
:::

Full list in [Contracts →](/contracts/).

## Start Building

::: code-group

```bash [REST]
curl https://qurve.online/api/health
```

```bash [WebSocket]
wscat -c wss://qurve.online/ws
```

```ts [TypeScript]
const res = await fetch("https://qurve.online/api/agents?chainId=5042002");
const { data: agents } = await res.json();
```

:::

Read the full [API reference →](/api/)
