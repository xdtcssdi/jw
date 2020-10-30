<!--
 * @Author: your name
 * @Date: 2020-10-23 20:51:42
 * @LastEditTime: 2020-10-30 22:48:44
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /jw/src/components/lyzHeader.vue
-->
<template>
  <div class="maindiv">
    <div class="header-main">
      <div class="header-start" @click="modifyCollapse">
        <img src="../assets/img/navCloseIcon.png" />
      </div>
      <div class="header-end">
        <el-dropdown trigger="click" @command="handleCommand">
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
  },
  computed: mapState(["collapse"]),
  methods: {
    updateuserinfo() {
      // let form = new FormData();
      // form.append("username", this.username);
      // from.append("password", this.password);
      // from.append("type", this.type);
      // let config = {
      //   headers: {
      //     "Content-Type": "multipart/form-data",
      //   },
      // };
      // this.update("/user/", form, config, "userinfoVisible");
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
            console.log("aaaaaa");
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

      // this.$http.get('/user/current-user',{}).then(({body}) => {
      //   console.log(body);
      //   if (body.success === true) {
      //     var unReadSize = body.data.unReadSize;
      //     if(unReadSize > 0) {
      //       this.$message.warning("有未读消息");
      //       this.loginUserName = body.data.userName +"<span style='color:red'>("+unReadSize+"条未读消息)</span>";
      //     } else {
      //       this.loginUserName = body.data.userName;
      //     }
      //   } else {
      //     window.location.href = '/login.html';
      //   }
      // });
    },
    modifyCollapse() {
      this.$store.commit("setCollapse", !this.collapse);
    },
    handleCommand(command) {
      if (command === "logout") {
        localStorage.removeItem("username");
        localStorage.removeItem("type");
        // localStorage.removeItem("id");
        if (!localStorage.username) window.location.href = "/login.html";
      } else if (command === "detailMessage") {
      }
    },
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
</style>
