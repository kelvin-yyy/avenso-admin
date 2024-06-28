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
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/company',
    children: [{
      path: 'company',
      name: 'Dashboard',
      component: () => import('@/views/company/index'),
      meta: { title: 'company', icon: 'dashboard' }
    }]
  },

  {
    path: '/example',
    component: Layout,
    redirect: '/example/weight',
    name: 'Example',
    meta: { title: 'Example', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'weight',
        name: 'Table',
        component: () => import('@/views/weight/index'),
        meta: { title: 'weight', icon: 'table' }
      }
    ]
  },
  {
    path: '/about',
    component: Layout,
    redirect: '/about',
    children: [{
      path: 'about',
      name: 'About',
      component: () => import('@/views/about/index'),
      meta: { title: 'about', icon: 'dashboard' }
    }]
  },

 {
    path: '/Highlights',
    component: Layout,
    redirect: '/Highlights',
    children: [{
      path: 'Highlights',
      name: 'highlights',
      component: () => import('@/views/Highlights/index'),
      meta: { title: 'Highlights', icon: 'dashboard' }
    }]
  },
 {
    path: '/Details',
    component: Layout,
    redirect: '/Details',
    children: [{
      path: 'Details',
      name: 'details',
      component: () => import('@/views/Details/index'),
      meta: { title: 'Details', icon: 'dashboard' }
    }]
  },
  {
     path: '/featurin',
     component: Layout,
     redirect: '/featurin',
     children: [{
       path: 'featurin',
       name: 'Featurin',
       component: () => import('@/views/featurin/index'),
       meta: { title: 'featurin', icon: 'dashboard' }
     }]
   },
   {
      path: '/questions',
      component: Layout,
      redirect: '/questions',
      children: [{
        path: 'questions',
        name: 'Questions',
        component: () => import('@/views/questions/index'),
        meta: { title: 'questions', icon: 'dashboard' }
      }]
    },
    {
       path: '/Financials',
       component: Layout,
       redirect: '/Financials',
       children: [{
         path: 'Financials',
         name: 'financials',
         component: () => import('@/views/Financials/index'),
         meta: { title: 'Financials', icon: 'dashboard' }
       }]
     },
     {
        path: '/fundingRounds',
        component: Layout,
        redirect: '/fundingRounds',
        children: [{
          path: 'fundingRounds',
          name: 'FundingRounds',
          component: () => import('@/views/fundingRounds/index'),
          meta: { title: 'fundingRounds', icon: 'dashboard' }
        }]
      },
      {
         path: '/Investors',
         component: Layout,
         redirect: '/Investors',
         children: [{
           path: 'Investors',
           name: 'investors',
           component: () => import('@/views/Investors/index'),
           meta: { title: 'Investors', icon: 'dashboard' }
         }]
       },
       {
          path: '/employee',
          component: Layout,
          redirect: '/employee',
          children: [{
            path: 'employee',
            name: 'Employee',
            component: () => import('@/views/employee/index'),
            meta: { title: 'employee', icon: 'dashboard' }
          }]
        },
        {
           path: '/contact',
           component: Layout,
           redirect: '/contact',
           children: [{
             path: 'contact',
             name: 'Contact',
             component: () => import('@/views/contact/index'),
             meta: { title: 'contact_information', icon: 'dashboard' }
           }]
         },
         {
            path: '/news',
            component: Layout,
            redirect: '/news',
            children: [{
              path: 'news',
              name: 'News',
              component: () => import('@/views/news/index'),
              meta: { title: 'news', icon: 'dashboard' }
            }]
          },
          {
             path: '/Similar',
             component: Layout,
             redirect: '/Similar',
             children: [{
               path: 'Similar',
               name: 'similar',
               component: () => import('@/views/Similar/index'),
               meta: { title: 'Similar', icon: 'dashboard' }
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
