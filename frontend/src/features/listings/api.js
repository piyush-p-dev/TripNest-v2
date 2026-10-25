import apiRequest from "../../lib/apiClient";

export function getListings({ search = "", category = "all" } = {}) {
  const params = new URLSearchParams();

  if (search) params.set("search", search);
  if (category !== "all") params.set("category", category);

  const query = params.toString();

  return apiRequest(`/listings${query ? `?${query}` : ""}`);
}

export function getListing(id) {
  return apiRequest(`/listings/${id}`);
}
