import { ManagerShell, StatusBadge } from "~/components/dashboard/shell";
import { formatDate, shortDateFormatter, startOfToday } from "~/lib/format";
import { requireManagerSession } from "~/server/auth/guards";
import { db } from "~/server/db";

export const dynamic = "force-dynamic";

export default async function ManagerCalendarPage() {
  await requireManagerSession();

  const bookings = await db.booking.findMany({
    where: {
      checkOut: { gte: startOfToday() },
      status: { in: ["PENDING", "CONFIRMED"] },
    },
    include: {
      guest: true,
      villa: true,
      payment: true,
    },
    orderBy: { checkIn: "asc" },
    take: 30,
  });

  const grouped = new Map<string, typeof bookings>();
  bookings.forEach((booking) => {
    const key = booking.checkIn.toISOString().slice(0, 10);
    grouped.set(key, [...(grouped.get(key) ?? []), booking]);
  });

  return (
    <ManagerShell
      title="Booking Calendar"
      description="MVP calendar is a grouped arrival board. It shows upcoming bookings without adding a heavy calendar library yet."
    >
      <div className="grid gap-5">
        {[...grouped.entries()].map(([date, dayBookings]) => (
          <section
            className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
            key={date}
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold uppercase text-cyan-800">
                  Arrival day
                </p>
                <h2 className="mt-1 text-2xl font-semibold text-slate-950">
                  {shortDateFormatter.format(new Date(date))}
                </h2>
              </div>
              <p className="text-sm text-slate-500">
                {dayBookings.length} booking{dayBookings.length === 1 ? "" : "s"}
              </p>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {dayBookings.map((booking) => (
                <article
                  className="rounded-md border border-slate-200 p-4"
                  key={booking.id}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-slate-950">
                        {booking.villa.name}
                      </h3>
                      <p className="mt-1 text-sm text-slate-600">
                        {booking.guest.name} - {formatDate(booking.checkIn)} to{" "}
                        {formatDate(booking.checkOut)}
                      </p>
                    </div>
                    <StatusBadge value={booking.status} />
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </ManagerShell>
  );
}
