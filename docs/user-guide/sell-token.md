# Sell a Token

How to exit a position — before or after graduation.

---

## Before You Sell

1. Wallet connected
2. You're on the same chain where you bought the tokens
3. You hold the agent token (balance > 0)

Check balance on **[qurve.fun/dashboard](https://qurve.fun/dashboard)**.

---

## 1. Open the Trade Tab

Go to the agent page → **Trade** tab.

---

## 2. Switch to Sell Mode

Click **SELL** (red button) in the trade widget.

You'll see:

- **You sell** — input for token amount
- **You receive** — estimated native amount
- **Slippage selector**
- **Sell button**

---

## 3. Approve (First Time Only)

The first time you sell a specific token, your wallet will ask for an **approval** transaction:

```
Function: approve(spender, amount)
```

This lets the curve (or router, if graduated) move your tokens. It's a standard ERC-20 pattern.

**Two transactions:**

1. **Approve** — one-time per token per spender
2. **Sell** — actual sale

After the first approval, future sells are single-tx.

::: tip Approval amount
Qurve requests approval for the exact amount you're selling (not unlimited). Safer than `approve(max)`.
:::

---

## 4. Enter Amount

Type the token amount or click **MAX** to sell everything.

The quote shows:

| Field | Meaning |
|---|---|
| **price/token** | Effective sale price |
| **impact** | Price impact of your sale |
| **fee** | Total fee (2% curve, 1% post-graduation) |
| **min_received** | Minimum native you'll get |

---

## 5. Set Slippage

Same as buying:

| Option | When |
|---|---|
| **0.5%** | Small sells |
| **1%** (default) | Most |
| **2%** | Larger sells |
| **5%** | Big or volatile |

---

## 6. Confirm

Click **Sell {SYMBOL}**.

Flow:

1. If not approved yet — **Approve** (first tx)
2. **Confirm in wallet...** — sell tx
3. **Confirming...** — waiting
4. **Sell successful!** — native tokens arrive

---

## 7. Verify

After the sell:

- Native balance increases in your wallet
- Token balance decreases
- Dashboard shows updated PnL

---

## Sell Costs

Example: sell on Arc Testnet for 100 USDC worth of tokens.

| Item | Amount |
|---|---|
| You sell | ~100 tokens worth |
| Fee (2%) | 2 USDC |
| You receive | ~98 USDC |
| Gas | ~0.001 USDC |

Post-graduation (via Qurve router):

| Item | Amount |
|---|---|
| You sell | tokens |
| Fee (1%) | 1 USDC |
| You receive | ~99 USDC |
| Gas | ~0.002 USDC |

---

## Sell Post-Graduation

After graduation, the token trades on Uniswap V3. Two routes to sell:

### Route 1 — Qurve router (recommended)

- 1% fee (0.5% platform + 0.5% flex)
- Flex fee goes to creator/stakers
- Keeps the reward flow alive

### Route 2 — Uniswap V3 direct

- 0.3% pool fee (accrues to locked LP)
- No Qurve fee
- You skip the reward flow

The Qurve UI always routes through the router. To use Uniswap direct, go to [app.uniswap.org](https://app.uniswap.org) and paste the token address.

::: tip Which is better?
For you, direct Uniswap is 0.7% cheaper. For the ecosystem, Qurve router supports creators and stakers. Both are valid — pick based on your values.
:::

---

## Common Issues

### "Insufficient token balance"

You're trying to sell more than you have.

**Fix:** Click MAX to sell exactly your balance, or lower the amount.

### "Approval failed"

The approve tx reverted. Causes:

- Insufficient gas
- Wallet rejected it

**Fix:** Retry with higher gas, or cancel and try again.

### "Transfer failed" or "slippage"

The pool couldn't execute at your min_received.

**Fix:**

- Increase slippage
- Split into smaller sells
- Retry when volatility settles

### Sell went through but native balance didn't increase

Check the chain explorer for the tx. If it succeeded:

- Native is in your wallet (refresh the app)
- Some wallets cache balances — restart the wallet

### Still can't sell after graduation

Make sure:

- You're on the right chain
- The pool has liquidity (`/agent/:chainId/:id/pool` should return `ready`)
- You're not hitting max slippage limits

---

## Partial Sells

You can sell any amount up to your balance. Common strategies:

- **Take profit** — sell enough to recover cost basis, keep the rest
- **Scale out** — sell in chunks as price rises
- **Full exit** — sell everything

Qurve doesn't have limit orders or stop losses. All sells are market orders.

---

## Next

- [**Dashboard →**](/user-guide/dashboard)
- [**Hire Agent →**](/user-guide/hire-agent)
