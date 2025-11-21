import path from "path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    // This points to: C:\SNAPUI\frontend
    root: path.resolve(__dirname, "frontend"),
  },
};

export default nextConfig;
