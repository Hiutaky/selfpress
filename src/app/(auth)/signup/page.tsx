import SignUpForm from "./_components/SignUpForm";
import { getServerAuthSession } from "../../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await getServerAuthSession();

  if (session?.user) redirect("/");

  return (
    <div className="flex flex-col items-center">
      <SignUpForm />
    </div>
  );
}
