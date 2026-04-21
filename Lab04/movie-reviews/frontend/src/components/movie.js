import React from "react";
import { Alert, Button, Card, Col, Row, Spinner } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import MoviesDataService from "../services/movies-data.service";

function formatDate(value) {
  if (!value) {
    return "Không rõ thời gian";
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Không rõ thời gian"
    : date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
}

function Poster({ movie }) {
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

export default function Movie({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [busyReviewId, setBusyReviewId] = React.useState("");

  const loadMovie = React.useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await MoviesDataService.getMovieById(id);
      setMovie(response);
    } catch (requestError) {
      setError(requestError.message);
      setMovie(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  React.useEffect(() => {
    loadMovie();
  }, [loadMovie]);

  async function handleDelete(reviewId) {
    const confirmed = window.confirm("Bạn có chắc muốn xóa review này?");
    if (!confirmed || !user) {
      return;
    }

    setBusyReviewId(reviewId);
    setError("");

    try {
      await MoviesDataService.deleteReview({
        review_id: reviewId,
        user_id: user.id,
      });
      await loadMovie();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusyReviewId("");
    }
  }

  if (loading) {
    return (
      <div className="section-hero text-center">
        <Spinner animation="border" />
        <p className="page-subtitle mb-0 mt-3">Đang tải chi tiết phim...</p>
      </div>
    );
  }

  if (error && !movie) {
    return (
      <Alert variant="danger">
        Không tải được chi tiết phim. Chi tiết lỗi: {error}
      </Alert>
    );
  }

  if (!movie) {
    return <Alert variant="warning">Không tìm thấy thông tin phim.</Alert>;
  }

  return (
    <div className="stack-gap">
      <section className="section-hero">
        <Row className="g-4 align-items-center">
          <Col lg={4}>
            <Poster movie={movie} />
          </Col>
          <Col lg={8}>
            <span className="eyebrow">Movie Detail</span>
            <h1 className="page-title">{movie.title}</h1>
            <p className="page-subtitle">
              {movie.plot || "Chưa có mô tả cho phim này. Bạn có thể xem thông tin cơ bản và thêm review ngay từ giao diện này."}
            </p>
            <div className="movie-meta mb-4">
              {movie.year ? <span className="movie-chip">Năm {movie.year}</span> : null}
              {movie.runtime ? (
                <span className="movie-chip">{movie.runtime} phút</span>
              ) : null}
              {movie.rated ? <span className="movie-chip">Rated {movie.rated}</span> : null}
              {movie.imdb?.rating ? (
                <span className="movie-chip">IMDb {movie.imdb.rating}</span>
              ) : null}
            </div>
            <div className="d-flex flex-wrap gap-2">
              <Button as={Link} to="/movies" className="btn-outline-soft">
                Quay lại danh sách
              </Button>
              {user ? (
                <Button
                  as={Link}
                  to={`/movies/${movie._id}/review`}
                  className="btn-accent"
                >
                  Thêm review
                </Button>
              ) : (
                <Button
                  as={Link}
                  to="/login"
                  state={{ from: `/movies/${movie._id}/review` }}
                  className="btn-accent"
                >
                  Đăng nhập để review
                </Button>
              )}
            </div>
          </Col>
        </Row>
      </section>

      <Card className="content-card border-0">
        <Card.Body className="p-4">
          <Row className="g-3">
            <Col md={6}>
              <h2 className="h5 mb-3">Thông tin thêm</h2>
              <p className="mb-2">
                <strong>Thể loại:</strong>{" "}
                {movie.genres?.join(", ") || "Không rõ"}
              </p>
              <p className="mb-2">
                <strong>Quốc gia:</strong>{" "}
                {movie.countries?.join(", ") || "Không rõ"}
              </p>
              <p className="mb-0">
                <strong>Phát hành:</strong> {formatDate(movie.released)}
              </p>
            </Col>
            <Col md={6}>
              <h2 className="h5 mb-3">Diễn viên</h2>
              <p className="mb-0">{movie.cast?.join(", ") || "Không rõ"}</p>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {error ? <Alert variant="danger">{error}</Alert> : null}

      <div>
        <div className="d-flex justify-content-between align-items-center gap-3 mb-3">
          <h2 className="h4 mb-0">Reviews</h2>
          <span className="muted-text">
            {movie.reviews?.length || 0} đánh giá
          </span>
        </div>

        <div className="stack-gap">
          {movie.reviews?.length ? (
            movie.reviews.map((review) => (
              <Card key={review._id} className="review-card border-0">
                <Card.Body className="p-4">
                  <div className="review-header">
                    <div>
                      <h3 className="h5 mb-1">{review.name || "Ẩn danh"}</h3>
                      <div className="review-byline">
                        User ID: {review.user_id || "N/A"} • {formatDate(review.date)}
                      </div>
                    </div>
                    {user?.id === review.user_id ? (
                      <div className="d-flex gap-2">
                        <Button
                          className="btn-outline-soft"
                          onClick={() =>
                            navigate(`/movies/${movie._id}/review`, {
                              state: { review },
                            })
                          }
                        >
                          Sửa
                        </Button>
                        <Button
                          className="btn-accent"
                          disabled={busyReviewId === review._id}
                          onClick={() => handleDelete(review._id)}
                        >
                          {busyReviewId === review._id ? "Đang xóa..." : "Xóa"}
                        </Button>
                      </div>
                    ) : null}
                  </div>
                  <p className="mb-0 mt-3">{review.text || "Review rỗng."}</p>
                </Card.Body>
              </Card>
            ))
          ) : (
            <Alert variant="secondary" className="mb-0">
              Phim này chưa có review nào.
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}
