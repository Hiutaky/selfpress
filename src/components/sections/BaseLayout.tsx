import React, { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const BaseLayout: React.FC<Props> = ({ children }) => {
  return <div className="flex flex-col gap-3">{children}</div>;
};

export default BaseLayout;
