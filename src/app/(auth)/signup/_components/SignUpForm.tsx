"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Box from "~/components/shared/Box";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { api } from "~/trpc/react";

const singupSchemaForm = z.object({
  username: z.string().min(6),
  password: z.string().min(6),
  confirmPassword: z.string().min(6),
  email: z.string().email(),
  firstname: z.string().optional(),
  lastname: z.string().optional(),
});

type Schema = z.infer<typeof singupSchemaForm>;

const SignUpForm: React.FC = () => {
  const form = useForm<Schema>({
    defaultValues: {
      confirmPassword: "",
      email: "",
      firstname: "",
      lastname: "",
      password: "",
      username: "",
    },
    resolver: zodResolver(singupSchemaForm),
  });

  const { mutate } = api.user.signup.useMutation({
    onSuccess: (data) => {
      signIn("credentials", { ...data, emailOrUsername: data.email });
    },
    onError() {},
  });

  const onSubmit = (values: Schema) => {
    if (values.password !== values.confirmPassword) {
      form.setError("confirmPassword", {
        message:
          "Passwords are different, please double check your password and confirm password.",
      });
      return;
    }
    mutate({
      email: values.email,
      password: values.password,
      username: values.username,
      firstname: values.firstname,
      lastname: values.lastname,
    });
  };

  return (
    <div className="max-w-[420px] w-full">
      <Box title="Signup">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email address</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="you@email.ltd"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage></FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="myuser" />
                  </FormControl>
                  <FormMessage></FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage></FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage></FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="firstname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Firstname</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage></FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lastname</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage></FormMessage>
                </FormItem>
              )}
            />
            <Button type="submit" variant={"default"}>
              Signup
            </Button>
          </form>
        </Form>
      </Box>
    </div>
  );
};

export default SignUpForm;
