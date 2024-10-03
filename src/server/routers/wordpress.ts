import { publicProcedure, router } from "../trpc";
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

// Router tRPC per WordPressInstallations
export const wordpressRouter = router({
  create: publicProcedure
    .input(createWordPressInstallationSchema)
    .mutation(async ({ ctx, input }) => {
      const { dockerConfig, wordpressSettings, ...installationData } = input;

      const rand = randomBytes(8).toString("hex");
      const dbName = `db_${rand}`;
      const dbUser = `user_${rand}`;
      const dbPassword = randomBytes(16).toString("hex");
      const uniqueUuid = randomBytes(2).toString("hex");
      const uniqueContainerName = `wp-${uniqueUuid}`;
      let port = 8080;

      while (await Docker.isPortUsed(port)) port++;

      wordpressSettings.siteUrl = `${wordpressSettings.siteUrl}:${port}`;
      installationData.domain = `${installationData.domain}:${port}`;
      installationData.name = `${installationData.name}_${rand}`;
      try {
        await Docker.createNetwork(env.DOCKER_NETWORK_NAME);
        const response = await WordPress.createNewWordPressInstance({
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
        if (!response)
          return new TRPCError({
            message: "Unable to create wordpress instance",
            code: "INTERNAL_SERVER_ERROR",
          });
        const dockerConfigCreated = await ctx.db.dockerConfig.create({
          data: {
            ports: port.toString(),
            ...dockerConfig,
            containerName: uniqueContainerName,
          },
        });
        const wordpressSettingsCreated = await ctx.db.wordPressSettings.create({
          data: {
            ...wordpressSettings,
            dbHost: `${env.MYSQL_CONTAINER_NAME}:3306`,
            dbName,
            dbPassword: dbPassword,
            dbUser,
          },
        });
        const installationCreated = await ctx.db.wordPressInstallation.create({
          data: {
            path: `${process.cwd()}/${env.DOCKER_BASE_PATH}/${uniqueContainerName}:var/www/html`,
            dockerId: uniqueContainerName,
            ...installationData,
            dockerConfigId: dockerConfigCreated.id,
            wordpressSettingsId: wordpressSettingsCreated.id,
          },
        });

        return installationCreated;
      } catch (e) {
        console.error(`Error during docker creation: ${e}`);
        throw new Error("Unable to create Docker container");
      }
    }),

  // Leggi una singola installazione di WordPress
  read: publicProcedure
    .input(getOrDeleteWordPressInstallationSchema)
    .query(async ({ ctx, input }) => {
      return await ctx.db.wordPressInstallation.findUnique({
        where: { name: input.name },
        include: {
          dockerConfig: true,
          wordpressSettings: true,
        },
      });
    }),

  // Leggi tutte le installazioni di WordPress
  readAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.wordPressInstallation.findMany({
      include: {
        dockerConfig: true,
        wordpressSettings: true,
      },
    });
  }),

  // Modifica un'installazione di WordPress
  update: publicProcedure
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
  delete: publicProcedure
    .input(getOrDeleteWordPressInstallationSchema)
    .mutation(async ({ ctx, input }) => {
      // Trova l'installazione
      const installation = await ctx.db.wordPressInstallation.findUnique({
        where: { name: input.name },
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
        where: { name: input.name },
      });

      return { success: true };
    }),
});
