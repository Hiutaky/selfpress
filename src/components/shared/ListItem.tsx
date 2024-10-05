"use client";
import { ReactNode, useState } from "react";
import Icon from "./Icon";
import { Button } from "../ui/button";

type ListProps = {
  copy?: string | false;
  children: string | number | ReactNode;
  label: string;
  type?: "default" | "password";
};
const ListItem: React.FC<ListProps> = ({
  children,
  copy,
  label,
  type = "default",
}) => {
  const [show, setShow] = useState<boolean>(false);
  return (
    <div className="flex font-medium flex-col gap-1 justify-between">
      <span className="text-neutral-400">{label}</span>
      <div className="flex font-semibold flex-row gap-2 items-center text-stone-200">
        <span
          className={`text-right text-wrap ${type === "password" && !show ? "text-stone-800  bg-stone-800 px-10" : ""} rounded`}
        >
          {type === "password" && !show ? "password" : children}
        </span>
        {type === "password" && (
          <div className="flex flex-row gap-2">
            <Button
              size={"icon"}
              variant={"ghost"}
              onClick={() => setShow(!show)}
            >
              <Icon>{show ? "visibility_off" : "visibility"}</Icon>
            </Button>
            {copy && (
              <Button
                size={"icon"}
                variant={"ghost"}
                onClick={async () => await navigator.clipboard.writeText(copy)}
              >
                <Icon>content_copy</Icon>
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ListItem;
