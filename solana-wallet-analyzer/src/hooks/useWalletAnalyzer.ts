import { useState, useCallback } from 'react'
import type { WalletData, LoadingState } from '../types'
import { fetchWalletData, isValidSolanaAddress } from '../services/solana'

export function useWalletAnalyzer() {
  const [walletData, setWalletData] = useState<WalletData | null>(null)
  const [loadingState, setLoadingState] = useState<LoadingState>('idle')
  const [error, setError] = useState<string | null>(null)

  const analyze = useCallback(async (address: string) => {
    const trimmed = address.trim()
    if (!trimmed) {
      setError('Please enter a wallet address')
      return
    }
    if (!isValidSolanaAddress(trimmed)) {
      setError('Invalid Solana wallet address')
      return
    }

    setLoadingState('loading')
    setError(null)
    setWalletData(null)

    try {
      const data = await fetchWalletData(trimmed)
      setWalletData(data)
      setLoadingState('success')
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to fetch wallet data'
      setError(message)
      setLoadingState('error')
    }
  }, [])

  const reset = useCallback(() => {
    setWalletData(null)
    setLoadingState('idle')
    setError(null)
  }, [])

  return { walletData, loadingState, error, analyze, reset }
}
