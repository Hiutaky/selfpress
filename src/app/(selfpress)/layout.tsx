import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};
async function Page({ children }: Props) {
  const session = await getServerSession();
  if (!session?.user) redirect("/signin");

  return <>{children}</>;
}
export default Page;
