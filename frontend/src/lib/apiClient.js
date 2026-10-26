const API_BASE_URL = "http://localhost:8080";

async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include",
    ...options,
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json();
}
export function getCurrentUser() {
  return apiRequest("/current");
}

export default apiRequest;
