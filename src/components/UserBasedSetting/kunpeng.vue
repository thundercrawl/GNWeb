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
        </el-form>

         <el-form :inline="true" :model="filters">  
          <el-form-item>
            <el-button type="text" @click="showAddDialogCity"> >添加新城市</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="text" @click="showAddDialogCompany"> >添加新公司</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="text" @click="showAddDialogCartype"> >添加新车型</el-button>
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
        <el-table-column prop="carsalingprice" label="车辆指导价" ></el-table-column>
        <el-table-column prop="carinvoiceprice" label="车辆开票价" ></el-table-column>
        <el-table-column prop="carinsurance" label="保险" ></el-table-column>
        <el-table-column prop="investsum" label="融资额" ></el-table-column>
        <el-table-column prop="beianpeople" label="备案人数" ></el-table-column>
        <el-table-column prop="passedpeople" label="过审人数" ></el-table-column>
      <el-table-column prop="ordertime" label="下单时间" ></el-table-column>
        <el-table-column prop="finishtime" label="完成时间" ></el-table-column>
        <el-table-column prop="finishpeople" label="完成人数" ></el-table-column>
        <el-table-column prop="fundsum" label="总融资额" ></el-table-column>
        <el-table-column prop="fundUsage" label="用途" ></el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button size="small" @click="showEditDialog(scope.$index,scope.row)">编辑</el-button>
            <el-button type="danger" size="small" @click="deleteItem(scope.$index,scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    
      
      
       <!--
        <el-button type="danger" @click="batchDeleteBook" :disabled="this.sels.length===0">批量删除</el-button>
         
        <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :total="total"
                       style="float:right;">
        </el-pagination>-->
       
      
            <el-button type="primary" v-on:click="exportExcel('date')" style="float:right;position:relative">导出excel</el-button>
            <el-button v-if="this.$global.haveUserPermissionNotRole('/kunpengBussiness/excelI')"  type="primary"  v-on:click="importExcel" style="float:right;position:relative;right:5px">导入excel</el-button>
            <el-button type="primary" v-on:click="exportExcel('')" style="float:right;right:30px">导出所有excel</el-button>
        
        
      
    <!-- edit dialog -->
      <el-dialog title="编辑" :visible.sync ="editFormVisible" :close-on-click-modal="false">
        <el-form :model="editForm" label-width="80px" :rules="addFormRules" ref="editForm">
          
         
          <el-form-item label="创建日期">
            <el-date-picker type="date" placeholder="选择日期" v-model="editForm.kunpengDate"></el-date-picker>
          </el-form-item>
          <el-form-item label="资金用途" prop="fundUsage">
                    <el-select v-model="editForm.fundUsage" placeholder="请选择">
                        
                        <el-option v-for="item in fundEfficientFundUsageSelectItems" :label="item.label" :value="item.key" :key="item.key"></el-option>
                    </el-select>
                      <el-button type="text" @click="showAddFundUsageDialog" auto-complete="off"> 添加修改>></el-button>
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
        <el-form-item label="指导价"  prop="carsalingprice">
            <el-input v-model="editForm.carsalingprice" placeholder="只接受数字" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="开票价"  prop="carinvoiceprice">
            <el-input v-model="editForm.carinvoiceprice" placeholder="只接受数字" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="保险"  prop="carinsurance">
            <el-input v-model="editForm.carinsurance" placeholder="只接受数字" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="融资额"  prop="investsum">
            <el-input v-model="editForm.investsum" placeholder="只接受数字" auto-complete="off"></el-input>
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
            <el-input @click.native="autoFillFundSum('edit')" v-model="editForm.fundsum" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="editFormVisible = false">取消</el-button>
          <el-button type="primary" @click.native="editSubmit">提交</el-button>
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
      <!--新增kunpeng-->
      <el-dialog title="新增业务" :visible.sync ="addFormVisible" :close-on-click-modal="false">
        <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
          
         
          <el-form-item label="创建日期" prop="kunpengDate">
            <el-date-picker type="date" placeholder="选择日期" v-model="addForm.kunpengDate"></el-date-picker>
          </el-form-item>
          
           <el-form-item label="资金用途" prop="fundUsage">
                    <el-select v-model="addForm.fundUsage" placeholder="请选择">
                        
                        <el-option v-for="item in fundEfficientFundUsageSelectItems" :label="item.label" :value="item.key" :key="item.key"></el-option>
                    </el-select>
                      <el-button type="text" @click="showAddFundUsageDialog" auto-complete="off"> 添加修改>></el-button>
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
        <el-form-item label="指导价"  prop="carsalingprice">
            <el-input v-model="addForm.carsalingprice" placeholder="只接受数字" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="开票价"  prop="carinvoiceprice">
            <el-input v-model="addForm.carinvoiceprice" placeholder="只接受数字" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="保险"  prop="carinsurance">
            <el-input v-model="addForm.carinsurance" placeholder="只接受数字" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="融资额"  prop="investsum">
            <el-input v-model="addForm.investsum" placeholder="只接受数字" auto-complete="off"></el-input>
          </el-form-item>
        <el-form-item label="备案人数"  prop="beianpeople">
            <el-input v-model="addForm.beianpeople" placeholder="只接受整数" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="过审人数"  prop="passedpeople">
            <el-input v-model="addForm.passedpeople" placeholder="只接受整数" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="下单时间" prop="ordertime">
            <el-date-picker type="date" placeholder="选择日期" v-model="addForm.ordertime"></el-date-picker>
          </el-form-item>
          <el-form-item label="完成时间" prop="finishtime">
            <el-date-picker type="date" placeholder="选择日期" v-model="addForm.finishtime"></el-date-picker>
          </el-form-item>
          <el-form-item label="完成人数" prop="finishpeople">
            <el-input v-model="addForm.finishpeople"  placeholder="只接受整数" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="总融资额" prop="fundsum">
            <el-input v-model="addForm.fundsum"  @click.native="autoFillFundSum('add')" placeholder="只接受数字" auto-complete="off"></el-input>
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
            <el-button type="danger" @click="deleteByID(scope.$index,scope.row,url_fundEfficientFundUsageDelete)" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    
        
        </div>
      </el-dialog>

    <!-- add city -->
  
      <el-dialog title="新增城市" :visible.sync ="addCityFormVisible" :close-on-click-modal="false">
        <el-form :model="addCityForm" label-width="80px" :rules="addCityFormRules" ref="addCityForm">
          <el-form-item label="城市" prop="city">
            <el-input v-model="addCityForm.city" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="省" prop="province">
            <el-input v-model="addCityForm.province" auto-complete="off"></el-input>
          </el-form-item>
         
        </el-form>
        <div slot="footer" class="dialog-footer">
           <el-button type="text" @click.native="showAddCityTable" style="float:left"> 管理城市>></el-button>
          <el-button type="text" @click.native="disableAddCityTable" style="float:left" v-show="showCityTableVisible"> <<收起列表</el-button>
          <el-button @click.native="addCityFormVisible = false">取消</el-button>
          <el-button type="primary" @click.native="addCitySubmit" :loading="addLoading">提交</el-button>
          
        <el-table border stripe :data="cityResult" highlight-current-row @selection-change="selsChange"
                style="width: 100%;" :row-class-name="customizedGrayFont" v-show="showCityTableVisible">
        <el-table-column type="selection"></el-table-column>
        <el-table-column type="index" label="序号" width="60px"></el-table-column>
        <el-table-column prop="city" label="城市"  ></el-table-column>
        <el-table-column prop="province" label="省"  ></el-table-column>
        <el-table-column v-if="this.$global.haveUserPermissionNotRole('/kunpengBussiness/edit')" label="操作" width="150">
          <template slot-scope="scope">
           <el-button size="small"  @click="showCityEditDialog(scope.$index,scope.row)">编辑</el-button>
            <el-button type="danger" @click="deleteByID(scope.$index,scope.row,url_kunpengCityDelete)" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
        </div>
      </el-dialog>

    
      <el-dialog title="编辑城市" :visible.sync ="editCityFormVisible" :close-on-click-modal="false" width="300">
        <el-form :model="editCityForm" label-width="180px"   :rules="editCityFormRules" ref="editCityForm">
          <el-form-item label="城市" prop="city">
            <el-input v-model="editCityForm.city" auto-complete="off"></el-input>
          </el-form-item>
           <el-form-item label="省" prop="province">
            <el-input v-model="editCityForm.province" auto-complete="off"></el-input>
          </el-form-item>
           
         

        </el-form>
        
        <div slot="footer" class="dialog-footer">
  
          <el-button @click.native="editCityFormVisible = false">取消</el-button>
          <el-button type="primary" @click.native="editCitySubmit" :loading="addLoading">提交</el-button>       
        </div>
      </el-dialog>
      <!-- add company -->

      <el-dialog title="新增公司" :visible.sync ="addCompanyFormVisible" :close-on-click-modal="false">
        <el-form :model="addCompanyForm" label-width="80px" :rules="addCompanyFormRules" ref="addCompanyForm">
          <el-form-item label="公司" prop="company">
            <el-input v-model="addCompanyForm.company" auto-complete="off"></el-input>
          </el-form-item>
         
         
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click.native="showAddCompanyTable" style="float:left"> 管理公司>></el-button>
          <el-button type="text" @click.native="disableAddCompanyTable" style="float:left" v-show="showCompanyTableVisible"> <<收起列表</el-button>
    
          <el-button @click.native="addCompanyFormVisible = false">取消</el-button>
          <el-button type="primary" @click.native="addCompanySubmit" :loading="addLoading">提交</el-button>
        

         <el-table border stripe :data="companyResult" highlight-current-row @selection-change="selsChange"
                style="width: 100%;" :row-class-name="customizedGrayFont" v-show="showCompanyTableVisible">
        <el-table-column type="selection"></el-table-column>
        <el-table-column type="index" label="序号" width="60px"></el-table-column>
        <el-table-column prop="company" label="公司"  ></el-table-column>
        
        <el-table-column v-if="this.$global.haveUserPermissionNotRole('/expenseVelocity/edit')" label="操作" width="150">
          <template slot-scope="scope">
           <el-button size="small"  @click="showCompanyEditDialog(scope.$index,scope.row)">编辑</el-button>
            <el-button type="danger" @click="deleteByID(scope.$index,scope.row,url_kunpengCompanyDelete)" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      </div>
      </el-dialog>
    <el-dialog title="编辑公司" :visible.sync ="editCompanyFormVisible" :close-on-click-modal="false" width="300">
        <el-form :model="editCompanyForm" label-width="180px"   :rules="editCompanyFormRules" ref="editCompanyForm">
          <el-form-item label="公司" prop="company">
            <el-input v-model="editCompanyForm.company" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        
        <div slot="footer" class="dialog-footer">
  
          <el-button @click.native="editCompanyFormVisible = false">取消</el-button>
          <el-button type="primary" @click.native="editCompanySubmit" :loading="addLoading">提交</el-button>       
        </div>
      </el-dialog>
      <!-- add cartype -->
    <!--新增界面-->
      <el-dialog title="新增车型" :visible.sync ="addCartypeFormVisible" :close-on-click-modal="false" >
        <el-form :model="addCartypeForm" label-width="100px" :rules="addCartypeFormRules" ref="addCartypeForm">
          <el-form-item label="车辆型号" prop="cartype">
            <el-input v-model="addCartypeForm.cartype" auto-complete="off"></el-input>
          </el-form-item>
         
         
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click.native="showAddCartypeTable" style="float:left"> 管理车型>></el-button>
          <el-button type="text" @click.native="disableAddCartypeTable" style="float:left" v-show="showCartypeTableVisible"> <<收起列表</el-button>
    
          <el-button @click.native="addCartypeFormVisible = false">取消</el-button>
          <el-button type="primary" @click.native="addCartypeSubmit" :loading="addLoading">提交</el-button>
          
         <el-table border stripe :data="cartypeResult" highlight-current-row @selection-change="selsChange"
                style="width: 100%;" :row-class-name="customizedGrayFont" v-show="showCartypeTableVisible">
        <el-table-column type="selection"></el-table-column>
        <el-table-column type="index" label="序号" width="60px"></el-table-column>
        <el-table-column prop="cartype" label="车辆型号"></el-table-column>
        
        <el-table-column v-if="this.$global.haveUserPermissionNotRole('/expenseVelocity/edit')" label="操作" width="150">
          <template slot-scope="scope">
           <el-button size="small"  @click="showCartypeEditDialog(scope.$index,scope.row)">编辑</el-button>
            <el-button type="danger" @click="deleteByID(scope.$index,scope.row,url_kunpengCartypeDelete)" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
        </div>
      </el-dialog>

     <el-dialog title="编辑车型" :visible.sync ="editCartypeFormVisible" :close-on-click-modal="false" width="300">
        <el-form :model="editCartypeForm" label-width="180px"   :rules="editCartypeFormRules" ref="editCartypeForm">
          <el-form-item label="车辆型号" prop="cartype">
            <el-input v-model="editCartypeForm.cartype" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        
        <div slot="footer" class="dialog-footer">
  
          <el-button @click.native="editCartypeFormVisible = false">取消</el-button>
          <el-button type="primary" @click.native="editCartypeSubmit" :loading="addLoading">提交</el-button>       
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

      let multiplyFundSum = (rule, value, callback) => {
          
        if (value === '') {
          callback(new Error('请输入数字'));
        } else if (this.$tools.isNotEmpty(value) && this.$tools.isNotEmpty(this.addForm.investsum)) {
           this.addForm.fundsum = (value*this.addForm.investsum).toFixed(4)
           
          callback();
        } else {
          callback();
        }
      };
      return {

        filters: {
          name: ''
        },
        url_kunpengCityDelete:this.$global.remote().kunpengCityDelete,
        url_kunpengCompanyDelete:this.$global.remote().kunpengCompanyDelete,
        url_kunpengCartypeDelete:this.$global.remote().kunpengCartypeDelete,
        url_fundEfficientFundUsageDelete:this.$global.remote().fundEfficientFundUsageDelete,
        result: [],
        cityResult:[],
        companyResult:[],
        cartypeResult:[],
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
            {required: true, message: '', trigger: 'blur'}
          ],
          fundUsage:[
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
           carsalingprice: [
            {required: true,  pattern: /^\d*\.?\d*$/,message: '只能输入数字', trigger: 'blur'}
          ],
           ordertime: [
            {required: true, message: '', trigger: 'blur'}
          ],
           finishtime: [
            {required: true, message: '', trigger: 'blur'}
          ],
          beianpeople: [
            {required: true, pattern: /^\d+$/, message: '只能输入整数', trigger: 'blur'}
          ],
          passedpeople: [
            {required: true, pattern: /^\d+$/, message: '只能输入整数', trigger: 'blur'}
          ],
          finishpeople: [
            {required: true,pattern: /^\d+$/, message: '只能输入整数', trigger: 'blur'}
          ],
          fundsum: [
            {required: true,pattern: /^\d*\.?\d*$/, message: '只能输入数字', trigger: 'blur'}
          ],
          
        },
        editForm: {
          id: 0,
          kunpengDate: '',
          fundUsage:'',
          city: '',
          company: '',
          cartype: '',
          carsalingprice: '',
          carinvoiceprice: '',
          carinsurance: '',
          investsum: '',
          beianpeople: '',
          passedpeople: '',
          ordertime:'',
          finishtime:'',
          finishpeople:'',
          fundsum:''
          
        },

        //add main
        addFormVisible: false,//新增界面是否显示
        addLoading: false,
        addFormRules: {
           kunpengDate: [
            {required: true, message: '', trigger: 'blur'}
          ],
          fundUsage:[
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
           carsalingprice: [
            {required: true,  pattern: /^\d*\.?\d*$/,message: '只能输入数字', trigger: 'blur'}
          ],
           ordertime: [
            {required: true, message: '', trigger: 'blur'}
          ],
           finishtime: [
            {required: true, message: '', trigger: 'blur'}
          ],
          beianpeople: [
            {required: true, pattern: /^\d+$/, message: '只能输入整数', trigger: 'blur'}
          ],
          passedpeople: [
            {required: true, pattern: /^\d+$/, message: '只能输入整数', trigger: 'blur'}
          ],
          finishpeople: [
            {required: true,pattern: /^\d+$/, message: '只能输入整数', trigger: 'blur'}
          ],
          fundsum: [
            {required: true,pattern: /^\d*\.?\d*$/, message: '只能输入数字', trigger: 'blur'}
          ],
          
        },
        addForm: {
          kunpengDate: '',
          fundUsage:'',
          city: '',
          company: '',
          cartype: '',
          carsalingprice: '',
          carinvoiceprice: '',
          carinsurance: '',
          investsum: '',
          beianpeople: '',
          passedpeople: '',
          ordertime:'',
          finishtime:'',
          finishpeople:'',
          fundsum:''
        },
        /*city*/
        addCityFormVisible: false,
        addCityForm:
        {
          city: '',
          province: '',
        },
        addCityFormRules: {
          city: [
            {required: true, message: '请输入城市名', trigger: 'blur'}
          ],
          province: [
            {required: true, message: '请输入省名', trigger: 'blur'}
          ]
        },
        showCityTableVisible:false,

        editCityFormVisible:false,
        editCityForm:{
         city: '',
          province: '',
        },
        editCityFormRules: {
          city: [
            {required: true, message: '请输入城市名', trigger: 'blur'}
          ],
          province: [
            {required: true, message: '请输入省名', trigger: 'blur'}
          ]
        },

      /*add company*/

        addCompanyFormVisible: false,
        addCompanyForm:
        {
          company: '',
        },
        addCompanyFormRules: {
          company: [
            {required: true, message: '请输入公司名', trigger: 'blur'}
          ],
          
        },
         showCompanyTableVisible:false,

        editCompanyFormVisible:false,
        editCompanyForm:{
         company: '',
        },
        editCompanyFormRules: {
          company: [
            {required: true, message: '请输入公司名', trigger: 'blur'}
          ]
        },




        addCartypeFormVisible: false,
        addCartypeForm:
        {
          cartype: '',
          carsalingprice: '',
          carinvoiceprice: '',
          carinsurance: '',
          investsum: ''
        },
        addCartypeFormRules: {
          cartype: [
            {required: true, message: '请输入车辆类型 示例：东风日产牌+DFL7203VBL1', trigger: 'blur'}
          ],
          carsalingprice: [
            {required: true, message: '请输入车辆指导价 示例：179,800元', trigger: 'blur'}
          ]
        },

        showCartypeTableVisible:false,

        editCartypeFormVisible:false,
        editCartypeForm:{
         cartype: '',
        },
        editCompanyFormRules: {
          cartype: [
            {required: true, message: '请输入车辆类型', trigger: 'blur'}
          ]
        },
      
        /*fundusage*/
        addFundUsageFormVisible: false,
        fundEfficientFundUsageSelect: '',
        fundEfficientFundUsageSelectItems:[],
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
           uploaddialog:uploaddialog,
        },
    methods: {
      autoFillFundSum(item)
      {
        console.log("auto fill fundsum field")
        if(item == "add")
        {
        if (this.$tools.isNotEmpty(this.addForm.finishpeople) && this.$tools.isNotEmpty(this.addForm.investsum)) {
           this.addForm.fundsum = (this.addForm.finishpeople*this.addForm.investsum).toFixed(4)
        }
        else
          this.addForm.fundsum = 0
          }
        else if( item == "edit")
        {
          if (this.$tools.isNotEmpty(this.editForm.finishpeople) && this.$tools.isNotEmpty(this.editForm.investsum)) {
           this.editForm.fundsum = (this.editForm.finishpeople*this.editForm.investsum).toFixed(4)
        }
        else
          this.editForm.fundsum = 0
        }
      },

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
             // console.log("car salingprice:"+that.result[item].carsalingprice)
              let tempDate = that.result[item].ordertime;
             
              that.result[item].ordertime = new Date(tempDate).toLocaleDateString();
             
              tempDate = that.result[item].finishtime;
              that.result[item].finishtime = new Date(tempDate).toLocaleDateString();
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

      searchCity:function()
      {
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
          this.cityResult = response.result
          console.log("kunpengcitySelectCities:"+this.kunpengcitySelectCities)
          },fail=>
          {
            this.$message("操作出错,状态:"+fail.status+"消息:"+fail.message)
          }); 
      },
       searchCompany:function()
      {
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
      searchCartype:function()
      {
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
          this.cartypeResult = response.result
         
          },fail=>
          {
            this.$message("操作出错,状态:"+fail.status+"消息:"+fail.message)
          }); 
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
      editCitySubmit: function () {
        let that = this;
        this.$refs.editCityForm.validate((valid) => {
          if (valid) {
            if (valid) {
            that.loading = true;
            let params = Object.assign({}, this.editCityForm);
          
       
          this.$http.post(this.$global.remote().kunpengCityUpdate, params, response => {
                
                console.log(response.result)
                this.loading = false;
                that.editCityFormVisible = false;
                this.$message("编辑城市成功");
               
              
            },fail =>{
                self.tips = fail.message;
                that.editCityFormVisible = false;
                this.loading = false;
            });
          }
          }
        });
      },
      editCompanySubmit: function () {
        let that = this;
        this.$refs.editCompanyForm.validate((valid) => {
          if (valid) {
            if (valid) {
            that.loading = true;
            let params = Object.assign({}, this.editCompanyForm);
          
       
          this.$http.post(this.$global.remote().kunpengCompanyUpdate, params, response => {
                
                console.log(response.result)
                this.loading = false;
                that.editCompanyFormVisible = false;
                this.$message("编辑城市成功");
               this.searchCompany();
              
            },fail =>{
                self.tips = fail.message;
                that.editCompanyFormVisible = false;
                this.loading = false;
            });
          }
          }
        });
      },
      editCartypeSubmit: function () {
        let that = this;
        this.$refs.editCartypeForm.validate((valid) => {
          if (valid) {
            if (valid) {
            that.loading = true;
            let params = Object.assign({}, this.editCartypeForm);
          
       
          this.$http.post(this.$global.remote().kunpengCartypeUpdate, params, response => {
                
                console.log(response.result)
                this.loading = false;
                that.editCartypeFormVisible = false;
                this.$message("编辑城市成功");
               this.searchCartype();
              
            },fail =>{
                self.tips = fail.message;
                that.editCartypeFormVisible = false;
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
            console.log(this.editForm.city)
          params.ordertime = new Date(this.editForm.ordertime).toUTCString()
          params.finishtime = new Date(this.editForm.finishtime).toUTCString()
           params.fundUsage = this.fundEfficientFundUsageSelectItems[this.editForm.fundUsage].label;
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
      showAddDialog: function () {
        this.addFormVisible = true;
        this.addForm = {
          kunpengDate: '',
          city: '',
          company: '',
          cartype:'',
          carsalingprice: '',
          carinvoiceprice: '',
          carinsurance: '',
          investsum: '',
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
        this.searchCity()
        this.searchCompany()
        this.searchCartype()
      },
      showAddDialogCity: function () {
        this.addCityFormVisible = true;
        this.showCityTableVisible=false;
        
        this.addCityForm = {
          city: '',
          province: '',
          
        };
        
      },
      showCityEditDialog:function(index,row)
      {
        this.editCityFormVisible = true;
        this.editCityForm = Object.assign({}, row);
      },
      showCompanyEditDialog:function(index,row)
      {
        this.editCompanyFormVisible = true;
        this.editCompanyForm = Object.assign({}, row);
      },
      showCartypeEditDialog:function(index,row)
      {
        this.editCartypeFormVisible = true;
        this.editCartypeForm = Object.assign({}, row);
      },
       showFundUsageEditDialog: function (index, row) {
        this.editFundUsageFormVisible = true;
        this.editFundUsageForm = Object.assign({}, row);
      
       // this.editForm.fundSource = 
      },
      showAddCityTable: function () {
        this.showCityTableVisible = true;
        this.searchCity();
        
      },
       showAddCompanyTable: function () {
        this.showCompanyTableVisible = true;
        this.searchCompany();
        
      },
       showAddCartypeTable: function () {
        this.showCartypeTableVisible = true;
        this.searchCartype();
        
      },

       showAddFundUsageDialog: function () {
        this.addFundUsageFormVisible = true;
        this.showFundUsageTableVisible = false;
        this.addFundUsageForm = {
          fundUsage: ''
        };
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
      disableAddCityTable:function()
      {
        this.showCityTableVisible = false;
      },
       disableAddCompanyTable:function()
      {
        this.showCompanyTableVisible = false;
      },
       disableAddCartypeTable:function()
      {
        this.showCartypeTableVisible = false;
      },
       showAddDialogCompany: function () {
        this.addCompanyFormVisible = true;
        this.showCompanyTableVisible = false;
        this.addCompanyForm = {
          company: '',
          
          
        };
        
      },
       showAddDialogCartype: function () {
        this.addCartypeFormVisible = true;
        this.showCartypeTableVisible = false;
        this.addCartypeForm = {
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
        that.$refs.addCityForm.validate((valid) => {
          if (valid) {
            this.loading = true;
            let params = Object.assign({}, this.addCityForm);
            console.log("addCity submit:"+params);
            this.$http.post(this.$global.remote().kunpengCityInsert, params, response => {
                
                console.log(response.result)
                this.$message("城市添加成功");
                this.loading = false;
                that.addCityFormVisible = false;
              
            },fail =>{
                self.tips = fail.message;
                that.addCityFormVisible = false;
                this.loading = false;
            });
          }
        });
        that.addCityFormVisible = false; 
      },
      addCompanySubmit:function()
      {
        let that = this;
        that.$refs.addCompanyForm.validate((valid) => {
          if (valid) {
            this.loading = true;
            let params = Object.assign({}, this.addCompanyForm);
            console.log("addCompany submit:"+params);
            this.$http.post(this.$global.remote().kunpengCompanyInsert, params, response => {
                
                console.log(response.result)
                this.$message("公司添加成功");
                this.loading = false;
                that.addCompanyFormVisible = false;
              
            },fail =>{
                self.tips = fail.message;
                that.addCompanyFormVisible = false;
                this.loading = false;
            });
          }
        });
        that.addCompanyFormVisible = false; 
      },

    addCartypeSubmit:function()
      {
        let that = this;
        that.$refs.addCartypeForm.validate((valid) => {
          if (valid) {
            this.loading = true;
            let params = Object.assign({}, this.addCartypeForm);
            console.log("addCartype submit:"+params);
            this.$http.post(this.$global.remote().kunpengCartypeInsert, params, response => {
                
                console.log(response.result)
                this.$message("车型添加成功");
                this.loading = false;
                that.addCartypeFormVisible = false;
              
            },fail =>{
                self.tips = fail.message;
                that.addCartypeFormVisible = false;
                this.loading = false;
            });
          }
        });
        that.addCompanyFormVisible = false; 
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
      addSubmit: function () {
        let that = this;
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            that.loading = true;
            let params = Object.assign({}, this.addForm);
            params.city = this.kunpengcitySelectCities[this.addForm.city].city;
            params.company = this.kunpengcitySelectCompany[this.addForm.company].company;
            params.cartype = this.kunpengcitySelectCartype[this.addForm.cartype].cartype;
            params.fundUsage = this.fundEfficientFundUsageSelectItems[this.addForm.fundUsage].label;
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
      deleteByID:function(index,row,url)
      {
        let that = this;
        this.$confirm('确认删除该记录吗?', '提示', {type: 'warning'}).then(() => {
          that.loading = true;
          //let params=Object.assign({}, row);
          let params = {}
          params.tid = row.tid;
          console.log("url:"+url)
           this.$http.post(url, params, response => {
                
                console.log(response.result)
                this.$message("数据删除成功");
                this.loading = false;
                if( url == this.url_kunpengCityDelete)
                {
                  this.searchCity();
                }
                else if( url == this.url_kunpengCompanyDelete)
                {
                  this.searchCompany();
                }
                else if( url == this.url_kunpengCartypeDelete)
                {
                  this.searchCartype();
                }
                else if( url == this.url_fundEfficientFundUsageDelete)
                {
                  this.searchFundUsage();
                }
              
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

   this.searchFundUsage();
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
