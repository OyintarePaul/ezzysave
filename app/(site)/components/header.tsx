import { Button } from "@/components/ui/button";

const Header: React.FC = () => (
  <header className="bg-white shadow-md p-4 sticky top-0 z-10">
    <div className="container mx-auto flex justify-between items-center">
      <h1 className="text-3xl font-extrabold text-primary">EzzySave</h1>
      <nav className="flex space-x-3">
        {/* <Button variant="ghost">Features</Button>
        <Button variant="ghost">Loans</Button> */}
        <Button variant="secondary" asChild>
          <a href="/auth/login?returnTo=/overview">Sign In</a>
        </Button>
        <Button className="hidden sm:inline-block" asChild>
          <a href="/auth/login?returnTo=/overview">Get Started</a>
        </Button>
      </nav>
    </div>
  </header>
);

export default Header;
