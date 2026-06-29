import { ManagerShell, StatusBadge } from "~/components/dashboard/shell";
import { formatDate, startOfToday } from "~/lib/format";
import { requireManagerSession } from "~/server/auth/guards";
import { db } from "~/server/db";

export const dynamic = "force-dynamic";

export default async function ManagerReadinessPage() {
  await requireManagerSession();

  const arrivals = await db.booking.findMany({
    where: {
      checkIn: { gte: startOfToday() },
      status: { in: ["PENDING", "CONFIRMED"] },
    },
    include: {
      guest: true,
      serviceRequests: {
        where: { status: { in: ["OPEN", "IN_PROGRESS"] } },
      },
      villa: {
        include: {
          maintenanceTickets: {
            where: { status: { in: ["OPEN", "IN_PROGRESS"] } },
          },
        },
      },
    },
    orderBy: { checkIn: "asc" },
    take: 12,
  });

  return (
    <ManagerShell
      title="Operations Readiness"
      description="Check upcoming arrivals against open guest requests and maintenance issues before check-in."
    >
      <div className="grid gap-4">
        {arrivals.map((booking) => {
          const needsAttention =
            booking.serviceRequests.length > 0 ||
            booking.villa.maintenanceTickets.length > 0;

          return (
            <article
              className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
              key={booking.id}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase text-cyan-800">
                    {formatDate(booking.checkIn)}
                  </p>
                  <h2 className="mt-2 text-xl font-semibold text-slate-950">
                    {booking.villa.name}
                  </h2>
                  <p className="mt-1 text-sm text-slate-600">
                    Guest: {booking.guest.name}
                  </p>
                </div>
                <StatusBadge value={needsAttention ? "NEEDS ATTENTION" : "READY"} />
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-md bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase text-slate-500">
                    Open requests
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-slate-950">
                    {booking.serviceRequests.length}
                  </p>
                </div>
                <div className="rounded-md bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase text-slate-500">
                    Maintenance issues
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-slate-950">
                    {booking.villa.maintenanceTickets.length}
                  </p>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </ManagerShell>
  );
}
