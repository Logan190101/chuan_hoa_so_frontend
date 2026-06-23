"use client";

import { useRef, useState, type ChangeEvent, type DragEvent } from "react";

import { Button, IconButton } from "@/components/core/button";
import {
  BellIcon,
  CheckCircleIcon,
  CircleUserIcon,
  DatabaseIcon,
  ErrorIcon,
  FileIcon,
  FilterIcon,
  RefreshIcon,
  SearchIcon,
  UploadIcon,
  WarningIcon,
} from "@/components/core/icons";
import { Select } from "@/components/core/select";
import { AuditSidebar } from "@/features/audit/components/audit-sidebar";
import { cn } from "@/lib/cn";

type SyncMode = "upsert" | "overwrite";

const updateHistory = [
  { date: "Hôm nay, 14:30", domain: "Giáo dục", user: "Admin System", initials: "AD", state: "success" as const },
  { date: "Hôm qua, 09:15", domain: "Giáo dục", user: "Hoang Nguyen", initials: "HN", state: "success" as const },
  { date: "20/10/2023, 16:45", domain: "Giáo dục", user: "Admin System", initials: "AD", state: "error" as const },
  { date: "18/10/2023, 10:00", domain: "Giáo dục", user: "Tran Minh", initials: "TM", state: "success" as const },
];

export function MasterDataManagement() {
  const [domain, setDomain] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [syncMode, setSyncMode] = useState<SyncMode>("upsert");
  const inputRef = useRef<HTMLInputElement>(null);

  function setSelectedFile(nextFile: File | undefined) {
    if (!nextFile) return;
    const extension = `.${nextFile.name.split(".").pop()?.toLowerCase()}`;
    if ([".csv", ".xlsx", ".xls"].includes(extension)) setFile(nextFile);
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setSelectedFile(event.dataTransfer.files[0]);
  }

  function handleFileInput(event: ChangeEvent<HTMLInputElement>) {
    setSelectedFile(event.target.files?.[0]);
  }

  function resetForm() {
    setDomain("");
    setFile(null);
    setSyncMode("upsert");
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="flex min-h-screen bg-[#f8f9fb] text-[#191c1e]">
      <AuditSidebar activeItem="master-data" />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between border-b border-[#c3c6d6] bg-white px-4 shadow-sm sm:px-6">
          <h1 className="text-lg font-semibold text-[#003d9b] md:text-xl">Quản lý Dữ liệu gốc</h1>
          <div className="flex items-center gap-1 sm:gap-3">
            <label className="relative hidden sm:block"><SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#434654]" /><input className="h-9 w-64 rounded-lg bg-[#f3f4f6] py-2 pl-9 pr-3 text-sm outline-none ring-[#003d9b] placeholder:text-[#737685] focus:ring-2" placeholder="Tìm kiếm dữ liệu..." type="search" /></label>
            <IconButton aria-label="Thông báo"><BellIcon /></IconButton>
            <IconButton aria-label="Tài khoản"><CircleUserIcon /></IconButton>
          </div>
        </header>

        <main className="w-full flex-1 p-4 sm:p-6">
          <div className="mx-auto grid max-w-[1440px] grid-cols-12 gap-4">
            <section className="col-span-12 lg:col-span-7">
              <div className="relative overflow-hidden rounded-xl border border-[#c3c6d6] bg-white p-5 shadow-sm sm:p-6">
                <div className="absolute left-0 top-0 h-1 w-full bg-[#003d9b]" />
                <div className="flex items-center gap-2 border-b border-[#e1e2e4] pb-4"><UploadIcon className="text-[#003d9b]" /><h2 className="text-xl font-semibold">Tải lên Dữ liệu gốc</h2></div>
                <div className="mt-6 space-y-5">
                  <Select helperText="Bộ từ điển của lĩnh vực được dùng để chuẩn hóa dữ liệu nhập vào." id="master-domain" label="LĨNH VỰC" onChange={(event) => setDomain(event.target.value)} options={[{ label: "Giáo dục", value: "education" }]} placeholder="Chọn lĩnh vực cần cập nhật dữ liệu" value={domain} />

                  <div className="space-y-2"><p className="text-sm font-semibold text-[#434654]">TẬP TIN DỮ LIỆU (CSV, EXCEL)</p>
                    <div className={cn("flex min-h-56 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center transition", file ? "border-[#006c47] bg-[#f2fff7]" : "border-[#c3c6d6] bg-[#f3f4f6] hover:border-[#003d9b] hover:bg-[#deebff]")} onClick={() => inputRef.current?.click()} onDragOver={(event) => event.preventDefault()} onDrop={handleDrop} role="button" tabIndex={0} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") inputRef.current?.click(); }}>
                      <div className="mb-4 rounded-full bg-white p-4 shadow-sm"><FileIcon className="size-9 text-[#003d9b]" /></div>
                      {file ? <><p className="text-base font-semibold">{file.name}</p><button className="mt-2 text-sm font-semibold text-[#003d9b] hover:underline" onClick={(event) => { event.stopPropagation(); setFile(null); }} type="button">Chọn file khác</button></> : <><p className="text-base">Kéo thả file vào đây hoặc <span className="font-bold text-[#003d9b]">chọn file</span></p><p className="mt-1 text-sm text-[#434654]">Kích thước tối đa: 50MB. Hỗ trợ .csv, .xlsx, .xls</p></>}
                      <input accept=".csv,.xlsx,.xls" className="sr-only" onChange={handleFileInput} ref={inputRef} type="file" />
                    </div>
                  </div>

                  <fieldset><legend className="mb-3 text-sm font-semibold text-[#434654]">CƠ CHẾ CẬP NHẬT</legend><div className="grid gap-4 md:grid-cols-2"><SyncOption checked={syncMode === "upsert"} description="Thêm mới bản ghi chưa tồn tại và cập nhật bản ghi đã có." label="Cập nhật bổ sung (Upsert)" onChange={() => setSyncMode("upsert")} value="upsert" /><SyncOption checked={syncMode === "overwrite"} description="Xóa sạch dữ liệu cũ của lĩnh vực và thay thế hoàn toàn bằng file mới." label="Ghi đè (Overwrite)" onChange={() => setSyncMode("overwrite")} value="overwrite" warning /></div></fieldset>

                  <div className="flex justify-end gap-3 pt-2"><Button onClick={resetForm} type="button" variant="ghost">Hủy bỏ</Button><Button disabled={!domain || !file} type="button"><RefreshIcon className="size-4" />Cập nhật hệ thống</Button></div>
                </div>
              </div>
            </section>

            <aside className="col-span-12 flex flex-col gap-4 lg:col-span-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2"><StatCard accent="bg-[#82f9be]" detail="+1 tháng này" icon={<span className="text-[#006c47]">↗</span>} label="LĨNH VỰC ĐÃ CHUẨN HÓA" value="1" /><StatCard accent="bg-[#ffb950]" detail="Sẵn sàng phân tích" label="TỔNG SỐ BẢN GHI" value="12.450" /></div>
              <section className="flex flex-1 flex-col overflow-hidden rounded-xl border border-[#c3c6d6] bg-white shadow-sm"><div className="flex items-center justify-between border-b border-[#c3c6d6] p-5"><div className="flex items-center gap-2"><DatabaseIcon className="text-[#003d9b]" /><h2 className="text-xl font-semibold">Lịch sử cập nhật gần đây</h2></div><IconButton aria-label="Lọc lịch sử"><FilterIcon /></IconButton></div><div className="overflow-x-auto"><table className="w-full min-w-[540px] text-left text-sm"><thead className="border-b border-[#c3c6d6] bg-[#f3f4f6] text-xs font-semibold text-[#434654]"><tr><th className="px-5 py-3">Ngày & Giờ</th><th className="px-5 py-3">Người cập nhật</th><th className="px-5 py-3">Trạng thái</th></tr></thead><tbody className="divide-y divide-[#c3c6d6]">{updateHistory.map((item) => <tr className="transition hover:bg-[#eaf0ff]/40" key={`${item.date}-${item.user}`}><td className="px-5 py-4"><p className="font-semibold">{item.date}</p><p className="mt-1 text-xs text-[#434654]">{item.domain}</p></td><td className="px-5 py-4"><div className="flex items-center gap-2"><span className="inline-flex size-6 items-center justify-center rounded-full bg-[#003d9b] text-xs text-white">{item.initials}</span>{item.user}</div></td><td className="px-5 py-4"><HistoryState state={item.state} /></td></tr>)}</tbody></table></div><button className="mt-auto border-t border-[#c3c6d6] p-4 text-sm font-semibold text-[#003d9b] hover:underline" type="button">Xem tất cả lịch sử</button></section>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}

function SyncOption({ checked, description, label, onChange, value, warning = false }: { checked: boolean; description: string; label: string; onChange: () => void; value: SyncMode; warning?: boolean }) {
  return <label className={cn("flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition", checked ? warning ? "border-[#ba1a1a] bg-[#fff8f7]" : "border-[#003d9b] bg-[#f5f8ff]" : "border-[#c3c6d6] bg-white hover:border-[#003d9b]")}><input checked={checked} className="mt-1 size-4 accent-[#003d9b]" name="sync-mode" onChange={onChange} type="radio" value={value} /><span><span className="flex items-center gap-1 text-base font-bold">{warning && <WarningIcon className="size-4 text-[#ba1a1a]" />}{label}</span><span className="mt-1 block text-sm leading-5 text-[#434654]">{description}</span></span></label>;
}

function StatCard({ accent, detail, icon, label, value }: { accent: string; detail: string; icon?: React.ReactNode; label: string; value: string }) {
  return <article className="relative overflow-hidden rounded-xl border border-[#c3c6d6] bg-white p-5 shadow-sm"><span className={cn("absolute left-0 top-0 h-1 w-full", accent)} /><p className="text-xs font-semibold tracking-[0.04em] text-[#434654]">{label}</p><p className="mt-2 text-3xl font-bold tracking-[-0.02em]">{value}</p><p className="mt-2 flex items-center gap-1 text-sm text-[#434654]">{icon}{detail}</p></article>;
}

function HistoryState({ state }: { state: "success" | "error" }) {
  return state === "success" ? <span className="inline-flex items-center gap-1 rounded-full border border-[#65dca4] bg-[#82f9be] px-2.5 py-1 text-xs font-bold text-[#005235]"><CheckCircleIcon className="size-3.5" />Thành công</span> : <span className="inline-flex items-center gap-1 rounded-full border border-[#ba1a1a] bg-[#ffdad6] px-2.5 py-1 text-xs font-bold text-[#93000a]"><ErrorIcon className="size-3.5" />Lỗi định dạng</span>;
}
