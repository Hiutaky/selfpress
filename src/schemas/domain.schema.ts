import { z } from "zod";

export const createDomainSchema = z.object({
  domain: z.string(),
  oldURL: z.string().url(),
  wordpressId: z.number(),
  wpContainerName: z.string(),
  ssl: z.boolean(),
  certificate: z.string().optional(),
  key: z.string().optional(),
});
