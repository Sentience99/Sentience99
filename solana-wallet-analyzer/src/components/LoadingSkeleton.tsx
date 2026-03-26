export default function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Portfolio Summary Skeleton */}
      <div className="bg-solana-card rounded-2xl p-6 space-y-5 border border-solana-border">
        <div className="flex justify-between">
          <div className="space-y-2">
            <div className="skeleton h-3 w-16 rounded" />
            <div className="skeleton h-4 w-36 rounded" />
          </div>
          <div className="skeleton h-4 w-12 rounded" />
        </div>
        <div>
          <div className="skeleton h-3 w-28 rounded mb-2" />
          <div className="skeleton h-10 w-48 rounded" />
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="bg-solana-dark rounded-xl p-4 space-y-2">
              <div className="skeleton h-3 w-20 rounded" />
              <div className="skeleton h-6 w-24 rounded" />
              <div className="skeleton h-3 w-16 rounded" />
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Token List Skeleton */}
        <div className="bg-solana-card rounded-2xl p-6 border border-solana-border space-y-4">
          <div className="skeleton h-4 w-32 rounded" />
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-solana-dark">
              <div className="skeleton w-8 h-8 rounded-full" />
              <div className="flex-1 space-y-1.5">
                <div className="skeleton h-3 w-16 rounded" />
                <div className="skeleton h-3 w-24 rounded" />
              </div>
              <div className="space-y-1.5 text-right">
                <div className="skeleton h-3 w-16 rounded" />
                <div className="skeleton h-3 w-12 rounded" />
              </div>
            </div>
          ))}
        </div>

        {/* Transaction Skeleton */}
        <div className="bg-solana-card rounded-2xl p-6 border border-solana-border space-y-4">
          <div className="skeleton h-4 w-40 rounded" />
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-solana-dark">
              <div className="skeleton w-8 h-8 rounded-full" />
              <div className="flex-1 space-y-1.5">
                <div className="skeleton h-3 w-24 rounded" />
                <div className="skeleton h-3 w-36 rounded" />
              </div>
              <div className="space-y-1.5 text-right">
                <div className="skeleton h-3 w-20 rounded" />
                <div className="skeleton h-3 w-14 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
