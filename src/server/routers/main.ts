import { setupCloudflareSchema } from "~/schemas/main.schema";
import { protectedProcedure, router } from "../trpc";
import { readFile } from "fs/promises";
import { cwd } from "process";
import path from "path";
import { writeFile } from "fs/promises";
import { execPromiseStdout } from "~/utils/exec";
import Commands from "~/utils/commands";
import { env } from "~/env";
import cloudflare from "~/utils/cloudflare";

export const mainRouter = router({
    setupCloudflare: protectedProcedure
        .input(setupCloudflareSchema)
        .mutation( async ({ ctx, input }) => {

            //setup nginx
            const cleanURL = input.panelUrl.replaceAll("https://", "").replaceAll(
                "http://",
                "",
            );

              //writing nginx conf file
            let file = await readFile(
                path.join(cwd(), "defaults/nginx/nginx-ssl.conf"),
                "utf-8",
            );
            file = file
                .replaceAll("{DOMAIN}", cleanURL)
                .replaceAll("key-{CONTAINER}", "key-main")
                .replaceAll("cert-{CONTAINER}", "cert-main")
                .replaceAll("{CONTAINER}:80", "172.17.0.1:3000")
                .replaceAll("{CONTAINER}", "172.17.0.1:3000");

            //writing certificates
            await writeFile(
                path.join(
                cwd(),
                `/applications/confs/nginx/conf.d/certs/cert-main.pem`,
                ),
                input.caCertificate,
            );
            await writeFile(
                path.join(
                cwd(),
                `/applications/confs/nginx/conf.d/certs/key-main.pem`,
                ),
                input.caKey,
            );

            //writing nginx conf
            await writeFile(
                path.join(cwd(), `/applications/confs/nginx/conf.d/main.conf`),
                file,
            );
            await execPromiseStdout(Commands.Docker.restart(env.NGINX_CONTAINER_NAME));
            
            return await ctx.db.globalSettings.create({
                data: {
                    baseUrl: input.baseUrl,
                    cloudflareZoneId: input.zoneId,
                    panelUrl: input.panelUrl
                }
            });
        })
})