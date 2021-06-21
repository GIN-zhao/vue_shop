<template>
  <div class="login_container">
    <div class="loginbox">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="" />
      </div>
      <!-- 登录表单区域 -->
      <el-form
        ref="LoginFormRef"
        label-width="0px"
        :rules="loginFormRules"
        :model="loginForm"
        class="login_form"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            prefix-icon="iconfont icon-user"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <!-- <i class="bx bxl-tux"></i> -->
          <el-input
            v-model="loginForm.password"
            prefix-icon="iconfont icon-3702mima"
            type="password"
          ></el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="Login">Sign in</el-button>
          <el-button type="info" @click="resetLoginForm">reserve</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Login',
  data() {
    return {
      //这是登录表单数据表单绑定数据对象
      loginForm: {
        username: 'admin',
        password: '123456',
      },
      //这是表单的验证规则对象
      loginFormRules: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          {
            min: 3,
            max: 12,
            message: '长度在 6 到 12 个字符',
            trigger: 'blur',
          },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 8,
            message: '密码长度在 6 到 12 个字符',
            trigger: 'blur',
          },
        ],
      },
    }
  },
  methods: {
    //重置登录
    resetLoginForm() {
      this.$refs.LoginFormRef.resetFields()
      //   this.$refs.LoginFormRef.clearValidate()
    },
    //登录校验
    Login() {
      this.$refs.LoginFormRef.validate(async (valid) => {
        if (!valid) {
          console.log(valid)
        } else {
          const { data: res } = await this.$http.post('/login', this.loginForm)
          if (res.meta.status !== 200)
            return this.$message.error('Login is failure')
          else {
            // console.log(res)
            window.sessionStorage.setItem('token', res.data.token)
            this.$router.push('/home')
            return this.$message.success('Login is success')
          }
        }
      })
    },
  },
}
</script>
<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}
.loginbox {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  .avatar_box {
    height: 130px;
    width: 130px;
    box-shadow: 0 0 10px #ddd;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
    border: solid 1px #eee;
    border-radius: 50%;
    padding: 10px;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
  }
}
.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
.btns {
  display: flex;
  justify-content: flex-end;
}
</style>