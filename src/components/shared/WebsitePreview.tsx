"use client";

import Link from "next/link";
import { useState } from "react";

type Props = {
  imagePath: string | false;
  siteId: number;
  siteUrl: string;
};

const WebsitePreview: React.FC<Props> = ({ imagePath, siteUrl }) => {
  const [path] = useState(imagePath);

  return (
    <div className="relative">
      {path ? (
        <Link href={siteUrl} target="_blank">
          <picture>
            <img
              alt="site preview"
              className="aspect-video object-cover rounded-md"
              src={path}
            />
          </picture>
        </Link>
      ) : (
        <div className="aspect-video animate-pulse bg-neutral-300 rounded-md"></div>
      )}
    </div>
  );
};

export default WebsitePreview;
