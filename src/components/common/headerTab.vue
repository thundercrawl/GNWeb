<template>
    <div class="headerTabs">
        <el-tabs
            v-model="activeIndex"
            type="border-card"
            closable
            @tab-click="tabClick"
            v-if="options.length"
            @tab-remove="tabRemove"
        >
            <el-tab-pane
                :key="item.name"
                v-for="(item, index) in options"
                :label="item.name"
                :name="item.route"
            >
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
    import RouterUtils from '../../tools/RouterUtils';
    export default {
        methods: {
            // tab切换时，动态的切换路由
            tabClick (tab) {
                let path = this.activeIndex;
                // 用户详情页的时候，对应了二级路由，需要拼接添加第二级路由
                this.$router.push(path);
            },
            tabRemove (targetName) {
                // 首页不可删除
                if(targetName == '/home/index') {
                    return;
                }
                this.$store.commit('deleteTabs', targetName);
                if (this.activeIndex === targetName) {
                    // 设置当前激活的路由
                    if (this.options && this.options.length >= 1) {
                        this.$store.commit('setActiveIndex', this.options[this.options.length-1].route);
                        this.$router.push(this.activeIndex);
                    } else {
                        this.$router.push('/home/index');
                    }
                }
            },
            // reAddRouter: function () {
                // let routers = []
                //     , routerData = JSON.parse(sessionStorage.getItem('routers'));
                // RouterUtils(routers,routerData,'router');
                //
                // this.$router.options.routes[2].children = routers;
                // this.$router.addRoutes(this.$router.options.routes);//调用addRoutes添加路由
            // }
        },
        computed: {
            options () {
                return this.$store.state.options;
            },
            activeIndex: {
                get () {
                    return this.$store.state.activeIndex;
                },
                set (val) {
                    this.$store.commit('setActiveIndex', val);
                }
            }
        },
        watch: {
            '$route'(to) {
                let flag = false;
                for (let option of this.options) {
                    if (option.name === to.name) {
                        flag = true;
                        this.$store.commit('setActiveIndex', to.path);
                        break
                    }
                }
                if (!flag) {
                    this.$store.commit('addTabs', {route: to.path, name: to.name});
                    this.$store.commit('setActiveIndex', to.path);
                }

            }
        },
        mounted(){
            //初始加载的是模块 不需要router
            // if (this.$tools.isEmpty(sessionStorage.getItem('isAddRouters'))) {
            //     this.reAddRouter();
            //     sessionStorage.setItem('isAddRouters', 'true');
            // }
            this.$store.commit('addTabs',{route: '/home/index', name: '首页'});
            //延迟3s加载数据字典
            // setTimeout(function () {
                this.$global.autoFlashDictionary();
                this.$global.flashMenuSelectStore();
                this.$global.flashRoleStore();
                this.$global.flashDistributeStore();
                this.$global.flashUserPermission();
            // }, 3000);
        }
    }
</script>
<style lang="less">
    .headerTabs{
        div.el-tabs__nav>div.el-tabs__item:nth-child(1) span{
            display: none !important;
        }
    }
</style>
