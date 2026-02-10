import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { ChevronLeft } from "lucide-react";

export default function PageHeader({
  title,
  subtitle,
  backHref,
}: {
  title: string;
  subtitle?: string;
  backHref?: string;
}) {
  return (
    <header className="flex items-center space-x-4 mb-6">
      {backHref && (
        <Link
          href={backHref}
          className={buttonVariants({ variant: "secondary", size: "icon" })}
        >
          <ChevronLeft />
        </Link>
      )}
      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
        {title}
      </h1>

      {subtitle && (
        <p className="mt-1 text-gray-500 dark:text-gray-400">{subtitle}</p>
      )}
    </header>
  );
}
