<template>
  <div class="log-container">
    <el-card class="box-card">
      <div class="box-title" slot="header" style="width: 100%;">
        <!-- <el-row style="width: 100%;">
          <el-col :span="12">
              <el-button type="primary" icon="el-icon-plus" size="small" @click="addRole">新增</el-button>
          </el-col>
        </el-row> -->
        <el-row class="search-form">
          <el-col :span="24">
            <el-form :model="listQuery" ref="">
              <!-- <div class="search-item">
                <el-form-item label="账号" :label-width="formLabelWidth">
                  <el-input
                    placeholder="输入账号"
                    style="width: 150px;"
                    v-model="listQuery.sysUserSecurityAccount">
                  </el-input>
                </el-form-item>
              </div> -->
              <div class="search-item">
                <el-form-item label="操作IP" :label-width="formLabelWidth">
                  <el-input
                    placeholder="输入IP地址"
                    style="width: 150px;"
                    v-model="listQuery.ipadd">
                  </el-input>
                </el-form-item>
              </div>
              <div class="search-item">
                <el-form-item label="操作时间" :label-width="formLabelWidth">
                    <el-date-picker type="date" placeholder="开始日期" v-model="listQuery.startTime" style="width: 150px;"></el-date-picker>
                    <span>-</span>
                    <el-date-picker type="date" placeholder="结束时间" v-model="listQuery.endTime"   style="width: 150px;"></el-date-picker>
                </el-form-item>
              </div>
              <div class="search-item">
                <el-form-item>
                  <el-button
                    type="primary"
                    icon="el-icon-search"
                    @click="search">搜索</el-button>
                </el-form-item>
              </div>
            </el-form>
          </el-col>
        </el-row>
      </div>
      <div class="">
        <el-table
          :data="tableData.rows"
          border
          style="width: 100%"
          v-loading="listLoading"
          highlight-current-row>
          <el-table-column
            sortable
            prop="userid"
            label="用户名"
            width="120"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="operstatus"
            label="操作项">
          </el-table-column>
          <el-table-column
            prop="operserviceip"
            label="服务器IP">
          </el-table-column>
          <el-table-column
            prop="ipadd"
            label="IP地址">
          </el-table-column>
          <el-table-column
            prop="opermethod"
            width="100"
            label="操作方式">
            <!-- <template slot-scope="scope">
              {{ scope.row.status===1 ? '正常' : '锁定' }}
            </template> -->
          </el-table-column>
          <el-table-column
            prop="slogcomment"
            label="日志内容">
          </el-table-column>
          <el-table-column
            prop="slogcreatetime"
            sortable
            label="操作时间">
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
  </div>
</template>
<script>
import { getSysLog } from '@/api/system'
export default {
  name: 'log',
  data () {
    return {
      formLabelWidth: '80px',
      listQuery: {
        sysUserSecurityAccount: '',
        ipadd: '',
        startTime: '',
        endTime: ''
      },
      listLoading: true,
      tableData: {
        pagination: {
          total: 0,
          pageNo: 1,
          pageSize: 10,
          parentId: 0
        },
        rows: []
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
    loadData () {
      this.listQuery.currentPage = this.tableData.pagination.pageNo
      this.listQuery.showCount = this.tableData.pagination.pageSize

      getSysLog(this.listQuery).then((res) => {
        this.listLoading = false
        // console.log(res)
        this.tableData.rows = res.data.result
        this.tableData.pagination.total = res.data.totalResult
      }).catch(() => {

      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .log-container {
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
    }
  }
  .dialog-footer {
    text-align: center;
  }
  .el-form-item {
    margin-bottom: 0;
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
