// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import router from './router';
import App from './page/App.vue';

// 引入第三方包
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios';
import VueRouter from 'vue-router'


import 'iview/dist/styles/iview.css';
import iView from 'iview';

//引入字体图标
import './css/icon2/iconfont.css'

//引入自己封装的配置文件
import common from './components/common/common.js'
import './css/reset.css'
import apiConfig from './js/apiConfig.js'
import store from './vuex/store.js'
import echarts from 'echarts'

//引入websocket操作
import './js/websocket.js'
import stompClient from './js/websocket.js'
import arrayUtil from './js/arrayUtil.js'


Vue.config.productionTip = false;
// const router = new  VueRouter(VueRouter);

// 手动启用第三方插件
Vue.use(ElementUI);
Vue.use(VueRouter);
Vue.use(iView);
Vue.use(arrayUtil)

//手动启用自己封装的配置文件
Vue.use(common);                    //封装的公共组件

//扩展实例成员
Vue.prototype.axios = axios;         //axios插件
Vue.prototype.api = apiConfig;       //请求地址的配置
Vue.prototype.$echarts = echarts    //echarts插件
Vue.prototype.stompClient = stompClient;    //websocket客户端

//引入cookie的操作方法
import { getCookie } from "./js/cookie.js";
import { Message } from 'element-ui';

//  在拦截器中添加tokenid
axios.interceptors.request.use(
  config => {
    // 这里写死一个token，然后在这里从cookie中获取到token的值
    var token = getCookie('tokenid')
    if (token) {
      // 这里将token设置到headers中，header的key是Authorization，这个key值根据你的需要进行修改即可
      config.headers.tokenId = token;
    }else{
      router.replace('/');
    }
    return config
  },
  error => {
    return Promise.reject(error)
  });

  axios.interceptors.response.use(
    response => {
        if(response.data.code == 442){
          //Message("查询系统所有权限异常")
          Message("权限异常！")
        }else if(response.data.code==443){
          //Message("请求没提交tokenId")
          Message("请重新登录。")
        }else if(response.data.code==444){
          Message('请重新登录!');
          router.replace('/')
        }
        return response;
    },
    error => {
        alert('出现错误：' + error);
        if (error.response) {
            switch (error.response.status) {
                case 401:  ""
                //alert(401)
                    // 返回 401 清除token信息并跳转到登录页面
                    // store.commit(types.LOGOUT);
                    // router.replace({
                    //     path: 'login',
                    //     query: {redirect: router.currentRoute.fullPath}
                    // })
            }
        }
        return Promise.reject(error.response.data)   // 返回接口返回的错误信息
    });

//解決axios的兼容性問題
import 'babel-polyfill'
require('es6-promise').polyfill()
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {
    App
  }
})

// Array.prototype.contain = function(val)  
// {  
//      for (var i = 0; i < this.length; i++)  
//     {  
//        if (this[i] == val)  
//       {  
//        return true;  
//       }  
//     }  
//      return false;  
// };  