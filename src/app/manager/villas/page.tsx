import { revalidatePath } from "next/cache";

import { ManagerShell, StatusBadge } from "~/components/dashboard/shell";
import { formatCurrency, getFormString } from "~/lib/format";
import { requireManagerSession } from "~/server/auth/guards";
import { db } from "~/server/db";

export const dynamic = "force-dynamic";

const villaStatuses = ["ACTIVE", "INACTIVE", "MAINTENANCE"] as const;

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function createVilla(formData: FormData) {
  "use server";

  const session = await requireManagerSession();
  const name = getFormString(formData, "name").trim();
  const location = getFormString(formData, "location").trim();
  const description = getFormString(formData, "description").trim();
  const capacity = Number(formData.get("capacity") ?? 1);
  const bedrooms = Number(formData.get("bedrooms") ?? 1);
  const bathrooms = Number(formData.get("bathrooms") ?? 1);
  const basePrice = getFormString(formData, "basePrice", "0");
  const imageUrl = getFormString(formData, "imageUrl").trim();
  const amenities = getFormString(formData, "amenities")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  if (
    name.length < 2 ||
    description.length < 20 ||
    capacity < 1 ||
    bedrooms < 1 ||
    bathrooms < 1 ||
    Number(basePrice) <= 0
  ) {
    throw new Error("Villa input is invalid.");
  }

  const villa = await db.villa.create({
    data: {
      name,
      slug: `${slugify(name)}-${Date.now()}`,
      description,
      location: location || null,
      capacity,
      bedrooms,
      bathrooms,
      basePrice,
      status: "ACTIVE",
      images: imageUrl
        ? {
            create: {
              imageUrl,
              altText: name,
              sortOrder: 1,
            },
          }
        : undefined,
      amenities: amenities.length
        ? {
            create: amenities.map((amenity) => ({ name: amenity })),
          }
        : undefined,
    },
  });

  await db.auditLog.create({
    data: {
      actorId: session.user.id,
      action: "CREATE_VILLA",
      entity: "Villa",
      entityId: villa.id,
      metadata: { name: villa.name },
    },
  });

  revalidatePath("/manager/villas");
  revalidatePath("/booking");
}

async function updateVillaStatus(formData: FormData) {
  "use server";

  const session = await requireManagerSession();
  const villaId = getFormString(formData, "villaId");
  const status = getFormString(formData, "status");

  if (!villaStatuses.includes(status as (typeof villaStatuses)[number])) {
    throw new Error("Invalid villa status.");
  }

  await db.villa.update({
    where: { id: villaId },
    data: { status: status as (typeof villaStatuses)[number] },
  });

  await db.auditLog.create({
    data: {
      actorId: session.user.id,
      action: "UPDATE_VILLA_STATUS",
      entity: "Villa",
      entityId: villaId,
      metadata: { status },
    },
  });

  revalidatePath("/manager/villas");
  revalidatePath("/booking");
}

export default async function ManagerVillasPage() {
  await requireManagerSession();

  const villas = await db.villa.findMany({
    include: {
      images: { orderBy: { sortOrder: "asc" }, take: 1 },
      amenities: true,
      _count: {
        select: {
          bookings: true,
          maintenanceTickets: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <ManagerShell
      title="Villa Inventory"
      description="Create villas, review rates and amenities, and control active/maintenance status for public availability."
    >
      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <form
          action={createVilla}
          className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm"
        >
          <h2 className="text-lg font-semibold text-stone-950">Create villa</h2>
          <div className="mt-5 grid gap-4">
            <label className="grid gap-2 text-sm font-medium text-stone-700">
              Name
              <input className="rounded-md border border-stone-300 px-3 py-3" name="name" required />
            </label>
            <label className="grid gap-2 text-sm font-medium text-stone-700">
              Location
              <input className="rounded-md border border-stone-300 px-3 py-3" name="location" />
            </label>
            <label className="grid gap-2 text-sm font-medium text-stone-700">
              Description
              <textarea
                className="min-h-28 rounded-md border border-stone-300 px-3 py-3"
                name="description"
                required
              />
            </label>
            <div className="grid gap-4 sm:grid-cols-3">
              <label className="grid gap-2 text-sm font-medium text-stone-700">
                Capacity
                <input className="rounded-md border border-stone-300 px-3 py-3" defaultValue={2} min={1} name="capacity" type="number" />
              </label>
              <label className="grid gap-2 text-sm font-medium text-stone-700">
                Bedrooms
                <input className="rounded-md border border-stone-300 px-3 py-3" defaultValue={1} min={1} name="bedrooms" type="number" />
              </label>
              <label className="grid gap-2 text-sm font-medium text-stone-700">
                Bathrooms
                <input className="rounded-md border border-stone-300 px-3 py-3" defaultValue={1} min={1} name="bathrooms" type="number" />
              </label>
            </div>
            <label className="grid gap-2 text-sm font-medium text-stone-700">
              Base price IDR
              <input className="rounded-md border border-stone-300 px-3 py-3" min={1} name="basePrice" type="number" required />
            </label>
            <label className="grid gap-2 text-sm font-medium text-stone-700">
              Image URL
              <input className="rounded-md border border-stone-300 px-3 py-3" name="imageUrl" type="url" />
            </label>
            <label className="grid gap-2 text-sm font-medium text-stone-700">
              Amenities, comma separated
              <input className="rounded-md border border-stone-300 px-3 py-3" name="amenities" placeholder="Private Pool, Airport Transfer" />
            </label>
            <button className="rounded-md bg-emerald-800 px-5 py-3 font-semibold text-white" type="submit">
              Create villa
            </button>
          </div>
        </form>

        <section className="grid gap-4">
          {villas.map((villa) => (
            <article
              className="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm"
              key={villa.id}
            >
              <div className="grid md:grid-cols-[220px_1fr]">
                <div
                  className="min-h-48 bg-stone-200 bg-cover bg-center"
                  role="img"
                  aria-label={villa.name}
                  style={{
                    backgroundImage: `url(${villa.images[0]?.imageUrl ?? "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1000&q=80"})`,
                  }}
                />
                <div className="p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h2 className="text-xl font-semibold text-stone-950">
                        {villa.name}
                      </h2>
                      <p className="mt-1 text-sm text-stone-500">
                        {villa.location ?? "Bali"} -{" "}
                        {formatCurrency(villa.basePrice)} / night
                      </p>
                    </div>
                    <StatusBadge value={villa.status} />
                  </div>
                  <p className="mt-3 line-clamp-2 text-sm leading-6 text-stone-600">
                    {villa.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {villa.amenities.map((amenity) => (
                      <span
                        className="rounded-md bg-emerald-50 px-2 py-1 text-xs text-emerald-900"
                        key={amenity.id}
                      >
                        {amenity.name}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <p className="text-sm text-stone-500">
                      {villa._count.bookings} bookings,{" "}
                      {villa._count.maintenanceTickets} maintenance tickets
                    </p>
                    <form action={updateVillaStatus} className="flex gap-2">
                      <input name="villaId" type="hidden" value={villa.id} />
                      <select
                        className="rounded-md border border-stone-300 bg-white px-2 py-2 text-sm"
                        defaultValue={villa.status}
                        name="status"
                      >
                        {villaStatuses.map((status) => (
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
                  </div>
                </div>
              </div>
            </article>
          ))}
        </section>
      </div>
    </ManagerShell>
  );
}
