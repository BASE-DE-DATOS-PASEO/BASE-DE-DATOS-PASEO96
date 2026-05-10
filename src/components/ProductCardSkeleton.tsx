export default function ProductCardSkeleton() {
  return (
    <div className="rounded-xl overflow-hidden bg-white border border-pub-border">
      {/* Store header */}
      <div className="px-3 py-2 flex items-center gap-2 border-b border-gray-50">
        <div className="skeleton w-5 h-5 rounded-full" />
        <div className="skeleton h-3 w-20" />
      </div>
      {/* Image */}
      <div className="skeleton aspect-square" style={{ borderRadius: 0 }} />
      {/* Info */}
      <div className="px-3 py-2.5 space-y-2">
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-4 w-3/4" />
        <div className="skeleton h-5 w-20 mt-1" />
        <div className="skeleton h-3 w-24 mt-1" />
      </div>
    </div>
  );
}
