export function ProfileSkeleton() {
  return (
    <div className="p-6">
      <div className="h-9 w-48 rounded-lg bg-gray-200 animate-pulse" />
      <div className="mt-2 h-5 w-full max-w-md rounded bg-gray-100 animate-pulse" />

      <div className="mt-6 max-w-2xl space-y-8">
        <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="h-6 w-40 rounded bg-gray-200 animate-pulse" />
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-3 w-24 rounded bg-gray-100 animate-pulse" />
                <div className="h-10 w-full rounded-lg bg-gray-100 animate-pulse" />
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="h-6 w-44 rounded bg-gray-200 animate-pulse" />
          <div className="mt-1 h-4 w-72 rounded bg-gray-100 animate-pulse" />
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {[1, 2].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-3 w-20 rounded bg-gray-100 animate-pulse" />
                <div className="h-10 w-full rounded-lg bg-gray-100 animate-pulse" />
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="h-6 w-28 rounded bg-gray-200 animate-pulse" />
          <div className="mt-1 h-4 w-80 rounded bg-gray-100 animate-pulse" />
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <div className="h-3 w-16 rounded bg-gray-100 animate-pulse" />
              <div className="h-10 w-full rounded-lg bg-gray-100 animate-pulse" />
            </div>
            {[1, 2].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-3 w-20 rounded bg-gray-100 animate-pulse" />
                <div className="h-10 w-full rounded-lg bg-gray-100 animate-pulse" />
              </div>
            ))}
          </div>
        </section>

        <div className="flex justify-end">
          <div className="h-10 w-36 rounded-full bg-gray-200 animate-pulse" />
        </div>
      </div>
    </div>
  )
}
