import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";


export const accountRouter = createTRPCRouter({
  // the precedure to get the user accounts 
  getAccounts: protectedProcedure
    .query(async ({ ctx }) => {
      return ctx.db.account.findFirst({
        where: {
          user: { id: ctx.session.user.id },
        },
      });
    }),
})
