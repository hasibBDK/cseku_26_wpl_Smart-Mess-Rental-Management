const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export async function authRequest(path, user, options = {}) {
  const token = await user.getIdToken();
  const response = await fetch(`${apiUrl}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || "Request failed.");
  return data;
}
