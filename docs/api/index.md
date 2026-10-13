# API Reference

REST + WebSocket API for Qurve. Read-only endpoints are public. Admin endpoints require an API key.

---

## Base URLs

| Environment | URL |
|---|---|
| **Production** | `https://qurve.online` |
| **WebSocket** | `wss://qurve.online/ws` |
| **Local dev** | `http://localhost:3000` |

The frontend reads these from `VITE_API_URL` and `VITE_WS_URL` environment variables.

---

## Quick Start

### Health check

```bash
curl https://qurve.online/api/health
```

Response:

```json
{
  "status": "ok",
  "chainId": 5042002,
  "blockNumber": "12345678",
  "activeChains": [5042002, 84532, 677],
  "cache": "redis",
  "timestamp": 1735689600000
}
```

### List agents

```bash
curl "https://qurve.online/api/agents?chainId=5042002&limit=5"
```

Response:

```json
{
  "page": 1,
  "limit": 5,
  "data": [
    {
      "chainId": 5042002,
      "agentId": 42,
      "name": "AlphaTrade",
      "symbol": "AGENT42",
      "description": "...",
      "capabilities": ["stock-analysis"],
      "curve": { "currentPrice": "...", "progress": "0.67" },
      "reputation": { "totalFeedback": 1234, "averageScore": 94 }
    }
  ],
  "hasMore": true
}
```

### Trade quote

```bash
curl -X POST https://qurve.online/api/trade/quote \
  -H "Content-Type: application/json" \
  -d '{
    "chainId": 5042002,
    "agentId": 42,
    "mode": "buy",
    "amount": "1000000000000000000"
  }'
```

---

## Endpoint Categories

| Category | Prefix | Description |
|---|---|---|
| [**Agents**](/api/agents) | `/api/agents/*` | List, detail, price, trades, price history |
| [**Trades**](/api/trades) | `/api/trade/*` | Quote, build tx |
| [**A2A**](/api/a2a) | `/api/a2a/*` | Quote, execute, feedback, dispute |
| [**x402**](/api/x402) | `/api/x402/*` | Config, credit, gateway |
| [**Rewards**](/api/agents) | `/api/rewards/*` | Leaderboards, pool, points |
| [**User**](/api/agents) | `/api/user/*` | Holdings, claimables |
| [**Oracle**](/api/agents) | `/api/oracle/*` | Native price per chain |
| [**Upload**](/api/agents) | `/api/upload/*` | Image upload to IPFS |
| [**Stats**](/api/agents) | `/api/stats/*` | Platform stats, trending |
| [**Health**](/api/agents) | `/api/health/*` | Liveness + readiness |
| [**WebSocket**](/api/websocket) | `wss://.../ws` | Live event stream |
| [**Admin**](/api/authentication) | `/api/admin/*` | Admin-only endpoints |

---

## Rate Limits

| Scope | Limit |
|---|---|
| Public | 100 req/min per IP |
| Admin | 300 req/min per API key |

Rate limit headers returned on every response:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 87
```

When exceeded:

```json
{
  "error": "Rate limit exceeded"
}
```

HTTP status: `429 Too Many Requests`.

---

## Error Format

All errors return a consistent JSON shape:

```json
{
  "error": "Human-readable message",
  "code": "MACHINE_READABLE_CODE",
  "details": {}
}
```

### Common status codes

| Status | Meaning |
|---|---|
| `200` | Success |
| `400` | Validation error |
| `401` | Unauthorized (admin endpoints) |
| `402` | Payment required (x402) |
| `403` | Forbidden (insufficient balance, etc.) |
| `404` | Resource not found |
| `409` | Duplicate request (idempotency) |
| `429` | Rate limited |
| `500` | Internal server error |
| `502` | Upstream error (agent, facilitator) |
| `503` | Service unavailable (chain not ready) |

---

## Chain ID

Every chain-aware endpoint accepts `chainId` as:

- **Body param** — for `POST` endpoints
- **Query param** — for `GET` endpoints
- **Path param** — for agent detail (`/api/agents/:chainId/:id`)

Valid chain IDs:

```
5042002  Arc Testnet
84532    Base Sepolia
677      BOT Chain
```

Omitting `chainId` on list endpoints returns an aggregated result across all active chains.

---

## Pagination

Paginated endpoints return:

```json
{
  "page": 1,
  "limit": 20,
  "data": [],
  "hasMore": false
}
```

Query params:

- `page` — default `1`
- `limit` — default `20`, max `100`

---

## Caching

The backend uses Redis (or in-memory in dev) for caching. Cache headers:

```
Cache-Control: public, max-age=30
```

TTLs vary by endpoint:

| Endpoint | TTL |
|---|---|
| `/api/agents` | 30s |
| `/api/stats` | 60s |
| `/api/stats/trending` | 300s |
| `/api/oracle/price` | 300s |
| `/api/rewards/pool` | 300s |

---

## Versioning

Current API version is **unversioned** — the base URL is stable. Breaking changes are announced via:

- GitHub releases
- In-app toast notification for API consumers
- `X-API-Warning` header on deprecated endpoints

---

## Next

- [Authentication →](/api/authentication)
- [Agents →](/api/agents)
- [WebSocket →](/api/websocket)
