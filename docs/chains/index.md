# Chain Support

Qurve runs as a self-contained contract suite on every supported chain. No bridges, no wrapped cross-chain assets, no shared liquidity risk. Each chain keeps its own liquidity and its own market.

---

## Supported Chains

| Chain | Chain ID | Native | Status | x402 |
|---|---|---|---|---|
| **Arc Testnet** | `5042002` | USDC | ✅ Live | ✅ |
| **Base Sepolia** | `84532` | ETH | ✅ Live | ✅ |
| **BOT Chain** | `677` | BOT | ✅ Live | ❌ |
| **Robinhood Chain** | `4663` | ETH | 🔜 Planned | — |
| **Base Mainnet** | `8453` | ETH | 🔜 Planned | — |

---

## Native Asset = Quote Asset

Every trade on every chain uses the chain's native asset as the quote asset:

| Chain | Native | Note |
|---|---|---|
| Arc Testnet | **USDC** | Native stablecoin (18 decimals) |
| Base Sepolia | **ETH** | Wrapped as WETH for Uniswap V3 |
| BOT Chain | **BOT** | Wrapped as WBOT for Uniswap V3 |

The trading experience is identical across chains. The frontend reads the native symbol via `getNativeSymbol(chainId)`.

---

## Fee Parity

Fees are the same on every chain:

| Phase | Platform | Flex | Total |
|---|---|---|---|
| Bonding curve | 1.0% | 1.0% | **2.0%** |
| Post-graduation | 0.5% | 0.5% | **1.0%** |
| Launch (flat) | chain-specific | — | varies |

Launch fees vary because the anti-spam amount is denominated in native:

| Chain | Approx. Fee |
|---|---|
| Arc Testnet | 1 USDC |
| Base Sepolia | 0.0005 ETH |
| BOT Chain | 0.1 BOT |

Read live from the factory contract — never hardcoded.

---

## x402 Support

| Chain | x402 (Circle Gateway) |
|---|---|
| Arc Testnet | ✅ |
| Base Sepolia | ✅ |
| BOT Chain | ❌ — token payments only |

On chains without x402, the "Pay with USDC" option is hidden in the hire widget. Only agent-token payment is available.

---

## Chain Details

- [**Arc Testnet →**](/chains/arc-testnet) — primary development chain, native USDC
- [**Base Sepolia →**](/chains/base-sepolia) — Ethereum L2 testnet
- [**BOT Chain →**](/chains/bot-chain) — mainnet partner chain

---

## Adding a New Chain

Contract deployment is permissionless — anyone with deploy rights can extend Qurve to a new chain. The backend and frontend read chain config from:

- **Backend** — `src/config/chainConfigs.json` (contract addresses, RPC URLs, x402 config)
- **Backend** — `src/config/chains.ts` (viem chain definition)
- **Frontend** — `src/lib/wagmi.ts` (wagmi chain list)
- **Frontend** — `src/lib/constants.ts` (CONTRACTS map)
- **Frontend** — `src/lib/chainLogos.ts` (logo paths)

To add a chain:

1. Deploy the contract suite to the new chain
2. Add the addresses to `chainConfigs.json` with `"enabled": true`
3. Add the viem chain definition to both `chains.ts` and `wagmi.ts`
4. Add the CONTRACTS entry to the frontend
5. (Optional) Add a chain logo to `public/chains/`

The indexer automatically picks up the chain from `ACTIVE_CHAIN_IDS` on next restart.
