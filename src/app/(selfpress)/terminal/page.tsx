import { execPromise } from "~/utils/exec";
import Terminal from "./_components/Terminal";
import BaseLayout from "~/components/sections/BaseLayout";

export default async function Page() {
  const execStdout = async (command: string) => {
    "use server";
    return await execPromise(command);
  };

  return (
    <BaseLayout>
      <Terminal execStdout={execStdout} />
    </BaseLayout>
  );
}
