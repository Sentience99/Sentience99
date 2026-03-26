import type { Transaction } from '../types'

interface Props {
  transactions: Transaction[]
}

const TX_ICONS: Record<string, string> = {
  swap: '⇄',
  send: '↑',
  receive: '↓',
  nft: '◈',
  unknown: '•',
}

const TX_COLORS: Record<string, string> = {
  swap: 'text-solana-purple',
  send: 'text-red-400',
  receive: 'text-solana-green',
  nft: 'text-yellow-400',
  unknown: 'text-gray-400',
}

function formatTime(timestamp: number | null): string {
  if (!timestamp) return 'Unknown'
  const date = new Date(timestamp * 1000)
  const now = Date.now()
  const diff = now - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return date.toLocaleDateString()
}

function shortenSig(sig: string): string {
  return sig.slice(0, 8) + '...' + sig.slice(-6)
}

export default function TransactionHistory({ transactions }: Props) {
  if (transactions.length === 0) {
    return (
      <div className="glow-border bg-solana-card rounded-2xl p-6">
        <h2 className="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2">
          <span className="text-solana-purple">◆</span> Recent Transactions
        </h2>
        <p className="text-sm text-gray-500 text-center py-6">No transactions found</p>
      </div>
    )
  }

  return (
    <div className="glow-border bg-solana-card rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-gray-300 flex items-center gap-2">
          <span className="text-solana-purple">◆</span> Recent Transactions
          <span className="text-xs text-gray-500 font-normal">({transactions.length})</span>
        </h2>
        <a
          href={`https://solscan.io/account/${''}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-gray-500 hover:text-solana-purple transition-colors"
        >
          View all →
        </a>
      </div>

      <div className="space-y-2">
        {transactions.map((tx) => (
          <div
            key={tx.signature}
            className="flex items-center gap-3 p-3 rounded-xl bg-solana-dark hover:bg-opacity-80 transition-colors"
          >
            {/* Type icon */}
            <div className={`text-xl w-8 text-center ${TX_COLORS[tx.type]}`}>
              {TX_ICONS[tx.type]}
            </div>

            {/* Description */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-200">{tx.description}</span>
                {tx.status === 'failed' && (
                  <span className="text-xs px-1.5 py-0.5 rounded bg-red-900/40 text-red-400">Failed</span>
                )}
              </div>
              <div className="flex items-center gap-3 mt-0.5">
                <a
                  href={`https://solscan.io/tx/${tx.signature}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-gray-500 hover:text-solana-purple transition-colors font-mono"
                >
                  {shortenSig(tx.signature)}
                </a>
                <span className="text-xs text-gray-600">•</span>
                <span className="text-xs text-gray-600">{formatTime(tx.blockTime)}</span>
              </div>
            </div>

            {/* Balance change */}
            <div className="text-right">
              {tx.balanceChange !== 0 && (
                <p className={`text-sm font-medium ${tx.balanceChange > 0 ? 'text-solana-green' : 'text-red-400'}`}>
                  {tx.balanceChange > 0 ? '+' : ''}{tx.balanceChange.toFixed(4)} SOL
                </p>
              )}
              <p className="text-xs text-gray-600">Fee: {(tx.fee * 1000).toFixed(3)}ms</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
