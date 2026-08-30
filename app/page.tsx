import { createClient } from '@/lib/supabaseClient'; // Adjust path if using @/lib/supabase/server

export default async function Page() {
  const supabase = createClient();

  // Fetch households from Supabase
  const { data: households, error } = await supabase
    .from('households')
    .select('*');

  // Handle potential query errors
  if (error) {
    return (
      <main className="p-6 text-red-400 bg-[#050505] min-h-screen">
        <p>Error loading households: {error.message}</p>
      </main>
    );
  }

  // Fallback to empty array to eliminate TypeScript TS18047 (null) & TS18048 (undefined) errors
  const safeHouseholds = households ?? [];
  const householdCount = safeHouseholds.length;

  return (
    <main className="p-6 bg-[#050505] text-white min-h-screen">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="flex items-center justify-between border-b border-white/10 pb-4">
          <h1 className="text-2xl font-bold text-yellow-400">Meter Advisor</h1>
          <span className="text-sm bg-white/10 px-3 py-1 rounded-full">
            Total Households: {householdCount}
          </span>
        </header>

        {householdCount === 0 ? (
          <div className="p-6 border border-white/10 rounded-xl bg-white/5 text-gray-400">
            No households found.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {safeHouseholds.map((household) => (
              <div
                key={household.id}
                className="p-5 border border-yellow-500/20 rounded-xl bg-white/5 backdrop-blur-md shadow-lg"
              >
                <h3 className="font-semibold text-lg text-yellow-300">
                  {household.name || `Household #${household.id}`}
                </h3>
                {household.address && (
                  <p className="text-sm text-gray-400 mt-1">{household.address}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
