import Vue from 'vue';
import App from './App';
import router from './router';//引入router下的index.js文件
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';    // 默认主题
import store from "./store/index.js"
// import '../static/css/theme-green/index.css';       // 浅绿色主题
import "babel-polyfill";
import apiAxios from './apiaxios';
import tools from './tools';
import VueCookie from "vue-cookie";
import Global from './store/global';

Vue.prototype.$global = Global;
Vue.prototype.$tools = tools;
Vue.prototype.$http = apiAxios;
Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.use(VueCookie);

router.beforeEach((to,from,next)=>{
    if(tools.isNotEmpty(VueCookie.get("userName"))){
        next()
    }else {
        if(to.path==="/login"){
            next()
        }else {
            next("/login")
        }
    }
});

const vue = new Vue({
    router,
    store,
    render: h => h(App),
    mounted() {
        this.$nextTick(function () {
            window.addEventListener('beforeunload', this.windowRefresh());
        })
    },
    methods: {
        windowRefresh: function () {
            //刷新后加载的都是模块 不需要router
            // sessionStorage.removeItem('isAddRouters');
            var domRoute = window.location.hash.substr(1);
            //为什么刷新后这里的this.$route.path始终是"/"呢，所以先用dom方法判断
            if(domRoute==="/"||domRoute==="/login"){
                this.$cookie.set('userName', "", -1);
                // this.$cookie.get('userInfo', "", -1);
                // this.$cookie.get('userMenu', "", -1);

                sessionStorage.removeItem('userInfo');
                sessionStorage.removeItem('userMenu');
            }
            if(domRoute!=="/"&&domRoute!=="/login"){
                // let userInfo = this.$cookie.get('userInfo');
                // let userMenu = this.$cookie.get('userMenu');
                let userInfo = sessionStorage.getItem('userInfo');
                let userMenu = sessionStorage.getItem('userMenu');
                this.$store.commit("saveUserInfo", JSON.parse(userInfo));
                this.$store.commit("saveUserMenu", JSON.parse(userMenu));
                this.$store.commit('setActiveIndex', '/home/index');
                this.$router.push('/home/index');
            }
        }
    }
}).$mount('#app');
