// router/index.js
import { createRouter, createWebHistory } from 'vue-router'

// 布局组件
import WebLayout from '../views/web/layout/WebLayout.vue'
import AdminLayout from '../views/admin/layout/AdminLayout.vue'

// 前台页面
import Home from '../views/web/home/Home.vue'
import Category from '../views/web/category/Category.vue'
import Strategy from '../views/web/strategy/Strategy.vue'
import Search from '../views/web/search/Search.vue'
import SpotDetail from '../views/web/spot-detail/SpotDetail.vue'
import StrategyDetail from '../views/web/strategy/StrategyDetail.vue'

// 个人中心
import Profile from '../views/web/profile/Profile.vue'
import ProfileInfo from '../views/web/profile/ProfileInfo.vue'
import ProfileEdit from '../views/web/profile/ProfileEdit.vue'
import MyOrders from '../views/web/profile/MyOrders.vue'
import MyComments from '../views/web/profile/MyComments.vue'
import MyFavorites from '../views/web/profile/MyFavorites.vue'
import MyLikes from '../views/web/profile/MyLikes.vue'
import MyCart from '../views/web/profile/MyCart.vue'

// 登录页
import Login from '../views/login/Login.vue'

// 后台页面
import AdminDashboard from '../views/admin/dashboard/AdminDashboard.vue'
import AdminCategory from '../views/admin/category/AdminCategory.vue'
import AdminSpot from '../views/admin/spot/AdminSpot.vue'
import AdminUser from '../views/admin/user/AdminUser.vue'
import AdminOrder from '../views/admin/order/AdminOrder.vue'
import AdminComment from '../views/admin/comment/AdminComment.vue'
import AdminGuide from '../views/admin/guide/AdminGuide.vue'
import AdminAdmin from '../views/admin/admin/AdminAdmin.vue'
import AdminNotice from '../views/admin/notice/AdminNotice.vue'

const routes = [
  // 登录页
  {
    path: '/login',
    name: 'Login',
    component: Login
  },

  // 前台路由（带导航栏布局）
  {
    path: '/',
    component: WebLayout,
    children: [
      { path: '', name: 'Home', component: Home },
      { path: 'category', name: 'Category', component: Category },
      { path: 'strategy', name: 'Strategy', component: Strategy },
      { path: 'strategy/:id', name: 'StrategyDetail', component: StrategyDetail },
      { path: 'search', name: 'Search', component: Search },
      { path: 'detail/:id', name: 'SpotDetail', component: SpotDetail },
      {
        path: 'profile',
        component: Profile,
        redirect: '/profile/info',
        children: [
          { path: 'info', name: 'ProfileInfo', component: ProfileInfo },
          { path: 'edit', name: 'ProfileEdit', component: ProfileEdit },
          { path: 'orders', name: 'MyOrders', component: MyOrders },
          { path: 'comments', name: 'MyComments', component: MyComments },
          { path: 'favorites', name: 'MyFavorites', component: MyFavorites },
          { path: 'likes', name: 'MyLikes', component: MyLikes },
          { path: 'cart', name: 'MyCart', component: MyCart }
        ]
      }
    ]
  },

  // 后台路由（带侧边栏布局）
  {
    path: '/admin',
    component: AdminLayout,
    redirect: '/admin/dashboard',
    children: [
      { path: 'dashboard', name: 'adminDashboard', component: AdminDashboard },
      { path: 'category', name: 'adminCategory', component: AdminCategory },
      { path: 'spot', name: 'adminSpot', component: AdminSpot },
      { path: 'user', name: 'adminUser', component: AdminUser },
      { path: 'order', name: 'adminOrder', component: AdminOrder },
      { path: 'comment', name: 'adminComment', component: AdminComment },
      { path: 'guide', name: 'adminGuide', component: AdminGuide },
      { path: 'admin', name: 'adminAdmin', component: AdminAdmin },
      { path: 'notice', name: 'adminNotice', component: AdminNotice }
    ]
  },

  // 404 重定向
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
