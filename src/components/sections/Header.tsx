"use client";

import Link from "next/link";
import { ReactNode, useMemo } from "react";
import { Button } from "../ui/button";
import { usePathname } from "next/navigation";
import Icon from "../shared/Icon";
import { useSession } from "next-auth/react";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

type Props = {
  children?: ReactNode;
};
type MenuItem = {
  href: string;
  label: string;
  className?: string;
};
const Header: React.FC<Props> = ({}) => {
  const path = usePathname();
  const session = useSession();

  const menu: MenuItem[] = [
    {
      href: "",
      label: "Home",
    },
    {
      href: "applications",
      label: "Applications",
    },
    {
      href: "domains",
      label: "Domains",
    },
    {
      href: "services",
      label: "Services",
    },
    {
      href: "terminal",
      label: "Terminal",
    },
    {
      href: "settings",
      label: "Settings",
    },
  ];

  const active = useMemo(() => {
    return path.split("/").at(1);
  }, [path]);

  return (
    <div className="w-full flex flex-col gap-2 text-white p-5 pb-[0px] bg-neutral-950 border-b-[1px] border-neutral-800">
      <div className="flex flex-row justify-between items-center">
        <Link
          href={"/"}
          className="flex flex-row gap-3 items-center text-lg font-semibold"
        >
          <Image
            alt="Selfpress Logo"
            src="/assets/images/logo.webp"
            width={30}
            height={30}
          />
          Selfpress
        </Link>
        <div className="flex flex-row gap-3">
          {session.data?.user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button>
                  <Icon>add</Icon>
                  Create
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Icon>grid_view</Icon>
                  Application
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Icon>language</Icon>
                  Domain
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          {session.data?.user ? (
            <Button>{session.data.user.username}</Button>
          ) : (
            <Link href={"/signin"}>
              <Button>
                <Icon>person</Icon>
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
      <ul className="flex flex-row text-xs">
        {menu.map((item, i) => (
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
    </div>
  );
};

export default Header;
