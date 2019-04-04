<template>
  <!-- 区域审核 -->
  <div class="regional-container">
    <el-card class="box-card">
      <div class="box-title" slot="header" style="width: 100%;">
        <el-row class="search-form">
          <el-col :span="24">
            <el-form>
              <div class="search-item">
                <el-form-item label="项目名称" label-width="100px">
                  <el-input
                    placeholder="输入项目名称"
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
                @click="search">查询</el-button>
            </el-form>
          </el-col>
        </el-row>
      </div>
      <div class="tabel">
        <el-table
          :data="tableData.rows"
          border
          style="width: 100%"
          v-loading="listLoading"
          highlight-current-row>
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
            width="200">
          </el-table-column>
          <el-table-column
            width="120"
            prop="status"
            :formatter="formatterColumn"
            label="状态">
          </el-table-column>
          <el-table-column
            prop="phone"
            width="150"
            label="提交人">
          </el-table-column>
          <el-table-column
            prop="phone"
            width="150"
            label="审核人">
          </el-table-column>
          <el-table-column
            sortable
            width="200"
            prop="gmtCreate"
            label="提交时间">
            <template slot-scope="scope">{{ scope.row.gmtCreate | dateformat('YYYY-MM-DD HH:mm:ss') }}</template>
            <!-- <template slot-scope="scope">{{ scope.row.gmtCreate }}</template> -->
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                size="small"
                type="text"
                v-show="scope.row.status === '2'"
                @click="handleUpdate(scope.row)">审核
              </el-button>
              <el-button
                size="small"
                type="text"
                @click="handleConfig(scope.$index, scope.row)">详情
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
    <el-dialog class="edit-proj-dialog" :title="formType" :visible.sync="dialogProjFormVisible" :close-on-click-modal=false width="60%" center>
      <div class="edit-container">
        <div class="proj-name">
          <span class="text">项目名称：</span>XXXXXXXX
        </div>
        <div class="proj-introduce">
          <span class="text">项目简介</span>
          <p class="indent-text">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus sapien nunc eget.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Cum sociis natoque penatibus et magnis dis
          </p>
        </div>
        <div class="regional-resouse">
          <div class="text">区域范围：</div>
          <div class="indent-text">区域划分纬度: 地市</div>
          <div class="regional-map"></div>
        </div>
        <el-form class="edit-audit"
          :model="form"
          :rules="formRules"
          ref="dataForm"
          label-width="60px">
          <el-form-item label="审核" prop="userName">
            <el-select v-model="form.name" placeholder="请选择" :disabled="formType === '项目详情'">
              <el-option
                v-for="item in auditOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注">
            <el-input type="textarea" v-model="form.remarks" rows="3" :disabled="formType === '项目详情'"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogProjFormVisible = false" size="small" v-show="formType === '审核'">取 消</el-button>
        <el-button type="primary" @click="onEditSubmit()" size="small" v-show="formType === '审核'">确 认</el-button>
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
        label: '未通过'
      }, {
        value: '1',
        label: '审核通过'
      }, {
        value: '2',
        label: '待审核'
      }],
      auditOptions:[{
        value: '0',
        label: '不通过'
      }, {
        value: '1',
        label: '通过'
      }],
      listQuery: {
        userName: '',
        sysUserSecurityAccount: '',
        status: '',
        sdate:'',
        edate:''
      },

      dialogLoading: false,
      currentRow: {},
      listLoading: true,
      tableData: {
        pagination: {
          total: 0,
          pageNo: 1,
          pageSize: 10,
          parentId: 0
        },
        rows: []
      },
      formType: '审核',
      dialogProjFormVisible: false,
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
    formatterColumn(row, column) {
      switch(row.status){
          case '0':
            return '未通过';
            break;
          case '1':
            return '审核通过';
            break;
          case '2':
            return '待审核';
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
      this.dialogProjFormVisible = true
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
    handleUpdate (row) {
      this.formType = '审核'
      this.form = Object.assign({}, row) // copy objd
      this.dialogProjFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
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
            this.dialogProjFormVisible = false
            this.$notify({
              title: '成功',
              message: '保存成功',
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
  .regional-container {
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
  .el-pagination {
    float: right;
    margin-top: 15px;
  }
  
  .edit-proj-dialog{
    /deep/ .el-dialog__title {
      font-weight: 600;
    }
    .edit-container{
      .text{
        height: 30px;
        line-height: 30px;
        display: inline-block;
        font-size: 14px;
        font-weight: 700;
      }
      .indent-text{
        text-indent: 20px;
      }
      .proj-introduce{
        p{
          margin: 0;
          line-height: 25px;
        }
      }
      .regional-resouse{
        .regional-map{
          width: 80%;
          height: 300px;
        }
      }
    }
  }
</style>
