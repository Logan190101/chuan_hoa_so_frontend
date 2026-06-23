import type { Metadata } from "next";

import { MasterDataManagement } from "@/features/master-data/components/master-data-management";

export const metadata: Metadata = {
  title: "Quản lý Dữ liệu gốc | CHUẨN HÓA SỐ",
};

export default function MasterDataPage() {
  return <MasterDataManagement />;
}
