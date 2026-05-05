import React from "react";
import { Alert, Button, Card, Col, Form, Row } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";

export default function Login({ login, user }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [name, setName] = React.useState(user?.name || "");
  const [id, setId] = React.useState(user?.id || "");
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    setName(user?.name || "");
    setId(user?.id || "");
  }, [user]);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!name.trim() || !id.trim()) {
      setError("Cần nhập đầy đủ name và id để mô phỏng đăng nhập.");
      return;
    }

    setError("");
    await login({
      name: name.trim(),
      id: id.trim(),
    });

    navigate(location.state?.from || "/movies", { replace: true });
  }

  return (
    <Row className="justify-content-center">
      <Col xl={6} lg={7}>
        <Card className="auth-card border-0">
          <Card.Body className="p-4 p-lg-5">
            <span className="eyebrow">Mock Login</span>
            <h1 className="page-title fs-1">Tạo phiên đăng nhập giả lập để thao tác review.</h1>

            {user ? (
              <Alert variant="success">
                Hiện đang đăng nhập với user <strong>{user.name}</strong> ({user.id}).
              </Alert>
            ) : null}

            {error ? <Alert variant="danger">{error}</Alert> : null}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="loginName">
                <Form.Label>Display name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ho Vuong Tuong Vy"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-4" controlId="loginId">
                <Form.Label>User id</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="23521827"
                  value={id}
                  onChange={(event) => setId(event.target.value)}
                />
              </Form.Group>
              <Button className="btn-accent" type="submit">
                Lưu trạng thái đăng nhập
              </Button>
            </Form>

            <div className="form-footnote">
              Sau khi đăng nhập, bạn sẽ được điều hướng trở lại trang đang thao tác
              để tiếp tục thêm hoặc chỉnh sửa review.
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}
