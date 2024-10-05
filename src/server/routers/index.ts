import { router } from "../trpc";
import { dockerRouter } from "./docker";
import { domainRouter } from "./domain";
import userRouter from "./user";
import { wordpressRouter } from "./wordpress";

export const appRouter = router({
  docker: dockerRouter,
  domain: domainRouter,
  user: userRouter,
  wordpress: wordpressRouter,
});

export type AppRouter = typeof appRouter;
