export const Skeleton = ({ className = '', height = 'h-4', width = 'w-full' }) => (
  <div className={`${width} ${height} bg-slate-200 rounded-lg animate-shimmer`} />
);

export const SkeletonCard = () => (
  <div className="p-6 bg-white rounded-xl border border-slate-200">
    <Skeleton height="h-6" width="w-1/3" className="mb-4" />
    <Skeleton height="h-4" width="w-full" className="mb-3" />
    <Skeleton height="h-4" width="w-5/6" />
  </div>
);

export const SkeletonTable = ({ rows = 5 }) => (
  <div className="space-y-3">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex gap-4">
        <Skeleton height="h-12" width="w-full" />
      </div>
    ))}
  </div>
);
