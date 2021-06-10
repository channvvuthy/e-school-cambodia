import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Auth/Login'
import Create from '../views/Auth/Create.vue'
import ForgotPassword from '../views/Auth/ForgotPassword.vue'
import MyCourse from '../views/MyCourse/MyCourse'
import CourseDetail from "../views/MyCourse/CourseDetail"

Vue.use(VueRouter);

const routes = [

    {
        path: '/login',
        name: 'login',
        component: Login,
    },
    {
        path: '/register',
        name: 'register',
        component: Create,
    },
    {
        path: '/forgot-password',
        name: 'forgot-password',
        component: ForgotPassword,
    },
    {
        path: '/',
        name: 'home',
        component: Home,
    },
    {
        path: '/my-course',
        name: 'my-course',
        component: MyCourse,
    },
    {
        path: '/download',
        name: 'download',
        component: () => import('../views/Download/Download'),
    },
    {
        path: '/download-detail',
        name: 'download-detail',
        component: () => import('../views/Download/VideoDetail'),
    },
    {
        path: '/book',
        name: 'book',
        component: () => import('../views/Book/Book'),
    },
    {
        path: '/partner',
        name: 'partner',
        component: () => import('../views/Partner/Partner'),
    },
    {
        path: '/discuss',
        name: 'discuss',
        component: () => import('../views/Discuss/Discuss'),
    },
    {
        path: '/video',
        name: 'video',
        component: () => import('../views/Video/Video'),
    },
    {
        path: '/video-detail/:course',
        name: 'video-detail',
        component: () => import('../views/Video/CoursePlayList'),
    },
    {
        path: '/course-play-list/:course_id',
        name: 'course-play-list',
        component: () => import('../views/Video/CoursePlayList'),
    },
    {
        path: '/favorite',
        name: 'favorite',
        component: () => import('../views/Favorite/Favorite'),
    },
    {
        path: '/other',
        name: 'other',
        component: () => import('../views/Other/Other'),
    },
    {
        path: '/help',
        name: 'help',
        component: () => import('../views/Help/Help'),
    },
    {
        path: '/policy',
        name: 'policy',
        component: () => import('../views/Term/Term'),
    },
    {
        path: '/parent',
        name: 'parent',
        component: () => import('../views/Guardian/Guardian'),
    },
    {
        path: '/insurance',
        name: 'insurance',
        component: () => import('../views/Insurance/Insurance'),
    },
    {
        path: '/invoice',
        name: 'invoice',
        component: () => import('../views/Invoice/Invoice'),
    },
    {
        path: '/about',
        name: 'about',
        component: () => import('../views/About/About'),
    },
    {
        path: '/test',
        name: 'test',
        component: () => import('../views/Test/Test'),
    },
    {
        path: '/library',
        name: 'library',
        component: () => import('../views/Library/Library'),
    },
    {
        path: '/library-video',
        name: 'library-video',
        component: () => import('../views/Library/Video'),
    },
    {
        path: '/change-profile',
        name: 'change-profile',
        component: () => import('../views/Profile/Profile'),
    },
    {
        path: '/notification-detail/:detail/',
        name: 'notification-detail',
        component: () => import('../views/Notification/Notification'),

    },


];

const router = new VueRouter({
    mode: process.env.IS_ELECTRON ? 'hash' : 'history',
    historyApiFallback: true,
    base: process.env.BASE_URL,
    routes
});

export default router
