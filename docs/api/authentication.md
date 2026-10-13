# Authentication

Qurve's API is mostly public. Only admin endpoints require authentication.

---

## Public Endpoints

The following endpoints are **completely public** — no auth headers required:

- All `GET /api/agents/*`
- `POST /api/trade/quote`
- `POST /api/trade/build`
- All `GET /api/stats/*`
- `GET /api/oracle/*`
- `POST /api/a2a/quote`
- `POST /api/a2a/use`
- `GET /api/x402/config`
- All `GET /api/x402/user/*`
- All `GET /api/user/*`
- All `GET /api/rewards/*`
- `POST /api/reputation/feedback`
- `POST /api/upload/image`

Users identify themselves by passing their **wallet address** in the request body or query string. There's no session — the frontend passes the connected wallet address on every request.

---

## Admin Endpoints

Endpoints under `/api/admin/*` require an API key.

### Header

```
x-admin-key: <ADMIN_API_KEY>
```

Or:

```
Authorization: Bearer <ADMIN_API_KEY>
```

### Behavior

| Environment | `ADMIN_API_KEY` set | Behavior |
|---|---|---|
| Development | No | Allow all (dev convenience) |
| Development | Yes | Require header match |
| Production | No | Return `503 Service Unavailable` |
| Production | Yes | Require header match |

::: warning Fail-closed in production
If `ADMIN_API_KEY` is not set in production, admin endpoints return `503` instead of allowing access. This prevents accidental exposure when someone forgets to configure the env var.
:::

### Setting the key

On the backend `.env`:

```bash
ADMIN_API_KEY=your-secret-key-min-16-chars
```

Generate a strong key:

```bash
openssl rand -hex 32
```

### Example

```bash
curl -X POST "https://qurve.online/api/admin/graduation/retry/5042002/42" \
  -H "x-admin-key: your-secret-key"
```

---

## Admin Endpoint List

| Endpoint | Description |
|---|---|
| `POST /api/admin/graduation/retry/:chainId/:agentId` | Force retry a graduation |
| `POST /api/admin/graduation/run/:chainId` | Run graduation cycle now |
| `GET /api/admin/graduation/failed/:chainId` | List failed graduations |
| `DELETE /api/admin/graduation/reset/:chainId/:agentId` | Reset attempts counter |
| `POST /api/x402/admin/payments/:id/resolve-dispute` | Resolve an x402 dispute |
| `POST /api/x402/admin/payments/:id/force-forward` | Force forward a stuck payment |
| `GET /api/x402/admin/health` | Payment system health |
| `GET /api/x402/admin/gateway/balances` | Seller Gateway balances |
| `POST /api/x402/admin/gateway/withdraw` | Withdraw from Gateway |

Full list in each section:

- [Agents →](/api/agents)
- [x402 →](/api/x402)

---

## User Identity

User-scoped endpoints identify the user by wallet address:

```bash
curl "https://qurve.online/api/user/holdings/0x1234...?chainId=5042002"
```

The address is **case-insensitive** — the backend normalizes to lowercase internally.

::: tip No signature required (yet)
Public user endpoints don't require signature verification. They only return public on-chain data (holdings, claimables, balances). Adding a signature-based auth layer for sensitive actions (like disputes) is on the roadmap.
:::

---

## CORS

The backend allows CORS from origins specified in `CORS_ORIGINS`:

```bash
CORS_ORIGINS=https://qurve.fun,https://www.qurve.fun,http://localhost:5173
```

Comma-separated list. Requests from other origins are rejected by the browser.

---

## WebSocket Auth

The WebSocket endpoint at `wss://qurve.online/ws` is **public** — no auth required. Clients subscribe to channels after connecting:

```js
ws.send(JSON.stringify({ type: "subscribe", channel: "chain:5042002" }));
```

See [WebSocket →](/api/websocket) for full channel list.

---

## Security Best Practices

### For API consumers

1. **Never expose your admin key** in client-side code
2. **Rotate keys** if compromised
3. **Use HTTPS only** for production
4. **Rate limit your own requests** to stay under the 100/min cap

### For the Qurve team

1. **Admin key stored in env vars** — never in git
2. **Different keys** for dev vs production
3. **Fail-closed** in production if key missing
4. **Audit logs** on all admin actions (`logger.warn` with IP + path)

---

## Next

- [Agents →](/api/agents)
- [WebSocket →](/api/websocket)
