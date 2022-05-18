import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Auth/Login'
import Create from '../views/Auth/Create.vue'
import ForgotPassword from '../views/Auth/ForgotPassword.vue'
import MyCourse from '../views/MyCourse/MyCourse'
import Logout from "@/views/Logout/Logout";

Vue.use(VueRouter);

const routes = [

    {
        path: '/login',
        name: 'login',
        component: Login,
    },
    {
        path: '/logout',
        name: 'logout',
        component: Logout,
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
        path: '/splash',
        name: 'splash',
        component: () => import('../views/Splash/Splash'),
    },
    {
        path: '/other',
        name: 'other',
        component: () => import('../views/Other/Other'),
    },
    {
        path: '/other-refresh',
        name: 'other-refresh',
        component: () => import('../views/Other/Refresh'),
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
        path: '/activity/:user_id',
        name: 'activity',
        component: () => import('../views/Activity/Activity'),
    },
    {
        path: '/user/:user_id',
        name: 'user',
        component: () => import('../views/User/User'),
    },
    {
        path: '/activity-detail/:type',
        name: 'activity-detail',
        component: () => import('../views/Activity/ActivityDetail'),
    },
    {
        path: '/watch-video/:user_id',
        name: 'watch-video',
        component: () => import('../views/WatchVideo/WatchVideo'),
    },
    {
        path: '/watch-detail/:course_id/:id/:percentage',
        name: 'watch-detail',
        component: () => import('../views/WatchVideo/WatchDetail'),
    },
    {
        path: '/read-book/user_id',
        name: 'read-book',
        component: () => import('../views/ReadBook/ReadBook'),
    },
    {
        path: '/read-book-detail/:user_id',
        name: 'read-book-detail',
        component: () => import('../views/ReadBook/ReadBookDetail'),
    },
    {
        path: '/attendant/:user_id',
        name: 'attendant',
        component: () => import('../views/Attendant/Attendant'),
    },
    {
        path: '/download-detail/:user_id',
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
        path: '/gallery/:id',
        name: 'gallery',
        component: () => import('../views/Gallery/Gallery'),
    },
    {
        path: '/friend/:id',
        name: 'friend',
        component: () => import('../views/Network/UserOfFriend'),
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
    {
        path: '/relative',
        name: 'relative',
        component: () => import('../views/Relative/Relative'),
    },
    {
        path: '/hot-chat',
        name: 'hot-chat',
        component: () => import('../views/HotChat/HotChat'),
    },
    {
        path: '/chat',
        name: 'chat',
        component: () => import('../views/Chat/Chat'),
    },
    {
        path: '/chat-admin',
        name: 'chat-admin',
        component: () => import('../views/Chat/Admin'),
    },
    {
        path: '/create-group',
        name: 'create-group',
        component: () => import('../views/Chat/Group'),
    },
    {
        path: '/add-member/:contact',
        name: 'add-member',
        component: () => import('../views/Chat/AddMember'),
    },
    {
        path: '/packages/pkg',
        name: 'packages',
        component: () => import('../views/Video/Pkgs'),
    },
    {
        path: '/zoom',
        name: 'zoom',
        component: () => import('../views/Video/Zoom'),
    },
    {
        path: '/zoom-detail',
        name: 'zoom-detail',
        component: () => import('../views/Video/zoomDetail'),
    },
    {
        path: '/zoom-package',
        name: 'zoom-package',
        component: () => import('../views/Video/zoomPackage'),
    },
    {
        path: '/overview',
        name: 'overview',
        component: () => import('../views/Video/Overview'),
    },
    {
        path: '/book-overview',
        name: 'book-overview',
        component: () => import('../views/Library/components/book/OverView'),
    },
    {
        path: '/social/:user',
        name: 'social',
        component: () => import('../views/Video/Social'),
    },


];


const router = new VueRouter({
    mode: process.env.IS_ELECTRON ? 'hash' : 'history',
    historyApiFallback: true,
    base: process.env.BASE_URL,
    routes
});

export default router
