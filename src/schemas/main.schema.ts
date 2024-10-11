import { z } from "zod";

export const setupCloudflareSchema = z.object({
  zoneId: z.string(),
  baseUrl: z.string(),
  panelUrl: z.string(),
  caCertificate: z.string(),
  caKey: z.string(),
});
