import Link from "next/link";

import {
  ManagerShell,
  StatCard,
  StatusBadge,
} from "~/components/dashboard/shell";
import { formatCurrency, formatDate, startOfToday } from "~/lib/format";
import { requireManagerSession } from "~/server/auth/guards";
import { db } from "~/server/db";

export const dynamic = "force-dynamic";

export default async function ManagerDashboardPage() {
  const session = await requireManagerSession();
  const today = startOfToday();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [
    villaCount,
    activeVillaCount,
    bookingCount,
    openRequests,
    openMaintenance,
    paidPayments,
    revenue,
    todayArrivals,
    todayDepartures,
    activeStays,
    upcomingArrivals,
  ] = await Promise.all([
    db.villa.count(),
    db.villa.count({ where: { status: "ACTIVE" } }),
    db.booking.count(),
    db.serviceRequest.count({ where: { status: "OPEN" } }),
    db.maintenanceTicket.count({ where: { status: { in: ["OPEN", "IN_PROGRESS"] } } }),
    db.payment.count({ where: { status: "PAID" } }),
    db.payment.aggregate({
      where: { status: "PAID" },
      _sum: { amount: true },
    }),
    db.booking.count({
      where: {
        checkIn: { gte: today, lt: tomorrow },
        status: { in: ["PENDING", "CONFIRMED"] },
      },
    }),
    db.booking.count({
      where: {
        checkOut: { gte: today, lt: tomorrow },
        status: { in: ["CONFIRMED", "COMPLETED"] },
      },
    }),
    db.booking.count({
      where: {
        checkIn: { lte: today },
        checkOut: { gt: today },
        status: "CONFIRMED",
      },
    }),
    db.booking.findMany({
      where: {
        checkIn: { gte: today },
        status: { in: ["PENDING", "CONFIRMED"] },
      },
      include: {
        guest: true,
        villa: true,
        payment: true,
      },
      orderBy: { checkIn: "asc" },
      take: 5,
    }),
  ]);

  const occupancyRate =
    activeVillaCount > 0 ? Math.round((activeStays / activeVillaCount) * 100) : 0;
  const pendingTasks = openRequests + openMaintenance;

  return (
    <ManagerShell
      title="Dashboard"
      description={`Welcome, ${session.user.name ?? "Manager"}. Monitor occupancy, arrivals, departures, pending tasks, revenue, and operational readiness from one suite.`}
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Occupancy"
          value={`${occupancyRate}%`}
          detail={`${activeStays}/${activeVillaCount} active villas occupied`}
        />
        <StatCard
          label="Active villas"
          value={`${activeVillaCount}/${villaCount}`}
          detail="Inventory online"
        />
        <StatCard
          label="Arrivals / departures"
          value={`${todayArrivals}/${todayDepartures}`}
          detail="Today"
        />
        <StatCard label="Pending tasks" value={pendingTasks} detail="Requests and maintenance" />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Bookings" value={bookingCount} detail="All records" />
        <StatCard
          label="Open requests"
          value={openRequests}
          detail="Concierge queue"
        />
        <StatCard
          label="Revenue"
          value={formatCurrency(revenue._sum.amount)}
          detail={`${paidPayments} paid payments`}
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-lg font-semibold text-slate-950">
              Upcoming arrivals
            </h2>
            <Link
              className="text-sm font-semibold text-cyan-800 hover:text-cyan-700"
              href="/manager/reservations"
            >
              View reservations
            </Link>
          </div>
          <div className="mt-5 grid gap-3">
            {upcomingArrivals.map((booking) => (
              <article
                className="rounded-md border border-slate-200 p-4"
                key={booking.id}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-slate-950">
                      {booking.guest.name}
                    </h3>
                    <p className="mt-1 text-sm text-slate-600">
                      {booking.villa.name} - {formatDate(booking.checkIn)}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <StatusBadge value={booking.status} />
                    <StatusBadge value={booking.payment?.status ?? "UNPAID"} />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-slate-800 bg-slate-950 p-6 text-white shadow-sm">
          <p className="text-sm font-semibold uppercase text-cyan-100">
            Manager Suite
          </p>
          <h2 className="mt-3 text-2xl font-semibold">
            Daily control room for the SRS MVP.
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Focus areas: reservations, calendar availability, villa inventory,
            concierge queue, readiness, facilities, finance, and sustainability
            analytics.
          </p>
          <div className="mt-6 grid gap-3">
            {[
              { label: "Handle concierge", href: "/manager/concierge" },
              { label: "Review readiness", href: "/manager/readiness" },
              { label: "Manage villas", href: "/manager/villas" },
              { label: "Check finance", href: "/manager/finance" },
            ].map((item) => (
              <Link
                className="rounded-md border border-white/15 bg-white/[0.08] px-4 py-3 text-sm font-semibold transition hover:bg-white/[0.14]"
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </ManagerShell>
  );
}
