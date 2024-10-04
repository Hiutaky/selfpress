import Box from "~/components/shared/Box";
import ContainerStatus from "~/components/shared/ContainerStatus";
import Heading from "~/components/shared/Heading";
import ListItem from "~/components/shared/ListItem";
import { env } from "~/env";

export default async function Page() {
  return (
    <div className="flex flex-col gap-3">
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
        </Box>
        <Box title="Nginx">
          <ListItem label="Container Name">{env.NGINX_CONTAINER_NAME}</ListItem>
          <ListItem label="Status">
            <ContainerStatus containerName={env.NGINX_CONTAINER_NAME} />
          </ListItem>
        </Box>
      </div>
    </div>
  );
}
