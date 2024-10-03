import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {},

  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    DOCKER_BASE_PATH: process.env.DOCKER_BASE_PATH,
    DOCKER_NETWORK_NAME: process.env.DOCKER_NETWORK_NAME,
    MYSQL_ROOT_PASSWORD: process.env.MYSQL_ROOT_PASSWORD,
    MYSQL_PUBLIC_PORT: process.env.MYSQL_PUBLIC_PORT,
    MYSQL_CONTAINER_NAME: process.env.MYSQL_CONTAINER_NAME,
    NGINX_CONTAINER_NAME: process.env.NGINX_CONTAINER_NAME,
  },
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    DOCKER_BASE_PATH: z.string(),
    DOCKER_NETWORK_NAME: z.string(),
    MYSQL_ROOT_PASSWORD: z.string(),
    MYSQL_PUBLIC_PORT: z.string(),
    MYSQL_CONTAINER_NAME: z.string(),
    DATABASE_URL: z
      .string()
      .url()
      .refine(
        (str) => !str.includes("YOUR_MYSQL_URL_HERE"),
        "You forgot to change the default URL",
      ),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    NGINX_CONTAINER_NAME: z.string(),
  },
});
