"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Button, IconButton } from "@/components/core/button";
import {
  BellIcon,
  CheckCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CircleUserIcon,
  ErrorIcon,
  PackageIcon,
  WarningIcon,
} from "@/components/core/icons";
import { AuditSidebar } from "@/features/audit/components/audit-sidebar";
import {
  getAuditRun,
  type AuditResultRow,
  type AuditResultStatus,
  type AuditRunResponse,
} from "@/features/audit/lib/audit-api";
import { cn } from "@/lib/cn";

const POLLING_INTERVAL_MS = 30_000;

const statusPresentation: Record<AuditResultStatus, { badge: string; label: string }> = {
  matched: { label: "Khớp 100%", badge: "bg-[#82f9be] text-[#005235]" },
  spec_mismatch: { label: "Lệch thông số", badge: "bg-[#ffddb3] text-[#624000]" },
  name_mismatch: { label: "Khác tên", badge: "bg-[#ffddb3] text-[#624000]" },
  name_spec_mismatch: { label: "Khác tên & thông số", badge: "bg-[#ffddb3] text-[#624000]" },
  check_only: { label: "Chỉ có ở kiểm tra", badge: "bg-[#ffdad6] text-[#93000a]" },
  master_only: { label: "Chỉ có ở Gốc", badge: "bg-[#dae2ff] text-[#0040a2]" },
};

function StatusBadge({ status }: { status: AuditResultStatus }) {
  const presentation = statusPresentation[status];
  return <span className={cn("inline-flex whitespace-nowrap rounded px-2 py-1 text-xs font-medium", presentation.badge)}>{presentation.label}</span>;
}

export function AuditResults() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestId = searchParams.get("requestId");
  const [auditRun, setAuditRun] = useState<AuditRunResponse | null>(null);
  const [error, setError] = useState<string | null>(requestId ? null : "Không tìm thấy mã phiên đối soát.");
  const [activeStatus, setActiveStatus] = useState<AuditResultStatus | undefined>();
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (!requestId) return;

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const poll = async () => {
      try {
        const nextAuditRun = await getAuditRun(requestId);
        if (cancelled) return;

        setAuditRun(nextAuditRun);
        if (nextAuditRun.status === "completed") {
          setShowSuccess(true);
          timer = setTimeout(() => setShowSuccess(false), 2_400);
          return;
        }
        if (nextAuditRun.status === "failed") {
          setError(nextAuditRun.message ?? "Quá trình đối soát không thành công.");
          return;
        }

        timer = setTimeout(poll, POLLING_INTERVAL_MS);
      } catch (caughtError) {
        if (!cancelled) {
          setError(caughtError instanceof Error ? caughtError.message : "Không thể lấy kết quả đối soát.");
        }
      }
    };

    void poll();
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [requestId]);

  const results = useMemo(() => auditRun?.results ?? [], [auditRun]);
  const summary = auditRun?.summary ?? {
    totalItems: results.length,
    matchedItems: results.filter((result) => result.status === "matched").length,
    mismatchItems: results.filter((result) => result.status !== "matched").length,
  };
  const displayedResults = useMemo(
    () => activeStatus ? results.filter((result) => result.status === activeStatus) : results,
    [activeStatus, results],
  );
  const filters = [
    { label: `Tất cả (${results.length})` },
    { label: `Khớp 100% (${results.filter((result) => result.status === "matched").length})`, status: "matched" as const },
    { label: `Lệch thông số (${results.filter((result) => result.status === "spec_mismatch").length})`, status: "spec_mismatch" as const },
    { label: `Khác tên (${results.filter((result) => result.status === "name_mismatch").length})`, status: "name_mismatch" as const },
    { label: `Khác tên & thông số (${results.filter((result) => result.status === "name_spec_mismatch").length})`, status: "name_spec_mismatch" as const },
    { label: `Chỉ có ở kiểm tra (${results.filter((result) => result.status === "check_only").length})`, status: "check_only" as const },
    { label: `Chỉ có ở Gốc (${results.filter((result) => result.status === "master_only").length})`, status: "master_only" as const },
  ];

  const isWaiting = !error && auditRun?.status !== "completed";

  return (
    <div className="flex min-h-screen bg-[#f8f9fb] text-[#191c1e]">
      <AuditSidebar activeItem="history" />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between border-b border-[#c3c6d6] bg-white px-4 shadow-sm sm:px-6">
          <div>
            <p className="text-lg font-semibold text-[#003d9b] md:hidden">CHUẨN HÓA SỐ</p>
            <h1 className="hidden text-xl font-semibold md:block">Kết quả đối soát</h1>
          </div>
          <div className="flex items-center gap-1">
            <IconButton aria-label="Thông báo" className="relative"><BellIcon /><span className="absolute right-2 top-2 size-1.5 rounded-full bg-[#ba1a1a]" /></IconButton>
            <IconButton aria-label="Tài khoản"><CircleUserIcon /></IconButton>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6">
          <div className="mx-auto max-w-7xl">
            <div className="mb-6">
              <p className="mb-1 text-sm text-[#434654]">Mã phiên: {requestId ?? "—"}</p>
              <h2 className="text-2xl font-semibold tracking-[-0.01em] sm:text-3xl">Báo cáo kết quả kiểm tra thiết bị</h2>
            </div>

            <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Tổng quan kết quả">
              <KpiCard accent="border-t-[#003d9b]" icon={<PackageIcon className="text-[#003d9b]" />} label="Tổng số sản phẩm" value={String(summary.totalItems)} />
              <KpiCard accent="border-t-[#006c47]" detail={summary.totalItems ? `${Math.round(summary.matchedItems / summary.totalItems * 100)}% tổng số` : undefined} detailClass="text-[#006c47]" icon={<CheckCircleIcon className="text-[#006c47]" />} label="Khớp 100%" value={String(summary.matchedItems)} />
              <KpiCard accent="border-t-[#ffb950]" icon={<WarningIcon className="text-[#9a5d00]" />} label="Khác biệt" value={String(summary.mismatchItems)} />
              <KpiCard accent="border-t-[#ba1a1a]" icon={<ErrorIcon className="text-[#ba1a1a]" />} label="Cần rà soát" value={String(summary.mismatchItems)} />
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
                  <thead className="border-b border-[#c3c6d6] bg-[#f3f4f6] text-xs font-semibold text-[#434654]"><tr><th className="px-4 py-3">Tên thiết bị</th><th className="px-4 py-3">Thông số gốc</th><th className="px-4 py-3">Thông số kiểm tra</th><th className="px-4 py-3">Điểm khác biệt</th><th className="px-4 py-3">Kết luận AI</th></tr></thead>
                  <tbody className="divide-y divide-[#c3c6d6]">
                    {displayedResults.map((result) => <ResultRow key={result.id} result={result} />)}
                    {!isWaiting && displayedResults.length === 0 && <tr><td className="px-4 py-12 text-center text-[#434654]" colSpan={5}>Không có kết quả thuộc nhóm này.</td></tr>}
                  </tbody>
                </table>
              </div>
              <div className="flex items-center justify-between border-t border-[#c3c6d6] px-4 py-3 text-sm text-[#434654]"><span>Hiển thị {displayedResults.length} trên {results.length}</span><div className="flex gap-1"><IconButton aria-label="Trang trước" disabled><ChevronLeftIcon /></IconButton><IconButton aria-label="Trang sau" disabled><ChevronRightIcon /></IconButton></div></div>
            </section>
          </div>
        </main>
      </div>

      {isWaiting && <ProcessingModal status={auditRun?.status} />}
      {showSuccess && <SuccessNotice />}
      {error && <FailureModal message={error} onBack={() => router.replace("/audit")} />}
    </div>
  );
}

function ProcessingModal({ status }: { status?: AuditRunResponse["status"] }) {
  const queued = status === "queued" || !status;
  return <div aria-live="polite" className="fixed inset-0 z-50 grid place-items-center bg-[#001a41]/45 p-4"><section aria-label="Đang đối soát" className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-2xl"><div className="mx-auto grid size-20 place-items-center rounded-full bg-[#eaf0ff]"><span className="size-10 animate-spin rounded-full border-4 border-[#0c56d0] border-r-transparent" /></div><h2 className="mt-6 text-xl font-bold">{queued ? "Đang chờ đối soát" : "Đang đối soát dữ liệu"}</h2><p className="mt-3 text-sm leading-6 text-[#434654]">{queued ? "Yêu cầu đã được tiếp nhận và đang chờ hệ thống xử lý." : "Hệ thống đang so sánh dữ liệu. Trang này sẽ tự cập nhật sau mỗi 30 giây."}</p><div className="mt-6 h-1.5 overflow-hidden rounded-full bg-[#e1e2e4]"><div className="h-full w-1/2 animate-pulse rounded-full bg-[#0c56d0]" /></div></section></div>;
}

function SuccessNotice() {
  return <div aria-live="polite" className="fixed inset-x-4 top-5 z-50 mx-auto flex max-w-md items-center gap-3 rounded-xl bg-[#006c47] px-4 py-3 text-sm font-semibold text-white shadow-xl"><CheckCircleIcon className="shrink-0" />Đối soát hoàn tất. Kết quả đã sẵn sàng.</div>;
}

function FailureModal({ message, onBack }: { message: string; onBack: () => void }) {
  return <div className="fixed inset-0 z-50 grid place-items-center bg-[#001a41]/45 p-4"><section aria-modal="true" className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-2xl" role="dialog"><div className="mx-auto grid size-16 place-items-center rounded-full bg-[#ffdad6]"><ErrorIcon className="text-[#ba1a1a]" /></div><h2 className="mt-5 text-xl font-bold">Đối soát không thành công</h2><p className="mt-3 text-sm leading-6 text-[#434654]">{message}</p><Button className="mt-6 w-full" onClick={onBack}>Quay lại đối soát</Button></section></div>;
}

function KpiCard({ accent, detail, detailClass, icon, label, value }: { accent: string; detail?: string; detailClass?: string; icon: ReactNode; label: string; value: string }) {
  return <article className={cn("rounded-lg border border-[#c3c6d6] border-t-2 bg-white p-6 shadow-sm", accent)}><div className="mb-2 flex items-start justify-between"><span className="text-xs font-semibold uppercase tracking-[0.04em] text-[#434654]">{label}</span>{icon}</div><p className="text-3xl font-bold tracking-[-0.02em]">{value}</p>{detail && <p className={cn("mt-1 text-xs", detailClass)}>{detail}</p>}</article>;
}

function ResultRow({ result }: { result: AuditResultRow }) {
  const isDifference = result.status !== "matched";
  return <tr className="transition hover:bg-[#eaf0ff]/40"><td className="px-4 py-3 font-semibold">{result.deviceName}</td><td className="px-4 py-3 text-[#434654]">{result.masterSpec ?? "—"}</td><td className="px-4 py-3 text-[#434654]">{result.checkedSpec ?? "—"}</td><td className={cn("px-4 py-3 font-medium", isDifference ? "text-[#ba1a1a]" : "text-[#434654]")}>{result.difference ?? "—"}</td><td className="px-4 py-3"><div className="mb-1 text-xs text-[#434654]">{result.conclusion ?? ""}</div><StatusBadge status={result.status} /></td></tr>;
}
