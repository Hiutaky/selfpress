import Cloudflare from "cloudflare";
import { env } from "~/env";

const cloudflare = new Cloudflare({
    apiEmail: env.CLOUDFLARE_EMAIL,
    apiKey: env.CLOUDFLARE_API_KEY,
    
});

export const getIp = async () => {
    const resp = await (await fetch('https://api.ipify.org?format=json')).json()
    return resp.ip;
}

export default cloudflare;