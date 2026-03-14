import type { Metadata } from "next";
import type { ReactNode } from "react";
import "../src/styles.css";

export const metadata: Metadata = {
  title: "md2wechat",
  description: "Md2Wechat - 让微信公众号发布更加简单"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
