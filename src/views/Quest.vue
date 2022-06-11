<template>
    <div class="table">
        <el-row>
            <el-button type="primary" @click="add">新增</el-button>
            <el-button type="warning" @click="refresh">刷新</el-button>
        </el-row>

        <el-table :data="tableData" v-loading="tableLoading" border style="width: 100%">
            <el-table-column fixed prop="id" label="编号" width="80">
            </el-table-column>
            <el-table-column prop="title" label="题目" width="600"> </el-table-column>
            <el-table-column fixed="right" label="操作" width="100">
                <template slot-scope="scope">
                    <el-button @click="update(scope.row)" type="text" size="small">编辑</el-button>
                    <el-button @click="remove(scope.row)" type="text" size="small">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 新增或编辑对话框-->
        <el-drawer title="我是标题" :visible.sync="drawer" :wrapperClosable="false" :size="600">
            <div>
                <el-form v-loading="drawerLoading" ref="form" :model="formData" label-width="80px">
                    <!-- 隐藏域，用于保存id-->
                    <el-input type="hidden" v-model="formData.id"></el-input>

                    <el-form-item label="题目">
                        <el-input type="textarea" :rows="3" v-model="formData.title"></el-input>
                    </el-form-item>

                    <el-form-item label="题目类型">
                        <el-radio-group v-model="formData.type">
                            <el-radio-button label="S">单选题</el-radio-button>
                            <el-radio-button label="M">多选题</el-radio-button>
                            <el-radio-button label="J">简答题</el-radio-button>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="选择题" v-show="formData.type == 'S' || formData.type == 'M'">
                        <el-checkbox v-model="formData.options[0].checked">A</el-checkbox>
                        <el-input type="text" v-model="formData.options[0].title"></el-input>
                        <el-checkbox v-model="formData.options[1].checked">B</el-checkbox>
                        <el-input type="text" v-model="formData.options[1].title"></el-input>
                        <el-checkbox v-model="formData.options[2].checked">C</el-checkbox>
                        <el-input type="text" v-model="formData.options[2].title"></el-input>
                        <el-checkbox v-model="formData.options[3].checked">D</el-checkbox>
                        <el-input type="text" v-model="formData.options[3].title"></el-input>
                    </el-form-item>

                    <el-form-item label="简答题" v-show="formData.type == 'J'">
                        <el-input type="textarea" :rows="3"></el-input>
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
        },

        async add() {
            this.formData.id = null
            this.formData.title = ""
            this.formData.type = "S"
            this.drawer = true
            this.drawerLoading = true
            await this.initDrawer()
            this.drawerLoading = false
        },
        async update(row) {
            this.drawer = true
            this.drawerLoading = true
            let result = await this.$http.get('/question/' + row.id)
            this.formData = result.data
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
                let result = await this.$http.delete('/question/' + row.id)
                this.$message.success("删除成功")
                this.refresh()
            });
        },
        cancel() {
            this.$refs.form.resetFields()
            this.drawer = false
        },
        async save() {
            let result = await this.$http.post('/question', this.formData)
            this.$message.info("保存成功")
            this.drawer = false
            this.refresh()
        },
        async refresh() {
            this.tableLoading = true
            let result = await this.$http.get('/question', { showMessage: false })
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
            formData: { id: null, title: "", type: "S", options: [{ checked: false, title: "" }, { checked: false, title: "" }, { checked: false, title: "" }, { checked: false, title: "" },], },

            tableData: [],
            rules: {
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