import Sidebar from "@/components/sidebar";
import { Main } from "@/components/main";
import NProgress from "@/components/NProgress";
import MobileNav from "@/components/mobile-nav";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: { template: "%s | EzzySave", absolute: "EzzySave" },
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <MobileNav />
        <div className="flex-1">
          <Main>{children}</Main>
        </div>
      </div>
      <NProgress />
    </>
  );
}
