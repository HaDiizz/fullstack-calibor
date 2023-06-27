import { useEffect, Suspense } from "react";
import Login from "./pages/login";
import { gapi } from "gapi-script";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import PageRender from "./components/PageRender";
import { useSelector, useDispatch } from "react-redux";
import Layout from "./components/Layout";
import Alert from "./components/Alert";
import Loading from "./components/Loading";
import { signIn, token } from "./redux/actions/authAction";
import Profile from "./pages/profile";
import ProtectRoute from "./utils/ProtectRoute";
import Home from "./pages/home";
import NotFound from "./components/NotFound";
import Document from "./pages/document";
import Board from "./pages/board";
import Schedule from "./pages/schedule";
import Group from "./pages/group";
import "semantic-ui-css/semantic.min.css";
import ReviewPage from "./pages/rating";
import BgRight from "./assets/gradient-right-dark.svg";
import BgLeft from "./assets/gradient-left-dark.svg";

function App() {
  const { auth, alert } = useSelector((state) => state);
  const dispatch = useDispatch();

  useEffect(() => {
    function start() {
      gapi.auth2.init({
        clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        scope: "",
      });
    }
    gapi.load("client:auth2", start);
  }, []);

  useEffect(() => {
    dispatch(token());
  }, []);

  return (
    <Suspense fallback={<Loading />}>
      <div className="w-full min-h-screen overflow-hidden bg-cover transition delay-75 duration-100 ease-in-out dark:text-white relative dark:bg-black">
        <img
          className="fixed object-cover opacity-60 bg-left"
          src={BgLeft}
          alt=""
        />
        <img
          className="fixed object-cover opacity-60 bg-right"
          src={BgRight}
          alt=""
        />
        <Alert />
        <Router>
          {auth.token ? (
            <Layout auth={auth}>
              <Routes>
                <Route element={<ProtectRoute />}>
                  <Route element={<Home />} path="/" exact />
                  <Route element={<Profile />} path="/profile" exact />
                  <Route element={<Schedule />} path="/schedule" exact />
                  <Route element={<Document />} path="/document" exact />
                  <Route element={<Board />} path="/boards/:id" exact />
                  <Route element={<ReviewPage />} path="/rating" exact />
                  <Route
                    element={<Group />}
                    path="/group/:groupId"
                    exact
                  />
                </Route>
                <Route
                  element={auth.token ? <Navigate to={"/"} /> : <Login />}
                  path="/login"
                />
                <Route element={<NotFound />} path="*" />
              </Routes>
            </Layout>
          ) : (
            <Routes>
              <Route element={<Login />} path="/login" />
              <Route element={auth.token ? <Home /> : <Login />} path="/" />
              <Route
                element={auth.token ? <Profile /> : <Login />}
                path="/profile"
              />
              <Route
                element={auth.token ? <Schedule /> : <Login />}
                path="/schedule"
              />
              <Route
                element={auth.token ? <Document /> : <Login />}
                path="/document"
              />
              <Route
                element={auth.token ? <Board /> : <Login />}
                path="/boards/:id"
              />
              <Route
                element={auth.token ? <Group /> : <Login />}
                path="/group/:groupId"
              />
              <Route
                element={auth.token ? <ReviewPage /> : <Login />}
                path="/rating"
              />
            </Routes>
          )}
        </Router>
      </div>
    </Suspense>
  );
}

export default App;
