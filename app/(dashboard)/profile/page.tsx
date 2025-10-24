import { pageAuthGuard } from "@/lib/auth";
import ProfilePageUI from "./ui";

const ProfilePage: React.FC = async () => {
  await pageAuthGuard("/profile");
  return <ProfilePageUI />;
};

export default ProfilePage;
