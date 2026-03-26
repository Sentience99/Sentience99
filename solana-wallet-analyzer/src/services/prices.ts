const COINGECKO_API = 'https://api.coingecko.com/api/v3'
const JUPITER_PRICE_API = 'https://price.jup.ag/v6/price'

export async function getSolPrice(): Promise<number> {
  try {
    const res = await fetch(
      `${COINGECKO_API}/simple/price?ids=solana&vs_currencies=usd`,
    )
    if (!res.ok) throw new Error('CoinGecko request failed')
    const data = await res.json()
    return data.solana?.usd ?? 0
  } catch {
    // Fallback to Jupiter price API
    try {
      const res = await fetch(`${JUPITER_PRICE_API}?ids=So11111111111111111111111111111111111111112`)
      if (!res.ok) throw new Error('Jupiter request failed')
      const data = await res.json()
      return data.data?.['So11111111111111111111111111111111111111112']?.price ?? 0
    } catch {
      return 0
    }
  }
}

export async function getTokenPrices(mints: string[]): Promise<Record<string, number>> {
  if (mints.length === 0) return {}
  try {
    const ids = mints.join(',')
    const res = await fetch(`${JUPITER_PRICE_API}?ids=${ids}`)
    if (!res.ok) throw new Error('Jupiter price request failed')
    const data = await res.json()
    const prices: Record<string, number> = {}
    for (const mint of mints) {
      prices[mint] = data.data?.[mint]?.price ?? 0
    }
    return prices
  } catch {
    return {}
  }
}
