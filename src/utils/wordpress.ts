import { execPromiseStdout, runCommandWithLogging } from "./exec";
import MySQL from "./mysql";
import { env } from "~/env";
import Commands from "./commands";
import { readFile } from "fs/promises";
import { cwd } from "process";
import path from "path";
import { writeFile } from "fs/promises";

/**
 * TYPES
 */
export type CreateWordPressInstance = {
  dbName: string;
  dbUser: string;
  dbPassword: string;
  port: number;
  networkName?: string;
  domain: string;
  uniqueName: string;
  settings: {
    adminEmail: string;
    adminName: string;
    adminPassword: string;
    siteDescription: string;
    siteName: string;
  };
};

/**
 * FUNCTIONS
 */
const createNewWordPressInstance = async ({
  dbName,
  dbPassword,
  dbUser,
  networkName = env.DOCKER_NETWORK_NAME,
  domain,
  port,
  uniqueName,
  settings,
}: CreateWordPressInstance) => {
  //creating mysql db

  console.log('createnew')
  const result = await MySQL.createMysqlDatabase({
    dbName,
    dbUser,
    dbPassword,
  });


  console.log(result)

  //creating sftp account and folder
  await execPromiseStdout(
    Commands.SFTP.addUser(uniqueName, dbPassword, env.SFTP_CONTAINER_NAME),
  );
  await execPromiseStdout(Commands.Docker.restart(env.SFTP_CONTAINER_NAME));

  if (result && !result.success) {
    return false;
  }
  const retries = 5;
  const delay = 10000;
  try {
    const response = await runCommandWithLogging(
      Commands.WordPress.create({
        dbName,
        dbPassword,
        dbUser,
        mysqlContainer: env.MYSQL_CONTAINER_NAME,
        mysqlPort: env.MYSQL_PUBLIC_PORT,
        networkName,
        uniqueName,
        port,
      }),
    );
    if (response) {
      const installResponse = await runCommandWithLogging(
        Commands.WordPress.installWpCli({ uniqueName }),
      );
      if (installResponse) {
        for (let i = 0; i < retries; i++) {
          try {
            const setupResponse = await runCommandWithLogging(
              Commands.WordPress.setupWpCli({
                adminEmail: settings.adminEmail,
                adminName: settings.adminName,
                adminPassword: settings.adminPassword,
                domain,
                siteDescription: settings.siteDescription,
                siteName: settings.siteName,
                uniqueName,
                redisContainer: env.REDIS_CONTAINER_NAME,
              }),
            );
            if (setupResponse) {
              await runCommandWithLogging(
                Commands.WordPress.copySafepressPlugin(uniqueName),
              );
              await runCommandWithLogging(
                Commands.WordPress.activateSafepressPlugin(uniqueName),
              );
              await runCommandWithLogging(
                Commands.WordPress.installRedisPlugin(uniqueName),
              );
            }
            return setupResponse;
          } catch (error) {
            console.error(
              `Attempt ${i + 1}: Error executing WP Setup command: ${error}`,
            );
            if (i < retries - 1) {
              console.log(`Retrying in ${delay / 1000} seconds...`);
              await new Promise((resolve) => setTimeout(resolve, delay)); // Wait before retrying
            } else {
              console.error(`Error during wordpress creation process`, error);
              return {
                success: false,
                message: `Error creating wp instance"`,
                error,
              };
            }
          }

          /**
           * SETUP NGINX with Temp Domain
           */
          let file = await readFile(
            path.join(cwd(), "defaults/nginx/nginx-ssl.conf"),
            "utf-8",
          );
          file = file
            .replaceAll("{DOMAIN}", domain)
            .replaceAll("key-{CONTAINER}", "key-main")
            .replaceAll("cert-{CONTAINER}", "cert-main")
            .replaceAll("{CONTAINER}", uniqueName);
          await writeFile(
            path.join(
              cwd(),
              `/applications/confs/nginx/conf.d/${uniqueName}.conf`,
            ),
            file,
          );
          await execPromiseStdout(
            Commands.Nginx.reload(env.NGINX_CONTAINER_NAME),
          );
          
        }
        return false;
      } else return false;
    } else return false;
  } catch (e) {
    console.log(e);
    return false;
  }
};

const WordPress = {
  createNewWordPressInstance,
};

export default WordPress;
