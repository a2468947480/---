<template>
    <div class="table">
        <el-row>
            <el-button type="primary" @click="add">新增</el-button>
            <el-button type="warning" @click="refresh">刷新</el-button>
            <el-button type="primary" @click="update">编辑</el-button>
            <el-button type="primary" @click="remove">删除</el-button>
        </el-row>

        <el-cascader-panel :options="deptOptions" @change="Onchange" v-model="userData.id"
            :props="{ checkStrictly: true, emitPath: false, label: 'deptName', value: 'id' }">
        </el-cascader-panel>

        <!-- 新增或编辑对话框-->
        <el-drawer title="用户新增" :visible.sync="drawer" :wrapperClosable="false">
            <div>
                <el-form v-loading="drawerLoading" ref="form" :model="userData" label-width="80px">

                    <el-form-item label="组织名">
                        <el-input type="text" v-model="userData.deptName"></el-input>
                    </el-form-item>

                    <el-form-item label="所属部门">
                        <el-cascader :options="deptOptions" v-model="userData.parentId" @change="Onchange"
                            :props="{ checkStrictly: true, emitPath: false, label: 'deptName', value: 'id' }" clearable>
                        </el-cascader>
                    </el-form-item>
                    <h1>选择上一级部门,若无上一级,则不要选择或者点击选项旁边的'x'取消</h1>

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
            let depts = this.$http.get('/dept/tree').then(result => { this.deptOptions = result.data })

        },
        async add() {
            let result1 = await this.$http.get('/dept/maxid') + 1
            this.userData.id = result1
            this.userData.deptName = ""
            this.drawer = true
            this.drawerLoading = true
            await this.initDrawer()
            this.drawerLoading = false
            this.userData.parentId = ""
        },
        async update() {
            if (this.userData.id > 0) {
                this.drawer = true
                this.drawerLoading = true
                let result = await this.$http.get('/dept/' + this.userData.id)
                this.userData = result.data
                await this.initDrawer()
                this.drawerLoading = false
                this.refresh()
            } else {
                this.$message.info("必须选中才能进行该操作")
            }

        },
        async remove() {
            let result1 = await this.$http.get('/dept/findchild', {
                params: {
                    id: this.userData.id,
                },
            })
            if (result1 != 0) {
                this.$message.info("无法删除有附属组织的组织")
            }
            else if (this.userData.id > 0) {
                this.$confirm('此操作将永久删除该组织, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    let result = await this.$http.delete('/dept/' + this.userData.id)
                    this.$message.success("删除成功")
                    this.refresh()
                });
            }
            else {
                this.$message.info("必须选中才能进行该操作")
            }
        },
        cancel() {
            this.$refs.form.resetFields()
            this.userData.parentId = ""
            this.drawer = false

        },
        async save() {
            let result = await this.$http.post('/dept', this.userData)
            this.$message.info("保存成功")
            this.drawer = false
            this.userData.parentId = ""
            this.refresh()
        },
        async refresh() {
            let depts = this.$http.get('/dept/tree').then(result => { this.deptOptions = result.data })

        },
        async Onchange(value) {
            if (this.userData.id == this.userData.parentId) {
                this.drawer = false
                this.$message.info("附属部门不能选择自己")
                this.userData.parentId = ""
            }
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
            userData: { id: 0, deptName: "", parentId: "" },
            deptOptions: [],
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