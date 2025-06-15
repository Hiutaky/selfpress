"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

export type MenuItem = {
  href: string;
  label: string;
  className?: string;
};

type Props = {
  menu: MenuItem[];
  fullPath?: boolean;
};

const Navigation: React.FC<Props> = ({ menu, fullPath = false }) => {
  const path = usePathname();
  const active = useMemo(() => {
    return fullPath ? path.replace("/", "") : path.split("/").at(1);
  }, [path, fullPath]);

  return (
    <ul className="flex flex-row text-xs">
      {menu.map((item, i) => (
        <li
          key={i}
          className={`py-4  ${active === item.href ? "border-b-2 border-white" : "text-opacity-75"}`}
        >
          <Link
            className={`hover:text-opacity-100 text-opacity-50 transition-all rounded text-white ${active === item.href && "!text-opacity-100"} hover:bg-slate-50 hover:bg-opacity-10 x py-3 px-3`}
            href={`/${item.href}`}
          >
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default Navigation;
