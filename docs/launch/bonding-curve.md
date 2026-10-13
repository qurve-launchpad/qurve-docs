# Bonding Curve

Qurve uses a **constant-product** curve (`x · y = k`) with virtual reserves — the same primitive popularized by other launchpads, but portable across chains.

---

## Constants

Set at launch, immutable after:

| Constant | Value | Meaning |
|---|---|---|
| `virtualTokenReserve` | `1,073,000,000` | Initial virtual token supply |
| `tokensForSale` | `800,000,000` (80%) | Tokens sold on the curve |
| `tokensForLiquidity` | `200,000,000` (20%) | Reserved for Uniswap V3 LP |
| `totalSupply` | `1,000,000,000` | Total ERC-20 supply |
| `virtualNativeReserve` | derived from target | Initial virtual native balance |

The **target graduation** you pick determines `virtualNativeReserve`.

---

## Formula

Given a target native amount `T` (e.g. 4.2 ETH):

```text
ratio = virtualTokenReserve / (virtualTokenReserve - tokensForSale)
      = 1,073,000,000 / 273,000,000
      ≈ 3.9304

virtualNativeReserve = T / (ratio - 1)
                     = T / 2.9304
```

For `T = 4.2 ETH`:

- `virtualNativeReserve ≈ 1.4334 ETH`
- `graduationThreshold ≈ 4.2 ETH` (by construction)

The graduation threshold (real native raised at graduation) is:

```text
k = virtualTokenReserve × virtualNativeReserve
t_at_sellout = virtualTokenReserve - tokensForSale = 273,000,000

threshold = k / t_at_sellout - virtualNativeReserve
```

---

## Price Function

At any point, with `tokensSold` tokens bought:

```text
tokenReserve(t)  = virtualTokenReserve - tokensSold
nativeReserve(t) = virtualNativeReserve + realNativeReserve
price(t)         = nativeReserve(t) / tokenReserve(t)
```

`realNativeReserve` is tracked separately because the virtual reserve stays fixed — it's notional liquidity, not real.

### Initial & Final Price

```text
initialPrice = virtualNativeReserve / virtualTokenReserve
finalPrice   = nativeAtSellout / tokensForSale
```

For `T = 4.2 ETH`:

| | Value |
|---|---|
| `initialPrice` | ≈ 0.0000000013 ETH per token |
| `finalPrice` | ≈ 0.00000115 ETH per token |
| **Multiplier** | ≈ **855×** |

Lower targets → higher multipliers (cheaper start). Higher targets → lower multipliers.

---

## Buy Quote

Given native input `Δx` (after fee):

```text
newNativeReserve = nativeReserve + Δx
newTokenReserve  = k / newNativeReserve
tokensOut        = tokenReserve - newTokenReserve
```

### Fee handling

```text
fee            = Δx × 2% (200 bps)
nativeAfterFee = Δx - fee
tokensOut      = quoteBuy(nativeAfterFee)
```

### Clamping

If `tokensOut > remainingTokensForSale`, the output is clamped and the excess native is refunded. In practice the curve hits sellout exactly at graduation, so this rarely triggers.

---

## Sell Quote

Given token input `Δy`:

```text
newTokenReserve  = tokenReserve + Δy
newNativeReserve = k / newTokenReserve
nativeOut        = nativeReserve - newNativeReserve
```

### Fee handling

```text
fee            = nativeOut × 2% (200 bps)
nativeAfterFee = nativeOut - fee
```

---

## Fee Split

Every trade pays **2%** total:

| Share | BPS | Destination |
|---|---|---|
| Platform | 100 | Qurve treasury |
| Flex | 100 | Creator OR holder pool (per reward mode) |

Flex fee routing:

- **CREATOR mode**: accrues to `pendingCreatorClaim`. Creator calls `claimCreatorFees()` anytime.
- **HOLDERS mode**: accrues to `pendingHolderPool`. At graduation, swept to the new `HolderRewardsDistributor` in one lump sum.

---

## Graduation Trigger

```text
realNativeReserve >= graduationThreshold
OR
tokensSold >= tokensForSale
```

Once triggered:

1. `graduated = true`
2. Migration becomes callable by **anyone** (permissionless)
3. `realNativeReserve` + `tokensForLiquidity` → Uniswap V3 pool
4. LP NFT minted → transferred to `0xdead`
5. If HOLDERS mode: `pendingHolderPool` swept to a fresh `HolderRewardsDistributor`

See [Graduation →](/contracts/graduation).

---

## Interactive Example

Launch with target `4.2 ETH` (Base Sepolia):

| Stage | Tokens Sold | Native Reserve | Price (ETH) |
|---|---|---|---|
| Launch | 0 | 0 | 0.0000000013 |
| 25% | 200M | ~0.24 | 0.0000000021 |
| 50% | 400M | ~0.79 | 0.0000000063 |
| 75% | 600M | ~1.86 | 0.0000000332 |
| 100% (graduate) | 800M | 4.2 | 0.00000115 |

---

## Presets

Recommended targets by native asset:

| Native | Recommended targets |
|---|---|
| **USDC** (Arc) | 2,500 / 5,000 / 10,000 / 20,000 |
| **ETH** (Base) | 2 / 4.2 / 8.5 / 15 |
| **BOT** (BOT Chain) | 500 / 1,000 / 2,000 / 5,000 |

Custom targets are allowed within a safe range — the launch form validates `0 < target ≤ 1,000,000`.

---

## Choosing a Target

### Small target (e.g. 2 ETH)

- Graduates fast
- Lower price ceiling
- Easier to reach
- Good for testing or low-expectation agents

### Mid target (e.g. 4.2 ETH)

- Balanced
- Moderate price rise
- Achievable for popular agents

### Large target (e.g. 15 ETH)

- Slow to graduate
- Higher price ceiling
- Signals confidence
- Risky if there's no demand

::: tip Realistic expectations
Most agents don't hit 15 ETH on a testnet. Pick a target that's ambitious but reachable for your community size. The multiplier only matters if you actually get there.
:::

---

## Reading Curve State

From the API:

```bash
curl https://qurve.online/api/agents/5042002/42/price
```

```json
{
  "currentPrice": "420000000000",
  "totalSold": "670000000000000000000000000",
  "reserveBalance": "2680000000000000000",
  "progress": "0.67",
  "graduated": false,
  "graduationThreshold": "4200000000000000000"
}
```

Directly on-chain:

```ts
const [price, sold, reserve, graduated] = await Promise.all([
  client.readContract({ address: curve, abi: AgentBondingCurveABI, functionName: "currentPrice" }),
  client.readContract({ address: curve, abi: AgentBondingCurveABI, functionName: "tokensSold" }),
  client.readContract({ address: curve, abi: AgentBondingCurveABI, functionName: "realEthReserve" }),
  client.readContract({ address: curve, abi: AgentBondingCurveABI, functionName: "graduated" }),
]);
```

---

## Next

- [Reward Modes →](/launch/reward-modes)
- [Graduation →](/contracts/graduation)
- [Trades API →](/api/trades)
