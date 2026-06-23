"use client";

import { useState } from "react";

import { Button, IconButton } from "@/components/core/button";
import { BellIcon, CircleUserIcon, InfoIcon, MenuIcon, PlayIcon } from "@/components/core/icons";
import { Select } from "@/components/core/select";
import { AuditSidebar } from "@/features/audit/components/audit-sidebar";
import { FileDropzone } from "@/features/audit/components/file-dropzone";

const domains = [{ label: "Giáo dục", value: "education" }];

export function AuditWorkspace() {
  const [domain, setDomain] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const canStartAudit = Boolean(domain && file);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#f8f9fb] text-[#191c1e]">
      <AuditSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-[#c3c6d6] bg-white px-4 shadow-sm sm:px-6">
          <div className="flex items-center gap-3">
            <IconButton aria-label="Mở menu" className="md:hidden"><MenuIcon /></IconButton>
            <div>
              <p className="text-lg font-semibold text-[#191c1e] md:hidden">CHUẨN HÓA SỐ</p>
              <h1 className="hidden text-xl font-semibold md:block">Không gian đối soát thiết bị</h1>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <IconButton aria-label="Thông báo"><BellIcon /></IconButton>
            <IconButton aria-label="Tài khoản"><CircleUserIcon /></IconButton>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="mx-auto flex max-w-5xl flex-col gap-6">
            <div>
              <h2 className="text-2xl font-bold tracking-[-0.02em] md:hidden">Không gian đối soát thiết bị</h2>
              <p className="mt-2 text-sm leading-6 text-[#434654] sm:text-base">
                Tải lên danh sách thiết bị để hệ thống tự động chuẩn hóa dữ liệu thông qua quy trình n8n.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
              <section className="lg:col-span-4">
                <div className="h-full rounded-xl border border-[#c3c6d6]/60 bg-white p-6 shadow-[0_2px_4px_rgba(9,30,66,0.08)]">
                  <h2 className="text-xl font-semibold">Cấu hình đối soát</h2>
                  <div className="mt-6 space-y-4">
                    <Select
                      helperText="Hệ thống sẽ áp dụng bộ từ điển tương ứng để tăng độ chính xác."
                      id="domain-select"
                      label="Chọn lĩnh vực"
                      onChange={(event) => { setDomain(event.target.value); setFile(null); }}
                      options={domains}
                      placeholder="Chọn lĩnh vực..."
                      value={domain}
                    />
                    <hr className="border-[#c3c6d6]/50" />
                    <div className="pt-3">
                      <Button className="w-full" disabled={!canStartAudit} type="button">
                        <PlayIcon />
                        Bắt đầu đối soát
                      </Button>
                      <p className="mt-3 flex items-start justify-center gap-1.5 text-center text-xs leading-5 text-[#434654]">
                        <InfoIcon className="mt-0.5 size-3.5 shrink-0" />
                        Yêu cầu chọn lĩnh vực và tải file trước khi bắt đầu.
                      </p>
                    </div>
                  </div>
                </div>
              </section>
              <section className="lg:col-span-8">
                <FileDropzone disabled={!domain} file={file} onFileChange={setFile} />
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
