"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ReactNode, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
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
import { api } from "~/trpc/react";

type Props = {
  children: ReactNode;
};

const formSchema = z.object({
  name: z.string().min(6),
  wordpressSettings: z.object({
    siteDescription: z.string().min(9),
    siteName: z.string().min(6),
    adminEmail: z.string().email(),
    adminPassword: z.string().min(9),
    adminName: z.string().min(6),
  }),
});

const AddNewWordpressForm: React.FC<Props> = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const create = api.wordpress.create.useMutation({
    onSuccess: () => {
      setLoading(false);
    },
    onError: (error) => {
      setLoading(false);
      console.log(error);
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      name: "",
      wordpressSettings: {
        siteName: "",
        adminEmail: "",
        adminPassword: "",
        adminName: "",
      },
    },
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    create.mutate({
      name: values.name,
      domain: "http://localhost",
      wordpressSettings: {
        ...values.wordpressSettings,
      },
      dockerConfig: {},
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogTitle>Create a New WordPress</DialogTitle>
        <DialogDescription>
          Setup a new WordPress Environment in minutes.
        </DialogDescription>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-3"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="My wordpress" />
                  </FormControl>
                  <FormDescription>
                    An easy name to remember your project.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="wordpressSettings.siteName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Site Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage></FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="wordpressSettings.siteDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Site Description/Motto</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage></FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="wordpressSettings.adminEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Admin Email</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage></FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="wordpressSettings.adminName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Admin Username</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage></FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="wordpressSettings.adminPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Admin Password</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" />
                  </FormControl>
                  <FormMessage></FormMessage>
                </FormItem>
              )}
            />
            <Button type="submit" disabled={loading}>
              Submit
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddNewWordpressForm;
