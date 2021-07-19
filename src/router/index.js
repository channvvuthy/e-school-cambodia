import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Auth/Login'
import Create from '../views/Auth/Create.vue'
import ForgotPassword from '../views/Auth/ForgotPassword.vue'
import MyCourse from '../views/MyCourse/MyCourse'

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
        path: '/support',
        name: 'support',
        component: () => import('../views/Support/Support'),
    },
    {
        path: '/activity',
        name: 'activity',
        component: () => import('../views/Activity/Activity'),
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
        path: '/my-library',
        name: 'my-library',
        component: () => import('../views/Library/MyLibrary'),
    },
    {
        path: '/library-video',
        name: 'library-video',
        component: () => import('../views/Library/Video'),
    },
    {
        path: '/profile',
        name: 'profile',
        component: () => import('../views/Profile/Profile'),
    },
    {
        path: '/change-password',
        name: 'change-password',
        component: () => import('../views/Auth/ChangePassword'),
    },
    {
        path: '/document',
        name: 'document',
        component: () => import('../views/Document/Document'),
    },
    {
        path: '/course-quiz/:course',
        name: 'course-quiz',
        component: () => import('../views/MyCourse/Quiz'),
    },
    {
        path: '/gallery',
        name: 'gallery',
        component: () => import('../views/Gallery/Gallery'),
    },
    {
        path: '/certificate',
        name: 'certificate',
        component: () => import('../views/Certificate/Certificate'),
    },
    {
        path: '/document-detail/:folder',
        name: 'document-detail',
        component: () => import('../views/Document/Detail'),
    },
    {
        path: '/notification-detail/:detail/',
        name: 'notification-detail',
        component: () => import('../views/Notification/Notification'),

    },
    {
        path: '/story-list',
        name: 'story-list',
        component: () => import('../views/Story/List'),

    },
    {
        path: '/network',
        name: 'network',
        component: () => import('../views/Network/Network'),

    },


];

const router = new VueRouter({
    mode: process.env.IS_ELECTRON ? 'hash' : 'history',
    historyApiFallback: true,
    base: process.env.BASE_URL,
    routes
});

export default router
