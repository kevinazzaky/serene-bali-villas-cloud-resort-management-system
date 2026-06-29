import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const villaRouter = createTRPCRouter({
  getPublicList: publicProcedure.query(({ ctx }) => {
    return ctx.db.villa.findMany({
      where: {
        status: "ACTIVE",
      },
      include: {
        images: {
          orderBy: {
            sortOrder: "asc",
          },
        },
        amenities: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
  }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string().min(1) }))
    .query(({ ctx, input }) => {
      return ctx.db.villa.findUnique({
        where: {
          slug: input.slug,
        },
        include: {
          images: {
            orderBy: {
              sortOrder: "asc",
            },
          },
          amenities: true,
        },
      });
    }),
});
