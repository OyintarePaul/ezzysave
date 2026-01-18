"use client";
export default function ChangeAvatar() {
  return (
    <input // Hidden file input for changing avatar
      type="file"
      id="change-image"
      accept="image/*"
      className="hidden"
      onChange={(e) => {
        const file = e.target.files?.[0];
        if (file) {
          // In a real app, you'd upload the image and update the avatar URL
          console.log("Selected file:", file);
        }
      }}
    />
  );
}
