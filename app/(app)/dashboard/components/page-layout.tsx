import { buttonVariants } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function PageLayout({
  children,
  title,
  subtitle,
  backHref,
}: {
  children: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  backHref?: string;
}) {
  return (
    <div className="p-4 sm:p-8 space-y-8 pb-20 lg:pb-8">
      <header className="flex items-center space-x-4 mb-2">
        {backHref && (
          <Link
            href={backHref}
            className={buttonVariants({ variant: "secondary", size: "icon" })}
          >
            <ChevronLeft />
          </Link>
        )}
        <h1 className="text-3xl font-extrabold text-foreground">{title}</h1>
      </header>
      <p className="mt-1 text-gray-500 dark:text-gray-400">{subtitle}</p>

      {children}
    </div>
  );
}
