"use client";

import { BellIcon, CircleUserIcon, SettingsIcon } from "@/components/core/icons";
import { IconButton } from "@/components/core/button";
import { AuditSidebar } from "@/features/audit/components/audit-sidebar";

const settings = [
  { label: "Ngôn ngữ giao diện", value: "Tiếng Việt" },
  { label: "Thông báo hệ thống", value: "Đang bật" },
  { label: "Tần suất kiểm tra kết quả", value: "30 giây" },
];

export function SettingsPage() {
  return (
    <div className="flex min-h-screen bg-[#f8f9fb] text-[#191c1e]">
      <AuditSidebar activeItem="settings" />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between border-b border-[#c3c6d6] bg-white px-4 shadow-sm sm:px-6">
          <h1 className="text-lg font-semibold text-[#003d9b] md:text-xl">Cài đặt</h1>
          <div className="flex items-center gap-1">
            <IconButton aria-label="Thông báo"><BellIcon /></IconButton>
            <IconButton aria-label="Tài khoản"><CircleUserIcon /></IconButton>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6">
          <div className="mx-auto max-w-4xl">
            <section className="rounded-lg border border-[#c3c6d6] bg-white shadow-sm">
              <div className="flex items-center gap-3 border-b border-[#c3c6d6] p-5">
                <SettingsIcon className="text-[#003d9b]" />
                <div>
                  <h2 className="text-xl font-semibold">Thiết lập hệ thống</h2>
                  <p className="mt-1 text-sm text-[#434654]">Quản lý các cấu hình chung của không gian đối soát.</p>
                </div>
              </div>
              <div className="divide-y divide-[#c3c6d6]">
                {settings.map((item) => (
                  <div className="flex flex-col gap-1 p-5 sm:flex-row sm:items-center sm:justify-between" key={item.label}>
                    <p className="font-semibold">{item.label}</p>
                    <p className="text-sm text-[#434654]">{item.value}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
