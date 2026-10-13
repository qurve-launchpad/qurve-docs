# Reward Modes

Every Qurve agent has one of two reward modes — chosen by the creator at launch and **immutable forever**.

---

## Overview

Every trade on Qurve generates a **flex fee** (1% pre-graduation, 0.5% post-graduation). The mode determines where this fee goes:

| Mode | Flex destination | Best for |
|---|---|---|
| **CREATOR** | Creator's pending balance | Monetization-first launches |
| **HOLDERS** | Per-token staking pool | Community-driven agents |

::: warning Immutable
The mode is set in the curve's `rewardMode` field (immutable). Neither the creator nor the platform can change it post-launch.
:::

---

## CREATOR Mode (rewardMode = 0)

### How it works

1. Every trade routes the flex fee to `pendingCreatorClaim` in the curve contract
2. Creator calls `claimCreatorFees()` from their wallet
3. Claimed native amount is transferred directly to the creator

### Post-graduation

Post-graduation swaps through `AgentSwapRouter` also route the flex share directly to the creator's pending balance.

### Claim flow

From the Qurve dashboard → Creator Rewards → Claim, or directly:

```ts
await walletClient.writeContract({
  address: curveAddress,
  abi: AgentBondingCurveABI,
  functionName: "claimCreatorFees",
});
```

### Pros & cons

- ✅ Simple — no staking contract needed
- ✅ Predictable revenue for the creator
- ✅ Works during curve phase and post-graduation
- ❌ No holder incentive to hold long-term
- ❌ Higher sell pressure if holders have no reason to stay

---

## HOLDERS Mode (rewardMode = 1)

### How it works

1. **During curve phase**: flex fee accrues to `pendingHolderPool` in the curve contract
2. **At graduation**: the entire accumulated pool is swept to a freshly-deployed `HolderRewardsDistributor` in one lump sum
3. **Post-graduation**: every swap through `AgentSwapRouter` calls `notifyRewardAmount()` on the distributor, streaming new rewards continuously
4. **Holders stake** their tokens in the distributor
5. **Rewards accrue** proportionally to staked balance (accumulator pattern)

### Grace period

The distributor holds the initial lump sum for **2 days** before it becomes claimable. During this window:

- Users can stake but can't claim
- Prevents first-staker sniping the entire pool

After 2 days, `finalizeInitialPool()` is callable by anyone, which distributes the lump sum proportionally to stakers at that moment.

### Unstake cooldown

20-minute cooldown per stake. When you unstake, your `unstakeAvailableAt` is set to `now + 20min`. You can't unstake again until the cooldown expires — prevents flash-stake attacks.

### Claim flow

From the Qurve staking page, or directly:

```ts
// Stake
await walletClient.writeContract({
  address: distributor,
  abi: HolderRewardsDistributorABI,
  functionName: "stake",
  args: [amount],
});

// Claim rewards
await walletClient.writeContract({
  address: distributor,
  abi: HolderRewardsDistributorABI,
  functionName: "claim",
});
```

### Pros & cons

- ✅ Aligns holders — staking reduces sell pressure
- ✅ Rewards compound with every swap
- ✅ Community building via shared upside
- ❌ Requires more on-chain infrastructure (distributor contract)
- ❌ Creator earns 0 from flex fees post-graduation

---

## Choosing a Mode

### Pick CREATOR if...

- You're building an agent primarily for revenue
- You expect low holder engagement
- You want simple, predictable income
- You don't want to manage a community

### Pick HOLDERS if...

- You're building a community-first agent
- You want long-term holder alignment
- You're comfortable with shared upside
- You believe in staking as a retention mechanism

---

## Fee Comparison

### During Curve Phase (2% total)

| Mode | Platform | Flex | Flex goes to |
|---|---|---|---|
| CREATOR | 1% | 1% | Creator pending |
| HOLDERS | 1% | 1% | Holder pool pending |

### Post-Graduation (1% total)

| Mode | Platform | Flex | Flex goes to |
|---|---|---|---|
| CREATOR | 0.5% | 0.5% | Creator pending |
| HOLDERS | 0.5% | 0.5% | Distributor (streaming) |

---

## On-Chain Detection

Read the mode from the curve:

```ts
const rewardMode = await client.readContract({
  address: curveAddress,
  abi: AgentBondingCurveABI,
  functionName: "rewardMode",
});
// 0 = CREATOR, 1 = HOLDERS
```

Or from the launch event:

```solidity
event AgentLaunched(
  uint256 indexed agentId,
  address indexed creator,
  address token,
  address curve,
  string name,
  string symbol,
  uint256 virtualEthReserve,
  uint256 graduationThreshold,
  bool antiSnipeEnabled,
  uint8 rewardMode
);
```

---

## Staking Mechanics (HOLDERS mode)

### Global State

| Variable | Meaning |
|---|---|
| `totalStaked` | Sum of all user stakes |
| `accRewardPerShare` | Cumulative reward per staked token (scaled 1e18) |
| `totalRewardsDistributed` | Lifetime rewards added |
| `totalClaimed` | Lifetime rewards claimed |
| `unallocatedInitialPool` | Initial lump sum not yet finalized |
| `initialPoolFinalized` | Whether the 2-day grace has elapsed |

### Per-User State

| Variable | Meaning |
|---|---|
| `stakedBalance` | User's stake |
| `rewardDebt` | Accumulator snapshot at last action |
| `stakedAt` | Timestamp of last stake |
| `totalClaimedBy` | User's lifetime claims |

### Pending Reward Formula

```text
pending = stakedBalance × accRewardPerShare / 1e18 - rewardDebt
```

Plus, if `initialPoolFinalized` was just called for the first time since you staked, an additional lump sum is added proportionally.

### View Functions

```solidity
function earned(address user) external view returns (uint256);

function getUserInfo(address user) external view returns (
    uint256 staked,
    uint256 pendingReward,
    uint256 claimed,
    uint256 unstakeAvailableAt
);

function getGlobalStats() external view returns (
    uint256 totalStaked_,
    uint256 totalRewardsDistributed_,
    uint256 totalClaimed_,
    uint256 totalPendingRewards_,
    uint256 unallocatedInitialPool_,
    bool initialPoolFinalized_
);
```

---

## Anti-Snipe Note

If you launch with anti-snipe enabled and HOLDERS mode, the first few seconds of buys pay extra fee. This extra fee also accrues to the holder pool — a small bonus for early stakers.

Anti-snipe is a separate launch-time toggle, independent of reward mode.

---

## What If the Curve Never Graduates?

If a HOLDERS-mode curve never graduates:

- Flex keeps accumulating in the curve contract
- Holders can't claim (no distributor exists yet)
- After 30 days with no activity, `sweepAbandonedHolderPool()` becomes callable

The swept amount goes back to the platform. This prevents funds from being permanently locked if a community never materializes.

For CREATOR mode, no such issue — creator can claim anytime regardless of graduation.

---

## Next

- [Graduation →](/contracts/graduation)
- [Claim Rewards Guide →](/guides/claim-rewards)
- [Bonding Curve →](/launch/bonding-curve)
