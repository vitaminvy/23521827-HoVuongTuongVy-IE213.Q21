const API_BASE =
  process.env.REACT_APP_API_BASE?.trim() || "/api/v1/movies";

async function requestJson(path, options = {}) {
  const { headers, ...restOptions } = options;
  const response = await fetch(`${API_BASE}${path}`, {
    ...restOptions,
    headers: {
      "Content-Type": "application/json",
      ...(headers || {}),
    },
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const message = data?.error || "Request failed";
    throw new Error(message);
  }

  return data;
}

export default class MoviesDataService {
  static async getMovies({
    page = 0,
    moviesPerPage = 12,
    title = "",
    rated = "",
  } = {}) {
    const params = new URLSearchParams({
      page: page.toString(),
      moviesPerPage: moviesPerPage.toString(),
    });

    if (title) {
      params.set("title", title);
    }

    if (rated) {
      params.set("rated", rated);
    }

    return requestJson(`/?${params.toString()}`);
  }

  static async getRatings() {
    return requestJson("/ratings");
  }

  static async getMovieById(id) {
    return requestJson(`/id/${id}`);
  }

  static async addReview(data) {
    return requestJson("/review", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  static async updateReview(data) {
    return requestJson("/review", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  static async deleteReview(data) {
    return requestJson("/review", {
      method: "DELETE",
      body: JSON.stringify(data),
    });
  }
}
