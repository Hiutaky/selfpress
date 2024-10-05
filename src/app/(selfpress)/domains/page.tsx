import Heading from "~/components/shared/Heading";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/server";
import AddDomainForm from "./_components/AddDomainForm";
import Card from "~/components/shared/Card";

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
      <div className="grid grid-cols-3 gap-3">
        {domains.length > 0 ? (
          domains.map((domain, d) => (
            <Card hoverable key={d}>
              <span className="text-white text-opacity-85 font-semibold">
                {domain.wordpressInstallation.name}
              </span>
              <span>{domain.domainName}</span>
              {true && (
                <div className="rounded text-[10px] self-start border mt-2 px-2">
                  SSL
                </div>
              )}
            </Card>
          ))
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
