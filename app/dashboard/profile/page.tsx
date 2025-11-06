import { pageAuthGuard } from "@/lib/auth";
import ProfilePageUI from "./ui";
import { currentUser } from "@clerk/nextjs/server";

const ProfilePage: React.FC = async () => {
  await pageAuthGuard("/profile");
  const user = await currentUser();
  if(!user) return null;

  const userInfo = {
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    email: user.emailAddresses[0]?.emailAddress || "",
    phoneNumber: user.phoneNumbers[0]?.phoneNumber || "",
    imageUrl: user.imageUrl || "",
  }
  return <ProfilePageUI {...userInfo} />;
};

export default ProfilePage;
