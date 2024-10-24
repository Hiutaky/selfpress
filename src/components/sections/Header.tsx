"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { Button } from "../ui/button";
import Icon from "../shared/Icon";
import { useSession } from "next-auth/react";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import Navigation, { MenuItem } from "../shared/Navigation";

type Props = {
  children?: ReactNode;
};
const Header: React.FC<Props> = ({}) => {
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
      <Navigation menu={menu} />
    </div>
  );
};

export default Header;
