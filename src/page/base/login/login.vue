<template>
  <div class="wrap" id="app2">
    <div class="loginBox">
      <h3>Welcome make-up exam system </h3>
      <el-form ref="loginForm" :model="loginForm" class="login-form" :rules="rules" label-width="80px"
               label-position="left">
        <el-form-item label="用户名" prop="name">
          <el-input v-model="loginForm.name"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="loginForm.password" type="password"></el-input>
        </el-form-item>
        <div style="display: table;">
          <el-form-item style="display:table-cell;" prop="type">
            <el-select v-model="loginForm.type" placeholder="用户类型">
              <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  :disabled="item.disabled">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item style="display:table-cell;">
            <el-button type="primary" plain @click="handleLogin">登录</el-button>
          </el-form-item>

        </div>

      </el-form>
    </div>

  </div>

</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      options: [{
        value: 'student',
        label: '学生',

      }, {
        value: 'jw',
        label: '教务',

      }, {
        value: 'teacher',
        label: '老师',
      }],
      loginForm: {},
      rules: {
        name: [
          {required: true, message: '请输入用户名', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'}
        ],
        type: [
          {required: true, message: '请输入用户类型', trigger: 'blur'}
        ]
      }
    };
  },
  created() {
    this.openTip();
  },
  methods: {
    handleLogin() {
      let url = 'http://localhost:8080/user/login?username=' + this.loginForm.name + '&password=' + this.loginForm.password + "&type=" + this.loginForm.type;
      this.$refs['loginForm'].validate((valid) => {
        if (valid) {
          this.$http.get(url, {}).then(({body}) => {
            if (body.success === true) {
              localStorage.username =this.loginForm.name;
              localStorage.type = this.loginForm.type;
              localStorage.id = body.data.id;
              window.location.href = "/make_up";
            } else {
              this.$message.error(body.message);
            }
          }).catch((err) => {
            this.$message.error('登陆失败')
          })
        }
      })
    },
    openTip() {
      this.$notify({
        title: '提示',
        message: '不断尝试你就会登录成功！'
      });
    },

  }
}
</script>
<style src="../../../style/common.scss">

</style>
<style scoped lang="scss">

.wrap {
  width: 100%;
  height: 100%;
  background: url("../../../assets/img/bg2.jpeg") no-repeat;
  background-size: 100% 100%;

  .loginBox {
    width: 355px;
    height: 232px;
    padding: 40px;
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    background: white;
    text-align: center;
    box-shadow: 1px 2px 1px rgba(0, 0, 0, .15);
    padding-top: 31px;

    .el-form {
      margin-top: 30px;

      .el-button {
        width: 100%;
      }
    }
  }
}
</style>
