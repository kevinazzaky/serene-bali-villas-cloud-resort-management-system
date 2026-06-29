import { type Role } from "@prisma/client";
import { redirect } from "next/navigation";

import { auth } from "~/server/auth";

const managerRoles: Role[] = ["MANAGER", "OWNER", "ADMIN"];

export async function requireGuestSession() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (managerRoles.includes(session.user.role)) {
    redirect("/manager/dashboard");
  }

  if (session.user.role !== "GUEST") {
    redirect("/login");
  }

  return session;
}

export async function requireManagerSession() {
  const session = await auth();

  if (!session?.user) {
    redirect("/manager/login");
  }

  if (!managerRoles.includes(session.user.role)) {
    redirect("/guest/dashboard");
  }

  return session;
}
