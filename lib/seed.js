import { supabase } from './supabaseClient';

export async function seedDatabase() {
  const { data: existing } = await supabase.from('households').select('id').limit(1);
  if (existing && existing.length > 0) return existing[0].id;

  const { data: household } = await supabase
    .from('households')
    .insert([{ name: 'Demo Household' }])
    .select()
    .single();

  const householdId = household.id;
  const readings = [];
  const recharges = [];

  // 180 days ending on today: 2026-08-30
  const endDate = new Date('2026-08-30');
  const startDate = new Date(endDate);
  startDate.setDate(endDate.getDate() - 179);

  for (let i = 0; i < 180; i++) {
    const curDate = new Date(startDate);
    curDate.setDate(startDate.getDate() + i);
    const dateStr = curDate.toISOString().split('T')[0];
    const month = curDate.getMonth(); // 0-indexed: March=2, May=4, July=6

    let units = 8;
    if (month === 2) units = 4 + Math.random() * 2; // Light month (~140 units total)
    else if (month === 4) units = 22 + Math.random() * 5; // Heavy summer month (~720 units)
    else units = 9 + Math.random() * 3;

    readings.push({
      household_id: householdId,
      reading_date: dateStr,
      units: Number(units.toFixed(2)),
    });

    // 1st of each month recharge
    if (curDate.getDate() === 1) {
      recharges.push({
        household_id: householdId,
        recharge_date: dateStr,
        amount: month === 4 ? 4500 : 1600,
      });
    }
    // Late month large recharge in July (month 6, 25th)
    else if (month === 6 && curDate.getDate() === 25) {
      recharges.push({
        household_id: householdId,
        recharge_date: dateStr,
        amount: 3200,
      });
    }
  }

  await supabase.from('daily_readings').insert(readings);
  await supabase.from('recharges').insert(recharges);

  return householdId;
}