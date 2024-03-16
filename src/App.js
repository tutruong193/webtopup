import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { routes } from "./routes";
import DefaultComponent from './components/DefaultComponent/DefaultComponet';
import { Fragment } from "react";
import { useCookies } from 'react-cookie';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';

function App() {
  const [cookies, setCookie, removeCookie] = useCookies(['access_token']);
  const accessToken = cookies['access_token'];

  return (
    <div>
      <Router>
        <Routes>
          {routes.map((route) => {
            const Page = route.page;
            const Layout = route.isShowHeader ? DefaultComponent : Fragment;
            return (
              !route.requiresAuth ? (
                <Route
                  key={route.path}
                  path={route.path}
                  element={
                    <Layout>
                      <Page />
                    </Layout>
                  }
                />
              ) : (accessToken ? (
                <Route
                  key={route.path}
                  path={route.path}
                  element={
                    <Layout>
                      <Page />
                    </Layout>
                  }
                />
              ) : (
                <Route
                  key={route.path}
                  path={'*'}
                  element={<NotFoundPage />}
                />
              ))
            );
          })}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
