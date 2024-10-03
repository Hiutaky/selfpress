import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import Box from "~/components/shared/Box";
import Icon from "~/components/shared/Icon";
import ListItem from "~/components/shared/ListItem";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/server";

type Props = {
  params: {
    name: string;
  };
};

export default async function Page(req: Props) {
  const wordPress = await api.wordpress.read.query({
    name: req.params.name,
  });

  if (!wordPress) redirect("/applications");

  const { dockerConfig, wordpressSettings } = wordPress;

  const authLink = () => {
    return `${wordPress.domain}/wp-admin?accessToken=${btoa(`${wordpressSettings?.adminName}:${wordpressSettings?.adminPassword}`)}`;
  };

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-xl font-semibold">Wordpress: {wordPress.name}</h2>
      <div className="grid grid-cols-2 gap-3">
        <Box title="Main Details">
          {/** MAIN DETAILS */}
          <ListItem label="Domain">
            <Link
              href={wordPress.domain}
              target="_blank"
              className="flex flex-row gap-2 items-center"
            >
              {wordPress?.domain}
              <Icon size={18}>open_in_new</Icon>
            </Link>
          </ListItem>
          <ListItem label="Path">{wordPress.path}</ListItem>
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
          <ListItem label="Password" type="password">
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
          <ListItem label="Volume">
            {dockerConfig?.volumes}
            {dockerConfig?.containerName}
          </ListItem>
          <ListItem label="Restart Policy">
            {dockerConfig?.restartPolicy}
          </ListItem>
        </Box>
        <Box title="WordPress Details">
          <ListItem label="DB Host">{wordpressSettings?.dbHost}</ListItem>
          <ListItem label="DB Name">{wordpressSettings?.dbName}</ListItem>
          <ListItem label="DB User">{wordpressSettings?.dbUser}</ListItem>
          <ListItem label="DB Password" type="password">
            {wordpressSettings?.dbPassword}
          </ListItem>
          <ListItem label="Table Prefix">
            {wordpressSettings?.tablePrefix}
          </ListItem>
          <ListItem label="Last Update">
            {new Date(wordpressSettings?.updatedAt ?? 0).toLocaleString()}
          </ListItem>
        </Box>
      </div>
      <div className="flex flex-row gap-2">
        <Link href={wordPress.domain} target="_blank">
          <Button>
            <Icon>open_in_new</Icon>
            Visit
          </Button>
        </Link>
        <Link href={authLink()} target="_blank">
          <Button variant={"secondary"}>
            <Icon>admin_panel_settings</Icon>
            Admin
          </Button>
        </Link>
        <Button variant={"destructive"}>
          <Icon>delete</Icon>
          Delete
        </Button>
      </div>
    </div>
  );
}
