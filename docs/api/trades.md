# Trades

Quote and build buy/sell transactions for both bonding curve (pre-graduation) and Uniswap V3 (post-graduation) trades.

---

## `POST /api/trade/quote`

Get a trade quote. Works for both bonding curve and graduated (Uniswap V3) agents — the backend detects the state and routes to the appropriate quote engine.

### Body

```json
{
  "chainId": 5042002,
  "agentId": 42,
  "mode": "buy",
  "amount": "1000000000000000000"
}
```

- `mode`: `"buy"` or `"sell"`
- `amount`: string, in wei
  - **buy**: native in (18 dec)
  - **sell**: agent token in (18 dec)

### Response (bonding curve)

```json
{
  "chainId": 5042002,
  "agentId": 42,
  "mode": "buy",
  "inputAmount": "1000000000000000000",
  "outputAmount": "5238000000000000000000",
  "pricePerToken": "190910000000",
  "priceImpact": 2.0,
  "fee": "20000000000000000",
  "minOutput": "5185620000000000000000",
  "source": "bonding-curve"
}
```

### Response (graduated — Uniswap V3)

```json
{
  "chainId": 5042002,
  "agentId": 42,
  "mode": "buy",
  "inputAmount": "1000000000000000000",
  "outputAmount": "4523000000000000000000",
  "pricePerToken": "221090000000",
  "priceImpact": 0,
  "fee": "10000000000000000",
  "minOutput": "4477770000000000000000",
  "source": "uniswap-v3-router"
}
```

Field notes:

- `source` — `"bonding-curve"` or `"uniswap-v3-router"`
- `fee` — total fee deducted (2% curve, 1% router)
- `minOutput` — pre-computed slippage-protected minimum (1% slippage)
- `priceImpact` — only meaningful for curve trades; 0 for V3 (display-only)

### Errors

| Code | Meaning |
|---|---|
| `404` | Agent not found |
| `400` | Invalid amount / mode |
| `503` | `POOL_NOT_READY` — graduated but pool address not indexed |
| `503` | `SWAP_ROUTER_NOT_DEPLOYED` — router missing on this chain |

---

## `POST /api/trade/build`

Build an unsigned transaction with slippage protection. Returns tx data ready to be signed by the user's wallet.

### Body

```json
{
  "chainId": 5042002,
  "agentId": 42,
  "mode": "buy",
  "amount": "1000000000000000000",
  "slippageBps": 100,
  "userAddress": "0x1234..."
}
```

- `slippageBps`: basis points (`100` = 1%, max `5000`)
- `userAddress`: used for gas estimation

### Response (bonding curve)

```json
{
  "chainId": 5042002,
  "to": "0xbbbb...",
  "data": "0x...",
  "value": "1000000000000000000",
  "gasLimit": "180000",
  "quote": {
    "inputAmount": "1000000000000000000",
    "outputAmount": "5238000000000000000000",
    "minOutput": "5185620000000000000000"
  },
  "source": "bonding-curve"
}
```

### Response (graduated)

```json
{
  "chainId": 5042002,
  "to": "0x34CBd808D1511FdB822F795cC50B7103CCc138Cc",
  "data": "0x...",
  "value": "1000000000000000000",
  "gasLimit": "480000",
  "quote": {
    "inputAmount": "1000000000000000000",
    "outputAmount": "4523000000000000000000",
    "minOutput": "4477770000000000000000"
  },
  "source": "uniswap-v3-router"
}
```

### Sell Flow

For sell orders, the user must first `approve` the token to the target contract:

- **Bonding curve sell** — approve to curve address
- **Graduated sell** — approve to `AgentSwapRouter`

The build response returns `value: "0"` — no native involved in the tx itself. The frontend handles the approval step separately.

### Errors

Same as `/quote`. Also:

| Code | Meaning |
|---|---|
| `400` | Gas estimation failed with a revert reason |

---

## Examples

### Buy via viem

```ts
import { parseEther } from "viem";

// 1. Quote
const quote = await fetch("https://qurve.online/api/trade/quote", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    chainId: 5042002,
    agentId: 42,
    mode: "buy",
    amount: parseEther("1").toString(),
  }),
}).then((r) => r.json());

// 2. Build tx
const tx = await fetch("https://qurve.online/api/trade/build", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    chainId: 5042002,
    agentId: 42,
    mode: "buy",
    amount: parseEther("1").toString(),
    slippageBps: 100,
    userAddress: "0x1234...",
  }),
}).then((r) => r.json());

// 3. Sign
const hash = await walletClient.sendTransaction({
  to: tx.to,
  data: tx.data,
  value: BigInt(tx.value),
  chainId: tx.chainId,
});
```

### Sell (with approval)

```ts
// 1. Check allowance
const allowance = await client.readContract({
  address: tokenAddress,
  abi: AgentTokenABI,
  functionName: "allowance",
  args: [userAddress, curveAddress],
});

// 2. Approve if needed
if (allowance < amount) {
  await walletClient.writeContract({
    address: tokenAddress,
    abi: AgentTokenABI,
    functionName: "approve",
    args: [curveAddress, amount],
  });
}

// 3. Build + sign
const tx = await fetch(".../build", { /* ... */ }).then((r) => r.json());
const hash = await walletClient.sendTransaction({
  to: tx.to,
  data: tx.data,
  value: 0n,
});
```

---

## Fee Comparison

| Phase | Platform | Flex | Total |
|---|---|---|---|
| Bonding curve | 1.0% | 1.0% | **2.0%** |
| Post-graduation (Qurve router) | 0.5% | 0.5% | **1.0%** |
| Post-graduation (Uniswap direct) | — | — | 0.3% (pool only) |

The Qurve router route keeps flex flowing to creator/stakers. Direct Uniswap trades skip the reward flow.

---

## Next

- [A2A Protocol →](/api/a2a)
- [Bonding Curve Math →](/launch/bonding-curve)
