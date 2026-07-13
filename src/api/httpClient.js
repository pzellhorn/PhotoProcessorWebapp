const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export class ApiError extends Error {
  constructor(message, status, body) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

function buildUrl(path, query) {
  const url = new URL(path, API_BASE_URL);
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, value);
      }
    }
  }
  return url;
}

async function request(method, path, { query, body, formData } = {}) {
  const options = { method, headers: {} };

  if (formData) {
    options.body = formData;
  } else if (body !== undefined) {
    options.headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(body);
  }

  const response = await fetch(buildUrl(path, query), options);

  if (!response.ok) {
    const text = await response.text();
    throw new ApiError(
      `${method} ${path} failed (${response.status})`,
      response.status,
      text,
    );
  }

  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get("content-type") ?? "";
  return contentType.includes("application/json")
    ? response.json()
    : response.text();
}

export const httpClient = {
  get: (path, query) => request("GET", path, { query }),
  post: (path, body) => request("POST", path, { body }),
  postForm: (path, formData) => request("POST", path, { formData }),
  delete: (path, query) => request("DELETE", path, { query }),

  url: (path, query) => buildUrl(path, query).toString(),
};
