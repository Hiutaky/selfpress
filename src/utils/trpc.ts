// utils/trpc.ts
import { AppRouter } from "@/server/routers";
import { createTRPCNext } from "@trpc/next";

export const trpc = createTRPCNext<AppRouter>({
  config() {
    return {
      url: "/api/trpc", // Correct API route
    };
  },
});
