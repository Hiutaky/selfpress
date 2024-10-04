import { ReactNode } from "react"

type Props = {
    children: ReactNode
    hoverable?: boolean
}

const Card : React.FC<Props> = ({children, hoverable = false}) => {

    return (
        <div className={`flex flex-col gap-2 border p-5 rounded ${hoverable ? 'hover:border-white' : ''}`}>
            {children}
        </div>
    )
}

export default Card;