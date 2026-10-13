# Arc Testnet

Primary development chain for Qurve. Native USDC as the quote asset — the only chain where gas and trading use the same stablecoin.

---

## Network Info

| Field | Value |
|---|---|
| **Chain ID** | `5042002` |
| **Name** | Arc Testnet |
| **Native currency** | USD Coin (USDC) |
| **Decimals** | 18 |
| **RPC** | `https://rpc.testnet.arc.io` |
| **Explorer** | [explorer.testnet.arc.io](https://explorer.testnet.arc.io) |
| **Testnet** | ✅ |

---

## Contract Addresses

| Contract | Address |
|---|---|
| AgentLaunchRegistry | `0xFa2952Bb09E1060F0adc691b93f7eD38852d0606` |
| AgentTokenFactory | `0xC67Ab149Ff44D516F68EDC0Dd8e4A9CB416B7Fd3` |
| ReputationBridge | `0x9a3E2b4c534cdaca874Ce83d4E73fF29Ee69C731` |
| ValidationRegistry | `0x74e9628308BFc16B85d565C0c3c9Ccc67C2775b8` |
| GraduationManager | `0x7E02C40D7b7292CbAE2BA9711059A6144dD20A37` |
| AgentSwapRouter | `0x34CBd808D1511FdB822F795cC50B7103CCc138Cc` |
| ERC-8004 Identity Registry | `0x8004A818BFB912233c491871b3d84c89A494BD9e` |
| USDC (x402) | `0x3600000000000000000000000000000000000000` |

---

## Why Arc?

Arc uses **USDC as the native gas token**. This creates a uniquely clean UX:

- Gas and trading both use the same asset
- No need to hold ETH for gas + USDC for trading
- Price displays are stable in USD (USDC ≈ $1)
- x402 payments use the same asset as gas

For agent-economy use cases where USD-denominated pricing matters, Arc is the natural home.

---

## Native USDC Dual Representation

Arc has two representations of USDC:

| Form | Decimals | Used For |
|---|---|---|
| **Native USDC** | 18 | Gas, bonding curve, native transfers |
| **ERC-20 USDC** | 6 | Uniswap V3 quote, x402 payments |

The `AgentSwapRouter` handles the decimal conversion (`nativeToQuoteDecimalOffset = 1e12`) automatically. From a user's perspective, everything is "USDC".

---

## Launch Fee

```
~0.0005 USDC
```

Read live via `factory.launchFee()`. Cache TTL is 5 minutes.

---

## x402 Support

✅ **Supported.**

- Facilitator: `https://gateway-api-testnet.circle.com/v1`
- USDC address: `0x3600000000000000000000000000000000000000`
- Network CAIP-2: `eip155:5042002`

---

## Block Explorer

All transactions, agent launches, and trade events are visible on [explorer.testnet.arc.io](https://explorer.testnet.arc.io).

- Agents: search the registry address
- Trades: filter events by curve address
- Graduations: search the graduation manager address

---

## Getting Test USDC

Arc Testnet USDC is available via the Arc faucet (see [arc.io](https://arc.io) for current faucet URL). You need enough for:

- Launch fee (~0.0005 USDC)
- Optional dev buy
- Gas (minimal)

---

## Recommended Graduation Targets

Since native = USDC ≈ $1, targets are in dollar terms:

| Target | Meaning |
|---|---|
| 2,500 USDC | ~$2.5k market cap at graduation |
| 5,000 USDC | ~$5k |
| 10,000 USDC | ~$10k |
| 20,000 USDC | ~$20k |

Custom targets allowed up to 1,000,000.
