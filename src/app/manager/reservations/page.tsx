import { revalidatePath } from "next/cache";

import { ManagerShell, StatusBadge } from "~/components/dashboard/shell";
import { formatCurrency, formatDate, getFormString } from "~/lib/format";
import { requireManagerSession } from "~/server/auth/guards";
import { db } from "~/server/db";

export const dynamic = "force-dynamic";

const bookingStatuses = [
  "PENDING",
  "CONFIRMED",
  "CANCELLED",
  "COMPLETED",
  "EXPIRED",
] as const;

async function updateBookingStatus(formData: FormData) {
  "use server";

  const session = await requireManagerSession();
  const bookingId = getFormString(formData, "bookingId");
  const status = getFormString(formData, "status");

  if (!bookingStatuses.includes(status as (typeof bookingStatuses)[number])) {
    throw new Error("Invalid booking status.");
  }

  await db.booking.update({
    where: { id: bookingId },
    data: { status: status as (typeof bookingStatuses)[number] },
  });

  await db.auditLog.create({
    data: {
      actorId: session.user.id,
      action: "UPDATE_BOOKING_STATUS",
      entity: "Booking",
      entityId: bookingId,
      metadata: { status },
    },
  });

  revalidatePath("/manager/reservations");
  revalidatePath("/manager/dashboard");
}

export default async function ManagerReservationsPage() {
  await requireManagerSession();

  const bookings = await db.booking.findMany({
    include: {
      guest: true,
      villa: true,
      payment: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <ManagerShell
      title="Reservations"
      description="Search, review, and update booking status. Payment and booking status are kept visible for manager decisions."
    >
      <section className="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1080px] text-left text-sm">
            <thead className="bg-stone-50 text-xs uppercase text-stone-500">
              <tr>
                <th className="px-5 py-4 font-semibold">Guest</th>
                <th className="px-5 py-4 font-semibold">Villa</th>
                <th className="px-5 py-4 font-semibold">Dates</th>
                <th className="px-5 py-4 font-semibold">Guests</th>
                <th className="px-5 py-4 font-semibold">Booking</th>
                <th className="px-5 py-4 font-semibold">Payment</th>
                <th className="px-5 py-4 font-semibold">Total</th>
                <th className="px-5 py-4 font-semibold">Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {bookings.map((booking) => (
                <tr key={booking.id}>
                  <td className="px-5 py-4">
                    <p className="font-semibold text-stone-950">
                      {booking.guest.name}
                    </p>
                    <p className="text-xs text-stone-500">
                      {booking.guest.email}
                    </p>
                  </td>
                  <td className="px-5 py-4 text-stone-700">
                    {booking.villa.name}
                  </td>
                  <td className="px-5 py-4 text-stone-600">
                    {formatDate(booking.checkIn)} to {formatDate(booking.checkOut)}
                  </td>
                  <td className="px-5 py-4 text-stone-600">
                    {booking.adults + booking.children}
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge value={booking.status} />
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge value={booking.payment?.status ?? "UNPAID"} />
                  </td>
                  <td className="px-5 py-4 text-stone-600">
                    {formatCurrency(booking.totalAmount)}
                  </td>
                  <td className="px-5 py-4">
                    <form action={updateBookingStatus} className="flex gap-2">
                      <input name="bookingId" type="hidden" value={booking.id} />
                      <select
                        className="rounded-md border border-stone-300 bg-white px-2 py-2 text-sm"
                        defaultValue={booking.status}
                        name="status"
                      >
                        {bookingStatuses.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                      <button
                        className="rounded-md bg-stone-900 px-3 py-2 text-sm font-semibold text-white"
                        type="submit"
                      >
                        Save
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </ManagerShell>
  );
}
