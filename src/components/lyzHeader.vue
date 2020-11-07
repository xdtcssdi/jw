
<template>
  <div class="maindiv">
    <div class="header-main">
      <div class="header-start" @click="modifyCollapse">
        <img src="../assets/img/navCloseIcon.png" />
      </div>
      <div v-if="changeHeader() === true">

        <h1 v-html="subjectName" style="margin-top: 20px; color: white">

        </h1>

      </div>
      <div class="header-end">

        <el-menu class="el-menu-demo" mode="horizontal"  v-show="changeHeader() === true" style="background-color:transparent; ">
          <el-menu-item index="1" style="color: white"><a href="/make_up">首页</a></el-menu-item>
          <el-menu-item index="2" style="color: white">资料</el-menu-item>
          <el-menu-item index="3" style="color: white"><a href="/assignmentInner">作业</a></el-menu-item>
          <el-menu-item index="4" style="color: white">考试</el-menu-item>
          <!--          <el-menu-item index="4"><a href="https://www.ele.me" target="_blank">订单管理</a></el-menu-item>-->
        </el-menu>

        <el-dropdown trigger="click" @command="handleCommand" v-show="changeHeader() !== true">
          <span class="el-dropdown-link">
            <span v-html="loginUserName"></span>
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              command="detailMessage"
              @click.native="getUserInfo"
              >详细信息</el-dropdown-item
            >
            <el-dropdown-item command="logout">退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>

    <el-dialog
      title="用户信息"
      :visible.sync="userinfoVisible"
      width="33%"
      center
      class="user-dialog"
    >
      <el-form
        :model="userinfoFrom"
        :label-width="userinfoLabelWidth"
        ref="userinfoFrom"
        :validate-on-rule-change="false"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="username" type="text"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="password" type="password"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="updateuserinfo">更 新</el-button>
        <el-button @click="userinfoVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
import lyzLayout from "@/components/lyzLayout";
import manage from "../page/manage/manage.component";
import { responseText } from "../config/utils.js";
export default {
  name: "lyzHeader",
  data() {
    return {
      subjectName:"课程名字",
      userinfoFrom: { username: "", password: "" },
      userinfoVisible: false,
      userinfoLabelWidth: "90px",
      username: "",
      password: "",
      type: "",
      loginUserName: localStorage.username,
    };
  },
  created() {
    this.getCurrentUser();
  },mounted() {
    let is_student = this.changeHeader();
    if (is_student)
    this.subjectname();
  },
  computed: mapState(["collapse"]),
  methods: {
    updateuserinfo() {
      let form = new FormData();
      form.append("username", localStorage.username);
      form.append("newpassword", this.password);
      form.append("newusername", this.username);
      form.append("type", this.type);
      this.update("/user/resetinfo", form);
    },update(url, params) {
      url = "http://localhost:8080"+ url;
      this.$http.post(url, params).then(({body}) => {
        if (body.success === true) {
          this.file = null;
          this.$message.success(body.message);
          localStorage.username = this.username;
          this.loginUserName = this.username;
          this.userinfoVisible = false;
        }
        else
          this.$message.error(body.message);
      }).catch(() => {
        this.$message.error('操作失败');
      })
    },
    subjectname() {
      let query = this.$route.query;
      let subjectid = query.id;

      this.$http.get("http://localhost:8080/makeup-exam/"+subjectid).then(({body})=>{
        console.log(body);
        if (body.success===true){
          this.subjectName = body.data.classes;
          console.log(this.subjectName);
        }
      });

      return "JaveEE程序设计与实现";
    },
    getUserInfo() {
      this.username = localStorage.username;
      this.type = localStorage.type;
      this.$http
        .get(
          "http://localhost:8080/user/userinfo?" +
            "username=" +
            this.username +
            "&type=" +
            this.type
        )
        .then(({ body }) => {
          if (body.success === true) {
            this.userinfoVisible = true;
            this.password = body.data.password;
          }
        })
        .finally(() => {});
    },
    getCurrentUser() {
      if (localStorage.username) {
        this.loginUserName = localStorage.username;
      } else {
        window.location.href = "/login.html";
      }
    },changeHeader(){
      let currentPath = this.$route.path;
      if (currentPath==='/makeupinfo')
        return true;
      return false;
    },
    modifyCollapse() {
      this.$store.commit("setCollapse", !this.collapse);
    },
    handleCommand(command) {
      if (command === "logout") {
        localStorage.removeItem("username");
        localStorage.removeItem("type");
        if (!localStorage.username) window.location.href = "/login.html";
      } else if (command === "detailMessage") {
      }
    }
  },
};
</script>

<style scoped lang="scss">
.header-main {
  display: flex;
  justify-content: space-between;
  .header-start {
    line-height: 60px;
    margin-left: 10px;
  }
  .header-end {
    margin-right: 30px;
    line-height: 59px;
    cursor: pointer;

    .el-dropdown {
      color: white;
    }
  }
}
.el-popper[x-placement^="bottom"] {
  margin-top: 0;
}
.el-menu-item:hover {
  background-color: rgb(182, 193, 207) !important;
}
.el-menu-item.is-active {
  background-color: rgb(182, 193, 207) !important;
}
a{text-decoration:none;}
</style>
