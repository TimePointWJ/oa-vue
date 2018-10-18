<template>
    <!-- <div class="app-container">
    </div> -->
    <div :class="className" :style="{height:height,width:width}"></div>
</template>

<script>
import { getNoticeCount } from "@/api/notice";
import { mapGetters } from "vuex";
import echarts from "echarts";
require("echarts/theme/macarons"); // echarts theme
import { debounce } from "@/utils";
export default {
  props: {
    className: {
      type: String,
      default: "chart"
    },
    width: {
      type: String,
      default: "100%"
    },
    height: {
      type: String,
      default: "450px"
    }
  },
  data() {
    return {
      chart: null,
      chartData: null,
      pieChartTypeData: [],
      pieChartContentData: []
    };
  },
  computed: {
    ...mapGetters(["name", "avatar", "roles"])
  },
  created() {
    this.fetchData();
    this.initChart();
  },
  mounted() {
    this.initChart();
    this.__resizeHanlder = debounce(() => {
      if (this.chart) {
        this.chart.resize();
      }
    }, 100);
    window.addEventListener("resize", this.__resizeHanlder);
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    window.removeEventListener("resize", this.__resizeHanlder);
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    fetchData() {
      getNoticeCount().then(response => {
        const data = response.data.responseData;
        console.log(data);
        this.chartData = data;
        this.getPieChartTypeData();
        this.getPieChartContentData();
        this.chart.setOption({
          //填充数据
          title: {
            text: "公告类别统计",
            //subtext: "纯属虚构",
            x: "center"
          },
          tooltip: {
            trigger: "item",
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          legend: {
            type: "scroll",
            orient: "vertical",
            right: "70%",
            top: 20,
            bottom: 20,
            data: this.pieChartTypeData,

            selected: data.selected
          },
          series: [
            {
              name: "公告类别统计",
              type: "pie",
              radius: "70%",
              center: ["50%", "50%"],
              data: this.pieChartContentData,
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: "rgba(0, 0, 0, 0.5)"
                }
              }
            }
          ]
          // tooltip: {
          //   trigger: 'item',
          //   formatter: '{a} <br/>{b} : {c} ({d}%)'
          // },
          // legend: {
          //   type: 'scroll',
          //   orient: 'vertical',
          //   left: '20%',
          //   top: 20,
          //   bottom: 20,
          //   //left: 'center',
          //   //bottom: '10',
          //   //data: ['Industries', 'Technology', 'Forex', 'Gold', 'Forecasts']
          //   data:this.pieChartTypeData
          // },
          // calculable: true,
          // series: [
          //   {
          //     name: '公告类别统计',
          //     type: 'pie',
          //     roseType: 'radius',
          //     //radius: [10, 150],
          //     radius: ['5%', '70%'],
          //     center: ['50%', '38%'],
          //     // data: [
          //     //   { value: 320, name: '通知' },
          //     //   { value: 240, name: '时间' }
          //     // ],
          //     data:this.pieChartContentData,
          //     animationEasing: 'cubicInOut',
          //     animationDuration: 2600
          //   }
          // ]
        });
      });
    },
    getPieChartTypeData() {
      this.pieChartTypeData = [];
      for (var i = 0; i < this.chartData.pieChartCount.length; i++) {
        this.pieChartTypeData.push(this.chartData.pieChartCount[i].typeName);
      }
    },
    getPieChartContentData() {
      this.pieChartContentData = [];
      for (var i = 0; i < this.chartData.pieChartCount.length; i++) {
        var temp = {
          value: null,
          name: null,
          typeId: null
        };
        temp.value = this.chartData.pieChartCount[i].countNumber;
        temp.name = this.chartData.pieChartCount[i].typeName;
        temp.typeId = this.chartData.pieChartCount[i].typeId;
        this.pieChartContentData.push(temp);
      }
    },
    initChart() {
      this.chart = echarts.init(this.$el, "macarons");
      console.log("开始");
      // this.chart.setOption({
      //   tooltip: {
      //     trigger: "item",
      //     formatter: "{a} <br/>{b} : {c} ({d}%)"
      //   },
      //   legend: {
      //     left: "center",
      //     bottom: "10",
      //     //data: ['Industries', 'Technology', 'Forex', 'Gold', 'Forecasts']
      //     data: this.pieChartTypeData
      //   },
      //   calculable: true,
      //   series: [
      //     {
      //       name: "公告类别统计",
      //       type: "pie",
      //       roseType: "radius",
      //       radius: [15, 95],
      //       center: ["50%", "38%"],
      //       data: [{ value: 320, name: "通知" }, { value: 240, name: "时间" }],
      //       animationEasing: "cubicInOut",
      //       animationDuration: 2600
      //     }
      //   ]
      // });
      console.log("结束");
    }
  }
};
</script>