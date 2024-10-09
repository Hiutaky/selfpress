import { createDomainSchema } from "~/schemas/domain.schema";
import { protectedProcedure, router } from "../trpc";
import { execPromise, execPromiseStdout } from "~/utils/exec";
import Commands from "~/utils/commands";
import { env } from "~/env";
import { readFile, writeFile } from "fs/promises";
import path from "path";
import { TRPCError } from "@trpc/server";

const cwd = process.cwd();

export const domainRouter = router({
  create: protectedProcedure
    .input(createDomainSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session?.user.id) {
        return;
      }
      const { wpContainerName, domain } = input;
      //check if nginx container not exist yet, then create it
      const cleanURL = domain
        .replaceAll("https://", "")
        .replaceAll("http://", "");

      if (input.ssl)
        if (!input.certificate || !input.key)
          return new TRPCError({
            code: "BAD_REQUEST",
            message: "Provide a valid Certificate and Key",
          });

      //writing nginx conf file
      let file = await readFile(
        path.join(
          cwd,
          input.ssl ? "defaults/nginx/nginx-ssl.conf" : "defaults/nginx/nginx.conf",
        ),
        "utf-8",
      );
      file = file
        .replaceAll("{DOMAIN}", cleanURL)
        .replaceAll("{CONTAINER}", wpContainerName);
      await writeFile(
        path.join(cwd, `/applications/confgs/nginx/conf.d/${wpContainerName}.conf`),
        file,
      );

      //writing ssl certificate and key
      if (input.ssl) {
        await writeFile(
          path.join(cwd, `/applications/confgs/nginx/conf.d/certs/cert-${wpContainerName}.pem`),
          input.certificate!,
        );
        await writeFile(
          path.join(cwd, `/applications/confgs/nginx/conf.d/certs/key-${wpContainerName}.pem`),
          input.key!,
        );
      }

      //check if nginx container exists
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
      try {
        //reload nginx container configurations
        await execPromiseStdout(
          Commands.Nginx.reload(env.NGINX_CONTAINER_NAME),
        );
        //replace wordpress localhost url with new domain
        await execPromiseStdout(
          Commands.WordPress.replaceUrls(
            input.wpContainerName,
            input.oldURL,
            input.domain,
          ),
        );
        const id = ctx.session.user.id as number;
        //create new domain entity
        const create = await ctx.db.domain.create({
          data: {
            dnsPointing: false,
            domainName: input.domain,
            isSsl: input.ssl,
            wordpressInstallation: {
              connect: {
                id: input.wordpressId,
              },
            },
            userId: id,
          },
        });
        //update public url on wordpressSettings
        await ctx.db.wordPressInstallation.update({
          where: {
            id: input.wordpressId,
          },
          data: {
            wordpressSettings: {
              update: {
                siteUrl: input.domain,
              },
            },
          },
        });
        return create;
      } catch (e) {
        console.log(e);
        return false;
      }
    }),
  readAll: protectedProcedure.query(async ({ ctx }) => {
    const domains = await ctx.db.domain.findMany({
      include: {
        wordpressInstallation: true,
      },
    });
    return domains;
  }),
});
