import Link from "next/link";

import {
  EmptyState,
  GuestShell,
  StatCard,
  StatusBadge,
} from "~/components/dashboard/shell";
import { formatCurrency, formatDate } from "~/lib/format";
import { requireGuestSession } from "~/server/auth/guards";
import { db } from "~/server/db";

export const dynamic = "force-dynamic";

export default async function GuestDashboardPage() {
  const session = await requireGuestSession();

  const [bookings, requests] = await Promise.all([
    db.booking.findMany({
      where: {
        guestId: session.user.id,
      },
      include: {
        villa: {
          include: {
            images: {
              orderBy: { sortOrder: "asc" },
              take: 1,
            },
          },
        },
        payment: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
    db.serviceRequest.findMany({
      where: {
        guestId: session.user.id,
      },
      include: {
        booking: {
          include: {
            villa: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    }),
  ]);

  const activeBooking =
    bookings.find((booking) =>
      ["PENDING", "CONFIRMED"].includes(booking.status),
    ) ?? bookings[0];

  const paidTotal = bookings
    .filter((booking) => booking.payment?.status === "PAID")
    .reduce((total, booking) => total + Number(booking.totalAmount), 0);

  return (
    <GuestShell
      title="Stay Overview"
      description="Track active stay, villa details, concierge requests, payment status, and booking history from one guest portal."
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Bookings" value={bookings.length} detail="All stays" />
        <StatCard
          label="Paid total"
          value={formatCurrency(paidTotal)}
          detail="Dummy payment records"
        />
        <StatCard
          label="Open requests"
          value={requests.filter((request) => request.status === "OPEN").length}
          detail="Concierge queue"
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        {activeBooking ? (
          <article className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
            <div
              className="min-h-72 bg-cover bg-center"
              role="img"
              aria-label={activeBooking.villa.name}
              style={{
                backgroundImage: `url(${activeBooking.villa.images[0]?.imageUrl ?? "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=85"})`,
              }}
            />
            <div className="p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase text-cyan-800">
                    Active stay
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-slate-950">
                    {activeBooking.villa.name}
                  </h2>
                  <p className="mt-2 text-slate-600">
                    {formatDate(activeBooking.checkIn)} to{" "}
                    {formatDate(activeBooking.checkOut)}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <StatusBadge value={activeBooking.status} />
                  <StatusBadge value={activeBooking.payment?.status ?? "UNPAID"} />
                </div>
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="rounded-md bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase text-slate-500">
                    Guests
                  </p>
                  <p className="mt-1 font-semibold text-slate-950">
                    {activeBooking.adults + activeBooking.children}
                  </p>
                </div>
                <div className="rounded-md bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase text-slate-500">
                    Total
                  </p>
                  <p className="mt-1 font-semibold text-slate-950">
                    {formatCurrency(activeBooking.totalAmount)}
                  </p>
                </div>
                <div className="rounded-md bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase text-slate-500">
                    Location
                  </p>
                  <p className="mt-1 font-semibold text-slate-950">
                    {activeBooking.villa.location ?? "Bali"}
                  </p>
                </div>
              </div>
              <div className="mt-6 grid gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 sm:grid-cols-3">
                {[
                  ["Villa control", "Comfort and readiness prepared"],
                  ["Bill status", activeBooking.payment?.status ?? "UNPAID"],
                  ["Concierge", "Spa, transport, housekeeping"],
                ].map(([label, value]) => (
                  <div key={label}>
                    <p className="text-xs font-semibold uppercase text-slate-500">
                      {label}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-950">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  className="rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                  href="/guest/concierge"
                >
                  Request concierge
                </Link>
                <Link
                  className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-cyan-700 hover:text-cyan-800"
                  href="/booking"
                >
                  Search another villa
                </Link>
              </div>
            </div>
          </article>
        ) : (
          <EmptyState
            title="No bookings yet"
            description="Start with the booking page to find a villa sanctuary."
          />
        )}

        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-950">
            Recent concierge requests
          </h2>
          <div className="mt-5 grid gap-4">
            {requests.length === 0 ? (
              <p className="text-sm text-slate-500">
                No requests yet. Use concierge to ask for spa, transport,
                housekeeping, or dining.
              </p>
            ) : (
              requests.map((request) => (
                <article
                  className="rounded-md border border-slate-200 p-4"
                  key={request.id}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-semibold text-slate-950">
                      {request.type.replaceAll("_", " ")}
                    </h3>
                    <StatusBadge value={request.status} />
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm text-slate-600">
                    {request.message}
                  </p>
                  {request.booking?.villa && (
                    <p className="mt-3 text-xs text-slate-500">
                      Linked to {request.booking.villa.name}
                    </p>
                  )}
                </article>
              ))
            )}
          </div>
        </section>
      </div>

      <section className="mt-6 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-5">
          <h2 className="text-lg font-semibold text-slate-950">
            Booking history
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-6 py-4 font-semibold">Villa</th>
                <th className="px-6 py-4 font-semibold">Check-in</th>
                <th className="px-6 py-4 font-semibold">Check-out</th>
                <th className="px-6 py-4 font-semibold">Booking</th>
                <th className="px-6 py-4 font-semibold">Payment</th>
                <th className="px-6 py-4 font-semibold">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {bookings.map((booking) => (
                <tr key={booking.id}>
                  <td className="px-6 py-4 font-medium text-slate-950">
                    {booking.villa.name}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {formatDate(booking.checkIn)}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {formatDate(booking.checkOut)}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge value={booking.status} />
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge value={booking.payment?.status ?? "UNPAID"} />
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {formatCurrency(booking.totalAmount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </GuestShell>
  );
}
