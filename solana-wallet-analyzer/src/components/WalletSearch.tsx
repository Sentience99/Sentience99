import { useState, FormEvent } from 'react'

interface Props {
  onAnalyze: (address: string) => void
  isLoading: boolean
  onReset: () => void
  hasData: boolean
}

const EXAMPLE_WALLETS = [
  { label: 'Solana Foundation', address: 'AZDtNpfcUvfPXAkJSEFMDLiWjDqMiVjSs8qnDuVzGMXv' },
  { label: 'Demo Whale', address: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM' },
]

export default function WalletSearch({ onAnalyze, isLoading, onReset, hasData }: Props) {
  const [input, setInput] = useState('')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    onAnalyze(input)
  }

  function handleExample(address: string) {
    setInput(address)
    onAnalyze(address)
  }

  function handleReset() {
    setInput('')
    onReset()
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-solana-purple">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </div>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter Solana wallet address..."
              disabled={isLoading}
              className="w-full bg-solana-card border border-solana-border rounded-xl pl-11 pr-4 py-4
                text-sm font-mono text-gray-200 placeholder-gray-500
                focus:outline-none focus:border-solana-purple focus:ring-1 focus:ring-solana-purple
                disabled:opacity-60 transition-all duration-200"
            />
          </div>

          {hasData ? (
            <button
              type="button"
              onClick={handleReset}
              className="px-5 py-4 rounded-xl border border-solana-border text-gray-400
                hover:border-red-500 hover:text-red-400 transition-all duration-200 text-sm font-medium"
            >
              Clear
            </button>
          ) : null}

          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-6 py-4 rounded-xl font-semibold text-sm
              bg-gradient-to-r from-solana-purple to-solana-green
              text-black hover:opacity-90 disabled:opacity-50
              transition-all duration-200 whitespace-nowrap"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Analyzing...
              </span>
            ) : (
              'Analyze'
            )}
          </button>
        </div>
      </form>

      {!hasData && !isLoading && (
        <div className="mt-3 flex items-center gap-2 flex-wrap">
          <span className="text-xs text-gray-500">Try:</span>
          {EXAMPLE_WALLETS.map((w) => (
            <button
              key={w.address}
              onClick={() => handleExample(w.address)}
              className="text-xs px-3 py-1.5 rounded-lg bg-solana-card border border-solana-border
                text-gray-400 hover:text-solana-purple hover:border-solana-purple transition-all duration-200"
            >
              {w.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
