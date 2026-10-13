# Stake (HOLDERS Mode)

Earn rewards by staking HOLDERS-mode agent tokens. Rewards come from a share of every trade fee.

---

## What is Staking?

Some agents launch with **HOLDERS mode** — meaning the 1% flex fee on every trade goes to a **holder reward pool**, not the creator.

To earn from that pool, you **stake** your tokens in a per-token `HolderRewardsDistributor`.

- Staking = locking tokens to earn a proportional share
- Rewards = native tokens (USDC / ETH / BOT), not new emissions
- The more you stake, the larger your share

---

## Which Tokens Can Be Staked?

Only agents launched with `rewardMode = HOLDERS`.

Check an agent:

1. Open agent page
2. Look at the header — you'll see a badge:
   - **⛁ Holder Rewards** → can be staked
   - **◎ Creator Rewards** → not stakeable

Or check the staking pools page: **[qurve.fun/stake](https://qurve.fun/stake)**

---

## 1. Find a Staking Pool

Go to **[qurve.fun/stake](https://qurve.fun/stake)**.

You'll see all HOLDERS-mode tokens on the current chain:

- Token address (shortened)
- Total staked
- Pending rewards
- Stake button

Click a pool to open its staking page.

Or navigate from the agent page: **Graduated Token View** → **Go to Staking**.

---

## 2. Open the Staking Page

URL format: `/stake/:chainId/:tokenAddress`

Page shows:

- **Token header** — name, symbol, mode badge
- **Pool stats** — total staked, distributed, claimed, pending
- **Staking widget** — your stake, stake/unstake, claim button

---

## 3. Stake Tokens

### First-time approval

Before staking, you need to approve the distributor to move your tokens:

1. Enter amount to stake
2. Click **Stake {SYMBOL}**
3. First tx: **Approve** (one-time)
4. Second tx: **Stake**

Subsequent stakes only need one tx.

### Amount

- Click **MAX** to stake your full balance
- Or enter a specific amount

### Confirm

1. **Approving token...** — first-time approval
2. **Staking...** — actual stake tx
3. **Staked!** — balance shows in your position

Your staked balance appears in the **Your Stake** box.

---

## 4. Earn Rewards

Once staked, rewards accrue **continuously** as swaps happen on the token.

The **Pending Reward** box shows your current unclaimed rewards, updating in real-time (refreshes every 20 seconds).

### How rewards accrue

Every swap on this token:

- 0.5% flex fee → added to the reward pool
- Distributed proportionally to all stakers
- Your share = `yourStake / totalStaked`

If you staked early and staked more, you earn more.

---

## 5. Claim Rewards

When pending rewards > 0, a **Claim** button appears.

Click it:

1. **Claiming rewards...** — sign in wallet
2. **Rewards claimed!** — native tokens arrive

Rewards are paid in the chain's native token:

| Chain | Rewards paid in |
|---|---|
| Arc Testnet | USDC |
| Base Sepolia | ETH |
| BOT Chain | BOT |

No cooldown, no minimum — claim anytime.

---

## 6. Unstake

To get your tokens back:

1. Switch to **UNSTAKE** mode
2. Enter amount or click **MAX**
3. Click **Unstake**

### Cooldown

There's a **20-minute cooldown** per stake. You can't unstake twice within 20 minutes.

If cooldown is active, you'll see a warning:

```
⏱ Unstake cooldown active — wait 12m
```

Wait for the timer to hit zero, then retry.

---

## The 2-Day Grace Period

When an agent **first graduates**, the entire accumulated flex fee from the curve phase is sent to a new distributor in one lump sum.

That lump sum sits in the distributor for **2 days** before it becomes claimable by stakers.

### Why?

To prevent "first-staker sniping" — someone staking just before graduation to grab the entire accumulated pool.

### What happens during grace

- You can **stake** immediately
- You **can't claim** the lump sum portion until grace ends
- Swaps during grace still stream fresh rewards normally

### After 2 days

`finalizeInitialPool()` can be called (by anyone) — the lump sum is distributed proportionally to stakers at that moment.

You'll see a banner in the UI when the pool is finalized.

---

## Stake Rewards Example

Imagine:

- Token has 10,000 total staked
- Every swap generates ~$1 flex fee
- 100 swaps per day = ~$100/day into the pool

| Your stake | Your daily share |
|---|---|
| 100 tokens | ~$1/day |
| 1,000 tokens | ~$10/day |
| 5,000 tokens | ~$50/day |

**Note:** these numbers assume your stake is 1% / 10% / 50% of the total. Your actual share depends on total staked.

### APR thinking

Rough APR = `(daily reward × 365) / (your stake value) × 100%`

If daily reward = $1 and your stake is worth $100 → APR ≈ 365% (extreme example, but shows the math).

Real APR depends on volume. Low-volume tokens have low APR. High-volume tokens have high APR.

---

## Pool Stats Explained

| Stat | Meaning |
|---|---|
| **Total Staked** | Sum of all stakers' tokens |
| **Distributed** | Lifetime rewards added to pool |
| **Claimed** | Lifetime rewards claimed |
| **Pending** | Currently claimable (not yet claimed) |
| **Unfinalized** | Initial lump sum still in grace period |

---

## Common Issues

### "No staking pool"

Token wasn't launched with HOLDERS mode.

**Fix:** Check another token. Look for the ⛁ badge.

### Can't claim yet

Either:

- You have 0 pending rewards
- The initial lump sum is still in the 2-day grace period

Wait a few minutes, refresh, try again.

### Unstake cooldown stuck

Cooldown is per stake, 20 minutes. If you staked twice within 20 min, the later cooldown applies.

Wait it out or just leave the tokens staked (they keep earning).

### Rewards seem small

Rewards depend on trading volume. Low-volume agents generate little.

**Fix:** Stake in higher-volume agents, or promote the token to attract volume.

### "Insufficient balance"

You're staking more than you hold.

**Fix:** Click MAX, or lower the amount.

---

## Multi-Chain Staking

Each chain has its own pools. If you stake on Arc Testnet, your stake is on Arc.

To stake the same token on a different chain, you need those tokens on that chain (bridges not supported — tokens are chain-local).

Claim gas is paid in the chain's native token.

---

## Next

- [**Dashboard →**](/user-guide/dashboard)
- [**Leaderboard →**](/user-guide/leaderboard)
