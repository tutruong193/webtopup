import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { routes } from "./routes";
import DefaultComponent from './components/DefaultComponent/DefaultComponet';
import { Fragment, useEffect } from "react";
import { useCookies } from 'react-cookie';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';

function App() {
  const [cookiesAccessToken, setCookieAccessToken, removeCookie] = useCookies('');
  const accessToken = cookiesAccessToken.access_token;

  useEffect(() => {
    const isSystemPage = routes.some(route => window.location.pathname.startsWith('/system/'));
    if (!isSystemPage) {
      removeCookie('access_token');
    }
  }, [window.location.pathname]);
  return (
    <div>
      <Router>
        <Routes>
          {routes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={
                route.requiresAuth && !accessToken ? (
                  <Navigate to="/404" replace />
                ) : (
                  <Fragment>
                    {route.isShowHeader && <DefaultComponent />}
                    <route.page />
                  </Fragment>
                )
              }
            />
          ))}
          <Route path="/404" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
