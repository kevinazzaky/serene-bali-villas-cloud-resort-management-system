import { revalidatePath } from "next/cache";

import {
  EmptyState,
  GuestShell,
  StatusBadge,
} from "~/components/dashboard/shell";
import { formatDate, getFormString } from "~/lib/format";
import { requireGuestSession } from "~/server/auth/guards";
import { db } from "~/server/db";

export const dynamic = "force-dynamic";

async function createGuestRequest(formData: FormData) {
  "use server";

  const session = await requireGuestSession();
  const type = getFormString(formData, "type", "OTHER");
  const bookingId = getFormString(formData, "bookingId");
  const message = getFormString(formData, "message").trim();
  const priority = getFormString(formData, "priority", "MEDIUM");

  if (message.length < 8 || message.length > 800) {
    throw new Error("Request message must be between 8 and 800 characters.");
  }

  const allowedTypes = [
    "SPA",
    "TRANSPORT",
    "HOUSEKEEPING",
    "IN_VILLA_DINING",
    "OTHER",
  ];
  const allowedPriorities = ["LOW", "MEDIUM", "HIGH", "URGENT"];

  if (!allowedTypes.includes(type) || !allowedPriorities.includes(priority)) {
    throw new Error("Invalid request input.");
  }

  let linkedBookingId: string | null = null;

  if (bookingId) {
    const booking = await db.booking.findFirst({
      where: {
        id: bookingId,
        guestId: session.user.id,
      },
      select: { id: true },
    });
    linkedBookingId = booking?.id ?? null;
  }

  const request = await db.serviceRequest.create({
    data: {
      guestId: session.user.id,
      bookingId: linkedBookingId,
      type,
      message,
      priority: priority as "LOW" | "MEDIUM" | "HIGH" | "URGENT",
    },
  });

  await db.auditLog.create({
    data: {
      actorId: session.user.id,
      action: "CREATE_SERVICE_REQUEST",
      entity: "ServiceRequest",
      entityId: request.id,
      metadata: { type, priority },
    },
  });

  revalidatePath("/guest/concierge");
  revalidatePath("/guest/dashboard");
}

export default async function GuestConciergePage() {
  const session = await requireGuestSession();

  const [bookings, requests] = await Promise.all([
    db.booking.findMany({
      where: {
        guestId: session.user.id,
        status: {
          in: ["PENDING", "CONFIRMED"],
        },
      },
      include: {
        villa: true,
      },
      orderBy: {
        checkIn: "asc",
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
    }),
  ]);

  return (
    <GuestShell
      title="Digital Concierge"
      description="Submit spa, transport, housekeeping, dining, or other service requests and track their status."
    >
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <form
          action={createGuestRequest}
          className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
        >
          <h2 className="text-lg font-semibold text-slate-950">
            New service request
          </h2>
          <div className="mt-5 grid gap-4">
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Service type
              <select
                className="rounded-md border border-slate-300 bg-white px-3 py-3 outline-none focus:border-cyan-700 focus:ring-2 focus:ring-cyan-100"
                name="type"
              >
                <option value="SPA">Spa</option>
                <option value="TRANSPORT">Transport</option>
                <option value="HOUSEKEEPING">Housekeeping</option>
                <option value="IN_VILLA_DINING">In-villa dining</option>
                <option value="OTHER">Other</option>
              </select>
            </label>

            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Link booking
              <select
                className="rounded-md border border-slate-300 bg-white px-3 py-3 outline-none focus:border-cyan-700 focus:ring-2 focus:ring-cyan-100"
                name="bookingId"
              >
                <option value="">No booking selected</option>
                {bookings.map((booking) => (
                  <option key={booking.id} value={booking.id}>
                    {booking.villa.name} - {formatDate(booking.checkIn)}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Priority
              <select
                className="rounded-md border border-slate-300 bg-white px-3 py-3 outline-none focus:border-cyan-700 focus:ring-2 focus:ring-cyan-100"
                name="priority"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </label>

            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Message
              <textarea
                className="min-h-40 rounded-md border border-slate-300 px-3 py-3 outline-none focus:border-cyan-700 focus:ring-2 focus:ring-cyan-100"
                maxLength={800}
                minLength={8}
                name="message"
                placeholder="Tell our team what you need."
                required
              />
            </label>

            <button
              className="rounded-md bg-slate-950 px-5 py-3 font-semibold text-white transition hover:bg-slate-800"
              type="submit"
            >
              Submit request
            </button>
          </div>
        </form>

        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-950">
            Request history
          </h2>
          <div className="mt-5 grid gap-4">
            {requests.length === 0 ? (
              <EmptyState
                title="No requests yet"
                description="Create a request and the manager concierge page will receive it."
              />
            ) : (
              requests.map((request) => (
                <article
                  className="rounded-md border border-slate-200 p-4"
                  key={request.id}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-slate-950">
                        {request.type.replaceAll("_", " ")}
                      </h3>
                      <p className="mt-1 text-xs text-slate-500">
                        {formatDate(request.createdAt)}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <StatusBadge value={request.priority} />
                      <StatusBadge value={request.status} />
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {request.message}
                  </p>
                  {request.booking?.villa && (
                    <p className="mt-3 text-xs font-medium text-cyan-800">
                      {request.booking.villa.name}
                    </p>
                  )}
                </article>
              ))
            )}
          </div>
        </section>
      </div>
    </GuestShell>
  );
}
