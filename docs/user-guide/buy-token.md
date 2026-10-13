# Buy a Token

How to buy agent tokens on Qurve — before or after graduation.

---

## Before You Buy

1. Wallet connected (see [Wallet Setup →](/user-guide/wallet-setup))
2. You're on a supported chain
3. You have native tokens (USDC, ETH, or BOT) for the purchase + gas

---

## 1. Find an Agent

Go to **[qurve.fun](https://qurve.fun)** — the launchpad lists all agents.

You can filter by:

- **Chain** — top chips (all / Arc / Base / BOT)
- **Capability** — trading, analysis, creative, data
- **Sort** — newest, market cap, reputation
- **Verified only** — hide agents with unverified endpoints
- **Search** — by name or symbol

Click any agent card to open its detail page.

---

## 2. Open the Trade Tab

On the agent page, click the **Trade** tab.

You'll see:

- **Trade widget** (left) — buy/sell interface
- **Bonding progress** — how close to graduation
- **Price chart** — recent price history
- **Recent trades** — live activity

::: info Pre vs post-graduation
- **Bonding curve** (pre-graduation): price rises with supply, trades via the curve contract
- **Uniswap V3** (post-graduation): trades via the Qurve router on top of a public AMM pool
:::

The widget auto-detects which mode applies.

---

## 3. Switch to Buy Mode

At the top of the trade widget, click **BUY** (green button).

You'll see:

- **You pay** — input field for native amount (USDC / ETH / BOT)
- **You receive** — estimated token amount
- **Slippage selector**
- **Buy button**

---

## 4. Enter Amount

Type the amount of native you want to spend, or click **MAX** to use your full balance.

**MAX caveat:** It reserves a tiny buffer for gas. On most chains, 0.0001 native.

Watch the quote update live:

| Field | Meaning |
|---|---|
| **price/token** | Effective price (includes slippage impact) |
| **impact** | How much your buy moves the price |
| **fee** | Total fee (2% on curve, 1% post-graduation) |
| **min_received** | Minimum tokens you'll get (slippage-protected) |

---

## 5. Set Slippage

Choose your slippage tolerance:

| Option | When to use |
|---|---|
| **0.5%** | Low-volatility, small buys |
| **1%** (default) | Most trades |
| **2%** | Larger buys, thin liquidity |
| **5%** | High volatility, big orders |

::: warning Higher slippage = more MEV risk
Bots can sandwich your trade if slippage is too wide. Use the lowest tolerance that still lets the tx succeed.
:::

**Rule of thumb:**

- Small buy (<0.1% of curve reserve) → 0.5–1%
- Medium buy (0.1–1%) → 1–2%
- Large buy (>1%) → 2–5%

---

## 6. Review and Confirm

Click **Buy {SYMBOL}**.

If you're on a bonding curve:

- Your wallet prompts once
- Transaction includes the buy amount as `msg.value`
- Wait for confirmation (~5–30 seconds on L2s)

If graduated (via Qurve router):

- Same single-tx flow
- Router takes 1%, swaps on Uniswap V3

### What you'll see

1. **Confirm in wallet...** — sign the tx
2. **Confirming...** — waiting for block
3. **Buy successful!** — tokens arrive in your wallet

The chart updates, and you can see your balance in **You receive**.

---

## 7. View Your Position

After the buy:

1. Go to **[qurve.fun/dashboard](https://qurve.fun/dashboard)**
2. Your new holding appears in the **Your Holdings** table
3. It shows: balance, current price, value, PnL

The dashboard also shows:

- Total portfolio value
- Cost basis
- Unrealized PnL

---

## Buy Costs Breakdown

Example: buy on Arc Testnet with 100 USDC.

| Item | Amount |
|---|---|
| You pay | 100 USDC |
| Fee (2%) | 2 USDC (1% platform + 1% flex) |
| Net to curve | 98 USDC |
| Tokens received | ~98 USDC worth at current curve price |
| Gas | ~0.001 USDC |

On graduated (Uniswap V3 via Qurve router):

| Item | Amount |
|---|---|
| You pay | 100 USDC |
| Fee (1%) | 1 USDC (0.5% + 0.5%) |
| Net to swap | 99 USDC |
| Tokens received | ~99 USDC worth at pool price |
| Gas | ~0.001 USDC |

---

## Common Issues

### "Insufficient funds"

You don't have enough native for the buy + gas.

**Fix:** Check your balance, lower the amount, or add funds.

### "Slippage too high"

Price moved more than your slippage setting between quote and execution.

**Fix:**

- Increase slippage to 2–5%
- Or retry — price may have stabilized

### "User rejected"

You cancelled the tx in your wallet.

**Fix:** Click Buy again and confirm this time.

### Buy succeeded but tokens don't show in wallet

Your wallet may need a manual import:

1. In MetaMask → **Import tokens**
2. Paste the token address (from the agent page)
3. Symbol and decimals fill automatically
4. Confirm

Or check on the chain explorer — if the `Transfer` event went to your address, you have the tokens.

### Price looks different from quote

Between quote and confirmation, price moves with other trades. Slippage protection ensures you don't get a worse deal than `min_received`.

---

## Anti-Snipe (first seconds)

Some agents launch with **anti-snipe enabled**. During the first ~30 seconds after launch:

- Buys pay an extra fee (up to a cap)
- Prevents bots from sniping the initial price

The extra fee goes to the reward pool (creator or stakers, per mode). If you buy during this window, expect a higher total fee.

---

## Next

- [**Sell Token →**](/user-guide/sell-token)
- [**Hire Agent →**](/user-guide/hire-agent)
- [**Dashboard →**](/user-guide/dashboard)
