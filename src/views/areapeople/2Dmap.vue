<template>
  <div class="map-2d-container">
    <div id="map_container" class="map_container" ref="map_container"></div>
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
        <p class="title">区域人口分析</p>
        <div class="people_analyze_chart" id="people_analyze_chart">
          <div class="people_analyze_content">
            <div class="text_14_bold">区域人口总量: 210.222</div>
            <ul>
              <li>
                <div class="text">{{ ave_typeData["outcount"] }}</div>
                <div class="count">6</div>
              </li>
              <li>
                <div class="text">{{ ave_typeData["outcount"] }}</div>
                <div class="count">6</div>
              </li>
              <li>
                <div class="text">{{ ave_typeData["outcount"] }}</div>
                <div class="count">6</div>
              </li>
              <li>
                <div class="text">{{ ave_typeData["outcount"] }}</div>
                <div class="count">6</div>
              </li>
              <li>
                <div class="text">{{ ave_typeData["outcount"] }}</div>
                <div class="count">6</div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <!-- 各时段客流变化趋势 -->
      <div class="chart_wrapper line_chart">
        <div class="border_line">
          <span class="tr"></span>
          <span class="tb"></span>
          <span class="rt"></span>
          <span class="rb"></span>
        </div>
        <p class="title">各时段客流变化趋势</p>
        <div class="flow_change_chart" id="flow_change_chart" style="height:200px;"></div>
      </div>
      <!-- 性别分析 -->
      <div class="chart_wrapper pie_chart">
        <div class="border_line">
          <span class="tr"></span>
          <span class="tb"></span>
          <span class="rt"></span>
          <span class="rb"></span>
        </div>
        <p class="title">性别分析</p>
        <div class="sex_analyze_chart" id="sex_analyze_chart" style="height:200px;"></div>
      </div>
      <!-- 年龄分析 -->
      <div class="chart_wrapper pie_chart">
        <div class="border_line">
          <span class="tr"></span>
          <span class="tb"></span>
          <span class="rt"></span>
          <span class="rb"></span>
        </div>
        <p class="title">年龄分析</p>
        <div class="age_analyze_chart" id="inOut_analyze_chart" style="height:200px;"></div>
      </div>
    </div>
  </div>
</template>
<script>
const ave_typeData = {'outcount': '平均出行次数(次)', 'outdistance': '平均出行距离(km)', 'outtime': '平均出行时间(次)', ' commutedistance': '平均通勤距离(km)', ' commutecount': '平均通勤时间(min)'}

export default {
  data: function () {
    return {
      areaAnalyzeVisible: false,
      currentRight: -11,
      ave_typeData: ave_typeData
    }
  },
  computed: {
    right () {
      return this.currentRight + 'px'
    }
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
    }
  },
}
</script>
<style lang="scss" scoped>
  .map-2d-container {
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
      .chart_wrapper{
        margin-bottom: 10px;

        .people_analyze_chart {
          .people_analyze_content {
            padding: 10px 10px 15px;
            .text_14_bold{
              font-size: 14px;
              font-weight: 600;
              margin-bottom: 10px;
            }
            ul {
              display: flex;
              justify-content: space-around;
              align-items: center;
              font-size: 12px;
              border: 1px solid #0e72d0;
              margin-bottom: 20px;
              li {
                text-align: center;
                .text{
                  padding: 5px 10px;
                  border-bottom: 1px solid #0e72d0;
                }
                .count{
                  padding: 5px 10px;
                  color: #0e72d0;
                }
              }
            }
          }
        }
      }
    }
  }
</style>
