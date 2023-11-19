import * as z from 'zod'

import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import { ICONSTYPES } from '~/utils/group/types';

// add a delete and eedit procedure
export const groupRouter = createTRPCRouter({
  // the precedure the create the group 
  create: protectedProcedure
    .input(z.object(
      {
        name: z.string().min(3).max(20),
        icon: z.enum(ICONSTYPES)
      }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.group.create({
        data: {
          name: input.name,
          icon: input.icon,
          user: { connect: { id: ctx.session.user.id } },
        },
      });
    }),
  getAll: protectedProcedure
    .query(async ({ ctx }) => {
      return ctx.db.group.findMany({
        where: {
          user: { id: ctx.session.user.id }
        }
      })
    }),
  getAllWithTasks: protectedProcedure
    .query(async ({ ctx }) => {
      return ctx.db.group.findMany({
        where: {
          user: { id: ctx.session.user.id }
        },
        include: {
          Task: true
        }
      })
    }),
  // the procedure the update the task based on the id
  update: protectedProcedure
    .input(z.object({
      id: z.number(),
      name: z.string().min(3).max(20),
      icon: z.enum(ICONSTYPES),
    }))
    .mutation(async ({ ctx, input }) => {
      {
        return ctx.db.group.update({
          where: {
            user: { id: ctx.session.user.id },
            id: input.id,
          },
          data: {
            name: input.name,
            icon: input.icon,
          }
        });
      }
    }),
  delete: protectedProcedure
    .input(z.object({
      id: z.number(),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.group.delete({
        where: {
          user: { id: ctx.session.user.id },
          id: input.id,
        },
      });
    })
})
