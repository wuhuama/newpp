<template>
  <div class="role-container">
    <el-card class="box-card">
      <div class="box-title" slot="header" style="width: 100%;">
        <el-row style="width: 100%;">
          <el-col :span="12">
              <el-button type="primary" icon="el-icon-plus" size="medium" @click="addRole">新增</el-button>
          </el-col>
        </el-row>
        <el-row class="search-form">
          <el-col :span="24">
            <div class="search-item">
                <el-input
                  placeholder="输入角色名称"
                  style="width: 200px;"
                  size="medium"
                  v-model="listQuery.roleName">
                  <!-- @keyup.enter="search($event)"> -->
                  <!-- <i slot="suffix" class="el-input__icon el-icon-search"></i> -->
                </el-input>
            </div>
            <div class="search-item">
              <el-select
                v-model="listQuery.status"
                clearable
                placeholder="状态"
                size="medium"
                style="width:100px;">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
            <el-button
              type="primary"
              icon="el-icon-search"
              size="medium"
              @click="search">搜索</el-button>
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
            prop="roleName"
            label="角色名称"
            show-overflow-tooltip
            width="120">
          </el-table-column>
          <el-table-column
            prop="description"
            width="200"
            label="角色描述">
          </el-table-column>
          <el-table-column
            width="80"
            label="状态">
            <template slot-scope="scope">
              {{ scope.row.status==='1' ? '正常' : '禁用' }}
            </template>
          </el-table-column>
          <el-table-column
            prop="creator"
            width="120"
            label="创建者">
          </el-table-column>
          <el-table-column
            sortable
            width="200"
            label="创建时间">
            <template slot-scope="scope">{{ scope.row.gmtCreate | dateformat('YYYY-MM-DD HH:mm:ss') }}</template>
          </el-table-column>
          <el-table-column label="操作" header-align="center" align="center">
            <template slot-scope="scope">
              <el-button
                size="small"
                type="default"
                icon="el-icon-edit"
                @click="handleEdit(scope.$index, scope.row)">编辑
              </el-button>
              <el-button
                size="small"
                type="info"
                icon="el-icon-setting"
                @click="handleMenuConfig(scope.$index, scope.row)">菜单权限
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

        <!-- 新建/修改角色 -->
        <el-dialog :title="editype" :visible.sync="editDiaVisible" width="500px" :close-on-click-modal=false :close-on-press-escape=false>
          <el-form :model="roleform" label-width="80px" :rules="rolerules" ref="roleForm">
            <el-form-item label="名称" prop="roleName">
              <el-input v-model="roleform.roleName" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="描述">
              <el-input v-model="roleform.description" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="状态">
              <el-radio-group v-model="roleform.status">
                <el-radio label="1">正常</el-radio>
                <el-radio label="0">禁用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="editDiaVisible = false" size="medium">取 消</el-button>
            <el-button type="primary" @click=" editype === '新建'? addRoleInfo() : upRoleInfo()" size="medium">确 定</el-button>
          </div>
        </el-dialog>

        <el-dialog :title='permission_title' :visible.sync="dialogVisible" :close-on-click-modal=false :close-on-press-escape=false>
          <div class="select-tree">
            <el-scrollbar
              tag="div"
              class='is-empty'
              wrap-class="el-select-dropdown__wrap"
              view-class="el-select-dropdown__list">
              <el-tree
                ref="refmenuTree"
                :data="menuTree"
                show-checkbox
                highlight-current
                node-key="id" v-loading="dialogLoading"
                :props="defaultProps">
              </el-tree>
            </el-scrollbar>
          </div>
          <span slot="footer" class="dialog-footer" center>
            <el-button @click="dialogVisible = false" size="medium">取 消</el-button>
            <el-button type="primary" @click="configUserRoles" size="medium">确 定</el-button>
          </span>
          <!-- <el-tree
            :data="data2"
            show-checkbox
            default-expand-all
            node-key="id"
            ref="tree"
            highlight-current
            :props="defaultProps">
          </el-tree>

          <div class="buttons">
            <el-button @click="getCheckedNodes">通过 node 获取</el-button>
            <el-button @click="getCheckedKeys">通过 key 获取</el-button>
            <el-button @click="setCheckedNodes">通过 node 设置</el-button>
            <el-button @click="setCheckedKeys">通过 key 设置</el-button>
            <el-button @click="resetChecked">清空</el-button>
          </div> -->
        </el-dialog>
      </div>
    </el-card>

  </div>
</template>

<script>
import { roleList, delRole, updSysRole, addSysRole, getSysRoleMenu, addSysRoleMenu, getSysMenu } from '@/api/system'

export default {
  components: {
    // 'imp-panel': panel
  },
  data () {
    return {
      // data2: [{
      //   id: 1,
      //   title: '一级 1',
      //   children: [{
      //     id: 4,
      //     title: '二级 1-1',
      //     children: [{
      //       id: 9,
      //       title: '三级 1-1-1'
      //     }, {
      //       id: 10,
      //       title: '三级 1-1-2'
      //     }]
      //   }]
      // }, {
      //   id: 2,
      //   title: '一级 2',
      //   children: [{
      //     id: 5,
      //     title: '二级 2-1'
      //   }, {
      //     id: 6,
      //     title: '二级 2-2'
      //   }]
      // }, {
      //   id: 3,
      //   title: '一级 3',
      //   children: [{
      //     id: 7,
      //     title: '二级 3-1'
      //   }, {
      //     id: 8,
      //     title: '二级 3-2'
      //   }]
      // }],
      // defaultProps: {
      //   children: 'children',
      //   label: 'label'
      // },
      options: [{
        value: '0',
        label: '禁用'
      }, {
        value: '1',
        label: '正常'
      }],
      listQuery: {
        roleName: '',
        status: ''
      },
      roleform: {
        id: null,
        roleName: '',
        description: '',
        status: '1'
      },
      rolerules: {
        roleName: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }]
      },
      currentRow: {},
      editype: '新建',
      editDiaVisible: false,
      dialogVisible: false,
      dialogLoading: false,
      listLoading: false,
      tableData: {
        pagination: {
          total: 3,
          pageNo: 1,
          pageSize: 10,
          parentId: 0
        },
        rows: []
      },
      permission_title: '配置菜单权限',
      menuTree: [], // 菜单权限
      defaultProps: {
        children: 'children',
        label: 'title',
        id: 'id'
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
    handleMenuConfig (index, row) {
      this.permission_title = '配置菜单权限'
      this.currentRow = row
      // this.dialogVisible = true
      this.menuTree = []
      if (this.menuTree.length <= 0) {
        getSysMenu()
          .then(res => {
            this.menuTree = res.data
            this.dialogVisible = true
          })
      }
      getSysRoleMenu(row.id).then((res) => {
        if (res.code === 1) {
          this.$refs.refmenuTree.setCheckedKeys(res.data)
        }
      })
    },
    configUserRoles () {
      let checkedKeys = this.$refs.refmenuTree.getCheckedKeys()
      addSysRoleMenu({menuIds: checkedKeys.join(), roleId: this.currentRow.id}).then((res) => {
        if (res.code === 1) {
          this.$message({
            message: '保存成功',
            type: 'success'
          })
          this.dialogVisible = false
        }
      })
    },
    // pageSize 每页条数改变时会触发
    handleSizeChange (val) {
      this.tableData.pagination.pageSize = val
      this.loadData()
    },
    // currentPage 当前页改变时会触发
    handleCurrentChange (val) {
      this.tableData.pagination.pageNo = val
      this.loadData()
    },
    // 重置角色表单数据
    resetTemp () {
      this.roleform = {
        id: null,
        roleName: '',
        description: '',
        status: '1'
      }
    },
    // 新建角色
    addRole () {
      this.resetTemp()
      this.editype = '新建'
      this.editDiaVisible = true
      this.$nextTick(() => {
        this.$refs.roleForm.clearValidate()
      })
    },
    // 修改角色
    handleEdit (index, row) {
      this.roleform = Object.assign({}, row) // copy objd
      this.editype = '编辑'
      this.editDiaVisible = true
      this.$nextTick(() => {
        this.$refs.roleForm.clearValidate()
      })
    },
    // 删除角色
    handleDelete (index, row) {
      delRole(row.id).then((res) => {
        if (res.code === 1) {
          for (const v of this.tableData.rows) {
            if (v.id === row.id) {
              const index = this.tableData.rows.indexOf(v)
              this.tableData.rows.splice(index, 1)
              this.$message({
                message: '删除成功',
                type: 'success'
              })
              break
            }
          }
        }
      })
    },
    // 新增保存角色信息
    addRoleInfo () {
      this.$refs.roleForm.validate((valid) => {
        if (valid) {
          addSysRole(this.roleform).then((res) => {
            if (res.code === 1) {
              // this.tableData.rows.unshift(this.roleform)
              this.loadData()
              this.editDiaVisible = false
              this.$message({
                message: '新建成功',
                type: 'success'
              })
            }
          })
        }
      })
    },
    // 修改保存角色信息
    upRoleInfo () {
      this.$refs.roleForm.validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.roleform)
          updSysRole(tempData).then((res) => {
            if (res.code === 1) {
              for (const v of this.tableData.rows) {
                if (v.id === tempData.id) {
                  const index = this.tableData.rows.indexOf(v)
                  this.tableData.rows.splice(index, 1, tempData)
                  break
                }
              }
              this.editDiaVisible = false
              this.$message({
                message: '更新成功',
                type: 'success'
              })
            }
          })
        }
      })
    },
    loadData () {
      this.listLoading = false
      this.listQuery.currentPage = this.tableData.pagination.pageNo
      this.listQuery.showCount = this.tableData.pagination.pageSize
      roleList(this.listQuery).then((res) => {
        this.listLoading = false
        if (res.code === 1) {
          this.tableData.rows = res.data.result
          this.tableData.pagination.total = res.data.totalResult
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .role-container {
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
    }
  }
  .dialog-footer {
    text-align: center;
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
</style>
