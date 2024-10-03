import Commands from "./commands";
import { execPromise, execPromiseStdout } from "./exec";

const createNetwork = async (networkName: string) => {
  try {
    const result = await execPromiseStdout(
      Commands.Docker.checkNetwork(networkName),
    );
    if (result === networkName) {
      return {
        message: `Network "${networkName}" already exists.`,
        success: true,
      };
    } else {
      const createResult = await execPromise(
        Commands.Docker.createNetwork(networkName),
      );
      return {
        message: `Network "${networkName}" created successfully.`,
        success: true,
        result: createResult,
      };
    }
  } catch (error) {
    throw new Error(`Failed to ensure network "${networkName}": ${error}`);
  }
};

const isPortUsed = async (port: number | string) => {
  const response = await execPromiseStdout(Commands.Docker.checkPort(port));
  return response ?? false;
};

const Docker = {
  isPortUsed,
  createNetwork,
};

export default Docker;
