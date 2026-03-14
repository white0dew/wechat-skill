import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { createImageUploadApiPlugin } from "./server/imageUploadApi";

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
  const rootEnv = loadEnv(mode, process.cwd(), "");
  const appEnv = loadEnv(mode, dirname, "");

  return {
    plugins: [react(), createImageUploadApiPlugin({ ...rootEnv, ...appEnv })],
    resolve: {
      alias: {
        "@md2wechat/core": path.resolve(dirname, "../../packages/core/src/index.ts")
      }
    }
  };
});
