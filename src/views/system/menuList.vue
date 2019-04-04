<template>

  <div class="menu-container">
    <el-card class="box-card">
      <div class="box-title" style="width: 100%;">
        <el-button type="primary" icon="el-icon-plus" @click="newAdd" size="medium">新增</el-button>
        <!-- <el-button type="danger" icon="el-icon-delete" @click="batchDelete" size="medium">删除</el-button> -->
      </div>
      <div class="box-body">
        <el-row slot="body" :gutter="24" style="margin-bottom: 20px;">
          <el-col :span="6" :xs="24" :sm="24" :md="6" :lg="6" style="margin-bottom: 20px;">
            <el-tree v-if="menuTree"
                    ref="menuTree"
                    accordion
                    :data="menuTree"
                    highlight-current
                    :render-content="renderContent"
                    @node-click="handleNodeClick" clearable node-key="id" :props="defaultProps"></el-tree>
          </el-col>
          <el-col :span="18" :xs="24" :sm="24" :md="18" :lg="18">
            <el-card class="box-card">
              <div class="text item">
                <el-form :model="form" ref="formRef">
                  <el-form-item label="父级" :label-width="formLabelWidth">
                    <!--<el-input v-model="form.parentId" auto-complete="off"></el-input>-->
                    <el-select-tree v-model="form.pid" :treeData="menuTree" :propNames="defaultProps" clearable
                                    placeholder="请选择父级">
                    </el-select-tree>
                  </el-form-item>
                  <el-form-item label="名称" :label-width="formLabelWidth">
                    <el-input v-model="form.title" auto-complete="off"></el-input>
                  </el-form-item>
                  <el-form-item label="链接" :label-width="formLabelWidth">
                    <el-input v-model="form.name" auto-complete="off"></el-input>
                  </el-form-item>
                  <el-form-item label="图标" :label-width="formLabelWidth">
                    <el-input v-model="form.icon" auto-complete="off"></el-input>
                    <div>
                      <small class="attention">请填写svg图标的名称,svg图标命名规范: 全部小写字母</small>
                    </div>
                  </el-form-item>
                  <!-- <el-form-item label="是否显示" :label-width="formLabelWidth">
                    <el-radio class="radio" v-model="form.isShow" label="1">显示</el-radio>
                    <el-radio class="radio" v-model="form.isShow" label="0">不显示</el-radio>
                  </el-form-item> -->
                  <el-form-item label="排序" :label-width="formLabelWidth">
                    <el-input-number v-model="form.sort" controls-position="right" auto-complete="off" @change="handleChange" :min="0" :max="100"></el-input-number>
                  </el-form-item>
                  <el-form-item label="" :label-width="formLabelWidth">
                    <el-button type="primary" @click="onSubmit" v-text="form.id?'修改':'新增'" size="medium"></el-button>
                    <el-button type="danger" @click="deleteSelected" icon="delete" v-show="form.id && form.id!=null" size="medium">删除
                    </el-button>
                  </el-form-item>
                </el-form>
              </div>
              <el-dialog title="选择图标" v-model="selectIconDialog">
                <div class="select-tree"></div>
                <span slot="footer" class="dialog-footer">
                  <el-button @click="selectIconDialog = false">取 消</el-button>
                  <el-button type="primary" @click="selectIconDialog = false">确 定</el-button>
                </span>
              </el-dialog>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>

</template>
<script type="text/babel">
import { getSysMenu, delSysMenu, updSysMenu, addSysMenu } from '@/api/system'
import selectTree from '@/components/selectTree/selectTree.vue'
import treeter from '@/components/selectTree/treeter'
// import merge from 'element-ui/src/utils/merge'
// import { mapActions } from 'vuex'

export default {
  mixins: [ treeter ],
  components: {
    'el-select-tree': selectTree
  },
  data () {
    return {
      selectIconDialog: false,
      formLabelWidth: '100px',
      defaultProps: {
        children: 'children',
        label: 'title',
        id: 'id'
      },
      maxId: 7000000,
      menuTree: [],
      queryMenu: {
        menuId: 0
      },
      form: {
        id: null,
        title: '',
        name: '',
        sort: 0,
        icon: '',
        pid: null
      },
      formRef: [{
        name: [{require: true, trigger: 'blur'}],
        title: [{require: true, trigger: 'blur'}],
        sort: [{require: true, trigger: 'blur'}]
      }]
    }
  },
  created () {
    this.loadMenu()
  },
  methods: {
    handleChange (value) {
      this.form.sort = value
    },
    renderContent (h, { node, data, store }) {
      return (
        <span>
          <span>
            <span><svg-icon v-show={data.icon} icon-class={data.icon ? data.icon : ''} class="color-main"></svg-icon>&nbsp;{node.label}</span>
          </span>
        </span>)
    },
    resetform () {
      this.form = {
        id: null,
        name: '',
        title: '',
        sort: 0,
        icon: '',
        pid: null
      }
    },
    newAdd () {
      this.resetform()
    },
    // 删除单个节点
    deleteSelected () {
      delSysMenu(this.form.id).then(res => {
        if (res.code === 1) {
          this.$message({
            showClose: true,
            message: '删除成功',
            type: 'success'
          })
          this.deleteFromTree(this.menuTree, this.form.id)
          this.newAdd()
        }
      })
    },
    handleNodeClick (data, node, el) {
      console.log(data)
      this.form = Object.assign({}, data)
    },
    onSubmit () {
      if (this.form.id == null) { // 新增
        console.log('新增', this.form)
        const tempData = {}
        tempData.menuId = this.form.id
        tempData.menuName = this.form.title
        tempData.menuIcon = this.form.icon
        tempData.menuOrder = this.form.sort
        tempData.menuUrl = this.form.name
        tempData.parentId = this.form.pid
        addSysMenu(tempData).then(res => {
          if (res.code === 1) {
            this.$message('操作成功')
            this.form.id = res.data.id
            this.loadMenu()
            // this.appendTreeNode(this.menuTree, res.data)
          }
        })
      } else { // 修改
        console.log('修改', this.form)
        const tempData = {}
        tempData.menuId = this.form.id
        tempData.menuName = this.form.title
        tempData.menuIcon = this.form.icon
        tempData.menuOrder = this.form.sort
        tempData.menuUrl = this.form.name
        tempData.parentId = this.form.pid
        updSysMenu(tempData).then(res => {
          if (res.code === 1) {
            this.$message('操作成功')
            this.loadMenu()
            // this.updateTreeNode(this.menuTree, this.form)
          }
        }).catch(() => {

        })
      }
    },
    loadMenu () {
      getSysMenu().then((res) => {
        this.loading = false
        this.menuTree = [].concat(res.data)
        // console.log(res)
      }).catch(() => {
        this.loading = false
      })
    }
  }
  // 批量删除
  /* batchDelete () {
      var checkKeys = this.$refs.menuTree.getCheckedKeys()
      if (checkKeys == null || checkKeys.length <= 0) {
        this.$message.warning('请选择要删除的菜单')
        return
      }
      this.$confirm('确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delSysMenu(checkKeys.join(','))
          .then(res => {
            this.$message('操作成功')
            this.loadMenu()
          })
      })
    }, */
}
</script>

<style lang="scss" scoped>
  .menu-container {
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

  .select-tree .icons-wrapper {
    display: block;
  }

  .select-tree .is-empty i {
    width: 30px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    display: inline-block;
    cursor: pointer;
  }

  .select-tree .is-empty i:hover {
    background-color: #0d6aad;
    color: #ffffff;
  }
.attention {
  color: red
}
</style>
