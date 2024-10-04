"use client";

import Link from "next/link";
import { ReactNode, useMemo } from "react";
import { Button } from "../ui/button";
import { usePathname } from "next/navigation";
import Icon from "../shared/Icon";
import { api } from "~/trpc/react";
import Image from "next/image";

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

  const create = api.wordpress.create.useMutation({
    onSuccess(data) {
      console.log(data);
    },
  });

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
  ];

  const active = useMemo(() => {
    return path.split("/").at(1);
  }, [path]);

  const createWordpress = () => {
    create.mutate({
      domain: "http://localhost",
      name: "Firtst",
      wordpressSettings: {
        adminName: "hiutaky",
        adminPassword: "Cercaz2016?",
        siteDescription: "Just a demo site",
        adminEmail: "hiutaky@gmail.com",
        siteName: "Test site",
      },
      dockerConfig: {
        //containerName: 'firstcontainer',
        restartPolicy: "always",
      },
    });
  };

  return (
    <div className="w-full flex flex-col gap-2 text-white p-4 pb-[0px] bg-neutral-950 border-b-[1px] border-neutral-800">
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
        <Button onClick={() => createWordpress()}>
          <Icon>add</Icon>
          Create
        </Button>
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
