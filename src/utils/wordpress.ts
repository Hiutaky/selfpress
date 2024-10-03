import { runCommandWithLogging } from "./exec";
import MySQL from "./mysql";
import { env } from "~/env";
import Commands from "./commands";

/**
 * TYPES
 */
export type CreateWordPressInstance = {
  dbName: string;
  dbUser: string;
  dbPassword: string;
  networkName?: string;
  port: number;
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
  port,
  uniqueName,
  settings,
}: CreateWordPressInstance) => {
  const mysqlExist = await MySQL.checkForMysqlContainer();
  if (!mysqlExist) await MySQL.createMysqlContainer();

  const result = await MySQL.createMysqlDatabase({
    dbName,
    dbUser,
    dbPassword,
  });

  if (result && !result.success) {
    console.log(result.message, result.error);
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
        dockerPath: `${process.cwd()}/${env.DOCKER_BASE_PATH}`,
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
        for(let i = 0; i < retries; i++) {
          try {
            const setupResponse = await runCommandWithLogging(
              Commands.WordPress.setupWpCli({
                adminEmail: settings.adminEmail,
                adminName: settings.adminName,
                adminPassword: settings.adminPassword,
                port,
                siteDescription: settings.siteDescription,
                siteName: settings.siteName,
                uniqueName,
              }),
            );
            if (setupResponse) {
              await runCommandWithLogging(
                Commands.WordPress.copySafepressPlugin(uniqueName),
              );
              await runCommandWithLogging(
                Commands.WordPress.activateSafepressPlugin(uniqueName),
              );
            }
            return setupResponse;
          } catch ( error ) {
            console.error(
              `Attempt ${i + 1}: Error executing WP Setup command: ${error}`,
            );
            if (i < retries - 1) {
              console.log(`Retrying in ${delay / 1000} seconds...`);
              await new Promise((resolve) => setTimeout(resolve, delay)); // Wait before retrying
            } else {
              console.error(
                `Error during wordpress creation process`,
                error,
              );
              return {
                success: false,
                message: `Error creating wp instance"`,
                error,
              };
            }
          }
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
