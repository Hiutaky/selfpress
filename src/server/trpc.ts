import { PrismaClient } from "@prisma/client";
import { initTRPC } from "@trpc/server";
import { inferAsyncReturnType } from "@trpc/server";
import { getServerSession } from "next-auth";
import SuperJSON from "superjson";

export const createTRPCContext = async () => {
  const session = await getServerSession();
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
