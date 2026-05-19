import React from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  Form,
  Placeholder,
  Row,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import MovieDataService from "../services/movies";

const ALL_RATINGS = "All Ratings";
const DEFAULT_ENTRIES_PER_PAGE = 12;
const SEARCH_MODES = {
  retrieveMovies: "retrieveMovies",
  findByTitle: "findByTitle",
  findByRating: "findByRating",
};
const LOCAL_POSTERS = {
  "The Matrix": "/posters/matrix.jpg",
  Inception: "/posters/inception.jpg",
  "Spirited Away": "/posters/spirited-away.jpg",
  Parasite: "/posters/parasite.jpg",
  "Finding Nemo": "/posters/finding-nemo.jpg",
  Interstellar: "/posters/interstellar.jpg",
};

function formatMovieFacts(movie) {
  return [
    movie.rated ? `Rated ${movie.rated}` : null,
    movie.runtime ? `${movie.runtime} min` : null,
    movie.year ? `${movie.year}` : null,
  ].filter(Boolean);
}

function MoviePoster({ movie }) {
  const [imageError, setImageError] = React.useState(false);
  const poster = LOCAL_POSTERS[movie.title] || movie.poster;

  if (poster && !imageError) {
    return (
      <div className="poster-shell">
        <img
          src={poster}
          alt={movie.title}
          onError={() => setImageError(true)}
        />
      </div>
    );
  }

  return (
    <div className="poster-shell">
      <div className="poster-fallback">{movie.title?.slice(0, 1) || "M"}</div>
    </div>
  );
}

export default function MoviesList({ user }) {
  const [movies, setMovies] = React.useState([]);
  const [ratings, setRatings] = React.useState([ALL_RATINGS]);
  const [title, setTitle] = React.useState("");
  const [rated, setRated] = React.useState(ALL_RATINGS);
  const [activeFilters, setActiveFilters] = React.useState({
    title: "",
    rated: "",
  });
  const [currentSearchMode, setCurrentSearchMode] = React.useState(
    SEARCH_MODES.retrieveMovies,
  );
  const [currentPage, setCurrentPage] = React.useState(0);
  const [entriesPerPage, setEntriesPerPage] = React.useState(DEFAULT_ENTRIES_PER_PAGE);
  const [totalResults, setTotalResults] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    async function loadRatings() {
      try {
        const ratingsResponse = await MovieDataService.getRatings();
        setRatings([ALL_RATINGS, ...ratingsResponse.data.filter(Boolean).sort()]);
      } catch (requestError) {
        setError(requestError.message);
      }
    }

    loadRatings();
  }, []);

  const retrieveNextPage = React.useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response =
        currentSearchMode === SEARCH_MODES.findByTitle && activeFilters.title
          ? await MovieDataService.find(activeFilters.title, "title", currentPage, entriesPerPage)
          : currentSearchMode === SEARCH_MODES.findByRating && activeFilters.rated
            ? await MovieDataService.find(activeFilters.rated, "rated", currentPage, entriesPerPage)
            : await MovieDataService.getAll(currentPage, entriesPerPage);

      setMovies(response.data.movies || []);
      setCurrentPage(response.data.page || 0);
      setEntriesPerPage(response.data.entries_per_page || DEFAULT_ENTRIES_PER_PAGE);
      setTotalResults(response.data.total_results || 0);
    } catch (requestError) {
      setMovies([]);
      setTotalResults(0);
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }, [activeFilters, currentPage, currentSearchMode, entriesPerPage]);

  React.useEffect(() => {
    setCurrentPage(0);
  }, [currentSearchMode]);

  React.useEffect(() => {
    retrieveNextPage();
  }, [retrieveNextPage]);

  function retrieveMovies() {
    setCurrentSearchMode(SEARCH_MODES.retrieveMovies);
    setCurrentPage(0);
    setActiveFilters({
      title: "",
      rated: "",
    });
  }

  function findByTitle(event) {
    event?.preventDefault();
    setCurrentSearchMode(SEARCH_MODES.findByTitle);
    setCurrentPage(0);
    setActiveFilters({
      title: title.trim(),
      rated: "",
    });
  }

  function findByRating() {
    setCurrentSearchMode(SEARCH_MODES.findByRating);
    setCurrentPage(0);
    setActiveFilters({
      title: "",
      rated: rated === ALL_RATINGS ? "" : rated,
    });
  }

  function clearFilters() {
    setTitle("");
    setRated(ALL_RATINGS);
    retrieveMovies();
  }

  const totalPages = Math.max(1, Math.ceil(totalResults / entriesPerPage));

  return (
    <div className="stack-gap">
      <section className="section-hero">
        <Row className="g-4 align-items-stretch">
          <Col lg={8}>
            <span className="eyebrow">Lab06 React Frontend</span>
            <h1 className="page-title">Khám phá phim, lọc nhanh và quản lý review trên cùng một giao diện.</h1>
            <p className="page-subtitle">
              Frontend Lab06 bổ sung thêm, sửa, xóa review từ giao diện React
              và phân trang danh sách phim khi lấy tất cả, tìm theo title hoặc
              lọc theo rating.
            </p>
            <div className="hero-points">
              <span className="info-pill">Search theo title</span>
              <span className="info-pill">Filter theo rating</span>
              <span className="info-pill">CRUD review</span>
            </div>
          </Col>
          <Col lg={4}>
            <div className="spotlight-panel">
              <div className="spotlight-label">Session</div>
              <div className="spotlight-value">
                {user ? user.name : "Chưa đăng nhập"}
              </div>
              <p className="spotlight-copy mb-0">
                {user
                  ? `User ID hiện tại: ${user.id}. Bạn có thể thêm, sửa và xóa review của mình.`
                  : "Bạn có thể duyệt phim trước, sau đó đăng nhập để thực hiện các thao tác review."}
              </p>
            </div>
          </Col>
        </Row>
      </section>

      <Card className="filter-card border-0">
        <Card.Body className="p-4">
          <Form onSubmit={findByTitle}>
            <Row className="g-3 align-items-end">
              <Col md={6}>
                <Form.Group controlId="searchTitle">
                  <Form.Label>Tìm theo tên phim</Form.Label>
                  <Form.Control
                    type="text"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="Nhập tiêu đề phim"
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group controlId="searchRating">
                  <Form.Label>Lọc theo rating</Form.Label>
                  <Form.Select
                    value={rated}
                    onChange={(event) => setRated(event.target.value)}
                  >
                    {ratings.map((rating) => (
                      <option key={rating} value={rating}>
                        {rating}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3} className="d-flex flex-wrap gap-2">
                <Button className="btn-accent flex-grow-1" type="submit">
                  Tìm title
                </Button>
                <Button
                  className="btn-accent flex-grow-1"
                  type="button"
                  onClick={findByRating}
                >
                  Tìm rating
                </Button>
                <Button
                  className="btn-outline-soft"
                  type="button"
                  onClick={clearFilters}
                >
                  Xóa lọc
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      {error ? <Alert variant="danger">{error}</Alert> : null}

      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
        <div className="muted-text">
          {loading
            ? "Đang tải danh sách phim..."
            : `Hiển thị ${movies.length} / ${totalResults} phim`}
        </div>
        <div className="muted-text">Trang {currentPage + 1} / {totalPages}</div>
      </div>

      <Row className="g-4">
        {loading
          ? Array.from({ length: 6 }).map((_, index) => (
              <Col lg={4} md={6} key={index}>
                <Card className="movie-card border-0 h-100 p-3">
                  <Placeholder as="div" animation="glow">
                    <Placeholder xs={12} style={{ height: "280px" }} />
                  </Placeholder>
                  <Card.Body className="px-0 pb-0">
                    <Placeholder as="div" animation="glow">
                      <Placeholder xs={8} />
                      <Placeholder xs={5} />
                      <Placeholder xs={12} />
                      <Placeholder xs={10} />
                    </Placeholder>
                  </Card.Body>
                </Card>
              </Col>
            ))
          : movies.map((movie) => (
              <Col lg={4} md={6} key={movie._id}>
                <Card className="movie-card border-0 h-100 overflow-hidden">
                  <MoviePoster movie={movie} />
                  <Card.Body className="p-4 d-flex flex-column">
                    <div className="movie-meta mb-3">
                      {formatMovieFacts(movie).map((fact) => (
                        <span key={fact} className="movie-chip">
                          {fact}
                        </span>
                      ))}
                    </div>
                    <Card.Title className="fs-4">{movie.title}</Card.Title>
                    <Card.Text className="muted-text flex-grow-1">
                      {movie.plot
                        ? `${movie.plot.slice(0, 160)}${movie.plot.length > 160 ? "..." : ""}`
                        : "Chưa có mô tả cho bộ phim này."}
                    </Card.Text>
                    <div className="d-flex justify-content-between align-items-center gap-3 mt-3">
                      <div className="muted-text small">
                        IMDb {movie.imdb?.rating || "N/A"}
                      </div>
                      <Button
                        as={Link}
                        to={`/movies/${movie._id}`}
                        className="btn-accent"
                      >
                        Xem chi tiết
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
      </Row>

      {!loading && movies.length === 0 ? (
        <Alert variant="warning">Không tìm thấy phim phù hợp với bộ lọc hiện tại.</Alert>
      ) : null}

      <div className="d-flex justify-content-center gap-3 pt-2">
        <Button
          className="btn-outline-soft"
          disabled={currentPage === 0 || loading}
          onClick={() => setCurrentPage((page) => Math.max(page - 1, 0))}
        >
          Trang trước
        </Button>
        <Button
          className="btn-accent"
          disabled={loading || currentPage + 1 >= totalPages}
          onClick={() =>
            setCurrentPage((page) =>
              page + 1 < totalPages ? page + 1 : page,
            )
          }
        >
          Trang sau
        </Button>
      </div>
    </div>
  );
}
