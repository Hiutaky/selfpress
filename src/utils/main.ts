import { env } from "~/env";
import Commands from "./commands";
import { execPromiseStdout } from "./exec";
import MySQL from "./mysql";
import Nginx from "./nginx";

export const maybeInitializeSelfpress = async () => {
  //initialize mysql common contaienr
  const mysql = await execPromiseStdout(
    Commands.Docker.checkName(env.MYSQL_CONTAINER_NAME),
  );
  if (!mysql) MySQL.createMysqlContainer();

  //initialize nginx common container
  const nginx = await execPromiseStdout(
    Commands.Docker.checkName(env.NGINX_CONTAINER_NAME),
  );
  if (!nginx) await Nginx.initialize();

  //initialize phpMyAdmin and connect with mysqlContainer
  const phpMyAdmin = await execPromiseStdout(
    Commands.Docker.checkName(env.PHPMYADMIN_CONTAINER_NAME),
  );
  if (!phpMyAdmin)
    await execPromiseStdout(
      Commands.PhpMyAdmin.create(
        env.PHPMYADMIN_CONTAINER_NAME,
        env.MYSQL_CONTAINER_NAME,
        env.DOCKER_NETWORK_NAME,
      ),
    );

  //initialize Redis server
  const redis = await execPromiseStdout(
    Commands.Docker.checkName(env.REDIS_CONTAINER_NAME),
  );
  if (!redis)
    await execPromiseStdout(
      Commands.Redis.create(env.REDIS_CONTAINER_NAME, env.DOCKER_NETWORK_NAME),
    );
};
