<template>
  <!-- 人口迁徙 -->
  <div class="popumigration-container">
    <div id="map_container" class="map_container" ref="pm_map_container"></div>
    <!-- 右侧区域人口分析 -->
    <div class="area-analyze-container" :style = "{ right }">
      <div class="toggleShow" v-on:click="hideAreaAnalyze()">
        <div class="arrow">&lt;&lt;</div>
      </div>
      <div class="personas-wrapper" style="width:200px;height:200px;border: 1px solid red">
        <swiper :options="swiperOption">
          <swiper-slide v-for="(slide, index) in swiperSlides" :key="index">I'm Slide {{ slide }}</swiper-slide>
          <div class="swiper-pagination" slot="pagination"></div>
        </swiper>
      </div>
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
      // .toggleShow {
      //   width: 30px;
      //   height: 44px;
      //   background-color: #041a3a;
      //   border: 2px solid #105bc5;
      //   border-radius: 3px;
      //   border-right: 0;
      //   position: absolute;
      //   top: 50%;
      //   right: 400px;
      //   margin-top: -22px;
      //   cursor: pointer;
      //   .arrow {
      //     width: 100%;
      //     height: 100%;
      //     line-height: 42px;
      //     text-align: center;
      //     color: #fff;
      //     text-shadow: 2px 2px 8px #fff;
      //     user-select: none;
      //   }
      // }
    }
  }
</style>
