import { AuthBrand } from "@/features/auth/components/auth-brand";
import { LoginForm } from "@/features/auth/components/login-form";

export function LoginScreen() {
  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-[#f8f9fb] px-6 py-10">
      <div className="flex w-full max-w-[420px] flex-col gap-8">
        <AuthBrand />
        <LoginForm />
        <footer className="text-center text-xs text-[#737685]">
          <p>© 2026 CHUẨN HÓA SỐ. All rights reserved.</p>
          <p className="mt-1 opacity-70">Phiên bản 2.4.1 (Stable)</p>
        </footer>
      </div>
    </main>
  );
}
