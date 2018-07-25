<template>
    <div>
        <div class="custom-tree-container">
            <div class="block">
                <p>使用 scoped slot</p>
                <el-tree
                    :data="data5"
                    show-checkbox
                    node-key="id"
                    default-expand-all
                    :expand-on-click-node="false">
                  <span class="custom-tree-node" slot-scope="{ node, data }">
                    <span>{{ node.label }}</span>
                    <span>
                      <el-checkbox-group >
                        <el-checkbox v-for="item in data.permissions"  :label="item" :key="item"></el-checkbox>
                      </el-checkbox-group>
                    </span>
                  </span>
                </el-tree>
            </div>
        </div>
    </div>
</template>

    <script>
        let id = 1000;

        export default {
            data() {
                const data = [{
                    id: 1,
                    label: '一级 1',
                    permissions: ['菜单','新增','更新','删除'],
                    children: [{
                        id: 4,
                        label: '二级 1-1',
                        permissions: ['菜单','新增','更新','删除'],
                        children: [{
                            id: 9,
                            label: '三级 1-1-1',
                            permissions: ['更新','删除'],
                        }, {
                            id: 10,
                            label: '三级 1-1-2',
                            permissions: ['菜单','新增','更新','删除'],
                        }]
                    }]
                }, {
                    id: 2,
                    label: '一级 2',
                    permissions: ['菜单','新增'],
                    children: [{
                        id: 5,
                        label: '二级 2-1',
                        permissions: ['菜单','新增','更新','删除'],
                    }, {
                        id: 6,
                        label: '二级 2-2',
                        permissions: ['菜单','新增','更新','删除'],
                    }]
                }, {
                    id: 3,
                    label: '一级 3',
                    permissions: ['菜单','新增','更新','删除'],
                    children: [{
                        id: 7,
                        label: '二级 3-1',
                        permissions: ['菜单','新增','更新','删除'],
                    }, {
                        id: 8,
                        label: '二级 3-2',
                        permissions: ['菜单','新增','更新','删除'],
                    }]
                }];
                return {
                    data4: JSON.parse(JSON.stringify(data)),
                    data5: JSON.parse(JSON.stringify(data)),
                    permissions: ['菜单','新增','更新','删除'],
                }
            },

            methods: {
                append(data) {
                    const newChild = { id: id++, label: 'testtest', children: [] };
                    if (!data.children) {
                        this.$set(data, 'children', []);
                    }
                    data.children.push(newChild);
                },

                remove(node, data) {
                    const parent = node.parent;
                    const children = parent.data.children || parent.data;
                    const index = children.findIndex(d => d.id === data.id);
                    children.splice(index, 1);
                },
            }
        };
    </script>

    <style>
        .custom-tree-node {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 14px;
            padding-right: 8px;
        }
    </style>

