<template>
  <!-- 人口迁徙 -->
  <div class="popumigration-container">
    <div id="map_container" class="map_container" ref="pm_map_container"></div>
    <!-- 右侧区域人口分析 -->
    <div class="area-analyze-container" :style = "{ right }">
      <div class="toggleShow" v-on:click="hideAreaAnalyze()">
        <div class="arrow">&lt;&lt;</div>
      </div>
      <!-- 区域人口分析 -->
      <div class="chart_wrapper">
        <div class="border_line">
          <span class="tr"></span>
          <span class="tb"></span>
          <span class="rt"></span>
          <span class="rb"></span>
        </div>
        <p class="title">区域人口来源分析</p>
        <div class="people_analyze_chart">
          <div class="header-container">
            <span>来源地</span>
            <span>客流量</span>
            <span>占比</span>
          </div>
          <el-scrollbar  wrap-class="scrollbar-wrapper">
              <div class="content">
                <ul>
                  <li v-for="(item, index) in morningEveningData" :key="index">
                    <span>{{ item.name }}</span>
                    <span>{{ item.outVal }}</span>
                    <span>{{ item.inVal }}</span>
                  </li>
                </ul>
              </div>
          </el-scrollbar>
        </div>
      </div>
      <div class="personas-wrapper" style="width:200px;height:200px;border: 1px solid red">
        <swiper :options="swiperOption">
          <swiper-slide v-for="(slide, index) in swiperSlides" :key="index">I'm Slide {{ slide }}</swiper-slide>
          <div class="swiper-pagination" slot="pagination"></div>
        </swiper>
      </div>
      
      
      <!-- <div class="chart_wrapper line_chart">
        <div class="border_line">
          <span class="tr"></span>
          <span class="tb"></span>
          <span class="rt"></span>
          <span class="rb"></span>
        </div>
        <p class="title">教育程度</p>
        <div class="flow_change_chart" id="flow_change_chart" style="height:200px;"></div>
      </div> -->
    </div>
  </div>
</template>
<script>
const ave_typeData = {'outcount': '平均出行次数(次)', 'outdistance': '平均出行距离(km)', 'outtime': '平均出行时间(次)', ' commutedistance': '平均通勤距离(km)', ' commutecount': '平均通勤时间(min)'}
const testArr = [{id:1,name:"早高峰(7:00-9:00)",outVal:"459.126",inVal:"515.085",totalVal:"973.211"},{id:2,name:"早高峰(7:00-9:00)",outVal:"459.126",inVal:"515.085",totalVal:"973.211"},{id:3,name:"早高峰(7:00-9:00)",outVal:"459.126",inVal:"515.085",totalVal:"973.211"},{id:5,name:"早高峰(7:00-9:00)",outVal:"459.126",inVal:"515.085",totalVal:"973.211"},{id:5,name:"早高峰(7:00-9:00)",outVal:"459.126",inVal:"515.085",totalVal:"973.211"},{id:6,name:"早高峰(7:00-9:00)",outVal:"459.126",inVal:"515.085",totalVal:"973.211"}]
import { swiper, swiperSlide } from 'vue-awesome-swiper'

export default {
  data: function () {
    return {
      areaAnalyzeVisible: false,
      currentRight: -11,
      ave_typeData: ave_typeData,
      morningEveningData: testArr,
      swiperOption: {
        pagination: {
          el: '.swiper-pagination'
        }
      },
      swiperSlides: [1, 2, 3, 4, 5]
    }
  },
  components:{
    swiper,
    swiperSlide
  },
  computed: {
    right () {
      return this.currentRight + 'px'
    }
  },
  mounted() {
    setInterval(() => {
      console.log('simulate async data')
      if (this.swiperSlides.length < 10) {
        this.swiperSlides.push(this.swiperSlides.length + 1)
      }
    }, 3000)
  },
  methods: {
    hideAreaAnalyze(){
      this.areaAnalyzeVisible = !this.areaAnalyzeVisible

      console.log(this.areaAnalyzeVisible);

      if (this.areaAnalyzeVisible) {
        this.currentRight = -420
      }else {
        this.currentRight = -11
      }
    },
    test(){
      console.log('ddsddddsfdfd');
    }
  },
}
</script>
<style lang="scss" scoped>
  // require swiper styles
  @import 'swiper/dist/css/swiper.css';

  .popumigration-container {
    width: 100%;
      height: 100%;
    .map_container{
      width: 100%;
      height: 100%;
    }

    // 区域人口分析
    .area-analyze-container {
      width: 400px;
      position: absolute;
      top: -40px;
      bottom: -10px;
      right: -11px;
      background-color: #041a3a;
      font-size: 14px;
      padding-left: 10px;
      transition: right 0.8s;
      .toggleShow {
        width: 30px;
        height: 44px;
        background-color: #041a3a;
        border: 2px solid #105bc5;
        border-radius: 3px;
        border-right: 0;
        position: absolute;
        top: 50%;
        right: 400px;
        margin-top: -22px;
        cursor: pointer;
        .arrow {
          width: 100%;
          height: 100%;
          line-height: 42px;
          text-align: center;
          color: #fff;
          text-shadow: 2px 2px 8px #fff;
          user-select: none;
        }
      }
      .chart_wrapper {
        position: relative;
        padding-top: 8px;
        box-shadow: 0 0 20px #083f69 inset;
        /* 四个角的边框 */
        .border_line {width: 100%;height: 100%;position: absolute;left: 0px;top: 0px;}
        .border_line span {
          width: 10px;
          height: 10px;
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
      .chart_wrapper{
        margin-bottom: 10px;
        .people_analyze_chart{
          padding: 10px;
          height: 300px;
          box-sizing: border-box;
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
              width: 90px;
              padding: 5px 0;
              background-color: rgba(137,149,193,0.2);
              &:nth-child(1){
                flex: 1;
                text-align: center;
              }
              &:nth-child(2){
                margin-left: 10px;
                text-align: center;
              }
              &:nth-child(3){
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
                  width: 90px;
                  color: #3a84cd;
                  padding: 5px 0;
                  &:nth-child(1){
                    flex: 1;
                    text-align: center;
                  }
                  &:nth-child(2){
                    margin-left: 10px;
                    text-align: center;
                  }
                  &:nth-child(3){
                    margin-left: 10px;
                    text-align: center;
                  }
                }
              }
            }
          }
        }
      }

      .personas-wrapper{
        width: 100%;
        height: 300px;

        .swiper-container{
          width: 100%;
          height: 100%;
        }
      }
    }
  }
</style>
