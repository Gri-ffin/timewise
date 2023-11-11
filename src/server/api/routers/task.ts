import * as z from 'zod'

import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";


export const taskRouter = createTRPCRouter({
  // the precedure the create the task
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
          done: false,
          user: { connect: { id: ctx.session.user.id } },
        },
      });
    }),

  // the procedure the update the task based on the id
  update: protectedProcedure
    .input(z.object({
      id: z.number(),
      title: z.string().min(5).max(40),
      memo: z.string().min(3).max(60),
      deadline: z.date()

    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.task.update({
        where: {
          user: { id: ctx.session.user.id },
          id: input.id,
        },
        data: {
          title: input.title,
          memo: input.memo,
          deadline: input.deadline
        }
      })
    }),

  // the procedure the delete the task based on the id
  delete: protectedProcedure
    .input(z.object({
      id: z.number()
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.task.delete({
        where: {
          user: { id: ctx.session.user.id },
          id: input.id
        }
      })
    }),

  //
  changeStatusDone: protectedProcedure
    .input(z.object({
      done: z.boolean(),
      id: z.number()
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.task.update({
        where: {
          user: { id: ctx.session.user.id },
          id: input.id,
        },
        data: {
          done: input.done
        }
      })
    }),

  // the procedure the fetch the tasks between an interval of dates passed
  getTasks: protectedProcedure
    .input(z.object({
      startDateFilter: z.date(),
      finishDateFilter: z.date()
    }))
    .query(({ ctx, input }) => {
      return ctx.db.task.findMany({
        orderBy: { createdAt: "desc" },
        where: {
          user: { id: ctx.session.user.id },
          deadline: {
            gte: input.startDateFilter,
            lt: input.finishDateFilter
          }
        },
      });
    }),
});
