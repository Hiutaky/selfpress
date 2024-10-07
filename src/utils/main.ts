import { env } from "~/env";
import Commands from "./commands";
import { execPromiseStdout } from "./exec";
import MySQL from "./mysql";
import Nginx from "./nginx";

export const maybeInitializeSelfpress = async () => {
  const toCheck = {
    [env.MYSQL_CONTAINER_NAME]: async () => await MySQL.createMysqlContainer(),
    [env.NGINX_CONTAINER_NAME]: async () => await Nginx.initialize(),
    [env.PHPMYADMIN_CONTAINER_NAME]: async () => await execPromiseStdout(
      Commands.PhpMyAdmin.create(
        env.PHPMYADMIN_CONTAINER_NAME,
        env.MYSQL_CONTAINER_NAME,
        env.DOCKER_NETWORK_NAME,
      ),
    ),
    [env.REDIS_CONTAINER_NAME]: async () => await execPromiseStdout(
      Commands.Redis.create(env.REDIS_CONTAINER_NAME, env.DOCKER_NETWORK_NAME),
    ),
    [env.SFTP_CONTAINER_NAME]: async () => async () => await execPromiseStdout(
      Commands.SFTP.create(env.SFTP_CONTAINER_NAME),
    ),
  }

  Object.keys(toCheck).map( async (key) => {
    console.log(`Checking Container:`, key);
    const exist = await execPromiseStdout(
      Commands.Docker.checkName(key),
    );
    if( ! exist ) {
      console.log("Initializing:", key)
      await toCheck[key]();
    }
  })
};
