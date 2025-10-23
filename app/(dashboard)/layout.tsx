import { Toaster } from "@/components/ui/sonner";
import NProgress from "@/components/NProgress";
import { Metadata } from "next";
import Header from "./components/header";
import BottomNavigation from "./components/bottom-nav";
import Sidebar from "./components/sidebar";

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
      <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
        {/* Sidebar (Large screens) - Consumes router state via hook */}
        <Sidebar />

        <div className="flex-1 flex flex-col overflow-y-auto">
          {/* Mobile Header */}
          <Header />

          <main className="min-h-full">
            <div>
              {/* <h1 className="text-3xl font-bold text-gray-900 dark:text-white p-8">
                  {navItems.find((item) => item.path === pathname)?.name} Page
                </h1> */}
              {children}
            </div>
          </main>
        </div>

        {/* Bottom Navigation (Small screens) - Consumes router state via hook */}
        <BottomNavigation />
      </div>
      <NProgress />
      <Toaster position="top-right" richColors />
    </>
  );
}
