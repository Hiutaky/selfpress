"use client";

import Link from "next/link";
import { ReactNode, useMemo } from "react";
import { Button } from "../ui/button";
import { usePathname } from "next/navigation";
import Icon from "../shared/Icon";
import { api } from "~/trpc/react";

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
      href: "database",
      label: "Database",
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
        siteUrl: "http://localhost",
        tablePrefix: "wp_",
      },
      dockerConfig: {
        //containerName: 'firstcontainer',
        networkName: "main-network",
        restartPolicy: "always",
      },
    });
  };

  return (
    <div className="container flex flex-row justify-between items-center text-white p-3 bg-stone-950 rounded mt-3">
      <Link href={"/"}>
        <h1 className="text-xl font-semibold">SelfPress</h1>
      </Link>
      <ul className="flex flex-row gap-3 font-semibold">
        {menu.map((item, i) => (
          <Link
            className={`hover:text-opacity-100 transition-all ${active === item.href ? "text-primary" : "text-white"} text-opacity-75`}
            href={`/${item.href}`}
            key={i}
          >
            {item.label}
          </Link>
        ))}
      </ul>
      <Button onClick={() => createWordpress()}>
        <Icon size={18}>add</Icon>
        Create
      </Button>
    </div>
  );
};

export default Header;
