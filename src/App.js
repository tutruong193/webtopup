import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { routes } from "./routes";
import DefaultComponent from './components/DefaultComponent/DefaultComponet'
import { Fragment } from "react";
function App() {
  return (
    <div>
      <Router>
        <Routes>
          {routes.map((route) => {
            const Page = route.page
            const Layout = route.isShowHeader ? DefaultComponent : Fragment
            return (
              <Route key={route.path} path={route.path} element={
                <Layout>
                  <Page />
                </Layout>
              } />
            )
          })}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
