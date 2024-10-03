import { router } from "../trpc";
import { domainRouter } from "./domain";
import { wordpressRouter } from "./wordpress";

export const appRouter = router({
  domain: domainRouter,
  wordpress: wordpressRouter,
});

export type AppRouter = typeof appRouter;
