"use clinet"

import Link from "next/link"
import React from "react"
import Card from "~/components/shared/Card"
import Heading from "~/components/shared/Heading"
import { env } from "~/env"
import { RouterOutputs } from "~/trpc/shared"

type Props = {
    application: NonNullable<RouterOutputs['wordpress']['read']>
    domains: RouterOutputs['domain']['readAll']
}

const Domains : React.FC<Props> = ({application, domains}) => {
    
    return (
        <div className="flex flex-col gap-3">
            <Heading>Domains</Heading>
            <span>Assign one or more domain to this application.</span>
            <Card>
                {
                    env.NODE_ENV === 'development' ?
                    <div>
                        Domains cannot be used in development environment.
                    </div>
                    : domains.length > 0 ?
                    application.domains.map( (domain, d) => (
                        <div key={d}>
                            {domain.domainName}
                        </div>
                    ))
                    : <div>
                        Please consider connecting your <Link className="underline" href={'/settings/cloudflare'}>Cloudflare</Link> first.
                    </div>
                }
            </Card>
        </div>
    )
}

export default Domains