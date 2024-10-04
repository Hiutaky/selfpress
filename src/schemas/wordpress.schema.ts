import { z } from "zod";

export const installationStatus = z.enum(["RUNNING", "STOPPED", "ERROR"]);
export type InstallationStatus = z.infer<typeof installationStatus>;

export const createSitePreviewSchema = z.object({
  id: z.number(),
  url: z.string(),
});

export const createWordPressInstallationSchema = z.object({
  name: z.string().min(3),
  domain: z.string().url().default("http://localhost"),
  status: z.string().default(installationStatus.Enum.RUNNING),
  dockerConfig: z.object({
    image: z.string().default("wordpress:latest"),
    environment: z.string().default("development"),
    restartPolicy: z.string().default("always"),
  }),
  wordpressSettings: z.object({
    adminName: z.string(),
    adminPassword: z.string().min(9),
    adminEmail: z.string().email(),
    siteDescription: z.string(),
    siteName: z.string(),
  }),
});

export const updateWordPressInstallationSchema = z.object({
  id: z.number(),
  name: z.string().optional(),
  domain: z.string().url().optional(),
  path: z.string().optional(),
  dockerConfig: z
    .object({
      containerName: z.string().optional(),
      image: z.string().optional(),
      ports: z.string().optional(),
      volumes: z.string().optional(),
      environment: z.string().optional(),
      restartPolicy: z.string().optional(),
    })
    .optional(),
  wordpressSettings: z
    .object({
      siteName: z.string().optional(),
      siteUrl: z.string().url().optional(),
      adminEmail: z.string().email().optional(),
      dbHost: z.string().optional(),
      dbName: z.string().optional(),
      dbUser: z.string().optional(),
      dbPassword: z.string().optional(),
      tablePrefix: z.string().optional(),
    })
    .optional(),
});

export const getOrDeleteWordPressInstallationSchema = z.object({
  id: z.number().or(z.string()),
});
