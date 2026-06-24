import type { Metadata } from "next";
import { Suspense } from "react";

import { AuditResults } from "@/features/audit/components/audit-results";

export const metadata: Metadata = {
  title: "Kết quả đối soát | CHUẨN HÓA SỐ",
};

export default function AuditResultsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f8f9fb]" />}>
      <AuditResults />
    </Suspense>
  );
}
