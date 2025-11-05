# Crypto Dashboard

A modern cryptocurrency market data dashboard built with Next.js 16, featuring real-time price updates, interactive charts, market metrics, and news integration.

## Features

- **Dynamic Routing**: Support for any cryptocurrency via `/[id]` route (e.g., `/eth`, `/btc`)
- **Server-Side Rendering**: Initial data rendered using React Server Components (RSC)
- **Auto-Refresh**: Automatic data updates every 30 seconds
- **Interactive Charts**:
  - Line and candlestick chart views
  - Bitcoin comparison overlay
  - Multiple time ranges (1H, 24H, 1W, 1M, 3M, 6M, 1Y, ALL)
- **Market Data**: Comprehensive metrics with sparkline charts
- **News Integration**: Real-time cryptocurrency news feed
- **Dark/Light Mode**: Theme switching with persistence
- **CSV Export**: Export current market data to CSV
- **Responsive Design**: Mobile-first, works on all devices
- **Type Safety**: Full TypeScript coverage with strict mode
- **Code Quality**: Pre-commit hooks for formatting, pre-push hooks for validation

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4
- **Charts**: Recharts
- **UI Components**: Custom shadcn-inspired components (Radix UI primitives)
- **API**: CoinGecko API
- **State Management**: React hooks
- **Code Quality**: ESLint, Prettier, Husky, lint-staged

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- Package manager: npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd cryptocoins-dash
```

2. Install dependencies:

```bash
bun install
# or
npm install
```

3. Set up git hooks:

```bash
make install-hooks
# or
bun run prepare
```

4. Start the development server:

```bash
bun dev
# or
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) - you'll be redirected to `/eth` by default.

## Available Scripts

- `bun dev` - Start development server
- `bun build` - Build for production
- `bun start` - Start production server
- `bun lint` - Run ESLint
- `bun format` - Format code with Prettier
- `bun format:check` - Check code formatting
- `bun precommit` - Run lint-staged (used by git hooks)
- `bun prepush` - Run format check, lint, and build (used by git hooks)

### Makefile Commands

- `make install-hooks` - Set up git hooks
- `make format` - Format all files
- `make lint` - Run linting
- `make build` - Build project
- `make check-all` - Run all checks (format, lint, build)

## Git Hooks

This project uses **Husky** and **lint-staged** for automated code quality checks:

### Pre-commit Hook

- Automatically formats staged files with Prettier
- Runs ESLint with auto-fix on staged files

### Pre-push Hook

- Checks formatting (no auto-fix)
- Runs linting
- Builds the project
- **Blocks push if any check fails**

See [GIT_HOOKS.md](./GIT_HOOKS.md) for detailed documentation.

## API Configuration

### CoinGecko API

The project uses CoinGecko's free tier API which **does not require an API key** for basic usage.

**Free Tier Limits**: 10-50 calls/minute (varies by endpoint)

**For Production Use**:

1. Sign up at https://www.coingecko.com/en/api
2. Get your API key from the dashboard
3. Add to `.env.local`:
   ```bash
   COINGECKO_API_KEY=your_api_key_here
   ```
4. Update `app/lib/api/coingecko.ts` to include the API key in requests

### News API

The CoinGecko news API endpoint (`/api/v3/news`) does not require authentication for basic usage.

**Alternative Options**:

- CryptoPanic API: https://cryptopanic.com/developers/api/
- CryptoCompare News API: https://min-api.cryptocompare.com/documentation

## Project Structure

```
cryptocoins-dash/
├── app/
│   ├── [id]/              # Dynamic route for cryptocurrency pages
│   │   ├── page.tsx       # Server component with SSR
│   │   └── not-found.tsx  # 404 page
│   ├── components/
│   │   ├── crypto/        # Crypto-specific components
│   │   ├── providers/     # Context providers (Theme, Toast)
│   │   └── ui/            # Reusable UI components
│   ├── lib/
│   │   ├── api/           # API clients (CoinGecko, News)
│   │   ├── types/         # TypeScript type definitions
│   │   └── utils/         # Utility functions
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Home page (redirects to /eth)
│   └── globals.css        # Global styles and theme variables
├── .husky/                # Git hooks
├── Makefile              # Make commands
├── eslint.config.mjs     # ESLint configuration
├── tsconfig.json         # TypeScript configuration
├── .prettierrc.json      # Prettier configuration
└── package.json          # Dependencies and scripts
```

## Usage Examples

### View Ethereum Dashboard

Navigate to `/eth` or visit the root URL (redirects to `/eth`)

### View Bitcoin Dashboard

Navigate to `/bitcoin` or `/btc`

### View Any Cryptocurrency

Navigate to `/[coin-id]` where `coin-id` is the CoinGecko coin ID

**Popular Coin IDs**:

- `ethereum` or `eth`
- `bitcoin` or `btc`
- `solana` or `sol`
- `cardano` or `ada`

## Features in Detail

### Price Chart

- Switch between line and candlestick views
- Toggle Bitcoin comparison overlay
- Select time ranges: 1H, 24H, 1W, 1M, 3M, 6M, 1Y, ALL
- Responsive design with tooltips

### Market Data

- Market cap and rank
- 24-hour volume
- Circulating and total supply
- All-time high/low with percentage changes
- Mini sparkline charts for trend visualization

### News Section

- Real-time cryptocurrency news
- Auto-refreshes every 30 seconds
- Click to read full articles

### Export to CSV

- Click "Export to CSV" button in header
- Downloads current market data as CSV file
- Includes all key metrics and export timestamp

## Code Quality

- **TypeScript**: Strict mode enabled, no `any` types allowed
- **ESLint**: Strict rules including unused imports/var detection
- **Prettier**: Consistent code formatting
- **Git Hooks**: Automated quality checks before commit/push

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Vercel will automatically detect Next.js
4. Deploy!

### Other Platforms

The project can be deployed to any platform that supports Next.js:

- Netlify
- Railway
- AWS Amplify
- Docker (see Next.js docs for Docker setup)

## Environment Variables

Create a `.env.local` file (optional):

```bash
# Optional: CoinGecko API Key (for higher rate limits)
COINGECKO_API_KEY=your_api_key_here

# Optional: Alternative News API Key
NEWS_API_KEY=your_news_api_key_here
```

**Note**: The application works without API keys using the free tier, but you may encounter rate limits during heavy usage.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run `make check-all` to ensure everything passes
5. Commit (pre-commit hook will format your code)
6. Push (pre-push hook will validate everything)
7. Create a pull request

## License

This project is part of a take-home assignment. Please refer to the original assignment requirements for usage terms.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [CoinGecko API Documentation](https://www.coingecko.com/en/api/documentation)
- [React Server Components](https://react.dev/reference/rsc/server-components)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Recharts Documentation](https://recharts.org/)
