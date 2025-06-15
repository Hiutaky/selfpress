import SignInForm from "./_components/SignInForm";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import BaseLayout, { BaseLayoutContainer } from "~/components/sections/BaseLayout";
import { db } from "~/utils/db";

export default async function Page() {
  const session = await getServerSession();

  if (!(await db.user.count())) redirect("/signup");

  if (session?.user) redirect("/");
  return (
    <BaseLayout>
      <BaseLayoutContainer>
        <div className="max-w-[420px] self-center w-full py-7">
          <h2 className="text-lg text-white">Signin</h2>
          <SignInForm />
        </div>
      </BaseLayoutContainer>
    </BaseLayout>
  );
}
