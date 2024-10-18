import { signupSchema } from "~/schemas/user.schema";
import { publicProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";
import { hashSync } from "bcrypt-ts";
import { maybeInitializeSelfpress } from "~/utils/main";

const userRouter = router({
  count: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.user.count();
  }),
  signup: publicProcedure
    .input(signupSchema)
    .mutation(async ({ ctx, input }) => {
      if (!(await ctx.db.user.count())) await maybeInitializeSelfpress();

      const userExist = await ctx.db.user.findFirst({
        where: {
          OR: [
            {
              username: input.username,
            },
            {
              email: input.email,
            },
          ],
        },
      });
      if (userExist)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User already exist.",
        });
      const password = hashSync(input.password);
      await ctx.db.user.create({
        data: {
          ...input,
          password: password,
        },
      });
      return {
        email: input.email,
        password: input.password,
      };
    }),
});

export default userRouter;
