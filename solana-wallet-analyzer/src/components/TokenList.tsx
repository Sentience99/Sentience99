import { useState } from 'react'
import type { TokenAccount } from '../types'

interface Props {
  tokens: TokenAccount[]
}

function formatUsd(value: number): string {
  if (value >= 1_000_000) return '$' + (value / 1_000_000).toFixed(2) + 'M'
  if (value >= 1_000) return '$' + (value / 1_000).toFixed(2) + 'K'
  if (value < 0.01) return '<$0.01'
  return '$' + value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function TokenLogo({ logoURI, symbol }: { logoURI?: string; symbol: string }) {
  const [imgFailed, setImgFailed] = useState(false)

  if (logoURI && !imgFailed) {
    return (
      <img
        src={logoURI}
        alt={symbol}
        className="w-8 h-8 rounded-full object-cover"
        onError={() => setImgFailed(true)}
      />
    )
  }

  return (
    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-solana-purple to-solana-green
      flex items-center justify-center text-xs font-bold text-black">
      {symbol.slice(0, 2).toUpperCase()}
    </div>
  )
}

export default function TokenList({ tokens }: Props) {
  const [showAll, setShowAll] = useState(false)

  if (tokens.length === 0) {
    return (
      <div className="glow-border bg-solana-card rounded-2xl p-6">
        <h2 className="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2">
          <span className="text-solana-green">◆</span> Token Holdings
        </h2>
        <p className="text-sm text-gray-500 text-center py-6">No SPL tokens found in this wallet</p>
      </div>
    )
  }

  const displayed = showAll ? tokens : tokens.slice(0, 8)

  return (
    <div className="glow-border bg-solana-card rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-gray-300 flex items-center gap-2">
          <span className="text-solana-green">◆</span> Token Holdings
          <span className="text-xs text-gray-500 font-normal">({tokens.length})</span>
        </h2>
      </div>

      <div className="space-y-2">
        {displayed.map((token) => (
          <div
            key={token.mint}
            className="flex items-center gap-3 p-3 rounded-xl bg-solana-dark hover:bg-opacity-80 transition-colors"
          >
            <TokenLogo logoURI={token.logoURI} symbol={token.symbol} />

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-semibold text-white">{token.symbol}</span>
              </div>
              <p className="text-xs text-gray-500 truncate">{token.name}</p>
            </div>

            <div className="text-right">
              <p className="text-sm font-medium text-gray-200">{token.uiBalance}</p>
              {token.valueUsd !== undefined && token.valueUsd > 0 ? (
                <p className="text-xs text-solana-green">{formatUsd(token.valueUsd)}</p>
              ) : (
                <p className="text-xs text-gray-600">No price</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {tokens.length > 8 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full mt-3 py-2.5 rounded-xl text-xs text-gray-400
            border border-solana-border hover:border-solana-purple hover:text-solana-purple
            transition-all duration-200"
        >
          {showAll ? 'Show less' : `Show ${tokens.length - 8} more tokens`}
        </button>
      )}
    </div>
  )
}
