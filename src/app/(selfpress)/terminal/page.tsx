import { execPromise } from "~/utils/exec";
import Terminal from "./_components/Terminal";
import BaseLayout, {
  BaseLayoutContainer,
} from "~/components/sections/BaseLayout";
import Heading from "~/components/shared/Heading";

export default async function Page() {
  const execStdout = async (command: string) => {
    "use server";
    return await execPromise(command);
  };

  return (
    <BaseLayout>
      <BaseLayoutContainer>
        <Heading>Terminal</Heading>
        <Terminal execStdout={execStdout} />
      </BaseLayoutContainer>
    </BaseLayout>
  );
}
