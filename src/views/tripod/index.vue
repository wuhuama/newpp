<template>
  <div class="tripod-container">
    <!-- 查询条件 -->
    <div class="filter-container">
      <div class="filter-left">
        <div class="filter-item">
          <span class="text">日期：</span>
          <el-date-picker
            v-model="listQuery.date"
            type="daterange"
            size="mini"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </div>
        <div class="filter-item">
          <span class="area-options-btn" @click="selectArea()">区域选择(1)</span>
          <span class="text">出行目的：</span>
          <el-select v-model="listQuery.dest" placeholder="请选择" size="mini" clearable>
            <el-option
              v-for="item in trip_options"
              :key="item.label"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="filter-item">
          <span class="text">出行方式：</span>
          <el-select v-model="listQuery.totype" placeholder="请选择" size="mini" clearable>
            <el-option
              v-for="item in trip_options"
              :key="item.label"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="filter-item">
          <span class="text">用户画像：</span>
          <el-select v-model="listQuery.sex" placeholder="性别" size="mini" class="small-width-80" clearable>
            <el-option value="2" label="女"></el-option>
            <el-option value="1" label="男"></el-option>
          </el-select>
        </div>
        <div class="filter-item">
          <el-select v-model="listQuery.age" placeholder="年龄" size="mini" class="small-width-80" clearable>
            <el-option
              v-for="item in trip_options"
              :key="item.label"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="filter-item">
          <el-select v-model="listQuery.edu" placeholder="教育程度" size="mini" clearable>
            <el-option
              v-for="item in trip_options"
              :key="item.label"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="filter-item">
          <el-select v-model="listQuery.usertype" placeholder="用户属性" size="mini" clearable>
            <el-option
              v-for="item in trip_options"
              :key="item.label"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="filter-item">
          <el-button type="primary" size="mini" class="query-btn" @click="handleFilter()">查询</el-button>
        </div>
      </div>
      <div class="filter-right">
        <ul class="btn-grounp">
          <li v-for="(item, index) in btn_groups" :key="index" :class="{'active': currentIndex === index }" @click="switchMapView(index)"><span class="text">{{item}}</span></li>
        </ul>
        <el-button type="primary" size="mini" class="export-btn">导出</el-button>
      </div>
    </div>
    <!-- 区域选择 -->
    <el-dialog
      :visible.sync="dialogAreasVisible"
      custom-class="areas-wrapper"
      :close-on-click-modal=false
      width="60%">
      <div class="areas-content">
        <div class="optionMap" id="optionMap" ref="optionMap"></div>
        <div class="options">
          <div class="header">区域选择</div>
          <div class="area-plans">
            <div class="text">方案选择</div>
            <el-scrollbar wrap-class="scrollbar-wrapper" ref="scrollbar">
              <el-radio-group v-model="plan" class="plan-content">
                <el-radio :label="3">默认区域</el-radio>
                <el-radio :label="6">方案一</el-radio>
                <el-radio :label="9">方案二</el-radio>
                <el-radio :label="3">默认区域</el-radio>
                <el-radio :label="6">方案一</el-radio>
                <el-radio :label="9">方案二</el-radio>
              </el-radio-group>
            </el-scrollbar>
          </div>

          <div class="btn-bottom">
            <el-button type="primary" size="medium">保存</el-button>
            <el-button type="danger" size="medium">新建方案</el-button>
          </div>
          <div class="small-text">
            备注：单击为选中区域，再次单击取消选中状态，选中小区覆盖层为黄色，未选中覆盖层为灰色
          </div>
        </div>
      </div>
    </el-dialog>
    <!-- 主体 -->
    <div class="map-box">
      <div class="border_line">
        <span class="tr"></span>
        <span class="tb"></span>
        <span class="rt"></span>
        <span class="rb"></span>
      </div>
      <!-- 地图展示 -->
      <div id="map_container" class="map_container" ref="map_container"></div>
    </div>

    <!-- 交通量分析 -->
    <el-dialog
      title="交通量分析"
      :visible.sync="dialogTrafficVisible"
      custom-class="traffic-wrapper"
      :close-on-click-modal=false
      center
      width="60%">
      <el-row :gutter="10">
        <el-col :span="6">
          <div class="col-chart">
            <div class="title">性别</div>
            <div id="sex_chart"></div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="col-chart">
            <div class="title">年龄</div>
            <div id="age_chart"></div>
          </div>
        </el-col>
        <el-col :span="6" v-show="false">
          <div class="col-chart">
            <div class="title">教育程度</div>
            <div id="edu_chart"></div>
          </div>
        </el-col>
        <el-col :span="6" v-show="false">
          <div class="col-chart">
            <div class="title">用户属性</div>
            <div id="user_chart"></div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="col-chart">
            <div class="title">出行目的分析</div>
            <div id="dest_chart"></div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="col-chart">
            <div class="title">出行方式分析</div>
            <div id="type_chart"></div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="col-chart">
            <div class="title">各时段交通量变化趋势</div>
            <div id="traffic_chart"></div>
          </div>
        </el-col>
      </el-row>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogTrafficVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="dialogTrafficVisible = false" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
const btn_groups = ['2D地图', '3D地图', '平面地图']

export default {
  data () {
    return {
      btn_groups: btn_groups,
      currentIndex: 0,
      listQuery: {
        date: '',
        areas: '',
        dest:'',
        totype:'',
        sex: '',
        age: '',
        edu: '',
        usertype:''
      },
      trip_options:[{
        value:'1',
        label:'全部'
      },{
        value:'2',
        label:'通勤'
      },{
        value:'3',
        label:'游憩'
      },{
        value:'1',
        label:'全目的'
      }],
      dialogAreasVisible: false,
      plan: 3,
      dialogTrafficVisible: false
    }
  },
  mounted(){
    this.initMap()
  },
  methods: {
    initMap () {
      let map =new BMap.Map(this.$refs.map_container); // 创建Map实例
      map.centerAndZoom(new BMap.Point(116.404, 39.915), 11);// 初始化地图,设置中心点坐标和地图级别
      map.addControl(new BMap.MapTypeControl({//添加地图类型控件
        mapTypes:[
          BMAP_NORMAL_MAP,
          BMAP_HYBRID_MAP
        ]}));
      map.setCurrentCity("北京");// 设置地图显示的城市 此项是必须设置的
      map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
      var mapStyle={  style : "midnight" }  
      map.setMapStyle(mapStyle);
    },
    selectArea () {
      this.dialogAreasVisible = true
    },
    switchMapView (index) {
      this.currentIndex = index;
    },
    handleFilter () {
      const tempData = Object.assign({}, this.listQuery)
      console.log(tempData);
    }
  },
}
</script>
<style lang="scss" scoped>
.tripod-container {
  position: relative;
  width: 100%;
  min-height: 100%;
  min-height: calc(100vh - 80px);

  .filter-container{
    // font-size: 0;
    // height: 42px;
    display: flex;
    align-items: start;
    justify-content: space-between;
    padding-bottom: 0;
    .filter-left{
      flex: 1;
      .text{
        font-size: 12px;
        // margin-right: 10px;
      }
      /deep/ .el-select--mini{
        width: 100px;
      }
      .el-range-editor{
        width: 230px;
      }
      .el-select.small-width-80{
        width: 80px;
      }
      /deep/ .el-input__inner, /deep/ .el-range-input{
        background-color: transparent;
        color: #fff;
      }
      /deep/ .el-date-editor .el-range-separator {
          width: 10%;
          color: #fff;
      }
      .area-options-btn{
        display: inline-block;
        border: 1px solid #fff;
        border-radius: 4px;
        cursor: pointer;
        height: 26px;
        line-height: 25px;
        font-size: 14px;
        padding: 0 10px;
      }
      .query-btn{
        padding-left: 20px;
        padding-right: 20px;
      }
    }
    .filter-right{
      display: flex;
      align-items: center;

      .btn-grounp{
        display: flex;
        align-items: center;
        justify-content: space-around;
        height: 28px;
        border-radius: 4px;
        margin: 0;
        padding: 0;
        margin-right: 10px;
        box-sizing: border-box;
        border: 1px solid #0e72d0;
        li{
          height: 100%;
          line-height: 28px;
          font-size: 14px;
          border-right: 1px solid #0e72d0;
          cursor: pointer;
          &:last-child{
            border-right: none;
          }
          &.active{
            background-color: #0e72d0;
          }
          span{
            display: inline-block;
            padding: 0 10px;
          }
        }
      }
      .export-btn{
        padding-left: 20px;
        padding-right: 20px;
      }
    }
  }

  /* 区域选择dialog */
  /deep/ .areas-wrapper{
    background: rgba($color: #000000, $alpha: 0.5);
    .areas-content{
      display: flex;
      .optionMap{
        flex: 1;
        height: 600px;
      }
      .options{
        width: 300px;
        .header{
          height: 50px;
          line-height: 50px;
          color: #fff;
          font-size: 20px;
          font-weight: 500;
        }
      }
      .area-plans {
        display: flex;
        flex-direction: column;
        // justify-content: center;
        align-items: center;
        width: 100%;
        height: 320px;
        overflow: hidden;
        /deep/ .el-scrollbar{
          height: 100%;
          width: 100%;
        }
        .scrollbar-wrapper {
          overflow-x: hidden !important;
        }
        .text{
          width: 100%;
          height: 40px;
          line-height: 40px;
          text-align: center;
          color: #fff;
          font-size: 18px;
          margin-bottom: 15px;
        }
        .el-radio {
          width: 100%;
          display: block;
          margin-bottom: 25px;
          font-size: 16px;
          color: #fff;
          &:last-child{
            margin-bottom: 0;
          }
        }
      }
      .btn-bottom{
        margin-bottom: 15px;
      }
    }
  }

  .map-box {
    width: 100%;
    height: calc(100vh - 122px);
    position: relative;
    padding: 5px;

    /* 四个角的边框 */
    .border_line {width: 100%;height: 100%;position: absolute;left: 0px;top: 0px;}
    .border_line span {
      width: 15px;
      height: 15px;
      border: 2px solid #368CF9;
      position: absolute;
      display: block;
    }
    .border_line span.tr {
        border-bottom: 0;
        border-right: 0;
        top: -1px;
        left: -1px;
    }
    .border_line span.tb {
        border-top: 0;
        border-right: 0;
        bottom: -1px;
        left: -1px;
    }
    .border_line span.rt {
      border-bottom: 0;
        border-left: 0;
        top: -1px;
        right: -1px;
    }
    .border_line span.rb {
      border-top: 0;
        border-left: 0;
        bottom: -1px;
        right: -1px;
    }

    .map_container{
      width: 100%;
      height: 100%;
    }
  }

  
  .traffic-wrapper{
    .col-chart{
      height: 240px;
      border: 1px solid #ccc;
    }
  }

  @media screen and (min-width: 1366px) {
    /deep/ .traffic-wrapper{
      margin-top: 5vh !important;
      .col-chart{
        height: 200px;
      }
    }
  }
}
</style>
