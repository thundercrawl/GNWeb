<template>
<el-upload
  class="upload-demo"
  ref="uploadContractFile"
  :data="formdata"
  :action="url"
  :on-preview="handlePreview"
  :on-remove="handleRemove"
  :file-list="fileList"
  :headers="authHeaders"
  :auto-upload="false">
  <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
  <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
  <div slot="tip" class="el-upload__tip">只能上传PDF,DOC,DOCX文件</div>
</el-upload>
</template>
<script>
import config from "../../config.js"
  export default {
    data() {
      return {
        fileList: [],
        url: config.serviceUrl+this.$global.remote().zhideContractUpload,
        formdata:
        {
            tid:this.$global.remote().zhideTid
        },
        authHeaders:
        {
            Authorization :localStorage.Authorization,
            JSESSIONID : localStorage.token,
        }
      };
    },
    methods: {
      submitUpload() {
        console.log("upload contract id:"+this.$global.remote().zhideTid)
        if(this.$global.remote().zhideTid ='')
            {
                this.$message("上传数据未选定")
                return
            }
        else
            this.formdata.tid = this.$global.remote().zhideTid
        this.$refs.uploadContractFile.submit();
         this.$message('上传完毕')
         this.$global.remote().zhideTid = ''
         this.fileList = []
      },
      handleRemove(file, fileList) {
       console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      }
    }
  }
</script>