"use client";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function ChangeAvatar() {
  const router = useRouter();
  const { user } = useUser();
  return (
    <input // Hidden file input for changing avatar
      type="file"
      id="change-image"
      accept="image/*"
      className="hidden"
      onChange={async (e) => {
        const file = e.target.files?.[0];
        if (file) {
          const response = await user?.setProfileImage({
            file,
          });
          if (response) {
            router.refresh();
          }
        }
      }}
    />
  );
}
