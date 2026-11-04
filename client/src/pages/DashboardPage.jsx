import MarineMapView from '../components/dashboard/MarineMapView';

export default function DashboardPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <header className="mb-6">
        <h1 className="font-serif text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="mt-1 max-w-xl text-sm text-slate-500">
          See where pollution is concentrated across the world's reef waters.
        </p>
      </header>

      <MarineMapView className="h-[calc(100vh-14rem)] min-h-[520px]" />

      {/* Later: StatsOverview, RecentScansList and other dashboard sections go here */}
    </main>
  );
}
