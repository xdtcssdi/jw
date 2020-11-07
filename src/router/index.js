import Vue from 'vue'
import Router from 'vue-router';
import info from '@/page/manage/make_up/info'
import student from '@/page/manage/make_up/student'
import teacher from "@/page/manage/make_up/teacher"
import assignment from "../page/manage/assignment/assignment";
import address from "../page/manage/message/address";
import exam from "../page/manage/make_up/exam";
import makeupinfo from "../page/manage/make_up/makeupinfo";
import assignmentInner from "../page/manage/assignment/assignmentInner";

Vue.use(Router);
const routerConfig = [
    {
        path: '/',
        redirect: '/make_up',
    },
    {
        path: '/make_up',
        name: '补考信息管理',
        icon: 'el-icon-menu',
        component: info,
        meta: {
            requireAuth: true, // 判断是否需要登录
        },
    },
    {
        path: '/exam',
        name: '考试信息管理',
        icon: 'el-icon-menu',
        component: exam,
        meta: {
            requireAuth: true, // 判断是否需要登录
        },
    },
    {
        path: '/assignment',
        name: '作业管理',
        icon: 'el-icon-menu',
        component: assignment,
        meta: {
            requireAuth: true, // 判断是否需要登录
        },
    },

    {
        path: '/assignmentInner',
        name: '我的作业管理',
        icon: 'el-icon-menu',
        component: assignmentInner,
        meta: {
            requireAuth: true, // 判断是否需要登录
        },
    },
    {
        path: '/address',
        name: '通讯录管理',
        icon: 'el-icon-menu',
        component: address,
        meta: {
            requireAuth: true, // 判断是否需要登录
        },
    },
    {
        path: '/student',
        name: '补考学生信息管理',
        icon: 'el-icon-menu',
        component: student,
        meta: {
            requireAuth: true, // 判断是否需要登录
        },
    },
    {
        path: '/teacher',
        name: '监考老师信息管理',
        icon: 'el-icon-menu',
        component: teacher,
        meta: {
            requireAuth: true, // 判断是否需要登录
        },
    },
    {
        path: '/makeupinfo',
        name: '考试课程信息',
        icon: 'el-icon-menu',
        component: makeupinfo,
        meta: {
            requireAuth: true, // 判断是否需要登录
        },
    },

]
const router = new Router({
    mode: 'history',
    routes: routerConfig
})
export {routerConfig, router}
//export的语法，可以先定义变量，然后再export {要导出的变量}
//第二种方法： exports.变量名 = ......
