<template>
  <div class="proj-container">
    <el-card class="box-card">
      <div class="box-title" slot="header" style="width: 100%;">
        <el-row style="width: 100%;">
          <el-col :span="12">
            <el-button type="primary" icon="el-icon-plus" size="medium" @click="handleCreate()">新增</el-button>
            <el-button type="danger" icon="el-icon-delete" size="medium" @click="handleMultiDelete()">删除</el-button>
          </el-col>
        </el-row>
        <el-row class="search-form">
          <el-col :span="24">
            <el-form>
              <div class="search-item">
                <el-form-item label="项目名称/ID" label-width="100px">
                  <el-input
                    placeholder="输入项目名称或ID"
                    style="width: 200px;"
                    size="medium"
                    v-model="listQuery.sysUserSecurityAccount">
                  </el-input>
                </el-form-item>
              </div>
              <div class="search-item">
                <el-form-item label="时间" label-width="70px">
                    <el-date-picker type="date" placeholder="选择日期" v-model="listQuery.sdate" style="width: 150px;"></el-date-picker> -
                    <el-date-picker type="date" placeholder="选择日期" v-model="listQuery.edate" style="width: 150px;"></el-date-picker>
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
            type="selection"
            width="35">
          </el-table-column>
          <el-table-column
            sortable
            type="index"
            width="80"
            label="序号">
          </el-table-column>
          <el-table-column
            prop="userName"
            label="项目名称"
            show-overflow-tooltip
            width="100">
          </el-table-column>
          <el-table-column
            width="100"
            prop="sysDepartmentDeptName"
            label="项目ID">
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
            width="150"
            label="操作人">
          </el-table-column>
          <el-table-column
            sortable
            width="200"
            prop="gmtCreate"
            label="创建时间">
            <template slot-scope="scope">{{ scope.row.gmtCreate | dateformat('YYYY-MM-DD HH:mm:ss') }}</template>
            <!-- <template slot-scope="scope">{{ scope.row.gmtCreate }}</template> -->
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                size="small"
                type="text"
                @click="handleUpdate(scope.$index, scope.row)">编辑
              </el-button>
              <el-button
                size="small"
                type="text"
                @click="handleConfig(scope.$index, scope.row)">详情
              </el-button>
              <el-button
                size="small"
                type="text"
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
      </div>
    </el-card>

    <!-- 编辑 -->
    <el-dialog class="edit-user-dialog" :title="formType" :visible.sync="dialogFormVisible" :close-on-click-modal=false top="5vh" width="60%" center>
      <el-form class="edit-user"
        :model="form"
        :rules="formRules"
        ref="dataForm"
        label-width="80px">
        <el-form-item label="项目名称" prop="name">
          <el-input v-model="form.name" placeholder="必填" required></el-input>
        </el-form-item>
        <el-form-item label="项目简介">
          <el-input type="textarea" v-model="form.introduce" rows="3"></el-input>
        </el-form-item>
      </el-form>
      <div class="base-wrapper">
        <div class="text">数据权限</div>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="区域范围" name="area">区域范围</el-tab-pane>
          <el-tab-pane label="模型参数" name="model">
            <div class="model-container">
              <div class="od-body">
                <div>出行模型 &nbsp;&nbsp;
                  <el-radio v-model="form.odmodel" label="1">启用</el-radio>
                  <el-radio v-model="form.odmodel" label="0">禁用</el-radio></div>
              </div>
              <div class="tripod-body">
                <ol>
                  <li>驻点停留时间：当用户位置数据发生更新时，前后两次数据距离满足的情况下，时间间隔大于<el-input class="input-opt" style="width:60px;height:30px;" v-model="form.aa" placeholder="必填" required></el-input>分钟时，判断之前为用户停留点</li>
                  <li>停留半径：系统判定当用户前后两次位置数据间距小于<el-input class="input-opt" style="width:60px;height:30px;" v-model="form.aa" placeholder="必填" required></el-input>km时，判断为用户仍在原地活动。</li>
                  <li>OD最短距离 ：在判断出行OD后，提高数据可靠性，OD距离大于<el-input class="input-opt" style="width:60px;height:30px;" v-model="form.aa" placeholder="必填" required></el-input>km时，判定为用户出行OD。</li>
                  <li>超时时长：用户前后两次位置数据更新时间间隔超过<el-input class="input-opt" style="width:60px;height:30px;" v-model="form.aa" placeholder="必填" required></el-input>分钟时，将后一次位置数据作为新的出行链重新计算。</li>
                </ol>
              </div>
              <div class="od-body  live-job-body">
                <div>职住分析模型 &nbsp;&nbsp;
                  <el-radio v-model="form.livejobmodel" label="1">启用</el-radio>
                  <el-radio v-model="form.livejobmodel" label="0">禁用</el-radio></div>
              </div>
              <div class="tripod-body">
                <ol>
                  <li>
                    <dl>
                      <dt>职住时段设定：</dt>
                      <dd>工作时段为：
                        <el-date-picker
                          class="input-op"
                          v-model="form.aa"
                          type="datetimerange"
                          range-separator="至"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期">
                        </el-date-picker>&amp;<el-date-picker
                          class="input-op"
                          v-model="form.aa"
                          type="datetimerange"
                          range-separator="至"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期">
                        </el-date-picker>
                      </dd>
                      <dd>生活时段为：
                        <el-date-picker
                          class="input-op"
                          v-model="form.aa"
                          type="datetimerange"
                          range-separator="至"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期">
                        </el-date-picker>&amp;<el-date-picker
                          class="input-op"
                          v-model="form.aa"
                          type="datetimerange"
                          range-separator="至"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期">
                        </el-date-picker>
                      </dd>
                    </dl>
                  </li>
                  <li>常驻人口时间判断：在某一地点的持续时间超过<el-input class="input-opt" style="width:60px;height:30px;" v-model="form.aa" placeholder="必填" required></el-input>小时，且一个月中在该点满足持续时间要求的天数所占比例大于<el-input class="input-opt" style="width:60px;height:30px;" v-model="form.aa" placeholder="必填" required></el-input>
                    <div>是否计算流动人口：  &nbsp;&nbsp;
                      <el-radio v-model="form.radio" label="1">是</el-radio>
                      <el-radio v-model="form.radio" label="0">否</el-radio>
                    </div>
                    <div>是否计算过境人口：  &nbsp;&nbsp;
                      <el-radio v-model="form.radio" label="1">是</el-radio>
                      <el-radio v-model="form.radio" label="0">否</el-radio>
                    </div>
                    <div>是否计算本区居住/工作人口外区的工作/居住分布： &nbsp;&nbsp;
                      <el-radio v-model="form.radio" label="1">是</el-radio>
                      <el-radio v-model="form.radio" label="0">否</el-radio>
                    </div>
                  </li>
                </ol>
              </div>
            </div>

          </el-tab-pane>
          <el-tab-pane label="标签权限" name="label">
            <div class="label-container">
              <div>
                <span class="text">时间范围：</span>
                <el-date-picker
                  v-model="form.aa"
                  type="daterange"
                  unlink-panels
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
                </el-date-picker>
              </div>
              <div>
                <span class="text">用户标签：</span>
                <div class="labels">
                  <el-checkbox :indeterminate="isIndeterminate" v-model="form.checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                  <div style="margin: 10px 0;"></div>
                  <el-checkbox-group v-model="form.checkedLabels" @change="handleCheckedLabelsChange">
                    <el-checkbox v-for="city in labels" :label="city" :key="city">{{city}}</el-checkbox>
                  </el-checkbox-group>
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="form.id ? onEditSubmit() : onSubmit()" size="small">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { userList, delSysUser, updSysUser, addSysUser, getSysUserRole, addSysUserRole } from '@/api/system'
const labelOptions = ['性别', '年龄', '消费水平', '是否有车', '教育水平'];
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
    return {
      options: [{
        value: '0',
        label: '未通过'
      }, {
        value: '1',
        label: '通过'
      }, {
        value: '2',
        label: '待审核'
      }],
      listQuery: {
        userName: '',
        sysUserSecurityAccount: '',
        status: '',
        sdate:'',
        edate:''
      },

      currentRow: {},
      dialogVisible: false,

      dialogLoading: false,
      roledata: [],
      selectedRoles: [],
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
      formType: '新建项目',
      multipleSelection: [],
      dialogFormVisible: false,
      formLabelWidth: '180px',
      form: {
        id: null,
        name: '',
        introduce: '',
        odmodel: '0',
        livejobmodel:'0',
        radio:'0',
        checkAll: false,
        checkedLabels: [],
      },
      formRules: {
        name: [{required: true, trigger: 'blur', validator: validateUsername}],
        sysUserSecurityAccount: [{required: true, trigger: 'blur', validator: validateUsername}]
      },
      activeName: 'model',
      labels: labelOptions,
      isIndeterminate: false
    }
  },
  created () {
    this.loadData()
  },
  methods: {
    search (target) {
      this.loadData()
    },
    handleConfig (index, row) {
      this.formType = '项目详情'
      this.currentRow = row
      this.dialogFormVisible = true
      this.activeName = 'model'
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
      this.activeName = 'model'
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdate (index, row) {
      this.formType = '编辑项目'
      this.form = Object.assign({}, row) // copy objd
      this.dialogFormVisible = true
      this.activeName = 'model'
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })

      // 通过接口获取用户信息
      // getSysUserInfo(row.id).then((res) => {
      //   console.log('获取用户信息:' + res)
      //   this.form = Object.assign({}, res.data) // copy obj
      //   this.dialogFormVisible = true
      //   this.activeName = 'model'
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
    handleMultiDelete(){
      console.log('delete.....');
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
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
    handleCheckAllChange(val) {
      this.checkedLabels = val ? labelOptions : [];
      this.isIndeterminate = false;
    },
    handleCheckedLabelsChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.labels.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.labels.length;
    }
  }
}
</script>
<style lang="scss" scoped>
  .proj-container {
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
  .base-wrapper{
    padding: 0 15px;
    .text{
      display: inline-block;
      height: 30px;
      line-height: 30px;
      font-size: 14px;
      font-weight: 700
    }
    /deep/ .el-input__inner{
      height: 30px;
      line-height: 30px;
      border-radius: 0px;
    }
    /deep/ .el-date-editor .el-range__icon, /deep/ .el-date-editor .el-range-separator{
      margin-top: -9px;

    }
    .model-container{
      .tripod-body{
        ol li{
          line-height: 30px;
          list-style: decimal;
            dl dd{
              line-height: 32px;
            }
            
        }
      }
    }
    .label-container{
      /deep/ .el-range-separator{
        width: 10%;
      }
      .labels{
        padding-left: 30px;
      }
    }
  }
</style>
