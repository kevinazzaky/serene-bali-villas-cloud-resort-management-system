import { TRPCError } from "@trpc/server";
import bcrypt from "bcryptjs";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const authRouter = createTRPCRouter({
  registerGuest: publicProcedure
    .input(
      z.object({
        name: z.string().trim().min(2, "Name must be at least 2 characters"),
        email: z.string().trim().email("Enter a valid email address"),
        phone: z.string().trim().optional(),
        password: z
          .string()
          .min(6, "Password must be at least 6 characters"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const email = input.email.toLowerCase();

      const existingUser = await ctx.db.user.findUnique({
        where: { email },
        select: { id: true },
      });

      if (existingUser) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Email is already registered",
        });
      }

      const passwordHash = await bcrypt.hash(input.password, 12);

      const user = await ctx.db.user.create({
        data: {
          name: input.name,
          email,
          phone: input.phone?.length ? input.phone : null,
          passwordHash,
          role: "GUEST",
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      });

      await ctx.db.auditLog.create({
        data: {
          actorId: user.id,
          action: "REGISTER_GUEST",
          entity: "User",
          entityId: user.id,
          metadata: { email: user.email },
        },
      });

      return user;
    }),
});
