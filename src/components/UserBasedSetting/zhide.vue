<template>
  <el-row class="warp">
    <el-col :span="24">
      <!--
      <el-breadcrumb separator="/">
      
        <el-breadcrumb-item :to="{ path: '/home/index' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>资金效率</el-breadcrumb-item>
      
      </el-breadcrumb>
 -->
      <div class="grid-content"></div>
    </el-col>

    <el-col :span="24" class="warp-main" v-loading="loading" element-loading-text="拼命加载中">
      <!--工具条-->
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true" :model="filters">
          
          <el-form-item>
            <el-button type="primary" v-on:click="handleSearch">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="showAddDialog">新建</el-button>
          </el-form-item>
           
        </el-form>
      </el-col>

      <!--列表-->
      <el-table border stripe :data="result" highlight-current-row @selection-change="selsChange"
                style="width: 100%;">
        <el-table-column type="selection" ></el-table-column>
        <el-table-column type="index" label="序号" width="60px"></el-table-column>
       
        <el-table-column prop="serialnum" label="合同序号"></el-table-column>
        <el-table-column prop="contractname" label="合同名称" ></el-table-column>
        <el-table-column prop="contractusage" label="用途" ></el-table-column>
        <el-table-column prop="signedPart" label="签约方"></el-table-column>
        <el-table-column prop="comments" label="备注" ></el-table-column>
        <el-table-column prop="filename" label="文件名"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button size="small" @click="showEditDialog(scope.$index,scope.row)">编辑</el-button>
            <el-button type="danger" @click="delBook(scope.$index,scope.row)" size="small">删除</el-button>
            <el-button type="small" @click="uploadContract(scope.$index,scope.row)" size="small">上传</el-button>
            <el-button type="small" @click="exportContract(scope.$index,scope.row)" size="small">下载</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--工具条-->
      <el-col :span="24" class="toolbar">
        <el-button type="danger" @click="batchDeleteBook" :disabled="this.sels.length===0">批量删除</el-button>
        <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :total="total"
                       style="float:right;">
        </el-pagination>
      </el-col>
      <!--edit dialog-->
      <el-dialog title="编辑" :visible.sync ="editFormVisible" :close-on-click-modal="false">
        <el-form :model="editForm" label-width="100px" :rules="editFormRules" ref="editForm">
          <el-form-item label="序号" prop="serialnum">
            <el-input v-model="editForm.serialnum" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="合同名称" prop="contractname">
            <el-input v-model="editForm.contractname" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="用途" prop="contractusage">
            <el-input v-model="editForm.contractusage" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="签约方" prop="signedPart">
            <el-input v-model="editForm.signedPart" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="comments">
            <el-input type="textarea" v-model="editForm.comments" :rows="8"></el-input>
          </el-form-item>
          </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="editFormVisible = false">取消</el-button>
          <el-button type="primary" @click.native="editSubmit">提交</el-button>
        </div>
      </el-dialog>

      <!--新增界面-->
      <el-dialog title="新增合同" :visible.sync ="addFormVisible" :close-on-click-modal="false">
        <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
          <el-form-item label="序号" prop="serialnum">
            <el-input v-model="addForm.serialnum" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="合同名称" prop="contractname">
            <el-input v-model="addForm.contractname" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="用途" prop="contractusage">
            <el-input v-model="addForm.contractusage" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="签约方" prop="signedPart">
            <el-input v-model="addForm.signedPart" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="comments">
            <el-input type="textarea" v-model="addForm.comments" :rows="8"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="addFormVisible = false">取消</el-button>
          <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
        </div>
      </el-dialog>
    <!--upload file-->
     <el-dialog title="上传数据" :visible.sync ="uploadContractVisible" :close-on-click-modal="false">
        <el-form   label-width="80px"  >
          <el-form-item>
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
          </el-form-item>
        
        </el-form>
        
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="importExcelVisible = false">取消</el-button>
          <el-button type="primary" @click.native="addSubmitFundSource" :loading="addLoading">提交</el-button>
        </div>
      </el-dialog>
    </el-col>
  </el-row>
</template>
<script>
import uploaddialog from "../common/uploadContract"
import config from '../../config.js'

  export default{
    data(){
      return {
        filters: {
          name: ''
        },
        result: [],
        total: 0,
        page: 1,
        limit: 10,
        loading: false,
        sels: [], //列表选中列

        uploadContractVisible:false,
        uploadContractTid: '',
        //编辑相关数据
        editFormVisible: false,//编辑界面是否显示
        editFormRules: {
          serialnum: [
            {required: true, message: '请输入序列号', trigger: 'blur'}
          ],
          author: [
            {required: true, message: '请输入作者', trigger: 'blur'}
          ],
          description: [
            {required: true, message: '请输入简介', trigger: 'blur'}
          ]
        },
        editForm: {
          id: 0,
          serialnum: '',
          contractname: '',
          contractusage: '',
          signedPart: '',
		      comments:''
        },

        //新增相关数据
        addFormVisible: false,//新增界面是否显示
        addLoading: false,
        addFormRules: {
          serialnum: [
            {required: true, message: '请输入序列号', trigger: 'blur'}
          ],
          author: [
            {required: true, message: '请输入作者', trigger: 'blur'}
          ],
          description: [
            {required: true, message: '请输入简介', trigger: 'blur'}
          ]
        },
        addForm: {
          filename: '',
          serialnum: '',
          contractname: '',
          contractusage: '',
          signedPart: '',
		      comments:''
        },

      /*upload  contract part*/
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
      }
    },
    components: {
            
            uploaddialog:uploaddialog
        },
    methods: {
    submitUpload() {
       
          this.formdata.tid = this.uploadContractTid;
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
      },
    exportContract:function(index,row)
    {
        let that = this;
        
         window.location.href  = config.serviceUrl+this.$global.remote().zhideContractExport+"?id="+row.tid
       
    },
      uploadContract(index,row)
      {
          this.uploadContractVisible = true;
          console.log("select row tid:"+row.tid)
          this.$global.remote().zhideTid = row.tid;
          this.uploadContractTid = row.tid;
      },
      handleCurrentChange(val) {
        this.page = val;
        this.search();
      },
      handleSearch(){
        this.total = 0;
        this.page = 1;
        this.search();
      },
      search(){
        let that = this;
        let params = {
        };
      that.loading = true;
        
      that.$http.get(this.$global.remote().zhideContractList, params, response => {
          console.log("get zhide contract list")
          if (that.$tools.isNotEmpty(response.result)) {
            
            that.loading = false;
            
            that.total = response.result.length
            that.result = response.result;
          }

          if(response.result.length == 0)
            this.$message("查询结束,没有结果")
          that.loading = false;
      },fail => {
          console.log(fail);
      })

        
       
        
      },
      selsChange: function (sels) {
        this.sels = sels;
      },
      //删除
      delBook: function (index, row) {
        let that = this;
        this.$confirm('确认删除该记录吗?', '提示', {type: 'warning'}).then(() => {
          that.loading = true;
          let params=Object.assign({}, row);
           this.$http.post(this.$global.remote().zhideContractDelete, params, response => {
                
                console.log(response.result)
                this.$message("数据删除成功");
                this.loading = false;
                
              
            },fail =>{
                self.tips = fail.message;
                this.loading = false;
            });
          that.loading = false;
        }).catch(() => {
        });
      },
      //显示编辑界面
      showEditDialog: function (index, row) {
        this.editFormVisible = true;
        this.editForm = Object.assign({}, row);
      },
      //编辑
      editSubmit: function () {
        let that = this;
        this.$refs.editForm.validate((valid) => {
          if (valid) {
            this.loading = true;
            let params = Object.assign({}, this.editForm);
            console.log(params)
             this.$http.post(this.$global.remote().zhideContractUpdate, params, response => {
                
                console.log(response.result)
                this.$message("数据更新成功");
                this.loading = false;
                that.editFormVisible = false;
              
            },fail =>{
                self.tips = fail.message;
                that.editFormVisible = false;
                this.loading = false;
            });
            
          }
        });
      },
      showAddDialog: function () {
        this.addFormVisible = true;
        this.addForm = {
          serialnum: '',
          contractname: '',
          contractusage: '',
          signedPart: '',
		      comments:''
        };
      },
      //新增
      addSubmit: function () {
        let that = this;
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            that.loading = true;
            let para = Object.assign({}, this.addForm);
            console.log(para)

          
            let params = {
                serialnum: this.addForm.serialnum,
                contractname: this.addForm.contractname,
                contractusage: this.addForm.contractusage,
                signedPart: this.addForm.signedPart,
                comments:this.addForm.comments
            };
                
            this.$http.post(this.$global.remote().zhideContractInsert, params, response => {
                
                console.log(response.result)
                this.$message("数据添加成功");
                this.loading = false;
                this.addFormVisible = false;
              
            },fail =>{
                self.tips = fail.message;
                
            });
            
          }
        });
      },
      //批量删除
      batchDeleteBook: function () {
        let ids = this.sels.map(item => item.id).toString();
        let that = this;
        this.$confirm('确认删除选中记录吗？', '提示', {
          type: 'warning'
        }).then(() => {
          that.loading = true;
          API.removeBatch(ids).then(function (result) {
            that.loading = false;
            if (result && parseInt(result.errcode) === 0) {
              that.$message.success({showClose: true, message: '删除成功', duration: 1500});
              that.search();
            }
          }, function (err) {
            that.loading = false;
            that.$message.error({showClose: true, message: err.toString(), duration: 2000});
          }).catch(function (error) {
            that.loading = false;
            console.log(error);
            that.$message.error({showClose: true, message: '请求出现异常', duration: 2000});
          });
        }).catch(() => {

        });
      }
    },
    mounted() {
     // this.handleSearch()
    }
  }
</script>

<style>
  .demo-table-expand label {
    font-weight: bold;
  }
</style>
