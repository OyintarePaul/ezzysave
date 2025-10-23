import UserProfileDisplay from "./user-profile-display";

const Header: React.FC = () => (
    // Header is only visible on small screens, without the menu button
    <header className="sticky top-0 z-40 w-full bg-background border-b p-4 flex justify-between items-center lg:hidden ">
        <h1 className="text-xl font-extrabold text-primary">EzzySave</h1>
        <UserProfileDisplay />
    </header>
);



export default Header;