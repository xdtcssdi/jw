<template>
  <div class="main-login">
    <lyz-layout
        :pagination="pagination"
        :label="label"
        @handleSizeChange="handleSizeChange"
        @handleCurrentChange="handleCurrentChange">
      <div slot="banner" class="top-right">
        <el-upload
            :limit=1
            :auto-upload="false"
            accept=".xlsx"
            :action="UploadUrl()"
            :on-change="fileChange"
            :before-upload="beforeUploadFile"
            :on-success="handleSuccess"
            :on-error="handleError">
          <el-button type="primary" size="small">点击上传</el-button>
        </el-upload>
        &nbsp;&nbsp;
        <el-button type="primary" size="small" @click="createInfo" slot="reference">新增</el-button>&nbsp;
      </div>

      <div slot="main" class="main-body">
        <el-table
            :data="tableData"
            stripe
            v-loading="loginLoading"
            tooltip-effect="light"
            height="100%"
            style="width: 100%"
            @selection-change="handleSelectionChange">
                   <!-- <el-table-column type="selection" width="55"></el-table-column> -->
          <el-table-column
              v-for="(data,index) in tableHeader"
              :show-overflow-tooltip="true"
              :key="index"
              :prop="data.prop"
              :label="data.label"
              :min-width="data['min-width']"
              :align="data.align">
          </el-table-column>

          <el-table-column
              fixed="right"
              label="操作"
              align="center"
              min-width="120">
            <template slot-scope="scope">
              <el-button type="text" size="mini" class="el-button--info"
                         @click="modifyInfo(scope.row.id)">修改
              </el-button>
              <el-button type="text" size="mini" class="danger-text"
                         @click="deleteInfo(scope.row.id)">删除
              </el-button>
            </template>
          </el-table-column>

        </el-table>
      </div>
    </lyz-layout>
    <el-dialog :title="'添加考试信息'" :visible.sync="messageVisible" width="33%" center
               class="user-dialog">
      <el-form :model="messageForm" :label-width="messageLabelWidth" ref="messageForm" :rules="messageRule"
               :validate-on-rule-change=false>

        <el-form-item label="补考课程" prop="exam_id">

          <el-select class="item-choose" v-model="messageForm.exam_id" size="small">
            <el-option
                v-for="(item,index) in course_options"
                :key="index"
                :label="item.classes"
                :value="item.examId"
            ></el-option>
          </el-select>

        </el-form-item>

        <el-form-item label="监考老师" prop="teacher_id">
          <!--          <el-input v-model="messageForm.teacher_id" placeholder="请输入老师ID"></el-input>-->

          <el-select class="item-choose" v-model="messageForm.teacher_id" size="small">
            <el-option
                v-for="(item,index) in teacher_options"
                :key="index"
                :label="item.username"
                :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="messageVisible = false">取 消</el-button>

        <el-button type="primary" @click=updateInfo v-if="isModify">更 新</el-button>
        <el-button type="primary" @click=saveInfo v-else>添 加</el-button>

      </div>
    </el-dialog>
  </div>
</template>

<script>

import lyzLayout from '@/components/lyzLayout';
import manage from '../manage.component';
import {responseText} from '../../../config/utils.js';


export default {
  name: "exam",
  data() {
    return {
      limitNum: 1,  // 上传excell时，同时允许上传的最大数
      queryType: '',
      queryKeyword: '',
      pagination: {
        pageIndex: 1,
        pageSize: 10,
        total: 0,
      },
      course_options: [],
      teacher_options: [],
      label: '补考老师对应信息管理',
      messageForm: {},
      visible: "",
      messageVisible: false,
      messageLabelWidth: '90px',
      isModify: false,
      messageRule: {
        classes: [
          {required: true, message: '请输入补考课程', trigger: 'blur'}
        ],
        username: [
          {required: true, message: '请输入老师名', trigger: 'blur'}
        ],
      },
      multipleSelection: [],//多选的数据
      pickerOptions: {},
      tableData: [],
      loginLoading: false,
      tableHeader: [
        {
          prop: 'id',
          label: 'ID',
          'min-width': 60,
          align: 'center',
        },
        {
          prop: 'classes',
          label: '补考课程',
          'min-width': 60,
          align: 'center',
        },
        {
          prop: 'username',
          label: '老师',
          'min-width': 60,
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
    this.options();
  },
  mounted() {
    // this.$watch('queryKeyword', debounce(() => {
    //   this.pagination.pageIndex = 1;
    //   this.queryList();
    // }, 1000));
  },
  methods: {
    options(){
      this.$http.get('http://localhost:8080/makeup-exam/select/').then(({body}) => {
        if (body.success === true) {
          this.course_options = body.data;
        } else {
          this.$message.error(body.message);
        }
      }).finally(() => {
        this.loginLoading = false;
      })

      this.$http.get('http://localhost:8080/teacher/select/').then(({body}) => {
        if (body.success === true) {
          this.teacher_options = body.data;
        } else {
          this.$message.error(body.message);
        }
      }).finally(() => {
        this.loginLoading = false;
      })

    },
    queryList() {
      this.loginLoading = true;
      let params = {
        page: this.pagination.pageIndex,
        pageCount: this.pagination.pageSize,
      };

      this.$http.get('http://localhost:8080/exam/', {params: params}).then(({body}) => {
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
    },
    // 上传文件之前的钩子, 参数为上传的文件,若返回 false 或者返回 Promise 且被 reject，则停止上传
    beforeUploadFile(file) {
      let extension = file.name.substring(file.name.lastIndexOf('.') + 1);
      let size = file.size / 1024 / 1024;
      if (extension !== 'xlsx') {
        this.$message.warning('只能上传后缀是.xlsx的文件');
      }
      if (size > 10) {
        this.$message.warning('文件大小不得超过10M');
      }
    },
    // 文件上传成功时的钩子
    handleSuccess(res, file) {
      this.$message.success('文件上传成功');
    },
    // 文件上传失败时的钩子
    handleError(err, file) {
      this.$message.error('文件上传失败');
    },
    UploadUrl: function () {
      // 因为action参数是必填项，我们使用二次确认进行文件上传时，直接填上传文件的url会因为没有参数导致api报404，所以这里将action设置为一个返回为空的方法就行，避免抛错
      return ""
    },
    fileChange: function (file) {
      this.uploadFile(file.raw);
    },
    uploadFile(file) {
      let form = new FormData();
      form.append("file", file)

      let config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      };

      this.$http.post('http://localhost:8080/user/upload_exam', form, config).then(function (res) {
        if (res.status === 200) {
          if (res.body) {
            this.$message.success("导入成功");
            this.queryList();
          } else {
            this.$message.error("格式错误");
          }

        }
      })
    },

    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    deleteInfo(id) {
      this.delete('/exam/' + id);
    },
    modifyInfo(id) {
      this.isModify = true;
      this.$http.get('http://localhost:8080/exam/' + id).then(({body}) => {
        if (body.success === true) {
          let params = {
            'id': id,
            'examId': body.data.examId,
            'teacherId': body.data.teacherId,
          };

          this.messageVisible = true;
          let _form = Object.assign({}, id);

          _form.id = params.id;
          _form.exam_id = params.examId;
          _form.teacher_id = params.teacherId;
          this.messageForm = _form;
        } else {
          this.$message.error(body.message);
        }
      }).finally(() => {
        this.loginLoading = false;
      })
    },
    createInfo(row) {
      this.isModify = false;
      this.messageVisible = true;
      let _form = Object.assign({}, row);
      this.messageForm = _form;
    },
    saveInfo() {
      let params = {
        'id': this.messageForm.id,
        'examId': this.messageForm.exam_id,
        'teacherId': this.messageForm.teacher_id,
      };

      this.save('/exam/', params, "", 'messageVisible');
    },
    updateInfo() {
      let params = {
        'id': this.messageForm.id,
        'examId': this.messageForm.exam_id,
        'teacherId': this.messageForm.teacher_id,
      };
      this.update('/exam/', params, "", 'messageVisible');
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
