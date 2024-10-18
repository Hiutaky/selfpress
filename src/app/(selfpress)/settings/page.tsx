import BaseLayout from "~/components/sections/BaseLayout";
import Heading from "~/components/shared/Heading";
import EditCloudflare from "./_components/EditCloudflare";
import cloudflare from "~/utils/cloudflare";
import { db } from "~/utils/db";

export default async function Page() {
  const response = await cloudflare.zones.list();
  const zones = response.result;

  const settings = await db.globalSettings.findFirst();

  const getRecords = async (id: string) => {
    "use server";
    const records = await cloudflare.dns.records.list({
      zone_id: id,
    });
    return records.result;
  };

  return (
    <BaseLayout>
      <Heading>Settings</Heading>
      {settings ? (
        <div className="flex flex-col gap-3">
          <span>Cloudflare already configurated.</span>
          <span>
            Domain: <b>{settings.baseUrl}</b>
          </span>
          <span>
            Zone: <b>{settings.cloudflareZoneId}</b>
          </span>
        </div>
      ) : (
        <EditCloudflare getRecords={getRecords} zones={zones} />
      )}
    </BaseLayout>
  );
}
