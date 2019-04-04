<template>
  <div class="container">
    <el-form autoComplete="on"
            :model="modifyPwdForm"
            :rules="pwdRules"
            ref="modifyPwdForm"
            label-position="right"
            label-width="100px">
      <el-form-item prop="account" label="用户名">
        <el-input name="account"
                  type="text"
                  v-model="modifyPwdForm.account"
                  autoComplete="on"
                  placeholder="请输入用户名(必填)">
        </el-input>
      </el-form-item>
      <el-form-item prop="oldpwd" label="原密码" class="pwd-item old-pwd">
        <el-input name="password"
                  :type="pwdType"
                  v-model="modifyPwdForm.oldpwd"
                  autoComplete="on"
                  placeholder="请输入密码(必填)">
          <span slot="suffix" @click="showPwd">
            <svg-icon icon-class="eye" class="color-main"></svg-icon>
          </span>
        </el-input>
      </el-form-item>
      <el-form-item prop="newpwd" label="新密码" class="pwd-item new-pwd">
        <el-input name="password"
                  :type="pwdType"
                  v-model="modifyPwdForm.newpwd"
                  autoComplete="on"
                  placeholder="请输入密码(必填)">
          <span slot="suffix" @click="showPwd">
            <svg-icon icon-class="eye" class="color-main"></svg-icon>
          </span>
        </el-input>
      </el-form-item>
      <el-form-item prop="newpassword1" label="确认新密码" class="pwd-item new-pwd new-pwd-copy">
        <el-input name="newpassword1"
                  :type="pwdType"
                  v-model="modifyPwdForm.newpassword1"
                  autoComplete="on"
                  placeholder="请再次输入新密码(必填)">
          <span slot="suffix" @click="showPwd">
            <svg-icon icon-class="eye" class="color-main"></svg-icon>
          </span>
        </el-input>
      </el-form-item>
      <el-form-item style="margin-bottom: 60px">
        <el-button style="width: 100px;" type="primary" @click.native.prevent="handleSave" size="medium">
          保存
        </el-button>
        <el-button style="width: 100px;" type="primary" @click.native.prevent="handleCancle" size="medium">
          关闭
        </el-button>
      </el-form-item>
    </el-form>
    <div class="notes">
      <ul>
        <li><span class="red">*</span>建议密码长度至少8位字符</li>
        <li><span class="red">*</span>应避免设置与其他业务相同的密码</li>
        <li><span class="red">*</span>必须包含特殊字符（~!@#$%^&*_）</li>
      </ul>
    </div>
  </div>
</template>
<script>
import { updSysUserPwd } from '@/api/login'
export default {
  name: 'modifyPwd',
  data () {
    const validateUsername = (rule, value, callback) => {
      if (!(value)) {
        callback(new Error('请输入正确的用户名'))
      } else {
        callback()
      }
    }
    const validatePass = (rule, value, callback) => {
      if (value.length < 8) {
        callback(new Error('密码不能小于8位'))
      } else {
        callback()
      }
    }
    // const validatorQ = (rule, value, callback) => {
    //   console.log(value)
    //   console.log(this.modifyPwdForm.newpwd)
    //   if (value === '') {
    //     callback(new Error('请再次输入密码'))
    //   } else if (value !== this.modifyPwdForm.newpwd) {
    //     callback(new Error('两次输入密码不一致'))
    //   } else {
    //     callback()
    //   }
    // }
    return {
      modifyPwdForm: {
        account: '',
        oldpwd: '',
        newpwd: '',
        newpassword1: ''
      },
      pwdType: 'password',
      pwdRules: {
        account: [{required: true, trigger: 'blur', validator: validateUsername}],
        oldpwd: [{required: true, trigger: 'blur', validator: validatePass}],
        newpwd: [{required: true, trigger: 'blur', validator: validatePass}],
        newpassword1: [{required: true,
          trigger: 'blur',
          validator: (rule, value, callback) => {
            if (value === '') {
              callback(new Error('请再次输入密码'))
            } else if (value !== this.modifyPwdForm.newpwd) {
              callback(new Error('两次输入密码不一致'))
            } else {
              callback()
            }
          } }]
      }
    }
  },
  methods: {
    showPwd () {
      if (this.pwdType === 'password') {
        this.pwdType = ''
      } else {
        this.pwdType = 'password'
      }
    },
    handleSave () {
      this.$refs.modifyPwdForm.validate(valid => {
        if (valid) {
          console.log('保存')
          updSysUserPwd({account: this.modifyPwdForm.account, oldpwd: this.modifyPwdForm.oldpwd, newpwd: this.modifyPwdForm.newpwd}).then((res) => {
            if (res.code === 1) {
              if (res.data.result === 'ok') {
                this.$message({
                  message: '保存成功',
                  type: 'success'
                })
              } else if (res.data.result === 'no') {
                this.$message({
                  message: '修改失败',
                  type: 'error'
                })
              } else if (res.data.result === 'exist') {
                this.$message({
                  message: '密码曾经使用过',
                  type: 'error'
                })
              } else if (res.data.result === 'weak') {
                this.$message({
                  message: '密码太弱',
                  type: 'error'
                })
              }
            }
          })
          // this.$router.push({
          //   path: '/login'
          // })
        }
      })
    },
    handleCancle () {
      console.log('关闭')
      this.$router.push({
        path: '/login'
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .container{
    padding: 30px;
    .notes{
      ul li{
        list-style: none;
        font-size: 14px;
        .red{
          color: red;
          padding-right: 5px;
        }
      }
    }
  }
</style>
