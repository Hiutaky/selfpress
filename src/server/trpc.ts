import { PrismaClient } from "@prisma/client";
import { initTRPC, TRPCError } from "@trpc/server";
import { inferAsyncReturnType } from "@trpc/server";
import SuperJSON from "superjson";
import { getServerAuthSession } from "~/app/api/auth/[...nextauth]/route";

export const createTRPCContext = async () => {
  const session = await getServerAuthSession();
  return {
    db: new PrismaClient(),
    session,
  };
};

type Context = inferAsyncReturnType<typeof createTRPCContext>;

const t = initTRPC.context<Context>().create({
  transformer: SuperJSON,
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.session?.user)
    throw new TRPCError({
      code: "UNAUTHORIZED",
    });
  console.log(ctx.session.user);
  return next({
    ctx,
  });
});
