import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { execPromiseStdout } from "~/utils/exec";
import Commands from "~/utils/commands";

export type ContainerStatuses = "Exited" | "Up" | "Undefined";

export const containerActionsValues = ["start", "stop", "reload"] as const;
export const containerActions = z.enum(containerActionsValues);
export type ContainerActions = z.infer<typeof containerActions>;

export const dockerRouter = router({
  getStatus: publicProcedure
    .input(z.object({ name: z.string() }))
    .query(async ({ input }) => {
      const status = (await execPromiseStdout(
        Commands.Docker.checkStatus(input.name),
      )) as string;
      return status.split(" ").at(0) as ContainerStatuses;
    }),
  changeContainerStatus: publicProcedure
    .input(
      z.object({
        containerName: z.string(),
        action: containerActions,
      }),
    )
    .mutation(async ({ input }) => {
      try {
        const response = await execPromiseStdout(
          Commands.Docker.updateContainer(input.containerName, input.action),
        );
        console.log(response);
        return response;
      } catch (e) {
        console.error(e);
      }
    }),
});
