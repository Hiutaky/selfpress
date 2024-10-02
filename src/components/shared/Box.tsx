"use client";

import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  title?: string;
};

const Box: React.FC<Props> = ({ children, title }) => {
  return (
    <div className="flex flex-col gap-3 p-4 bg-stone-900">
      {title && <h3 className="font-semibold text-lg">{title}</h3>}
      {children}
    </div>
  );
};

export default Box;
