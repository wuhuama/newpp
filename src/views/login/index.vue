<template>
  <div class="container">
    <el-card class="login-form-layout">
        <el-form autoComplete="on"
               :model="loginForm"
               :rules="loginRules"
               ref="loginForm"
               label-position="left">
          <div style="text-align: center">
            <svg-icon icon-class="login-mall" style="width: 56px;height: 56px;color: #409EFF"></svg-icon>
          </div>
          <h2 class="login-title color-main">用户登录</h2>
          <el-form-item prop="username">
            <el-input name="username"
                      type="text"
                      v-model="loginForm.username"
                      autoComplete="on"
                      placeholder="请输入用户名">
            <span slot="prefix">
              <svg-icon icon-class="user" class="color-main"></svg-icon>
            </span>
            </el-input>
          </el-form-item>
          <el-form-item prop="password" class="pwd-item">
            <el-input name="password"
                      :type="pwdType"
                      @keyup.enter.native="handleLogin"
                      v-model="loginForm.password"
                      autoComplete="on"
                      placeholder="请输入密码">
            <span slot="prefix">
              <svg-icon icon-class="password" class="color-main"></svg-icon>
            </span>
            <span slot="suffix" class="show-pwd" @click="showPwd">
              <svg-icon :icon-class="pwdType === 'password' ? 'eye' : 'eye-open'" class="color-main"></svg-icon>
            </span>
            </el-input>
            <div class="modify-pwd"><span class="modi-pwd pointer" @click="changePwd">修改密码</span></div>
          </el-form-item>
          <el-form-item prop="authcode">
            <el-col :span="13">
              <el-input name="authcode"
                        type="text"
                        placeholder="请输入验证码"
                        ref="authcode"
                        v-model="loginForm.authcode" @keyup.native.enter="handleLogin">
              </el-input>
            </el-col>
            <el-col :span="8" :offset="1">
              <input type="button" class="refreshCode" v-model="freshCode" @click="refreshCode()"/>
            </el-col>
          </el-form-item>
          <el-form-item style="margin-bottom: 60px">
            <el-button style="width: 100%" type="primary" :loading="loading" @click.native.prevent="handleLogin">
              登录
            </el-button>
          </el-form-item>
        </el-form>
    </el-card>
    <!-- <img :src="login_center_bg" class="login-center-layout"> -->
    <img class="login-center-layout">
  </div>
</template>
<script>
// import {isvalidUsername} from '@/utils/validate'
// import qs from 'qs'
// import Cookies from 'js-cookie'

const validateUsername = (rule, value, callback) => {
  // if (!isvalidUsername(value)) {
  if (!(value)) {
    callback(new Error('请输入正确的用户名'))
  } else {
    callback()
  }
}
const validatePass = (rule, value, callback) => {
  if (value.length < 3) {
    callback(new Error('密码不能小于3位'))
  } else {
    callback()
  }
}
const validateCode = (rule, value, callback) => {
  if (value.length < 1) {
    callback(new Error('验证码不能为空'))
  } else {
    callback()
  }
}
export default {
  name: 'login',
  data () {
    return {
      loginForm: {
        username: 'admin',
        password: 'C3u68HBPsmsvAjNvTb3Low==',
        authcode: ''
      },
      freshCode: '',
      loginRules: {
        username: [{required: true, trigger: 'blur', validator: validateUsername}],
        password: [{required: true, trigger: 'blur', validator: validatePass}],
        authcode: [{required: true, validator: validateCode}]
      },
      loading: false,
      pwdType: 'password'
      // login_center_bg
    }
  },
  created () {
    this.refreshCode()
  },
  methods: {
    showPwd () {
      if (this.pwdType === 'password') {
        this.pwdType = ''
      } else {
        this.pwdType = 'password'
      }
    },
    // 刷新验证码
    refreshCode () {
      this.$http.get('/refreshCode').then(response => {
        this.freshCode = response.data.authcode
        this.loginForm.authcode = ''
      })
    },
    handleLogin () {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('LoginByUsername', this.loginForm).then((res) => {
            this.loading = false
            // console.log(res)
            this.$router.push({path: '/'}) // 登录成功之后重定向到首页
          }).catch(() => {
            this.loading = false
            this.refreshCode()
          })
        } else {
          console.log('参数验证不合法！')
          return false
        }
      })
    },
    changePwd () {
      this.$router.push({path: '/modifypwd'})
    }
  }
}
</script>
<style lang="scss" scoped>
  .container{
    width: 100%;
    height: 100%;
    background-color: #fff;
    .login-center-layout {
      background: #409EFF;
      width: auto;
      height: auto;
      max-width: 100%;
      max-height: 100%;
      margin-top: 200px;
    }
    .login-form-layout {
      width: 360px;
      background-color: #ffffff;
      position: absolute;
      top: 50%;
      right: 20%;
      transform: translateY(-50%);
      .login-title {
        text-align: center;
      }

      input.refreshCode {
          height: 40px;
          width: 100%;
          text-align: center;
          outline: none;
          border: 0;
          background: #bbb;
          color: rebeccapurple;
          font-size: 20px;
          font-style: italic;
          cursor: pointer;
          &:focus{
          outline: none
        }
      }
      .modify-pwd{
        text-align: right;
        margin-bottom: 3px;
        line-height: 22px;
      }
    }
  }
  /deep/ .pwd-item{
    margin-bottom: 2px;
  }
  .svg-icon {
    width: 1.2em;
    height: 1.2em;
    vertical-align: -0.18em;
    fill: currentColor;
    overflow: hidden;
  }
  .show-pwd {
    // position: absolute;
    // right: 10px;
    // top: 7px;
    // font-size: 16px;
    cursor: pointer;
    user-select: none;
  }
</style>
