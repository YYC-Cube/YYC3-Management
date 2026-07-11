export default function Loading() {
  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <div className="h-8 w-48 bg-slate-200 rounded animate-pulse" />
        <div className="h-4 w-72 bg-slate-100 rounded animate-pulse" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="border rounded-lg p-4 space-y-3">
            <div className="h-4 w-24 bg-slate-200 rounded animate-pulse" />
            <div className="h-8 w-16 bg-slate-200 rounded animate-pulse" />
            <div className="h-3 w-32 bg-slate-100 rounded animate-pulse" />
          </div>
        ))}
      </div>
      <div className="border rounded-lg p-6 space-y-3">
        <div className="h-5 w-32 bg-slate-200 rounded animate-pulse" />
        <div className="h-4 w-full bg-slate-100 rounded animate-pulse" />
        <div className="h-4 w-3/4 bg-slate-100 rounded animate-pulse" />
        <div className="h-4 w-5/6 bg-slate-100 rounded animate-pulse" />
      </div>
    </div>
  )
}
