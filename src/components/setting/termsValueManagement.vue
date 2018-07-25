<template>
    <div class="user-management-box">
        <div class="form-box">
            <el-form :inline="true" :model="searchFormData" class="demo-form-inline" size="mini">
                <el-form-item label="值编码">
                    <el-input v-model="searchFormData.termsValueDTO.valueCode" placeholder="值编码"></el-input>
                </el-form-item>
                <el-form-item label="值名称">
                    <el-input v-model="searchFormData.termsValueDTO.valueName" placeholder="值名称"></el-input>
                </el-form-item>
                <el-form-item label="词条">
                    <el-select v-model="searchFormData.termsValueDTO.termsCode" filterable placeholder="请选择">
                        <el-option
                            v-for="item in termsCodeOptions"
                            :key="item.termsCode"
                            :label="item.termsName"
                            :value="item.termsCode">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="状态">
                    <el-select v-model="searchFormData.termsValueDTO.active" placeholder="请选择">
                        <el-option label="--全部--" value=""></el-option>
                        <el-option v-for="item in activeItems" :label="item.valueName" :value="item.valueCode" :key="item.valueCode"></el-option>
                    </el-select>
                </el-form-item>
                <br/>
                <el-form-item >
                    <el-button type="primary" @click="onSearch" v-show="buttons.query">查询</el-button>
                    <el-button type="primary" @click="onAdd" v-show="buttons.add">新增</el-button>
                    <el-button type="primary" @click="onUpdate" v-show="buttons.update" :disabled="updateDisable">修改</el-button>
                    <el-button type="primary" @click="onDelete" v-show="buttons.delete" :disabled="deleteDisable">删除</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="table-top">
            <el-table
                ref="multipleTable"
                :data="termsValueDTOS"
                tooltip-effect="dark"
                style="width: 100%"
                @selection-change="handleSelectionChange"
                @row-click="rowClick"
                @row-dblclick="rowDblClick"
                size="mini"
            >
                <el-table-column
                    type="selection"
                    min-width="5%">
                </el-table-column>
                <el-table-column
                    prop="valueCode"
                    label="值编码"
                    min-width="11%">
                </el-table-column>
                <el-table-column
                    prop="valueName"
                    label="值名称"
                    min-width="11%">
                </el-table-column>
                <el-table-column
                    prop="termsCode"
                    label="词条编码"
                    min-width="11%">
                </el-table-column>
                <el-table-column
                    prop="termsName"
                    label="词条名称"
                    min-width="11%">
                </el-table-column>
                <el-table-column
                    prop="valueSeq"
                    label="顺序"
                    min-width="11%">
                </el-table-column>
                <el-table-column
                    prop="notes"
                    label="备注"
                    min-width="11%">
                </el-table-column>
                <el-table-column
                    prop="active"
                    :formatter="handleActive"
                    label="状态"
                    min-width="11%">
                </el-table-column>
            </el-table>
        </div>
        <div class="pagination">
            <el-pagination
                small
                background
                layout="total, sizes, prev, pager, next, jumper"
                @size-change="handleSizeChange"
                @current-change="handleCurrentPageChange"
                :page-size="pageSize"
                :current-page="currentPage"
                :total="totalCount">
            </el-pagination>
        </div>
        <el-dialog
            :title="dialogTitle"
            :visible.sync="dialogVisible"
            @close="closeDialog"
            center>
            <el-form class="termsValueManageBox" label-width="80px" :model="form" :rules="rules" ref="form" size="small" :inline="false">
                <div class="termsValueManageLeft">
                    <el-input type="hidden" v-model="form.tid" auto-complete="off"></el-input>
                    <el-form-item label="值编码" prop="valueCode">
                        <el-input v-model="form.valueCode" auto-complete="off" :disabled="formColumnDisable"></el-input>
                    </el-form-item>
                    <el-form-item label="值名称" prop="valueName">
                        <el-input v-model="form.valueName" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="选择词条" v-show="!editShow" prop="termsCode">
                        <el-select v-model="form.termsCode" filterable placeholder="请选择">
                            <el-option
                                v-for="item in termsCodeOptions"
                                :key="item.termsCode"
                                :label="item.termsName"
                                :value="item.termsCode">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="词条编码" prop="termsCode" v-show="editShow">
                        <el-input v-model="form.termsCode" auto-complete="off" :disabled="formColumnDisable"></el-input>
                    </el-form-item>
                </div>
                <div class="termsValueManageRight">

                    <el-form-item label="词条名称" prop="termsName" v-show="editShow">
                        <el-input v-model="form.termsName" auto-complete="off" :disabled="formColumnDisable"></el-input>
                    </el-form-item>
                    <el-form-item label="顺序" prop="valueSeq">
                        <el-input type="number" v-model="form.valueSeq" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="状态">
                        <el-select v-model="form.active" placeholder="请选择">
                            <el-option v-for="item in activeItems" :label="item.valueName" :value="item.valueCode" :key="item.valueCode"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="备注">
                        <el-input type="textarea" v-model="form.notes" auto-complete="off"></el-input>
                    </el-form-item>
                </div>

            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="closeDialog">取 消</el-button>
                <el-button type="primary" @click="handleSubmit">确 定</el-button>
              </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                buttons: {
                    query: false,
                    add: false,
                    update: false,
                    delete: false,
                },
                searchFormData:{
                    termsValueDTO : {
                        valueCode: '',
                        valueName: '',
                        termsCode: '',
                        active: 'Y'
                    }
                },
                totalCount: 0,
                termsValueDTOS: [],
                updateDisable: true,
                deleteDisable: true,
                //多选数组
                multipleSelection: [],
                currentPage: 1,
                pageSize: 10,
                dialogTitle: '',
                dialogVisible: false,
                dialogCommand: '',
                formLabelWidth: '120px',
                formColumnDisable: false,
                editShow: false,
                form: {
                    tid: '',
                    valueCode: '',
                    valueName: '',
                    termsCode: '',
                    termsName: '',
                    valueSeq: 1,
                    notes: '',
                    active: '',
                },
                rules: {
                    valueCode: [{
                        required: true, message: '请输入值编码', trigger: 'blur'
                    }],
                    valueName: [{
                        required: true, message: '请输入值名称', trigger: 'blur'
                    }],
                    termsCode: [{
                        required: true, message: '请选择词条名称', trigger: 'change'
                    }],
                }
            }
        },
        methods: {
            onSearch() {
                this.searchFormData.pageNo = this.currentPage;
                this.searchFormData.pageSize = this.pageSize;
                this.$http.post(this.$global.remote().termsValueList, this.searchFormData, response => {
                    this.termsValueDTOS = response.result.termsValueDTOS;
                    this.totalCount = response.result.totalCount;
                },fail => {
                    this.$message.error(fail.message);
                })
            },
            onAdd(){
                this.dialogTitle = '新增字典值';
                this.dialogVisible = true;
                this.dialogCommand = 'add';
                this.formColumnDisable = false;
                this.editShow = false;
            },
            onUpdate() {
                if (this.multipleSelection.length > 1) {
                    this.$message({message:"只能选择其中一条数据进行修改",type: 'warning'});
                    return;
                }
                this.dialogTitle = '更新字典值';
                this.dialogCommand = 'update';
                this.formColumnDisable = true;
                this.editShow = true;
                let tid = this.multipleSelection[0].tid;
                this.$http.get(this.$global.remote().termsValueFind, {tid:tid}, response => {
                    this.form = response.result;
                    this.dialogVisible = true;
                }, fail => {
                    this.$message.error(fail.message);
                })
            },
            handleSubmit(){
                let url = '';
                let param = {}
                param.termsValueDTO = this.form;
                if (this.dialogCommand == 'add') {
                    url = this.$global.remote().termsValueSave;
                    this.form.termsName = this.$global.getTermsCodeMap().get(this.form.termsCode);
                } else if (this.dialogCommand == 'update') {
                    url = this.$global.remote().termsValueUpdate;
                }
                this.$http.post(url, param, response => {
                    this.$global.flashDictionary();
                    this.closeDialog();
                    this.onSearch();
                }, fail => {
                    this.$message.error(fail.message);
                })
            },
            onDelete() {
                this.$confirm('确认删除选中数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    var array = [];
                    this.multipleSelection.forEach((item) => {
                        array.push(item.tid);
                    });
                    this.$http.post(this.$global.remote().termsValueDelete, {ids: array}, response => {
                        this.$global.flashDictionary();
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.onSearch();
                    }, fail => {
                        this.$message.error(fail.message);
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
                if (val.length > 0) {
                    this.updateDisable = false;
                    this.deleteDisable = false;
                } else {
                    this.updateDisable = true;
                    this.deleteDisable = true;
                }

            },
            handleSizeChange(pageSize) {
                this.pageSize = pageSize;
                this.onSearch();
            },
            handleCurrentPageChange(currentPage) {
                this.currentPage = currentPage;
                this.onSearch();
            },
            rowClick(row, event, column){
                this.$refs.multipleTable.toggleRowSelection(row);
            },
            rowDblClick(row, event){
            },
            closeDialog(){
                this.dialogVisible = false;
                this.$refs.form.resetFields();
                this.resetForm();
            },
            resetForm(){
              this.form = {
                  tid: '',
                  valueCode: '',
                  valueName: '',
                  termsCode: '',
                  termsName: '',
                  valueSeq: 1,
                  notes: '',
                  active: '',
              }
            },
            handleActive(row, column, cellValue, index){
                return this.$global.transformActive(cellValue);
            }
        },
        computed : {
            termsCodeOptions(){
                return this.$global.getTermsCodeStore();
            },
            activeItems(){
                return this.$global.getTermsValueStore('DATA_STATUE');
            }
        },
        mounted(){
            let userPermissions = this.$global.getUserPermissions();
            this.buttons.query = userPermissions.indexOf(this.$global.remote().termsValueList) >= 0;
            this.buttons.add = userPermissions.indexOf(this.$global.remote().termsValueUpdate) >= 0;
            this.buttons.update = userPermissions.indexOf(this.$global.remote().termsValueUpdate) >= 0;
            this.buttons.delete = userPermissions.indexOf(this.$global.remote().termsValueDelete) >= 0;
        }
    }
</script>

<style scoped="scoped">
    .user-management-box{
        width: 100%;
        min-width: 1000px;
    }
    .form-box{
        width: 100%;
    }
    .table-top{
        border-top: 1px solid #eee;
    }
    .pagination{
        text-align: center;
    }
    tr div{
        overflow: hidden !important;
        text-overflow:ellipsis !important;
        white-space: nowrap !important;
    }
    .el-form input {
        width: 190px;
    }
    .el-form select {
        width: 190px;
    }
    .el-form textarea {
        width: 475px;
    }
    .termsValueManageBox{
        position: relative;
        height:180px;
    }
    .termsValueManageLeft{
        position: absolute;
        left:0;
        top:-25px;
        width: 50%;
    }
    .termsValueManageRight{
        position: absolute;
        right: 0;
        top:0;
        width: 50%;
    }
</style>
