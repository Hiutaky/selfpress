import React, { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const BaseLayout: React.FC<Props> = ({ children }) => {
  return <div className="flex flex-col gap-3">{children}</div>;
};

export const BaseLayoutContainer: React.FC<Props> = ({ children }) => {
  return (
    <div className="lg:container self-center py-6 flex flex-col gap-3">
      {children}
    </div>
  );
};

export default BaseLayout;
