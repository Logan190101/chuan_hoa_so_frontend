"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/core/button";
import { EyeIcon, EyeOffIcon, LockIcon, ArrowRightIcon, UserIcon } from "@/components/core/icons";
import { Input } from "@/components/core/input";
import { login } from "@/features/auth/lib/login";
import { saveAuthSession } from "@/features/auth/lib/auth-session";

export function LoginForm() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    setIsSubmitting(true);

    try {
      const session = await login(email, password);
      saveAuthSession(session.token, session.user);
      router.replace("/audit");
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Đăng nhập không thành công.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="rounded-xl border border-[#c3c6d6] bg-white p-6 shadow-[0_2px_4px_rgba(9,30,66,0.08)] sm:p-8">
      <form className="space-y-6" onSubmit={handleSubmit}>
        <Input
          autoComplete="email"
          className={error ? "border-[#ba1a1a]" : undefined}
          id="email"
          label="Email"
          name="email"
          placeholder="Nhập email"
          required
          startAdornment={<UserIcon className="size-5" />}
          type="email"
        />

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-4">
            <label
              className="text-xs font-semibold uppercase tracking-[0.08em] text-[#191c1e]"
              htmlFor="password"
            >
              Mật khẩu
            </label>
            <a
              className="text-xs font-semibold uppercase tracking-[0.05em] text-[#003d9b] transition hover:text-[#0040a2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#003d9b]/30"
              href="/forgot-password"
            >
              Quên mật khẩu?
            </a>
          </div>
          <Input
            autoComplete="current-password"
            id="password"
            name="password"
            placeholder="Nhập mật khẩu"
            required
            startAdornment={<LockIcon className="size-5" />}
            type={isPasswordVisible ? "text" : "password"}
            endAdornment={
              <button
                aria-label={isPasswordVisible ? "Ẩn mật khẩu" : "Hiển thị mật khẩu"}
                className="rounded p-1.5 text-[#737685] transition hover:bg-[#eaf0ff] hover:text-[#003d9b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#003d9b]/30"
                onClick={() => setIsPasswordVisible((value) => !value)}
                type="button"
              >
                {isPasswordVisible ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            }
          />
        </div>

        {error && (
          <p aria-live="polite" className="-mt-2 text-sm text-[#ba1a1a]" role="alert">
            {error}
          </p>
        )}

        <Button className="mt-2 w-full" isLoading={isSubmitting} type="submit">
          {isSubmitting ? "Đang đăng nhập" : "Đăng nhập"}
          <ArrowRightIcon />
        </Button>
      </form>
    </section>
  );
}
