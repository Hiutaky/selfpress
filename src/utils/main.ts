import { env } from "~/env";
import Commands from "./commands";
import { execPromiseStdout } from "./exec";
import MySQL from "./mysql";
import Nginx from "./nginx";
import { readFile } from "fs/promises";
import path from "path";
import { cwd } from "process";
import { writeFile } from "fs/promises";

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
        Commands.SFTP.create(
          env.SFTP_CONTAINER_NAME,
          env.DOCKER_NETWORK_NAME
        ),
      ),
  };

  const keys = Object.keys(toCheck);

  //install services
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

  /*//setup nginx main domain if needed
  if (!env.PUBLIC_URL.includes("localhosdt")) {
    const cleanURL = env.PUBLIC_URL.replaceAll("https://", "").replaceAll(
      "http://",
      "",
    );

    //writing nginx conf file
    let file = await readFile(
      path.join(cwd(), "defaults/nginx/nginx-ssl.conf"),
      "utf-8",
    );
    file = file
      .replaceAll("{DOMAIN}", cleanURL)
      .replaceAll("key-{CONTAINER}", "key-main")
      .replaceAll("cert-{CONTAINER}", "cert-main")
      .replaceAll("{CONTAINER}:80", "172.17.0.1:3000")
      .replaceAll("{CONTAINER}", "172.17.0.1:3000");

    await writeFile(
      path.join(cwd(), `/applications/confs/nginx/conf.d/main.conf`),
      file,
    );
    await execPromiseStdout(Commands.Docker.restart(env.NGINX_CONTAINER_NAME));
  }*/
};
