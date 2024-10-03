"use client";

import { ReactNode, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Switch } from "~/components/ui/switch";
import { Textarea } from "~/components/ui/textarea";
import { Label } from "~/components/ui/label";

type Props = {
  children: ReactNode;
};

const formSchema = z.object({
  domain: z.string().url("URL not valid."),
  ssl: z.boolean(),
  certificate: z.string().optional(),
  key: z.string().optional(),
  wordpressId: z.string().refine(
    (n) => {
      console.log(n, Number(n));
      return Number(n) > 0;
    },
    {
      message: "Select a valid wordpress installation",
    },
  ),
});

const AddDomainForm: React.FC<Props> = ({ children }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { data: installations } = api.wordpress.readAll.useQuery();
  const _createDomain = api.domain.create.useMutation({
    onSuccess: (data) => {
      console.log(data);
      setLoading(false);
    },
    onError: (error) => {
      console.error(error);
      setLoading(false);
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      domain: "",
      wordpressId: "0",
    },
  });

  const isSSL = form.watch("ssl");

  function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    let error = false;
    if (values.ssl) {
      if (!values.key) {
        form.setError("key", {
          message: "Provide a valid Private Key, get it on Cloudflare",
        });
        error = true;
      }
      if (!values.certificate) {
        form.setError("certificate", {
          message: "Provide a valid Certificate, get it on Cloudflare",
        });
        error = true;
      }
      if (values.domain.search("https://") < 0) {
        form.setError("domain", {
          message: "Domain must include https:// prefix to be used with SSL",
        });
        error = true;
      }
      if (error) return setLoading(false);
    }
    const installation = installations
      ? installations.find((int) => int.id === Number(values.wordpressId))
      : false;
    if (!installation) return setLoading(false);
    _createDomain.mutate({
      domain: values.domain,
      wordpressId: Number(values.wordpressId),
      wpContainerName: installation.dockerConfig?.containerName ?? "",
      oldURL: installation.domain,
      ssl: values.ssl,
      certificate: values.certificate,
      key: values.key,
    });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogTitle>Add a new domain</DialogTitle>
        <DialogDescription>
          Add a new domain and attach it to a WordPress Installations
        </DialogDescription>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-3"
          >
            <div className="grid  grid-cols-[1fr_auto] gap-4">
              <FormField
                control={form.control}
                name="domain"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Domain</FormLabel>
                    <FormControl>
                      <Input placeholder="mydomain.ltc" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter the domain without http:// or https:// prefix.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ssl"
                render={({ field }) => (
                  <FormItem className="mt-2 flex flex-col gap-3">
                    <FormLabel>SSL</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="wordpressId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>WordPress Installation</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {installations?.length ? (
                        installations?.map((installation, i) => (
                          <SelectItem
                            key={i}
                            value={installation.id.toString()}
                          >
                            {installation.name} {installation.id}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="0">
                          Create a WordPress Installation first
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {isSSL && (
              <>
                <div className="w-full border-t-2 mt-4"></div>
                <Label className="font-semibold">
                  SSL Certificate Settings
                </Label>
                <FormField
                  control={form.control}
                  name="certificate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SSL Certificate</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Paste your Certificate here"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="key"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SSL Key</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Paste your Private Key here"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            <div className="flex flex-row gap-3 justify-end">
              <DialogTrigger asChild>
                <Button variant={"ghost"}>Back</Button>
              </DialogTrigger>
              <Button disabled={loading} type="submit">
                Save
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddDomainForm;
