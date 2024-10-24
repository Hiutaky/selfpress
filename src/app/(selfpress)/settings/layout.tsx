import BaseLayout, {
  BaseLayoutContainer,
} from "~/components/sections/BaseLayout";
import Heading from "~/components/shared/Heading";
import EditCloudflare from "./_components/EditCloudflare";
import cloudflare from "~/utils/cloudflare";
import { db } from "~/utils/db";
import { env } from "~/env";
import React, { ReactNode } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

type Props = {
  children: ReactNode;
};

const Page: React.FC<Props> = async ({ children }) => {
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

  const triggers = [
    {
      name: "general",
      label: "General",
    },
    {
      name: "cloudflare",
      label: "Cloudflare",
    },
  ];

  return (
    <BaseLayout>
      <BaseLayoutContainer>
        <Heading>Settings</Heading>
        <Tabs
          className="grid grid-cols-[1fr_4fr] gap-6 mt-6"
          defaultValue="general"
        >
          <TabsList className="bg-transparent flex flex-col gap-4 items-start justify-start">
            {triggers.map((trigger, t) => (
              <TabsTrigger
                key={t}
                className="p-0 !bg-transparent !text-white data-[state=active]:!bg-neutral-50 data-[state=active]:!bg-opacity-20 text-xs !bg-opacity-15 hover:!bg-neutral-50 hover:!bg-opacity-10   w-full justify-start px-3 py-1"
                value={trigger.name}
              >
                {trigger.label}
              </TabsTrigger>
            ))}
          </TabsList>
          <div>
            <TabsContent value="general" className="flex flex-col gap-6 mt-[0]">
              General
            </TabsContent>
            <TabsContent value="cloudflare" className="mt-[0]">
              <Heading>Cloudflare</Heading>
              {env.NODE_ENV === "development" ? (
                <div className="">
                  Unable to setup cloudflare on Development environment.
                </div>
              ) : settings ? (
                <div className="flex flex-col gap-3">
                  <span>Cloudflare already configurated.</span>
                  <span>
                    Panel Domain: <b>{settings.panelUrl}</b>
                  </span>
                  <span>
                    Zone Domain: <b>{settings.baseUrl}</b>
                  </span>
                  <span>
                    Zone: <b>{settings.cloudflareZoneId}</b>
                  </span>
                </div>
              ) : (
                <EditCloudflare getRecords={getRecords} zones={zones} />
              )}
            </TabsContent>
          </div>
        </Tabs>
        {children}
      </BaseLayoutContainer>
    </BaseLayout>
  );
};

export default Page;
