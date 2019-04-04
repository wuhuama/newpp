<template>
  <div class="user-container">
    <el-card class="box-card">
      <div class="box-title" slot="header" style="width: 100%;">
        <el-row style="width: 100%;">
          <el-col :span="12">
            <!-- <router-link :to="{ path: 'userAdd'}"> -->
              <el-button type="primary" icon="el-icon-plus" size="medium" @click="handleCreate()">新增</el-button>
            <!-- </router-link> -->
          </el-col>
        </el-row>
        <el-row class="search-form">
          <el-col :span="24">
            <el-form>
              <div class="search-item">
                <el-form-item label="账号" label-width="50px">
                  <el-input
                    placeholder="输入账号"
                    style="width: 200px;"
                    size="medium"
                    v-model="listQuery.sysUserSecurityAccount">
                  </el-input>
                </el-form-item>
              </div>
              <div class="search-item">
                <el-form-item label="用户名" label-width="70px">
                  <el-input
                    placeholder="输入用户名"
                    style="width: 200px;"
                    size="medium"
                    v-model="listQuery.userName">
                    <!-- @keyup.enter="search($event)"> -->
                    <!-- <i slot="suffix" class="el-input__icon el-icon-search"></i> -->
                  </el-input>
                </el-form-item>
              </div>
              <div class="search-item">
                <el-form-item label="状态" label-width="50px">
                  <el-select
                    v-model="listQuery.status"
                    clearable
                    placeholder="请选择"
                    size="medium"
                    style="width:100px;">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
              <el-button
                type="primary"
                icon="el-icon-search"
                size="medium"
                @click="search">搜索</el-button>
            </el-form>
          </el-col>
        </el-row>
      </div>
      <div>
        <el-table
          :data="tableData.rows"
          border
          style="width: 100%"
          v-loading="listLoading"
          highlight-current-row>

          <el-table-column
            sortable
            prop="sysUserSecurityAccount"
            width="100"
            label="账号">
          </el-table-column>
          <el-table-column
            prop="userName"
            label="用户名"
            show-overflow-tooltip
            width="100">
          </el-table-column>
          <el-table-column
            prop="sysDepartmentDeptName"
            label="所在部门">
          </el-table-column>
          <el-table-column
            prop="post"
            label="职位">
          </el-table-column>
          <el-table-column
            prop="status"
            width="80"
            label="状态">
            <template slot-scope="scope">
              {{ scope.row.status==='1' ? '正常' : '锁定' }}
            </template>
          </el-table-column>
          <el-table-column
            prop="phone"
            width="120"
            label="电话号码">
          </el-table-column>
          <el-table-column
            prop="mobile"
            label="手机号码">
          </el-table-column>
          <el-table-column
            prop="email"
            label="邮箱">
          </el-table-column>
          <el-table-column
            sortable
            prop="gmtCreate"
            label="创建时间">
            <template slot-scope="scope">{{ scope.row.gmtCreate | dateformat('YYYY-MM-DD HH:mm:ss') }}</template>
            <!-- <template slot-scope="scope">{{ scope.row.gmtCreate }}</template> -->
          </el-table-column>
          <el-table-column label="操作" width="285">
            <template slot-scope="scope">
              <el-button
                size="small"
                type="default"
                icon="el-icon-edit"
                @click="handleUpdate(scope.$index, scope.row)">编辑
              </el-button>
              <el-button
                size="small"
                type="info"
                icon="el-icon-setting"
                @click="handleRoleConfig(scope.$index, scope.row)">配置角色
              </el-button>
              <el-button
                size="small"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <el-pagination
          v-show="tableData.pagination.total>0"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="tableData.pagination.pageNo"
          :page-sizes="[10, 20, 30]"
          :page-size="tableData.pagination.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="tableData.pagination.total">
        </el-pagination>
        <!-- <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" /> -->

        <el-dialog title="配置用户角色" :visible.sync="dialogVisible" :close-on-click-modal=false>
          <div class="select-tree">
            <!-- <el-scrollbar
              tag="div"
              class='is-empty'
              wrap-class="el-select-dropdown__wrap"
              view-class="el-select-dropdown__list"> -->
              <el-transfer
                ref="roleTranfer"
                :props="{
                  key: 'id',
                  label: 'name'
                }"
                v-model="selectedRoles"
                :titles="['未选择角色', '已选择角色']"
                :data="roledata"></el-transfer>
            <!-- </el-scrollbar> -->
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false" size="medium">取 消</el-button>
            <el-button type="primary" @click="configUserRoles" size="medium">确 定</el-button>
            </span>
        </el-dialog>
      </div>
    </el-card>

    <!-- 编辑 -->
    <el-dialog class="edit-user-dialog" :title="form.id ? '编辑':'新增用户'" :visible.sync="dialogFormVisible" :close-on-click-modal=false top="10vh" width="30%">
      <el-form class="edit-user"
        :model="form"
        :rules="formRules"
        ref="dataForm"
        label-width="90px">
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="form.userName" placeholder="必填" required></el-input>
        </el-form-item>
        <el-form-item label="登录账号" prop="sysUserSecurityAccount">
          <el-input v-model="form.sysUserSecurityAccount" placeholder="必填" required></el-input>
        </el-form-item>
        <!-- 所在部门 sysDepartmentDeptName -->
        <el-form-item label="所在部门">
          <el-input v-model="form.sysDepartmentDeptName"></el-input>
        </el-form-item>
        <el-form-item label="职位">
          <el-input v-model="form.post"></el-input>
        </el-form-item>
        <el-form-item label="固定电话">
          <el-input v-model="form.mobile"></el-input>
        </el-form-item>
        <el-form-item label="手机">
          <el-input v-model="form.phone"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="form.email"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio label="1">正常</el-radio>
            <el-radio label="0">锁定</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" v-model="form.remarks" rows="3"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="form.id ? onEditSubmit() : onSubmit()" size="small">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { userList, delSysUser, updSysUser, addSysUser, getSysUserRole, addSysUserRole } from '@/api/system'

export default {
  data () {
    const validateUsername = (rule, value, callback) => {
      // if (!isvalidUsername(value)) {
      if (!(value)) {
        callback(new Error('必填项不能为空'))
      } else {
        callback()
      }
    }
    // const generateData = _ => {
    //   const roledata = []
    //   for (let i = 1; i <= 15; i++) {
    //     roledata.push({
    //       key: i,
    //       label: `演示测试账号(美工用) ${i}`
    //       // disabled: i % 4 === 0
    //     })
    //   }
    //   return roledata
    // }
    return {
      options: [{
        value: '0',
        label: '锁定'
      }, {
        value: '1',
        label: '正常'
      }],
      listQuery: {
        userName: '',
        sysUserSecurityAccount: '',
        status: ''
      },

      currentRow: {},
      dialogVisible: false,

      dialogLoading: false,
      roledata: [],
      selectedRoles: [],
      currentUserId: null,
      listLoading: true,
      tableData: {
        pagination: {
          total: 3,
          pageNo: 1,
          pageSize: 10,
          parentId: 0
        },
        rows: []
      },
      dialogFormVisible: false,
      formLabelWidth: '180px',
      form: {
        id: null,
        userName: '',
        parentId: null,
        sysUserSecurityAccount: '',
        sysDepartmentDeptName: '',
        post: '',
        mobile: '',
        phone: '',
        email: '',
        status: '1',
        remarks: ''
      },
      formRules: {
        userName: [{required: true, trigger: 'blur', validator: validateUsername}],
        sysUserSecurityAccount: [{required: true, trigger: 'blur', validator: validateUsername}]
      }
    }
  },
  created () {
    this.loadData()
  },
  methods: {
    search (target) {
      this.loadData()
    },
    handleRoleConfig (index, row) {
      this.currentRow = row
      this.dialogVisible = true
      this.currentUserId = row.id
      this.roledata = []
      this.selectedRoles = []
      getSysUserRole(row.id).then((res) => {
        if (res.code === 1) {
          this.roledata = res.data[1] // 所有角色
          this.selectedRoles = res.data[0] // 用户拥有的角色
        }
      })
    },
    configUserRoles () {
      let checkedKeys = this.selectedRoles
      console.log(checkedKeys)
      const tempData = {userid: this.currentUserId, roleids: checkedKeys.join()}
      addSysUserRole(tempData).then((res) => {
        if (res.code === 1) {
          this.dialogVisible = false
          this.$message({
            message: '保存成功',
            type: 'success'
          })
        }
      })
    },
    handleSizeChange (val) {
      this.tableData.pagination.pageSize = val
      this.loadData()
    },
    handleCurrentChange (val) {
      this.tableData.pagination.pageNo = val
      this.loadData()
    },
    resetTemp () {
      this.form = {
        id: null,
        userName: '',
        parentId: null,
        sysUserSecurityAccount: '',
        sysDepartmentDeptName: '',
        post: '',
        mobile: '',
        phone: '',
        email: '',
        status: '1',
        remarks: ''
      }
    },
    handleCreate () {
      this.resetTemp()
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdate (index, row) {
      this.form = Object.assign({}, row) // copy objd
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })

      // 通过接口获取用户信息
      // getSysUserInfo(row.id).then((res) => {
      //   console.log('获取用户信息:' + res)
      //   this.form = Object.assign({}, res.data) // copy obj
      //   this.dialogFormVisible = true
      //   this.$nextTick(() => {
      //     this.$refs['dataForm'].clearValidate()
      //   })
      // })
    },
    handleDelete (index, row) {
      delSysUser(row.id).then((res) => {
        if (res.code === 1) {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
        }
      })
    },
    loadData () {
      this.listLoading = true
      this.listQuery.currentPage = this.tableData.pagination.pageNo
      this.listQuery.showCount = this.tableData.pagination.pageSize

      userList(this.listQuery).then((res) => {
        this.listLoading = false
        this.tableData.rows = res.data.result
        this.tableData.pagination.total = res.data.totalResult
      })
    },
    onSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          addSysUser(this.form).then(() => {
            this.tableData.rows.unshift(this.form)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    onEditSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.form)
          updSysUser(tempData).then(() => {
            for (const v of this.tableData.rows) {
              if (v.id === tempData.id) {
                const index = this.tableData.rows.indexOf(v)
                this.tableData.rows.splice(index, 1, tempData)
                break
              }
            }
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .user-container {
    padding: 1.25rem;
    padding-top: 0;
  }
  .el-card{
    padding-bottom: 20px;
  }
  .search-form {
    margin-top: 10px;
    .search-item {
      display: inline-block;
      .search-item-label {
        color: #ccc;
      }
      .el-form-item {
        margin-bottom: 0;
      }
    }
  }
  /deep/ .el-table th {
    white-space: nowrap;
    overflow: hidden;
    background-color: #f1f5fd;
    text-align: left;
    height: 40px;
    padding: 5px 0;
  }
  /deep/ .el-table td, .el-table th{
    height: 40px;
    padding: 5px 0;
  }
  /deep/ .el-transfer-panel{
    width: auto;
    min-width: 300px;
  }
  /deep/ .el-transfer-panel__list{
    padding-right: 6px;
  }
  .el-pagination {
    float: right;
    margin-top: 15px;
  }
  .edit-user-dialog{
    /deep/ .el-dialog__title {
      font-weight: 600;
    }
  }
  .edit-user .el-form-item{
    width: 90%;
    margin-bottom: 15px;
  }
</style>
