export default {
    data() {
        return {
            appOptions: [],
            appValue: '',
        }
    },
    created() {
        // this.getApp();
    },
    methods: {
        save(url, params,config, visible) {
            url = "http://localhost:8080"+ url;
            this.$http.post(url, params, config).then(({body}) => {
                console.log(body);
                if (body.success === true) {
                    this.file = null;
                    this.$message.success(body.message);
                    this.queryList();
                    if (visible !== '') {
                        this[visible] = false;
                    }
                } else this.$message.error(body.message);
            }).catch(() => {
                this.$message.error('操作失败');
            })
        },
        update(url, params,config, visible) {
            url = "http://localhost:8080"+ url;
            this.$http.put(url, params, config).then(({body}) => {
                console.log(body);
                if (body.success === true) {
                    this.file = null;
                    this.$message.success(body.message);
                    this.queryList();
                    if (visible !== '') {
                        this[visible] = false;
                    }
                } else this.$message.error(body.message);
            }).catch(() => {
                this.$message.error('操作失败');
            })
        },
        handleSizeChange(val) {
            this.pagination.pageSize = val;
            this.pagination.pageIndex = 1;
            this.queryList();
        },
        handleCurrentChange(val) {
            this.pagination.pageIndex = val;
            this.queryList();
        },
        delete(url) {
            url = "http://localhost:8080"+ url;

            this.$confirm('该信息删除后无法恢复，确定要删除吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(() => {
                this.$http.delete(url, {}, ).then(({body}) => {
                    if (body.success === true) {
                        this.$message.success(body.message);
                        this.queryList();
                    } else {
                        this.$message.error(body.message);
                    }
                }).catch(() => {
                    this.$message.error('删除失败');
                })
            }).catch(() => {
                this.$message.info('已取消删除')
            })
        },
    }
}
