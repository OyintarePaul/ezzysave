import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { auth0 } from "@/lib/auth";
import { Bell } from "lucide-react";
import { Button } from "./ui/button";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import PageTitle from "./page-title";

interface MainProps {
  children: React.ReactNode;
}

export async function Main({ children }: MainProps) {
  const session = await auth0.getSession();
  return (
    <main className="flex h-screen flex-col gap-4 p-4">
      <header>
        <div className="flex justify-between">
          {/* Left side */}
          <div>
            <p className="font-semibold">{`Hi, ${
              session?.user?.given_name || "there"
            }`}</p>
            <PageTitle />
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Bell className="size-6" />
            </Button>
            {session && (
              <Avatar>
                <AvatarImage src={session.user.picture} />
                <AvatarFallback>{session.user.name?.charAt(0)}</AvatarFallback>
              </Avatar>
            )}
          </div>
        </div>
      </header>
      <div className="flex-1 overflow-y-hidden">
        <ScrollArea className="h-full">
          {children}
          <div className="h-10" />
        </ScrollArea>
      </div>
    </main>
  );
}
