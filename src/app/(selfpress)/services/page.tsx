import Link from "next/link";
import BaseLayout from "~/components/sections/BaseLayout";
import Box from "~/components/shared/Box";
import ContainerStatus from "~/components/shared/ContainerStatus";
import Heading from "~/components/shared/Heading";
import ListItem from "~/components/shared/ListItem";
import Logger from "~/components/shared/Logger";
import { Button } from "~/components/ui/button";
import { env } from "~/env";

export default async function Page() {
  return (
    <BaseLayout>
      <Heading>Services</Heading>
      <div className="grid grid-cols-2 gap-4">
        <Box title="MySQL">
          <div className="grid grid-cols-2 gap-3">
            <ListItem label="Container Name">
              {env.MYSQL_CONTAINER_NAME}
            </ListItem>
            <ListItem label="Port">{env.MYSQL_PUBLIC_PORT}</ListItem>
            <ListItem label="Root User">root</ListItem>
            <ListItem label="password" type="password">
              {env.MYSQL_ROOT_PASSWORD}
            </ListItem>
          </div>
          <ListItem label="Status">
            <ContainerStatus containerName={env.MYSQL_CONTAINER_NAME} />
          </ListItem>
          <div className="flex flex-row gap-3">
            <Logger containerName={env.MYSQL_CONTAINER_NAME} />
          </div>
        </Box>
        <Box title="Nginx">
          <div className="grid grid-cols-2">
            <ListItem label="Container Name">
              {env.NGINX_CONTAINER_NAME}
            </ListItem>
            <ListItem label="Ports">80, 443</ListItem>
          </div>
          <ListItem label="Status">
            <ContainerStatus containerName={env.NGINX_CONTAINER_NAME} />
          </ListItem>
          <div className="flex flex-row gap-3">
            <Logger containerName={env.NGINX_CONTAINER_NAME} />
          </div>
        </Box>
        <Box title="PhpMyAdmin">
          <ListItem label="Container Name">
            {env.PHPMYADMIN_CONTAINER_NAME}
          </ListItem>
          <ListItem label="Status">
            <ContainerStatus containerName={env.PHPMYADMIN_CONTAINER_NAME} />
          </ListItem>
          <ListItem label="Authentication">
            User {env.MYSQL_CONTAINER_NAME} access details to login into
            PhpMyAdmin.
          </ListItem>
          <div className="flex flex-row gap-3">
            <Logger containerName={env.PHPMYADMIN_CONTAINER_NAME}>
              <Button>Logger</Button>
            </Logger>
            <Link href={"http://localhost:8079"} target="_blank">
              <Button>Visit</Button>
            </Link>
          </div>
        </Box>
        <Box title="Redis">
          <div className="grid grid-cols-2">
            <ListItem label="Container Name">
              {env.REDIS_CONTAINER_NAME}
            </ListItem>
            <ListItem label="Port">
              tcp://{env.REDIS_CONTAINER_NAME}:6379
            </ListItem>
          </div>
          <ListItem label="Status">
            <ContainerStatus containerName={env.REDIS_CONTAINER_NAME} />
          </ListItem>
          <div className="flex flex-row gap-3">
            <Logger containerName={env.REDIS_CONTAINER_NAME}>
              <Button>Logger</Button>
            </Logger>
          </div>
        </Box>
        <Box title="SFTP Server">
          <div className="grid grid-cols-2">
            <ListItem label="Container Name">
              {env.SFTP_CONTAINER_NAME}
            </ListItem>
            <ListItem label="Port">
              sftp://{env.SFTP_CONTAINER_NAME}:2222
            </ListItem>
          </div>
          <ListItem label="Status">
            <ContainerStatus containerName={env.SFTP_CONTAINER_NAME} />
          </ListItem>
          <div className="flex flex-row gap-3">
            <Logger containerName={env.SFTP_CONTAINER_NAME}>
              <Button>Logger</Button>
            </Logger>
          </div>
        </Box>
      </div>
    </BaseLayout>
  );
}
