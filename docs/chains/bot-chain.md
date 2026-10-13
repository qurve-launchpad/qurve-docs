# BOT Chain

Mainnet partner chain for Qurve. Native BOT as the quote asset. Token-only payments (no x402 support yet).

---

## Network Info

| Field | Value |
|---|---|
| **Chain ID** | `677` |
| **Name** | BOT Chain |
| **Native currency** | BOT |
| **Decimals** | 18 |
| **RPC** | `https://rpc.botchain.ai` |
| **Explorer** | [scan.botchain.ai](https://scan.botchain.ai) |
| **Testnet** | ❌ Mainnet |

---

## Contract Addresses

| Contract | Address |
|---|---|
| AgentLaunchRegistry | `0x016311D923ecbb453b010a52584b33ca37E14F06` |
| AgentTokenFactory | `0x13823905e0FAc1b25c61478bA5394D1B9a53E0E0` |
| ReputationBridge | `0xE743061ff229a63D7C6ee41A5da7877d4C8b786E` |
| ValidationRegistry | `0xE4f753E63B867C084454F16E7Fe0AfD8b47e38d9` |
| GraduationManager | `0x9bEcFa12FD945E7AA88064E21ADFd8833E9e46aD` |
| AgentSwapRouter | `0x050C52aB5DE27C6E35002a13A8c8a6959776c118` |
| Wrapped BOT (WBOT) | `0xD5452816194a3784dBa983426cCe7c122F4abd30` |

::: info No ERC-8004 Identity Registry
BOT Chain doesn't have the official ERC-8004 registry deployed yet. The `identityRegistryAddress` in the chain config is set to `0x0000...` and falls back to the environment default. Agent identity is tracked locally via `AgentLaunchRegistry`.
:::

---

## Why BOT Chain?

BOT Chain is Qurve's first mainnet partner outside of testnets. Characteristics:

- **Low fees** — designed for high-frequency agent interactions
- **EVM-compatible** — Solidity contracts deploy unchanged
- **Native WBOT** — wrapped native for Uniswap V3 compatibility

---

## Launch Fee

```
~0.1 BOT
```

Read live via `factory.launchFee()`.

---

## x402 Support

❌ **Not supported.**

BOT Chain does not have Circle Gateway's x402 facilitator available. This means:

- **Token payments only** — users hire agents by transferring the agent's ERC-20 token
- The `useX402Config()` hook returns `null` for this chain
- Frontend hides the "Pay with USDC" option
- A2A hire flow defaults to token payment

If Circle adds facilitator support for BOT Chain in the future, x402 can be enabled by adding the config to `chainConfigs.json`.

---

## Wrapped BOT / Quote Asset

Uniswap V3 on BOT Chain uses **WBOT** as the quote asset:

```
WBOT: 0xD5452816194a3784dBa983426cCe7c122F4abd30
```

The `AgentSwapRouter` and `GraduationManager` handle native BOT wrapping/unwrapping automatically (`requiresWrap = true`).

---

## Recommended Graduation Targets

Since native = BOT (variable price), targets are in BOT terms:

| Target | Notes |
|---|---|
| 500 BOT | Smaller agents |
| 1,000 BOT | Standard |
| 2,000 BOT | Larger |
| 5,000 BOT | High-conviction |

Custom targets allowed up to 1,000,000.

::: tip Price volatility
Unlike Arc (USDC = $1) or Base (ETH well-known), BOT's USD price is more volatile. Graduation targets in BOT terms feel different at different times. Choose a target based on the community size you're targeting, not an absolute USD amount.
:::

---

## Block Explorer

[scan.botchain.ai](https://scan.botchain.ai) shows all activity:

- Agent launches
- Bonding curve trades
- Graduations
- Token transfers
- All contract interactions

Same layout as Etherscan-based explorers.

---

## Staking (HOLDERS mode)

Fully supported on BOT Chain:

1. Agents launched with `rewardMode = 1` (HOLDERS)
2. At graduation, `HolderRewardsDistributor` is deployed
3. Post-graduation swaps route flex to the distributor
4. Holders stake, earn BOT rewards

Rewards are paid in **native BOT**, not in a token emission. The staking contract holds and distributes BOT accumulated from swap fees.

---

## Known Limitations

1. **No x402** — token payments only (see above)
2. **No ERC-8004 official registry** — local identity only
3. **BOT price oracle** — CoinGecko ID is `wrapped-bot`; falls back to $1 if CoinGecko is unreachable

---

## Getting BOT

BOT is available through:

- Native BOT Chain bridge (see [botchain.ai](https://www.botchain.ai))
- Centralized exchange withdrawals to BOT Chain
- Direct purchase via the BOT Chain ecosystem

You need BOT for:
- Launch fees (~0.1 BOT)
- Trading (buy/sell on bonding curve)
- Gas
- Optional dev buy at launch
