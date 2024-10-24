import { execPromiseStdout } from "./exec";

//docker compose yaml configuration to setup main services
export const maybeInitializeSelfpress = async () => {
  await execPromiseStdout("docker compose up -d");
};
