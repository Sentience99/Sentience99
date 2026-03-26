export interface TokenAccount {
  mint: string
  symbol: string
  name: string
  decimals: number
  balance: number
  uiBalance: string
  logoURI?: string
  priceUsd?: number
  valueUsd?: number
}

export interface Transaction {
  signature: string
  blockTime: number | null
  slot: number
  fee: number
  status: 'success' | 'failed'
  type: string
  description: string
  balanceChange: number
}

export interface WalletData {
  address: string
  solBalance: number
  solPriceUsd: number
  solValueUsd: number
  tokenAccounts: TokenAccount[]
  transactions: Transaction[]
  totalValueUsd: number
  lastUpdated: Date
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error'

export interface AnalyzerState {
  walletData: WalletData | null
  loadingState: LoadingState
  error: string | null
}
