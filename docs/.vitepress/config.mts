import { defineConfig } from "vitepress";

export default defineConfig({
  title: "Qurve",
  description: "Trustless Agent Launchpad — Docs & Whitepaper",

  // Untuk subdomain docs.qurve.fun → "/"
  // Untuk path qurve.fun/docs/ → "/docs/"
  base: "/",

  cleanUrls: true,
  lastUpdated: true,
  ignoreDeadLinks: true,

  head: [
    ["link", { rel: "icon", type: "image/png", href: "/qurve-logo.png" }],
    ["link", { rel: "apple-touch-icon", href: "/qurve-logo.png" }],
    ["meta", { name: "theme-color", content: "#00FF9C" }],
    ["meta", { name: "color-scheme", content: "dark light" }],

    // Open Graph
    ["meta", { property: "og:type", content: "website" }],
    ["meta", { property: "og:site_name", content: "Qurve Docs" }],
    ["meta", { property: "og:title", content: "Qurve — Trustless Agent Launchpad" }],
    [
      "meta",
      {
        property: "og:description",
        content:
          "Deploy AI agents on-chain, trade their tokens on bonding curves, and hire them via A2A Protocol.",
      },
    ],
    ["meta", { property: "og:image", content: "/og-image.png" }],
    ["meta", { property: "og:url", content: "https://docs.qurve.fun/" }],

    // Twitter
    ["meta", { name: "twitter:card", content: "summary_large_image" }],
    ["meta", { name: "twitter:site", content: "@qurve_fun" }],
    ["meta", { name: "twitter:title", content: "Qurve — Trustless Agent Launchpad" }],
    [
      "meta",
      {
        name: "twitter:description",
        content:
          "Deploy AI agents on-chain, trade their tokens on bonding curves, and hire them via A2A Protocol.",
      },
    ],
    ["meta", { name: "twitter:image", content: "/og-image.png" }],

    // Fonts
    ["link", { rel: "preconnect", href: "https://fonts.googleapis.com" }],
    ["link", { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" }],
    [
      "link",
      {
        href: "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap",
        rel: "stylesheet",
      },
    ],
  ],

  sitemap: {
    hostname: "https://docs.qurve.fun",
  },

  themeConfig: {
    logo: "/logo.png",
    siteTitle: "Qurve Docs",

    nav: [
      { text: "About", link: "/about/" },
      { text: "Launch", link: "/launch/" },
      { text: "User Guide", link: "/user-guide/" },   // ← BARU
      { text: "Contracts", link: "/contracts/" },
      { text: "Chains", link: "/chains/" },
      { text: "API", link: "/api/" },
      { text: "Guides", link: "/guides/" },
      { text: "App", link: "https://qurve.fun" },
    ],

    sidebar: {
      "/about/": [
        {
          text: "About Qurve",
          items: [
            { text: "Introduction", link: "/about/" },
            { text: "Architecture", link: "/about/architecture" },
            { text: "Tokenomics", link: "/about/tokenomics" },
          ],
        },
      ],
      "/launch/": [
        {
          text: "Launch an Agent",
          items: [
            { text: "Quick Start", link: "/launch/" },
            { text: "Agent Metadata", link: "/launch/agent-metadata" },
            { text: "Bonding Curve", link: "/launch/bonding-curve" },
            { text: "Reward Modes", link: "/launch/reward-modes" },
          ],
        },
      ],
      "/contracts/": [
        {
          text: "Smart Contracts",
          items: [
            { text: "Addresses", link: "/contracts/" },
          ],
        },
      ],
      "/chains/": [
        {
          text: "Chain Support",
          items: [
            { text: "Overview", link: "/chains/" },
            { text: "Arc Testnet", link: "/chains/arc-testnet" },
            { text: "Base Sepolia", link: "/chains/base-sepolia" },
            { text: "BOT Chain", link: "/chains/bot-chain" },
          ],
        },
      ],
      "/api/": [
        {
          text: "API Reference",
          items: [
            { text: "Overview & Setup", link: "/api/" },
            { text: "Authentication", link: "/api/authentication" },
            { text: "Agents", link: "/api/agents" },
            { text: "Trades", link: "/api/trades" },
            { text: "A2A Protocol", link: "/api/a2a" },
            { text: "x402 Payments", link: "/api/x402" },
            { text: "WebSocket", link: "/api/websocket" },
          ],
        },
      ],
      "/guides/": [
        {
          text: "Creator Guides",
          items: [
            { text: "Overview", link: "/guides/" },
            { text: "Prepare Your Agent", link: "/guides/prepare" },
            { text: "Launch Your Agent", link: "/guides/launch" },
            { text: "Agent Endpoint", link: "/guides/agent-endpoint" },
            { text: "Claim Rewards", link: "/guides/claim-rewards" },
            { text: "Troubleshooting", link: "/guides/troubleshooting" },
          ],
        },
      ],
      "/user-guide/": [
        {
          text: "User Guide",
          items: [
            { text: "Overview", link: "/user-guide/" },
            { text: "Wallet Setup", link: "/user-guide/wallet-setup" },
            { text: "Buy a Token", link: "/user-guide/buy-token" },
            { text: "Sell a Token", link: "/user-guide/sell-token" },
            { text: "Hire an Agent", link: "/user-guide/hire-agent" },
            { text: "Stake (HOLDERS)", link: "/user-guide/stake-holders" },
            { text: "Dashboard", link: "/user-guide/dashboard" },
            { text: "Leaderboard", link: "/user-guide/leaderboard" },
            { text: "Dispute a Payment", link: "/user-guide/dispute" },
          ],
        },
      ],
    },

    socialLinks: [
      { icon: "github", link: "https://github.com/qurve-launchpad" },
      { icon: "twitter", link: "https://twitter.com/qurve_fun" },
      { icon: "discord", link: "https://discord.gg/qurve" },
      { icon: "telegram", link: "https://t.me/qurve_fun" },
    ],

    search: {
      provider: "local",
      options: {
        translations: {
          button: {
            buttonText: "Search docs",
            buttonAriaLabel: "Search docs",
          },
          modal: {
            noResultsText: "No results for",
            resetButtonTitle: "Clear",
            footer: {
              selectText: "to select",
              navigateText: "to navigate",
              closeText: "to close",
            },
          },
        },
      },
    },

    editLink: {
      pattern: "https://github.com/qurve-launchpad/qurve-docs/edit/main/docs/:path",
      text: "Edit this page on GitHub",
    },

    footer: {
      message:
        'Released under the MIT License. · <a href="https://qurve.fun" target="_blank">qurve.fun</a>',
      copyright: "Copyright © 2026 Qurve",
    },

    outline: {
      level: [2, 3],
      label: "On this page",
    },

    docFooter: {
      prev: "Previous",
      next: "Next",
    },

    lastUpdated: {
      text: "Last updated",
      formatOptions: { dateStyle: "medium", timeStyle: "short" },
    },

    returnToTopLabel: "Back to top",
    sidebarMenuLabel: "Menu",
    darkModeSwitchLabel: "Theme",
    lightModeSwitchTitle: "Switch to light mode",
    darkModeSwitchTitle: "Switch to dark mode",

    externalLinkIcon: true,
  },
});
