<template>
    <div class="user-management-box">
        <div class="form-box">
            <el-form :inline="true" :model="searchFormData" class="demo-form-inline" size="mini">
                <el-form-item label="角色编码">
                    <el-input v-model="searchFormData.roleInfoDTO.roleCode" placeholder="角色编码"></el-input>
                </el-form-item>
                <el-form-item label="角色名称">
                    <el-input v-model="searchFormData.roleInfoDTO.roleName" placeholder="角色名称"></el-input>
                </el-form-item>
                <el-form-item label="状态">
                    <el-select v-model="searchFormData.roleInfoDTO.active" placeholder="请选择">
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
                    <el-button type="primary" @click="onDistributePermission" v-show="buttons.distribute" :disabled="disDisable">分配权限</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="table-top">
            <el-table
                ref="multipleTable"
                :data="roleInfoDTOS"
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
                    prop="roleCode"
                    label="角色编码"
                    min-width="11%">
                </el-table-column>
                <el-table-column
                    prop="roleName"
                    label="角色名称"
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
                <el-form-item label="角色编码" prop="roleCode">
                    <el-input v-model="form.roleCode" auto-complete="off" :disabled="formColumnDisable"></el-input>
                </el-form-item>
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="form.roleName" auto-complete="off"></el-input>
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
            width="70%"
            title="分配权限"
            :visible.sync="permissionDialogVisible"
            @close="closePermissionDialog"
            center>
            <el-tree
                ref="resourceTree"
                :data="distributeStore"
                :props="props"
                :default-checked-keys="roleResourceChecked"
                :check-strictly="true"
                show-checkbox
                node-key="tid"
                @check-change="handleCheckChange"
                @node-click="handleNodeClick"
                default-expand-all>
                  <span class="custom-tree-node" slot-scope="{ node, data }">
                    <span>{{ data.label }}</span>
                    <div style="margin-right: 100px;">
                      <el-checkbox-group v-model="rolePermissionChecked">
                        <el-checkbox v-for="item in data.permissions"  :label="item.tid" :key="item.tid">{{item.permissionName}}</el-checkbox>
                      </el-checkbox-group>
                    </div>
                  </span>
            </el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button @click="closePermissionDialog">取 消</el-button>
                <el-button type="primary" @click="handlePermissionSubmit">确 定</el-button>
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
                    roleInfoDTO : {
                        roleCode: '',
                        roleName: '',
                        active: 'Y'
                    }
                },
                totalCount: 0,
                roleInfoDTOS: [],
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
                    roleCode: '',
                    roleName: '',
                    notes: '',
                    active: ''
                },
                rules: {
                    roleCode: [{
                        required: true, message: '请输入词条编码', trigger: 'blur'
                    }],
                    roleName: [{
                        required: true, message: '请输入词条名称', trigger: 'blur'
                    }]
                },
                permissionDialogVisible: false,
                distributeStore: {},
                rolePermissionChecked: [],
                roleResourceChecked: [],
                roleResourcesSrc: [],
                rolePermissionsSrc: [],
                props: {
                    tid:'',
                    code:'',
                    label:'',
                    isLeaf:'',
                    permissions:[]
                }
            }
        },
        methods: {
            handleCheckChange(data, checked){
                if (checked) {
                    if (this.$tools.isNotEmpty(data.permissions)) {
                        data.permissions.forEach((item) => {
                            if (data.label == item.permissionName) {
                                this.rolePermissionChecked.push(item.tid);
                            }
                        })
                    }
                } else {
                    data.permissions.forEach((item) => {
                        this.$tools.removeArrayItemByValue(this.rolePermissionChecked, item.tid);
                    })
                }
            },
            handleNodeClick(data, node) {
            },
            //permission
            onDistributePermission(){
                if (this.multipleSelection.length > 1) {
                    this.$message({message:"只能选择其中一条数据进行修改",type: 'warning'});
                    return;
                }
                let roleId = this.multipleSelection[0].tid;
                this.distributeStore = this.$global.getDistributeStore();

                this.$http.get(this.$global.remote().findRoleDistributeResource, {roleId:roleId}, response => {
                    if (this.$tools.isNotEmpty(response.result)) {
                        let roleDistributeSrc = response.result;
                        this.handlePermissionItem(roleDistributeSrc, this.roleResourcesSrc, this.rolePermissionsSrc);
                        this.rolePermissionChecked = this.rolePermissionsSrc;
                        this.roleResourceChecked = this.roleResourcesSrc;
                    }
                    this.permissionDialogVisible = true;
                    try {
                        this.$refs.resourceTree.setCheckedKeys(this.roleResourceChecked);
                    } catch (e) {
                    }
                }, fail => {
                    this.$message.error(fail.message);
                });
            },
            handleResourceItem(store, roleResources) {
                //暂时不用这种方式
                store.forEach((item) => {
                    if (roleResources.indexOf(item.tid) >= 0) {
                        let node = this.$refs.resourceTree.getNode(item.tid);
                        node.checked = true;
                    }
                    if (item.children.length > 0) {
                        this.handleResourceItem(item.children, roleResources);
                    }
                })
            },
            handlePermissionItem(store, resources, permissions) {
                store.forEach((item) => {
                    resources.push(item.tid);
                    if (item.permissions.length > 0) {
                        item.permissions.forEach((permission) => {
                            permissions.push(permission.tid);
                        })
                    }
                    if (item.children.length > 0) {
                        this.handlePermissionItem(item.children, resources, permissions);
                    }
                })
            },
            handlePermissionSubmit(){
                let roleId = this.multipleSelection[0].tid;
                this.$http.post(this.$global.remote().distributePermission,{roleId:roleId,ids:this.rolePermissionChecked}, response => {
                    this.$global.flashUserPermission();
                    this.closePermissionDialog();
                }, fail => {
                    this.$message.error(fail.message);
                })
            },
            closePermissionDialog(){
                this.rolePermissionChecked = [];
                this.roleResourceChecked = [];
                this.rolePermissionsSrc = [];
                this.roleResourcesSrc = [];
                // this.resetTreeChecked();
                this.permissionDialogVisible = false;
            },
            resetTreeChecked() {
                this.$refs.resourceTree.setCheckedKeys([]);
            },
            //role
            onSearch() {
                this.searchFormData.pageNo = this.currentPage;
                this.searchFormData.pageSize = this.pageSize;
                this.$http.post(this.$global.remote().roleList, this.searchFormData, response => {
                    this.roleInfoDTOS = response.result.roleInfoDTOS;
                    this.totalCount = response.result.totalCount;
                },fail => {
                    this.$message.error(fail.message);
                })
            },
            onAdd(){
                this.dialogTitle = '新增角色';
                this.dialogVisible = true;
                this.dialogCommand = 'add';
                this.formColumnDisable = false;
            },
            onUpdate() {
                if (this.multipleSelection.length > 1) {
                    this.$message({message:"只能选择其中一条数据进行修改",type: 'warning'});
                    return;
                }
                this.dialogTitle = '更新角色';
                this.dialogCommand = 'update';
                this.formColumnDisable = true;
                let tid = this.multipleSelection[0].tid;
                this.$http.get(this.$global.remote().roleFind, {tid:tid}, response => {
                    this.form = response.result;
                    this.dialogVisible = true;
                }, fail => {
                    this.$message.error(fail.message);
                })
            },
            handleSubmit(){
                let url = '';
                let param = {}
                param.roleInfoDTO = this.form;
                if (this.dialogCommand == 'add') {
                    url = this.$global.remote().roleAdd;
                } else if (this.dialogCommand == 'update') {
                    url = this.$global.remote().roleUpdate;
                }
                this.$http.post(url, param, response => {
                    this.closeDialog();
                    this.onSearch();
                    this.$global.flashRoleStore();
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
                    this.$http.post(this.$global.remote().roleDelete, {ids: array}, response => {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.onSearch();
                        this.$global.flashRoleStore();
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
                this.$refs.form.resetFields();
                this.resetForm();
            },
            resetForm(){
                this.form = {
                    tid: '',
                    roleCode: '',
                    roleName: '',
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
            this.buttons.query = userPermissions.indexOf(this.$global.remote().roleList) >= 0;
            this.buttons.add = userPermissions.indexOf(this.$global.remote().roleAdd) >= 0;
            this.buttons.update = userPermissions.indexOf(this.$global.remote().roleUpdate) >= 0;
            this.buttons.delete = userPermissions.indexOf(this.$global.remote().roleDelete) >= 0;
            this.buttons.distribute = userPermissions.indexOf(this.$global.remote().distributePermission) >= 0;
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
    .custom-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right: 8px;
    }
</style>
