"use client";

import Link from "next/link";
import { ReactNode, useEffect, useState } from "react";
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
import Navigation, { type MenuItem } from "../shared/Navigation";

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
  const [scroll, setScroll] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
        setScroll(window.scrollY > 0 ? true : false)
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className={`${scroll ? 'fixed p-3 py-[0px]' : 'p-5  pb-[0px]'} w-full flex flex-col gap-2 text-white top-[0px] transition-all bg-neutral-950 border-b-[1px] border-neutral-800`}>
      <div className="flex flex-row justify-between items-center">
        <Link
          href={"/"}
          className="flex flex-row gap-3 items-center text-lg font-semibold"
        >
          <Image
            alt="Selfpress Logo"
            src="/assets/images/Selfpress.svg"
            width={32}
            className=" bg-white rounded-full"
            height={32}
          />
          <span className={scroll ? "hidden" : ""}>
            Selfpress
          </span>
        </Link>
      <div className={scroll ? '' : 'hidden'}>
        <Navigation menu={menu} />
      </div>
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
      <div className={scroll ? 'hidden' : ''}>
        <Navigation menu={menu} />
      </div>
    </div>
  );
};

export default Header;
