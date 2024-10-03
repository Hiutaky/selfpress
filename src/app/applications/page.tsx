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
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { api } from "~/trpc/server";
import AddNewWordpressForm from "./_components/AddNewWordpressForm";

export default async function Page() {
  const wpInstances = await api.wordpress.readAll.query();

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-row items-center justify-between">
        <h2 className="text-xl font-semibold">WordPress Applications</h2>
        <AddNewWordpressForm>
          <Button>
            <Icon>add</Icon>
            Add New
          </Button>
        </AddNewWordpressForm>
      </div>
      <span>Manage all your WordPress Containers from here.</span>
      {wpInstances.length ? (
        <div className="p-2 bg-stone-800 rounded">
          <Table>
            <TableHeader>
              <TableRow className="font-semibold">
                <TableCell>Name</TableCell>
                <TableCell>URL</TableCell>
                <TableCell>Creation</TableCell>
                <TableCell>Docker Path</TableCell>
                <TableCell>Port</TableCell>
                <TableCell>Network Name</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {wpInstances.map((instance, i) => (
                <TableRow key={i} className="py-4">
                  <TableCell>
                    <Link href={`/applications/${instance.id}`}>
                      {instance.name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link
                      href={
                        instance.wordpressSettings?.siteUrl ?? instance.domain
                      }
                      target="_blank"
                    >
                      {instance.wordpressSettings?.siteUrl ?? instance.domain}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {new Date(instance.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{instance.path}</TableCell>
                  <TableCell>{instance.dockerConfig?.ports}</TableCell>
                  <TableCell>{instance.dockerConfig?.networkName}</TableCell>
                  <TableCell>
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
                          <Link href={`/applications/${instance.id}`}>
                            Edit
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <Alert>
          <AlertTitle>Cannot find any WordPress Installation</AlertTitle>
          <AlertDescription>
            Create your first WordPress installation.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
