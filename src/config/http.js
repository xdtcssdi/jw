import Vue from 'vue';
import VueResource from 'vue-resource';
Vue.use(VueResource);
Vue.http.interceptors.push((request,next)=>{
  // request.credentials = true;
  // request.url = '/api'+request.url;
  console.log("访问", request.url);
  next((response) => {//在响应之后传给then之前对response进行修改和逻辑判断。对于token时候已过期的判断，就添加在此处，页面中任何一次http请求都会先调用此处方法
    if(response.status===401){
      window.location.reload();
    }
    return response;
  });

})