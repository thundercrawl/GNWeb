<template>
    <div class="login-wrap">
        <div class="ms-title">汇众互联融资租赁业务管理系统</div>
        <div class="ms-login">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="demo-ruleForm">
                 <div>
                     
                    <el-select label="角色">
                        <el-option label="管理员" value="1"></el-option>
                        <el-option label="操作员" value="2"></el-option>
                    </el-select>
                </div>
                <el-form-item prop="username">
                    <el-input v-model="ruleForm.username" placeholder="用户名"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="密码" v-model="ruleForm.password" @keyup.enter.native="submitForm('ruleForm')"></el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
                </div>

                <div>
                <table border="0" height="60px">
                    <tr>
                        <el-form-item prop="accesscode">
                        <el-input type="text" placeholder="随机码" v-model="ruleForm.accesscode" @keyup.enter.native="submitForm('ruleForm')"></el-input>
                         </el-form-item>
                        <td><p style="width: 20px;"></p></td>
                                    <td> <img src="http://localhost:8080/console/getImageCode" alt="" id="captcha1" onclick="refreshCaptcha()" style="height: 40px; width: 100%; vertical-align: middle;">
                        </td>
                    </tr>
                </table>
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
                    password: '',
                    accesscode:''
                },
                rules: {
                    username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' }
                    ],
                    accesscode: [
                        { required: true, message: '输入随机码', trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            submitForm(formName) {
                const self = this;
                let params = {
                    userName: self.ruleForm.username,
                    password: self.ruleForm.password,
                    accesscode: self.ruleForm.accesscode
                };
                console.log("cookie:"+document.cookie)
                this.$http.post(this.$global.remote().login, params, response => {
                    localStorage.Authorization = response.result.Authorization;
                    console.log(response.result)
                    this.getUserInfo();
                    //添加路由
                    
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
        height:300px;
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
