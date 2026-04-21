import React from "react";
import { Alert, Button, Card, Form } from "react-bootstrap";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import MoviesDataService from "../services/movies-data.service";

export default function AddReview({ user }) {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const editingReview = location.state?.review || null;

  const [review, setReview] = React.useState(editingReview?.text || "");
  const [error, setError] = React.useState("");
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    setReview(editingReview?.text || "");
  }, [editingReview]);

  async function saveReview(event) {
    event.preventDefault();

    if (!user) {
      setError("Bạn cần đăng nhập trước khi gửi review.");
      return;
    }

    if (!review.trim()) {
      setError("Nội dung review không được để trống.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      if (editingReview) {
        await MoviesDataService.updateReview({
          review_id: editingReview._id,
          user_id: user.id,
          review: review.trim(),
        });
      } else {
        await MoviesDataService.addReview({
          movie_id: id,
          review: review.trim(),
          userinfo: {
            name: user.name,
            id: user.id,
          },
        });
      }

      navigate(`/movies/${id}`);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="stack-gap">
      <section className="section-hero">
        <span className="eyebrow">
          {editingReview ? "Edit Review" : "Add Review"}
        </span>
        <h1 className="page-title">
          {editingReview ? "Cập nhật lại review của bạn cho bộ phim này." : "Viết review mới cho bộ phim đang chọn."}
        </h1>
        <p className="page-subtitle mb-0">
          Form này gọi trực tiếp endpoint `/api/v1/movies/review` của backend
          Lab03/Lab04 để thêm mới hoặc cập nhật review đúng theo kiến trúc
          route-controller-dao.
        </p>
      </section>

      {!user ? (
        <Alert variant="warning" className="mb-0">
          Bạn chưa đăng nhập. Vui lòng{" "}
          <Alert.Link as={Link} to="/login" state={{ from: `/movies/${id}/review` }}>
            đăng nhập
          </Alert.Link>{" "}
          trước khi thêm review.
        </Alert>
      ) : null}

      {error ? <Alert variant="danger">{error}</Alert> : null}

      <Card className="content-card border-0">
        <Card.Body className="p-4">
          <Form onSubmit={saveReview}>
            <Form.Group controlId="reviewText">
              <Form.Label className="fw-semibold">
                Nội dung review
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={8}
                placeholder="Bạn thấy bộ phim này thế nào?"
                value={review}
                onChange={(event) => setReview(event.target.value)}
              />
            </Form.Group>

            <div className="d-flex flex-wrap gap-2 mt-4">
              <Button
                className="btn-accent"
                type="submit"
                disabled={!user || saving}
              >
                {saving
                  ? "Đang lưu..."
                  : editingReview
                    ? "Cập nhật review"
                    : "Gửi review"}
              </Button>
              <Button
                as={Link}
                to={`/movies/${id}`}
                className="btn-outline-soft"
                type="button"
              >
                Quay lại phim
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}
