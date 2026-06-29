import {
  ManagerShell,
  StatCard,
  StatusBadge,
} from "~/components/dashboard/shell";
import { formatDate, startOfToday } from "~/lib/format";
import { requireManagerSession } from "~/server/auth/guards";
import { db } from "~/server/db";

export const dynamic = "force-dynamic";

export default async function ManagerOperationsPage() {
  await requireManagerSession();
  const today = startOfToday();

  const [villas, arrivals, openTickets, openRequests] = await Promise.all([
    db.villa.findMany({
      include: {
        _count: {
          select: {
            bookings: true,
            maintenanceTickets: true,
          },
        },
      },
      orderBy: { name: "asc" },
    }),
    db.booking.findMany({
      where: {
        checkIn: { gte: today },
        status: { in: ["PENDING", "CONFIRMED"] },
      },
      include: { villa: true, guest: true },
      orderBy: { checkIn: "asc" },
      take: 6,
    }),
    db.maintenanceTicket.count({
      where: { status: { in: ["OPEN", "IN_PROGRESS"] } },
    }),
    db.serviceRequest.count({
      where: { status: { in: ["OPEN", "IN_PROGRESS"] } },
    }),
  ]);

  return (
    <ManagerShell
      title="Operations Overview"
      description="A daily operational snapshot for villa readiness, arrivals, maintenance, and service workload."
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Villa units" value={villas.length} detail="Total inventory" />
        <StatCard label="Open tickets" value={openTickets} detail="Facilities work" />
        <StatCard label="Active requests" value={openRequests} detail="Concierge workload" />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_1fr]">
        <section className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-stone-950">Villa overview</h2>
          <div className="mt-5 grid gap-3">
            {villas.map((villa) => (
              <article
                className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-stone-200 p-4"
                key={villa.id}
              >
                <div>
                  <h3 className="font-semibold text-stone-950">{villa.name}</h3>
                  <p className="mt-1 text-sm text-stone-500">
                    {villa._count.bookings} bookings,{" "}
                    {villa._count.maintenanceTickets} maintenance records
                  </p>
                </div>
                <StatusBadge value={villa.status} />
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-stone-950">Next arrivals</h2>
          <div className="mt-5 grid gap-3">
            {arrivals.map((booking) => (
              <article className="rounded-md border border-stone-200 p-4" key={booking.id}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-stone-950">{booking.guest.name}</h3>
                    <p className="mt-1 text-sm text-stone-600">
                      {booking.villa.name} - {formatDate(booking.checkIn)}
                    </p>
                  </div>
                  <StatusBadge value={booking.status} />
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </ManagerShell>
  );
}
