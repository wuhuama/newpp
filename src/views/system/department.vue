<template>
  <div class="department-container">
    <!-- 部门管理 -->
    <el-card class="box-card">
      <div class="box-title" style="width: 100%;">
        <el-button type="primary" icon="plus" @click="newAdd">新增</el-button>
        <el-button type="danger" icon="delete" @click="batchDelete">删除</el-button>
      </div>
      <div class="box-body">
        <el-row slot="body" :gutter="24" style="margin-bottom: 20px;">
          <el-col :span="6" :xs="24" :sm="24" :md="6" :lg="6" style="margin-bottom: 20px;">

          </el-col>
          <el-col :span="18" :xs="24" :sm="24" :md="18" :lg="18">
            <el-card class="box-card">
              <div class="text item">
                <el-form :model="departform" ref="form">
                  <el-form-item label="部门名称" :label-width="formLabelWidth">
                    <el-input v-model="departform.name" auto-complete="off"></el-input>
                  </el-form-item>
                  <el-form-item label="机构代码" :label-width="formLabelWidth">
                    <el-input v-model="departform.href" auto-complete="off"></el-input>
                  </el-form-item>
                  <el-form-item label="部门电话" :label-width="formLabelWidth">
                    <el-input v-model="departform.mobile" auto-complete="off"></el-input>
                  </el-form-item>
                  <el-form-item label="传真" :label-width="formLabelWidth">
                    <el-input v-model="departform.fax" auto-complete="off"></el-input>
                  </el-form-item>
                  <el-form-item label="地址" :label-width="formLabelWidth">
                    <el-input v-model="departform.address" auto-complete="off"></el-input>
                  </el-form-item>
                  <el-form-item label="排序" :label-width="formLabelWidth">
                    <el-slider v-model="departform.sort"></el-slider>
                  </el-form-item>
                  <el-form-item label="" :label-width="formLabelWidth">
                    <el-button type="primary" @click="onSubmit" v-text="departform.id?'修改':'新增'"></el-button>
                    <el-button type="danger" @click="deleteSelected" icon="delete" v-show="departform.id && departform.id!=null">删除
                    </el-button>
                  </el-form-item>
                </el-form>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>
<script>
export default {
  name: 'department',
  data () {
    return {
      departform: {
        id: 0,
        name: '',
        href: '',
        mobile: '',
        fax: '',
        address: '',
        sort: 0
      },
      formLabelWidth: '100px'
    }
  },
  methods: {
    newAdd () {

    },
    batchDelete () {

    },
    onSubmit () {

    },
    deleteSelected () {}
  }
}
</script>
<style lang="scss" scoped>
  .department-container {
    padding: 1.25rem;
    padding-top: 0;
  }
  .el-card{
    padding-bottom: 20px;
    .box-title {
      padding: 15px;
    }
    .box-body {
      padding: 10px;

      .el-tree {
        cursor: default;
        background: #fff;
        border: 1px solid #d1dbe5;
      }
    }
  }
</style>
