export type AuditResultStatus =
  | "matched"
  | "spec_mismatch"
  | "name_mismatch"
  | "name_spec_mismatch"
  | "check_only"
  | "master_only";

export type AuditResultRow = {
  checkedSpec: string | null;
  conclusion: string | null;
  deviceName: string;
  difference: string | null;
  id: number;
  masterSpec: string | null;
  status: AuditResultStatus;
};

export type AuditRunStatus = "queued" | "processing" | "completed" | "failed";

export type AuditRunResponse = {
  message?: string | null;
  requestId: string;
  results?: AuditResultRow[];
  status: AuditRunStatus;
  summary?: {
    matchedItems: number;
    mismatchItems: number;
    totalItems: number;
  };
};

const apiBaseUrl = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001").replace(/\/$/, "");

async function getPayload(response: Response) {
  return response.json().catch(() => null) as Promise<{ error?: string } | null>;
}

export async function createAuditRun(input: { domain: string; fileUrl: string }) {
  let response: Response;

  try {
    response = await fetch(`${apiBaseUrl}/api/v1/audit-runs`, {
      body: JSON.stringify({ ...input, action: "/sosanh" }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });
  } catch {
    throw new Error("Không thể kết nối đến máy chủ. Vui lòng thử lại.");
  }

  const payload = await getPayload(response) as { requestId?: string; error?: string } | null;
  if (!response.ok || !payload?.requestId) {
    throw new Error(payload?.error ?? "Không thể khởi tạo phiên đối soát.");
  }

  return { requestId: payload.requestId };
}

export async function getAuditRun(requestId: string): Promise<AuditRunResponse> {
  let response: Response;

  try {
    response = await fetch(`${apiBaseUrl}/api/v1/audit-runs/${encodeURIComponent(requestId)}`, {
      cache: "no-store",
    });
  } catch {
    throw new Error("Không thể kết nối đến máy chủ để lấy kết quả.");
  }

  const payload = await getPayload(response) as AuditRunResponse | { error?: string } | null;
  if (!response.ok || !payload || !("status" in payload)) {
    throw new Error(payload && "error" in payload && payload.error ? payload.error : "Không thể lấy kết quả đối soát.");
  }

  return payload;
}
