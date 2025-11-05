export const TOKEN_CONTRACTS: Record<string, string | null> = {
  ethereum: null,
  eth: null,

  // Popular ERC-20 Tokens on Ethereum
  "usd-coin": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // USDC
  usdc: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",

  tether: "0xdAC17F958D2ee523a2206206994597C13D831ec7", // USDT
  usdt: "0xdAC17F958D2ee523a2206206994597C13D831ec7",

  dai: "0x6B175474E89094C44Da98b954EedeAC495271d0F", // DAI

  "wrapped-bitcoin": "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599", // WBTC
  wbtc: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",

  chainlink: "0x514910771AF9Ca656af840dff83E8264EcF986CA", // LINK
  link: "0x514910771AF9Ca656af840dff83E8264EcF986CA",

  uniswap: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984", // UNI
  uni: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",

  "matic-network": "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0", // MATIC (Polygon)
  matic: "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0",

  aave: "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9", // AAVE

  maker: "0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2", // MKR
  mkr: "0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2",

  "compound-governance-token": "0xc00e94Cb662C3520282E6f5717214004A7f26888", // COMP
  comp: "0xc00e94Cb662C3520282E6f5717214004A7f26888",

  "the-sandbox": "0x3845badAde8e6dDD04Fc662896B9c134d7B0b1Cb", // SAND
  sand: "0x3845badAde8e6dDD04Fc662896B9c134d7B0b1Cb",

  "axie-infinity": "0xBB0E17EF65F82Ab018d8EDd76eFF43D12426D15C", // AXS
  axs: "0xBB0E17EF65F82Ab018d8EDd76eFF43D12426D15C",

  decentraland: "0x0F5D2fB29fb7d3CFeE444a200298f468908cC942", // MANA
  mana: "0x0F5D2fB29fb7d3CFeE444a200298f468908cC942",

  "crypto-com-chain": "0xA0b73E1Ff0B80914AB6fe0444E65848C4C34450b", // CRO
  cro: "0xA0b73E1Ff0B80914AB6fe0444E65848C4C34450b",

  "shiba-inu": "0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE", // SHIB
  shib: "0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE",

  pepe: "0x6982508145454Ce325dDbE47a25d4ec3d2311933", // PEPE
};

/**
 * Check if a coin is supported for balance checking
 * @param coinId - CoinGecko coin ID (e.g., "ethereum", "bitcoin")
 * @returns contract address if ERC-20 token, null if native ETH, undefined if not supported
 */
export function getTokenContractAddress(
  coinId: string
): string | null | undefined {
  const normalizedId = coinId.toLowerCase();
  return TOKEN_CONTRACTS[normalizedId];
}

/**
 * Check if a coin is supported on Ethereum network
 * @param coinId - CoinGecko coin ID
 * @returns true if the coin is supported (native ETH or ERC-20), false otherwise
 */
export function isEthereumToken(coinId: string): boolean {
  return getTokenContractAddress(coinId) !== undefined;
}
