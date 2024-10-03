import { z } from "zod";

export const createDomainSchema = z.object({
  domain: z.string(),
  wordpressId: z.number(),
  wpContainerName: z.string(),
});
