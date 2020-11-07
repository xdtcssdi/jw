<template>
  <div class="main-login">
    <lyz-layout
        :pagination="pagination"
        :label="label"
        @handleSizeChange="handleSizeChange"
        @handleCurrentChange="handleCurrentChange">
      <div slot="banner" class="top-right" v-show="is_student===false">
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

        <div>
          <el-row>
            <el-col :span="4" v-for="(item) in tableData" :key="item.examId" :offset="1">
              <div style="margin-top:15px">
                <el-card :body-style="{ padding: '0px', alignment: 'center'}" shadow="hover">
                  <img style="alignment: center;vertical-align: center;height: 100px; width: 100px"
                       src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1604572154625&di=4c4b5f14ccaa846a108215f39e9cc4c5&imgtype=0&src=http%3A%2F%2Fedu_img.bs2.100.com%2F723f5d12785e6f3243782b0.jpg"
                       class="image" @click="enterinfomsg(item.id)">
                  <div>
                    <span @click="enterinfomsg(item.id)">{{ item.classes }}: {{ item.tusername }}<br>要求： {{ item.req }} <br> </span><br>
                    <div class="bottom clearfix;" style="font-size: 10px">
                      <time class="time" @click="enterinfomsg(item.id)"><strong>开始时间:</strong><br> {{ item.stime }}
                      </time>
                      <br>
                      <el-button type="text" size="mini" class="el-button--info" v-show="userType!=='student'"
                                 @click="modifyInfo(item.id)">修改
                      </el-button>
                      <el-button type="text" size="mini" class="danger-text" v-show="userType!=='student'"
                                 @click="deleteInfo(item.id)">删除
                      </el-button>
                    </div>
                  </div>
                </el-card>
              </div>
            </el-col>
          </el-row>

        </div>
        <!--        <el-table-->
        <!--            :data="tableData"-->
        <!--            stripe-->
        <!--            v-loading="loginLoading"-->
        <!--            tooltip-effect="light"-->
        <!--            height="100%"-->
        <!--            style="width: 100%"-->
        <!--            @selection-change="handleSelectionChange">-->
        <!--          &lt;!&ndash;          <el-table-column type="selection" width="55"></el-table-column>&ndash;&gt;-->
        <!--          <el-table-column-->
        <!--              v-for="(data,index) in tableHeader"-->
        <!--              :show-overflow-tooltip="true"-->
        <!--              :key="index"-->
        <!--              :prop="data.prop"-->
        <!--              :label="data.label"-->
        <!--              :min-width="data['min-width']"-->
        <!--              :align="data.align">-->
        <!--          </el-table-column>-->

        <!--          <el-table-column-->
        <!--              fixed="right"-->
        <!--              label="操作"-->
        <!--              align="center"-->
        <!--              min-width="120">-->
        <!--            <template slot-scope="scope">-->
        <!--              <el-button type="text" size="mini" class="el-button&#45;&#45;info"-->
        <!--                         @click="modifyInfo(scope.row.id)">修改-->
        <!--              </el-button>-->
        <!--              <el-button type="text" size="mini" class="danger-text"-->
        <!--                         @click="deleteInfo(scope.row.id)">删除-->
        <!--              </el-button>-->
        <!--            </template>-->
        <!--          </el-table-column>-->
        <!--        </el-table>-->

      </div>
    </lyz-layout>
    <el-dialog :title="'补考信息'" :visible.sync="messageVisible" width="33%" center
               class="user-dialog">
      <el-form :model="messageForm" :label-width="messageLabelWidth" ref="messageForm" :rules="messageRule"
               :validate-on-rule-change=false>

        <el-form-item label="考试ID" prop="exam_id">
          <el-input v-model="messageForm.exam_id" placeholder="请输入考试ID"></el-input>
        </el-form-item>

        <el-form-item label="学科" prop="classes">
          <el-input v-model="messageForm.classes" placeholder="请输入学科名称"></el-input>
        </el-form-item>

        <el-form-item label="学生ID" prop="student_id">
          <el-input v-model="messageForm.student_id" placeholder="请输入学生ID"></el-input>
        </el-form-item>

        <el-form-item label="考试要求" prop="req">
          <el-input v-model="messageForm.req" placeholder="请输入考试要求"></el-input>
        </el-form-item>

        <el-form-item label="开始时间" prop="stime">
          <el-date-picker
              v-model="messageForm.stime"
              type="datetime"
              format="yyyy-MM-dd HH:mm"
              placeholder="选择开始时间"
              align="right"
              :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="结束时间" prop="etime">
          <el-date-picker
              v-model="messageForm.etime"
              type="datetime"
              format="yyyy-MM-dd HH:mm"
              placeholder="选择结束时间"
              align="right"
              :picker-options="pickerOptions">
          </el-date-picker>
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

function convertData(ms) {
  let date = new Date(ms);
  return dateFormat("YYYY-mm-dd HH:MM", date);
}

import lyzLayout from '@/components/lyzLayout';
import manage from '../manage.component';
import {responseText} from '../../../config/utils.js';


export default {
  name: "info",
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
      userType: localStorage.type,
      label: '补考信息管理',
      messageForm: {},
      messageVisible: false,
      messageLabelWidth: '90px',
      isModify: false,
      messageRule: {
        exam_id: [
          {required: true, message: '请输入考试ID', trigger: 'blur'}
        ],
        classes: [
          {required: true, message: '请输入科目', trigger: 'blur'}
        ],
        student_id: [
          {required: true, message: '请输入学生ID', trigger: 'blur'}
        ],
        req: [
          {required: true, message: '请输入考试要求', trigger: 'blur'}
        ],
        stime: [
          {required: true, message: '请输入开始时间', trigger: 'blur'}
        ],
        etime: [
          {required: true, message: '请输入结束时间', trigger: 'blur'}
        ]
      },
      is_student: false,
      multipleSelection: [],//多选的数据
      pickerOptions: {},
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
          prop: 'examId',
          label: '考试ID',
          'min-width': 60,
          align: 'center',
        },
        {
          prop: 'classes',
          label: '科目',
          'min-width': 60,
          align: 'center',
        },
        {
          prop: 'studentId',
          label: '学生ID',
          'min-width': 60,
          align: 'center',
        },
        {
          prop: 'req',
          label: '要求',
          'min-width': 120,
          align: 'center',
        },
        {
          prop: 'stime',
          label: '开始时间',
          'min-width': 120,
          align: 'center',
        },
        {
          prop: 'etime',
          label: '结束时间',
          'min-width': 120,
          align: 'center',
        },
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
    this.changeStatus();
  },
  methods: {
    changeStatus() {
      if (localStorage.type === 'student') {
        this.is_student = true;
      }
    },
    queryList() {
      this.loginLoading = true;
      let params = null;
      if (localStorage.type === "student") {
        params = {
          page: this.pagination.pageIndex,
          pageCount: this.pagination.pageSize,
          type: localStorage.type,
          id: localStorage.id
        };
      } else {
        params = {
          page: this.pagination.pageIndex,
          pageCount: this.pagination.pageSize,
          type: localStorage.type,
          id: localStorage.id
        };
      }
      this.$http.get('http://localhost:8080/makeup-exam/', {params: params}).then(({body}) => {
        if (body.success === true) {
          responseText(body.data.records).forEach((item) => {
            if (item.stime != null) {
              item.stime = convertData(item.stime);
            }
            if (item.etime != null) {
              item.etime = convertData(item.etime);
            }
          })
          this.tableData = responseText(body.data.records);
          console.log(this.tableData);
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

      this.$http.post('http://localhost:8080/user/upload_make_up', form, config).then(function (res) {
        if (res.status === 200) {
          if (res.body) {
            this.$message.success("导入成功");
            this.queryList();
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
    },
    deleteInfo(id) {
      if (this.is_student)
        return;
      this.delete('/makeup-exam/' + id);
    },
    enterinfomsg(id) {
      window.location.href = "/makeupinfo?id=" + id;
      localStorage.setItem("makeupid", id);
    },
    modifyInfo(id) {
      if (this.is_student)
        return;
      this.isModify = true;
      this.$http.get('http://localhost:8080/makeup-exam/' + id).then(({body}) => {
        if (body.success === true) {
          let params = {
            'id': id,
            'examId': body.data.examId,
            'classes': body.data.classes,
            'studentId': body.data.studentId,
            'req': body.data.req,
            'stime': convertData(body.data.stime),
            'etime': convertData(body.data.etime)
          };

          this.messageVisible = true;
          let _form = Object.assign({}, id);

          _form.id = params.id;
          _form.exam_id = params.examId;
          _form.classes = params.classes;
          _form.student_id = params.studentId;
          _form.req = params.req;
          _form.stime = params.stime;
          _form.etime = params.etime;
          this.messageForm = _form;

        } else {
          this.$message.error(body.message);
        }
      }).finally(() => {
        this.loginLoading = false;
      })
    },
    createInfo(row) {
      if (localStorage.type === "student")
        return;
      this.isModify = false;
      this.messageVisible = true;
      let _form = Object.assign({}, row);
      this.messageForm = _form;
    },
    saveInfo() {
      let params = {
        'id': null,
        'examId': this.messageForm.exam_id,
        'classes': this.messageForm.classes,
        'studentId': this.messageForm.student_id,
        'req': this.messageForm.req,
        'stime': this.messageForm.stime,
        'etime': this.messageForm.etime,
      };
      console.log(params);

      this.save('/makeup-exam/', params, "", 'messageVisible');
    },
    updateInfo() {
      console.log('updateInfo');
      let params = {
        'id': this.messageForm.id,
        'examId': this.messageForm.exam_id,
        'classes': this.messageForm.classes,
        'studentId': this.messageForm.student_id,
        'req': this.messageForm.req,
        'stime': new Date(this.messageForm.stime),
        'etime': new Date(this.messageForm.etime),
      };
      console.log(params);
      this.update('/makeup-exam/', params, "", 'messageVisible');
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
