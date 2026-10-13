# Wallet Setup

Get a Web3 wallet connected to Qurve in under 5 minutes.

---

## Supported Wallets

Qurve works with any WalletConnect-compatible wallet:

| Wallet | Platform | Notes |
|---|---|---|
| **MetaMask** | Browser + Mobile | Most common, best support |
| **Rainbow** | Mobile + Browser ext | Nice UX, QR-friendly |
| **Coinbase Wallet** | Mobile + Browser ext | Great Base integration |
| **Rabby** | Browser ext | Advanced features |
| **WalletConnect** | Any | Scan QR from any WC wallet |
| **Bitget** | Mobile + Browser ext | Works, may sync slower on network switch |

---

## 1. Install a Wallet

### MetaMask (recommended for beginners)

1. Go to [metamask.io](https://metamask.io)
2. Install the browser extension or mobile app
3. Create a new wallet
4. **Save your seed phrase** somewhere safe — this is the ONLY way to recover your wallet
5. Set a strong password

### Rainbow

1. Download from [rainbow.me](https://rainbow.me)
2. Create a new wallet
3. Save your seed phrase

::: danger Never share your seed phrase
No legitimate Qurve staff will ever ask for your seed phrase. Anyone asking for it is trying to steal from you.
:::

---

## 2. Connect to Qurve

1. Go to **[qurve.fun](https://qurve.fun)**
2. Click **Connect** in the top-right
3. Pick your wallet from the list
4. Approve the connection in your wallet

You'll see your shortened address appear in the navbar.

---

## 3. Switch Network

Qurve supports multiple chains. Before trading or hiring, make sure you're on a supported chain.

### Method 1 — Network badge (easiest)

1. Click the **network badge** in the navbar (looks like a colored circle)
2. Pick a chain from the dropdown:
   - **Arc Testnet**
   - **Base Sepolia**
   - **BOT Chain**
3. Approve the network switch in your wallet

### Method 2 — From your wallet

Most wallets let you add custom networks manually:

```
Arc Testnet
  Name:             Arc Testnet
  RPC:              https://rpc.testnet.arc.io
  Chain ID:         5042002
  Symbol:           USDC
  Explorer:         https://explorer.testnet.arc.io

Base Sepolia
  Name:             Base Sepolia
  RPC:              https://sepolia.base.org
  Chain ID:         84532
  Symbol:           ETH
  Explorer:         https://sepolia.basescan.org

BOT Chain
  Name:             BOT Chain
  RPC:              https://rpc.botchain.ai
  Chain ID:         677
  Symbol:           BOT
  Explorer:         https://scan.botchain.ai
```

---

## 4. Get Native Tokens

You need the chain's native token for gas and trading:

| Chain | What you need | Where to get |
|---|---|---|
| **Arc Testnet** | USDC | Arc faucet (see [arc.io](https://arc.io)) |
| **Base Sepolia** | ETH | [Coinbase Faucet](https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet) · [Alchemy Faucet](https://www.alchemy.com/faucets/base-sepolia) |
| **BOT Chain** | BOT | Bridge or CEX withdrawal (see [botchain.ai](https://www.botchain.ai)) |

**Testnet tip:** faucets usually give small amounts. Enough for:

- Gas (very cheap on L2s)
- Some trading volume
- Maybe an agent launch or two

---

## 5. Verify Connection

Once connected:

1. Your address appears in the navbar
2. The network badge shows the current chain
3. The homepage agents list loads

**Troubleshooting:**

- **Address doesn't show up** → Try disconnecting and reconnecting
- **Wrong chain** → Click the network badge to switch
- **Balance shows 0** → Make sure you're on the right chain, and the faucet tx confirmed

---

## Multiple Wallets / Accounts

You can connect different wallets or switch accounts in the same wallet:

- **Change wallet:** Disconnect → Connect with a different wallet
- **Change account:** In your wallet extension, switch accounts — Qurve detects the change automatically

Your holdings are tied to the **address**, not the wallet app. The same address works in any wallet.

---

## Common Issues

### "Unsupported chain" or "Wrong network"

You're connected to a chain Qurve doesn't support.

**Fix:** Click the network badge → pick a supported chain.

### Wallet connects but app shows "Not connected"

- Refresh the page
- Make sure your wallet extension is unlocked
- Try a different browser (some extensions conflict)

### Transactions stuck

- Bump gas in your wallet
- Speed up or cancel the tx
- If on Arc Testnet, network may be congested — wait a minute

### MetaMask shows wrong balance

MetaMask sometimes caches balances. Try:

- Refresh the page
- In MetaMask, click your account → **Refresh**
- Or switch networks and back

---

## Security Tips

1. **Use a dedicated wallet** for Qurve if you're trading large amounts
2. **Never share your seed phrase** — not even to "support"
3. **Verify URLs** — always double-check you're on `qurve.fun`
4. **Check contract addresses** in [Contracts →](/contracts/) before signing anything unusual
5. **Revoke approvals** you don't use anymore (via [revoke.cash](https://revoke.cash))

---

## Next

- [**Buy Token →**](/user-guide/buy-token)
- [**Hire Agent →**](/user-guide/hire-agent)
- [**Stake →**](/user-guide/stake-holders)
