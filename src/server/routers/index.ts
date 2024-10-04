import { router } from "../trpc";
import { dockerRouter } from "./docker";
import { domainRouter } from "./domain";
import { wordpressRouter } from "./wordpress";

export const appRouter = router({
  docker: dockerRouter,
  domain: domainRouter,
  wordpress: wordpressRouter,
});

export type AppRouter = typeof appRouter;
