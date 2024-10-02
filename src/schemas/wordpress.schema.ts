import { z } from "zod";

export const installationStatus = z.enum(["RUNNING", "STOPPED", "ERROR"]);
export type InstallationStatus = z.infer<typeof installationStatus>;

// Schema per la creazione di una nuova installazione WordPress
export const createWordPressInstallationSchema = z.object({
  name: z.string().min(3),
  domain: z.string().url(),
  status: z.string().default(installationStatus.Enum.RUNNING),
  dockerConfig: z.object({
    image: z.string().default("wordpress:latest"),
    volumes: z
      .string()
      .default("/home/alessandro/Scrivania/Code/installations/"),
    environment: z.string().default("development"),
    restartPolicy: z.string(),
    networkName: z.string(),
  }),
  wordpressSettings: z.object({
    adminName: z.string(),
    adminPassword: z.string().min(9),
    adminEmail: z.string().email(),
    siteDescription: z.string(),
    siteName: z.string(),
    siteUrl: z.string().url(),
    tablePrefix: z.string().default("WP_"),
  }),
});

// Schema per la modifica di un'installazione WordPress
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

// Schema per la lettura e cancellazione di un'installazione
export const getOrDeleteWordPressInstallationSchema = z.object({
  name: z.string(),
});
