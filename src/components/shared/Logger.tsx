"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "../ui/dialog";
import { api } from "~/trpc/react";
import { Button } from "../ui/button";
import Icon from "./Icon";

type Props = {
  children?: ReactNode;
  containerName: string;
};

const Logger: React.FC<Props> = ({ children, containerName }) => {
  const { data, isFetching } = api.docker.getLogs.useQuery({
    name: containerName,
  });
  const logRef = useRef<HTMLDivElement>(null!);
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    if (!logRef.current || !data || !open) return;
    logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [data, open, logRef]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children ?? (
          <Button>
            <Icon>bug_report</Icon>
            Logger
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="md:min-w-[70vw]">
        <DialogHeader>Logs Docker Container: {containerName}</DialogHeader>
        <div
          ref={logRef}
          dangerouslySetInnerHTML={{ __html: data ?? "" }}
          className={` whitespace-pre-line md:max-h-[60vh] p-4 rounded-md ${isFetching ? "bg-neutral-400 animate-pulse" : "bg-neutral-900"} overflow-y-scroll rounded-md`}
        ></div>
      </DialogContent>
    </Dialog>
  );
};

export default Logger;
