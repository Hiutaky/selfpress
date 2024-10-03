"use client";
import { ReactNode, useState } from "react";
import Icon from "./Icon";
import { Button } from "../ui/button";

type ListProps = {
  children: string | number | ReactNode;
  label: string;
  type?: "default" | "password";
};
const ListItem: React.FC<ListProps> = ({
  label,
  children,
  type = "default",
}) => {
  const [show, setShow] = useState<boolean>(false);
  return (
    <div className="flex flex-row justify-between items-center">
      <span className="font-semibold">{label}</span>
      <div className="flex flex-row gap-2 items-center">
        <span
          className={`text-right ${type === "password" && !show ? "text-stone-800 bg-stone-800 px-10" : ""} rounded`}
        >
          {type === "password" && !show ? "password" : children}
        </span>
        {type === "password" && (
          <Button
            size={"icon"}
            variant={"ghost"}
            onClick={() => setShow(!show)}
          >
            <Icon>{show ? "visibility_off" : "visibility"}</Icon>
          </Button>
        )}
      </div>
    </div>
  );
};

export default ListItem;
