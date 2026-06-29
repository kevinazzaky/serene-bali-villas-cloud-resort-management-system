import { revalidatePath } from "next/cache";

import { ManagerShell, StatusBadge } from "~/components/dashboard/shell";
import { formatDate, getFormString } from "~/lib/format";
import { requireManagerSession } from "~/server/auth/guards";
import { db } from "~/server/db";

export const dynamic = "force-dynamic";

const ticketStatuses = ["OPEN", "IN_PROGRESS", "DONE", "CANCELLED"] as const;
const priorities = ["LOW", "MEDIUM", "HIGH", "URGENT"] as const;

async function createTicket(formData: FormData) {
  "use server";

  const session = await requireManagerSession();
  const villaId = getFormString(formData, "villaId");
  const title = getFormString(formData, "title").trim();
  const description = getFormString(formData, "description").trim();
  const priority = getFormString(formData, "priority", "MEDIUM");

  if (title.length < 3 || !priorities.includes(priority as (typeof priorities)[number])) {
    throw new Error("Invalid ticket input.");
  }

  const ticket = await db.maintenanceTicket.create({
    data: {
      villaId,
      title,
      description: description || null,
      priority: priority as (typeof priorities)[number],
    },
  });

  await db.auditLog.create({
    data: {
      actorId: session.user.id,
      action: "CREATE_MAINTENANCE_TICKET",
      entity: "MaintenanceTicket",
      entityId: ticket.id,
      metadata: { villaId, priority },
    },
  });

  revalidatePath("/manager/facilities");
  revalidatePath("/manager/readiness");
}

async function updateTicketStatus(formData: FormData) {
  "use server";

  const session = await requireManagerSession();
  const ticketId = getFormString(formData, "ticketId");
  const status = getFormString(formData, "status");

  if (!ticketStatuses.includes(status as (typeof ticketStatuses)[number])) {
    throw new Error("Invalid ticket status.");
  }

  await db.maintenanceTicket.update({
    where: { id: ticketId },
    data: { status: status as (typeof ticketStatuses)[number] },
  });

  await db.auditLog.create({
    data: {
      actorId: session.user.id,
      action: "UPDATE_MAINTENANCE_STATUS",
      entity: "MaintenanceTicket",
      entityId: ticketId,
      metadata: { status },
    },
  });

  revalidatePath("/manager/facilities");
  revalidatePath("/manager/readiness");
}

export default async function ManagerFacilitiesPage() {
  await requireManagerSession();

  const [villas, devices, tickets] = await Promise.all([
    db.villa.findMany({ orderBy: { name: "asc" } }),
    db.iotDevice.findMany({
      include: {
        villa: true,
        readings: {
          orderBy: { recordedAt: "desc" },
          take: 1,
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    db.maintenanceTicket.findMany({
      include: { villa: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <ManagerShell
      title="Facilities & IoT"
      description="MVP monitoring for dummy IoT devices and manual maintenance tickets."
    >
      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <section className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-stone-950">
            Create maintenance ticket
          </h2>
          <form action={createTicket} className="mt-5 grid gap-4">
            <label className="grid gap-2 text-sm font-medium text-stone-700">
              Villa
              <select className="rounded-md border border-stone-300 bg-white px-3 py-3" name="villaId">
                {villas.map((villa) => (
                  <option key={villa.id} value={villa.id}>
                    {villa.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 text-sm font-medium text-stone-700">
              Title
              <input className="rounded-md border border-stone-300 px-3 py-3" name="title" required />
            </label>
            <label className="grid gap-2 text-sm font-medium text-stone-700">
              Priority
              <select className="rounded-md border border-stone-300 bg-white px-3 py-3" name="priority">
                {priorities.map((priority) => (
                  <option key={priority} value={priority}>
                    {priority}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 text-sm font-medium text-stone-700">
              Description
              <textarea className="min-h-28 rounded-md border border-stone-300 px-3 py-3" name="description" />
            </label>
            <button className="rounded-md bg-emerald-800 px-5 py-3 font-semibold text-white" type="submit">
              Create ticket
            </button>
          </form>
        </section>

        <div className="grid gap-6">
          <section className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-stone-950">IoT devices</h2>
            <div className="mt-5 grid gap-3">
              {devices.map((device) => (
                <article
                  className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-stone-200 p-4"
                  key={device.id}
                >
                  <div>
                    <h3 className="font-semibold text-stone-950">
                      {device.deviceName}
                    </h3>
                    <p className="mt-1 text-sm text-stone-500">
                      {device.villa.name} - {device.deviceType}
                      {device.readings[0]
                        ? ` - ${device.readings[0].metric}: ${device.readings[0].value}${device.readings[0].unit}`
                        : ""}
                    </p>
                  </div>
                  <StatusBadge value={device.status} />
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-stone-950">
              Maintenance tickets
            </h2>
            <div className="mt-5 grid gap-3">
              {tickets.map((ticket) => (
                <article className="rounded-md border border-stone-200 p-4" key={ticket.id}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-stone-950">{ticket.title}</h3>
                      <p className="mt-1 text-sm text-stone-500">
                        {ticket.villa.name} - {formatDate(ticket.createdAt)}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <StatusBadge value={ticket.priority} />
                      <StatusBadge value={ticket.status} />
                    </div>
                  </div>
                  <form action={updateTicketStatus} className="mt-4 flex gap-2">
                    <input name="ticketId" type="hidden" value={ticket.id} />
                    <select className="rounded-md border border-stone-300 bg-white px-2 py-2 text-sm" defaultValue={ticket.status} name="status">
                      {ticketStatuses.map((status) => (
                        <option key={status} value={status}>
                          {status.replaceAll("_", " ")}
                        </option>
                      ))}
                    </select>
                    <button className="rounded-md bg-stone-900 px-3 py-2 text-sm font-semibold text-white" type="submit">
                      Save
                    </button>
                  </form>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
    </ManagerShell>
  );
}
