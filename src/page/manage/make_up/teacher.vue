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

        <el-button type="primary" size="small" @click="createTeacher" slot="reference">新增</el-button> &nbsp;
        <el-button type="primary" size="small" @click="sendEmail" slot="reference" v-show="u_type==='jw'">发邮件</el-button> &nbsp;


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
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column
              v-for="(data,index) in tableHeader"
              :show-overflow-tooltip="true"
              :key="index"
              :prop="data.prop"
              :label="data.label"
              :min-width="data['min-width']"
              :align="data.align"
              >
          </el-table-column>
          <el-table-column
              fixed="right"
              label="操作"
              align="center"
              min-width="120">
            <template slot-scope="scope">
              <el-button type="text" size="mini" class="el-button--info"
                         @click="modifyTeacher(scope.row.id)">修改
              </el-button>
              <el-button type="text" size="mini" class="danger-text"
                         @click="deleteTeacher(scope.row.id)">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

    </lyz-layout>
    <el-dialog :title="'添加补考信息'" :visible.sync="messageVisible" width="33%" center
               class="user-dialog">
      <el-form :model="messageForm" :label-width="messageLabelWidth" ref="messageForm" :rules="messageRule"
               :validate-on-rule-change=false>

        <el-form-item label="用户名" prop="username">
          <el-input v-model="messageForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input v-model="messageForm.password" placeholder="请输入密码"></el-input>
        </el-form-item>

        <el-form-item label="科目" prop="subject">
          <el-input v-model="messageForm.subject" placeholder="请输入学科"></el-input>
        </el-form-item>

        <el-form-item label="手机号" prop="phone">
          <el-input v-model="messageForm.phone" placeholder="请输入手机号"></el-input>
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input v-model="messageForm.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="messageVisible = false">取 消</el-button>

        <el-button type="primary" @click=updateTeacher v-if="isModify">更 新</el-button>
        <el-button type="primary" @click=saveTeacher v-else>添 加</el-button>

      </div>
    </el-dialog>
  </div>
</template>

<script>

function dateFormat(fmt, date) {
  let ret;
  const opt = {
    "Y+": date.getFullYear().toString(),        // 年
    "m+": (date.getMonth() + 1).toString(),     // 月
    "d+": date.getDate().toString(),            // 日
    "H+": date.getHours().toString(),           // 时
    "M+": date.getMinutes().toString(),         // 分
    "S+": date.getSeconds().toString()          // 秒
    // 有其他格式化字符需求可以继续添加，必须转化成字符串
  };
  for (let k in opt) {
    ret = new RegExp("(" + k + ")").exec(fmt);
    if (ret) {
      fmt = fmt.replace(ret[1], (ret[1].length === 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
    }
  }
  return fmt;
}

function convertData(ms){
  let date = new Date(ms);
  return dateFormat("YYYY-mm-dd HH:MM", date);
}

import lyzLayout from '@/components/lyzLayout';
import manage from '../manage.component';
import {responseText} from '../../../config/utils.js';


export default {
  name: "teacher",
  data() {
    return {
      u_type:localStorage.type,
      queryType: '',
      queryKeyword: '',
      pagination: {
        pageIndex: 1,
        pageSize: 10,
        total: 0,
      },
      label: '监考老师信息管理',
      messageForm: {},
      messageVisible: false,
      messageLabelWidth: '90px',
      isModify:false,
      messageRule: {
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'}
        ],
        subject: [
          {required: true, message: '请输入学科', trigger: 'blur'}
        ],
        phone: [
          {required: true, message: '请输入电话', trigger: 'blur'}
        ],
        email: [
          {required: true, message: '请输入邮箱', trigger: 'blur'}
        ]
      },
      multipleSelection: [],//多选的数据
      pickerOptions: {

      },
      tableData: [],
      loginLoading: false,
      tableHeader: [
        {
          prop: 'id',
          label: 'ID',
          'min-width': 40,
          align: 'center',
        },
        {
          prop: 'username',
          label: '用户名',
          'min-width': 60,
          align: 'center',
        },
        {
          prop: 'password',
          label: '密码',
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
    // this.$watch('queryKeyword', debounce(() => {
    //   this.pagination.pageIndex = 1;
    //   this.queryList();
    // }, 1000));
  },
  methods: {
    queryList() {
      this.loginLoading = true;
      let params = {
        page: this.pagination.pageIndex,
        pageCount: this.pagination.pageSize
      };
      this.$http.get('http://localhost:8080/teacher/', {params: params}).then(({body}) => {
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
    },// 上传文件之前的钩子, 参数为上传的文件,若返回 false 或者返回 Promise 且被 reject，则停止上传
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
      console.log(file.raw);
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

      this.$http.post('http://localhost:8080/user/upload_teacher', form, config).then(function (res) {
        if (res.status === 200) {
          if (res.body) {
            this.$message.success("导入成功");
            this.queryList();
            if (visible !== '') {
              this[visible] = false;
            }
          } else {
            this.$message.error("格式错误");
          }
        }
      }).catch((error) => {
        this.$message.error("导入失败");
      });
    },

    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log(val);
    },
    deleteTeacher(id) {
      this.delete('/teacher/'+id);
    },
    modifyTeacher(id){
      this.isModify = true;
      this.$http.get('http://localhost:8080/teacher/'+id).then(({body}) => {
        if (body.success === true) {
          let params = {
            'id': id,
            'username': body.data.username,
            'password': body.data.password,
            'subject': body.data.subject,
            'phone': body.data.phone,
            'email': body.data.email
          };

          this.messageVisible = true;
          let _form = Object.assign({}, id);

          _form.id = params.id;
          _form.username = params.username;
          _form.password = params.password;
          _form.subject = params.subject;
          _form.phone = params.phone;
          _form.email = params.email;

          this.messageForm = _form;
          if (visible !== '') {
            this[visible] = false;
          }

        } else {
          this.$message.error(body.message);
        }
      }).finally(() => {
        this.loginLoading = false;
      })
    },
    createTeacher(row) {
      this.isModify = false;
      console.log(row);
      this.messageVisible = true;
      let _form = Object.assign({}, row);
      this.messageForm = _form;
    },
    saveTeacher() {
      console.log('save');
      let params = {
        'id': null,
        'username': this.messageForm.username,
        'password': this.messageForm.password,
        'subject': this.messageForm.subject,
        'phone': this.messageForm.phone,
        'email': this.messageForm.email
      };
      console.log(params);

      this.save('/teacher/', params,"", 'messageVisible');
    },
    updateTeacher(){
      console.log('updateTeacher');
      let params = {
        'id': this.messageForm.id,
        'username': this.messageForm.username,
        'password': this.messageForm.password,
        'subject': this.messageForm.subject,
        'phone': this.messageForm.phone,
        'email': this.messageForm.email
      };
      console.log(params);
      this.update('/teacher/', params,"", 'messageVisible');
    },
    sendEmail(){
      this.$prompt('请输入发送内容', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(({ value }) => {
        let url = "http://localhost:8080/user/sendMail?body="+value;
        this.multipleSelection.forEach((item) => {
          url += "&to=" + item.email;
        });
        console.log(url);
        this.$http.get(url).then(({body}) => {

          if (body.success === true) {
            this.$message({
              type: 'success',
              message: "提交发送成功"
            });
            if (visible !== '') {
              this[visible] = false;
            }
          } else this.$message.error(body.message);
        }).catch(() => {
          this.$message.error('操作失败');
        })


      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        });
      });
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
