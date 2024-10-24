import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  hoverable?: boolean;
  className?: string;
};

const Card: React.FC<Props> = ({
  children,
  hoverable = false,
  className = "",
}) => {
  return (
    <div
      className={`flex flex-col gap-2 border border-neutral-800 p-6 bg-neutral-950 rounded-md ${hoverable ? "hover:border-white" : ""} ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
