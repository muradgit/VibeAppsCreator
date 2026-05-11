const VERCEL_API_BASE = "https://api.vercel.com";

export async function vercelFetch(
  endpoint: string,
  token: string,
  options: RequestInit = {}
): Promise<any> {
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    ...(options.headers as any),
  };

  const response = await fetch(`${VERCEL_API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorBody = await response.json();
    console.error("Vercel API Error:", errorBody);
    throw new Error(errorBody.error?.message || "An error occurred with the Vercel API.");
  }

  return response.json();
}
