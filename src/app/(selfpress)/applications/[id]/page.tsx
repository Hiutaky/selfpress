import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import Card from "~/components/shared/Card";
import ContainerStatus from "~/components/shared/ContainerStatus";
import Heading from "~/components/shared/Heading";
import Icon from "~/components/shared/Icon";
import ListItem from "~/components/shared/ListItem";
import Logger from "~/components/shared/Logger";
import WebsitePreview from "~/components/shared/WebsitePreview";
import WPCli from "~/components/shared/WPCli";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/server";
import Commands from "~/utils/commands";
import { execPromise } from "~/utils/exec";

type Props = {
  params: {
    id: number;
  };
};

export default async function Page(req: Props) {
  if( Number.isNaN(req.params.id) ) return;
  const wordPress = await api.wordpress.read.query({
    id: req.params.id,
  });

  if (!wordPress || !wordPress.dockerConfig) redirect("/applications");
  const { dockerConfig, wordpressSettings } = wordPress;

  const status = await api.docker.getStatus.query({
    name: dockerConfig?.containerName,
  });



  const useExecStdout = async (command: string) => {
    "use server";
    return await execPromise(
      Commands.WordPress.execWpCliCommand(dockerConfig.containerName, command),
    );
  };

  const authLink = () => {
    return `${wordpressSettings?.siteUrl}/wp-admin?accessToken=${btoa(`${wordpressSettings?.adminName}:${wordpressSettings?.adminPassword}`)}`;
  };

  return (
    <>
      <div className="flex flex-row justify-between items-center gap-3">
        <Heading>{wordPress.name}</Heading>
        <div className="flex flex-row gap-3">
          <Button variant={"destructive"}>
              <Icon>delete</Icon>
              Delete
          </Button>
          <Link href={authLink()} target="_blank">
              <Button>
              <Icon>admin_panel_settings</Icon>
              Admin
              </Button>
          </Link>
          <Logger containerName={wordPress.dockerConfig.containerName}>
              <Button>
              <Icon>bug_report</Icon>
              Logger
              </Button>
          </Logger>
          <Link href={wordPress.domain} target="_blank">
              <Button>
              <Icon>open_in_new</Icon>
              Visit
              </Button>
          </Link>
        </div>
      </div>
      <Card>
        <div className="grid sm:grid-cols-2 xl:grid-cols-[1fr_2fr] gap-7">
          <WebsitePreview
            imagePath={wordPress.imagePath ?? false}
            siteId={wordPress.id}
            siteUrl={wordPress.domain}
          />
          <div className="flex flex-col gap-3">
            <ListItem label="Deployment">
              {dockerConfig?.containerName}
            </ListItem>
            <ListItem label="Domains">
              <Link
                href={wordpressSettings?.siteUrl ?? wordPress.domain}
                target="_blank"
                className="flex flex-row gap-2 items-center"
              >
                {wordpressSettings?.siteUrl ?? wordPress.domain},{" "}
                {wordPress.domain}
                <Icon size={18}>open_in_new</Icon>
              </Link>
            </ListItem>
            <div className="flex flex-row gap-3">
              <ListItem label="Status">
                <ContainerStatus
                  containerName={dockerConfig.containerName}
                  defaultStatus={status}
                />
              </ListItem>
            </div>
            <ListItem label="Image">{dockerConfig.image}</ListItem>
          </div>
        </div>
      </Card>
      <WPCli name={dockerConfig.containerName} execStdout={useExecStdout} />
      
    </>
  );
}
