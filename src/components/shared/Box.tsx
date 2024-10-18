"use client";

import { ReactNode } from "react";
import Card from "./Card";

type Props = {
  children: ReactNode;
  title?: string;
};

const Box: React.FC<Props> = ({ children, title }) => {
  return (
    <div className="flex flex-col gap-3">
      {title && <h3 className="text-white font-semibold text-sm">{title}</h3>}
      <Card className="bg-neutral-950">{children}</Card>
    </div>
  );
};

export default Box;
