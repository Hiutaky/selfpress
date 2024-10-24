"use client";

import { ReactNode } from "react";

const Heading: React.FC<{ children: ReactNode }> = ({ children }) => {
  return <h2 className="text-white text-lg font-semibold py-2">{children}</h2>;
};

export default Heading;
