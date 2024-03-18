import AdminPage from "../pages/AdminPage/AdminPage";
import HomePage from "../pages/HomePage/HomePage";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
import SignInPage from "../pages/SignInPage/SignInPage";
import StudentPage from "../pages/StudentPage/StudentPage";
import PageDetail from "../pages/PageDetail/PageDetail";
export const routes = [
    {
        path: '/',
        page: HomePage,
        isShowHeader: true,
        requiresAuth: false
    },
    {
        path: '/signin',
        page: SignInPage,
        isShowHeader: false,
        requiresAuth: false
    },
    {
        path: '/system/admin',
        page: AdminPage,
        isShowHeader: false,
        requiresAuth: true
    },
    {
        path: '/system/student',
        page: StudentPage,
        isShowHeader: false,
        requiresAuth: true
    },
    {
        path: '/pages/PageDetail',
        page: PageDetail,
        isShowHeader: true


    },
    {
        path: '*',
        page: NotFoundPage
    },
]