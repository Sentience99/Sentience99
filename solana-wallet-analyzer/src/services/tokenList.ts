export interface TokenMeta {
  address: string
  symbol: string
  name: string
  decimals: number
  logoURI?: string
}

// Cached token metadata from Jupiter token list
let tokenCache: Map<string, TokenMeta> | null = null

export async function getTokenList(): Promise<Map<string, TokenMeta>> {
  if (tokenCache) return tokenCache

  try {
    const res = await fetch('https://token.jup.ag/strict')
    if (!res.ok) throw new Error('Failed to fetch token list')
    const tokens: TokenMeta[] = await res.json()
    tokenCache = new Map(tokens.map((t) => [t.address, t]))
    return tokenCache
  } catch {
    // Return empty map as fallback
    tokenCache = new Map()
    return tokenCache
  }
}

export async function getTokenMeta(mint: string): Promise<TokenMeta | null> {
  const list = await getTokenList()
  return list.get(mint) ?? null
}
