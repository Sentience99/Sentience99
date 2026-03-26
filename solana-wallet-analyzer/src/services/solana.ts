import {
  Connection,
  PublicKey,
  LAMPORTS_PER_SOL,
  ParsedAccountData,
  ConfirmedSignatureInfo,
} from '@solana/web3.js'
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import type { TokenAccount, Transaction, WalletData } from '../types'
import { getSolPrice, getTokenPrices } from './prices'
import { getTokenList } from './tokenList'

// Use public RPC endpoints (rotate on failure)
const RPC_ENDPOINTS = [
  'https://api.mainnet-beta.solana.com',
  'https://rpc.ankr.com/solana',
]

function getConnection(): Connection {
  return new Connection(RPC_ENDPOINTS[0], {
    commitment: 'confirmed',
    httpHeaders: { 'Content-Type': 'application/json' },
  })
}

export function isValidSolanaAddress(address: string): boolean {
  try {
    new PublicKey(address)
    return true
  } catch {
    return false
  }
}

export async function fetchWalletData(address: string): Promise<WalletData> {
  const connection = getConnection()
  const pubkey = new PublicKey(address)

  // Parallel: fetch SOL balance + token accounts + signatures + price data
  const [lamports, tokenAccountsRaw, signaturesRaw, solPrice, tokenList] =
    await Promise.all([
      connection.getBalance(pubkey),
      connection.getParsedTokenAccountsByOwner(pubkey, {
        programId: TOKEN_PROGRAM_ID,
      }),
      connection.getSignaturesForAddress(pubkey, { limit: 20 }),
      getSolPrice(),
      getTokenList(),
    ])

  const solBalance = lamports / LAMPORTS_PER_SOL

  // Process token accounts
  const tokenMints: string[] = []
  const rawTokens: Array<{
    mint: string
    balance: number
    decimals: number
  }> = []

  for (const { account } of tokenAccountsRaw.value) {
    const parsed = (account.data as ParsedAccountData).parsed
    const info = parsed?.info
    if (!info) continue
    const balance = info.tokenAmount?.uiAmount ?? 0
    if (balance === 0) continue
    rawTokens.push({
      mint: info.mint,
      balance,
      decimals: info.tokenAmount?.decimals ?? 0,
    })
    tokenMints.push(info.mint)
  }

  // Fetch token prices
  const tokenPrices = await getTokenPrices(tokenMints)

  // Build token accounts with metadata
  const tokenAccounts: TokenAccount[] = rawTokens.map((t) => {
    const meta = tokenList.get(t.mint)
    const priceUsd = tokenPrices[t.mint] ?? 0
    const valueUsd = t.balance * priceUsd
    return {
      mint: t.mint,
      symbol: meta?.symbol ?? t.mint.slice(0, 4) + '...',
      name: meta?.name ?? 'Unknown Token',
      decimals: t.decimals,
      balance: t.balance,
      uiBalance: formatTokenBalance(t.balance),
      logoURI: meta?.logoURI,
      priceUsd: priceUsd > 0 ? priceUsd : undefined,
      valueUsd: valueUsd > 0 ? valueUsd : undefined,
    }
  })

  // Sort tokens by USD value descending
  tokenAccounts.sort((a, b) => (b.valueUsd ?? 0) - (a.valueUsd ?? 0))

  // Fetch transaction details
  const transactions = await fetchTransactions(
    connection,
    pubkey,
    signaturesRaw,
  )

  const solValueUsd = solBalance * solPrice
  const tokenValueUsd = tokenAccounts.reduce((sum, t) => sum + (t.valueUsd ?? 0), 0)
  const totalValueUsd = solValueUsd + tokenValueUsd

  return {
    address,
    solBalance,
    solPriceUsd: solPrice,
    solValueUsd,
    tokenAccounts,
    transactions,
    totalValueUsd,
    lastUpdated: new Date(),
  }
}

async function fetchTransactions(
  connection: Connection,
  pubkey: PublicKey,
  signatures: ConfirmedSignatureInfo[],
): Promise<Transaction[]> {
  const transactions: Transaction[] = []

  // Fetch parsed transactions in batches to avoid rate limiting
  const batch = signatures.slice(0, 15)
  const results = await Promise.allSettled(
    batch.map((sig) =>
      connection.getParsedTransaction(sig.signature, {
        maxSupportedTransactionVersion: 0,
      }),
    ),
  )

  for (let i = 0; i < batch.length; i++) {
    const sig = batch[i]
    const result = results[i]

    if (result.status === 'rejected') continue
    const tx = result.value
    if (!tx) continue

    const preBalances = tx.meta?.preBalances ?? []
    const postBalances = tx.meta?.postBalances ?? []
    const accountKeys = tx.transaction.message.accountKeys

    // Find balance change for this wallet
    let balanceChange = 0
    const walletIndex = accountKeys.findIndex(
      (k) => k.pubkey.toString() === pubkey.toString(),
    )
    if (walletIndex >= 0) {
      balanceChange =
        ((postBalances[walletIndex] ?? 0) - (preBalances[walletIndex] ?? 0)) /
        LAMPORTS_PER_SOL
    }

    const fee = (tx.meta?.fee ?? 0) / LAMPORTS_PER_SOL
    const { type, description } = classifyTransaction(tx, pubkey.toString())

    transactions.push({
      signature: sig.signature,
      blockTime: sig.blockTime ?? null,
      slot: sig.slot,
      fee,
      status: tx.meta?.err ? 'failed' : 'success',
      type,
      description,
      balanceChange,
    })
  }

  return transactions
}

function classifyTransaction(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tx: any,
  walletAddress: string,
): { type: string; description: string } {
  const logMessages: string[] = tx.meta?.logMessages ?? []
  const logsStr = logMessages.join(' ').toLowerCase()
  const accountKeys: string[] = (tx.transaction.message.accountKeys ?? []).map(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (k: any) => k.pubkey?.toString() ?? k.toString(),
  )

  // Detect swap
  if (
    logsStr.includes('swap') ||
    accountKeys.includes('JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4') ||
    accountKeys.includes('whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc')
  ) {
    return { type: 'swap', description: 'Token Swap' }
  }

  // Detect NFT
  if (
    logsStr.includes('metaplex') ||
    logsStr.includes('nft') ||
    accountKeys.includes('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s')
  ) {
    return { type: 'nft', description: 'NFT Transaction' }
  }

  // Detect transfer direction
  const preBalances: number[] = tx.meta?.preBalances ?? []
  const postBalances: number[] = tx.meta?.postBalances ?? []
  const walletIdx = accountKeys.indexOf(walletAddress)
  if (walletIdx >= 0) {
    const change = (postBalances[walletIdx] ?? 0) - (preBalances[walletIdx] ?? 0)
    if (change > 0) return { type: 'receive', description: 'Received SOL' }
    if (change < 0) return { type: 'send', description: 'Sent SOL' }
  }

  return { type: 'unknown', description: 'Transaction' }
}

function formatTokenBalance(balance: number): string {
  if (balance >= 1_000_000) return (balance / 1_000_000).toFixed(2) + 'M'
  if (balance >= 1_000) return (balance / 1_000).toFixed(2) + 'K'
  if (balance < 0.001) return balance.toExponential(2)
  return balance.toLocaleString(undefined, { maximumFractionDigits: 4 })
}
