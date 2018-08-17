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
            <dateClum ref="dateClum"></dateClum>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" v-on:click="handleSearch">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" v-on:click="showAddDialog">新建</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="showAddDialogCity">添加新城市</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="showAddDialogCompany">添加新公司</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="showAddDialogCartype">添加新车型</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" v-on:click="exportExcel('date')">导出excel</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" v-on:click="exportExcel('')">导出所有excel</el-button>
          </el-form-item>
          <el-form-item>
            <el-button v-if="this.$global.haveUserPermissionNotRole('/kunpengBussiness/excelI')" type="primary" v-on:click="importExcel">导入excel</el-button>
          </el-form-item>
        </el-form>
      </el-col>

       <div class="customizedGrayFont">单位: 万元</div>
      <!--列表-->
      <el-table border stripe :data="result" highlight-current-row @selection-change="selsChange"
                style="width: 100%;">
        <el-table-column type="selection"></el-table-column>
        <el-table-column type="index" label="序号" width="60px"></el-table-column>
        <el-table-column prop="city" label="城市" ></el-table-column>
        <el-table-column prop="company" label="公司" ></el-table-column>
        <el-table-column prop="cartype" label="车型" ></el-table-column>
        <el-table-column prop="beianpeople" label="备案人数" ></el-table-column>
        <el-table-column prop="passedpeople" label="过审人数" ></el-table-column>
        <el-table-column prop="ordertime" label="下单时间" ></el-table-column>
        <el-table-column prop="finishtime" label="完成时间" ></el-table-column>
        <el-table-column prop="finishpeople" label="完成人数" ></el-table-column>
        <el-table-column prop="fundsum" label="总融资额" ></el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button size="small" @click="showEditDialog(scope.$index,scope.row)">编辑</el-button>
            <el-button type="danger" size="small" @click="deleteItem(scope.$index,scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--
      <el-col :span="24" class="toolbar">
        <el-button type="danger" @click="batchDeleteBook" :disabled="this.sels.length===0">批量删除</el-button>
        <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :total="total"
                       style="float:right;">
        </el-pagination>-->
      </el-col>

    <!-- edit dialog -->
      <el-dialog title="编辑" :visible.sync ="editFormVisible" :close-on-click-modal="false">
        <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
          
         
          <el-form-item label="创建日期">
            <el-date-picker type="date" placeholder="选择日期" v-model="editForm.kunpengDate"></el-date-picker>
          </el-form-item>

          <el-form-item label="城市">
                    <el-select v-model="editForm.city" placeholder="请选择">
                        
                        <el-option v-for="item in kunpengcitySelectCities" :label="item.city" :value="item.key" :key="item.key"></el-option>
                    </el-select>
        </el-form-item>
        <el-form-item label="公司">
                    <el-select v-model="editForm.company" placeholder="请选择">
                        
                        <el-option v-for="item in kunpengcitySelectCompany" :label="item.company" :value="item.key" :key="item.key"></el-option>
                    </el-select>
        </el-form-item>
         <el-form-item label="车型">
                    <el-select v-model="editForm.cartype" placeholder="请选择">
                        
                        <el-option v-for="item in kunpengcitySelectCartype" :label="item.cartype" :value="item.key" :key="item.key"></el-option>
                    </el-select>
        </el-form-item>
        <el-form-item label="备案人数"  prop="beianpeople">
            <el-input v-model="editForm.beianpeople" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="过审人数" prop="passedpeople">
            <el-input v-model="editForm.passedpeople" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="下单时间" prop="ordertime">
            <el-date-picker type="date" placeholder="选择日期" v-model="editForm.ordertime"></el-date-picker>
          </el-form-item>
          <el-form-item label="完成时间" prop="finishtime">
            <el-date-picker type="date" placeholder="选择日期" v-model="editForm.finishtime"></el-date-picker>
          </el-form-item>
          <el-form-item label="完成人数" prop="finishpeople">
            <el-input v-model="editForm.finishpeople" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="总融资额" prop="fundsum">
            <el-input v-model="editForm.fundsum" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="editFormVisible = false">取消</el-button>
          <el-button type="primary" @click.native="editSubmit">提交</el-button>
        </div>
      </el-dialog>

      <!--新增kunpeng-->
      <el-dialog title="新增业务" :visible.sync ="addFormVisible" :close-on-click-modal="false">
        <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
          
         
          <el-form-item label="创建日期" prop="kunpengDate">
            <el-date-picker type="date" placeholder="选择日期" v-model="addForm.kunpengDate"></el-date-picker>
          </el-form-item>

          <el-form-item label="城市" prop="city">
                    <el-select v-model="addForm.city" placeholder="请选择">
                        
                        <el-option v-for="item in kunpengcitySelectCities" :label="item.city" :value="item.key" :key="item.key"></el-option>
                    </el-select>
        </el-form-item>
        <el-form-item label="公司" prop="company">
                    <el-select v-model="addForm.company" placeholder="请选择">
                        
                        <el-option v-for="item in kunpengcitySelectCompany" :label="item.company" :value="item.key" :key="item.key"></el-option>
                    </el-select>
        </el-form-item>
         <el-form-item label="车型" prop="cartype">
                    <el-select v-model="addForm.cartype" placeholder="请选择">
                        
                        <el-option v-for="item in kunpengcitySelectCartype" :label="item.cartype" :value="item.key" :key="item.key"></el-option>
                    </el-select>
        </el-form-item>
        <el-form-item label="备案人数"  prop="beianpeople">
            <el-input v-model="addForm.beianpeople" placeholder="只接受数字" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="过审人数"  prop="passedpeople">
            <el-input v-model="addForm.passedpeople" placeholder="只接受数字" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="下单时间" prop="ordertime">
            <el-date-picker type="date" placeholder="选择日期" v-model="addForm.ordertime"></el-date-picker>
          </el-form-item>
          <el-form-item label="完成时间" prop="finishtime">
            <el-date-picker type="date" placeholder="选择日期" v-model="addForm.finishtime"></el-date-picker>
          </el-form-item>
          <el-form-item label="完成人数" prop="finishpeople">
            <el-input v-model="addForm.finishpeople"  placeholder="只接受数字" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="总融资额" prop="fundsum">
            <el-input v-model="addForm.fundsum"  placeholder="只接受数字" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="addFormVisible = false">取消</el-button>
          <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
        </div>
      </el-dialog>

    <!-- add city -->
    <!--新增界面-->
      <el-dialog title="新增城市" :visible.sync ="addFormCityVisible" :close-on-click-modal="false">
        <el-form :model="addFormCity" label-width="80px" :rules="addFormCityRules" ref="addFormCity">
          <el-form-item label="城市" prop="city">
            <el-input v-model="addFormCity.city" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="省" prop="province">
            <el-input v-model="addFormCity.province" auto-complete="off"></el-input>
          </el-form-item>
         
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="addFormCityVisible = false">取消</el-button>
          <el-button type="primary" @click.native="addCitySubmit" :loading="addLoading">提交</el-button>
        </div>
      </el-dialog>

      <!-- add company -->
    <!--新增界面-->
      <el-dialog title="新增公司" :visible.sync ="addFormCompanyVisible" :close-on-click-modal="false">
        <el-form :model="addFormCity" label-width="80px" :rules="addFormCityRules" ref="addFormCompany">
          <el-form-item label="公司" prop="company">
            <el-input v-model="addFormCompany.company" auto-complete="off"></el-input>
          </el-form-item>
         
         
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="addFormCompanyVisible = false">取消</el-button>
          <el-button type="primary" @click.native="addCompanySubmit" :loading="addLoading">提交</el-button>
        </div>
      </el-dialog>

      <!-- add cartype -->
    <!--新增界面-->
      <el-dialog title="新增车型" :visible.sync ="addFormCartypeVisible" :close-on-click-modal="false" width="30%">
        <el-form :model="addFormCartype" label-width="100px" :rules="addFormCartypeRules" ref="addFormCartype">
          <el-form-item label="车辆型号" prop="cartype">
            <el-input v-model="addFormCartype.cartype" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="车辆指导价" prop="carsalingprice">
            <el-input v-model="addFormCartype.carsalingprice" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="车辆开票价" prop="carinvoiceprice">
            <el-input v-model="addFormCartype.carinvoiceprice" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="保险" prop="carinsurance">
            <el-input v-model="addFormCartype.carinsurance" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="融资额" prop="investsum">
            <el-input v-model="addFormCartype.investsum" auto-complete="off"></el-input>
          </el-form-item>
         
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="addFormCartypeVisible = false">取消</el-button>
          <el-button type="primary" @click.native="addCartypeSubmit" :loading="addLoading">提交</el-button>
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
 import Config from '../../config';
 import uploaddialog from "../common/upload"
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
        kunpengcitySelect:'',
        kunpengcitySelectCities:[],
        kunpengcompanySelect:'',
        kunpengcitySelectCompany:[],
        kunpengcartypeSelect:'',
        kunpengcitySelectCartype:[],
        importExcelVisible: false,

        //编辑相关数据
        editFormVisible: false,//编辑界面是否显示
        editFormRules: {
          kunpengDate: [
            {required: true, message: '请输入业务创建日期', trigger: 'blur'}
          ],
          
        },
        editForm: {
          id: 0,
          kunpengDate: '',
          city: '',
          company: '',
          cartype: '',
          beianpeople: '',
          passedpeople: '',
          ordertime:'',
          finishtime:'',
          finishpeople:'',
          fundsum:''
        },

        //新增相关数据
        addFormVisible: false,//新增界面是否显示
        addLoading: false,
        addFormRules: {
           kunpengDate: [
            {required: true, message: '', trigger: 'blur'}
          ],
           city: [
            {required: true, message: '', trigger: 'blur'}
          ],
           company: [
            {required: true, message: '', trigger: 'blur'}
          ],
           cartype: [
            {required: true, message: '', trigger: 'blur'}
          ],
           ordertime: [
            {required: true, message: '', trigger: 'blur'}
          ],
           finishtime: [
            {required: true, message: '', trigger: 'blur'}
          ],
          beianpeople: [
            {required: true, pattern: /\d+/, message: '只能输入数字', trigger: 'blur'}
          ],
          passedpeople: [
            {required: true, pattern: /\d+/, message: '只能输入数字', trigger: 'blur'}
          ],
          finishpeople: [
            {required: true,pattern: /\d+/, message: '只能输入数字', trigger: 'blur'}
          ],
          fundsum: [
            {required: true,pattern: /\d+/, message: '只能输入数字', trigger: 'blur'}
          ]
        },
        addForm: {
          kunpengDate: '',
          city: '',
          company: '',
          cartype: '',
          beianpeople: '',
          passedpeople: '',
          ordertime:'',
          finishtime:'',
          finishpeople:'',
          fundsum:''
        },
        addFormCityVisible: false,
        addFormCity:
        {
          city: '',
          province: '',
        },
        addFormCityRules: {
          city: [
            {required: true, message: '请输入城市名', trigger: 'blur'}
          ],
          province: [
            {required: true, message: '请输入省名', trigger: 'blur'}
          ]
        },
        addFormCompanyVisible: false,
        addFormCompany:
        {
          company: '',
        },
        addFormCompanyRules: {
          company: [
            {required: true, message: '请输入公司名', trigger: 'blur'}
          ],
          
        },
        addFormCartypeVisible: false,
        addFormCartype:
        {
          cartype: '',
          carsalingprice: '',
          carinvoiceprice: '',
          carinsurance: '',
          investsum: ''
        },
        addFormCartypeRules: {
          cartype: [
            {required: true, message: '请输入车辆类型 示例：东风日产牌+DFL7203VBL1', trigger: 'blur'}
          ],
          carsalingprice: [
            {required: true, message: '请输入车辆指导价 示例：179,800元', trigger: 'blur'}
          ]
        }

      }
    },
    components: {
            dateClum: dateClum,
           uploaddialog:uploaddialog,
        },
    methods: {

 importExcel:function()
      {
          this.importExcelVisible = true;
          this.$global.componentSelect().name = "kunpeng";
      },
      exportExcel:function(date)
    {
        let that = this;
        let params = {
         name:"kunpeng"
        }
       if(date == '')
       {
            window.location.href  = Config.serviceUrl+"/ExportExcelAllByName?name=kunpeng&date=ALL"
       }
       else
       {
           window.location.href =Config.serviceUrl+"/ExportExcelAllByName?name=kunpeng&"+"date="+this.$global.dateColumn().yearvalue+"-"+this.$global.dateColumn().monthvalue
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
        that.$http.get(this.$global.remote().kunpengListByMonth, params, response => {
          console.log("get kunpeng list")
          if (that.$tools.isNotEmpty(response.result)) {
            
            
            
            that.total = response.result.length
            that.result = response.result;
            
            if(JSON.stringify(response.result) == {})
            {
              this.$message("查询结束,没有结果")
              return;
            }

            let item = ''
            for(item in that.result)
            {
              let tempDate = that.result[item].ordertime;
             
              that.result[item].ordertime = new Date(tempDate).toUTCString();
             
              tempDate = that.result[item].finishtime;
              that.result[item].finishtime = new Date(tempDate).toUTCString();
            }
          }

          if(response.result.length == 0)
            this.$message("查询结束,没有结果")
          that.loading = false;
          
      },fail => {
          that.loading = false;
          that.$message( fail.message)
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
          API.remove(row.id).then(function (result) {
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
            if (valid) {
            that.loading = true;
            let params = Object.assign({}, this.editForm);
            console.log(this.editForm.city)
            //params.city = this.kunpengcitySelectCities[this.editForm.city].city;
           // params.company = this.kunpengcitySelectCompany[this.editForm.company].company;
           // params.cartype = this.kunpengcitySelectCartype[this.editForm.cartype].cartype;
          // console.log(params.kunpengDate.toLocaleDateString())
           
          this.$http.post(this.$global.remote().kunpengUpdate, params, response => {
                
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
          kunpengDate: '',
          city: '',
          company: '',
          beianpeople: '',
          passedpeople: '',
          ordertime:'',
          finishtime:'',
          finishpeople:'',
          fundsum:''
        };
        this.kunpengcitySelect = '',
        this.kunpengcompanySelect = '';
        this.kunpengcartypeSelect = '';
      },
      showAddDialogCity: function () {
        this.addFormCityVisible = true;
        this.addFormCity = {
          city: '',
          province: '',
          
        };
        
      },
       showAddDialogCompany: function () {
        this.addFormCompanyVisible = true;
        this.addFormCompany = {
          company: '',
          
          
        };
        
      },
       showAddDialogCartype: function () {
        this.addFormCartypeVisible = true;
        this.addFormCartype = {
           cartype: '',
          carsalingprice: '',
          carinvoiceprice: '',
          carinsurance: '',
          investsum: ''
          
        };
        
      },
      //submit city
      addCitySubmit:function()
      {
        let that = this;
        that.$refs.addFormCity.validate((valid) => {
          if (valid) {
            this.loading = true;
            let params = Object.assign({}, this.addFormCity);
            console.log("addCity submit:"+params);
            this.$http.post(this.$global.remote().kunpengCityInsert, params, response => {
                
                console.log(response.result)
                this.$message("城市添加成功");
                this.loading = false;
                that.addFormCityVisible = false;
              
            },fail =>{
                self.tips = fail.message;
                that.addFormCityVisible = false;
                this.loading = false;
            });
          }
        });
        that.addFormCityVisible = false; 
      },
      addCompanySubmit:function()
      {
        let that = this;
        that.$refs.addFormCompany.validate((valid) => {
          if (valid) {
            this.loading = true;
            let params = Object.assign({}, this.addFormCompany);
            console.log("addCompany submit:"+params);
            this.$http.post(this.$global.remote().kunpengCompanyInsert, params, response => {
                
                console.log(response.result)
                this.$message("公司添加成功");
                this.loading = false;
                that.addFormCompanyVisible = false;
              
            },fail =>{
                self.tips = fail.message;
                that.addFormCompanyVisible = false;
                this.loading = false;
            });
          }
        });
        that.addFormCompanyVisible = false; 
      },

    addCartypeSubmit:function()
      {
        let that = this;
        that.$refs.addFormCartype.validate((valid) => {
          if (valid) {
            this.loading = true;
            let params = Object.assign({}, this.addFormCartype);
            console.log("addCartype submit:"+params);
            this.$http.post(this.$global.remote().kunpengCartypeInsert, params, response => {
                
                console.log(response.result)
                this.$message("车型添加成功");
                this.loading = false;
                that.addFormCartypeVisible = false;
              
            },fail =>{
                self.tips = fail.message;
                that.addFormCartypeVisible = false;
                this.loading = false;
            });
          }
        });
        that.addFormCompanyVisible = false; 
      },
      addSubmit: function () {
        let that = this;
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            that.loading = true;
            let params = Object.assign({}, this.addForm);
            params.city = this.kunpengcitySelectCities[this.addForm.city].city;
            params.company = this.kunpengcitySelectCompany[this.addForm.company].company;
            params.cartype = this.kunpengcitySelectCartype[this.addForm.cartype].cartype;
           console.log(params.kunpengDate.toLocaleDateString())
           
          this.$http.post(this.$global.remote().kunpengInsert, params, response => {
                
                console.log(response.result)
                this.loading = false;
                that.addFormVisible = false;
                this.$message("添加业务成功");
                //this.handleSearch()
               
              
            },fail =>{
                self.tips = fail.message;
                that.addFormVisible = false;
                this.loading = false;
            });
          }
        });
      },
      deleteItem:function(index,row)
      {
        let that = this;
        this.$confirm('确认删除该记录吗?', '提示', {type: 'warning'}).then(() => {
          that.loading = true;
          //let params=Object.assign({}, row);
          let params = {}
          params.tid = row.tid;
           this.$http.post(this.$global.remote().kunpengDelete, params, response => {
                
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
    this.$global.dateColumn().yearvalue = '';
    this.$global.dateColumn().monthvalue = '';
  let that = this
 
  this.$http.get(this.$global.remote().kunpengCityList,{},response =>
  {
    
    let items = []
    let item = ''
    for(item in response.result)
    {
      let values ={}
      values.city = response.result[item].city+"/"+response.result[item].province
      values.key = item
      items.push(values)
      }
    this.kunpengcitySelectCities = items
    console.log("kunpengcitySelectCities:"+this.kunpengcitySelectCities)
  },fail=>
  {
    this.$message("操作出错,状态:"+fail.status+"消息:"+fail.message)
  });
  //that.kunpengcitySelectCities = this.$global.getKunPengCity(that);
  this.$http.get(this.$global.remote().kunpengCompanyList,{},response =>
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
    this.kunpengcitySelectCompany = items
   
  },fail=>
  {
    this.$message("操作出错,状态:"+fail.status+"消息:"+fail.message)
  }); 

  this.$http.get(this.$global.remote().kunpengCartypeList,{},response =>
  {
    
    let items = []
    let item = ''
    for(item in response.result)
    {
      let values ={}
      values.cartype = response.result[item].cartype
      values.key = item
      items.push(values)
      }
    this.kunpengcitySelectCartype = items
   
  },fail=>
  {
    this.$message("操作出错,状态:"+fail.status+"消息:"+fail.message)
  }); 
    },

    computed : {
            
        },
  }
</script>

<style>
  .demo-table-expand label {
    font-weight: bold;
  }
</style>
