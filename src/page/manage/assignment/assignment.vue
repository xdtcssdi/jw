<template>
  <div class="main-login">
    <lyz-layout
        :pagination="pagination"
        :label="label"
        @handleSizeChange="handleSizeChange"
        @handleCurrentChange="handleCurrentChange"
    >
      <div slot="banner" class="top-right">
        <el-button
            v-show="u_type === 'student'"
            type="primary"
            size="small"
            @click="createAssignment"
            slot="reference"
        >新增
        </el-button
        >&nbsp;
      </div>
      <div slot="main" class="main-body">

        <!--        <div>-->
        <!--          <el-row>-->
        <!--            <el-col :span="4" v-for="(item) in tableData" :key="item.examId" :offset="1">-->
        <!--              <div style="margin-top:15px">-->
        <!--                <el-card :body-style="{ padding: '0px', alignment: 'center'}" shadow="hover">-->
        <!--                  <img style="alignment: center;vertical-align: center;height: 100px; width: 100px"-->
        <!--                       src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1604572154625&di=4c4b5f14ccaa846a108215f39e9cc4c5&imgtype=0&src=http%3A%2F%2Fedu_img.bs2.100.com%2F723f5d12785e6f3243782b0.jpg"-->
        <!--                       class="image">-->
        <!--                  <div>-->
        <!--                    <span>{{ item.classes }}: {{item.tusername}}<br>要求： {{ item.req }} <br> </span><br>-->
        <!--                    <div class="bottom clearfix;" style="font-size: 10px">-->
        <!--                      <time class="time"><strong>开始时间:</strong><br> {{ item.stime }}</time>-->
        <!--                      <br>-->
        <!--                      <el-button type="text" size="mini" class="el-button&#45;&#45;info" v-show="userType!=='student'"-->
        <!--                                 @click="modifyInfo(item.id)">修改-->
        <!--                      </el-button>-->
        <!--                      <el-button type="text" size="mini" class="danger-text" v-show="userType!=='student'"-->
        <!--                                 @click="deleteInfo(item.id)">删除-->
        <!--                      </el-button>-->
        <!--                    </div>-->
        <!--                  </div>-->
        <!--                </el-card>-->
        <!--              </div>-->
        <!--            </el-col>-->
        <!--          </el-row>-->

        <!--        </div>-->


        <el-table
            :data="tableData"
            stripe
            v-loading="loginLoading"
            tooltip-effect="light"
            height="100%"
            style="width: 100%"
            @selection-change="handleSelectionChange"
        >
          <!--          <el-table-column type="selection" width="55"></el-table-column>-->
          <el-table-column
              v-for="(data, index) in tableHeader"
              :show-overflow-tooltip="true"
              :key="index"
              :prop="data.prop"
              :label="data.label"
              :min-width="data['min-width']"
              :align="data.align"
          >
          </el-table-column>

          <el-table-column label="文件下载" min-width="250">
            <template slot-scope="scope">
              <el-button @click="download(scope.row.id)">下载</el-button>
            </template>
          </el-table-column>

          <el-table-column
              fixed="right"
              label="操作"
              align="center"
              min-width="120"
          >
            <template slot-scope="scope">
              <el-button
                  type="text"
                  size="mini"
                  class="el-button--Assignment"
                  @click="modifyAssignment(scope.row.id)"
              >修改
              </el-button>
              <el-button type="text" size="mini" class="danger-text"
                         @click="deleteAssignment(scope.row.id)">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </lyz-layout>
    <el-dialog :title="'作业信息'" :visible.sync="messageVisible" width="33%" center
               class="user-dialog">
      <el-form :model="messageForm" :label-width="messageLabelWidth" ref="messageForm" :rules="messageRule"
               :validate-on-rule-change=false>

        <el-form-item label="补考编号" prop="mid">

          <el-input v-model="messageForm.mid" placeholder="请输入补考编号" disabled></el-input>

        </el-form-item>

        <el-form-item label="学生学号" prop="studentId" id="xsl">
          <el-input
              v-model="messageForm.studentId"
              :value="u_id"
              disabled
          ></el-input>
        </el-form-item>
        <el-form-item v-show="u_type !== 'student'" label="分数" prop="score">
          <el-input-number
              v-model="messageForm.score"
              controls-position="right"
          ></el-input-number>
        </el-form-item>

        <el-form-item label="file" prop="file">
          <el-upload
              :limit="1"
              :auto-upload="false"
              accept="*"
              :action="UploadUrl()"
              :on-change="fileChange"
              :before-upload="beforeUploadFile"
              :on-success="handleSuccess"
              :on-error="handleError"
          >
            <el-button type="primary" size="small">点击上传</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="messageVisible = false">取 消</el-button>

        <el-button type="primary" @click="updateAssignment" v-if="isModify"
        >更 新
        </el-button
        >
        <el-button type="primary" @click="saveAssignment" v-else
        >添 加
        </el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import lyzLayout from "@/components/lyzLayout";
import manage from "../manage.component";
import {responseText} from "../../../config/utils.js";

export default {
  name: "Assignment",
  data() {
    return {
      score: 0,
      u_id: localStorage.id,
      limitNum: 1, // 上传excell时，同时允许上传的最大数
      queryType: "",
      queryKeyword: "",
      pagination: {
        pageIndex: 1,
        pageSize: 10,
        total: 0,
      },
      u_type: localStorage.type,
      label: "作业管理",
      messageForm: {},
      messageVisible: false,
      messageLabelWidth: "90px",
      isModify: false,
      messageRule: {
        mid: [
          {required: true, message: '请输入补考编号', trigger: 'blur'}
        ],
        studentId: [
          {required: true, message: "请输入学生学号", trigger: "blur"},
        ],
        file: [{required: true, message: "请上传作业", trigger: "blur"}],
        score: [{required: true, message: "请输入分数", trigger: "blur"}],
      },
      file: null,
      multipleSelection: [], //多选的数据
      pickerOptions: {},
      tableData: [],
      loginLoading: false,
      tableHeader: [
        {
          prop: "id",
          label: "ID",
          "min-width": 40,
          align: "center",
        },
        {
          prop: "mid",
          label: "补考编号",
          "min-width": 50,
          align: "center",
        },
        {
          prop: "studentId",
          label: "学生学号",
          "min-width": 60,
          align: "center",
        },
        {
          prop: "file",
          label: "作业",
          "min-width": 200,
          align: "center",
        },
        {
          prop: "score",
          label: "分数",
          "min-width": 60,
          align: "center",
        },
      ],
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
      let params = null;
      if (localStorage.type === "student") {
        params = {
          page: this.pagination.pageIndex,
          pageCount: this.pagination.pageSize,
          type: localStorage.type,
          id: localStorage.id,
        };
      } else {
        params = {
          page: this.pagination.pageIndex,
          pageCount: this.pagination.pageSize,
          type: localStorage.type,
          id: localStorage.id,
        };
      }

      this.$http
          .get("http://localhost:8080/assignment", {params: params})
          .then(({body}) => {
            if (body.success === true) {
              responseText(body.data.records).forEach((item) => {
                let t = item.file.split("/");
                item.file = t[t.length - 1];
              });
              this.tableData = body.data.records;
              this.pagination.total = body.data.records ? body.data.total : 0;
            } else {
              this.$message.error(body.message);
            }
          })
          .finally(() => {
            this.loginLoading = false;
          });
    },
    // 上传文件之前的钩子, 参数为上传的文件,若返回 false 或者返回 Promise 且被 reject，则停止上传
    beforeUploadFile(file) {
      let extension = file.name.substring(file.name.lastIndexOf(".") + 1);
      let size = file.size / 1024 / 1024;
      if (extension !== "xlsx") {
        this.$message.warning("只能上传后缀是.xlsx的文件");
      }
      if (size > 10) {
        this.$message.warning("文件大小不得超过10M");
      }
    },
    // 文件上传成功时的钩子
    handleSuccess(res, file) {
      this.$message.success("文件上传成功");
    },
    // 文件上传失败时的钩子
    handleError(err, file) {
      this.$message.error("文件上传失败");
    },
    UploadUrl: function () {
      // 因为action参数是必填项，我们使用二次确认进行文件上传时，直接填上传文件的url会因为没有参数导致api报404，所以这里将action设置为一个返回为空的方法就行，避免抛错
      return "";
    },
    fileChange: function (file) {
      this.file = file.raw;
      //this.uploadFile(file.raw);
    },
    download(id) {
      window.location.href = "http://localhost:8080/down?id=" + id;
    },
    uploadFile(file) {
      let form = new FormData();
      form.append("file", file);

      let config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      // this.$http.post('http://localhost:8080/assignment/upload_make_up', form, config).then(function (res) {
      //   if (res.status === 200) {
      //     if (res.body) {
      //       this.$message.success("导入成功");
      //       this.queryList();
      //     } else {
      //       this.$message.error("格式错误");
      //     }
      //   }
      // }).catch((error) => {
      //   this.$message.error("导入失败");
      // });
    },

    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    deleteAssignment(id) {
      if (localStorage.type === "teacher") return;
      this.delete("/assignment/" + id);
    },
    modifyAssignment(id) {
      this.isModify = true;
      this.$http
          .get("http://localhost:8080/assignment/" + id)
          .then(({body}) => {
            if (body.success === true) {
              let params = {
                id: body.data.id,
                mid: body.data.mid,
                studentId: body.data.studentId,
                file: body.data.file,
                score: body.data.score,
              };

              this.messageVisible = true;
              let _form = Object.assign({}, id);

              _form.id = params.id;
              _form.studentId = params.studentId;
              _form.mid = params.mid;
              _form.file = params.file;
              _form.score = params.score;
              this.messageForm = _form;
            } else {
              this.$message.error(body.message);
            }
          })
          .finally(() => {
            this.loginLoading = false;
          });
    },
    createAssignment(row) {
      this.isModify = false;
      this.messageVisible = true;
      let _form = Object.assign({}, row);
      this.messageForm = _form;
      if (localStorage.type === "student") _form.studentId = localStorage.id;
    },
    saveAssignment() {
      let form = new FormData();
      form.append("file", this.file);
      form.append("mId", this.messageForm.mid);
      if (localStorage.type === "student") {
        form.append("studentId", localStorage.id);
      } else {
        form.append("studentId", this.messageForm.studentId);
      }
      form.append("score", 0);
      let config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
      this.save("/assignment/", form, config, "messageVisible");
    },
    updateAssignment() {
      let form = new FormData();
      if (this.file != null) form.append("file", this.file);
      form.append("id", this.messageForm.id);
      form.append("mId", this.messageForm.mid);
      if (localStorage.type === "student") {
        form.append("studentId", localStorage.id);
      } else {
        form.append("studentId", this.messageForm.studentId);
      }
      form.append("score", this.messageForm.score);
      form.append("origin", this.messageForm.file);

      let config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
      this.update("/assignment/", form, config, "messageVisible");
    },
  },
};
</script>

<style scoped>
.main-login {
  height: 100%;
}

.danger-text {
  color: #f56c6c;
}
</style>
