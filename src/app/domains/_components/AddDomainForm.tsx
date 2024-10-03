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

type Props = {
  children: ReactNode;
};

const formSchema = z.object({
  domain: z.string().url("URL not valid."),
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
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      domain: "",
      wordpressId: "0",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    _createDomain.mutate({
      domain: values.domain,
      wordpressId: Number(values.wordpressId),
      wpContainerName:
        installations?.find((int) => int.id === Number(values.wordpressId))
          ?.dockerConfig?.containerName ?? "",
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
