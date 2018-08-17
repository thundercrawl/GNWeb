<template>
    <div class="sidebar">
      
        
        <el-menu  class="el-menu-vertical-demo" background-color="#324157" text-color="#fff">
            
        
            <el-menu-item :disabled="isEnabled" v-if="!isEnabled"  @click="change">
            <template slot="title"><i class="iconfont icon-users"></i><span class="iconfont" @click="change"> 成员管理</span></template>
            </el-menu-item>
        
            
        </el-menu>
    </div>

</template>

<script>
    import RouterUtils from '../../tools/RouterUtils';
    import '../../assets/iconfont.css';
    import apiAxios from '../../apiaxios';
    import tools from '../../tools';
    import config from '../../config.js'
    export default {
        data(){
          return {
              menus: [{
                  version: 1,
                  menuData: [],
                  fixData: ['成员管理']
              }],
              menuIndex: new Map(),
              menuCache: new Map(),
              isEnabled:false,
          }
        },
        methods: {
            change:function(){
                this.$router.push("/home/UserManage")
            }
        ,
            handleOpen(index, indexPath){
                let subMenu = this.menuCache.get(index);
                let subMenuIndex = this.menuIndex.get(index);
                if (this.$tools.isEmpty(subMenu)) {
                    this.$http.get(this.$global.remote().userMenu, {parentCode: index}, response => {
                        subMenu = response.result;
                        if (this.$tools.isNotEmpty(subMenu)) {
                            this.menuCache.set(index, subMenu);
                            this.menus[0].menuData[subMenuIndex].menuItems = subMenu;
                            /**
                             * 需要改动menus数据才会执行menusCopy
                             * 改变menus元素属性不能触发，所以这里通过改变menus元素实现，后期优化
                             * 第一次加载菜单还有问题
                             */
                            this.menus.push({
                                version:0,
                                menuData:[]
                            })

                            let routers = [];
                            RouterUtils(routers,subMenu,'menu');
                            this.$router.options.routes[2].children = routers;
                            this.$router.addRoutes(this.$router.options.routes);//调用addRoutes添加路由
                        }
                    }, fail => {
                        this.message.error(fail.message);
                    });
                } else {
                    this.menus[subMenuIndex].menuItems = subMenu;
                }
            }
        },
        computed: {
            onRoutes() {
                return this.$route.path.split('/')[2];
            },
            menusCopy(){
                return this.menus[0];
            }
        },
        watch:{
        },
       
        mounted(){

        
          // this.isEnabled =  !this.$global.haveUserPermissionNotRole('/UserMgr');
            const self = this;
    let params = {
        userName: JSON.parse(sessionStorage.getItem('userInfo')).userName,
    };
    apiAxios.get(config.serviceUrl+"/userPermissionNotRole", params, response => {
        console.log("get user permission not rolebased")
        if (tools.isNotEmpty(response.result)) {
            let userPermission = response.result;
            this.$global.setUserPermissionNotRole(userPermission) ;
            console.log("get user permission:" + userPermission)
            
            this.isEnabled = !this.$global.haveUserPermissionNotRole('/UserMgr');
            console.log("user management disabled:"+this.isEnabled)
        }
    }, fail => {
        Message.error(fail.message);
    })

            let menusTemp = this.$store.state.userMenu;
            for (let i = 0, len = menusTemp.length; i < len; i++){
                menusTemp[i].menuItems = [];
                this.menuIndex.set(menusTemp[i].resourceCode, i);
            }
            this.menus[0].menuData =  menusTemp;
        }
    }
</script>

<style>
    
    .sidebar {
        display: block;
        position: absolute;
        width: 180px;
        left: 0;
        top: 70px;
        bottom: 0;
        background: #2E363F;
    }

    .sidebar > ul {
        height: 100%;
    }

    .el-menu-item, .el-submenu__title {
        height: 45px !important;
        line-height: 45px !important;
    }
     .el-menu-item:hover, .el-submenu .el-menu-item:hover, .el-submenu__title:hover {
        background-color: #7ed2df;
      }
</style>
