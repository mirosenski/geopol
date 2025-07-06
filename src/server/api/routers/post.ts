import { z } from "zod";
import type { Session } from "next-auth";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const postRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  create: protectedProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const session = ctx.session as Session & {
        user: {
          id: string;
          role: "ADMIN" | "USER" | "PENDING";
        };
      };

      return ctx.db.post.create({
        data: {
          name: input.name,
          createdBy: { connect: { id: session.user.id } },
        },
      });
    }),

  getLatest: protectedProcedure.query(async ({ ctx }) => {
    const session = ctx.session as Session & {
      user: {
        id: string;
        role: "ADMIN" | "USER" | "PENDING";
      };
    };

    const post = await ctx.db.post.findFirst({
      orderBy: { createdAt: "desc" },
      where: { createdBy: { id: session.user.id } },
    });

    return post ?? null;
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
