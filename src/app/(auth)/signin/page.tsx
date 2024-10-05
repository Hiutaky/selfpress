import SignInForm from "./_components/SignInForm";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { db } from "~/utils/db";

export default async function Page() {
  const session = await getServerSession();

  if (!(await db.user.count())) redirect("/signup");

  if (session?.user) redirect("/");
  return (
    <div className="flex flex-col items-center">
      <SignInForm />
    </div>
  );
}
