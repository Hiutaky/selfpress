"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { MenuItem } from "~/components/sections/Header";

const SettingsNavigation = () => {
  const path = usePathname();
  const Menu: MenuItem[] = [
    {
      href: "settings",
      label: "General",
    },
    {
      href: "settings/cloudflare",
      label: "Cloudflare",
    },
  ];

  const active = useMemo(() => {
    return path.substring(1, path.length);
  }, [path]);

  console.log(active, path);
  return (
    <ul className="flex felx-row text-xs border-b-[1px]">
      {Menu.map((item, i) => (
        <li
          key={i}
          className={`py-3  ${active === item.href ? "border-b-2 border-white" : "text-opacity-75"}`}
        >
          <Link
            className={`hover:text-opacity-100 text-opacity-50 transition-all rounded text-white ${active === item.href && "!text-opacity-100"} hover:bg-slate-50 hover:bg-opacity-10 x py-2 px-3`}
            href={`/${item.href}`}
          >
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default SettingsNavigation;
