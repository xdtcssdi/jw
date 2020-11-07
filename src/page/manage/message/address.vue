<template>
  <div class="main-login">
    <lyz-layout
        :pagination="pagination"
        :label="label"
        @handleSizeChange="handleSizeChange"
        @handleCurrentChange="handleCurrentChange">
      <div slot="banner" class="top-right">
        <el-button type="primary" size="small" @click="openchat" slot="reference">打开聊天室</el-button>&nbsp;
      </div>

      <div slot="main" class="main-body">
        <el-table
            :data="tableData"
            stripe
            v-loading="loginLoading"
            tooltip-effect="light"
            height="100%"
            style="width: 100%">
          <el-table-column
              v-for="(data,index) in tableHeader"
              :show-overflow-tooltip="true"
              :key="index"
              :prop="data.prop"
              :label="data.label"
              :min-width="data['min-width']"
              :align="data.align">
          </el-table-column>

        </el-table>
      </div>
    </lyz-layout>
  </div>
</template>

<script>

import lyzLayout from '@/components/lyzLayout';
import manage from '../manage.component';
import {responseText} from '../../../config/utils.js';


export default {
  name: "address",
  data() {
    return {
      queryType: '',
      queryKeyword: '',
      pagination: {
        pageIndex: 1,
        pageSize: 10,
        total: 0,
      },
      label: '通讯录管理',
      messageForm: {},
      messageVisible: false,
      messageLabelWidth: '90px',
      isModify: false,
      u_type: localStorage.type,
      multipleSelection: [],//多选的数据
      pickerOptions: {},
      tableData: [],
      loginLoading: false,
      tableHeader: [
        {
          prop: 'username',
          label: '用户名',
          'min-width': 60,
          align: 'center',
        },
        {
          prop: 'subject',
          label: '科目',
          'min-width': 60,
          align: 'center',
        },
        {
          prop: 'phone',
          label: '电话',
          'min-width': 60,
          align: 'center',
        },
        {
          prop: 'email',
          label: '邮箱',
          'min-width': 120,
          align: 'center',
        }
      ]
    };
  },
  components: {
    lyzLayout,
  },
  mixins: [manage],
  created() {
    this.queryList();
  },
  mounted() {
  },
  methods: {
    openchat() {
      var tempwindow = window.open('_blank');
      tempwindow.location = "http://localhost:8080/websocket/" + localStorage.username;
    },
    queryList() {
      this.loginLoading = true;

      let params = {
        page: this.pagination.pageIndex,
        pageCount: this.pagination.pageSize,
        type: localStorage.type,
        id: localStorage.id
      };

      this.$http.get('http://localhost:8080/address/', {params: params}).then(({body}) => {
        if (body.success === true) {
          responseText(body.data.records);
          this.tableData = responseText(body.data.records);
          this.pagination.total = body.data.records ? body.data.total : 0;
        } else {
          this.$message.error(body.message);
        }
      }).finally(() => {
        this.loginLoading = false;
      })
    }
  }

}
</script>

<style scoped>
.main-login {
  height: 100%;
}

.danger-text {
  color: #F56C6C;
}
</style>
