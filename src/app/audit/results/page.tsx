import type { Metadata } from "next";

import { AuditResults } from "@/features/audit/components/audit-results";

export const metadata: Metadata = {
  title: "Kết quả đối soát | CHUẨN HÓA SỐ",
};

export default function AuditResultsPage() {
  return <AuditResults />;
}
