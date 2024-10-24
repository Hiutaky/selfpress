"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Record } from "cloudflare/resources/dns/records.mjs";
import { ZonesV4PagePaginationArray } from "cloudflare/resources/zones/zones.mjs";
import Link from "next/link";
import React, { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Box from "~/components/shared/Box";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";
import { toast } from "~/hooks/use-toast";
import { api } from "~/trpc/react";

type Props = {
  getRecords: (id: string) => Promise<Record[]>;
  zones: ZonesV4PagePaginationArray["result"];
};

const formSchema = z.object({
  zone: z.string(),
  domain: z.string(),
  caCertificate: z.string().startsWith("-----BEGIN CERTIFICATE-----"),
  caKey: z.string().startsWith("-----BEGIN PRIVATE KEY-----"),
});

const EditCloudflare: React.FC<Props> = ({ getRecords, zones }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      zone: "",
      domain: "*",
      caCertificate: "",
      caKey: "",
    },
    resolver: zodResolver(formSchema),
  });

  const setupCloudflare = api.main.setupCloudflare.useMutation({
    onSuccess: () => {
      setLoading(false);
      toast({
        title: "Success",
        description: "Zone connected successfully",
      });
    },
    onError: (error) => {
      setLoading(false);
      toast({
        title: "Error",
        description: String(error),
        variant: "destructive",
      });
    },
  });

  const selectedZone = form.watch("zone");

  const zone = useMemo(() => {
    return zones.find((z) => z.id === selectedZone);
  }, [selectedZone, zones]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const records = await getRecords(values.zone);
    if (!zone) return;
    setLoading(true);

    let panelUrl = "";
    let error = false;

    //chech if record already exist in cloudflare
    if (values.domain !== "*") {
      panelUrl = `${values.domain}.${zone.name}`;
      if (records.find((record) => record.name === panelUrl)) {
        form.setError("domain", {
          message: "Domain or Subdomain already in use!",
        });
        error = true;
      }
    } else if (records.find((record) => record.name === `${zone?.name}`)) {
      panelUrl = zone.name;
      form.setError("domain", {
        message:
          "Domain already in use, choose a subdomain or remove the record from Cloudflare!",
      });
      error = true;
    }

    if (error) {
      setLoading(false);
      return;
    }

    setupCloudflare.mutate({
      domain: values.domain,
      baseUrl: zone.name,
      panelUrl: panelUrl,
      zoneId: zone.id,
      caCertificate: values.caCertificate,
      caKey: values.caKey,
    });
  };

  return (
    <div className="max-w-[480px]">
      <Box>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-3"
          >
            <FormDescription>
              Connect a Zone available into your Cloudflare account, the domain
              or subdomain you choose in the following form will be used to
              access this dashboard, while the root domain will be used to
              generate unique subdomain to be assigned to your WordPress
              installations, ex: fe83hf.mydomain.ltd.
            </FormDescription>
            <FormField
              control={form.control}
              name={"zone"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cloudflare zone</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a Zone" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {zones.length &&
                        zones.map((zone, z) => (
                          <SelectItem key={z} value={zone.id}>
                            {zone.name} ( {zone.id} )
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>
            {selectedZone && (
              <>
                <FormField
                  control={form.control}
                  name="domain"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Domain or Subdomain</FormLabel>
                      <FormControl className="flex flex-row gap-3">
                        <div className="flex flex-row gap-3 items-center">
                          <Input {...field} />
                          <span className=" whitespace-nowrap">
                            .{zone?.name}
                          </span>
                        </div>
                      </FormControl>
                      <FormDescription>
                        Choose if the dashboard should be accessible directly
                        from the main domain (use *) or a subdomain.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <span className="text-xl font-semibold">SSL Settings</span>
                <FormDescription>
                  To properly connect the domain and access full SSL and Secure
                  Connections you need to generate an Origin Cartificate via{" "}
                  <Link
                    href={`https://dash.cloudflare.com/${zone?.account.id}/${zone?.name}/ssl-tls/origin/certificate-form`}
                    className=" underline"
                    target="_blank"
                  >
                    Cloudflare Dashboard
                  </Link>
                </FormDescription>
                <FormField
                  control={form.control}
                  name="caCertificate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Certificate Origin</FormLabel>
                      <FormControl className="flex flex-row gap-3">
                        <Textarea {...field} />
                      </FormControl>
                      <FormDescription>
                        Paste Origin certificate here, you can get it in your
                        Cloudflare dashboard.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="caKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Certificate Key</FormLabel>
                      <FormControl className="flex flex-row gap-3">
                        <Textarea {...field} />
                      </FormControl>
                      <FormDescription>Paste Private Key here.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            <Button type="submit" disabled={loading}>
              Connect
            </Button>
          </form>
        </Form>
      </Box>
    </div>
  );
};

export default EditCloudflare;
