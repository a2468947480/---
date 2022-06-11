<template>
    <div class="table">
        <el-row>
            <el-button type="primary" @click="add">新增</el-button>
            <el-button type="warning" @click="refresh">刷新</el-button>
        </el-row>
        <div>
            <el-input placeholder="请输入要搜索的角色名" v-model="Search" class="search">
                <el-button slot="append" icon="el-icon-search" @click="rolenamesearch"></el-button>
            </el-input>
        </div>
        <el-table :data="tableData" v-loading="tableLoading" border style="width: 100%">
            <el-table-column fixed prop="id" label="角色编号" width="80">
            </el-table-column>
            <el-table-column prop="roleName" label="角色名" width="300"> </el-table-column>
            <el-table-column fixed="right" label="操作" width="100">
                <template slot-scope="scope">
                    <el-button @click="update(scope.row)" type="text" size="small">编辑</el-button>
                    <el-button @click="remove(scope.row)" type="text" size="small">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 新增或编辑对话框-->
        <el-drawer title="角色新增" :visible.sync="drawer" :wrapperClosable="false">
            <div>
                <el-form v-loading="drawerLoading" ref="form" :model="userData" label-width="80px">
                    <!-- 隐藏域，用于保存id-->
                    <el-input type="hidden" v-model="userData.id"></el-input>

                    <el-form-item label="角色名">
                        <el-input type="text" v-model="userData.roleName"></el-input>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" @click="save">提交</el-button>
                        <el-button @click="cancel">取消</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-drawer>

        <!-- 底部页码-->
        <div class="block">
            <span class="demonstration">直接前往</span>
            <el-pagination @current-change="handleCurrentChange" :page-size="size" layout="prev, pager, next, jumper"
                :total="maxsize">
            </el-pagination>
        </div>

    </div>
</template>

<script>
export default {
    methods: {
        async add() {
            this.userData.id = null
            this.userData.roleName = ""
            this.drawer = true
            this.drawerLoading = true
            this.drawerLoading = false
        },
        async update(row) {
            this.drawer = true
            this.drawerLoading = true
            let result = await this.$http.get('/role/' + row.id)
            this.userData = result.data
            this.drawerLoading = false
            this.refresh()
        },
        remove(row) {
            this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                let result = await this.$http.delete('/role/' + row.id)
                this.$message.success("删除成功")
                this.refresh()
            });
        },
        cancel() {
            this.$refs.form.resetFields()
            this.drawer = false
        },
        async save() {
            let result = await this.$http.post('/role', this.userData)
            this.$message.info("保存成功")
            this.drawer = false
            this.refresh()
        },
        async refresh() {
            this.tableLoading = true
            this.Search = ""
            let result = await this.$http.get('/role', {
                params: {
                    startindex: this.index,
                    pagesize: this.size,
                    name: this.Search,
                }, showMessage: true
            })
            this.tableData = result.data
            let result1 = await this.$http.get('/role/maxsize', {
                params: {
                    name: this.Search,
                },
            })
            this.maxsize = result1
            this.tableLoading = false

        },
        async handleCurrentChange(val) {
            this.tableLoading = true
            let result = await this.$http.get('/role', {
                params: {
                    startindex: (val - 1) * this.size,
                    pagesize: val == 1 ? 4 : this.size * val - 1,
                    name: this.Search,
                }, showMessage: true
            })
            this.tableData = result.data
            this.tableLoading = false
        },
        async rolenamesearch() {
            this.tableLoading = true
            let result = await this.$http.get('/role', {
                params: {
                    startindex: this.index,
                    pagesize: this.size,
                    name: this.Search,
                },
            })
            this.tableData = result.data
            let result1 = await this.$http.get('/role/maxsize', {
                params: {
                    name: this.Search,
                },
            })
            this.maxsize = result1
            this.tableLoading = false
        }
    },

    mounted: function () {
        this.refresh();
    },
    data() {
        return {
            drawer: false,
            tableLoading: false,
            drawerLoading: false,
            userData: { id: null, roleName: "" },
            tableData: [],
            index: 0,
            size: 4,
            Search: "",
            maxsize: 12,            
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