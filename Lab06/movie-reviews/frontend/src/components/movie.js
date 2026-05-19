import React from "react";
import { Alert, Button, Card, Col, Row, Spinner } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import "moment/locale/vi";
import MovieDataService from "../services/movies";

moment.locale("vi");

const LOCAL_POSTERS = {
  "The Matrix": "/posters/matrix.jpg",
  Inception: "/posters/inception.jpg",
  "Spirited Away": "/posters/spirited-away.jpg",
  Parasite: "/posters/parasite.jpg",
  "Finding Nemo": "/posters/finding-nemo.jpg",
  Interstellar: "/posters/interstellar.jpg",
};

function formatDate(value) {
  if (!value) {
    return "Không rõ thời gian";
  }

  const date = moment(value);
  return date.isValid() ? date.format("Do MMMM YYYY") : "Không rõ thời gian";
}

function Poster({ movie }) {
  const [imageError, setImageError] = React.useState(false);
  const poster = LOCAL_POSTERS[movie.title] || movie.poster;

  if (poster && !imageError) {
    return (
      <div className="poster-shell detail-poster">
        <img
          src={poster}
          alt={movie.title}
          onError={() => setImageError(true)}
        />
      </div>
    );
  }

  return (
    <div className="poster-shell detail-poster">
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
      const response = await MovieDataService.get(id);
      setMovie(response.data);
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

  function deleteReview(reviewId, index) {
    const confirmed = window.confirm("Bạn có chắc muốn xóa review này?");
    if (!confirmed || !user) {
      return;
    }

    setBusyReviewId(reviewId);
    setError("");

    MovieDataService.deleteReview(reviewId, user.id)
      .then(() => {
        setMovie((previousMovie) => {
          if (!previousMovie) {
            return previousMovie;
          }

          const nextReviews = [...(previousMovie.reviews || [])];
          nextReviews.splice(index, 1);

          return {
            ...previousMovie,
            reviews: nextReviews,
          };
        });
      })
      .catch((requestError) => {
        setError(requestError.message);
      })
      .finally(() => {
        setBusyReviewId("");
      });
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
    <div className="movie-detail-page">
      <section className="movie-detail-hero">
        <Row className="g-4 g-xl-5 align-items-stretch">
          <Col lg={4} xl={3}>
            <div className="detail-poster-card">
              <Poster movie={movie} />
              <div className="detail-poster-caption">
                <span>{movie.rated || "Unrated"}</span>
                <strong>{movie.imdb?.rating ? `IMDb ${movie.imdb.rating}` : "IMDb N/A"}</strong>
              </div>
            </div>
          </Col>

          <Col lg={8} xl={9}>
            <div className="detail-copy-panel">
              <div className="detail-topline">
                <span className="eyebrow mb-0">Movie Detail</span>
                <span className="detail-review-count">
                  {movie.reviews?.length || 0} reviews
                </span>
              </div>

              <h1 className="detail-title">{movie.title}</h1>

              <div className="detail-fact-row">
                {movie.year ? <span>{movie.year}</span> : null}
                {movie.runtime ? <span>{movie.runtime} phút</span> : null}
                {movie.rated ? <span>{movie.rated}</span> : null}
                {movie.genres?.length ? <span>{movie.genres.slice(0, 2).join(" / ")}</span> : null}
              </div>

              <p className="detail-plot">
                {movie.plot || "Chưa có mô tả cho phim này. Bạn có thể xem thông tin cơ bản và thêm review ngay từ giao diện này."}
              </p>

              <div className="detail-action-row">
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
            </div>

            <div className="detail-stat-grid">
              <div className="detail-stat">
                <span>Năm phát hành</span>
                <strong>{movie.year || "Không rõ"}</strong>
              </div>
              <div className="detail-stat">
                <span>Thời lượng</span>
                <strong>{movie.runtime ? `${movie.runtime} phút` : "Không rõ"}</strong>
              </div>
              <div className="detail-stat">
                <span>Quốc gia</span>
                <strong>{movie.countries?.slice(0, 2).join(", ") || "Không rõ"}</strong>
              </div>
              <div className="detail-stat">
                <span>Phát hành</span>
                <strong>{formatDate(movie.released)}</strong>
              </div>
            </div>
          </Col>
        </Row>
      </section>

      <Row className="g-4">
        <Col lg={5}>
          <Card className="content-card detail-info-card border-0 h-100">
            <Card.Body className="p-4">
              <h2 className="detail-section-title">Thông tin phim</h2>
              <div className="detail-info-list">
                <div>
                  <span>Thể loại</span>
                  <strong>{movie.genres?.join(", ") || "Không rõ"}</strong>
                </div>
                <div>
                  <span>Quốc gia</span>
                  <strong>{movie.countries?.join(", ") || "Không rõ"}</strong>
                </div>
                <div>
                  <span>Đạo diễn</span>
                  <strong>{movie.directors?.join(", ") || "Không rõ"}</strong>
                </div>
                <div>
                  <span>Ngôn ngữ</span>
                  <strong>{movie.languages?.join(", ") || "Không rõ"}</strong>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={7}>
          <Card className="content-card detail-cast-card border-0 h-100">
            <Card.Body className="p-4">
              <h2 className="detail-section-title">Diễn viên</h2>
              <p className="detail-cast-copy mb-0">
                {movie.cast?.join(", ") || "Không rõ"}
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {error ? <Alert variant="danger">{error}</Alert> : null}

      <section className="detail-reviews-section">
        <div className="detail-section-heading">
          <div>
            <span className="eyebrow mb-2">Audience Notes</span>
            <h2 className="detail-section-title mb-0">Reviews</h2>
          </div>
          <span className="detail-review-count">
            {movie.reviews?.length || 0} đánh giá
          </span>
        </div>

        <div className="stack-gap">
          {movie.reviews?.length ? (
            movie.reviews.map((review, index) => (
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
                              state: { currentReview: review },
                            })
                          }
                        >
                          Sửa
                        </Button>
                        <Button
                          className="btn-accent"
                          disabled={busyReviewId === review._id}
                          onClick={() => deleteReview(review._id, index)}
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
      </section>
    </div>
  );
}
