import { env } from "~/env";
import Commands from "./commands";
import { execPromiseStdout } from "./exec";

const initialize = async () => {
  return await execPromiseStdout(
    Commands.Nginx.create(env.NGINX_CONTAINER_NAME, env.DOCKER_NETWORK_NAME),
  );
};

const Nginx = {
  initialize,
};

export default Nginx;
