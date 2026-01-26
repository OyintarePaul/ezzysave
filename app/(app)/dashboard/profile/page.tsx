import { pageAuthGuard } from "@/lib/auth";
import SignOut from "./SignOut";
import WithdrawalPin from "./WithdrawalPin";
import Bank from "./Bank";
import Profile from "./Profile";
import { listBanks } from "@/lib/paystack";
import UserAvatar from "./Avatar";

import { currentUser } from "@clerk/nextjs/server";
import { getPayloadCustomerByClerkId } from "@/lib/payload";

const ProfilePage: React.FC = async () => {
  await pageAuthGuard("/profile");
  const user = await currentUser();
  if (!user) return null;

  const [bankList, customer] = await Promise.all([
    listBanks(),
    getPayloadCustomerByClerkId(user.id),
  ]);

  const userInfo = {
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    email: user.emailAddresses[0]?.emailAddress || "",
    phoneNumber: user.phoneNumbers[0]?.phoneNumber || "",
    imageUrl: user.imageUrl || "",
  };
  return (
    <div className="p-4 sm:p-8 space-y-8 pb-20 lg:pb-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Profile Settings
      </h1>

      <div className="space-y-10">
        <UserAvatar {...userInfo} />
        <Profile {...userInfo} />
        <Bank
          bankList={bankList.data}
          accountNumber={customer?.accountNumber || ""}
          bankCode={customer?.bankCode || ""}
          accountName={customer?.accountName || ""}
        />
        <WithdrawalPin />
        <SignOut />
      </div>
    </div>
  );
};

export default ProfilePage;
