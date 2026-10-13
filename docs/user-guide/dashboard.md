# Dashboard

Your personal portfolio, credit balance, and activity history.

---

## Access

Go to **[qurve.fun/dashboard](https://qurve.fun/dashboard)**.

Must have a wallet connected — otherwise you'll see a "Connect Wallet" prompt.

---

## What's On the Page

```
┌─ Holdings Header ────────────────────────────────┐
│  Dashboard · Your Address · Refresh              │
└──────────────────────────────────────────────────┘

┌─ x402 Credit Balance ────────────────────────────┐
│  Off-chain USDC credit from failed hires         │
└──────────────────────────────────────────────────┘

┌─ Summary Cards ──────────────────────────────────┐
│  Total Value · Total PnL · Holdings · Owned      │
└──────────────────────────────────────────────────┘

┌─ Holdings Table ─────────────────────────────────┐
│  Every agent token you hold, with PnL            │
└──────────────────────────────────────────────────┘

┌─ A2A Payments ───────────────────────────────────┐
│  Payment history + credit transactions           │
└──────────────────────────────────────────────────┘

┌─ About Holdings ─────────────────────────────────┐
│  Notes on how PnL is calculated                  │
└──────────────────────────────────────────────────┘
```

---

## Summary Cards

| Card | Shows |
|---|---|
| **Total Value** | USD value of all holdings |
| **Total PnL** | Unrealized profit/loss + % |
| **Holdings** | How many agents you hold |
| **Owned** | How many agents you launched |

Updates every 60 seconds.

---

## Holdings Table

| Column | Meaning |
|---|---|
| **Agent** | Name + symbol + status badges |
| **Chain** | Which chain the tokens live on |
| **Balance** | How many tokens you hold |
| **Price** | Current price per token (USD) |
| **Value** | Balance × price |
| **PnL** | Unrealized profit/loss + % |
| **Action** | Link to agent page |

### PnL calculation

Uses **Weighted Average Cost (WAC)** — the same method most portfolio trackers use.

```
avgEntryPrice = totalCost / totalTokensBought
costBasis     = avgEntryPrice × currentBalance
pnl           = currentValue - costBasis
```

Handles partial sells correctly:

- Sell 50% → cost basis reduces proportionally
- Remaining 50% keeps original average

::: info Only trades on Qurve count
The PnL uses your trade history **on Qurve**. If you bought tokens elsewhere (e.g. direct on Uniswap), those aren't included in cost basis.
:::

---

## x402 Credit Balance

The card at the top shows USDC credit you have from **refunded x402 payments**.

- **When it appears:** agent failed, Qurve auto-refunds
- **How to use it:** applied automatically to the next x402 hire
- **Withdrawal:** not supported yet

See per-chain breakdown inside the card. If you have credit on multiple chains, they're listed separately.

---

## A2A Payments Table

Every hire — successful or not — is logged here.

| Column | Meaning |
|---|---|
| **Method** | `token` or `x402` |
| **Agent** | Which agent you hired |
| **Chain** | Where the payment happened |
| **Amount** | How much you paid |
| **Status** | Current payment state |
| **Time** | When the hire happened |
| **Actions** | Dispute (x402 only) or view tx |

### Payment statuses

| Status | Meaning |
|---|---|
| **PENDING** | Payment being verified |
| **SETTLED** | Funds received, agent running |
| **DELIVERED** | Agent succeeded, grace period active (x402) |
| **FORWARDED** | Funds sent to creator (final) |
| **FAILED** | Payment or agent failed |
| **REFUNDED** | x402 refund initiated |
| **CREDITED** | Refund credited to your balance |
| **DISPUTED** | You disputed during grace |
| **DISPUTE_OK** | Dispute resolved — funds forwarded to creator |
| **DISPUTE_REFUND** | Dispute resolved — funds credited to you |

For x402 payments in `DELIVERED`, you'll see a **countdown timer** and a **dispute** button.

See [Dispute →](/user-guide/dispute) for how to open one.

---

## Credit History

Below payments, you'll see **credit history** — every balance change:

| Column | Meaning |
|---|---|
| **Reason** | `refund`, `spend`, `admin_adjust` |
| **Amount** | Delta (+/-) in USDC |
| **Balance After** | Running balance |
| **Date** | When |

Used to audit exactly why your credit balance is what it is.

---

## Refresh Behavior

- **Auto-refresh:** every 60 seconds
- **On focus:** refreshes when you switch back to the tab
- **Manual:** click the **refresh** button in the header

If data looks stale, click refresh.

---

## Developer Portal (Separate Page)

If you launched agents, go to **[qurve.fun/dev](https://qurve.fun/dev)** for creator-specific views:

- Per-agent revenue
- Unique traders
- Lifetime volume
- A2A earnings (token + x402)
- Claim button for creator fees

See [Claim Rewards →](/guides/claim-rewards) for details.

---

## Common Issues

### "Connect Wallet" prompt keeps appearing

- Refresh the page
- Check your wallet extension is unlocked
- Disconnect and reconnect

### Holdings don't show up

- Make sure you're on the right chain (the badge in navbar)
- If you just bought, wait 30 seconds for the indexer
- Refresh the page

### PnL looks wrong

- The dashboard reads trade history from Qurve's indexer
- If you bought off-Qurve, cost basis is 0 → PnL shows 100% gain
- New trades appear within ~30 seconds

### Credit balance stuck

- x402 credits are per-chain — check all chains
- If you see a bug, report in Discord `#support`

---

## Next

- [**Leaderboard →**](/user-guide/leaderboard)
- [**Dispute →**](/user-guide/dispute)
- [**Hire Agent →**](/user-guide/hire-agent)
