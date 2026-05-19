import axios from "axios";

const API_BASE =
  process.env.REACT_APP_API_BASE?.trim() ||
  "http://localhost:3000/api/v1/movies";

class MovieDataService {
  getAll(page = 0, moviesPerPage = 12) {
    return axios.get(`${API_BASE}?page=${page}&moviesPerPage=${moviesPerPage}`);
  }

  get(id) {
    return axios.get(`${API_BASE}/id/${id}`);
  }

  find(query, by = "title", page = 0, moviesPerPage = 12) {
    const params = new URLSearchParams({
      [by]: query,
      page: page.toString(),
      moviesPerPage: moviesPerPage.toString(),
    });

    return axios.get(`${API_BASE}?${params.toString()}`);
  }

  createReview(data) {
    return axios.post(`${API_BASE}/review`, data);
  }

  updateReview(data) {
    return axios.put(`${API_BASE}/review`, data);
  }

  deleteReview(id, userId) {
    return axios.delete(`${API_BASE}/review`, {
      data: {
        review_id: id,
        user_id: userId,
      },
    });
  }

  getRatings() {
    return axios.get(`${API_BASE}/ratings`);
  }
}

const movieDataService = new MovieDataService();

export default movieDataService;
