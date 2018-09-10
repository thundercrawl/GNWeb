<template>
  <el-row class="warp">
    <el-col :span="24">
      
      <div class="grid-content"></div>
    </el-col>

    <el-col :span="24">
    </el-col>

    <el-col :span="24" class="warp-main" v-loading="loading" element-loading-text="拼命加载中">
      <!--工具条-->
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true" :model="filters">
          <el-form-item>
            <dateClum ref="dateClum"></dateClum>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" v-on:click="handleSearch">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button  v-if="this.$global.haveUserPermissionNotRole('/expenseVelocity/edit')" type="primary" @click="showAddDialog">新建</el-button>
          </el-form-item>
          <!--
          <el-form-item>
            
            <p ><a class="customizedUnClass" v-if="this.$global.haveUserPermissionNotRole('/expenseVelocity/edit')"  @click="showAddCompanyDialog">>添加新资金来源方</a></p>
          </el-form-item>
           -->
          <el-form-item>
            
            <el-button v-if="this.$global.haveUserPermissionNotRole('/expenseVelocity/edit')" type="text" @click="showAddCompanyDialog">>添加新资金来源方</el-button>
          </el-form-item>
         
          
        </el-form>
      </el-col>

      <div class="customizedGrayFont">单位: 万元</div>
      <el-table border stripe :data="result" highlight-current-row @selection-change="selsChange"
                style="width: 100%;" :row-class-name="customizedGrayFont">
        <el-table-column type="selection"></el-table-column>
        <el-table-column type="index" label="序号" width="60px"></el-table-column>
        <el-table-column prop="fundSource" label="资金来源方"  ></el-table-column>
        <el-table-column prop="fundSum" label="资金总额"  ></el-table-column>
        <el-table-column prop="fundUsage" label="资金用途"  ></el-table-column>
        <el-table-column prop="monthlyFundSum" label="月可放款总额" ></el-table-column>
        <el-table-column prop="alreadyLentFundSum" label="已放款总额" ></el-table-column>
        <el-table-column prop="leftFundSum" label="当月剩余款项" ></el-table-column>
        <el-table-column v-if="this.$global.haveUserPermissionNotRole('/expenseVelocity/edit')" label="操作" width="150">
          <template slot-scope="scope">
            <el-button size="small"  @click="showEditDialog(scope.$index,scope.row)">编辑</el-button>
            <el-button type="danger" @click="deleteItem(scope.$index,scope.row)" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    <el-col :span="24">
      
      <div class="grid-content"></div>
    </el-col>
      <!--工具条-->
      <el-col :span="24" class="toolbar">
        <!--
        <el-button type="danger" @click="batchDeleteBook" :disabled="this.sels.length===0">批量删除</el-button>
        
        <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :total="total"
                       style="float:center;">
        </el-pagination>
        -->
        <el-button type="primary" v-on:click="exportExcel('date')" style="float:right;">导出excel</el-button>
        <el-button v-if="this.$global.haveUserPermissionNotRole('/expenseVelocity/excelI')" type="primary" v-on:click="importExcel" style="float:right;position:relative;right:5px">导入excel</el-button>
        <el-button type="primary" v-on:click="exportExcel('')" style="float:right;right:10px">导出所有excel</el-button>
        
      </el-col>


      <!--edit-->
      <el-dialog title="编辑" :visible.sync ="editFormVisible" :close-on-click-modal="false">
        <el-form :model="editForm" label-width="100px" :rules="editFormRules" ref="editForm">
             
          <el-form-item label="创建日期">
            <el-date-picker type="date" placeholder="选择日期" v-model="editForm.fundDate"></el-date-picker>
          </el-form-item>

          <el-form-item label="资金来源">
                    <el-select v-model="editForm.fundSource" placeholder="请选择">
                        
                        <el-option v-for="item in fundEfficientCompanySelectItems" :label="item.company" :value="item.key" :key="item.key"></el-option>
                    </el-select>
        </el-form-item>
        
        <el-form-item label="资金总额" prop="fundSum">
            <el-input v-model="editForm.fundSum" auto-complete="off"></el-input>
          </el-form-item>

           <el-form-item label="资金用途">
                    <el-select v-model="editForm.fundUsage" placeholder="请选择">
                        
                        <el-option v-for="item in fundEfficientFundUsageSelectItems" :label="item.label" :value="item.key" :key="item.key"></el-option>
                    </el-select>
        </el-form-item>
          <el-form-item label="月可放款总额" prop="monthlyFundSum">
            <el-input v-model="editForm.monthlyFundSum" auto-complete="off"></el-input>
          </el-form-item>

          <el-form-item label="已放款总额" prop="alreadyLentFundSum">
            <el-input v-model="editForm.alreadyLentFundSum" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="当月剩余款项" prop="leftFundSum">
            <el-input v-model="editForm.leftFundSum" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="editFormVisible = false">取消</el-button>
          <el-button type="primary" @click.native="editSubmit">提交</el-button>
        </div>
      </el-dialog>

      <!--add fund efficient-->
      <el-dialog title="新增资金" :visible.sync ="addFormVisible" :close-on-click-modal="false">
        <el-form :model="addForm" label-width="120px" :rules="addFormRules" ref="addForm">
          
          <el-form-item label="创建日期" prop="fundDate">
            <el-date-picker type="date" placeholder="选择日期" v-model="addForm.fundDate"></el-date-picker>
          </el-form-item>

          <el-form-item label="资金来源" prop="fundSource">
                    <el-select v-model="fundEfficientCompanySelect" placeholder="请选择">
                        
                        <el-option v-for="item in fundEfficientCompanySelectItems" :label="item.company" :value="item.key" :key="item.key"></el-option>
                    </el-select>
                     
        </el-form-item>
        
        <el-form-item label="资金总额" prop="fundSum">
            <el-input v-model="addForm.fundSum" auto-complete="off"></el-input>
          </el-form-item>

           <el-form-item label="资金用途" prop="fundUsage">
                    <el-select v-model="fundEfficientFundUsageSelect" placeholder="请选择">
                        
                        <el-option v-for="item in fundEfficientFundUsageSelectItems" :label="item.label" :value="item.key" :key="item.key"></el-option>
                    </el-select>
                      <el-button type="text" @click="showAddFundUsageDialog" auto-complete="off"> 添加修改>></el-button>
        </el-form-item>
        

          <el-form-item label="月可放款总额" prop="monthlyFundSum">
            <el-input v-model="addForm.monthlyFundSum" auto-complete="off"></el-input>
          </el-form-item>

          <el-form-item label="已放款总额" prop="alreadyLentFundSum">
            <el-input v-model="addForm.alreadyLentFundSum" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="当月剩余款项" prop="leftFundSum">
            <el-input v-model="addForm.leftFundSum" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>


        <div slot="footer" class="dialog-footer">
          <el-button @click.native="addFormVisible = false">取消</el-button>
          <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
        </div>
      </el-dialog>
      <!-- add fundusage-->
      <el-dialog title="新增资金用途" :visible.sync ="addFundUsageFormVisible" :close-on-click-modal="false" width="300">
        <el-form :model="addFundUsageForm" label-width="180px"  :rules="addFundUsageFormRules"  ref="addFundUsageForm">
          <el-form-item label="资金用途" prop="fundUsage">
            <el-input v-model="addFundUsageForm.fundUsage" auto-complete="off"></el-input>
          </el-form-item>
           
           
         

        </el-form>
        
        <div slot="footer" class="dialog-footer">
          
          <el-button type="text" @click.native="showAddFundUsageTable" style="float:left"> 管理资金用途>></el-button>
          <el-button type="text" @click.native="disableAddFundUsageTable" style="float:left" v-show="showFundUsageTableVisible"> <<收起列表</el-button>
          <el-button @click.native="addFundUsageFormVisible = false">取消</el-button>
          <el-button type="primary" @click.native="addFundUsageSubmit" :loading="addLoading">提交</el-button>

        
        <el-table border stripe :data="fundUsageResult" highlight-current-row @selection-change="selsChange"
                style="width: 100%;" :row-class-name="customizedGrayFont" v-show="showFundUsageTableVisible">
        <el-table-column type="selection"></el-table-column>
        <el-table-column type="index" label="序号" width="60px"></el-table-column>
        <el-table-column prop="fundUsage" label="资金用途"  ></el-table-column>
        
        <el-table-column v-if="this.$global.haveUserPermissionNotRole('/expenseVelocity/edit')" label="操作" width="150">
          <template slot-scope="scope">
           <el-button size="small"  @click="showFundUsageEditDialog(scope.$index,scope.row)">编辑</el-button>
            <el-button type="danger" @click="deleteItemFundUsage(scope.$index,scope.row)" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    
        
        </div>
      </el-dialog>


      <el-dialog title="编辑资金用途" :visible.sync ="editFundUsageFormVisible" :close-on-click-modal="false" width="300">
        <el-form :model="editFundUsageForm" label-width="180px"   :rules="editFundUsageFormRules" ref="editFundUsageForm">
          <el-form-item label="资金用途" prop="fundUsage">
            <el-input v-model="editFundUsageForm.fundUsage" auto-complete="off"></el-input>
          </el-form-item>
           
           
         

        </el-form>
        
        <div slot="footer" class="dialog-footer">
        
          <el-button @click.native="editFundUsageFormVisible = false">取消</el-button>
          <el-button type="primary" @click.native="editFundUsageSubmit" :loading="addLoading">提交</el-button>       
        </div>
      </el-dialog>

      <!--add fundsource-->
      <el-dialog title="新增资金来源公司" :visible.sync ="addCompanyFormVisible" :close-on-click-modal="false" width="300">
        <el-form :model="addCompanyForm" label-width="180px"  :rules="addFormCompanyRules"  ref="addCompanyForm">
          <el-form-item label="资金来源公司" prop="company">
            <el-input v-model="addCompanyForm.company" auto-complete="off"></el-input>
          </el-form-item>
           
           
         

        </el-form>
        
        <div slot="footer" class="dialog-footer">
          
          <el-button type="text" @click.native="showAddCompanyTable" style="float:left"> 管理公司列表>></el-button>
          <el-button type="text" @click.native="disableAddCompanyTable" style="float:left" v-show="showCompanyTableVisible"> <<收起列表</el-button>
          <el-button @click.native="addCompanyFormVisible = false">取消</el-button>
          <el-button type="primary" @click.native="addCompanySubmit" :loading="addLoading">提交</el-button>

        
        <el-table border stripe :data="companyResult" highlight-current-row @selection-change="selsChange"
                style="width: 100%;" :row-class-name="customizedGrayFont" v-show="showCompanyTableVisible">
        <el-table-column type="selection"></el-table-column>
        <el-table-column type="index" label="序号" width="60px"></el-table-column>
        <el-table-column prop="company" label="资金来源公司"  ></el-table-column>
        
        <el-table-column v-if="this.$global.haveUserPermissionNotRole('/expenseVelocity/edit')" label="操作" width="150">
          <template slot-scope="scope">
           <el-button size="small"  @click="showCompanyEditDialog(scope.$index,scope.row)">编辑</el-button>
            <el-button type="danger" @click="deleteItemCompany(scope.$index,scope.row)" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    
        
        </div>
      </el-dialog>


      <el-dialog title="编辑资金来源公司" :visible.sync ="editCompanyFormVisible" :close-on-click-modal="false" width="300">
        <el-form :model="editCompanyForm" label-width="180px"   :rules="editCompanyFormRules" ref="editCompanyForm">
          <el-form-item label="资金来源公司" prop="company">
            <el-input v-model="editCompanyForm.company" auto-complete="off"></el-input>
          </el-form-item>
           
           
         

        </el-form>
        
        <div slot="footer" class="dialog-footer">
        
          <el-button @click.native="editCompanyFormVisible = false">取消</el-button>
          <el-button type="primary" @click.native="editCompanySubmit" :loading="addLoading">提交</el-button>

        
    
        
        </div>
      </el-dialog>
    <!--a'd'd import excel-->
         <el-dialog title="导入Excel" :visible.sync ="importExcelVisible" :close-on-click-modal="false">
        <el-form :model="importExcelSource" label-width="80px"  >
          <el-form-item>
            <uploaddialog></uploaddialog>
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

  import dateClum from "../common/dateClum"
  import uploaddialog from "../common/upload"
  import axios from 'axios';
  import Config from '../../config';


  export default{
    data(){
      return {
        filters: {
          name: ''
        },
        fundUsageResult:[],
        companyResult:[],
        result: [],
        total: 0,
        page: 1,
        limit: 10,
        loading: false,
        sels: [], //列表选中列

        //编辑相关数据
        editFormVisible: false,//编辑界面是否显示
        editFormRules: {
          name: [
            {required: true, message: '请输入书名', trigger: 'blur'}
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
          fundDate: '',
          fundSource: '',
          fundSum: '',
          fundUsage: '',
          monthlyFundSum: '',
          alreadyLentFundSum: '',
          leftFundSum: ''
        },

        //新增相关数据
        addFormVisible: false,//新增界面是否显示
        addLoading: false,
        addFormRules: {
          fundDate: [
            {required: true, message: '请输入资金创建日期', trigger: 'blur'}
          ],
          fundSource: [
            {required: false, message: '请选择', trigger: 'blur'}
          ],
           fundSum: [
            {required: true, message: '请输入数字',pattern: /\d+/,trigger: 'blur'}
          ],
           fundUsage: [
            {required: false, message: '请选择',trigger: 'blur'}
          ],
           monthlyFundSum: [
            {required: true, message: '请输入数字',pattern: /\d+/,trigger: 'blur'}
          ],
           alreadyLentFundSum: [
            {required: true, message: '请输入数字',pattern: /\d+/,trigger: 'blur'}
          ],
           leftFundSum: [
            {required: true, message: '请输入数字',pattern: /\d+/,trigger: 'blur'}
          ],

        },
        addForm: {
          fundDate: '',
          fundSource: '',
          fundSum: '',
          fundUsage: '',
          monthlyFundSum: '',
          alreadyLentFundSum: '',
          leftFundSum: ''
        },
        fundEfficientFundUsageSelectItems:[
          /*
          {
            value: '0',
            label: '个人直租'
          },
          {
            value: '1',
            label: '网约车回租-新车'
          },
          {
             value: '2',
            label: '网约车回租-库存车'
          }*/
        ],
        importExcelVisible: false,
        fundEfficientFundUsageSelect:'',
        fundEfficientCompanySelectItems: [],
        fundEfficientCompanySelect: '',

        /*fundsource*/
        addCompanyFormVisible: false,
        addCompanyForm: {
          company: ''
        },
        addCompanyFormRules: {
          company: [
            {required: true, message: '请输入融资租赁公司', trigger: 'blur'}
          ]
        },
      
        showCompanyTableVisible:false,

        editCompanyFormVisible:false,
        editCompanyForm:{
          company: ''
        },
        editCompanyFormRules: {
          company: [
            {required: true, message: '请输入融资租赁公司', trigger: 'blur'}
          ]
        },
        /*fundusage*/
        addFundUsageFormVisible: false,
        addFundUsageForm: {
          fundUsage: ''
        },
        addFundUsageFormRules: {
          fundUsage: [
            {required: true, message: '请输入融资租赁公司', trigger: 'blur'}
          ]
        },
      
        showFundUsageTableVisible:false,

        editFundUsageFormVisible:false,
        editFundUsageForm:{
          fundUsage: ''
        },
        editFundUsageFormRules: {
          fundUsage: [
            {required: true, message: '请输入融资租赁公司', trigger: 'blur'}
          ]
        },
      }
    },

    components: {
            dateClum: dateClum,
            uploaddialog:uploaddialog
        },
    methods: {
    
    changeFundUsageItems:function()
    {},
    exportExcel:function(date)
    {
        let that = this;
        let params = {
         name:"fundefficient"
        }
       if(date == '')
       {
            window.location.href  = Config.serviceUrl+"/ExportExcelAllByName?name=fundefficient&date=ALL"
       }
       else
       {
           window.location.href =Config.serviceUrl+"/ExportExcelAllByName?name=fundefficient&"+"date="+this.$global.dateColumn().yearvalue+"-"+this.$global.dateColumn().monthvalue
       }
        console.log("download excel for all:"+params.name)
        /*
        that.$http.get("/ExportExcelAllByName", params, response => {
            console.log("downdload finished");
         },fail => {
                    console.log(fail);
                })
                */
            
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
          t1:this.$global.dateColumn().yearvalue+"-"+this.$global.dateColumn().monthvalue+"-"+"01",
          t2:this.$global.dateColumn().yearvalue+"-"+this.$global.dateColumn().monthvalue+"-"+"31"
        };
        if(this.$global.dateColumn().yearvalue=='') 
        {
          this.$alert("查询年份不能为空")
          return;
        }
        if(this.$global.dateColumn().monthvalue=='') 
        {
          this.$alert("查询月份不能为空")
          return;
        }
        that.loading = true;
        console.log("search data by month:"+params.t1)
        that.$http.get(that.$global.remote().fundEfficientListByMonth, params, response => {
            that.loading = false;
            if(response.result.length == 0)
            this.$message("查询结束,没有结果")
            console.log("result:"+response.result)
            if (response.result) {
            that.total = response.result.length
            that.result = response.result;
            console.log("result:"+that.result)
            
          }
         },fail => {
          that.loading = false;
          that.$message.error({showClose: true, message: "status:"+fail.status+" message:"+fail.message, duration: 2000});
          //console.log(fail);
                })
        
        /*
        API.findList(params).then(function (result) {
          that.loading = false;
          if (result && result.books) {
            that.total = result.total;
            that.books = result.books;
          }
        }, function (err) {
          that.loading = false;
          that.$message.error({showClose: true, message: err.toString(), duration: 2000});
        }).catch(function (error) {
          that.loading = false;
          console.log(error);
          that.$message.error({showClose: true, message: '请求出现异常', duration: 2000});
        });*/

      },
      searchCompany:function()
      {
        this.$http.get(this.$global.remote().fundEfficientCompanyList,{},response =>
          {
            this.companyResult = response.result
          
          },fail=>
          {
            this.$message("操作出错,状态:"+fail.status+"消息:"+fail.message)
          }); 

      },
      searchFundUsage:function()
      {
         this.$http.get(this.$global.remote().fundEfficientFundUsageList,{},response =>
          {
             let items = []
            let item = ''
            for(item in response.result)
            {
              let values ={}
              values.label = response.result[item].fundUsage
              values.key = item
              items.push(values)
              }
            this.fundEfficientFundUsageSelectItems = items
            this.fundUsageResult = response.result
          },fail=>
          {
            this.$message("操作出错,状态:"+fail.status+"消息:"+fail.message)
          }); 
      },
      selsChange: function (sels) {
        this.sels = sels;
      },
      //删除
      deleteItem: function (index, row) {
        let that = this;
        this.$confirm('确认删除该记录吗?', '提示', {type: 'warning'}).then(() => {
          that.loading = true;
         
          //let params=Object.assign({}, row);
          let params = {}
          params.tid = row.tid;
           this.$http.post(this.$global.remote().fundEfficientDelete, params, response => {
                
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
      deleteItemFundUsage:function(index, row)
       {
        let that = this;
        this.$confirm('确认删除该记录吗?', '提示', {type: 'warning'}).then(() => {
         
          //let params=Object.assign({}, row);
          let params = {}
          params.tid = row.tid;
           this.$http.post(this.$global.remote().fundEfficientFundUsageDelete, params, response => {
 
                this.$message("数据删除成功");
                
      
            },fail =>{
                self.tips = fail.message;
               
            });

        }).catch(() => {
        });
      },
      deleteItemCompany:
      function (index, row) {
        let that = this;
        this.$confirm('确认删除该记录吗?', '提示', {type: 'warning'}).then(() => {
         
          //let params=Object.assign({}, row);
          let params = {}
          params.tid = row.tid;
           this.$http.post(this.$global.remote().fundEfficientCompanyDelete, params, response => {
 
                this.$message("数据删除成功");
            this.searchCompany()
            },fail =>{
                self.tips = fail.message;
               
            });

        }).catch(() => {
        });
      },
      //显示编辑界面
      showEditDialog: function (index, row) {
        this.editFormVisible = true;
        this.editForm = Object.assign({}, row);
        let item = ''
        for(item in this.fundEfficientCompanySelectItems)
        {
          if(this.fundEfficientCompanySelectItems[item].company == row.fundSource)
            this.editForm.fundSource = item
        }
        console.log("found fundSource item:"+item)

        item = ''
        for(item in this.fundEfficientFundUsageSelectItems)
        {
          if(this.fundEfficientFundUsageSelectItems[item].label == row.fundUsage)
            this.editForm.fundUsage = item
        }
        console.log("found foundusage item:"+item)
       // this.editForm.fundSource = 
      },

       showCompanyEditDialog: function (index, row) {
        this.editCompanyFormVisible = true;
        this.editCompanyForm = Object.assign({}, row);
      
       // this.editForm.fundSource = 
      },
      
       showFundUsageEditDialog: function (index, row) {
        this.editFundUsageFormVisible = true;
        this.editFundUsageForm = Object.assign({}, row);
      
       // this.editForm.fundSource = 
      },
       editFundUsageSubmit:function()
      {
         let that = this;
        this.$refs.editFundUsageForm.validate((valid) => {
          if (valid) {
            if (valid) {
            that.loading = true;
            let params = Object.assign({}, this.editFundUsageForm);
           
          this.$http.post(this.$global.remote().fundEfficientFundUsageUpdate, params, response => {
                
                console.log(response.result)
                this.loading = false;
                that.editFundUsageFormVisible = false;
                this.$message("编辑资金用途成功");
                this.searchFundUsage();
            },fail =>{
                self.tips = fail.message;
                that.editCompanyFormVisible = false;
                this.loading = false;
            });
          }
          }
        });
      },
      editCompanySubmit:function()
      {
         let that = this;
        this.$refs.editCompanyForm.validate((valid) => {
          if (valid) {
            if (valid) {
            that.loading = true;
            let params = Object.assign({}, this.editCompanyForm);
           
          this.$http.post(this.$global.remote().fundEfficientCompanyUpdate, params, response => {
                
                console.log(response.result)
                this.loading = false;
                that.editCompanyFormVisible = false;
                this.$message("编辑资金来源成功");
                        
                    this.$http.get(this.$global.remote().fundEfficientCompanyList,{},response =>
                    {
                      this.companyResult = response.result
                    
                    },fail=>
                    {
                      this.$message("操作出错,状态:"+fail.status+"消息:"+fail.message)
                    }); 
            },fail =>{
                self.tips = fail.message;
                that.editCompanyFormVisible = false;
                this.loading = false;
            });
          }
          }
        });
      },
      //编辑
      editSubmit: function () {
         let that = this;
        this.$refs.editForm.validate((valid) => {
          if (valid) {
            if (valid) {
            that.loading = true;
            let params = Object.assign({}, this.editForm);
          
            console.log("found source:"+params.fundSource)
            params.fundUsage = this.fundEfficientFundUsageSelectItems[this.editForm.fundUsage].label
            params.fundSource = this.fundEfficientCompanySelectItems[this.editForm.fundSource].company
         
           
          this.$http.post(this.$global.remote().fundEfficientUpdate, params, response => {
                
                console.log(response.result)
                this.loading = false;
                that.editFormVisible = false;
                this.$message("编辑业务成功");
               
              
            },fail =>{
                self.tips = fail.message;
                that.editFormVisible = false;
                this.loading = false;
            });
          }
          }
        });
      },
      showAddDialog: function () {
        this.addFormVisible = true;
        this.addForm = {
          fundDate: '',
          fundSource: '',
          fundSum: '',
          fundUsage: '',
          monthlyFundSum: '',
          alreadyLentFundSum: '',
          leftFundSum: ''
        };
      },
      showAddCompanyDialog: function () {
        this.addCompanyFormVisible = true;
        this.showCompanyTableVisible = false;
        this.addCompanyForm = {
          company: ''
        };
      },
       showAddFundUsageDialog: function () {
        this.addFundUsageFormVisible = true;
        this.showFundUsageTableVisible = false;
        this.addFundUsageForm = {
          fundUsage: ''
        };
      },
      showAddCompanyTable: function() {
        console.log("show add company table")
        this.showCompanyTableVisible = true;
        
         this.$http.get(this.$global.remote().fundEfficientCompanyList,{},response =>
          {
            this.companyResult = response.result
          
          },fail=>
          {
            this.$message("操作出错,状态:"+fail.status+"消息:"+fail.message)
          }); 


      },
      showAddFundUsageTable: function() {
     
        this.showFundUsageTableVisible = true;
        
         this.$http.get(this.$global.remote().fundEfficientFundUsageList,{},response =>
          {
            this.fundUsageResult = response.result
          
          },fail=>
          {
            this.$message("操作出错,状态:"+fail.status+"消息:"+fail.message)
          }); 


      },
      disableAddCompanyTable: function()
      {
        this.showCompanyTableVisible = false;
        
      },
      disableAddFundUsageTable: function()
      {
        this.showFundUsageTableVisible = false;
      },
      importExcel:function()
      {
          this.importExcelVisible = true;
          this.$global.componentSelect().name = "fundefficient";
      },
      importExcel:function()
      {
          this.importExcelVisible = true;
          this.$global.componentSelect().name = "fundefficient";
      },

      
      //add
      addSubmit: function () {
         let that = this;
        that.$refs.addForm.validate((valid) => {
          if (valid) {
            that.loading = true;
            let params = Object.assign({}, that.addForm);
            params.fundUsage = this.fundEfficientFundUsageSelectItems[this.fundEfficientFundUsageSelect].label
            params.fundSource = this.fundEfficientCompanySelectItems[this.fundEfficientCompanySelect].company      
          that.$http.post(this.$global.remote().fundEfficientInsert, params, response => {
              
                console.log(response.result)
                this.loading = false;
                that.addFormVisible = false;
                this.$message("新建资金条目成功");
               
              
            },fail =>{
                self.tips = fail.message;
                that.addFormVisible = false;
                this.loading = false;
            });
          }
        });
      },

      //add company
      addCompanySubmit: function () {
        let that = this;
        that.$refs.addCompanyForm.validate((valid) => {
          if (valid) {
            that.loading = true;
            let params = Object.assign({}, that.addCompanyForm);       
          that.$http.post(this.$global.remote().fundEfficientCompanyInsert, params, response => {
              
                console.log(response.result)
                this.loading = false;
                that.addCompanyFormVisible = false;
                this.$message("添加租赁资金公司成功");
               
              
            },fail =>{
                self.tips = fail.message;
                that.addCompanyFormVisible = false;
                this.loading = false;
            });
          }
        });
      },

      //add fundusage
      addFundUsageSubmit: function () {
        let that = this;
        that.$refs.addFundUsageForm.validate((valid) => {
          if (valid) {
            that.loading = true;
            let params = Object.assign({}, that.addFundUsageForm);       
          that.$http.post(this.$global.remote().fundEfficientFundUsageInsert, params, response => {
              
                console.log(response.result)
                this.loading = false;
                that.addFundUsageFormVisible = false;
                this.$message("添加资金用途成功");
               this.searchFundUsage()
              
            },fail =>{
                self.tips = fail.message;
                that.addFundUsageFormVisible = false;
                this.loading = false;
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


            this.$http.get(this.$global.remote().fundEfficientCompanyList,{},response =>
          {
            
            let items = []
            let item = ''
            for(item in response.result)
            {
              let values ={}
              values.company = response.result[item].company
              values.key = item
              items.push(values)
              }
            this.fundEfficientCompanySelectItems = items
          
          },fail=>
          {
            this.$message("操作出错,状态:"+fail.status+"消息:"+fail.message)
          }); 
          
          this.searchFundUsage();

    }
  }
</script>

<style>
  .demo-table-expand label {
    font-weight: normal;
  };
 
.customizedUnClass
{
  font-size: 18px;
  font: Arial;
  color:#6586c7;
}
</style>
