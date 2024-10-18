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
    PUBLIC_URL: process.env.PUBLIC_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    PHPMYADMIN_CONTAINER_NAME: process.env.PHPMYADMIN_CONTAINER_NAME,
    PUBLIC_IP: process.env.PUBLIC_IP,
    SFTP_CONTAINER_NAME: process.env.SFTP_CONTAINER_NAME,
    REDIS_CONTAINER_NAME: process.env.REDIS_CONTAINER_NAME,
    SFTP_PORT: process.env.SFTP_PORT,
    CLOUDFLARE_EMAIL: process.env.CLOUDFLARE_EMAIL,
    CLOUDFLARE_API_KEY: process.env.CLOUDFLARE_API_KEY,
  },
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    PUBLIC_URL: z.string(),
    PUBLIC_IP: z.string(),
    DOCKER_BASE_PATH: z.string(),
    DOCKER_NETWORK_NAME: z.string(),
    MYSQL_ROOT_PASSWORD: z.string(),
    MYSQL_PUBLIC_PORT: z.string(),
    MYSQL_CONTAINER_NAME: z.string(),
    NEXTAUTH_SECRET:
      process.env.NODE_ENV === "production"
        ? z.string()
        : z.string().optional(),
    NEXTAUTH_URL: z.preprocess(
      // This makes Vercel deployments not fail if you don't set NEXTAUTH_URL
      // Since NextAuth.js automatically uses the VERCEL_URL if present.
      (str) => process.env.VERCEL_URL ?? str,
      // VERCEL_URL doesn't include `https` so it cant be validated as a URL
      process.env.VERCEL ? z.string() : z.string().url(),
    ),
    DATABASE_URL: z
      .string()
      .url()
      .refine(
        (str) => !str.includes("YOUR_MYSQL_URL_HERE"),
        "You forgot to change the default URL",
      ),
    PHPMYADMIN_CONTAINER_NAME: z.string(),
    SFTP_CONTAINER_NAME: z.string(),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    NGINX_CONTAINER_NAME: z.string(),
    REDIS_CONTAINER_NAME: z.string(),
    SFTP_PORT: z.string(),
    CLOUDFLARE_EMAIL: z.string(),
    CLOUDFLARE_API_KEY: z.string(),
  },
});
