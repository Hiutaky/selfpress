import nextAuth, { DefaultSession } from "next-auth";
import { Prisma } from "@prisma/client";
import { authOptions } from "~/server/auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: Prisma.UserGetPayload<object>;
  }
}

const handler = nextAuth(authOptions);

export { handler as GET, handler as POST };
