import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'
import Welcome from '../views/Welcome.vue'
import SysUser from '../views/SysUser.vue'
import SysDept from '../views/SysDept.vue'
import SysRole from '../views/SysRole.vue'
import SysMenu from '../views/SysMenu.vue'
import Quest from '../views/Quest.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/login', component: Login },
  {
    path: '/home', meta: "首页", component: Home,
    children: [
      { path: '/welcome', meta: "欢迎", component: Welcome },
      { path: '/sysuser', meta: "用户管理", component: SysUser },
      { path: '/sysdept', meta: "组织管理", component: SysDept },
      { path: '/sysrole', meta: "角色管理", component: SysRole },
      { path: '/sysmenu', meta: "菜单管理", component: SysMenu },
      { path: '/quest', meta: "题目管理", component: Quest },
    ]
  },
  { path: '/', redirect: '/login' },
]

const router = new VueRouter({
  routes
})

export default router
