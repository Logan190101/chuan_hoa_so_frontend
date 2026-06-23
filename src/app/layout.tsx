import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CHUẨN HÓA SỐ",
  description: "Hệ thống Quản lý Dữ liệu Công nghiệp",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
