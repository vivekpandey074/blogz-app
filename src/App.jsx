import "./App.css";
import {
  Routes,
  Route,
  useNavigate,
  useParams,
  useLocation,
  Navigate,
} from "react-router-dom";
import AddEditBlog from "./pages/AddEditBlog";
import Home from "./pages/Home";
import Details from "./pages/Details";
import NotFound from "./pages/NotFound";
import { ToastContainer, toast } from "react-toastify";
import About from "./pages/About";
import Header from "./components/Header";
import "./style.scss";
import "./media-query.css";
import { useEffect, useState } from "react";
import Auth from "./pages/Auth";
import { auth } from "./firebase";
import { signOut } from "firebase/auth";
import TagBlog from "./pages/TagBlog";
import Category from "./components/Category";
import CategoryPage from "./pages/CategoryPage";
import ScrollToTop from "./components/scrollToTop";

function App() {
  const [active, setActive] = useState("home");
  const [user, setUser] = useState(null);

  const navigate = useNavigate();
  const url = useLocation();

  useEffect(() => {
    switch (url.pathname) {
      case "/":
        setActive("home");
        break;
      case "/about":
        setActive("about");
        break;

      case "/auth":
        setActive("login");

        if (user?.uid) {
          handleLogout();
        }
        break;

      case "/create":
        setActive("create");
        break;

      default:
        setActive("home");
        break;
    }
  }, [url]);

  useEffect(() => {
    auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        setUser(null);
      }
    });
  }, []);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        setUser(null);
        setActive("login");
        navigate("/auth");
      })
      .catch((error) => toast.error(error.code));
  };

  return (
    <div className="App">
      <Header
        setActive={setActive}
        active={active}
        user={user}
        handleLogout={handleLogout}
      />
      <ScrollToTop />
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home user={user} />} />
        <Route path="/search" element={<Home user={user} />} />
        <Route
          path="/detail/:id"
          element={<Details setActive={setActive} user={user} />}
        />
        <Route
          path="/create"
          element={<AddEditBlog user={user} setActive={setActive} />}
        />
        <Route
          path="/update/:id"
          element={<AddEditBlog user={user} setActive={setActive} />}
        />

        <Route path="/tag/:tag" element={<TagBlog />} />

        <Route path="/about" element={<About />} />
        <Route path="/category/:category" element={<CategoryPage />} />
        <Route
          path="/auth"
          element={<Auth setActive={setActive} setUser={setUser} />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
