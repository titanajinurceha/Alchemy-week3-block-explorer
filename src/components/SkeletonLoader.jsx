export default function SkeletonLoader({ lines = 5 }) {
  return (
    <div className="animate-pulse space-y-3">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-5 bg-gray-200 rounded w-full skeleton-shimmer"
          style={{
            animationDelay: `${i * 80}ms`,
            animationDuration: "1.2s",
          }}
        ></div>
      ))}
    </div>
  );
}
