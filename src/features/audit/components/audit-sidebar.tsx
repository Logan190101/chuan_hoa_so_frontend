import {
  DatabaseIcon,
  HelpIcon,
  HistoryIcon,
  HomeIcon,
  SettingsIcon,
} from "@/components/core/icons";

const navigation = [
  { icon: HomeIcon, label: "Audit Workspace", id: "workspace" },
  { icon: DatabaseIcon, label: "Master Data Management", id: "master-data" },
  { icon: HistoryIcon, label: "History", id: "history" },
  { icon: SettingsIcon, label: "Settings", id: "settings" },
];

type AuditSidebarProps = {
  activeItem?: "workspace" | "master-data" | "history" | "settings";
};

export function AuditSidebar({ activeItem = "workspace" }: AuditSidebarProps) {
  return (
    <aside className="hidden h-full w-[260px] shrink-0 flex-col gap-2 border-r border-[#c3c6d6] bg-[#f3f4f6] py-4 md:flex">
      <div className="px-6 pb-6 pt-2">
        <p className="truncate text-2xl font-semibold tracking-[-0.01em] text-[#003d9b]">CHUẨN HÓA SỐ</p>
        <p className="mt-1 text-xs uppercase tracking-[0.12em] text-[#434654]">Industrial Auditing</p>
      </div>
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3" aria-label="Điều hướng chính">
        {navigation.map(({ icon: Icon, id, label }) => {
          const isActive = id === activeItem;

          return (
          <button
            className={isActive
              ? "flex items-center gap-3 rounded-r px-3 py-3 text-left text-xs font-semibold text-[#00734c] ring-1 ring-inset ring-[#82f9be]"
              : "ml-1 flex items-center gap-3 rounded px-3 py-3 text-left text-xs font-semibold text-[#434654] transition hover:bg-[#e7e8ea] hover:text-[#191c1e]"}
            key={label}
            type="button"
          >
            <Icon className="size-5" />
            {label}
          </button>
          );
        })}
      </nav>
      <div className="border-t border-[#c3c6d6]/50 px-3 pt-4">
        <button className="ml-1 flex w-full items-center gap-3 rounded px-3 py-3 text-left text-xs font-semibold text-[#434654] transition hover:bg-[#e7e8ea] hover:text-[#191c1e]" type="button">
          <HelpIcon className="size-5" />
          Help Center
        </button>
      </div>
    </aside>
  );
}
