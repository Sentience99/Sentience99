import type { WalletData } from '../types'

interface Props {
  data: WalletData
}

function formatUsd(value: number): string {
  if (value >= 1_000_000) return '$' + (value / 1_000_000).toFixed(2) + 'M'
  if (value >= 1_000) return '$' + (value / 1_000).toFixed(2) + 'K'
  return '$' + value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function shortenAddress(addr: string): string {
  return addr.slice(0, 6) + '...' + addr.slice(-4)
}

export default function PortfolioSummary({ data }: Props) {
  const solPct = data.totalValueUsd > 0 ? (data.solValueUsd / data.totalValueUsd) * 100 : 100
  const tokenPct = 100 - solPct

  function copyAddress() {
    navigator.clipboard.writeText(data.address)
  }

  return (
    <div className="glow-border bg-solana-card rounded-2xl p-6 space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Wallet</p>
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm text-gray-300">{shortenAddress(data.address)}</span>
            <button
              onClick={copyAddress}
              title="Copy address"
              className="text-gray-500 hover:text-solana-purple transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
            </button>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-solana-green pulse-green" />
          <span className="text-xs text-gray-500">Live</span>
        </div>
      </div>

      {/* Total Value */}
      <div>
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Total Portfolio Value</p>
        <p className="text-4xl font-bold gradient-text">{formatUsd(data.totalValueUsd)}</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-solana-dark rounded-xl p-4">
          <p className="text-xs text-gray-500 mb-1">SOL Balance</p>
          <p className="text-lg font-semibold text-white">
            {data.solBalance.toLocaleString(undefined, { maximumFractionDigits: 4 })}
          </p>
          <p className="text-xs text-gray-400">{formatUsd(data.solValueUsd)}</p>
        </div>
        <div className="bg-solana-dark rounded-xl p-4">
          <p className="text-xs text-gray-500 mb-1">Tokens</p>
          <p className="text-lg font-semibold text-white">{data.tokenAccounts.length}</p>
          <p className="text-xs text-gray-400">SPL tokens</p>
        </div>
        <div className="bg-solana-dark rounded-xl p-4">
          <p className="text-xs text-gray-500 mb-1">SOL Price</p>
          <p className="text-lg font-semibold text-white">
            {data.solPriceUsd > 0 ? formatUsd(data.solPriceUsd) : 'N/A'}
          </p>
          <p className="text-xs text-gray-400">per SOL</p>
        </div>
      </div>

      {/* Portfolio Allocation Bar */}
      {data.tokenAccounts.length > 0 && (
        <div>
          <div className="flex justify-between text-xs text-gray-500 mb-2">
            <span>Portfolio Allocation</span>
          </div>
          <div className="w-full h-2 rounded-full bg-solana-dark overflow-hidden flex">
            <div
              className="h-full bg-solana-purple transition-all"
              style={{ width: `${solPct}%` }}
            />
            <div
              className="h-full bg-solana-green transition-all"
              style={{ width: `${tokenPct}%` }}
            />
          </div>
          <div className="flex gap-4 mt-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-solana-purple" />
              <span className="text-xs text-gray-400">SOL {solPct.toFixed(1)}%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-solana-green" />
              <span className="text-xs text-gray-400">Tokens {tokenPct.toFixed(1)}%</span>
            </div>
          </div>
        </div>
      )}

      <p className="text-xs text-gray-600">
        Updated {data.lastUpdated.toLocaleTimeString()}
      </p>
    </div>
  )
}
