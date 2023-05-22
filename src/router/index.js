import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    meta: { title: '登录' },
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    meta: { title: '404' },
    hidden: true
  },
  {
    path: '/refresh',
    name: 'Refresh',
    component: () => import('@/components/Common/refresh'),
    meta: { title: 'refresh' },
    hidden: true
  },
  // 仪表盘
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },
  // 个人中心
  {
    path: '/user',
    component: Layout,
    children: [{
      path: 'profile',
      name: 'Profile',
      component: () => import('@/views/profile/index'),
      meta: { title: '个人中心' }
    }],
    hidden: true
  },
  // 消息
  {
    path: '/message',
    component: Layout,
    children: [{
      path: 'message',
      name: 'Message',
      component: () => import('@/views/message/message'),
      meta: { title: '消息通知' }
    }],
    hidden: true
  },
  // 发布课程
  {
    path: '/course-create',
    component: Layout,
    children: [{
      path: 'create',
      name: 'CourseCreate',
      component: () => import('@/views/course_add/educourse_add'),
      meta: { title: '发布课程', icon: 'publish' }
    }]
  },
  // 课程列表
  {
    path: '/course-list',
    component: Layout,
    children: [{
      path: 'list',
      name: 'CourseList',
      component: () => import('@/views/course_list/educourse_list'),
      meta: { title: '课程列表', icon: 'course' }
    }]
  },
  // 评论管理
  {
    path: '/comment',
    component: Layout,
    children: [{
      path: 'list',
      name: 'CommentList',
      component: () => import('@/views/comment/comment_list'),
      meta: { title: '评论管理', icon: 'comment' }
    }]
  },
  // 更新课程信息
  {
    path: '/course-update',
    component: Layout,
    hidden: true,
    children: [{
      path: 'update/:id',
      name: 'CourseUpdate',
      component: () => import('@/views/course_update/educourse_update'),
      meta: { title: '更新课程信息', icon: 'publish' }
    }]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
