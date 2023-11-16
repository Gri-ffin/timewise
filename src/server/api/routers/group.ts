import * as z from 'zod'

import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import { ICONSTYPES } from '~/utils/group/types';

export const groupRouter = createTRPCRouter({
  // the precedure the create the group 
  create: protectedProcedure
    .input(z.object(
      {
        name: z.string().min(3).max(10),
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
    })
})
