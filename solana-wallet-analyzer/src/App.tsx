import { useWalletAnalyzer } from './hooks/useWalletAnalyzer'
import WalletSearch from './components/WalletSearch'
import PortfolioSummary from './components/PortfolioSummary'
import TokenList from './components/TokenList'
import TransactionHistory from './components/TransactionHistory'
import LoadingSkeleton from './components/LoadingSkeleton'

export default function App() {
  const { walletData, loadingState, error, analyze, reset } = useWalletAnalyzer()

  const isLoading = loadingState === 'loading'
  const hasData = loadingState === 'success' && walletData !== null

  return (
    <div className="min-h-screen bg-solana-dark">
      {/* Background grid */}
      <div
        className="fixed inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(#9945FF 1px, transparent 1px), linear-gradient(90deg, #9945FF 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-10">
        {/* Header */}
        <header className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-solana-purple to-solana-green flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M4 18h16M4 12h16M4 6h16"
                  stroke="black"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold gradient-text">Solana Wallet Analyzer</h1>
          </div>
          <p className="text-sm text-gray-500">
            Analyze any Solana wallet — balances, tokens, and transaction history
          </p>
        </header>

        {/* Search */}
        <div className="mb-8">
          <WalletSearch
            onAnalyze={analyze}
            isLoading={isLoading}
            onReset={reset}
            hasData={hasData}
          />
        </div>

        {/* Error State */}
        {error && !isLoading && (
          <div className="bg-red-900/20 border border-red-800 rounded-2xl p-5 mb-6 flex items-start gap-3">
            <svg
              className="text-red-400 flex-shrink-0 mt-0.5"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <div>
              <p className="text-sm font-medium text-red-300">Analysis Failed</p>
              <p className="text-xs text-red-400 mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {/* Loading */}
        {isLoading && <LoadingSkeleton />}

        {/* Results */}
        {hasData && walletData && (
          <div className="space-y-6">
            <PortfolioSummary data={walletData} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TokenList tokens={walletData.tokenAccounts} />
              <TransactionHistory transactions={walletData.transactions} />
            </div>

            {/* Footer attribution */}
            <p className="text-center text-xs text-gray-600 pb-4">
              Data from Solana mainnet · Prices from Jupiter &amp; CoinGecko ·{' '}
              <a
                href={`https://solscan.io/account/${walletData.address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-solana-purple hover:underline"
              >
                View on Solscan
              </a>
            </p>
          </div>
        )}

        {/* Idle state hint */}
        {loadingState === 'idle' && (
          <div className="text-center py-16 text-gray-600">
            <svg
              className="mx-auto mb-4 opacity-20"
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            >
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
            <p className="text-sm">Enter a Solana wallet address to get started</p>
          </div>
        )}
      </div>
    </div>
  )
}
