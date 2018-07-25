<template>
    <div class="user-management-box">
        <div class="form-box">
            <el-form :inline="true" :model="searchFormData" class="demo-form-inline" size="mini">
                <el-form-item label="用户名">
                    <el-input v-model="searchFormData.userInfoDTO.userName" placeholder="用户名"></el-input>
                </el-form-item>
                <el-form-item label="用户昵称">
                    <el-input v-model="searchFormData.userInfoDTO.nickName" placeholder="用户昵称"></el-input>
                </el-form-item>
                <el-form-item label="手机号">
                    <el-input v-model="searchFormData.userInfoDTO.mobileNo" placeholder="手机号"></el-input>
                </el-form-item>
                <el-form-item label="状态">
                    <el-select v-model="searchFormData.userInfoDTO.active" placeholder="请选择">
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
                    <el-button type="primary" @click="onDistributeRole" v-show="buttons.distribute" :disabled="disDisable">分配角色</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="table-top">
            <el-table
                ref="multipleTable"
                :data="userInfoDTOS"
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
                    prop="userName"
                    label="用户名"
                    min-width="11%">
                </el-table-column>
                <el-table-column
                    prop="nickName"
                    label="昵称"
                    min-width="11%">
                </el-table-column>
                <el-table-column
                    prop="email"
                    label="邮箱"
                    min-width="17%">
                </el-table-column>
                <el-table-column
                    prop="mobileNo"
                    label="手机号"
                    min-width="11%">
                </el-table-column>
                <el-table-column
                    prop="empCode"
                    label="工号"
                    min-width="11%">
                </el-table-column>
                <el-table-column
                    prop="deptCode"
                    label="部门"
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
            <el-form label-width="80px" :model="form" :rules="rules" ref="form" size="small" :inline="true">
                <el-input type="hidden" v-model="form.tid" auto-complete="off"></el-input>
                <el-form-item label="用户名" prop="userName">
                    <el-input v-model="form.userName" auto-complete="off" :disabled="formColumnDisable"></el-input>
                </el-form-item>
                <el-form-item label="昵称" prop="nickName">
                    <el-input v-model="form.nickName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="form.password" auto-complete="off" :disabled="formColumnDisable"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="form.email" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="电话" prop="mobileNo">
                    <el-input v-model="form.mobileNo" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="工号" prop="empCode">
                    <el-input v-model="form.empCode" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="部门" prop="deptCode">
                    <el-input v-model="form.deptCode" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="状态">
                    <el-select v-model="form.active" placeholder="请选择">
                        <el-option v-for="item in activeItems" :label="item.valueName" :value="item.valueCode" :key="item.valueCode"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input type="textarea" v-model="form.notes" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="closeDialog">取 消</el-button>
                <el-button type="primary" @click="handleSubmit">确 定</el-button>
              </span>
        </el-dialog>
        <el-dialog
            title="分配角色"
            :visible.sync="roleDialogVisible"
            @close="closeRoleDialog"
            center style="height: 900px;">
            <template>
                <!--:filter-method="filterMethod"-->
                <!--filter-placeholder="请输入城市拼音"-->
                <el-transfer
                    filterable
                    :titles="['未分配角色', '已分配角色']"
                    v-model="userRoles"
                    :data="roleStore">
                </el-transfer>
            </template>
            <span slot="footer" class="dialog-footer">
                <el-button @click="closeRoleDialog">取 消</el-button>
                <el-button type="primary" @click="handleRoleSubmit">确 定</el-button>
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
                    distribute: false
                },
                searchFormData:{
                    userInfoDTO : {
                        userName: '',
                        nickName: '',
                        mobileNo: '',
                        active: 'Y'
                    }
                },
                totalCount: 0,
                userInfoDTOS: [],
                updateDisable: true,
                deleteDisable: true,
                disDisable: true,
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
                    userName: '',
                    password: '',
                    nickName: '',
                    email: '',
                    mobileNo: '',
                    empCode: '',
                    deptCode: '',
                    notes: '',
                    active: ''
                },
                rules: {
                    userName: [{
                        required: true, message: '请输入用户名', trigger: 'blur'
                    }],
                    password: [{
                        required: true, message: '请输入密码', trigger: 'blur'
                    }/*,{
                        min: 6, max: 15, message: '长度在 6 到 15 个字符'
                    }*/],
                    nickName: [{
                        required: true, message: '请输入用户昵称', trigger: 'blur'
                    }],
                    email: [{
                        required: true, message: '请输入邮箱', trigger: 'blur'
                    }, {
                        validator: function (rule, value, callback) {
                            /*if (!this.$tools.isMail(value)) {
                                callback(new Error("请输入邮箱"));
                            } else {
                                callback();
                            }*/
                        }
                    }],
                    mobileNo:[{
                        required: true, message: '请输入手机号', trigger: 'blur'
                    },{
                        validator:function(rule,value,callback){
                            /*if(!this.$tools.isMobileNo(value)){
                                callback(new Error("请输入手机号"));
                            }else{
                                callback();
                            }*/
                        }
                    }],
                    empCode: [{
                        required: true, message: '请输入工号', trigger: 'blur'
                    }],
                    deptCode: [{
                        required: true, message: '请输入部门', trigger: 'blur'
                    }]
                },
                roleDialogVisible: false,
                roleStore: [],
                userRoles: [],
            }
        },
        methods: {
            //role
            onDistributeRole(){
                if (this.multipleSelection.length > 1) {
                    this.$message({message:"只能选择其中一条数据进行分配角色",type: 'warning'});
                    return;
                }
                this.roleStore = this.$global.getRoleStore();
                let userId = this.multipleSelection[0].tid;
                this.$http.get(this.$global.remote().findRoleByUserId, {userId:userId}, response => {
                    let roles = response.result;
                    let userRoles = [];
                    if (this.$tools.isNotEmpty(roles)) {
                        roles.forEach((role, index) => {
                            userRoles.push(role.tid);
                        });
                    }
                    this.userRoles = userRoles;
                }, fail => {
                    this.$message.error(fail.message);
                });
                this.roleDialogVisible = true;
            },
            handleRoleSubmit(){
                let userId = this.multipleSelection[0].tid;
                this.$http.post(this.$global.remote().distributeRole, {userId:userId,ids:this.userRoles}, response => {
                    this.closeRoleDialog();
                }, fail => {
                    this.$message.error(fail.message);
                })
            },
            closeRoleDialog(){
              this.roleDialogVisible = false;
              this.userRoles = [];
            },
            //user
            onSearch() {
                this.searchFormData.pageNo = this.currentPage;
                this.searchFormData.pageSize = this.pageSize;
                this.$http.post(this.$global.remote().userList, this.searchFormData, response => {
                    this.userInfoDTOS = response.result.userInfoDTOS;
                    this.totalCount = response.result.totalCount;
                },fail => {
                    this.$message.error(fail.message);
                })
            },
            onAdd(){
                this.dialogTitle = '新增用户';
                this.dialogVisible = true;
                this.dialogCommand = 'add';
                this.formColumnDisable = false;
            },
            onUpdate() {
                if (this.multipleSelection.length > 1) {
                    this.$message({message:"只能选择其中一条数据进行修改",type: 'warning'});
                    return;
                }
                this.dialogTitle = '更新用户';
                this.dialogCommand = 'update';
                this.formColumnDisable = true;
                let tid = this.multipleSelection[0].tid;
                this.$http.get(this.$global.remote().userFind, {tid:tid}, response => {
                    this.form = response.result;
                    this.dialogVisible = true;
                }, fail => {
                    this.$message.error(fail.message);
                })
            },
            handleSubmit(){
                let url = '';
                let param = {}
                param.userInfoDTO = this.form;
                if (this.dialogCommand == 'add') {
                    url = this.$global.remote().userAdd;
                } else if (this.dialogCommand == 'update') {
                    url = this.$global.remote().userUpdate;
                }
                this.$http.post(url, param, response => {
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
                    this.$http.post(this.$global.remote().userDelete, {ids: array}, response => {
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
                    this.disDisable = false;
                } else {
                    this.updateDisable = true;
                    this.deleteDisable = true;
                    this.disDisable = true;
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
                //form表单
                this.$refs.form.resetFields();
                //重置数据
                this.resetForm();
            },
            resetForm(){
                this.form = {
                    tid: '',
                    userName: '',
                    password: '',
                    nickName: '',
                    email: '',
                    mobileNo: '',
                    empCode: '',
                    deptCode: '',
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
            this.buttons.query = userPermissions.indexOf(this.$global.remote().userList) >= 0;
            this.buttons.add = userPermissions.indexOf(this.$global.remote().userAdd) >= 0;
            this.buttons.update = userPermissions.indexOf(this.$global.remote().userUpdate) >= 0;
            this.buttons.delete = userPermissions.indexOf(this.$global.remote().userDelete) >= 0;
            this.buttons.distribute = userPermissions.indexOf(this.$global.remote().distributeRole) >= 0;
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
</style>
