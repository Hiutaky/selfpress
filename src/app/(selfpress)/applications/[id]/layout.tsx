import { ReactNode } from "react"
import BaseLayout from "~/components/sections/BaseLayout"
import Navigation, { MenuItem } from "~/components/shared/Navigation"

type Props = {
    children: ReactNode,
    params: {
        id: string
    }
}

export default async function Layout({children, params} : Props) {

    const appUrl = (path: string) => `applications/${params.id}${path ? `/${path}` : ''}`
    const applicationMenu : MenuItem[] = [{
        href: appUrl(''),
        label: 'General'
    }, {
        href: appUrl('details'),
        label: "Details"
    }, {
        href: appUrl('settings'),
        label: 'Settings'
    }]
    return (
        <BaseLayout>
            <div className="bg-neutral-900 border-b">
                <Navigation menu={applicationMenu} fullPath={true} />
            </div>
            <div className="lg:container self-center flex flex-col gap-3 py-3">
                {children}
            </div>
        </BaseLayout>
    )
}