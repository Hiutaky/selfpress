import { getServerSession } from "next-auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { getIp } from "~/utils/cloudflare";
import { db } from "~/utils/db";

type Props = {
  children: ReactNode;
};
async function Page({ children }: Props) {
  const session = await getServerSession();
  if (!session?.user) redirect("/signin");

  return <>{children}</>;
}
export default Page