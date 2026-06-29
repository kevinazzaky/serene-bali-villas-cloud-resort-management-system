import { Leaf, Droplets, Zap } from "lucide-react";

import { ManagerShell, StatCard } from "~/components/dashboard/shell";
import { formatDate } from "~/lib/format";
import { requireManagerSession } from "~/server/auth/guards";
import { db } from "~/server/db";

export const dynamic = "force-dynamic";

type SustainabilityRow = {
  villaName: string;
  energy: number;
  water: number;
  score: number;
  date?: Date;
};

export default async function ManagerSustainabilityPage() {
  await requireManagerSession();

  const [metrics, villas] = await Promise.all([
    db.sustainabilityMetric.findMany({
      include: { villa: true },
      orderBy: { date: "desc" },
      take: 20,
    }),
    db.villa.findMany({ orderBy: { name: "asc" } }),
  ]);

  const energyTotal = metrics.reduce(
    (total, metric) => total + (metric.energy ?? 0),
    0,
  );
  const waterTotal = metrics.reduce((total, metric) => total + (metric.water ?? 0), 0);
  const hasMetrics = metrics.length > 0;

  const simulatedRows: SustainabilityRow[] = villas.map((villa, index) => ({
    villaName: villa.name,
    energy: 120 + index * 18,
    water: 850 + index * 75,
    score: 86 - index * 3,
  }));

  const rows: SustainabilityRow[] = hasMetrics
    ? metrics.map((metric) => ({
        villaName: metric.villa.name,
        energy: metric.energy ?? 0,
        water: metric.water ?? 0,
        score: 82,
        date: metric.date,
      }))
    : simulatedRows;

  return (
    <ManagerShell
      title="Sustainability Analytics"
      description="MVP sustainability analytics uses stored metrics when available and clear dummy projections when seed data has not been created yet."
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Energy usage"
          value={hasMetrics ? `${energyTotal.toFixed(1)} kWh` : "Dummy mode"}
          detail="Per villa reporting"
        />
        <StatCard
          label="Water usage"
          value={hasMetrics ? `${waterTotal.toFixed(1)} L` : "Dummy mode"}
          detail="Manual or simulated data"
        />
        <StatCard
          label="Efficiency score"
          value={hasMetrics ? "82%" : "86%"}
          detail="MVP estimate"
        />
      </div>

      <section className="mt-6 rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-stone-950">
            Villa resource overview
          </h2>
          <span className="rounded-md bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
            {hasMetrics ? "Database metrics" : "Dummy projection"}
          </span>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {rows.map((row) => (
            <article
              className="rounded-lg border border-stone-200 p-5"
              key={`${row.villaName}-${row.date?.toISOString() ?? "sim"}`}
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-semibold text-stone-950">{row.villaName}</h3>
                <Leaf className="size-5 text-emerald-800" aria-hidden="true" />
              </div>
              <div className="mt-5 grid gap-3 text-sm text-stone-600">
                <span className="flex items-center gap-2">
                  <Zap className="size-4 text-amber-600" aria-hidden="true" />
                  {row.energy} kWh energy
                </span>
                <span className="flex items-center gap-2">
                  <Droplets className="size-4 text-sky-600" aria-hidden="true" />
                  {row.water} L water
                </span>
                <span className="font-semibold text-emerald-800">
                  {row.score}% efficiency
                </span>
                {row.date && (
                  <span className="text-xs text-stone-500">
                    {formatDate(row.date)}
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>
    </ManagerShell>
  );
}
