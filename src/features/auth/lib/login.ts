import type { AuthenticatedUser } from "./auth-session";

type LoginResponse = {
  token: string;
  user: AuthenticatedUser;
};

type ApiErrorResponse = {
  error?: string;
};

const apiBaseUrl = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001").replace(/\/$/, "");

export async function login(email: string, password: string): Promise<LoginResponse> {
  let response: Response;

  try {
    response = await fetch(`${apiBaseUrl}/api/v1/auth/login`, {
      body: JSON.stringify({ email, password }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });
  } catch {
    throw new Error("Không thể kết nối đến máy chủ. Vui lòng thử lại.");
  }

  const payload = (await response.json().catch(() => null)) as LoginResponse | ApiErrorResponse | null;

  if (!response.ok) {
    throw new Error(
      payload && "error" in payload && typeof payload.error === "string"
        ? payload.error
        : "Đăng nhập không thành công. Vui lòng thử lại.",
    );
  }

  if (!payload || !("token" in payload) || !("user" in payload)) {
    throw new Error("Phản hồi đăng nhập không hợp lệ. Vui lòng thử lại.");
  }

  return payload;
}
