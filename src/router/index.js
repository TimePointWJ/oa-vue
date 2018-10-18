import Vue from 'vue'
import Router from 'vue-router'
const _import = require('./_import_' + process.env.NODE_ENV)

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

export const constantRouterMap = [
  { path: '/login', component: _import('login/index'), hidden: true },
  { path: '/authredirect', component: _import('login/authredirect'), hidden: true },
  { path: '/404', component: _import('errorPage/404'), hidden: true },
  { path: '/401', component: _import('errorPage/401'), hidden: true },
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [{
      path: 'dashboard',
      component: _import('dashboard/index'),
      name: '首页',
      meta: { title: '首页', icon: 'dashboard', noCache: true }
    }]
  }
  // {
  //   path: '/documentation',
  //   component: Layout,
  //   redirect: '/documentation/index',
  //   children: [{
  //     path: 'index',
  //     component: _import('documentation/index'),
  //     name: 'documentation',
  //     meta: { title: 'documentation', icon: 'documentation', noCache: true }
  //   }]
  // }
]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  {
    path: '/attendance',
    redirect: 'leave',
    component: Layout,
    name: '考勤管理',
    icon: 'example',
    meta: { privilege: ['attendance'] },
    children: [
      // { path: 'leave', component: _import('attendance/leave'), name: '请假类型' , meta: { title: 'leaveType' }}
      { path: 'leave', component: _import('attendance/leave'), name: '请假类型', meta: { privilege: ['attendance_leave'] } },
      { path: 'record', component: _import('attendance/attendanceRecord'), name: '考勤记录', meta: { privilege: 'attendance_record' } },
      { path: 'forget', component: _import('attendance/forgetToClockOutApply'), name: '忘打卡申请', meta: { privilege: 'attendance_apply' } }
    ]
  },
  {
    path: '/systemManager',
    redirect: 'systemAccount',
    component: Layout,
    name: '后台用户',
    icon: 'example',
    meta: { privilege: ['backUserManager'] },
    children: [
      { path: 'systemAccount', component: _import('system/systemAccount'), name: '系统用户', meta: { privilege: 'backUserManager_user' } },
      { path: 'systemRole', component: _import('system/systemRole'), name: '系统角色', meta: { privilege: 'backUserManager_authManager' } },
      { path: 'position', component: _import('system/position'), name: '职位管理', meta: {  } },
      { path: 'position', component: _import('system/goods'), name: '商品管理', meta: {  } }
      // ,{ path: 'index', component: _import('theme/index'), name: 'theme', meta: { privilege: 'backUserManager_user' }}
    ]
  },
  {
    path: '/organization',
    component: Layout,
    meta: { title: '组织架构' },
    name: '组织架构',
    icon: 'component',
    redirect: 'organization_department',
    children: [
      // { path: 'leave', component: _import('attendance/leave'), name: '请假类型' , meta: { title: 'leaveType' }}
      { path: 'organization_department', component: _import('organization/organization_department'), name: '部门管理', meta: { title: '组织架构' } },
      { path: 'organization_project', component: _import('organization/organization_project'), name: '项目管理', meta: { title: '组织架构' } },
      { path: 'position', component: _import('system/goods'), name: '商品管理', meta: {  } }
    ]
  },
  {
    path: '/register',
    component: Layout,
    name: '员工注册',
    meta: { title: '员工注册', icon: 'people' },
    redirect: 'register_check',
    children: [
      // { path: 'leave', component: _import('attendance/leave'), name: '请假类型' , meta: { title: 'leaveType' }}
      // { path: 'register', component: _import('register/register'), name: '员工注册' , meta: { title: '员工注册' }},
      { path: 'register_check', component: _import('register/register_check'), name: '员工审核', meta: { icon: 'peoples', title: '员工审核' } }
    ]
  },
  {
    path: '/address',
    component: Layout,
    name:'通讯录',
    meta: { title: '通讯录', icon: 'people' },
    icon: 'message' ,
    redirect: 'address_public',
    children: [
      //{ path: 'leave', component: _import('attendance/leave'), name: '请假类型' , meta: { title: 'leaveType' }}
      //{ path: 'register', component: _import('register/register'), name: '员工注册' , meta: { title: '员工注册' }},
      { path: 'address_public', component: _import('address/address_public'), name: '公司通讯录' , meta: {icon: 'peoples' , title: '公司通讯录' }},
      { path: 'address_private', component: _import('address/address_private'), name: '我的通讯录' , meta: {icon: 'peoples' , title: '我的通讯录' }}
      //,
      //{ path: 'chatroom', component: _import('address/chatroom'), name: '聊天室' , meta: {icon: 'peoples' , title: '聊天室' }}
    ]
  },
  {
    path: '/notice',
    component: Layout,
    redirect: 'releaseNotice',
    name: '公告管理',
    icon: 'component',
    meta: {
      // title: '公告',
      icon: 'component',
      privilege: ['noticeManager']
    },
    children: [
      { path: 'releaseNotice', component: _import('notice/releaseNotice'), name: '发布公告', meta: { title: '发布公告', privilege: 'noticeManager_releaseNotice'} },
      { path: 'noticeManage', component: _import('notice/noticeManage'), name: '审核公告', meta: { title: '审核公告', privilege: 'noticeManager_reviewNotice' } },
      { path: 'illegalStringManage', component: _import('notice/illegalStringManage'), name: '非法词语管理', meta: { title: '非法词语管理', privilege: 'noticeManager_illegalWordManage' } },
      { path: 'nuoticeTypeManage', component: _import('notice/noticeType'), name: '公告类别', meta: { title: '公告类别', privilege: 'noticeManager_noticeTypeManage' } },
      { path: 'nuoticeCount', component: _import('notice/noticeCount'), name: '公告统计', meta: { title: '公告统计' } },
      { path: 'noticeDetial/:noticeId/:type/:staffNo', component: _import('notice/noticeDetial'), hidden: true, name: 'noticeDetial', meta: { title: '公告详情' } }
    ]
  },
  { path: '*', redirect: '/404', hidden: true },

]
