### farm-console
1. 简介
后端基于SpringBoot + SpringMVC + Shiro，前端基于Vue.js 2.x系列 + Element UI 的后台管理系统解决方案。
工作之余整理了SpringBoot整个常用框架的模板库[framework](https://github.com/lhrimperial/framework)，运用这个模板开发了一个基于粗粒度权限设计的管理后台[caiwei](https://github.com/lhrimperial/caiwei)，前端使用的是ExtJs。
 ExtJs属于比较重的前端框架，基于当下流行的几种前端框架，选择了Vue + ElementUI重新实现了一个后台管理系统，权限管理选用了Shiro 权限管理框架，并且对权限进行了细粒度的设计，控制到按钮。
时间比较紧还有很多不完善和考虑不周全的地方，希望看到这份代码发现问题的可以给我留言，谢谢！

2. 测试地址
    - http://www.ifarmshop.com
        - admin/123
    - http://www.ifarmshop.com/caiwei/index
        - 275688/123
        
#### 搭建环境
1. 安装node.js
    https://nodejs.org/en/download/ 
    
2. 全局安装淘宝cnpm 镜像 (可以不用) 
    npm install -g cnpm --registry=https://registry.npm.taobao.org  
    判断cnpm 是否安装成功  
    cnpm -h  

3. 全局安装vue-cli  
    cnpm install -g vue-cli  
    判断vue-cli 是否安装成功  
    cnpm list 
    
4. 下载项目，在跟目录下下载依赖 <br/>
    npm install
    
5. 运行项目，根目录下运行<br/>
    npm run dev
