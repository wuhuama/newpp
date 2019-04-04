<template>
  <div class="home-work-container">
    <div class="filter-container">
      <div class="filter-left">
        <span class="text">日期:</span>
        <el-date-picker
          v-model="listQuery.date"
          type="date"
          size="small"
          style="width:150px;"
          placeholder="选择日期">
        </el-date-picker>
        <span class="area-options-btn" @click="selectArea()">区域选择(1)</span>
        <el-button type="primary" size="small" class="query-btn">查询</el-button>
      </div>
      <div class="filter-right">
        <ul class="btn-grounp">
          <li v-for="(item, index) in btn_groups" :key="index" :class="{'active': currentIndex === index }" @click="switchMapView(index)"><span class="text">{{item}}</span></li>
        </ul>
        <el-button type="primary" size="small" class="export-btn">导出</el-button>
      </div>
    </div>
    <!-- <ws-dialog :isShow=true>
      <div>问问圣诞节开发贷款纠纷的设计费给对方</div>
    </ws-dialog> -->
    <el-dialog
      :visible.sync="dialogAreasVisible"
      custom-class="areas-wrapper"
      :close-on-click-modal=false
      width="60%">
      <!-- <span>这是一段信息</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogAreasVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogAreasVisible = false">确 定</el-button>
      </span> -->
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
    <div class="map-box">
      <div class="border_line">
        <span class="tr"></span>
        <span class="tb"></span>
        <span class="rt"></span>
        <span class="rb"></span>
      </div>
      <div id="map_container" class="map_container" ref="map_container"></div>

      <!-- 右侧各种居住工作分析按钮组 -->
      <div class="analyzeBtn-group">
        <!-- 多区域时显示 -->
        <ul v-if="selectedAreas.length>1">
          <li v-for="(item, index) in analyzeBtn_groups2" :key="item.id"
            :class="{'active' :cur_anay_Index === index}"
            @click="switchDataView(index)"
            >
            <span>{{item.title}}</span>
          </li>
        </ul>

        <!-- 单区域时显示 -->
        <ul v-else>
          <li v-for="(item, index) in analyzeBtn_groups" :key="item.id"
            :class="{'active' :cur_anay_Index === index}"
            @click="switchDataView(index)"
            >
            <span>{{item.title}}</span>
          </li>
        </ul>
        
        
      </div>

      <!-- 右侧外地居住工作 -->
      <div class="ecdemic-wrapper" v-if="ecdemicVisible">
        <div class="ecdemic-title">
          <div class="text">区域居住外地工作人口分布</div>
          <div class="arrow" @click="ecdemicVisible = false" title="隐藏">>></div>
        </div>
        <!-- 各时段客流变化趋势 -->
        <div class="pie_chart">
          <div class="border_line">
            <span class="tr"></span>
            <span class="tb"></span>
            <span class="rt"></span>
            <span class="rb"></span>
          </div>
          <p class="title">各时段客流变化趋势</p>
          <div class="flow_trend_chart" id="flow_trend_chart" style="height:200px;"></div>
        </div>
        <!-- 各时段客流变化趋势 -->
        <div class="bar_chart">
          <div class="border_line">
            <span class="tr"></span>
            <span class="tb"></span>
            <span class="rt"></span>
            <span class="rb"></span>
          </div>
          <p class="title">本地居民人口工作去向</p>
          <div class="flow_trend_chart" id="flow_trend_chart" style="height:200px;"></div>
        </div>
      </div>

      <!-- 左侧职住排名 -->
      <div class="rank-wrapper" v-if="rankVisible">
        <div class="title">各区域职住比例排名</div>
        <div class="rank-content">
          <el-scrollbar wrap-class="scrollbar-wrapper" ref="scrollbar">
            <ul>
              <li v-for="(item, index) in 20" :key="index" class="rank-item">
                <div class="left">
                  <div class="ranking">{{index+1}}</div>
                  <div>今天明天今天明天</div>
                </div>
                <div class="right">1.89</div>
              </li>
            </ul>
          </el-scrollbar>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Dialog from 'comp/Dialog'

const btn_groups = ['2D地图', '3D地图', '平面地图']
const analyzeBtn_groups = [{id:0, title:'职住比'}, {id:1, title:'居住分布'}, {id:2, title:'工作分布'}, {id:3, title:'居住分布'}, {id:4, title:'工作分布'}]
const analyzeBtn_groups2 = [{id:0, title:'职住比'}, {id:1, title:'居住分布'}, {id:2, title:'工作分布'}]
export default {
  data(){
    return {
      btn_groups: btn_groups,
      analyzeBtn_groups: analyzeBtn_groups,
      analyzeBtn_groups2: analyzeBtn_groups2,
      currentIndex: 0,
      cur_anay_Index: 0,
      listQuery: {
        date: '',
        areas: ''
      },
      selectedAreas:['1','2','3'],
      dialogAreasVisible: false,
      plan: 3,
      ecdemicVisible: true,
      rankVisible: false
    }
  },
  components:{
    'ws-dialog': Dialog
  },
  methods:{
    initMap(){
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
    switchMapView(index){
      this.currentIndex = index;
    },
    switchDataView(index){
      this.cur_anay_Index = index;
    },
    selectArea(){
      this.dialogAreasVisible = true
    }
  },
  mounted(){
    this.initMap()
  }
}
</script>
<style lang="scss" scoped>
.home-work-container{
  position: relative;
  width: 100%;
  min-height: 100%;
  min-height: calc(100vh - 80px);
  .filter-container{
    // font-size: 0;
    height: 42px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .filter-left{
      display: flex;
      align-items: center;
      .text{
        font-size: 12px;
        margin-right: 10px;
      }
      /deep/ .el-input__inner{
        background-color: transparent;
        color: #fff;
      }
      .area-options-btn{
        display: inline-block;
        border: 1px solid #fff;
        border-radius: 4px;
        cursor: pointer;
        height: 30px;
        line-height: 29px;
        font-size: 14px;
        padding: 0 10px;
        margin: 0 10px;
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
        height: 30px;
        border-radius: 4px;
        margin: 0;
        padding: 0;
        margin-right: 10px;
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
            padding: 0 20px;
          }
        }
      }
      .export-btn{
        padding-left: 20px;
        padding-right: 20px;
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
  .analyzeBtn-group {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    ul {
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
      li {
        width: 70px;
        height: 70px;
        box-sizing: border-box;
        border: 1px solid #368CF9;
        border-radius: 5px;
        margin-bottom: 10px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: #368CF9;
        cursor: pointer;
        &:last-child{
          margin-bottom: 0;
        }
        &.active{
          color: #fff;
          background-color: #368CF9;
        }
        span{
          font-size: 12px;
        }
      }
    }
  }

  /* 区域选择 */
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

  .ecdemic-wrapper{
    width: 300px;
    height: 100%;
    position: absolute;
    top: 0;
    right: 0;
    padding: 5px 10px;
    background-color: rgba(4, 26, 58, 0.95);
    font-size: 14px;
    .ecdemic-title{
      height: 30px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 10px;
      color: #dadfe6;
      margin-bottom: 10px;
      border-bottom:2px transparent solid;
      // background: rgba(70, 112, 190, 0.1);
      // background: linear-gradient(to right #031837 #081f4b);
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
    .pie_chart, .bar_chart{
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
    .pie_chart{
      margin-bottom: 10px;
    }
  }

  .rank-wrapper{
    position: absolute;
    left: 30px;
    top: 50px;
    width: 320px;
    height: 560px;
    overflow: hidden;
    border: 1px solid #2E6AA8;
    .title{
      margin-bottom: 15px;
    }
    .rank-content{
      width: 100%;
      height: 100%;
      /deep/ .el-scrollbar{
        width: 100%;
        height: 100%;
        .scrollbar-wrapper{
          overflow-x: hidden !important;

          ul{
            padding: 0 15px;
            margin: 0;
            .rank-item{
              height: 40px;
              padding: 5px;
              border: 1px solid #2E6AA8;
              margin-bottom: 10px;
              display: flex;
              justify-content: space-between;
              align-items: center;
              font-size: 14px;
              .left{
                display: flex;
                align-items: center;
                flex: 1;
                .ranking{
                  width: 28px;
                  height: 28px;
                  text-align: center;
                  box-sizing: border-box;
                  padding: 5px;
                  background: #0071c6;
                  margin-right: 10px;
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
