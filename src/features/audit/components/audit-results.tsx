"use client";

import { useMemo, useState } from "react";

import { Button, IconButton } from "@/components/core/button";
import {
  BellIcon,
  CheckCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CircleUserIcon,
  DownloadIcon,
  ErrorIcon,
  PackageIcon,
  WarningIcon,
} from "@/components/core/icons";
import { AuditSidebar } from "@/features/audit/components/audit-sidebar";
import { cn } from "@/lib/cn";

type AuditStatus = "matched" | "spec-mismatch" | "name-mismatch" | "master-only" | "not-found";

type AuditResult = {
  difference: string;
  id: string;
  masterSpec: string;
  name: string;
  status: AuditStatus;
  testedSpec: string;
};

const results: AuditResult[] = [
  {
    id: "1",
    name: "Bơm ly tâm trục ngang đa tầng cánh",
    masterSpec: "Q=50m³/h; H=120m; P=30kW",
    testedSpec: "Q=50m³/h; H=120m; P=30kW",
    difference: "—",
    status: "matched",
  },
  {
    id: "2",
    name: "Động cơ điện không đồng bộ 3 pha",
    masterSpec: "P=55kW; U=380V; IP55; Class F",
    testedSpec: "P=55kW; U=380V; IP55; Class B",
    difference: "Sai Cấp cách điện (Class)",
    status: "spec-mismatch",
  },
  {
    id: "3",
    name: "Van bướm điều khiển điện",
    masterSpec: "DN150; PN16; 220VAC; Inox 304",
    testedSpec: "DN150; PN16; 220VAC; Inox 304",
    difference: 'Tên kiểm tra: "Van bướm điện"',
    status: "name-mismatch",
  },
  {
    id: "4",
    name: "Bộ biến tần công nghiệp trung thế",
    masterSpec: "1000kW; 6kV; IP31",
    testedSpec: "Trống",
    difference: "Không có dữ liệu đối chiếu",
    status: "not-found",
  },
  {
    id: "5",
    name: "Cảm biến áp suất dải đo rộng",
    masterSpec: "0-100 bar; 4-20mA; 0.1% FS",
    testedSpec: "0-100 bar; 4-20mA; 0.5% FS",
    difference: "Sai độ chính xác (Accuracy)",
    status: "spec-mismatch",
  },
];

const filters: Array<{ label: string; status?: AuditStatus }> = [
  { label: "Tất cả (150)" },
  { label: "Khớp 100% (120)", status: "matched" },
  { label: "Lệch thông số (15)", status: "spec-mismatch" },
  { label: "Khác tên (5)", status: "name-mismatch" },
  { label: "Chỉ có ở Gốc (8)", status: "master-only" },
  { label: "Không tìm thấy (2)", status: "not-found" },
];

const statusPresentation: Record<AuditStatus, { badge: string; label: string }> = {
  matched: { label: "Khớp 100%", badge: "bg-[#82f9be] text-[#005235]" },
  "spec-mismatch": { label: "Lệch thông số", badge: "bg-[#ffddb3] text-[#624000]" },
  "name-mismatch": { label: "Khác tên", badge: "bg-[#ffddb3] text-[#624000]" },
  "master-only": { label: "Chỉ có ở Gốc", badge: "bg-[#dae2ff] text-[#0040a2]" },
  "not-found": { label: "Không tìm thấy", badge: "bg-[#ffdad6] text-[#93000a]" },
};

function StatusBadge({ status }: { status: AuditStatus }) {
  const presentation = statusPresentation[status];
  return <span className={cn("inline-flex whitespace-nowrap rounded px-2 py-1 text-xs font-medium", presentation.badge)}>{presentation.label}</span>;
}

export function AuditResults() {
  const [activeStatus, setActiveStatus] = useState<AuditStatus | undefined>();
  const displayedResults = useMemo(
    () => activeStatus ? results.filter((result) => result.status === activeStatus) : results,
    [activeStatus],
  );

  return (
    <div className="flex min-h-screen bg-[#f8f9fb] text-[#191c1e]">
      <AuditSidebar activeItem="history" />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between border-b border-[#c3c6d6] bg-white px-4 shadow-sm sm:px-6">
          <div>
            <p className="text-lg font-semibold text-[#003d9b] md:hidden">CHUẨN HÓA SỐ</p>
            <h1 className="hidden text-xl font-semibold md:block">Kết quả đối soát - Lô hàng #8821</h1>
          </div>
          <div className="flex items-center gap-1">
            <IconButton aria-label="Thông báo" className="relative"><BellIcon /><span className="absolute right-2 top-2 size-1.5 rounded-full bg-[#ba1a1a]" /></IconButton>
            <IconButton aria-label="Tài khoản"><CircleUserIcon /></IconButton>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6">
          <div className="mx-auto max-w-7xl">
            <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <p className="mb-1 text-sm text-[#434654]">Dự án: Nhiệt điện Thái Bình 2 / Trạm biến áp 500kV</p>
                <h2 className="text-2xl font-semibold tracking-[-0.01em] sm:text-3xl">Báo cáo kết quả kiểm tra thiết bị</h2>
              </div>
              <Button className="min-h-10 px-4 py-2 text-xs" type="button"><DownloadIcon className="size-4" />Tải file báo cáo (.xlsx)</Button>
            </div>

            <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Tổng quan kết quả">
              <KpiCard accent="border-t-[#003d9b]" icon={<PackageIcon className="text-[#003d9b]" />} label="Tổng số sản phẩm" value="150" />
              <KpiCard accent="border-t-[#006c47]" detail="80% tổng số" detailClass="text-[#006c47]" icon={<CheckCircleIcon className="text-[#006c47]" />} label="Khớp 100%" value="120" />
              <KpiCard accent="border-t-[#ffb950]" detail="10% tổng số" detailClass="text-[#9a5d00]" icon={<WarningIcon className="text-[#9a5d00]" />} label="Lệch thông số" value="15" />
              <KpiCard accent="border-t-[#ba1a1a]" detail="10% tổng số" detailClass="text-[#ba1a1a]" icon={<ErrorIcon className="text-[#ba1a1a]" />} label="Khác biệt/Không tìm thấy" value="15" />
            </section>

            <section className="overflow-hidden rounded-lg border border-[#c3c6d6] bg-white shadow-sm">
              <div className="overflow-x-auto border-b border-[#c3c6d6] px-2">
                <div className="flex min-w-max">
                  {filters.map((filter) => {
                    const isActive = filter.status === activeStatus;
                    return <button className={cn("border-b-2 px-4 py-3 text-xs font-semibold transition", isActive ? "border-[#003d9b] text-[#003d9b]" : "border-transparent text-[#434654] hover:bg-[#f3f4f6]")} key={filter.label} onClick={() => setActiveStatus(filter.status)} type="button">{filter.label}</button>;
                  })}
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[940px] border-collapse text-left text-sm">
                  <thead className="border-b border-[#c3c6d6] bg-[#f3f4f6] text-xs font-semibold text-[#434654]">
                    <tr><th className="px-4 py-3">Tên thiết bị</th><th className="px-4 py-3">Thông số gốc</th><th className="px-4 py-3">Thông số kiểm tra</th><th className="px-4 py-3">Điểm khác biệt</th><th className="px-4 py-3">Kết luận AI</th></tr>
                  </thead>
                  <tbody className="divide-y divide-[#c3c6d6]">
                    {displayedResults.map((result) => <ResultRow key={result.id} result={result} />)}
                    {displayedResults.length === 0 && <tr><td className="px-4 py-12 text-center text-[#434654]" colSpan={5}>Không có kết quả thuộc nhóm này trong dữ liệu mẫu.</td></tr>}
                  </tbody>
                </table>
              </div>
              <div className="flex flex-col gap-3 border-t border-[#c3c6d6] px-4 py-3 text-sm text-[#434654] sm:flex-row sm:items-center sm:justify-between">
                <span>Hiển thị 1-{displayedResults.length} trên {activeStatus ? displayedResults.length : 150}</span>
                <div className="flex items-center gap-1">
                  <IconButton aria-label="Trang trước" disabled><ChevronLeftIcon /></IconButton>
                  <button className="rounded bg-[#0052cc] px-3 py-1 text-xs font-semibold text-white" type="button">1</button>
                  <button className="rounded px-3 py-1 text-xs font-semibold hover:bg-[#f3f4f6]" type="button">2</button>
                  <button className="rounded px-3 py-1 text-xs font-semibold hover:bg-[#f3f4f6]" type="button">3</button>
                  <span className="px-1">…</span>
                  <IconButton aria-label="Trang sau"><ChevronRightIcon /></IconButton>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

function KpiCard({ accent, detail, detailClass, icon, label, value }: { accent: string; detail?: string; detailClass?: string; icon: React.ReactNode; label: string; value: string }) {
  return <article className={cn("rounded-lg border border-[#c3c6d6] border-t-2 bg-white p-6 shadow-sm", accent)}><div className="mb-2 flex items-start justify-between"><span className="text-xs font-semibold uppercase tracking-[0.04em] text-[#434654]">{label}</span>{icon}</div><p className="text-3xl font-bold tracking-[-0.02em]">{value}</p>{detail && <p className={cn("mt-1 text-xs", detailClass)}>{detail}</p>}</article>;
}

function ResultRow({ result }: { result: AuditResult }) {
  const isDifference = result.status !== "matched";
  return <tr className="transition hover:bg-[#eaf0ff]/40"><td className="px-4 py-3 font-semibold">{result.name}</td><td className="px-4 py-3 text-[#434654]">{result.masterSpec}</td><td className={cn("px-4 py-3", result.status === "not-found" ? "italic text-[#737685]" : "text-[#434654]")}>{result.testedSpec}</td><td className={cn("px-4 py-3 font-medium", isDifference ? "text-[#ba1a1a]" : "text-[#434654]")}>{result.difference}</td><td className="px-4 py-3"><StatusBadge status={result.status} /></td></tr>;
}
