export const SESSION_EXPIRED_EVENT = "auth:session-expired";

export async function apiClient(endpoint: string, options?: RequestInit) {
  const token = localStorage.getItem("jwt");
  const response = await fetch(`/api${endpoint}`, {
    ...options,
    headers: {
      // biome-ignore lint/style/useNamingConvention: Authorization is capitalised
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });

  if (response.status === 401 && token) {
    window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
  }

  return response;
}