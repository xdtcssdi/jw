import Vue from 'vue';
import {router} from './router';
import store from './store';
import App from './App';
// 引入和使用elementUI
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

import VueResource from 'vue-resource';
import './config/http'

// import Chat from 'jwchat';
// import 'jwchat/lib/JwChat.css';
// Vue.use(Chat);

import Chat from 'vue-beautiful-chat'
Vue.use(Chat)

// 路由判断登录 根据路由配置文件的参数
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requireAuth)){ // 判断该路由是否需要登录权限
    if (localStorage.username) { // 判断当前的token是否存在 ； 登录存入的token
      next();
    }
    else {
      window.location.href = '/login.html';
    }
  }
  else {
    next();
  }
});

Vue.use(VueResource);
  new Vue({
    el: '#app',
    router,
    store,
    template:'<App/>',
    components:{ App },
  })



