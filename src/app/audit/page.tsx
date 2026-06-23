import type { Metadata } from "next";

import { AuditWorkspace } from "@/features/audit/components/audit-workspace";

export const metadata: Metadata = {
  title: "Đối soát thiết bị | CHUẨN HÓA SỐ",
};

export default function AuditPage() {
  return <AuditWorkspace />;
}
