import Link from "next/link";
import Icon from "~/components/shared/Icon";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { api } from "~/trpc/server";
import AddNewWordpressForm from "./_components/AddNewWordpressForm";
import Heading from "~/components/shared/Heading";
import Card from "~/components/shared/Card";
import BaseLayout from "~/components/sections/BaseLayout";

export default async function Page() {
  const wpInstances = await api.wordpress.readAll.query();


  return (
    <BaseLayout>
      <div className="flex flex-row items-center justify-between">
        <Heading>Applications</Heading>
        <AddNewWordpressForm>
          <Button>
            <Icon>add</Icon>
            Add New
          </Button>
        </AddNewWordpressForm>
      </div>
      {wpInstances.length ? (
        <div className="grid grid-cols-3 gap-3">
          {wpInstances.map((instance, i) => (
            <Card hoverable key={i}>
              <div className="flex flex-row justify-between">
                <Link
                  className="text-white font-semibold"
                  href={`/applications/${instance.id}`}
                >
                  {instance.name}
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Icon>more_vert</Icon>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>
                      <Link href={instance.domain} target="_blank">
                        Visit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href={`/applications/${instance.id}`}>Edit</Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <Link
                href={instance.wordpressSettings?.siteUrl ?? instance.domain}
                target="_blank"
              >
                {instance.wordpressSettings?.siteUrl ?? instance.domain}
              </Link>
              <span>
                {instance.dockerConfig?.containerName}:
                {instance.dockerConfig?.ports}
              </span>
              {new Date(instance.createdAt).toLocaleDateString()}
            </Card>
          ))}
        </div>
      ) : (
        <Alert>
          <AlertTitle>Cannot find any WordPress Installation</AlertTitle>
          <AlertDescription>
            Create your first WordPress installation.
          </AlertDescription>
        </Alert>
      )}
    </BaseLayout>
  );
}
