import * as z from 'zod'

import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";


export const taskRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object(
      {
        title: z.string().min(5).max(40),
        memo: z.string().min(3).max(60),
        deadline: z.date()
      }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.task.create({
        data: {
          title: input.title,
          memo: input.memo,
          deadline: input.deadline,
          user: { connect: { id: ctx.session.user.id } },
        },
      });
    }),

  /* getLatest: protectedProcedure.query(({ ctx }) => {
      return ctx.db.post.findFirst({
        orderBy: { createdAt: "desc" },
        where: { createdBy: { id: ctx.session.user.id } },
      });
    }), */
});
