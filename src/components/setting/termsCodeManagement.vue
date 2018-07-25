<template>
    <div class="user-management-box">
        <div class="form-box">
            <el-form :inline="true" :model="searchFormData" class="demo-form-inline" size="mini">
                <el-form-item label="词条编码">
                    <el-input v-model="searchFormData.termsCodeDTO.termsCode" placeholder="词条编码"></el-input>
                </el-form-item>
                <el-form-item label="词条名称">
                    <el-input v-model="searchFormData.termsCodeDTO.termsName" placeholder="词条名称"></el-input>
                </el-form-item>
                <el-form-item label="状态">
                    <el-select v-model="searchFormData.termsCodeDTO.active" placeholder="请选择">
                        <el-option label="--全部--" value=""></el-option>
                        <el-option v-for="item in activeItems" :label="item.valueName" :value="item.valueCode" :key="item.valueCode"></el-option>
                    </el-select>
                </el-form-item>
                <br/>
                <el-form-item >
                    <el-button type="primary" @click="onSearch" v-show="buttons.query">查询</el-button>
                    <el-button type="primary" @click="onAdd" v-show="buttons.add">新增</el-button>
                    <el-button type="primary" @click="onUpdate" v-show="buttons.update" :disabled="updateDisable">修改</el-button>
                    <el-button type="primary" @click="onDelete"v-show="buttons.delete" :disabled="deleteDisable">删除</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="table-top">
            <el-table
                ref="multipleTable"
                :data="termsCodeDTOS"
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
            <el-form class="termsCodeManageBox" label-width="80px" :model="form" :rules="rules" ref="form" size="small" :inline="false">
                <div class="termsCodeManageLeft">
                    <el-input type="hidden" v-model="form.tid" auto-complete="off"></el-input>
                    <el-form-item label="词条编码" prop="termsCode">
                        <el-input v-model="form.termsCode" auto-complete="off" :disabled="formColumnDisable"></el-input>
                    </el-form-item>
                    <el-form-item label="词条名称" prop="termsName">
                        <el-input v-model="form.termsName" auto-complete="off"></el-input>
                    </el-form-item>
                </div>
                <div class="termsCodeManageRight">
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
                    termsCodeDTO : {
                        termsCode: '',
                        termsName: '',
                        active: 'Y'
                    }
                },
                totalCount: 0,
                termsCodeDTOS: [],
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
                form: {
                    tid: '',
                    termsCode: '',
                    termsName: '',
                    notes: '',
                    active: ''
                },
                rules: {
                    termsCode: [{
                        required: true, message: '请输入词条编码', trigger: 'blur'
                    }],
                    termsName: [{
                        required: true, message: '请输入词条名称', trigger: 'blur'
                    }]
                }
            }
        },
        methods: {
            onSearch() {
                this.searchFormData.pageNo = this.currentPage;
                this.searchFormData.pageSize = this.pageSize;
                this.$http.post(this.$global.remote().termsCodeList, this.searchFormData, response => {
                    this.termsCodeDTOS = response.result.termsCodeDTOS;
                    this.totalCount = response.result.totalCount;
                },fail => {
                    this.$message.error(fail.message);
                })
            },
            onAdd(){
                this.dialogTitle = '新增词条';
                this.dialogVisible = true;
                this.dialogCommand = 'add';
                this.formColumnDisable = false;
            },
            onUpdate() {
                if (this.multipleSelection.length > 1) {
                    this.$message({message:"只能选择其中一条数据进行修改",type: 'warning'});
                    return;
                }
                this.dialogTitle = '更新词条';
                this.dialogCommand = 'update';
                this.formColumnDisable = true;
                let tid = this.multipleSelection[0].tid;
                this.$http.get(this.$global.remote().termsCodeFind, {tid:tid}, response => {
                    this.form = response.result;
                    this.dialogVisible = true;
                }, fail => {
                    this.$message.error(fail.message);
                })
            },
            handleSubmit(){
                let url = '';
                let param = {}
                param.termsCodeDTO = this.form;
                if (this.dialogCommand == 'add') {
                    url = this.$global.remote().termsCodeSave;
                } else if (this.dialogCommand == 'update') {
                    url = this.$global.remote().termsCodeUpdate;
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
                    this.$http.post(this.$global.remote().termsCodeDelete, {ids: array}, response => {
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
            },
            resetForm() {
                this.form = {
                    tid: '',
                    termsCode: '',
                    termsName: '',
                    notes: '',
                    active: ''
                }
            },
            handleActive(row, column, cellValue, index){
                return this.$global.transformActive(cellValue);
            }
        },
        computed : {
            activeItems(){
                return this.$global.getTermsValueStore('DATA_STATUE');
            }
        },
        mounted(){
            let userPermissions = this.$global.getUserPermissions();
            this.buttons.query = userPermissions.indexOf(this.$global.remote().termsCodeList) >= 0;
            this.buttons.add = userPermissions.indexOf(this.$global.remote().termsCodeSave) >= 0;
            this.buttons.update = userPermissions.indexOf(this.$global.remote().termsCodeUpdate) >= 0;
            this.buttons.delete = userPermissions.indexOf(this.$global.remote().termsCodeDelete) >= 0;
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
    .el-form textarea {
        width: 475px;
    }
    .termsCodeManageBox{
        position: relative;
        height: 120px;
    }
    .termsCodeManageLeft{
        position: absolute;
        top:-15px;
        left:0;
        width: 50%;
    }
    .termsCodeManageRight{
        position: absolute;
        top:10px;
        right:0;
        width: 50%;
    }
</style>
