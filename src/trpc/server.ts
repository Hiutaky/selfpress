import {
  TRPCClientError,
  createTRPCProxyClient,
  loggerLink,
} from "@trpc/client";
import { callProcedure } from "@trpc/server";
import { observable } from "@trpc/server/observable";
import { type TRPCErrorResponse } from "@trpc/server/rpc";
import { cache } from "react";
import "server-only";

import { transformer } from "./shared";
import { appRouter, type AppRouter } from "@/server/routers";
import { createTRPCContext } from "@/server/trpc";

/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a tRPC call from a React Server Component.
 */
const createContext = cache(() => {
  return createTRPCContext();
});

export const api = createTRPCProxyClient<AppRouter>({
  links: [
    loggerLink({
      enabled: (op) =>
        process.env.NODE_ENV === "development" ||
        (op.direction === "down" && op.result instanceof Error),
    }),
    /**
     * Custom RSC link that lets us invoke procedures without using http requests. Since Server
     * Components always run on the server, we can just call the procedure as a function.
     */
    () =>
      ({ op }) =>
        observable((observer) => {
          createContext()
            .then((ctx) => {
              return callProcedure({
                ctx,
                path: op.path,
                procedures: appRouter._def.procedures,
                rawInput: op.input,
                type: op.type,
              });
            })
            .then((data) => {
              observer.next({
                result: {
                  data,
                },
              });
              observer.complete();
            })
            .catch((cause: TRPCErrorResponse) => {
              observer.error(TRPCClientError.from(cause));
            });
        }),
  ],
  transformer,
});
