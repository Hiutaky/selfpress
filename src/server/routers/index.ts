import { router } from "../trpc";
import { dockerRouter } from "./docker";
import { domainRouter } from "./domain";
import { mainRouter } from "./main";
import userRouter from "./user";
import { wordpressRouter } from "./wordpress";

export const appRouter = router({
  docker: dockerRouter,
  domain: domainRouter,
  main: mainRouter,
  user: userRouter,
  wordpress: wordpressRouter,
});

export type AppRouter = typeof appRouter;
