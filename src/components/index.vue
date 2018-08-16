<template>
     <el-row class="warp">
          
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
      <!--  <el-breadcrumb-item :to="{ path: '/home/index' }"><b>首页</b></el-breadcrumb-item>-->
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main">
      <section class="chart-container">
        <el-row>
          <el-col :span="8">
           
              <img src="../assets/fundefficient.png" class="image" @click="changePage('fundefficient')" />
             
            
          </el-col>
          <el-col :span="8">
            
              <img src="../assets/kunpeng.png" class="image" @click="changePage('kunpeng')">
              
         
          </el-col>
          <el-col :span="8">
            
              <img src="../assets/dingsheng.png" class="image" @click="changePage('dingsheng')">
           
          </el-col>
          
        </el-row>
        
        <el-row>
          <el-col :span="8">
           
              <img src="../assets/contract.png" class="image" @click="changePage('zhide')">
              
         
          </el-col>

           <el-col :span="8">
            
              <img src="../assets/buss.png" class="image" @click="changePage('bussstat')">
              
            
          </el-col>
        </el-row>
      </section>

    </el-col>
</el-row>
</template>

<script>
    export default {
        data: function(){
            return {}
        
        }
    }
</script>

<style scoped>
    .time {
    font-size: 13px;
    color: #999;
  }
  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }
  .image {
    padding:2px;
    width: 60%;
    
  }
  .image:hover{
    padding:0px;
    opacity: 1;
    }
    
  image:hover {
      opacity: 1;
      background-color:yellow;
    }
  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }
  .chart-container {
    width: 100%;
  }
  .chart-container .el-col {
    padding: 30px 20px;
  }
    .ms-doc{
        width:100%;
        max-width: 980px;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
    }
    .ms-doc h3{
        padding: 9px 10px 10px;
        margin: 0;
        font-size: 14px;
        line-height: 17px;
        background-color: #f5f5f5;
        border: 1px solid #d8d8d8;
        border-bottom: 0;
        border-radius: 3px 3px 0 0;
    }
    .ms-doc article{
        padding: 45px;
        word-wrap: break-word;
        background-color: #fff;
        border: 1px solid #ddd;
        border-bottom-right-radius: 3px;
        border-bottom-left-radius: 3px;
    }
    .ms-doc article h1{
        font-size:32px;
        padding-bottom: 10px;
        margin-bottom: 15px;
        border-bottom: 1px solid #ddd;
    }
    .ms-doc article h2 {
        margin: 24px 0 16px;
        font-weight: 600;
        line-height: 1.25;
        padding-bottom: 7px;
        font-size: 24px;
        border-bottom: 1px solid #eee;
    }
    .ms-doc article p{
        margin-bottom: 15px;
        line-height: 1.5;
    }
    .ms-doc article .el-checkbox{
        margin-bottom: 5px;
    }


</style>
<script>
export default {
        data: function(){
            return {
              fundpage:''
              
            }
        },
        methods: 
        {
          changePage:function(pagename)
          {
            console.log("pagename:"+pagename)
            this.$router.push("/home/"+pagename)
            
          }

        }
}

</script>