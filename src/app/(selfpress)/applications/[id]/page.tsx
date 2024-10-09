import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import BaseLayout from "~/components/sections/BaseLayout";
import Box from "~/components/shared/Box";
import Card from "~/components/shared/Card";
import ContainerStatus from "~/components/shared/ContainerStatus";
import Heading from "~/components/shared/Heading";
import Icon from "~/components/shared/Icon";
import ListItem from "~/components/shared/ListItem";
import Logger from "~/components/shared/Logger";
import WebsitePreview from "~/components/shared/WebsitePreview";
import WPCli from "~/components/shared/WPCli";
import { Button } from "~/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { env } from "~/env";
import { api } from "~/trpc/server";
import Commands from "~/utils/commands";
import { execPromise } from "~/utils/exec";

type Props = {
  params: {
    id: number;
  };
};

export default async function Page(req: Props) {
  console.log( 'params', Number(req.params.id) )
  if( Number.isNaN(req.params.id) ) return;
  const wordPress = await api.wordpress.read.query({
    id: req.params.id,
  });

  if (!wordPress || !wordPress.dockerConfig) redirect("/applications");
  const { dockerConfig, wordpressSettings } = wordPress;

  const status = await api.docker.getStatus.query({
    name: dockerConfig?.containerName,
  });

  const authLink = () => {
    return `${wordpressSettings?.siteUrl}/wp-admin?accessToken=${btoa(`${wordpressSettings?.adminName}:${wordpressSettings?.adminPassword}`)}`;
  };

  const { volumes } = wordPress.dockerConfig;

  const useExecStdout = async (command: string) => {
    "use server";
    return await execPromise(
      Commands.WordPress.execWpCliCommand(dockerConfig.containerName, command),
    );
  };

  return (
    <BaseLayout>
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
      <div className="grid grid-cols-2 gap-5">
        <Box title="Main Details">
          {/** MAIN DETAILS */}
          <ListItem label="Public Domain">
            <Link
              href={wordpressSettings?.siteUrl ?? wordPress.domain}
              target="_blank"
              className="flex flex-row gap-2 items-center"
            >
              {wordpressSettings?.siteUrl ?? wordPress.domain}
              <Icon size={18}>open_in_new</Icon>
            </Link>
          </ListItem>
          <ListItem label="Local Domain">{wordPress?.domain}</ListItem>
          <ListItem label="Path">
            <Tooltip>
              <TooltipTrigger>
                {volumes?.split("/").length > 4
                  ? volumes
                      .split("/")
                      .map((path, i) => (i > 1 && i < 5 ? "..." : path))
                      .join("/")
                  : volumes}
                /{wordPress.dockerConfig?.containerName}
              </TooltipTrigger>
              <TooltipContent>{volumes}</TooltipContent>
            </Tooltip>
          </ListItem>
          <ListItem label="Created">
            {new Date(wordPress.createdAt).toLocaleString()}
          </ListItem>
          <ListItem label="Last Update">
            {new Date(wordPress.updatedAt).toLocaleString()}
          </ListItem>
        </Box>
        <Box title="Access details">
          <ListItem label="Email">{wordpressSettings?.adminEmail}</ListItem>
          <ListItem label="Username">{wordpressSettings?.adminName}</ListItem>
          <ListItem
            label="Password"
            type="password"
            copy={wordpressSettings?.adminPassword}
          >
            {wordpressSettings?.adminPassword}
          </ListItem>
          <ListItem label="Site Name">{wordpressSettings?.siteName}</ListItem>
          <ListItem label="Description">
            {wordpressSettings?.siteDescription}
          </ListItem>
        </Box>
        <Box title="Docker Details">
          <ListItem label="Container Name">
            {dockerConfig?.containerName}
          </ListItem>
          <ListItem label="Network">{dockerConfig?.networkName}</ListItem>
          <ListItem label="Image">
            <Link
              className="flex flex-row gap-2 items-center"
              href={`https://hub.docker.com/_/${dockerConfig && dockerConfig?.image.search(":") > -1 ? dockerConfig?.image.split(":").at(0) : dockerConfig?.image}`}
              target="_blank"
            >
              {dockerConfig?.image}
              <Icon size={18}>open_in_new</Icon>
            </Link>
          </ListItem>
          <ListItem label="Host Port">{dockerConfig?.ports}</ListItem>
          <ListItem label="Restart Policy">
            {dockerConfig?.restartPolicy}
          </ListItem>
        </Box>
        <Box title="WordPress Details">
          <ListItem label="DB Host">{wordpressSettings?.dbHost}</ListItem>
          <ListItem label="DB Name">{wordpressSettings?.dbName}</ListItem>
          <ListItem label="DB User">{wordpressSettings?.dbUser}</ListItem>
          <ListItem
            label="DB Password"
            type="password"
            copy={wordpressSettings?.dbPassword}
          >
            {wordpressSettings?.dbPassword}
          </ListItem>
          <ListItem label="Last Update">
            {new Date(wordpressSettings?.updatedAt ?? 0).toLocaleString()}
          </ListItem>
        </Box>
        <Box title="SFTP">
          <ListItem label="Host">sftp://{env.PUBLIC_URL}:2222</ListItem>
          <ListItem label="User">{dockerConfig.containerName}</ListItem>
          <ListItem label="Password" type="password">{wordPress.wordpressSettings?.dbPassword}</ListItem>
        </Box>
      </div>
    </BaseLayout>
  );
}
