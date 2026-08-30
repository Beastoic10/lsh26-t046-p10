import { createClient } from '@/lib/supabaseClient';

export default async function Page() {
  const supabase = createClient();

  // Fetch data from Supabase
  const { data: rawHouseholds, error } = await supabase
    .from('households')
    .select('*');

  // Coalesce null/undefined to an empty array to resolve TypeScript errors
  const households = rawHouseholds ?? [];

  if (error) {
    return (
      <main className="p-6 bg-[#050505] text-red-400 min-h-screen flex items-center justify-center">
        <p>Error loading data: {error.message}</p>
      </main>
    );
  }

  return (
    <main className="p-6 bg-[#050505] text-white min-h-screen">
      <div className="max-w-5xl mx-auto space-y-6">
        <header className="flex items-center justify-between border-b border-white/10 pb-4">
          <h1 className="text-2xl font-bold text-yellow-400">meter.advisor</h1>
          <span className="text-sm bg-white/10 px-3 py-1 rounded-full">
            Total Households: {households.length}
          </span>
        </header>

        {households.length === 0 ? (
          <div className="p-6 border border-white/10 rounded-xl bg-white/5 text-gray-400 text-center">
            No households found in the database.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {households.map((item: { id: string | number; name?: string; address?: string }) => (
              <div
                key={item.id}
                className="p-5 border border-yellow-500/20 rounded-xl bg-white/5 backdrop-blur-md shadow-lg"
              >
                <h3 className="font-semibold text-lg text-yellow-300">
                  {item.name || `Household #${item.id}`}
                </h3>
                {item.address && (
                  <p className="text-sm text-gray-400 mt-1">{item.address}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
