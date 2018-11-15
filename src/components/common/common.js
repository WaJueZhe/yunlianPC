//编写自己的公共组件库
import HeaderCompontent from './header.vue'
import AsideCompontent from './aside.vue'
import TieleCompontent from './headerTieele.vue'
import UploadPhoto from './uploadImg.vue'

export default {
  install(Vue) {
    Vue.component('app-header', HeaderCompontent),
      Vue.component('app-aside', AsideCompontent),
      Vue.component('app-title', TieleCompontent),
      Vue.component('app-uploadImg', UploadPhoto)
  }
};
 