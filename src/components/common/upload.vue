<template>
<el-upload
  class="upload-demo"
  ref="upload"
  :data="formdata"
  :action="url"
  :on-preview="handlePreview"
  :on-remove="handleRemove"
  :file-list="fileList"
  :auto-upload="false">
  <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
  <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
  <div slot="tip" class="el-upload__tip">只能上传Excel文件</div>
</el-upload>
</template>
<script>
import config from "../../config.js"
  export default {
    data() {
      return {
        fileList: [],
        url: config.serviceUrl+"/ImportExcelFileByName",
        formdata:
        {
            name:this.$global.componentSelect().name
        }
      };
    },
    methods: {
      submitUpload() {
       
        this.$refs.upload.submit();
         this.$message('上传完毕')
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