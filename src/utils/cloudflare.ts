import Cloudflare from "cloudflare";
import { env } from "~/env";

const cloudflare = new Cloudflare({
    apiEmail: env.CLOUDFLARE_EMAIL,
    apiKey: env.CLOUDFLARE_API_KEY,
    
});

export const getIp = async () => {
    const resp = await (await fetch('https://cloudflare.com/cdn-cgi/trace')).text()
    const splitted = resp.split('\n');
    let ip = ''
    splitted.map( record => record.search('ip') > -1 ?  ip = record as string : null)
    ip = ip.split('=').at(1);
    return ip;
}

export default cloudflare;