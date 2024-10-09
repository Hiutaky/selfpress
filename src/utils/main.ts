import { env } from "~/env";
import Commands from "./commands";
import { execPromiseStdout } from "./exec";
import MySQL from "./mysql";
import Nginx from "./nginx";

export const maybeInitializeSelfpress = async () => {
  const toCheck = {
    [env.MYSQL_CONTAINER_NAME]: async () => await MySQL.createMysqlContainer(),
    [env.NGINX_CONTAINER_NAME]: async () => await Nginx.initialize(),
    [env.PHPMYADMIN_CONTAINER_NAME]: async () =>
      await execPromiseStdout(
        Commands.PhpMyAdmin.create(
          env.PHPMYADMIN_CONTAINER_NAME,
          env.MYSQL_CONTAINER_NAME,
          env.DOCKER_NETWORK_NAME,
        ),
      ),
    [env.REDIS_CONTAINER_NAME]: async () =>
      await execPromiseStdout(
        Commands.Redis.create(
          env.REDIS_CONTAINER_NAME,
          env.DOCKER_NETWORK_NAME,
        ),
      ),
    [env.SFTP_CONTAINER_NAME]: async () =>
      await execPromiseStdout(
        Commands.SFTP.create(env.SFTP_CONTAINER_NAME, env.DOCKER_NETWORK_NAME),
      ),
  };

  const keys = Object.keys(toCheck);

  for (let i = 0; i < keys.length; i++) {
    try {
      const key = keys.at(i) as string;
      const exist = await execPromiseStdout(Commands.Docker.checkName(key));
      console.log(`Checking Container:`, key, exist);
      if (!exist) {
        console.log("Initializing:", key);
        const response = await toCheck[key]();
        console.log("Response", key, response);
      }
    } catch (e) {
      console.log(e);
    }
  }
};
