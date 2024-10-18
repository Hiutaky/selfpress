import { protectedProcedure, router } from "../trpc";
import {
  createWordPressInstallationSchema,
  updateWordPressInstallationSchema,
  getOrDeleteWordPressInstallationSchema,
} from "../../schemas/wordpress.schema";
import { randomBytes } from "crypto";
import { env } from "~/env";
import WordPress from "~/utils/wordpress";
import { TRPCError } from "@trpc/server";
import Docker from "~/utils/docker";
import { cwd } from "process";
import cloudflare, { getIp } from "~/utils/cloudflare";

// Router tRPC per WordPressInstallations
export const wordpressRouter = router({
  create: protectedProcedure
    .input(createWordPressInstallationSchema)
    .mutation(async ({ ctx, input }) => {
      const { dockerConfig, wordpressSettings, ...installationData } = input;
      if (!ctx.session?.user) throw new TRPCError({ code: "UNAUTHORIZED" });
      const dbPassword = randomBytes(16).toString("hex");
      const uniqueUuid = randomBytes(2).toString("hex");
      const uniqueContainerName = `wp_${uniqueUuid}`;
      const dbName = `db_${uniqueContainerName}`;
      const dbUser = `user_${uniqueContainerName}`;
      let port = 8080;

      const settings = await ctx.db.globalSettings.findFirst();

      if (!settings)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Unable to find a Cloudflare zone",
        });

      const resp = await cloudflare.dns.records.create({
        content: await getIp(),
        proxied: true,
        type: "A",
        name: uniqueContainerName,
        zone_id: settings.cloudflareZoneId,
      });

      const publicUrl = resp.name;
      while (await Docker.isPortUsed(port)) port++;
      installationData.domain = publicUrl;
      installationData.name = `${installationData.name}`;
      try {
        console.log("int try");
        await Docker.createNetwork(env.DOCKER_NETWORK_NAME);
        const response = await WordPress.createNewWordPressInstance({
          domain: publicUrl,
          dbName,
          dbUser,
          dbPassword,
          port: port,
          uniqueName: uniqueContainerName,
          settings: {
            adminEmail: wordpressSettings.adminEmail,
            adminName: wordpressSettings.adminName,
            adminPassword: wordpressSettings.adminPassword,
            siteDescription: wordpressSettings.siteDescription,
            siteName: wordpressSettings.siteName,
          },
        });

        const call = await fetch(`http://localhost:3000/api/screenshot`, {
          method: "POST",
          body: JSON.stringify({
            url: installationData.domain,
            id: uniqueContainerName,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        let imagePath: string | null = null;
        if (call.status === 200)
          imagePath = ((await call.text()) as string).replaceAll('"', "");

        if (!response)
          throw new TRPCError({
            message: "Unable to create wordpress instance",
            code: "INTERNAL_SERVER_ERROR",
          });
        const dockerConfigCreated = await ctx.db.dockerConfig.create({
          data: {
            networkName: env.DOCKER_NETWORK_NAME,
            volumes: `${cwd()}/${env.DOCKER_BASE_PATH}/data`,
            ports: port.toString(),
            ...dockerConfig,
            containerName: uniqueContainerName,
          },
        });
        const wordpressSettingsCreated = await ctx.db.wordPressSettings.create({
          data: {
            siteUrl: installationData.domain,
            ...wordpressSettings,
            dbHost: `${env.MYSQL_CONTAINER_NAME}:3306`,
            dbName,
            dbPassword: dbPassword,
            dbUser,
          },
        });
        const installationCreated = await ctx.db.wordPressInstallation.create({
          data: {
            path: `${process.cwd()}/applications/data/${uniqueContainerName}/wp:var/www/html`,
            dockerId: uniqueContainerName,
            imagePath: imagePath,
            ...installationData,
            dockerConfigId: dockerConfigCreated.id,
            wordpressSettingsId: wordpressSettingsCreated.id,
            userId: ctx.session.user.id,
          },
        });

        return installationCreated;
      } catch (e) {
        console.error(`Error during docker creation: ${e}`);
        throw new Error("Unable to create Docker container");
      }
    }),

  // Leggi una singola installazione di WordPress
  read: protectedProcedure
    .input(getOrDeleteWordPressInstallationSchema)
    .query(async ({ ctx, input }) => {
      console.log("input", input);
      return await ctx.db.wordPressInstallation.findUnique({
        where: { id: Number(input.id) },
        include: {
          dockerConfig: true,
          wordpressSettings: true,
        },
      });
    }),

  // Leggi tutte le installazioni di WordPress
  readAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.wordPressInstallation.findMany({
      include: {
        dockerConfig: true,
        wordpressSettings: true,
      },
    });
  }),

  // Modifica un'installazione di WordPress
  update: protectedProcedure
    .input(updateWordPressInstallationSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, dockerConfig, wordpressSettings, ...updateData } = input;

      // Aggiorna WordPressInstallation
      const updatedInstallation = await ctx.db.wordPressInstallation.update({
        where: { id },
        data: updateData,
      });
      if (
        !updatedInstallation ||
        !updatedInstallation.dockerConfigId ||
        !updatedInstallation.wordpressSettingsId
      )
        return false;

      // Aggiorna DockerConfig (se presente)
      if (dockerConfig) {
        await ctx.db.dockerConfig.update({
          where: { id: updatedInstallation.dockerConfigId },
          data: dockerConfig,
        });
      }

      // Aggiorna WordPressSettings (se presente)
      if (wordpressSettings) {
        await ctx.db.wordPressSettings.update({
          where: { id: updatedInstallation.wordpressSettingsId },
          data: wordpressSettings,
        });
      }

      return updatedInstallation;
    }),

  // Elimina un'installazione di WordPress
  delete: protectedProcedure
    .input(getOrDeleteWordPressInstallationSchema)
    .mutation(async ({ ctx, input }) => {
      // Trova l'installazione
      const installation = await ctx.db.wordPressInstallation.findUnique({
        where: { id: Number(input.id) },
      });

      if (
        !installation ||
        !installation.dockerConfigId ||
        !installation.wordpressSettingsId
      ) {
        throw new Error("Installazione non trovata");
      }

      // Elimina DockerConfig e WordPressSettings collegati
      await ctx.db.dockerConfig.delete({
        where: { id: installation.dockerConfigId },
      });

      await ctx.db.wordPressSettings.delete({
        where: { id: installation.wordpressSettingsId },
      });

      // Elimina WordPressInstallation
      await ctx.db.wordPressInstallation.delete({
        where: { id: Number(input.id) },
      });

      return { success: true };
    }),
});
