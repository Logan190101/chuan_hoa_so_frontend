import type { Metadata } from "next";

import { LoginScreen } from "@/features/auth/components/login-screen";

export const metadata: Metadata = {
  title: "Đăng nhập | CHUẨN HÓA SỐ",
};

export default function LoginPage() {
  return <LoginScreen />;
}
