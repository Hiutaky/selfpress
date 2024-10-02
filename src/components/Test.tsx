"use client";
import { trpc } from "@/utils/trpc";

const Test: React.FC = () => {
  const create = trpc.wordpress.create.useMutation({
    onSuccess(data) {
      console.log(data);
    },
  });

  const createWordpress = () => {
    create.mutate({
      domain: "http://localhost",
      name: "Firtst",
      wordpressSettings: {
        adminName: "hiutaky",
        adminPassword: "alex97",
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
  return <button onClick={() => createWordpress()}>Create</button>;
};

export default Test;
