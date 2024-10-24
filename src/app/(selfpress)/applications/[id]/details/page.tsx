import Link from "next/link"
import { redirect } from "next/navigation"
import Box from "~/components/shared/Box"
import Heading from "~/components/shared/Heading"
import Icon from "~/components/shared/Icon"
import ListItem from "~/components/shared/ListItem"
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/ui/tooltip"
import { env } from "~/env"
import { api } from "~/trpc/server"

type Props = {
    params: {
        id: string
    }
}
export default async function Page({params} : Props) {

    const wordPress = await api.wordpress.read.query({
        id: params.id,
    });
    if (!wordPress || !wordPress.dockerConfig) redirect("/applications");
    const { dockerConfig, wordpressSettings } = wordPress;
    const { volumes } = wordPress.dockerConfig;

    return (
        <div className="flex flex-col gap-3">
            <Heading>Details</Heading>
            <div className="grid grid-cols-2 gap-5">
                <Box title="Main Details">
                {/** MAIN DETAILS */}
                <ListItem label="Public Domain">
                    <Link
                    href={`https://${wordpressSettings?.siteUrl ?? wordPress.domain}`}
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
        </div>
    )
}