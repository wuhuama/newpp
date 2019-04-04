<template>
  <div class="screen-line-container">
    <!-- 查询条件 -->
    <div class="filter-container">
      <div class="filter-left">
        <div class="filter-item">
          <span class="text">日期：</span>
          <el-date-picker
            v-model="listQuery.date"
            type="date"
            size="small"
            style="width:150px;"
            placeholder="选择日期">
          </el-date-picker>
        </div>
        <div class="filter-item">
          <span class="text">查核线：</span>
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
          <el-button type="primary" size="mini" class="query-btn" @click="handleFilter()">查询</el-button>
        </div>
      </div>
      <div class="filter-right">
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
            <el-scrollbar wrap-class="scrollbar-wrapper" ref="plan_scrollbar">
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

      <!-- 查核线分析 -->
      <div class="screenLine-wrapper" v-show="screenLineAnayVisible">
        <div class="title-wrapper">
          <div class="text">区域居住外地工作人口分布</div>
          <div class="arrow" @click="screenLineAnayVisible = false" title="隐藏">>></div>
        </div>
        <!-- 进出客流分析 -->
        <div class="line_chart">
          <div class="border_line">
            <span class="tr"></span>
            <span class="tb"></span>
            <span class="rt"></span>
            <span class="rb"></span>
          </div>
          <p class="title">进出客流分析</p>
          <div class="inOut_analyze_chart" id="inOut_analyze_chart" style="height:200px;"></div>
        </div>
        <!-- 早晚高峰客流分析 -->
        <div class="table_chart">
          <div class="border_line">
            <span class="tr"></span>
            <span class="tb"></span>
            <span class="rt"></span>
            <span class="rb"></span>
          </div>
          <p class="title">早晚高峰客流分析</p>
          <div class="morningEvening_analyze_chart" id="morningEvening_analyze_chart" style="height:300px;">
            <div class="header-container">
              <span>名称</span>
              <span>出环</span>
              <span>入环</span>
              <span>合计</span>
            </div>
            <el-scrollbar  wrap-class="scrollbar-wrapper" ref="analyze_ME_scrollbar">
                <div class="content">
                  <ul>
                    <li v-for="(item, index) in morningEveningData" :key="index">
                      <span>{{ item.name }}</span>
                      <span>{{ item.outVal }}</span>
                      <span>{{ item.inVal }}</span>
                      <span>{{ item.totalVal }}</span>
                    </li>
                  </ul>
                </div>
            </el-scrollbar>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
const testArr = [{id:1,name:"早高峰(7:00-9:00)",outVal:"459.126",inVal:"515.085",totalVal:"973.211"},{id:2,name:"早高峰(7:00-9:00)",outVal:"459.126",inVal:"515.085",totalVal:"973.211"},{id:3,name:"早高峰(7:00-9:00)",outVal:"459.126",inVal:"515.085",totalVal:"973.211"},{id:5,name:"早高峰(7:00-9:00)",outVal:"459.126",inVal:"515.085",totalVal:"973.211"},{id:5,name:"早高峰(7:00-9:00)",outVal:"459.126",inVal:"515.085",totalVal:"973.211"}]
export default {
  data () {
    return {
      listQuery: {
        date: '',
        areas: '',
        dest:''
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
      screenLineTitle: '查核线分析',
      screenLineAnayVisible: true,
      morningEveningData: testArr
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
    handleFilter () {
      const tempData = Object.assign({}, this.listQuery)
      console.log(tempData);
    }
  },
}
</script>
<style lang="scss" scoped>
.screen-line-container {
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

    // 查核线分析
    .screenLine-wrapper{
      width: 400px;
      position: absolute;
      right: 0;
      top: 0;
      bottom: 0;
      background-color: #041a3a;
      font-size: 14px;
      padding-left: 10px;
      .title-wrapper{
        height: 30px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 10px;
        color: #dadfe6;
        margin-bottom: 10px;
        border-bottom:2px transparent solid;
        background: #074378;
        background-clip:padding-box,border-box;
        background-origin:padding-box,border-box;
        background-image:linear-gradient(135deg,#074378,#031837,#074378),linear-gradient(135deg,#031837,#3878de,#031837);
        .text{
          border-left: 3px solid #02f59f;
          padding-left: 10px;
        }
        .arrow{
          padding: 0 6px;
          cursor: pointer;
          color: #21b9ec;
          transform: scale(1, 1.8);
          user-select:none;
        }
      }
      .line_chart, .table_chart{
        position: relative;
        padding-top: 8px;
        box-shadow: 0 0 20px #083f69 inset;
        .border_line span{
          width: 10px;
          height: 10px;
        }
        .title{
          padding: 0;
          margin: 0;
          margin-left: 10px;
          border-left: 3px solid #368CF9;
          padding-left: 5px;
          color: #368CF9;
          font-size: 14px;
        }
      }
      .line_chart{
        margin-bottom: 10px;
      }
      .table_chart {
        .morningEvening_analyze_chart {
          padding: 10px;
          /deep/ .el-scrollbar{
            width: 100%;
            height: calc(100% - 30px);
            overflow: hidden;
            .scrollbar-wrapper {
              overflow-x: hidden !important;
            }
          }
          .header-container{
            display: flex;
            height: 30px;
            align-items: center;
            color: #8790a0;
            span {
              padding: 5px 0;
              background-color: rgba(137,149,193,0.2);
              &:nth-child(1){
                flex: 1;
                text-align: center;
              }
              &:nth-child(2){
                width: 60px;
                margin-left: 10px;
                text-align: center;
              }
              &:nth-child(3){
                width: 60px;
                margin-left: 10px;
                text-align: center;
              }
              &:nth-child(4){
                width: 80px;
                margin-left: 10px;
                text-align: center;
              }
            }
          }
          .content {
            ul{
              li{
                height: 40px;
                display: flex;
                align-items: center;
                border: 1px solid #214d8d;
                margin-top: 10px;

                span{
                  color: #3a84cd;
                  padding: 5px 0;
                  &:nth-child(1){
                    flex: 1;
                    text-align: center;
                  }
                  &:nth-child(2){
                    width: 60px;
                    margin-left: 10px;
                    text-align: center;
                  }
                  &:nth-child(3){
                    width: 60px;
                    margin-left: 10px;
                    text-align: center;
                  }
                  &:nth-child(4){
                    width: 80px;
                    margin-left: 10px;
                    text-align: center;
                  }
                }
              }
            }
          }
        }
      }
    }
  }

}
</style>
