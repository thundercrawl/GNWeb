<template>
     <el-row class="login-wrap">
            <div class="ms-label">
                    
                     <img src="../assets/loginLOGO.png" class="image"  />
                     
           </div>
            
  
    <div>
        
        <div class="ms-login">
      
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="demo-ruleForm">
                  <el-form-item>
                    <el-select label="角色" v-model="selectrole">
                        <el-option label="管理员" value="1"></el-option>
                        <el-option label="客户" value="2"></el-option>
                    </el-select>
                 </el-form-item>
                <el-form-item prop="username">
                    <el-input v-model="ruleForm.username" placeholder="用户名"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="密码" v-model="ruleForm.password" @keyup.enter.native="submitForm('ruleForm')"></el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
                </div>

              
                <table >
                    <tr>
                        <td>
                        <el-form-item prop="accesscode">
                        <el-input type="text"  placeholder="随机码" v-model="ruleForm.accesscode" @keyup.enter.native="submitForm('ruleForm')" style="padding-top:20px"></el-input>
                         </el-form-item>
                        </td>
                        
                         <td> <img class="accessCodeImageClass" v-bind:src="accessCodeImage" alt="Base64 encoded image" v-on:click="getImage" />
                        </td>
                    </tr>
                    
                </table>
               
               

                <p style="padding-left:50px;font-size:18px;line-height:30px;color:#389;"> {{tips}}</p>
            </el-form>
         
        </div>
    </div>
    
</el-row>
</template>

<script>
    import RouterUtils from '../tools/RouterUtils';
    import Config from '../config.js'
    import axios from 'axios';
    export default {
        data: function(){
            return {
                tips:'如看不清楚点击验证码更换',
                selectrole:'管理员',
                accessCodeImage:'',
                ruleForm: {
                    username: '',
                    password: '',
                    accesscode:'',
                    accessToken:''
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
        created()
        {
            console.log("call before image load")
            
                 this.accessCodeImage =''
                  localStorage.Authorization=''
                  localStorage.JSESSIONID=''    
             axios({
                method: 'get',
                url: Config.serviceUrl+'/cookie',
                headers: {
            
                    'JSESSIONID':''
                }
                
            }).then(response => {
                
                console.log("load cookie finished, accessToken  :"+response.data.result.accessToken) 
                this.accessToken = response.data.result.accessToken;
                localStorage.accessToken = response.data.result.accessToken;
                axios({
                method: 'get',
                url: Config.serviceUrl+'/getImageCode',
                headers: {
                'Content-type': 'image/jpeg',
                'accessToken': this.accessToken,
                'JSESSIONID':''
                }
                
                }).then(response => {
                    this.accessCodeImage = 'data:image/jpg;base64,'.concat(this.accessCodeImage.concat(response.data)) 
                   // console.log("access code image:"+this.accessCodeImage)           
                })        
            })
            
           
            },
        methods: {
             getImage:function()
             {
                 this.accessCodeImage =''
                  localStorage.Authorization=''   
             axios({
                method: 'get',
                url: Config.serviceUrl+'/cookie',
                headers: {
                    'Authorization':'',
                    'JSESSIONID':''
                }
                
            }).then(response => {
                
                console.log("load cookie finished:"+response.data.result.accessToken) 
                this.accessToken = response.data.result.accessToken;
                localStorage.accessToken = response.data.result.accessToken;
                axios({
                method: 'get',
                url: Config.serviceUrl+'/getImageCode',
                headers: {
                'Content-type': 'image/jpeg',
                'accessToken': this.accessToken
                }
                
                }).then(response => {
                    this.accessCodeImage = 'data:image/jpg;base64,'.concat(this.accessCodeImage.concat(response.data)) 
                   // console.log("access code image:"+this.accessCodeImage)           
                })        
            })
             },
             getCookie: function (cname) {
                var name = cname + "=";
                var ca = document.cookie.split(';');
                for (var i = 0; i < ca.length; i++) {
                    var c = ca[i];
                    while (c.charAt(0) == ' ') c = c.substring(1);
                    if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
                }
                return "";
            },
            loadAccessCode()
            {
                console.log("cookie：")
            },
            accessURL()
            {
               
                console.log(Config.serviceUrl+this.$global.remote().accessCode)
                
                return Config.serviceUrl+this.$global.remote().accessCode
            },
            submitForm(formName) {
                const self = this;
                let params = {
                    userName: self.ruleForm.username,
                    password: self.ruleForm.password,
                    accesscode: self.ruleForm.accesscode
                };
                
                this.$http.post(this.$global.remote().login, params, response => {
                    localStorage.Authorization = response.result.Authorization;
                    console.log(response.result)
                    //reset user permission
                    this.$global.userPermissionNotRole = ''
                    this.getUerPermission();
                    this.getUserInfo();
                    
                    //添加路由
                    localStorage.accessToken = ''
                },fail =>{
                    self.tips = fail.message;
                });
            } ,
            getUerPermission:function()
            {
                const self = this;
                let params = {
                    userName: self.ruleForm.username,
                };
                self.$http.get("/userPermissionNotRole", params, response => {
                    console.log("get user permission not rolebased")
                    if (self.$tools.isNotEmpty(response.result)) {
                        let userPermission = response.result;
                       
                        
                        // self.$cookie.set('userInfo', JSON.stringify(userInfo));
                        // self.$cookie.set('userMenu', JSON.stringify(userMenu));
                        this.$global.setUserPermissionNotRole(userPermission);
                        console.log("get user permission:"+userPermission)
                    }
                },fail => {
                    console.log(fail);
                })
            }
            ,
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
        color: #389;

    }
    .ms-label{
        position: absolute;
        left:20%;
        top:50%;
        width:300px;
        height:300px;
        margin:-150px 0 0 -190px;
        padding:40px;
        border-radius: 5px;
        
    }
    .ms-login{
        position: absolute;
        left:70%;
        top:40%;
        width:300px;
        height:320px;
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
    .accessCodeImageClass
    {
        width: 120px;
        height: 40px;
        vertical-align:center
    }

</style>
