import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import { execPromiseStdout } from "~/utils/exec";
import Commands from "~/utils/commands";

export type ContainerStatuses = "Exited" | "Up" | "Undefined";

export const containerActionsValues = ["start", "stop", "reload"] as const;
export const containerActions = z.enum(containerActionsValues);
export type ContainerActions = z.infer<typeof containerActions>;
const containerNameSchema = z.object({ name: z.string() });
export const dockerRouter = router({
  getStatus: protectedProcedure
    .input(containerNameSchema)
    .query(async ({ input }) => {
      const status = (await execPromiseStdout(
        Commands.Docker.checkStatus(input.name),
      )) as string;
      return status.split(" ").at(0) as ContainerStatuses;
    }),
  changeContainerStatus: protectedProcedure
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
  getLogs: protectedProcedure
    .input(containerNameSchema)
    .query(async ({ input }) => {
      return await execPromiseStdout(Commands.Docker.getLogs(input.name));
    }),
});
