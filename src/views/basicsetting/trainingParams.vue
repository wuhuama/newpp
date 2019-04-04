<template>
  <!-- 参数训练 -->
  <div class="params-train-container">
    <el-card class="box-card">
      <div class="box-title" slot="header" style="width: 100%;">
        <el-row style="width: 100%;">
          <el-col :span="12">
            <el-button type="primary" icon="el-icon-plus" size="medium" @click="handleCreate()">新增任务</el-button>
            <el-button type="danger" icon="el-icon-delete" size="medium" @click="handleMultiDelete()">删除任务</el-button>
          </el-col>
        </el-row>
        <el-row class="search-form">
          <el-col :span="22">
            <el-form>
              <div class="search-item">
                <el-form-item label="时间" label-width="50px">
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
              <div class="search-item">
                <el-form-item label="操作人" label-width="60px">
                  <el-input
                    style="width: 150px;"
                    v-model="listQuery.creator">
                  </el-input>
                </el-form-item>
              </div>
              <el-button type="primary" icon="el-icon-search" size="medium" @click="search">查询</el-button>
            </el-form>
          </el-col>
          <el-col :span="1">
            <el-button v-waves :loading="downloadLoading" class="filter-item" type="info" icon="el-icon-download" @click="handleDownload" size="medium">导出</el-button>
          </el-col>
        </el-row>
      </div>
      <div class="table">
        <div class="task-desc">
          <div>系统当前执行任务: <span class="text">{{BILI任务}}</span></div>
        </div>
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
            label="任务名称"
            show-overflow-tooltip
            width="100">
          </el-table-column>
          <el-table-column
            width="100"
            prop="sysDepartmentDeptName"
            label="任务ID">
          </el-table-column>
          <el-table-column
            prop="status"
            width="80"
            :formatter="formatterColumn"
            label="状态">
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
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                size="small"
                type="text"
                v-show="scope.row.status === '0'"
                @click="handleUpdate(scope.$index, scope.row)">编辑
              </el-button>
              <el-button
                size="small"
                type="text"
                v-show="scope.row.status === '0'"
                @click="handleCalc(scope.row)">计算
              </el-button>
              <el-button
                size="small"
                type="text"
                v-show="scope.row.status === '2'"
                @click="checkProgress(scope.row)">进度
              </el-button>
              <el-button
                size="small"
                type="text"
                v-show="scope.row.status === '1'"
                @click="handleAdopt(scope.row)">采用
              </el-button>
              <el-button
                size="small"
                type="text"
                v-show="scope.row.status === '2'"
                @click="handleConfig(scope.$index, scope.row)">详情
              </el-button>
              <el-button
                size="small"
                type="text"
                v-show="(scope.row.status === '2' || scope.row.status === '1')"
                @click="handleRepeal(scope.row)">撤销
              </el-button>
              <el-button
                size="small"
                type="text"
                v-show="(scope.row.status === '0' || scope.row.status === '1')"
                @click="handleDelete(scope.row)">删除
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
    <el-dialog class="edit-task-dialog" :title="formType" :visible.sync="dialogFormVisible" :close-on-click-modal=false width="60%" center>
      <el-form class="edit-task"
        :model="form"
        :rules="formRules"
        ref="dataForm"
        label-width="80px">
        <el-row style="width: 100%">
          <el-col :span="8">
            <el-form-item label="任务名称" prop="name">
              <el-input v-model="form.name" placeholder="必填" required></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-show="formType === '项目详情'">
            <el-form-item label="任务ID">
              <el-input v-model="form.name" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8"  v-show="formType === '项目详情'">
            <el-form-item label="区域ID">
              <el-input v-model="form.name" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="width: 100%" v-show="formType === '项目详情'">
          <el-col :span="8">
            <el-form-item label="计算用时">
              <el-input v-model="form.name" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="来源目录">
              <el-input v-model="form.name" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="输出目录">
              <el-input v-model="form.name" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="base-wrapper">
        <div class="header">
          <div class="text">参数训练</div>
          <div><el-button type="danger" size="mini">恢复默认</el-button></div>
        </div>
        <div class="model-container">
          <div class="tripod-body">
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
          <div class="live-job-body">
            <div>职住分析模型 &nbsp;&nbsp;
              <el-radio v-model="form.livejobmodel" label="1">启用</el-radio>
              <el-radio v-model="form.livejobmodel" label="0">禁用</el-radio></div>
          </div>
          <div class="live-job-body">
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
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="form.id ? onEditSubmit() : onSubmit()" size="small">提交</el-button>
      </div>
    </el-dialog>

    <!-- 进度 -->
    <el-dialog class="progress-dialog" title="当前计算进度" :visible.sync="dialogProgressVisible" :close-on-click-modal=false center>
      <div>
        <div class="text-20">累计计算时间: 3小时12分33秒</div>
        <el-steps :active="2">
          <el-step title="数据清洗" description=""></el-step>
          <el-step title="驻点提取" description=""></el-step>
          <el-step title="模型计算" description=""></el-step>
          <el-step title="数据入库" description=""></el-step>
          <el-step title="数据入库" description=""></el-step>
          <el-step title="完成" icon="el-icon-picture"></el-step>
        </el-steps>
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
    return {
      options: [{
        value: '0',
        label: '未计算'
      }, {
        value: '1',
        label: '完成'
      }, {
        value: '2',
        label: '计算中'
      }, {
        value: '3',
        label: '系统执行中'
      }],
      listQuery: {
        creator: '',
        status: '',
        sdate:'',
        edate:''
      },

      currentRow: {},
      dialogVisible: false,
      dialogProgressVisible: false,
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
      downloadLoading: false,
      formType: '新建任务',
      multipleSelection: [],
      dialogFormVisible: false,
      formLabelWidth: '180px',
      form: {
        id: null,
        name: '',
        introduce: '',
        odmodel: '0',
        livejobmodel: '0',
        radio: '0',
        checkAll: false,
        checkedLabels: [],
      },
      formRules: {
        name: [{required: true, trigger: 'blur', validator: validateUsername}],
        sysUserSecurityAccount: [{required: true, trigger: 'blur', validator: validateUsername}]
      }
    }
  },
  created () {
    this.loadData()
  },
  methods: {
    formatterColumn(row, column) {
      switch(row.status){
          case '0':
            return '未计算';
            break;
          case '1':
            return '完成';
            break;
          case '2':
            return '计算中';
            break;
          case '3':
            return '系统执行中';
            break;
          default:
            return '未知';
      }
    },
    search (target) {
      this.loadData()
    },
    handleConfig (index, row) {
      this.formType = '项目详情'
      this.currentRow = row
      this.dialogFormVisible = true
      this.activeName = 'model'
    },
    checkProgress(index, row){
      this.dialogProgressVisible = true
    },
    handleAdopt(row){
      this.$confirm('确认采用任务: '+ row.userName +' 吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '操作成功!'
        });
      })
    },
    handleRepeal(row){
      this.$confirm('确认撤销任务: '+ row.userName +' 吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '撤销成功!'
        });
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
      this.activeName = 'model'
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleCalc(row){
      this.$confirm('确认计算任务: '+ row.userName +' 吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // delSysUser(row.id).then((res) => {
        //   if (res.code === 1) {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
        //   }
        // })
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
    handleDelete (row) {
      this.$confirm('确认删除任务: '+ row.userName +' 吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // delSysUser(row.id).then((res) => {
        //   if (res.code === 1) {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
        //   }
        // })
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
  
  .edit-task-dialog{
    /deep/ .el-dialog__title {
      font-weight: 600;
    }
  }
  .edit-task .el-form-item{
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
    .header{
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    /deep/ .el-input__inner{
      height: 30px;
      line-height: 30px;
      border-radius: 0px;
    }
    /deep/ .el-date-editor .el-range__icon, /deep/ .el-date-editor .el-range-separator{
      margin-top: -9px;

    }
  }
  .progress-dialog{
    .text-20{
      font-size: 20px;
      font-weight: 700;
      color: red;
      margin-bottom: 20px;
    }
    /deep/ .el-dialog__title{
      font-size: 22px;
    }
    /deep/ .el-step__icon{
      width: 50px;
      height: 50px;
    }
    /deep/ .el-step.is-horizontal .el-step__line{
      top: 26px;
    }
  }
</style>
