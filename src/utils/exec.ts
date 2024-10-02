import { exec } from "child_process";
import { promisify } from "util";

export const execPromise = promisify(exec);

export const execPromiseStdout = (command: string) => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject({ error, stderr });
      } else {
        resolve(stdout.trim());
      }
    });
  });
};

export async function runCommandWithLogging(command: string) {
  console.log(`Running command: ${command}`);
  try {
    const { stdout } = await execPromise(command);
    console.log(`Command Success: ${stdout}`);
    return true;
  } catch (error: unknown) {
    console.error(`Error running command: ${error}`);
    throw error;
  }
}
