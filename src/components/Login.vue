<template>
    <div class="login-wrap">
        <div class="ms-title">汇众互联融资租赁业务管理系统</div>
        <div class="ms-login">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="demo-ruleForm">
                <el-form-item prop="username">
                    <el-input v-model="ruleForm.username" placeholder="用户名"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="密码" v-model="ruleForm.password" @keyup.enter.native="submitForm('ruleForm')"></el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
                </div>
                <p style="font-size:12px;line-height:30px;color:#999;">Tips : {{tips}}</p>
            </el-form>
        </div>
    </div>
</template>

<script>
    import RouterUtils from '../tools/RouterUtils';
    export default {
        data: function(){
            return {
                tips:'请填写正确的用户名和密码登录。',
                ruleForm: {
                    username: '',
                    password: ''
                },
                rules: {
                    username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            submitForm(formName) {
                const self = this;
                let params = {
                    userName: self.ruleForm.username,
                    password: self.ruleForm.password
                };

                this.$http.post(this.$global.remote().login, params, response => {
                    localStorage.Authorization = response.result.Authorization;
                    console.log(response.result)
                    this.getUserInfo();
                    //添加路由
                    //alertMsg("未找到用户")
                },fail =>{
                    self.tips = fail.message;
                });
            } ,
            getUserInfo: function () {
                let self = this;
                self.$http.get(this.$global.remote().userInfo, null, response => {
                    if (self.$tools.isNotEmpty(response.result)) {
                        let userInfo = response.result.userInfoDTO;
                        let userMenu = response.result.userMenus;
                        self.$cookie.set('userName',userInfo.userName,{expires:"30m"});
                        // self.$cookie.set('userInfo', JSON.stringify(userInfo));
                        // self.$cookie.set('userMenu', JSON.stringify(userMenu));
                        this.$global.setUserPermissions(userInfo.permissions);
                        sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
                        sessionStorage.setItem('userMenu', JSON.stringify(userMenu));
                        this.$store.commit("saveUserInfo", userInfo);
                        this.$store.commit("saveUserMenu", userMenu);
                        this.addUserRouters(userMenu);
                        console.log("user :"+userInfo.userName+" login server")
                        this.$router.push('/home/index');
                    }
                },fail => {
                    console.log(fail);
                })
            },
            addUserRouters : function (userMenus) {
                //登录后加载的都是模块 不需要router
                // let routes = [];
                // RouterUtils(routes,userMenus,'menu');
                // sessionStorage.setItem('routers',JSON.stringify(routes));
            },
            alertMsg : function (msg) {
                alert(msg);
            }
        }
    }
</script>

<style scoped>
    .login-wrap{
        position: relative;
        width:100%;
        height:100%;
    }
    .ms-title{
        position: absolute;
        top:50%;
        width:100%;
        margin-top: -230px;
        text-align: center;
        font-size:30px;
        color: #fff;

    }
    .ms-login{
        position: absolute;
        left:50%;
        top:50%;
        width:300px;
        height:160px;
        margin:-150px 0 0 -190px;
        padding:40px;
        border-radius: 5px;
        background: #fff;
    }
    .login-btn{
        text-align: center;
    }
    .login-btn button{
        width:100%;
        height:36px;
    }
</style>
