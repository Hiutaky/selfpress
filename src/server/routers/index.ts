import { router } from "../trpc";
import { wordpressRouter } from "./wordpress";

export const appRouter = router({
  wordpress: wordpressRouter,
});

export type AppRouter = typeof appRouter;
