"use client";

import { ReactNode } from "react";

const Heading: React.FC<{ children: ReactNode }> = ({ children }) => {
  return <h2 className="text-white font-semibold">{children}</h2>;
};

export default Heading;
