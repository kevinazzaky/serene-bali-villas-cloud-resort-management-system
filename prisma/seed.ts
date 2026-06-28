import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const passwordHash = await bcrypt.hash("password123", 12);

  const manager = await db.user.upsert({
    where: { email: "manager@serenebali.com" },
    update: {},
    create: {
      name: "Serene Manager",
      email: "manager@serenebali.com",
      phone: "+6281234567890",
      passwordHash,
      role: "MANAGER",
    },
  });

  const guest = await db.user.upsert({
    where: { email: "guest@serenebali.com" },
    update: {},
    create: {
      name: "Demo Guest",
      email: "guest@serenebali.com",
      phone: "+6289876543210",
      passwordHash,
      role: "GUEST",
    },
  });

  const royalCanopy = await db.villa.upsert({
    where: { slug: "royal-canopy-suite" },
    update: {},
    create: {
      name: "Royal Canopy Suite",
      slug: "royal-canopy-suite",
      description:
        "A private luxury villa surrounded by tropical greenery, designed for guests who want serenity, comfort, and invisible technology.",
      location: "Ubud, Bali",
      capacity: 4,
      bedrooms: 2,
      bathrooms: 2,
      basePrice: 4500000,
      status: "ACTIVE",
      images: {
        create: [
          {
            imageUrl:
              "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
            altText: "Royal Canopy Suite pool view",
            sortOrder: 1,
          },
        ],
      },
      amenities: {
        create: [
          { name: "Private Pool", icon: "pool" },
          { name: "Smart IoT Controls", icon: "wifi" },
          { name: "Jungle View", icon: "leaf" },
          { name: "In-villa Dining", icon: "utensils" },
        ],
      },
    },
  });

  const zenGarden = await db.villa.upsert({
    where: { slug: "zen-garden-studio" },
    update: {},
    create: {
      name: "Zen Garden Studio",
      slug: "zen-garden-studio",
      description:
        "A calm studio villa with private courtyard, outdoor tub, and warm modern tropical atmosphere.",
      location: "Ubud, Bali",
      capacity: 2,
      bedrooms: 1,
      bathrooms: 1,
      basePrice: 3200000,
      status: "ACTIVE",
      images: {
        create: [
          {
            imageUrl:
              "https://images.unsplash.com/photo-1613490493576-7fde63acd811",
            altText: "Zen Garden Studio courtyard",
            sortOrder: 1,
          },
        ],
      },
      amenities: {
        create: [
          { name: "Outdoor Tub", icon: "bath" },
          { name: "Private Courtyard", icon: "tree" },
          { name: "Espresso Machine", icon: "coffee" },
          { name: "Ambient Lighting", icon: "lamp" },
        ],
      },
    },
  });

  const oceanMist = await db.villa.upsert({
    where: { slug: "ocean-mist-villa" },
    update: {},
    create: {
      name: "Ocean Mist Villa",
      slug: "ocean-mist-villa",
      description:
        "A spacious tropical villa for families, featuring open living spaces, premium amenities, and relaxing sanctuary details.",
      location: "Sanur, Bali",
      capacity: 6,
      bedrooms: 3,
      bathrooms: 3,
      basePrice: 6800000,
      status: "ACTIVE",
      images: {
        create: [
          {
            imageUrl:
              "https://images.unsplash.com/photo-1566073771259-6a8506099945",
            altText: "Ocean Mist Villa exterior",
            sortOrder: 1,
          },
        ],
      },
      amenities: {
        create: [
          { name: "Family Suite", icon: "users" },
          { name: "Private Pool", icon: "pool" },
          { name: "Airport Transfer", icon: "car" },
          { name: "Housekeeping", icon: "sparkles" },
        ],
      },
    },
  });

  await db.iotDevice.createMany({
    data: [
      {
        villaId: royalCanopy.id,
        deviceName: "Royal Canopy Climate Sensor",
        deviceType: "CLIMATE",
        status: "ONLINE",
      },
      {
        villaId: zenGarden.id,
        deviceName: "Zen Garden Energy Monitor",
        deviceType: "ENERGY",
        status: "ONLINE",
      },
      {
        villaId: oceanMist.id,
        deviceName: "Ocean Mist Lighting Controller",
        deviceType: "LIGHTING",
        status: "MAINTENANCE",
      },
    ],
    skipDuplicates: true,
  });

  await db.maintenanceTicket.createMany({
    data: [
      {
        villaId: oceanMist.id,
        title: "Check ambient lighting controller",
        description: "Lighting controller status needs inspection.",
        status: "OPEN",
        priority: "MEDIUM",
      },
      {
        villaId: royalCanopy.id,
        title: "Pool filtration routine check",
        description: "Routine preventive maintenance for pool filtration.",
        status: "IN_PROGRESS",
        priority: "LOW",
      },
    ],
    skipDuplicates: true,
  });

  const booking = await db.booking.create({
    data: {
      guestId: guest.id,
      villaId: royalCanopy.id,
      checkIn: new Date("2026-07-10"),
      checkOut: new Date("2026-07-13"),
      adults: 2,
      children: 0,
      status: "CONFIRMED",
      totalAmount: 13500000,
      note: "Demo confirmed booking for guest portal.",
      payment: {
        create: {
          provider: "DUMMY",
          currency: "IDR",
          amount: 13500000,
          status: "PAID",
          reference: "DUMMY-PAID-001",
          paidAt: new Date(),
        },
      },
      invoice: {
        create: {
          invoiceNo: "INV-2026-0001",
          total: 13500000,
          status: "PAID",
        },
      },
      transactions: {
        create: [
          {
            type: "BOOKING_PAYMENT",
            amount: 13500000,
            currency: "IDR",
            status: "PAID",
          },
        ],
      },
    },
  });

  await db.serviceRequest.create({
    data: {
      guestId: guest.id,
      bookingId: booking.id,
      type: "IN_VILLA_DINING",
      message: "Request floating breakfast for tomorrow morning.",
      status: "OPEN",
      priority: "MEDIUM",
    },
  });

  await db.auditLog.create({
    data: {
      actorId: manager.id,
      action: "SEED_DATABASE",
      entity: "SYSTEM",
      entityId: null,
      metadata: {
        message: "Initial seed data created for Serene Bali Villas MVP.",
      },
    },
  });

  console.log("Seed completed.");
  console.log("Manager login: manager@serenebali.com / password123");
  console.log("Guest login: guest@serenebali.com / password123");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });