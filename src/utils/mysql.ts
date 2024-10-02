import { env } from "~/env";
import { execPromise } from "./exec";
import Commands from "./commands";

/**
 * TYPES
 */
export type CreateDatabase = {
  dbName: string;
  dbUser: string;
  dbPassword: string;
};

/**
 * CONSTANTS
 */
const { MYSQL_CONTAINER_NAME, MYSQL_ROOT_PASSWORD, MYSQL_PUBLIC_PORT } = env;

/**
 * FUNCTIONS
 */
const createMysqlContainer = async (networkName?: string) => {
  networkName = networkName ?? env.DOCKER_NETWORK_NAME;
  try {
    const result = await execPromise(
      Commands.MySQL.create({
        mysqlName: MYSQL_CONTAINER_NAME,
        mysqlPassword: MYSQL_ROOT_PASSWORD,
        mysqlPort: MYSQL_PUBLIC_PORT,
        networkName,
      }),
    );
    return {
      success: true,
      message: `Database Container ${MYSQL_CONTAINER_NAME} created successfully!`,
      result,
    };
  } catch (error) {
    return {
      success: false,
      message: `Error creating msyql ${MYSQL_CONTAINER_NAME}`,
      error,
    };
  }
};

const checkForMysqlContainer = async () => {
  const checkContainerCommand = `docker ps -a --filter "name=${MYSQL_CONTAINER_NAME}" --format "{{.Names}}"`;
  try {
    const { stdout } = await execPromise(checkContainerCommand);
    if (stdout.trim() === MYSQL_CONTAINER_NAME) {
      console.log(`Container "${MYSQL_CONTAINER_NAME}" exists.`);
      return true;
    } else {
      console.log(`Container "${MYSQL_CONTAINER_NAME}" does not exist.`);
      return false;
    }
  } catch (error) {
    console.error("Error checking for container existence:", error);
    throw error;
  }
};

const checkMySQLContainer = async () => {
  try {
    const output = await execPromise(
      Commands.MySQL.check(env.MYSQL_CONTAINER_NAME),
    );
    if (output) {
      return true;
    } else {
      console.log(`Container '${MYSQL_CONTAINER_NAME}' is not running.`);
      return false;
    }
  } catch (error) {
    console.error(`Error checking container: ${error}`);
    return false;
  }
};

const createMysqlDatabase = async (
  args: CreateDatabase,
  retries = 5,
  delay = 10000,
) => {
  const isRunning = await checkMySQLContainer();
  if (isRunning) {
    for (let i = 0; i < retries; i++) {
      try {
        const { stdout: checkDbResult } = await execPromise(
          Commands.MySQL.checkDb({
            dbName: args.dbName,
            mysqlName: MYSQL_CONTAINER_NAME,
            mysqlPassword: MYSQL_ROOT_PASSWORD,
          }),
        );
        if (checkDbResult.trim() === args.dbName) {
          return {
            success: true,
            message: `Database "${args.dbName}" already exists.`,
          };
        } else {
          await execPromise(
            Commands.MySQL.createDbAndUser({
              ...args,
              mysqlName: MYSQL_CONTAINER_NAME,
              mysqlPassword: MYSQL_ROOT_PASSWORD,
            }),
          );
          return {
            success: true,
            message: `Database "${args.dbName}" and user "${args.dbUser}" created successfully.`,
          };
        }
      } catch (error) {
        console.error(
          `Attempt ${i + 1}: Error executing MySQL command: ${error}`,
        );
        if (i < retries - 1) {
          console.log(`Retrying in ${delay / 1000} seconds...`);
          await new Promise((resolve) => setTimeout(resolve, delay)); // Wait before retrying
        } else {
          console.error(
            `Error during database creation process for "${args.dbName}":`,
            error,
          );
          return {
            success: false,
            message: `Error creating database "${args.dbName}"`,
            error,
          };
        }
      }
    }
  }
};

const MySQL = {
  createMysqlContainer,
  checkForMysqlContainer,
  createMysqlDatabase,
};

export default MySQL;
