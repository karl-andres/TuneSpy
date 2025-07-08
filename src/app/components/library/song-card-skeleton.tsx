export function SongCardSkeleton() {
  return (
    <div className="p-4 border rounded-lg bg-gray-200 animate-pulse">
      <div className="h-6 bg-gray-400 rounded w-3/4 mb-2" />
      <div className="h-4 bg-gray-300 rounded w-1/2" />
    </div>
  );
}