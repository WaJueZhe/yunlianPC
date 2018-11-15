<template>
  <div class="chart">
    <el-col :span="8" class="tab">
        <router-link to="/chart1">货损</router-link>
        <router-link to="/chart2">线路图</router-link>
        <router-link to="/chart3">线路图1</router-link>
        <router-link to="/chart4">线路图2</router-link>
    </el-col>
    <el-col>
        <keep-alive>
            <router-view></router-view>
        </keep-alive>
    </el-col>
  </div>
</template>


<script>
export default {
  methods: {
    click(id) {
      let arr = document.querySelectorAll(".tab a");
      for (var i = 0; i < arr.length; i++) {
        // arr[i].style.backgroundColor = "#fff";
        arr[i].setAttribute("style","background-color:#dedede;border-right: 1px solid #e9e9e9;border-bottom: 1px solid #e9e9e9;");
      }
    //   arr[id].style.backgroundColor = "#f5f5f5";
      arr[id].setAttribute("style","background-color:#f5f5f5;border-right:none;border-bottom: none;");
    }
  },
  watch: {
    $route() {
      if (this.$route.name == "chart1") {
        this.click(0);
      } else if (this.$route.name == "chart2") {
        this.click(1);
      } else if (this.$route.name == "chart3") {
        this.click(2);
      } else {
        this.click(3);
      }
    }
  }
};
</script>

<style lang="less" scoped>
.chart {
  width: 100%;
  overflow: hidden;
  .tab {
    a {
      display: block;
      float: left;
      width: 25%;
      text-align: center;
      height: 40px;
      line-height: 40px;
      background-color: #dedede;
      color: #383838;
      border-right: 1px solid #e9e9e9;
      border-bottom: 1px solid #e9e9e9;
    }
    a:first-child{
        background-color: #ffffff;
    }
  }
}
</style>

