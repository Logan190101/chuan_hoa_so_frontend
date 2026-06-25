import type { Metadata } from "next";

import { SettingsPage } from "@/features/settings/components/settings-page";

export const metadata: Metadata = {
  title: "Cài đặt | CHUẨN HÓA SỐ",
};

export default function Settings() {
  return <SettingsPage />;
}
