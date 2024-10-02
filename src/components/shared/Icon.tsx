"use client";
/**
 * Icon component
 */

/* -------------------------------------------------------------------------- */
/*                                   IMPORTS                                  */
/* -------------------------------------------------------------------------- */

import React from "react";

/* -------------------------------------------------------------------------- */
/*                                   TYPES                                    */
/* -------------------------------------------------------------------------- */

type Props = {
  children: string;
  className?: string;
  inheritSize?: boolean;
  size?: number;
};

/* -------------------------------------------------------------------------- */
/*                                  COMPONENT                                 */
/* -------------------------------------------------------------------------- */

const Icon: React.FC<Props> = ({
  children,
  className,
  inheritSize = false,
  size = 24,
}) => {
  let fontSize = `${size}px`;

  if (inheritSize) {
    fontSize = "inherit";
  }

  const style: Record<string, string> = { fontSize: `${fontSize}` };

  const cn = `${className ?? ""} material-symbols-outlined no-underline`;

  return (
    <span className={cn} style={style}>
      {children}
    </span>
  );
};

export default Icon;
