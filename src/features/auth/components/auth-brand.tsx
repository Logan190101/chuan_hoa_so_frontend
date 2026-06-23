import { DatabaseIcon } from "@/components/core/icons";

export function AuthBrand() {
  return (
    <header className="flex flex-col items-center gap-4 text-center">
      <div className="flex size-16 items-center justify-center rounded-xl bg-[#0052cc] text-white shadow-sm">
        <DatabaseIcon className="size-8" strokeWidth={2.25} />
      </div>
      <div>
        <h1 className="text-2xl font-semibold tracking-[-0.01em] text-[#003d9b]">
          CHUẨN HÓA SỐ
        </h1>
        <p className="mt-1 text-sm text-[#434654]">
          Hệ thống Quản lý Dữ liệu Công nghiệp
        </p>
      </div>
    </header>
  );
}
