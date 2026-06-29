import { revalidatePath } from "next/cache";

import { ManagerShell, StatusBadge } from "~/components/dashboard/shell";
import { formatDate, getFormString } from "~/lib/format";
import { requireManagerSession } from "~/server/auth/guards";
import { db } from "~/server/db";

export const dynamic = "force-dynamic";

const requestStatuses = ["OPEN", "IN_PROGRESS", "COMPLETED", "CANCELLED"] as const;

async function updateRequestStatus(formData: FormData) {
  "use server";

  const session = await requireManagerSession();
  const requestId = getFormString(formData, "requestId");
  const status = getFormString(formData, "status");

  if (!requestStatuses.includes(status as (typeof requestStatuses)[number])) {
    throw new Error("Invalid request status.");
  }

  await db.serviceRequest.update({
    where: { id: requestId },
    data: { status: status as (typeof requestStatuses)[number] },
  });

  await db.auditLog.create({
    data: {
      actorId: session.user.id,
      action: "UPDATE_SERVICE_REQUEST_STATUS",
      entity: "ServiceRequest",
      entityId: requestId,
      metadata: { status },
    },
  });

  revalidatePath("/manager/concierge");
  revalidatePath("/guest/dashboard");
}

export default async function ManagerConciergePage() {
  await requireManagerSession();

  const requests = await db.serviceRequest.findMany({
    include: {
      guest: true,
      booking: {
        include: {
          villa: true,
        },
      },
    },
    orderBy: [
      { status: "asc" },
      { createdAt: "desc" },
    ],
  });

  return (
    <ManagerShell
      title="Active Concierge"
      description="Review guest requests, linked stays, priority, and update service status for staff follow-up."
    >
      <div className="grid gap-4">
        {requests.map((request) => (
          <article
            className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm"
            key={request.id}
          >
            <div className="grid gap-5 lg:grid-cols-[1fr_auto]">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge value={request.priority} />
                  <StatusBadge value={request.status} />
                </div>
                <h2 className="mt-4 text-xl font-semibold text-stone-950">
                  {request.type.replaceAll("_", " ")}
                </h2>
                <p className="mt-2 text-sm text-stone-500">
                  {request.guest.name} - {request.guest.email} -{" "}
                  {formatDate(request.createdAt)}
                </p>
                <p className="mt-4 leading-7 text-stone-600">{request.message}</p>
                {request.booking?.villa && (
                  <p className="mt-3 text-sm font-semibold text-emerald-800">
                    {request.booking.villa.name} -{" "}
                    {formatDate(request.booking.checkIn)}
                  </p>
                )}
              </div>
              <form action={updateRequestStatus} className="flex items-start gap-2">
                <input name="requestId" type="hidden" value={request.id} />
                <select
                  className="rounded-md border border-stone-300 bg-white px-3 py-2 text-sm"
                  defaultValue={request.status}
                  name="status"
                >
                  {requestStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status.replaceAll("_", " ")}
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
            </div>
          </article>
        ))}
      </div>
    </ManagerShell>
  );
}
