"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Card from "~/components/shared/Card";
import Heading from "~/components/shared/Heading";
import { Button } from "~/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { toast } from "~/hooks/use-toast";
import { api } from "~/trpc/react";
import { RouterOutputs } from "~/trpc/shared";

type Props = {
    application: NonNullable<RouterOutputs['wordpress']['read']>
}

const formSchema = z.object({
    name: z.string().min(6)
})
type FormSchema = z.infer<typeof formSchema>

const General : React.FC<Props> = ({application}) => {
    const [loading, setLoading ] = useState(false);

    const form = useForm<FormSchema>({
        defaultValues: {
            name: application.name
        },
        resolver: zodResolver(formSchema)
    })

    const _update = api.wordpress.update.useMutation({
        onSuccess ( ) {
            toast({
                title: "Success",
                description: "Application updated."
            })
            setLoading(false);
        },
        onError(error) {
            toast({
                title: "Error",
                description: error.message,
                variant: 'destructive'
            })
            setLoading(false);
        }
    })

    const submit = (values: FormSchema) => {
        setLoading(true);
        _update.mutate({
            id: application.id,
            name: values.name
        })
    }

    return (
        <>
            <Card>
                <Heading>Project Name</Heading>
                <Form {...form}>
                    <form className="flex flex-col gap-2" onSubmit={form.handleSubmit(submit)}>
                        <FormField 
                            control={form.control}
                            name="name"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>
                                        Name
                                    </FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormDescription>Edit the unique name used to recognize this applicaiton.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button disabled={loading}  className="self-end px-4" type="submit">
                            Save
                        </Button>
                    </form>
                </Form>
            </Card>
            <Card className=" p-[0px] border-red-900">
                <div className="p-6">
                    <Heading>Delete Project</Heading>
                    <span className="text-xs">The project will be permanently deleted, including its files, database and domains. This action is irreversible and can not be undone.</span>
                </div>
                <div className="bg-red-600 border-t border-red-900 bg-opacity-40 p-4 px-6 flex flex-row-reverse">
                    <Button disabled={loading} variant={'destructive'}>
                        Delete
                    </Button>
                </div>
            </Card>
        </>
    )
}

export default General