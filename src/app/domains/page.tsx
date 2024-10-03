import Heading from "~/components/shared/Heading";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/server";
import AddDomainForm from "./_components/AddDomainForm";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import Link from "next/link";

export default async function Page() {
  const domains = await api.domain.readAll.query();

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-row justify-between items-center">
        <Heading>Domains</Heading>
        <AddDomainForm>
          <Button>Add Domain</Button>
        </AddDomainForm>
      </div>
      <div className="flex flex-col gap-3">
        {domains.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell>Domain</TableCell>
                <TableCell>SSL</TableCell>
                <TableCell>WordPress Instance</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {domains.map((domain, d) => (
                <TableRow key={d}>
                  <TableCell>{domain.domainName}</TableCell>
                  <TableCell>{domain.isSsl ? "Yes" : "No"}</TableCell>
                  <TableCell>
                    <Link
                      href={`/applications/${domain.wordpressInstallationId}`}
                    >
                      {domain.wordpressInstallation.name}
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Alert>
            <AlertTitle>Cannot find any domain</AlertTitle>
            <AlertDescription>
              Add first a domain to be attached to your Wordpress Installations.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}
