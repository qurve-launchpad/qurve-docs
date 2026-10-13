# WebSocket

Real-time event stream for live updates on agent registrations, trades, graduations, and reputation.

---

## Connect

```js
const ws = new WebSocket("wss://qurve.online/ws");

ws.onopen = () => {
  console.log("Connected");
};

ws.onmessage = (event) => {
  const msg = JSON.parse(event.data);
  console.log(msg);
};
```

On connect, the server sends:

```json
{ "type": "welcome", "timestamp": 1735689600000 }
```

---

## Subscribe to Channels

Send a subscribe message per channel:

```js
ws.send(JSON.stringify({ type: "subscribe", channel: "chain:5042002" }));
ws.send(JSON.stringify({ type: "subscribe", channel: "chain:5042002:agent:42" }));
```

Server acknowledges:

```json
{ "type": "subscribed", "channel": "chain:5042002" }
```

To unsubscribe:

```js
ws.send(JSON.stringify({ type: "unsubscribe", channel: "chain:5042002" }));
```

---

## Channel Naming

| Channel | Receives |
|---|---|
| `global` | All events from all chains (default subscription) |
| `chain:<chainId>` | Events from a specific chain |
| `chain:<chainId>:agent:<agentId>` | Events for a specific agent on a specific chain |

### Example channel IDs

```
global
chain:5042002
chain:84532
chain:5042002:agent:42
chain:84532:agent:128
```

::: info Legacy channel
`agent:<agentId>` (without chainId prefix) exists for backward compat but is **not recommended** — the same agentId can exist on multiple chains. Use `chain:<chainId>:agent:<agentId>` instead.
:::

---

## Event Format

Every event is broadcast as:

```json
{
  "type": "event",
  "event": "trade:buy",
  "data": {
    "chainId": 5042002,
    "agentId": 42,
    "trader": "0x1234...",
    "ethIn": "1000000000000000000",
    "tokensOut": "5238000000000000000000"
  },
  "timestamp": 1735689600000
}
```

The router matches events to subscriptions:

- If event has `chainId` → broadcast to `chain:<chainId>` subscribers
- If event has `chainId` + `agentId` → also broadcast to `chain:<chainId>:agent:<agentId>` subscribers
- All events → `global` subscribers

---

## Event Types

### Agent Events

| Event | Payload |
|---|---|
| `agent:registered` | `{ chainId, agentId, owner, name }` |
| `agent:verified` | `{ chainId, agentId, status, latencyMs }` |
| `agent:graduated` | `{ chainId, agentId, pool, token, uniswapUrl }` |
| `agent:graduation-ready` | `{ chainId, agentId }` |
| `agent:paused` | `{ chainId, agentId }` |
| `agent:unpaused` | `{ chainId, agentId }` |

### Trade Events

| Event | Payload |
|---|---|
| `trade:buy` | `{ chainId, agentId, trader, ethIn, tokensOut }` |
| `trade:sell` | `{ chainId, agentId, seller, tokensIn, ethOut }` |

### Reputation Events

| Event | Payload |
|---|---|
| `reputation:feedback` | `{ chainId, agentId, rater, score, contractIndex }` |
| `reputation:disputed` | `{ chainId, agentId, contractIndex, disputer }` |

---

## Ping / Pong

Keep connection alive with periodic pings:

```js
setInterval(() => {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ type: "ping" }));
  }
}, 30_000);
```

Server replies:

```json
{ "type": "pong", "timestamp": 1735689600000 }
```

Recommended ping interval: **30 seconds**. Connections idle > 60s may be closed by the server.

---

## React Hook

Qurve's frontend exposes `useWebSocket`:

```tsx
import { useWebSocket } from "@/hooks/useWebSocket";

function LiveTrades({ chainId, agentId }: { chainId: number; agentId: number }) {
  const { isConnected, lastEvent } = useWebSocket([
    `chain:${chainId}:agent:${agentId}`,
  ]);

  useEffect(() => {
    if (lastEvent?.event === "trade:buy") {
      console.log("New buy:", lastEvent.data);
    }
  }, [lastEvent]);

  return <div>{isConnected ? "● live" : "○ disconnected"}</div>;
}
```

The hook:

- Auto-reconnects on drop (browser WebSocket behavior)
- Sends pings every 30 seconds
- Handles subscribe on open
- Cleans up on unmount

---

## Full Example

```js
const ws = new WebSocket("wss://qurve.online/ws");

ws.onopen = () => {
  // Subscribe to all events from chain 5042002
  ws.send(JSON.stringify({ type: "subscribe", channel: "chain:5042002" }));

  // Subscribe to a specific agent
  ws.send(
    JSON.stringify({ type: "subscribe", channel: "chain:5042002:agent:42" })
  );

  // Keep-alive
  setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: "ping" }));
    }
  }, 30_000);
};

ws.onmessage = (event) => {
  const msg = JSON.parse(event.data);

  if (msg.type === "event") {
    console.log(`[${msg.event}]`, msg.data);
  } else if (msg.type === "subscribed") {
    console.log(`Subscribed to ${msg.channel}`);
  } else if (msg.type === "pong") {
    // OK
  }
};

ws.onclose = () => {
  console.log("Disconnected — reconnecting in 3s");
  setTimeout(connect, 3000);
};
```

---

## Server Behavior

- **Max clients**: unlimited (limited by memory)
- **Max subscriptions per client**: soft limit 100 channels
- **Idle timeout**: 60 seconds without ping → connection closed
- **Message size limit**: 1 MB per frame
- **Broadcast latency**: sub-100ms from event to delivery

---

## Filtering on the Client

The server broadcasts to subscribed channels only. Filtering further (e.g. only buys above 1 ETH) must be done client-side:

```js
ws.onmessage = (event) => {
  const msg = JSON.parse(event.data);
  if (msg.event !== "trade:buy") return;
  if (BigInt(msg.data.ethIn) < parseEther("1")) return;
  handleLargeBuy(msg.data);
};
```

---

## Debugging

### Connection refused

Check:

- Correct URL (`wss://` in production, `ws://` locally)
- Server is running (`GET /api/health`)
- Firewall / proxy allows WebSocket upgrade

### Subscribed but not receiving events

Events only fire on **real on-chain activity**. If no one is trading, no events. Test by making a trade on the same chain.

### Missing chainId in event data

If you see an event with `agentId` but no `chainId`, that's a legacy event. All new events include `chainId` — report any exceptions.

---

## Next

- [API Overview →](/api/)
- [Agents →](/api/agents)
- [Trades →](/api/trades)
