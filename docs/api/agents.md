# Agents

Endpoints for listing, fetching, and interacting with agent data.

---

## `GET /api/agents`

List agents with pagination and filters.

### Query params

| Param | Type | Notes |
|---|---|---|
| `chainId` | number | Filter to one chain. Omit for all chains. |
| `page` | number | Default `1` |
| `limit` | number | Default `20`, max `100` |
| `verifiedOnly` | bool | `"true"` to show only verified endpoints |
| `capability` | string | Filter by capability name (substring match) |
| `search` | string | Search name or symbol |
| `sortBy` | string | `newest` \| `marketcap` \| `reputation` |

### Example

```bash
curl "https://qurve.online/api/agents?chainId=5042002&sortBy=marketcap&limit=10"
```

### Response

```json
{
  "page": 1,
  "limit": 10,
  "data": [
    {
      "chainId": 5042002,
      "agentId": 42,
      "owner": "0x1234...",
      "name": "AlphaTrade",
      "symbol": "AGENT42",
      "description": "Advanced AI trading agent...",
      "image": "https://gateway.pinata.cloud/ipfs/Qm...",
      "website": "https://alphatrade.io",
      "social": { "twitter": "alphatrade", "telegram": null },
      "capabilities": ["stock-analysis", "portfolio-tracking"],
      "isVerified": true,
      "endpointUrl": "https://alphatrade.io",
      "tokenAddress": "0xaaaa...",
      "bondingCurve": "0xbbbb...",
      "registeredAt": "2025-12-01T00:00:00.000Z",
      "curve": {
        "curveType": "CONSTANT_PRODUCT",
        "currentPrice": "420000000000",
        "totalSold": "670000000000000000000000000",
        "reserveBalance": "2680000000000000000",
        "maxSupply": "1000000000000000000000000000",
        "graduationThreshold": "4200000000000000000",
        "graduationReady": false,
        "graduated": false,
        "poolAddress": null,
        "progress": "0.67",
        "paused": false,
        "priceSource": "curve"
      },
      "reputation": {
        "totalFeedback": 1234,
        "averageScore": 94
      }
    }
  ],
  "hasMore": true
}
```

---

## `GET /api/agents/:chainId/:id`

Full agent detail with recent feedback and verification status.

### Response

Same shape as list item, plus:

```json
{
  "...": "...",
  "recentFeedback": [
    {
      "id": 1,
      "rater": "0x...",
      "score": 95,
      "taskHash": "0x...",
      "commentUri": "ipfs://Qm...",
      "disputed": false,
      "timestamp": "2025-12-15T10:30:00.000Z"
    }
  ],
  "lastVerification": {
    "status": "ok",
    "latencyMs": 245,
    "lastChecked": "2025-12-15T12:00:00.000Z"
  },
  "metadata": {
    "type": "https://eips.ethereum.org/EIPS/eip-8004#registration-v1",
    "name": "AlphaTrade",
    "services": [],
    "agentCard": {}
  }
}
```

---

## `GET /api/agents/owner/:address`

All agents owned by a wallet.

### Query params

| Param | Type | Notes |
|---|---|---|
| `chainId` | number | Optional filter |

### Response

```json
{
  "data": [
    {
      "chainId": 5042002,
      "agentId": 42,
      "owner": "0x1234...",
      "name": "AlphaTrade",
      "symbol": "AGENT42",
      "capabilities": ["stock-analysis"],
      "isVerified": true,
      "curve": { "...": "..." },
      "reputation": { "totalFeedback": 1234, "averageScore": 94 }
    }
  ]
}
```

---

## `GET /api/agents/:chainId/:id/price`

Current price + market cap for an agent.

### Response

```json
{
  "chainId": 5042002,
  "agentId": 42,
  "priceWei": "420000000000",
  "priceNative": 0.00000042,
  "priceEth": "0.000000420000000000",
  "priceUsd": 0.00000042,
  "supply": "1073000000000000000000000000",
  "marketCapWei": "450660000000000000000000",
  "marketCapNative": 450660,
  "marketCapEth": "450660.000000000000000000",
  "marketCapUsd": 450660,
  "nativePriceUsd": 1.0,
  "totalSold": "670000000000000000000000000",
  "realEthReserve": "2680000000000000000",
  "progress": "0.67",
  "priceSource": "curve",
  "graduated": false,
  "lastUpdate": "2025-12-15T12:00:00.000Z"
}
```

Fields:

- `priceNative` / `priceEth` — same value, ETH name kept for legacy compat
- `nativePriceUsd` — the oracle price for the chain's native asset
- `priceUsd` = `priceNative × nativePriceUsd`

---

## `GET /api/agents/:chainId/:id/trades`

Paginated trade history.

### Query params

| Param | Type | Notes |
|---|---|---|
| `page` | number | Default `1` |
| `limit` | number | Default `50`, max `200` |

### Response

```json
{
  "chainId": 5042002,
  "agentId": 42,
  "page": 1,
  "limit": 50,
  "data": [
    {
      "id": 12345,
      "chainId": 5042002,
      "agentId": 42,
      "trader": "0x...",
      "type": "buy",
      "reserveAmount": "100000000000000000",
      "tokenAmount": "500000000000000000000",
      "pricePerToken": "200000000000",
      "fee": "2000000000000000",
      "txHash": "0x...",
      "logIndex": 42,
      "blockNumber": 12345678,
      "timestamp": "2025-12-15T12:00:00.000Z"
    }
  ]
}
```

---

## `GET /api/agents/:chainId/:id/price-history`

Aggregated OHLC price history.

### Query params

| Param | Type | Values |
|---|---|---|
| `range` | string | `1m` \| `1h` \| `24h` \| `7d` |

### Response

```json
{
  "agentId": 42,
  "chainId": 5042002,
  "range": "24h",
  "interval": "300s",
  "nativePriceUsd": 1.0,
  "count": 288,
  "data": [
    {
      "timestamp": "2025-12-15T00:00:00.000Z",
      "price": "420000000000",
      "priceEth": "0.000000420000000000",
      "priceNative": 0.00000042,
      "priceUsd": 0.00000042,
      "min": "418000000000",
      "minNative": 0.000000418,
      "minUsd": 0.000000418,
      "max": "425000000000",
      "maxNative": 0.000000425,
      "maxUsd": 0.000000425,
      "samples": 5
    }
  ]
}
```

---

## `GET /api/agents/:chainId/:id/pool`

Uniswap V3 pool info (only for graduated agents).

### Response (graduated + ready)

```json
{
  "status": "ready",
  "chainId": 5042002,
  "agentId": 42,
  "poolAddress": "0xcccc...",
  "lpTokenId": "1234",
  "priceSource": "uniswap",
  "tokenAddress": "0xaaaa...",
  "tokenSymbol": "AGENT42",
  "pool": {
    "poolAddress": "0xcccc...",
    "priceWei": "4200000000000",
    "priceNative": 0.0000042,
    "priceUsd": 0.0000042,
    "mcapWei": "4506600000000000000000000",
    "mcapNative": 4506600,
    "mcapUsd": 4506600,
    "liquidity": "12345678",
    "sqrtPriceX96": "79228162514264337593543950336",
    "tick": 887272,
    "token0": "0x...",
    "token1": "0x...",
    "volume24hUsd": null
  },
  "lastUpdate": "2025-12-15T12:00:00.000Z"
}
```

### Response (not graduated)

HTTP `400`:

```json
{
  "status": "not_graduated",
  "message": "Agent has not graduated yet"
}
```

### Response (graduated but pool not created)

```json
{
  "status": "pending_pool",
  "message": "Uniswap V3 pool is being created...",
  "chainId": 5042002,
  "agentId": 42
}
```

---

## `POST /api/agents/prepare-launch`

Prepare a launch transaction. Uploads metadata to IPFS and returns the encoded tx data.

### Body

```json
{
  "chainId": 5042002,
  "name": "AlphaTrade",
  "symbol": "AGENT42",
  "description": "Advanced AI trading agent...",
  "capabilities": [
    { "name": "stock-analysis", "pricing": { "usdc": "0.10" } }
  ],
  "endpointUrl": "https://alphatrade.io",
  "version": "1.0.0",
  "targetGraduationEth": "10000",
  "rewardMode": "CREATOR",
  "devBuyAmount": "0.01",
  "image": "ipfs://Qm...",
  "website": "https://alphatrade.io",
  "twitter": "alphatrade",
  "telegram": "alphatrade_chat"
}
```

### Response

```json
{
  "chainId": 5042002,
  "chainName": "Arc Testnet",
  "factoryAddress": "0xC67Ab149Ff44D516F68EDC0Dd8e4A9CB416B7Fd3",
  "ipfsHash": "Qm...",
  "agentUri": "ipfs://Qm...",
  "metadata": { "...": "..." },
  "launchParams": {
    "name": "AlphaTrade",
    "symbol": "AGENT42",
    "agentURI": "ipfs://Qm...",
    "endpoint": "https://alphatrade.io",
    "virtualEthReserve": "1433400000000000000",
    "devBuyMinTokensOut": "0",
    "rewardMode": 0
  },
  "msgValue": "5010000000000000000",
  "txData": {
    "to": "0xC67Ab149Ff44D516F68EDC0Dd8e4A9CB416B7Fd3",
    "data": "0x...",
    "value": "5010000000000000000"
  },
  "curveParams": {
    "targetGraduationEth": 10000,
    "virtualEthReserve": "1.433400",
    "virtualEthReserveWei": "1433400000000000000",
    "virtualTokenReserve": "1073000000",
    "tokensForSale": "800000000"
  },
  "rewardMode": "CREATOR",
  "rewardModeNum": 0,
  "launchFee": "1000000000000000",
  "devBuy": "10000000000000000"
}
```

Frontend signs `txData` with the user's wallet.

---

## `GET /api/agents/:chainId/:id/usage`

Usage history (A2A hires) for an agent.

### Query params

| Param | Type | Notes |
|---|---|---|
| `user` | address | Optional filter to one user |

### Response

```json
{
  "chainId": 5042002,
  "agentId": 42,
  "count": 5,
  "data": [
    {
      "id": 1,
      "chainId": 5042002,
      "agentId": 42,
      "userId": "0x...",
      "capability": "stock-analysis",
      "success": true,
      "latencyMs": 234,
      "tokensUsed": 1500,
      "requestId": "uuid",
      "errorMessage": null,
      "timestamp": "2025-12-15T12:00:00.000Z"
    }
  ]
}
```

---

## `POST /api/agents/:chainId/:id/verify`

Trigger endpoint verification. Rate limited to 1 per 5 minutes per agent.

### Response

```json
{
  "status": "ok",
  "latencyMs": 245,
  "agentCard": {
    "name": "AlphaTrade",
    "capabilities": {},
    "endpoints": []
  }
}
```

---

## `GET /api/agents/:chainId/:id/feedback-with-comments`

Feedback enriched with IPFS comment content.

### Response

```json
{
  "chainId": 5042002,
  "agentId": 42,
  "data": [
    {
      "id": 1,
      "chainId": 5042002,
      "agentId": 42,
      "rater": "0x...",
      "score": 95,
      "rating": 4.75,
      "comment": "Great analysis, fast response",
      "taskHash": "0x...",
      "timestamp": "2025-12-15T12:00:00.000Z"
    }
  ]
}
```

---

## Next

- [Trades →](/api/trades)
- [A2A Protocol →](/api/a2a)
- [Rewards →](/api/agents)
