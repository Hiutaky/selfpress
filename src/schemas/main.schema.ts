import { z } from "zod";

export const setupCloudflareSchema = z.object({
  domain: z.string(),
  zoneId: z.string(),
  baseUrl: z.string(),
  panelUrl: z.string(),
  caCertificate: z.string(),
  caKey: z.string(),
});
