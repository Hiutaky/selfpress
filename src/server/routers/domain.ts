import { createDomainSchema } from "~/schemas/domain.schema";
import { publicProcedure, router } from "../trpc";
import { execPromise, execPromiseStdout } from "~/utils/exec";
import Commands from "~/utils/commands";
import { env } from "~/env";
import { readFile, writeFile } from "fs/promises";
import path from "path";

export const domainRouter = router({
  create: publicProcedure
    .input(createDomainSchema)
    .mutation(async ({ ctx, input }) => {
      //check if nginx container not exist yet, then create it
      let file = await readFile(
        path.join(process.cwd(), "/default.conf"),
        "utf-8",
      );

      input.domain = input.domain.replaceAll("https://", "");
      input.domain = input.domain.replaceAll("http://", "");

      file = file.replaceAll("{DOMAIN}", input.domain);
      file = file.replaceAll("{CONTAINER_NAME}", input.wpContainerName);

      await writeFile(
        path.join(
          process.cwd(),
          `/nginx-configs/${input.wpContainerName}.conf`,
        ),
        file,
      );

      console.log(
        (await execPromiseStdout(
          Commands.Docker.checkName(env.NGINX_CONTAINER_NAME),
        )) ?? "false",
      );
      if (
        !(await execPromiseStdout(
          Commands.Docker.checkName(env.NGINX_CONTAINER_NAME),
        ))
      )
        await execPromise(
          Commands.Nginx.create(
            env.NGINX_CONTAINER_NAME,
            env.DOCKER_NETWORK_NAME,
          ),
        );

      await execPromiseStdout(Commands.Nginx.reload(env.NGINX_CONTAINER_NAME));
      return await ctx.db.domain.create({
        data: {
          dnsPointing: false,
          domainName: input.domain,
          wordpressInstallation: {
            connect: {
              id: input.wordpressId,
            },
          },
        },
      });
    }),
  readAll: publicProcedure.query(async ({ ctx }) => {
    const domains = await ctx.db.domain.findMany();
    return domains;
  }),
});
