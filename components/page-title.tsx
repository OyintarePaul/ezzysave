"use client";

import { usePathname } from "next/navigation";

const PageTitle = () => {
  const pathname = usePathname();

  return (
    <h1 className="text-3xl font-bold capitalize">
      {pathname.split("/").pop()}
    </h1>
  );
};

export default PageTitle;
