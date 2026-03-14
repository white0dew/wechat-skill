import path from "node:path";
import { fileURLToPath } from "node:url";

const dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import("next").NextConfig} */
const nextConfig = {
  experimental: {
    externalDir: true
  },
  outputFileTracingRoot: path.resolve(dirname, "../../"),
  webpack: (config) => {
    config.resolve.alias["@md2wechat/core"] = path.resolve(
      dirname,
      "../../packages/core/src/index.ts"
    );
    return config;
  }
};

export default nextConfig;
