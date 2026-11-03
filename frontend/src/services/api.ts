export class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

export const TOKEN_KEY = "bstudent_token";

export async function api<T>(path: string, options: { method?: string; body?: unknown } = {}): Promise<T> {
  const token = localStorage.getItem(TOKEN_KEY);
  const res = await fetch(`/api${path}`, {
    method: options.method ?? "GET",
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });
  const data = res.status === 204 ? null : await res.json().catch(() => null);
  if (!res.ok) throw new ApiError(data?.message ?? "Não foi possível concluir o pedido.", res.status);
  return data as T;
}
