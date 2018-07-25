<template>
    <div class="user-management-box">
        <div class="form-box">
            <el-form :inline="true" size="mini">
                <el-form-item >
                    <el-button type="primary" @click="onAdd" v-show="buttons.add">新增菜单</el-button>
                    <el-button type="primary" @click="onUpdate" v-show="buttons.update" :disabled="updateDisable">修改菜单</el-button>
                    <!--<el-button type="primary" @click="onDelete" :disabled="deleteDisable">删除</el-button>-->
                    <el-button type="primary" @click="onPermissionAdd" v-show="buttons.perAdd" :disabled="addPermissionDisable">新增权限</el-button>
                    <el-button type="primary" @click="onPermissionUpdate" v-show="buttons.perUpdate" :disabled="updatePermissionDisable">修改权限</el-button>
                    <el-button type="primary" @click="onPermissionDelete" v-show="buttons.perDelete" :disabled="deletePermissionDisable">删除权限</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div>
            <el-container style="border: 1px solid #eee" class="form-container">
                <div class="form-div">
                    <el-form :inline="true" size="mini">
                        <el-form-item style="width: 100px;">
                            <el-input placeholder="菜单名称"></el-input>
                        </el-form-item>
                        <el-form-item >
                            <el-button type="primary" @click="onSearch">查询</el-button>
                        </el-form-item>
                    </el-form>
                </div>
                <div class="form-aside">
                    <el-tree
                        lazy
                        show-checkbox
                        ref="tree"
                        node-key="code"
                        :check-strictly="checkStrictly"
                        :load="loadNode"
                        :props="defaultProps"
                        :default-expand-all="defaultExpand"
                        @check-change="handleCheckChange"
                        @node-expand="handleNodeExpand"
                        @node-collapse="handleNodeCollapse"
                        @node-click="handleNodeClick">
                    </el-tree>
                </div>
                <div class="form-container">
                    <div class="container-top">菜单基本信息</div>
                    <el-container>
                        <el-main style="padding: 20px;height: 320px;">
                            <el-form label-position="right" label-width="110px" :model="nodeData" size="small" :inline="false">
                                <div class="from-item-container">
                                    <div class="form-item-left">
                                        <el-form-item label="菜单编码：">
                                            {{nodeData.resourceCode}}
                                        </el-form-item>
                                        <el-form-item label="菜单名称：">
                                            {{nodeData.resourceName}}
                                        </el-form-item>
                                        <el-form-item label="父级编码：">
                                            {{nodeData.parentCode}}
                                        </el-form-item>
                                        <el-form-item label="菜单路由：">
                                            {{nodeData.router}}
                                        </el-form-item>
                                        <el-form-item label="菜单组件：">
                                            {{nodeData.component}}
                                        </el-form-item>
                                        <el-form-item label="菜单图标：">
                                            {{nodeData.nodeIcon}}
                                        </el-form-item>
                                    </div>
                                    <div class="form-item-right">
                                        <el-form-item label="菜单层级：">
                                            {{resourceLevelShow}}
                                        </el-form-item>
                                        <el-form-item label="菜单类型：">
                                            {{resourceTypeShow}}
                                        </el-form-item>

                                        <el-form-item label="展示顺序：">
                                            {{nodeData.displayOrder}}
                                        </el-form-item>
                                        <el-form-item label="是否叶子节点：">
                                            {{leafFlagShow}}
                                        </el-form-item>
                                        <el-form-item label="是否有效：">
                                            {{activeShow}}
                                        </el-form-item>
                                        <el-form-item label="备注：">
                                            {{nodeData.notes}}
                                        </el-form-item>
                                    </div>
                                </div>
                            </el-form>
                        </el-main>
                    </el-container>
                    <div class="container-top mt20">权限信息</div>
                    <el-container>
                        <el-main style="padding: 20px;height: 320px;">
                            <el-checkbox-group v-model="checkPermissions" @change="handlePermissionChange">
                                <el-checkbox v-for="item in nodeData.permissions" :disabled="item.editAble == false" :label="item.permissionName" :key="item.permissionCode"></el-checkbox>
                            </el-checkbox-group>
                        </el-main>
                    </el-container>
                </div>
            </el-container>
        </div>
        <el-dialog
            :title="resourceDialogTitle"
            :visible.sync="resourceDialogVisible"
            @close="resourceCloseDialog"
            center>
            <el-form label-width="120px" :model="form" :rules="rules" ref="form" size="small" :inline="true">
                <el-input type="hidden" v-model="form.tid" auto-complete="off"></el-input>
                <el-form-item prop="resourceCode" label="菜单编码：">
                    <el-input v-model="form.resourceCode" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item prop="resourceName" label="菜单名称：">
                    <el-input v-model="form.resourceName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item prop="parentCode" label="父级菜单：">
                    <el-select v-model="form.parentCode" filterable placeholder="请选择">
                        <el-option
                            v-for="item in resourceOptions"
                            :key="item.resourceCode"
                            :label="item.resourceName"
                            :value="item.resourceCode">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="菜单路由：">
                    <el-input v-model="form.router" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="菜单组件：">
                    <el-input v-model="form.component" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="菜单图标：">
                    <el-input v-model="form.nodeIcon" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="菜单层级：">
                    <el-select v-model="form.resourceLevel" placeholder="请选择">
                        <el-option v-for="item in resourceLevelItems" :label="item.valueName" :value="item.valueCode" :key="item.valueCode"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="菜单类型：">
                    <el-select v-model="form.resourceType" placeholder="请选择">
                        <el-option v-for="item in resourceTypeItems" :label="item.valueName" :value="item.valueCode" :key="item.valueCode"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="展示顺序：">
                    <el-input type="number" v-model="form.displayOrder" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="是否叶子节点：">
                    <el-checkbox-group v-model="form.leafFlag">
                        <el-checkbox name="active"></el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="是否有效：">
                    <el-checkbox-group v-model="form.active">
                        <el-checkbox name="active" value=""></el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="备注：">
                    <el-input type="textarea" v-model="form.notes" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="resourceCloseDialog">取 消</el-button>
                <el-button type="primary" @click="resourceHandleSubmit">确 定</el-button>
              </span>
        </el-dialog>
        <el-dialog
            :title="permissionDialogTitle"
            :visible.sync="permissionVisible"
            @close="permissionCloseDialog"
            center>
            <el-form label-width="120px" :model="permissionForm" :rules="permissionRules" ref="permissionForm" size="small" :inline="true">
                <el-input type="hidden" v-model="permissionForm.tid" auto-complete="off"></el-input>
                <el-form-item prop="permissionCode" label="权限编码：">
                    <el-input v-model="permissionForm.permissionCode" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item prop="permissionName" label="权限名称：">
                    <el-input v-model="permissionForm.permissionName" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="permissionCloseDialog">取 消</el-button>
                <el-button type="primary" @click="permissionHandleSubmit">确 定</el-button>
              </span>
        </el-dialog>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                buttons: {
                    add: false,
                    update: false,
                    perAdd: false,
                    perUpdate: false,
                    perDelete: false
                },
                checkStrictly: true,
                defaultExpand: false,
                updateDisable: true,
                // deleteDisable: true,
                multipleSelection: [],
                defaultProps:{
                    code: "code",
                    label: 'label',
                    nodeData: 'nodeData',
                    isLeaf:'isLeaf'
                },
                nodeData: {
                    tid: '',
                    resourceCode:'',
                    resourceName:'',
                    router:'',
                    component:'',
                    parentCode:'',
                    resourceLevel:'',
                    resourceType:'',
                    displayOrder:'',
                    nodeIcon:'',
                    leafFlag:'',
                    notes:'',
                    permissions:[]
                },
                resourceDialogTitle: '',
                resourceDialogVisible: false,
                resourceDialogCommand: '',
                form: {
                    tid: '',
                    resourceCode:'',
                    resourceName:'',
                    router:'',
                    component:'',
                    parentCode:'',
                    resourceLevel:'',
                    resourceType:'',
                    displayOrder:'',
                    nodeIcon:'',
                    leafFlag:'',
                    notes:''
                },
                rules: {
                    resourceCode: [
                        { required: true, message: '请输入菜单编码', trigger: 'blur' }
                    ],
                    resourceName: [
                        { required: true, message: '请输入菜单名称', trigger: 'blur' }
                    ],
                    parentCode: [
                        { required: true, message: '请选择父级菜单', trigger: 'blur' }
                    ]
                },
                checkPermissions: [],
                addPermissionDisable: true,
                updatePermissionDisable: true,
                deletePermissionDisable: true,
                permissionDialogTitle: '',
                permissionVisible: false,
                permissionDialogCommand: '',
                permissionEditResourceCode: '',
                permissionForm: {
                    tid: '',
                    resourceTid: '',
                    permissionCode: '',
                    permissionName: '',
                    editAble: true
                },
                permissionRules: {
                    permissionCode: [
                        { required: true, message: '请输入权限编码', trigger: 'blur' }
                    ],
                    permissionName: [
                        { required: true, message: '请输入权限名称', trigger: 'blur' }
                    ],
                }
            }
        },
        methods: {
            //permission
            checkSelectedMenuSingle(){
                if (this.multipleSelection.length > 1) {
                    this.$message({message:"只能选择其中一个菜单操作",type: 'warning'});
                    return false;
                }
                if (this.nodeData.resourceCode != JSON.parse(this.multipleSelection[0].nodeData).resourceCode) {
                    this.$alert('选中菜单与展示数据不一致，请单击需要操作菜单！', '提示', {
                        confirmButtonText: '确定',
                        callback: action => {
                            //TODO
                        }
                    });
                    return false;
                }
                return true;
            },
            onPermissionAdd(){
                if (!this.checkSelectedMenuSingle()) {
                    return;
                }
                this.permissionDialogTitle = '新增权限';
                this.permissionVisible = true;
                this.permissionDialogCommand = 'add';

                let checkMenuData = JSON.parse(this.multipleSelection[0].nodeData);
                this.permissionForm.resourceTid = checkMenuData.tid;
                this.permissionEditResourceCode = checkMenuData.resourceCode;
            },
            onPermissionUpdate(){
                if (!this.checkSelectedMenuSingle()) {
                    return;
                }
                if (this.checkPermissions.length > 1) {
                    this.$message({message:"只能选择其中一条数据进行修改",type: 'warning'});
                    return;
                }
                this.permissionDialogTitle = '更新权限';
                this.permissionDialogCommand = 'update';

                let permissionName = this.checkPermissions[0];
                let checkMenuData = JSON.parse(this.multipleSelection[0].nodeData);
                this.permissionEditResourceCode = checkMenuData.resourceCode;
                for (let i = 0, len = checkMenuData.permissions.length; i < len; i++) {
                    let item = checkMenuData.permissions[i];
                    if (permissionName == item.permissionName) {
                        this.permissionForm = item;
                        break;
                    }
                };
                this.permissionVisible = true;
            },
            permissionHandleSubmit() {
                let url = '';
                if (this.permissionDialogCommand == 'add') {
                    url = this.$global.remote().permissionAdd;
                } else if (this.permissionDialogCommand == 'update') {
                    url = this.$global.remote().permissionUpdate;
                }
                this.$http.post(url, {resourceCode: this.permissionEditResourceCode,permissionDTO: this.permissionForm}, response => {
                    this.updateTreeNode(response.result);
                    this.permissionCloseDialog();
                }, fail => {
                    this.$message.error(fail.message);
                })
            },
            onPermissionDelete(){
                if (!this.checkSelectedMenuSingle()) {
                    return;
                }
                this.$confirm('确认删除选中数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let checkMenuData = JSON.parse(this.multipleSelection[0].nodeData);
                    this.permissionEditResourceCode = checkMenuData.resourceCode;
                    var array = [];
                    for (let i = 0, len = this.checkPermissions.length; i < len; i++) {
                        let permissionName = this.checkPermissions[i];
                        this.nodeData.permissions.forEach((item) => {
                            if (permissionName == item.permissionName) {
                                array.push(item.tid);
                            }
                        });
                    }

                    this.$http.post(this.$global.remote().permissionDelete, {resourceCode: this.permissionEditResourceCode,ids: array}, response => {
                        this.updateTreeNode(response.result);
                        this.checkPermissions = [];
                        //删除节点
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
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
            permissionCloseDialog(){
                this.$refs.permissionForm.resetFields();
                this.permissionVisible = false;
                this.resetPermissionFormData();
            },
            resetPermissionFormData(){
              this.permissionForm = {
                  tid: '',
                  resourceTid: '',
                  permissionCode: '',
                  permissionName: '',
                  editAble: true
              }
            },
            handlePermissionChange(){
                if (this.checkPermissions.length > 0) {
                    this.updatePermissionDisable = false;
                    this.deletePermissionDisable = false;
                } else {
                    this.updatePermissionDisable = true;
                    this.deletePermissionDisable = true;
                }
            },
            //resource
            onSearch(){

            },
            onAdd(){
                this.resourceDialogVisible = true;
                this.resourceDialogTitle = '新增菜单';
                this.resourceDialogCommand = 'add';
            },
            onUpdate(){
                if (this.multipleSelection.length > 1) {
                    this.$message({message:"只能选择其中一条数据进行修改",type: 'warning'});
                    return;
                }
                this.resourceDialogTitle = '修改菜单';
                this.resourceDialogCommand = 'update';
                let tid = JSON.parse(this.multipleSelection[0].nodeData).tid
                this.$http.get(this.$global.remote().resourceFind, {tid:tid}, response => {
                    let data = response.result;
                    if (this.$tools.isNotEmpty(data)) {
                        this.form = data;
                        this.form.active = data.active=='Y';
                        this.form.leafFlag = data.leafFlag=='Y';
                    }
                    this.resourceDialogVisible = true;
                }, fail => {
                    this.$message.error(fail.message);
                })
            },
            updateTreeNode(nodeData){
                this.nodeData = nodeData;
                let newData = {
                    code: nodeData.resourceCode,
                    label: nodeData.resourceName,
                    nodeData: JSON.stringify(nodeData),
                    isLeaf: nodeData.leafFlag
                }
                let node = this.$refs.tree.getNode(nodeData.resourceCode);
                node.data = newData;
                node.checked = true;

                for (let i = 0, len = this.multipleSelection.length; i < len; i++) {
                    if (JSON.parse(this.multipleSelection[i].nodeData).resourceCode == nodeData.resourceCode) {
                        this.multipleSelection.splice(i, 1);
                        break;
                    }
                }
                this.multipleSelection.push(newData);
            },
            resourceHandleSubmit(){
                let url = '';
                let param = {};
                param.resourceDTO = this.form;
                param.resourceDTO.active = this.form.active ? 'Y' : 'N';
                param.resourceDTO.leafFlag = this.form.leafFlag ? 'Y' : 'N';
                if (this.resourceDialogCommand == 'add') {
                    url = this.$global.remote().resourceAdd;
                } else if (this.resourceDialogCommand == 'update') {
                    url = this.$global.remote().resourceUpdate;
                }
                this.$http.post(url, param, response => {
                    let nodeData = response.result;
                    this.nodeData = nodeData;
                    if (this.resourceDialogCommand == 'update') {
                        this.updateTreeNode(nodeData);
                        /*
                        let newData = {
                            code: this.form.resourceCode,
                            label: this.form.resourceName,
                            nodeData: JSON.stringify(nodeData),
                            isLeaf: this.form.leafFlag
                        }
                        let node = this.$refs.tree.getNode(this.form.resourceCode);
                        node.data = newData;
                        node.checked = true;

                        for (let i = 0, len = this.multipleSelection.length; i < len; i++) {
                            if (JSON.parse(this.multipleSelection[i].nodeData).resourceCode == this.form.resourceCode) {
                                this.multipleSelection.splice(i, 1);
                                break;
                            }
                        }
                        this.multipleSelection.push(newData);
                        */
                    } else if (this.resourceDialogCommand == 'add') {
                        let refKey = this.form.parentCode;
                        let newData = {
                            code: this.form.resourceCode,
                            label: this.form.resourceName,
                            nodeData: JSON.stringify(nodeData),
                            isLeaf: this.form.leafFlag
                        }
                        this.$refs.tree.append(newData, refKey);
                    }
                    this.resourceCloseDialog();
                }, fail => {
                    this.$message.error(fail.message);
                })
            },
            resourceCloseDialog(){
                this.resourceDialogVisible = false;
                this.$refs.form.resetFields();
                this.resetFormData();
            },
            resetFormData(){
              this.form = {
                  tid: '',
                  resourceCode:'',
                  resourceName:'',
                  router:'',
                  component:'',
                  parentCode:'',
                  resourceLevel:'',
                  resourceType:'',
                  displayOrder:'',
                  nodeIcon:'',
                  leafFlag:'',
                  notes:''
              }
            },
            onDelete(){
                this.$confirm('确认删除选中数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    var array = [];
                    this.multipleSelection.forEach((item) => {
                        array.push(JSON.parse(item.nodeData).tid);
                    });
                   this.$http.post(this.$global.remote().resourceDelete, {ids: array}, response => {
                        //删除节点
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
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
            handleCheckChange(data, checked){
                if (checked) {
                    this.multipleSelection.push(data);
                } else {
                    this.$tools.removeArrayItemByValue(this.multipleSelection,data);
                }
                if (this.multipleSelection.length > 0) {
                    this.updateDisable = false;
                    // this.deleteDisable = false;
                    this.addPermissionDisable = false;
                } else {
                    this.updateDisable = true;
                    // this.deleteDisable = true;
                    this.addPermissionDisable = true;
                }
            },
            loadNode(node, resolve){
                if (node.level === 0) {
                    return resolve([{
                        code: 'console_1',
                        label: 'console系统',
                        nodeData: JSON.stringify(''),
                        isLeaf: false
                    }]);
                }
                if (node.level >= 1) {
                    let parentCode = node.data.code;
                    this.loadData(parentCode, resolve)
                }
            },
            loadData(parentCode, resolve) {
                this.$http.get(this.$global.remote().resourceFindByParentCode, {parentCode: parentCode}, response => {
                    let resources = response.result;
                    if (resources == null || resources == undefined || resources.length == 0) {
                        return resolve([]);
                    }
                    let temp = new Array();
                    for (let i = 0, len = resources.length; i < len; i++) {
                        let res = resources[i];
                        temp.push({
                            code: res.resourceCode,
                            label: res.resourceName,
                            nodeData: JSON.stringify(res),
                            isLeaf: res.leafFlag == 'Y' ? true : false
                        })
                    }
                    return resolve(temp);
                }, fail => {
                    this.$message.error(fail.message);
                })
            },
            handleNodeClick(data, node){
                if ('console_1' == data.code) {
                    return;
                }
                let temp = JSON.parse(data.nodeData);
                if (temp == null || temp == undefined) {
                    return;
                }
                this.nodeData = temp;
                this.$refs.tree.setCheckedNodes([{
                    code: temp.resourceCode
                }]);
            },
            handleNodeExpand(data) {
            },
            handleNodeCollapse(data){
            },
        },
        computed: {
            activeShow(){
                return this.$global.transformActive(this.nodeData.active);
            },
            leafFlagShow(){
                return this.nodeData.leafFlag == 'Y' ? '是' : '否';
            },
            resourceLevelShow(){
                return this.$global.getValueNameByTermsCodeAndValueCode('RESOURCES_LEVEL', this.nodeData.resourceLevel);
            },
            resourceTypeShow(){
                return this.$global.getValueNameByTermsCodeAndValueCode('JURISDICTION_TYPE', this.nodeData.resourceType);;
            },
            resourceLevelItems(){
                return this.$global.getTermsValueStore('RESOURCES_LEVEL');
            },
            resourceTypeItems(){
                return this.$global.getTermsValueStore('JURISDICTION_TYPE');
            },
            resourceOptions(){
                return this.$global.getMenuCodeValueStore();
            }
        },
        mounted(){
            let userPermissions = this.$global.getUserPermissions();
            this.buttons.add = userPermissions.indexOf(this.$global.remote().resourceAdd) >= 0;
            this.buttons.update = userPermissions.indexOf(this.$global.remote().resourceUpdate) >= 0;
            this.buttons.perAdd = userPermissions.indexOf(this.$global.remote().permissionAdd) >= 0;
            this.buttons.perUpdate = userPermissions.indexOf(this.$global.remote().permissionUpdate) >= 0;
            this.buttons.perDelete = userPermissions.indexOf(this.$global.remote().permissionDelete) >= 0;
        }
    };
</script>


<style lang="less" scoped>
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
    .el-header {
        background-color: #B3C0D1;
        color: #333;
        line-height: 60px;
    }
    .form-container{
        position: relative;
    }
   div.form-div{
       height: 47.8px;
       position: absolute;
       top:0;
       left:0;
   }
    div.form-aside{
        position: absolute;
        top:46.8px;
        left:0;
    }
    div.form-container{
        position: absolute;
        left:200px;
        right:0;
    }
    div.form-div .el-form-item--mini.el-form-item{
        margin-top: 10px;
        margin-left: 5px;
    }
    div.form-container .el-main{
        padding: 0;
    }
    .el-tree{
        width: 180px !important;
    }
    .container-top{
        background-color: #a0cfff;
        color:white;
        height: 40px;
        line-height: 40px;
        padding-left: 10px;
        font-size: 16px;
        -webkit-border-radius: 3px;
        -moz-border-radius: 3px;
        border-radius: 3px;
        border:none;
    }
    .mt20{
        margin-top: 20px;
    }
    .from-item-container{
        position: relative;
    }
    .form-item-left,.form-item-right{
        position: absolute;
        width: 50%;
    }
    .form-item-left{
        top:0;
        left:0;
    }
    .form-item-right{
        top:0;
        left: 50%;
    }
</style>
