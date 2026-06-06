import api from "../../../utils/api";

const toPositiveNumber = (value, fallback) => {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue) || numericValue <= 0) return fallback;
  return numericValue;
};

const normalizePaginatedResponse = (response, fallbackPage, fallbackLimit) => {
  const getLocalPagination = (allItems) => {
    const safeItems = Array.isArray(allItems) ? allItems : [];
    const total = safeItems.length;
    const page = Math.max(1, fallbackPage);
    const limit = Math.max(1, fallbackLimit);
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const normalizedPage = Math.min(page, totalPages);
    const startIndex = (normalizedPage - 1) * limit;
    const endIndex = startIndex + limit;

    return {
      items: safeItems.slice(startIndex, endIndex),
      pagination: {
        page: normalizedPage,
        limit,
        total,
        totalPages,
      },
    };
  };

  if (Array.isArray(response)) {
    return getLocalPagination(response);
  }

  const rawItems = Array.isArray(response?.items)
    ? response.items
    : Array.isArray(response?.data)
      ? response.data
      : [];

  const paginationSource = response?.pagination || response?.meta || response || {};
  const hasBackendPagination =
    Boolean(response?.pagination || response?.meta) ||
    "total" in paginationSource ||
    "totalItems" in paginationSource ||
    "totalPages" in paginationSource ||
    "currentPage" in paginationSource ||
    "pageSize" in paginationSource;

  if (!hasBackendPagination) {
    return getLocalPagination(rawItems);
  }

  const items = rawItems;
  const page = toPositiveNumber(
    paginationSource.page ?? paginationSource.currentPage ?? fallbackPage,
    fallbackPage,
  );
  const limit = toPositiveNumber(
    paginationSource.limit ?? paginationSource.pageSize ?? fallbackLimit,
    fallbackLimit,
  );
  const total = toPositiveNumber(
    paginationSource.total ?? paginationSource.totalItems ?? items.length,
    items.length,
  );
  const totalPages = toPositiveNumber(
    paginationSource.totalPages ?? Math.ceil(total / limit),
    Math.max(1, Math.ceil(total / limit)),
  );

  return {
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
  };
};

export const fetchRequests = async (filters = {}) => {
  const fallbackPage = toPositiveNumber(filters.page, 1);
  const fallbackLimit = toPositiveNumber(filters.limit, 15);
  const { userId, ...backendFilters } = filters;

  const { data } = await api.get("/requests", {
    params: {
      ...backendFilters,
      page: fallbackPage,
      limit: fallbackLimit,
      v: 2,
    },
  });
  return normalizePaginatedResponse(data, fallbackPage, fallbackLimit);
};

export const createRequest = async (payload) => {
  const { data } = await api.post("/requests", payload);
  return data;
};

export const updateRequest = async ({ id, payload }) => {
  const { data } = await api.put(`/requests/${id}`, payload);
  return data;
};

export const deleteRequest = async (id) => {
  await api.delete(`/requests/${id}`);
};

export const reassignRequest = async ({ requestId, assignedToUserId }) => {
  const { data } = await api.post(`/requests/${requestId}/reassign`, { assignedToUserId });
  return data;
};
