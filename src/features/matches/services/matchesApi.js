import api from "../../../utils/api";

const toPositiveNumber = (value, fallback) => {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue) || numericValue <= 0) return fallback;
  return numericValue;
};

const normalizePaginatedResponse = (response, fallbackPage, fallbackLimit) => {
  if (Array.isArray(response)) {
    const total = response.length;
    const page = Math.max(1, fallbackPage);
    const limit = Math.max(1, fallbackLimit);
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const normalizedPage = Math.min(page, totalPages);
    const startIndex = (normalizedPage - 1) * limit;

    return {
      items: response.slice(startIndex, startIndex + limit),
      pagination: {
        page: normalizedPage,
        limit,
        total,
        totalPages,
      },
      stats: null,
    };
  }

  const rawItems = Array.isArray(response?.items) ? response.items : [];
  const paginationSource = response?.pagination || {};
  const page = toPositiveNumber(paginationSource.page, fallbackPage);
  const limit = toPositiveNumber(paginationSource.limit, fallbackLimit);
  const total = toPositiveNumber(paginationSource.total, rawItems.length);
  const totalPages = toPositiveNumber(
    paginationSource.totalPages ?? paginationSource.pages ?? Math.ceil(total / limit),
    Math.max(1, Math.ceil(total / limit)),
  );

  return {
    items: rawItems,
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
    stats: response?.stats ?? null,
  };
};

export const fetchMatches = async (filters = {}) => {
  const fallbackPage = toPositiveNumber(filters.page, 1);
  const fallbackLimit = toPositiveNumber(filters.limit, 10);
  const params = {
    page: fallbackPage,
    limit: fallbackLimit,
    v: 2,
  };

  if (filters.status && filters.status !== "ALL") {
    params.status = filters.status;
  }

  const { data } = await api.get("/matches", { params });
  return normalizePaginatedResponse(data, fallbackPage, fallbackLimit);
};

export const patchMatchStatus = async ({ id, status }) => {
  const { data } = await api.patch(`/matches/${id}`, { status });
  return data;
};
