import React from "react";
import { Alert, Button, Card, Form } from "react-bootstrap";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import MovieDataService from "../services/movies";

export default function AddReview({ user }) {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const editingReview = location.state?.currentReview || location.state?.review || null;
  const editing = Boolean(editingReview);
  const initialReviewState = React.useMemo(
    () => ({
      review: editing ? editingReview?.review || editingReview?.text || "" : "",
    }),
    [editing, editingReview],
  );

  const [review, setReview] = React.useState(initialReviewState);
  const [submitted, setSubmitted] = React.useState(false);
  const [error, setError] = React.useState("");
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    setReview(initialReviewState);
    setSubmitted(false);
  }, [initialReviewState]);

  function onChangeReview(event) {
    const value = event.target.value;

    setReview((currentReview) => ({
      ...currentReview,
      review: value,
    }));
  }

  async function saveReview(event) {
    event.preventDefault();

    if (!user) {
      setError("Bạn cần đăng nhập trước khi gửi review.");
      return;
    }

    if (!review.review.trim()) {
      setError("Nội dung review không được để trống.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const data = {
        review: review.review.trim(),
        name: user.name,
        user_id: user.id,
        movie_id: id,
      };

      if (editing) {
        await MovieDataService.updateReview({
          ...data,
          review_id: editingReview._id,
        });

        navigate(`/movies/${id}`);
      } else {
        await MovieDataService.createReview(data);

        setSubmitted(true);
      }
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
          {editing ? "Edit Review" : "Add Review"}
        </span>
        <h1 className="page-title">
          {editing ? "Cập nhật lại review của bạn cho bộ phim này." : "Viết review mới cho bộ phim đang chọn."}
        </h1>
        <p className="page-subtitle mb-0">
          Form này gọi trực tiếp endpoint `/api/v1/movies/review` của backend
          Lab06 để thêm mới hoặc cập nhật review đúng theo kiến trúc
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
      {submitted && !editing ? (
        <Alert variant="success">
          Review đã được thêm thành công.
        </Alert>
      ) : null}

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
                value={review.review}
                onChange={onChangeReview}
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
                  : editing
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
