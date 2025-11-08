import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      allowedOrigins: [
        "localhost:3000",
        "ezzysave.vercel.app",
        "laughing-space-telegram-j9xw4q7jw6jcj5v9-3000.app.github.dev",
      ],
    },
  },
};

export default withPayload(nextConfig);
