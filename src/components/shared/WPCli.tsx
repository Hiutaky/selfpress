"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { Input } from "../ui/input";
import Icon from "./Icon";

type Props = {
  name: string;
  execStdout: (command: string) => Promise<{
    stdout: string;
    stderr: string;
  }>;
};

const WPCli: React.FC<Props> = ({ name, execStdout }) => {
  const [command, setCommand] = useState("");
  const [stdout, setStdout] = useState("");
  const inputRef = useRef<HTMLInputElement>(null!);
  const stdoutRef = useRef<HTMLDivElement>(null!);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!command) return;
    const preExecutionCmd = `${stdout}${stdout && "\n"}<b>${name}:</b> $ ${command}`;
    setCommand("");
    setStdout(preExecutionCmd);
    try {
      const resp = await execStdout(command);
      if (resp.stdout) setStdout(`${preExecutionCmd}\n${resp.stdout}`);
      if (resp.stderr)
        setStdout(
          `${preExecutionCmd}\n<span class="text-red-600">${resp.stderr}</span>`,
        );
    } catch (e) {
      setStdout(`${preExecutionCmd}\n<span class="text-red-600">${e}</span>`);
    }
  };

  useEffect(() => {
    stdoutRef.current.scrollTop = stdoutRef.current.scrollHeight;
  }, [stdout]);

  useEffect(() => {
    inputRef.current.focus();
  }, [inputRef]);

  return (
    <div className="flex flex-col p-3 gap-2 border rounded-md">
      <div className="flex flex-row gap-3 items-center leading-3">
        <Icon>terminal</Icon>
        <span className="text-xs font-semibold text-neutral-200">WP CLI</span>
      </div>
      <div className="bg-neutral-950 border p-4 rounded-md ">
        <div
          ref={stdoutRef}
          className="whitespace-pre-line max-h-[300px] overflow-y-scroll"
          dangerouslySetInnerHTML={{ __html: stdout }}
        ></div>
        <form className="flex flex-row gap-3" onSubmit={(e) => onSubmit(e)}>
          <div className="flex flex-row text-nowrap">
            <b>{name}:</b> ${" "}
          </div>
          <Input
            ref={inputRef}
            value={command}
            className="p-0 border-0 h-6"
            onChange={(e) => setCommand(e.target.value)}
          />
        </form>
      </div>
    </div>
  );
};

export default WPCli;
