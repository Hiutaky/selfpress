"use client";

import { useEffect, useState } from "react";
import { ContainerActions, ContainerStatuses } from "~/server/routers/docker";
import { api } from "~/trpc/react";
import { Button } from "../ui/button";
import Icon from "./Icon";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

type Props = {
  containerName: string;
  defaultStatus?: ContainerStatuses;
};

const ContainerStatus: React.FC<Props> = ({
  containerName,
  defaultStatus = "Undefined",
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<ContainerStatuses>(defaultStatus);

  const { data: _status, refetch } = api.docker.getStatus.useQuery(
    {
      name: containerName,
    },
    {
      enabled: false,
    },
  );

  const updateContainer = api.docker.changeContainerStatus.useMutation({
    onSuccess: async (data) => {
      setLoading(false);
      await refetch();
      console.log(data);
    },
    onError: (err) => {
      setLoading(false);
      console.log(err);
    },
  });

  const execContainerAction = (action: ContainerActions) => {
    setLoading(true);
    updateContainer.mutate({
      action,
      containerName,
    });
  };

  useEffect(() => {
    if (_status) setStatus(_status);
  }, [setStatus, _status]);

  useEffect(() => {
    if (defaultStatus === "Undefined") refetch();
  }, [defaultStatus, refetch]);

  return (
    <div className="">
      <div className="flex flex-row gap-3 items-center">
        {status === "Exited" ? (
          <>
            <span className="w-4 h-4 bg-red-600 rounded-full"></span>
            {status}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => execContainerAction("start")}
                  disabled={loading}
                  variant={"outline"}
                  size={"icon"}
                >
                  <Icon
                    className={`${loading ? "animate-spin" : ""}`}
                    size={16}
                  >
                    {loading ? "sync" : "play_arrow"}
                  </Icon>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Start container</TooltipContent>
            </Tooltip>
          </>
        ) : status === "Up" ? (
          <>
            <span className="w-4 h-4 bg-green-600 animate-pulse rounded-full"></span>
            {status}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => execContainerAction("stop")}
                  disabled={loading}
                  variant={"outline"}
                  size={"icon"}
                >
                  <Icon
                    className={`${loading ? "animate-spin" : ""}`}
                    size={16}
                  >
                    {loading ? "sync" : "block"}
                  </Icon>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Stop Container</TooltipContent>
            </Tooltip>
          </>
        ) : (
          <>
            <Icon className="animate-spin" size={16}>
              sync
            </Icon>
            Fetching
          </>
        )}
      </div>
    </div>
  );
};

export default ContainerStatus;
