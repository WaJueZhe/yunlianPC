<template>
  <div class="command">
      <div id="myCharts" :style="{width: '100%', height: '540px'}"></div>
  </div>
</template>

<script>
export default {
  methods: {
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById("myCharts"));
      // 绘制图表
      myChart.setOption({
        tooltip: {},
        xAxis: {
          data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"]
        },
        yAxis: {},
        series: [
          {
            name: "损耗",
            type: "line",
            data: [20, 20, 36, 10, 10, 20, 40],
            symbolSize: 10,
            areaStyle: {
              backgroundColor: "rgba(255,255,255,0.1)"
            }
          }
        ]
      });
    }
  },
  mounted() {
    this.drawLine();
  }
};
</script>

<style lang="less" scoped>

</style>