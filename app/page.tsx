import { supabase } from '@/lib/supabaseClient';
import { seedDatabase } from '@/lib/seed';
import { simulate } from '@/lib/engine';
import BalanceChart from '@/components/BalanceChart';
import RechargeAdvisor from '@/components/RechargeAdvisor';
import HabitComparison from '@/components/HabitComparison';
import MonthlyBreakdownBarChart from '@/components/MonthlyBreakdownBarChart';
import RealMeterComparison from '@/components/RealMeterComparison';
import MainDashboardLayout from '@/components/MainDashboardLayout';

export const revalidate = 0;

export default async function Page() {
  let { data: households } = await supabase.from('households').select('*');
  let householdId = households?.length > 0 ? households[0].id : await seedDatabase();

  const [{ data: readings }, { data: recharges }] = await Promise.all([
    supabase.from('daily_readings').select('*').eq('household_id', householdId).order('reading_date', { ascending: true }),
    supabase.from('recharges').select('*').eq('household_id', householdId).order('recharge_date', { ascending: true }),
  ]);

  const timeseries = simulate(readings, recharges, 0);

  return (
    <MainDashboardLayout timeseries={timeseries} readings={readings} />
  );
}