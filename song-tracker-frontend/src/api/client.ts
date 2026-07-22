export async function apiClient(
  endpoint: string,
  options?: RequestInit
) {
  const token = localStorage.getItem("jwt");
  return await fetch(`/api${endpoint}`, {
    ...options,
    headers: {
      // biome-ignore lint/style/useNamingConvention: Authorization is capitalised
      Authorization: `Bearer ${token}`,
      ...options?.headers,
    },
  });
}