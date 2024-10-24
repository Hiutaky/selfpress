import { redirect } from "next/navigation"
import Heading from "~/components/shared/Heading"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { api } from "~/trpc/server"
import General from "./_components/General"
import Domains from "./_components/Domains"

type Props = {
    params: {
        id: string
    }
}
export default async function Page(req: Props) {
    const application = await api.wordpress.read.query({
        id: req.params.id
    });
    const domains = await api.domain.readAll.query();

    if( ! application )
        redirect('/applications');

    const triggers = [{
        name: 'general',
        label: 'General'
    },{
        name: 'domains',
        label: 'Domains'
    }, {
        name: 'php',
        label: 'PHP'
    }, {
        name: 'security',
        label: 'Security'
    }];
    
    return (
        <div className="max-w-[1200px] self-center w-full">
            <Heading>
                Settings
            </Heading>
            <span>Manage your application settings from this interface.</span>
            <Tabs className="grid grid-cols-[1fr_4fr] gap-6 mt-6" defaultValue="general">
                <TabsList className="bg-transparent flex flex-col gap-4 items-start justify-start">
                    {
                        triggers.map( (trigger, t) => 
                        <TabsTrigger key={t} className='p-0 !bg-transparent !text-white data-[state=active]:!bg-neutral-50 data-[state=active]:!bg-opacity-20 text-xs !bg-opacity-15 hover:!bg-neutral-50 hover:!bg-opacity-10   w-full justify-start px-3 py-1' value={trigger.name}>
                            {trigger.label}
                        </TabsTrigger>
                        )
                    }
                </TabsList>
                <div>
                    <TabsContent value="general" className="flex flex-col gap-6 mt-[0]">
                        <General 
                            application={application}
                        />
                    </TabsContent>
                    <TabsContent value="domains" className="mt-[0]">
                        <Domains application={application} domains={domains} />
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    )
}