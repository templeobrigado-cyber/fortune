import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "人生の転機 × 吉方位診断 | 九星気学",
  description: "生年月日と居住地から、人生の転機と開運方位を診断。仕事・独立・転職・人間関係の意思決定をサポートします。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="h-full">
      <body className="min-h-full flex flex-col" style={{ backgroundColor: "#0a0a0f", color: "#f0e8d8" }}>
        {children}
      </body>
    </html>
  );
}
