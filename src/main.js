import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import 'element-ui/lib/theme-chalk/index.css';
import './assets/css/global.css'
import axios from 'axios'
import { Message } from 'element-ui'
import { MessageBox } from 'element-ui'

axios.defaults.baseURL = "/api"
Vue.prototype.$http = axios
Vue.prototype.$message = Message
Vue.config.productionTip = false


axios.interceptors.request.use(
  (config) => {
    if(localStorage.getItem("token")){
      config.headers.token = localStorage.getItem("token")
    }
    return config
  }
)

//axios返回结果统一处理
axios.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    console.log(error)
    
    if (error.config.showMessage != false) {
      let msg = ""
      if (typeof (error.response.data) == "string")
        msg = error.response.data
      else
        msg = error.response.data.msg

      MessageBox.alert(error.response.status + ', 错误信息:' + msg, '系统错误')
    }//end of if

    return Promise.reject(error)
  }
)


new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
