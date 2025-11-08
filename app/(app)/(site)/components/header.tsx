import { Button } from "@/components/ui/button";
import Link from "next/link";

const Header: React.FC = () => (
  <header className="bg-white shadow-md p-4 sticky top-0 z-10">
    <div className="container mx-auto flex justify-between items-center">
      <h1 className="text-3xl font-extrabold text-primary"><Link href="/">EzzySave</Link></h1>
      <nav className="flex space-x-3">
        {/* <Button variant="ghost">Features</Button>
        <Button variant="ghost">Loans</Button> */}
        <Button variant="secondary" asChild>
          <Link href="/auth/login">Sign In</Link>
        </Button>
        <Button className="hidden sm:inline-block" asChild>
          <Link href="/auth/register">Get Started</Link>
        </Button>
      </nav>
    </div>
  </header>
);

export default Header;
