import { PrismaAdapter } from "@next-auth/prisma-adapter";
import {
  PrismaClientInitializationError,
  PrismaClientKnownRequestError,
} from "@prisma/client/runtime/library";
import { compareSync } from "bcrypt-ts";
import { randomBytes, randomUUID } from "crypto";
import { getServerSession, NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { db } from "~/utils/db";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  callbacks: {
    jwt: ({ token, trigger, user }) => {
      if (trigger === "update") {
        // You can update the session in the database if it's not already updated.
        // await adapter.updateUser(session.user.id, { name: newSession.name })
        // Make sure the updated value is reflected on the client
      }
      if (user) {
        token.id = user.id;
      }

      return token;
    },
    async session({ session, token }) {
      const user = (await db.user.findFirst({
        where: {
          id: token.id as number,
        },
      }))!;
      session.user = {
        ...user,
      };
      return session;
    },
  },
  providers: [
    Credentials({
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      authorize: async (credentials) => {
        try {
          const result = await z
            .object({
              emailOrUsername: z.string().email(),
              password: z.string().min(9),
            })
            .safeParseAsync(credentials);

          if (!result.success) {
            throw new Error(result.error.errors.at(0)?.message);
          }
          const { emailOrUsername, password } = result.data;

          const user = await db.user.findFirst({
            where: {
              OR: [
                {
                  email: emailOrUsername,
                },
                {
                  username: emailOrUsername,
                },
              ],
            },
          });

          if (!user) {
            throw new Error("userNotExist");
          }

          const passwordsMatch = compareSync(password, user.password ?? "");

          if (!passwordsMatch) {
            throw new Error("invalidPassword");
          }

          return user;
        } catch (error) {
          if (
            error instanceof PrismaClientInitializationError ||
            error instanceof PrismaClientKnownRequestError
          ) {
            throw new Error("unknown");
          }
          throw error;
        }
      },
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "Password", type: "text" },
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    generateSessionToken: () => {
      return generateToken();
    },
    maxAge: 30 * 24 * 60 * 60, // 30d
    strategy: "jwt",
  },
};

export const generateToken = (): string => {
  return randomUUID?.() ?? randomBytes(32).toString("hex");
};

export const getServerAuthSession = () => getServerSession(authOptions);
