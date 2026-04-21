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
import MoviesDataService from "../services/movies-data.service";

const ALL_RATINGS = "All Ratings";
const MOVIES_PER_PAGE = 12;

function formatMovieFacts(movie) {
  return [
    movie.rated ? `Rated ${movie.rated}` : null,
    movie.runtime ? `${movie.runtime} min` : null,
    movie.year ? `${movie.year}` : null,
  ].filter(Boolean);
}

function MoviePoster({ movie }) {
  if (movie.poster) {
    return (
      <div className="poster-shell">
        <img src={movie.poster} alt={movie.title} />
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
  const [page, setPage] = React.useState(0);
  const [totalResults, setTotalResults] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    async function loadRatings() {
      try {
        const ratingsResponse = await MoviesDataService.getRatings();
        setRatings([ALL_RATINGS, ...ratingsResponse.filter(Boolean).sort()]);
      } catch (requestError) {
        setError(requestError.message);
      }
    }

    loadRatings();
  }, []);

  React.useEffect(() => {
    async function loadMovies() {
      setLoading(true);
      setError("");

      try {
        const response = await MoviesDataService.getMovies({
          page,
          moviesPerPage: MOVIES_PER_PAGE,
          title: activeFilters.title,
          rated: activeFilters.rated,
        });

        setMovies(response.movies || []);
        setTotalResults(response.total_results || 0);
      } catch (requestError) {
        setMovies([]);
        setTotalResults(0);
        setError(requestError.message);
      } finally {
        setLoading(false);
      }
    }

    loadMovies();
  }, [page, activeFilters]);

  function handleSearch(event) {
    event.preventDefault();
    setPage(0);
    setActiveFilters({
      title: title.trim(),
      rated: rated === ALL_RATINGS ? "" : rated,
    });
  }

  function clearFilters() {
    setTitle("");
    setRated(ALL_RATINGS);
    setPage(0);
    setActiveFilters({
      title: "",
      rated: "",
    });
  }

  const totalPages = Math.max(1, Math.ceil(totalResults / MOVIES_PER_PAGE));

  return (
    <div className="stack-gap">
      <section className="section-hero">
        <Row className="g-4 align-items-stretch">
          <Col lg={8}>
            <span className="eyebrow">React Frontend Workspace</span>
            <h1 className="page-title">Khám phá phim, lọc nhanh và quản lý review trên cùng một giao diện.</h1>
            <p className="page-subtitle">
              Frontend Lab04 kết nối trực tiếp với backend Movie Reviews để hiển thị
              danh sách phim, xem chi tiết, thêm đánh giá và chỉnh sửa review của
              người dùng đã đăng nhập.
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
          <Form onSubmit={handleSearch}>
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
              <Col md={3} className="d-flex gap-2">
                <Button className="btn-accent flex-grow-1" type="submit">
                  Tìm phim
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
        <div className="muted-text">Trang {page + 1} / {totalPages}</div>
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
          disabled={page === 0 || loading}
          onClick={() => setPage((currentPage) => Math.max(currentPage - 1, 0))}
        >
          Trang trước
        </Button>
        <Button
          className="btn-accent"
          disabled={loading || page + 1 >= totalPages}
          onClick={() =>
            setPage((currentPage) =>
              currentPage + 1 < totalPages ? currentPage + 1 : currentPage,
            )
          }
        >
          Trang sau
        </Button>
      </div>
    </div>
  );
}
