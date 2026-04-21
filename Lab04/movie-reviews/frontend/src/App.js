import React from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { Link, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import AddReview from "./components/add-review";
import Login from "./components/login";
import Movie from "./components/movie";
import MoviesList from "./components/movies-list";

const STORAGE_KEY = "movie_reviews_user";

function getInitialUser() {
  if (typeof window === "undefined") {
    return null;
  }

  const savedUser = window.localStorage.getItem(STORAGE_KEY);
  if (!savedUser) {
    return null;
  }

  try {
    return JSON.parse(savedUser);
  } catch (error) {
    window.localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

function App() {
  const [user, setUser] = React.useState(getInitialUser);

  React.useEffect(() => {
    if (user) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      return;
    }

    window.localStorage.removeItem(STORAGE_KEY);
  }, [user]);

  async function login(nextUser = null) {
    setUser(nextUser);
  }

  async function logout() {
    setUser(null);
  }

  return (
    <div className="app-shell">
      <Navbar expand="lg" className="app-navbar" sticky="top">
        <Container>
          <Navbar.Brand as={Link} to="/movies" className="brand-mark">
            <span className="brand-kicker">Lab04</span>
            <span className="brand-title">Movie Reviews</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="main-nav" />
          <Navbar.Collapse id="main-nav">
            <Nav className="ms-auto align-items-lg-center gap-lg-2">
              <span className="nav-chip">
                {user ? `Signed in: ${user.name}` : "Guest mode"}
              </span>
              <Nav.Link as={Link} to="/movies">
                Movies
              </Nav.Link>
              {user ? (
                <Nav.Link
                  href="#logout"
                  onClick={(event) => {
                    event.preventDefault();
                    logout();
                  }}
                >
                  Logout {user.name}
                </Nav.Link>
              ) : (
                <Nav.Link as={Link} to="/login">
                  Login
                </Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <main className="page-shell">
        <Container>
          <Routes>
            <Route path="/" element={<MoviesList user={user} />} />
            <Route path="/movies" element={<MoviesList user={user} />} />
            <Route
              path="/movies/:id/review"
              element={<AddReview user={user} />}
            />
            <Route path="/movies/:id" element={<Movie user={user} />} />
            <Route
              path="/login"
              element={<Login login={login} user={user} />}
            />
            <Route path="*" element={<Navigate replace to="/movies" />} />
          </Routes>
        </Container>
      </main>
    </div>
  );
}

export default App;
