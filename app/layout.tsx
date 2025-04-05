import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "聊天机器人",
  description: "基于SiliconFlow的聊天机器人",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
