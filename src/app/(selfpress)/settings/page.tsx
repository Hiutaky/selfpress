import BaseLayout from "~/components/sections/BaseLayout";
import Heading from "~/components/shared/Heading";
import EditCloudflare from "./_components/EditCloudflare";
import cloudflare, { getIp } from "~/utils/cloudflare";

export default async function Page() {
  const response = await cloudflare.zones.list()
  const zones = response.result;
  
  const getRecords = async (id: string) => {
    "use server";
    const records = await cloudflare.dns.records.list({
      zone_id: id
    });
    return records.result
  }

  return (
    <BaseLayout>
      <Heading>Settings</Heading>
      <EditCloudflare getRecords={getRecords} zones={zones} />
    </BaseLayout>
  );
}
