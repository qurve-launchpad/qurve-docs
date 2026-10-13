# Contract Addresses

All Qurve contract addresses, per chain. Every contract is deployed as-is — no proxies, no upgrade paths.

---

## Arc Testnet

**Chain ID:** `5042002` · **Native:** USDC · **Explorer:** [explorer.testnet.arc.io](https://explorer.testnet.arc.io)

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

## Base Sepolia

**Chain ID:** `84532` · **Native:** ETH · **Explorer:** [sepolia.basescan.org](https://sepolia.basescan.org)

| Contract | Address |
|---|---|
| AgentLaunchRegistry | `0x6af48f03572D7f6D3d80fEa2d0FE82E28e3E32C1` |
| AgentTokenFactory | `0x8Ee73a8c5f8EE868D6FB7112DBBF63402Acbf473` |
| ReputationBridge | `0x75caF6E6788F0DdfbA79020BEB9Fc716ad05e5ae` |
| ValidationRegistry | `0xE7e473bfA6258e10Dd82B83F0EcD773e3bacd16c` |
| GraduationManager | `0xA85AbB23bAFC13340AF9bb8f44E31366E029f805` |
| AgentSwapRouter | `0x0Fd84b95616D7e1Ec43Ad567Fd9FB515588E0d33` |
| ERC-8004 Identity Registry | `0x8004A818BFB912233c491871b3d84c89A494BD9e` |
| USDC (x402) | `0x036CbD53842c5426634e7929541eC2318f3dCF7e` |
| WETH (Uniswap V3 quote) | `0x4200000000000000000000000000000000000006` |

---

## BOT Chain

**Chain ID:** `677` · **Native:** BOT · **Explorer:** [scan.botchain.ai](https://scan.botchain.ai)

| Contract | Address |
|---|---|
| AgentLaunchRegistry | `0x016311D923ecbb453b010a52584b33ca37E14F06` |
| AgentTokenFactory | `0x13823905e0FAc1b25c61478bA5394D1B9a53E0E0` |
| ReputationBridge | `0xE743061ff229a63D7C6ee41A5da7877d4C8b786E` |
| ValidationRegistry | `0xE4f753E63B867C084454F16E7Fe0AfD8b47e38d9` |
| GraduationManager | `0x9bEcFa12FD945E7AA88064E21ADFd8833E9e46aD` |
| AgentSwapRouter | `0x050C52aB5DE27C6E35002a13A8c8a6959776c118` |
| WBOT (Uniswap V3 quote) | `0xD5452816194a3784dBa983426cCe7c122F4abd30` |

::: info No ERC-8004 registry yet
BOT Chain doesn't have the official ERC-8004 Identity Registry deployed. Agent identity is tracked locally via `AgentLaunchRegistry`. x402 is also not supported.
:::

---

## Robinhood Chain

**Chain ID:** `4663` · **Status:** planned

Contracts not deployed yet. This section will be updated when the chain goes live.

---

## Quick Reference

### By Chain

```
Arc Testnet     5042002  → full suite + x402
Base Sepolia    84532    → full suite + x402
BOT Chain       677      → full suite (no x402, no ERC-8004)
Robinhood Chain 4663     → planned
```

### By Contract Type

| Contract | Purpose |
|---|---|
| `AgentLaunchRegistry` | On-chain identity. Soulbound NFT per agent. |
| `AgentTokenFactory` | Entry point for launching a new agent. |
| `ReputationBridge` | On-chain feedback registry. |
| `ValidationRegistry` | Third-party validator attestations. |
| `GraduationManager` | Migrates bonding curve liquidity → Uniswap V3. |
| `AgentSwapRouter` | Post-graduation swap router with fee split. |

Per-agent contracts (deployed by the factory, not listed here):

- `AgentToken` — one per agent
- `AgentBondingCurve` — one per agent
- `HolderRewardsDistributor` — one per HOLDERS-mode agent, at graduation

---

## Verify on Explorer

You can verify any address by pasting it into the chain's explorer search. Examples:

**Arc Testnet factory:**
```
https://explorer.testnet.arc.io/address/0xC67Ab149Ff44D516F68EDC0Dd8e4A9CB416B7Fd3
```

**Base Sepolia registry:**
```
https://sepolia.basescan.org/address/0x6af48f03572D7f6D3d80fEa2d0FE82E28e3E32C1
```

**BOT Chain factory:**
```
https://scan.botchain.ai/address/0x13823905e0FAc1b25c61478bA5394D1B9a53E0E0
```

---

## Next

- [Chains →](/chains/) — network details per chain
- [Launch →](/launch/) — how to launch an agent
- [API →](/api/) — REST + WebSocket reference
