<template>
    <div class="table">
        <el-row>
            <el-button type="primary" @click="add">新增</el-button>
            <el-button type="warning" @click="refresh">刷新</el-button>
        </el-row>

        <el-table :data="tableData" v-loading="tableLoading" border style="width: 100%">
            <el-table-column fixed prop="id" label="编号" width="80">
            </el-table-column>
            <el-table-column prop="username" label="用户名" width="300"> </el-table-column>
            <el-table-column prop="roleName" label="角色" width="120"> </el-table-column>
            <el-table-column prop="deptName" label="部门" width="120"> </el-table-column>
            <el-table-column fixed="right" label="操作" width="100">
                <template slot-scope="scope">
                    <el-button @click="update(scope.row)" type="text" size="small">编辑</el-button>
                    <el-button @click="remove(scope.row)" type="text" size="small">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 新增或编辑对话框-->
        <el-drawer title="用户新增" :visible.sync="drawer" :wrapperClosable="false">
            <div>
                <el-form v-loading="drawerLoading" ref="form" :model="userData" label-width="80px">
                    <!-- 隐藏域，用于保存id-->
                    <el-input type="hidden" v-model="userData.id"></el-input>

                    <el-form-item label="用户名">
                        <el-input type="text" v-model="userData.username"></el-input>
                    </el-form-item>

                    <el-form-item label="密码">
                        <el-input type="password" v-model="userData.password"></el-input>
                    </el-form-item>

                    <el-form-item label="部门">
                        <el-cascader :options="deptOptions" v-model="userData.deptId"
                            :props="{ checkStrictly: true, emitPath: false, label: 'deptName', value: 'id' }" clearable>
                        </el-cascader>
                    </el-form-item>

                    <el-form-item label="角色">
                        <el-select v-model="userData.roleId" placeholder="请选择">
                            <el-option v-for="item in roleOptions" :key="item.id" :label="item.roleName"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" @click="save">提交</el-button>
                        <el-button @click="cancel">取消</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-drawer>

    </div>
</template>

<script>
export default {
    methods: {
        async initDrawer() {
            let roles = this.$http.get('/role/all').then(result => {
                this.roleOptions = result.data
                this.userData.roleId = result.data.length > 0 ? result.data[0].id : 0
            })
            let depts = this.$http.get('/dept/tree').then(result => { this.deptOptions = result.data })
            await Promise.all([roles, depts])
        },
        async add() {
            this.userData.id = null
            this.userData.username = ""
            this.userData.password = ""
            this.userData.deptId = 0
            this.drawer = true
            this.drawerLoading = true
            await this.initDrawer()
            this.drawerLoading = false
        },
        async update(row) {
            this.drawer = true
            this.drawerLoading = true
            let result = await this.$http.get('/user/' + row.id)
            this.userData = result.data
            await this.initDrawer()
            this.drawerLoading = false
            this.refresh()
        },
        remove(row) {
            this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                let result = await this.$http.delete('/user/' + row.id)
                this.$message.success("删除成功")
                this.refresh()
            });
        },
        cancel() {
            this.$refs.form.resetFields()
            this.drawer = false
        },
        async save() {
            let result = await this.$http.post('/user', this.userData)
            this.$message.info("保存成功")
            this.drawer = false
            this.refresh()
        },
        async refresh() {
            this.tableLoading = true
            let result = await this.$http.get('/user', { showMessage: true })
            this.tableData = result.data
            this.tableLoading = false

        },
    },
    mounted: function () {
        this.refresh();
    },
    data() {
        return {
            drawer: false,
            tableLoading: false,
            drawerLoading: false,
            userData: { id: null, username: "", password: "", deptId: 0, roleId: 0 },
            roleOptions: [],
            deptOptions: [],
            tableData: [],
            rules: {
                username: [
                    { required: true, message: "请输入用户名", trigger: "blur" },
                    { min: 3, max: 15, message: "长度在 3 到 20 个字符", trigger: "blur" },
                ],
                password: [
                    { required: true, message: "请输入密码", trigger: "blur" },
                    { min: 6, max: 15, message: "长度在 6 到 20 个字符", trigger: "blur" },
                ],
            }, //end of rules            
        };
    },
};
</script>

<style lang="less" scoped>
.table {
    .el-row {
        margin: 10px;
    }
}

.el-drawer {
    div {
        margin: 10px;
    }
}
</style>