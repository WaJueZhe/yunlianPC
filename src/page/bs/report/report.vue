<template>
  <el-row class="warp" style="margin-bottom:50px">
    <el-col :span="24" class="warp-breadcrum" style="padding:10px;">
      <app-title :title="reportTitle"></app-title>
    </el-col>
    <el-row class="box">
      <el-col class="top">
        <div class="nav">
          <ul class="list">
            <li class="item" v-for="(item, index) in arr" :key="index" @click="toggleTabs(index)" :class="{ active:activeIndex == index }">{{item}}</li>
          </ul>
        </div>
        <el-select style="margin-left:5px" v-model="filters.dept" placeholder="选择部门">
          <el-option label="--全部--" value=""></el-option>
          <el-option v-if="item.delFlag==0" v-for="(item,i) in depts" :key="i" :label="item.departmentName" :value="item.id"></el-option>
          <el-option v-if="item.delFlag==1" v-for="(item,i) in depts" :key="i" :label="item.departmentName+'(已删除)'" :value="item.id"></el-option>
        </el-select>
      </el-col>
    </el-row>
    <el-row>
      <el-col style="padding:10px;">
        <div class="content">
          <thisWeek :index="activeIndex" :dept="filters.dept" :sdate="filters.beginDate" :edate="filters.endDate" v-if="activeIndex == 0 ? true: false"></thisWeek>
          <thisWeek :index="activeIndex" :dept="filters.dept" :sdate="filters.beginDate" :edate="filters.endDate" v-if="activeIndex == 1 ? true: false"></thisWeek>
          <thisWeek :index="activeIndex" :dept="filters.dept" :sdate="filters.beginDate" :edate="filters.endDate" v-if="activeIndex == 2 ? true: false"></thisWeek>
          <thisWeek :index="activeIndex" :dept="filters.dept" :sdate="filters.beginDate" :edate="filters.endDate" v-if="activeIndex == 3 ? true: false"></thisWeek>
        </div>
      </el-col>
    </el-row>
  </el-row>
</template>
<script>
import thisWeek from "../../../components/common/thisWeek";
import moment from "moment";
export default {
  data() {
    return {
      value7: "",
      pickerOptions2: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      reportTitle: "报表统计",
      // arr: ["本周", "上周", "本月", "上月"],
      arr: ["上周", "本周", "上月", "本月"],
      activeIndex: 0,
      filters: {
        beginDate: "",
        endDate: "",
        dept: ""
      },
      depts: []
    };
  },
  methods: {
    getDetps() {
      let p = {};
      this.axios
        .post(`${this.api.baseURL}/depUser/getUserDepts`, p)
        .then(res => {
          //console.log(res);
          this.depts = res.data.data.result;
        });
    },
    searchData() {
      //console.log("最新时间：" + this.value7);
      if (this.value7 != "" && this.value7 != null) {
        let searchTime = this.value7.split(",");
      }
      this.filters.beginDate = searchTime[0];
      this.filters.endDate = searchTime[1];
    },
    toggleTabs(index) {
      this.activeIndex = index;
      if (index == 1) {
        this.filters.beginDate = this.getFirstDayOfWeek(new Date());
        this.filters.endDate = this.getLasttDayOfWeek(new Date());
      }
      if (index == 0) {
        this.filters.beginDate = this.getFirstDayOfLastWeek(new Date());
        this.filters.endDate = this.getLastDayOfLastWeek(new Date());
      }
      if (index == 3) {
        this.filters.beginDate = this.getFirstDayOfMonth(new Date());
        this.filters.endDate = this.getCurrentMonthLast();
      }
      if (index == 2) {
        this.filters.beginDate = this.getLastMonthStartDate();
        this.filters.endDate = this.getLastMonthEndDate();
      }
    },
    timeFormate(date) {
      if (!date || typeof date === "string") {
        this.error("时间格式异常");
      }
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      var d = date.getDate();
      return y + "-" + m + "-" + d;
    },
    //获取本周第一天
    getFirstDayOfWeek(date) {
      var date = new Date();
      var weekday = date.getDay() || 7;
      date.setDate(date.getDate() - weekday + 1);
      return this.timeFormate(date);
    },
    //获取本周最后一天
    getLasttDayOfWeek(date) {
      var date = new Date();
      var weekday = date.getDay() || 7;
      date.setDate(date.getDate() - weekday + 7);
      return this.timeFormate(date);
    },
    //获取上周第一天
    getFirstDayOfLastWeek(date) {
      var date = new Date();
      var weekday = date.getDay() || 7;
      date.setDate(date.getDate() - weekday + 1 - 7);
      return this.timeFormate(date);
    },
    //获取上周第最后一天
    getLastDayOfLastWeek(date) {
      var date = new Date();
      var weekday = date.getDay() || 7;
      date.setDate(date.getDate() - weekday);
      return this.timeFormate(date);
    },
    //获取本月第一天
    getFirstDayOfMonth(date) {
      var date = new Date();
      date.setDate(1);
      return this.timeFormate(date);
    },
    //本月最后一天
    getCurrentMonthLast() {
      var date = new Date();
      var currentMonth = date.getMonth();
      var nextMonth = ++currentMonth;
      var nextMonthFirstDay = new Date(date.getFullYear(), nextMonth, 1);
      var oneDay = 1000 * 60 * 60 * 24;
      return this.timeFormate(new Date(nextMonthFirstDay - oneDay));
    },
    //获得上月开始时间
    getLastMonthStartDate() {
      var now = new Date(); //当前日期
      var nowYear = now.getFullYear(); //当前年
      if (now.getMonth() + 1 == 1) {
        nowYear = nowYear - 1;
      }
      var lastMonthDate = new Date(); //上月日期
      lastMonthDate.setDate(1);
      lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
      var lastYear = lastMonthDate.getYear();
      var lastMonth = lastMonthDate.getMonth();
      var lastMonthStartDate = new Date(nowYear, lastMonth, 1);
      return this.timeFormate(lastMonthStartDate);
    },
    //获得上月结束时间
    getLastMonthEndDate() {
      var now = new Date(); //当前日期
      var nowYear = now.getFullYear(); //当前年
      if (now.getMonth() + 1 == 1) {
        nowYear = nowYear - 1;
      }
      var lastMonthDate = new Date(); //上月日期
      lastMonthDate.setDate(1);
      lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
      var lastYear = lastMonthDate.getYear();
      var lastMonth = lastMonthDate.getMonth();
      var lastMonthEndDate = new Date(
        nowYear,
        lastMonth,
        this.getMonthDays(lastMonth)
      );
      return this.timeFormate(lastMonthEndDate);
    },
    //获得某月的天数
    getMonthDays(myMonth) {
      var now = new Date(); //当前日期
      var nowYear = now.getFullYear(); //当前年
      var monthStartDate = new Date(nowYear, myMonth, 1);
      var monthEndDate = new Date(nowYear, myMonth + 1, 1);
      var days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24);
      return days;
    }
  },
  created() {
    //初始化查询参数
    this.filters.beginDate = this.getFirstDayOfLastWeek(new Date());
    this.filters.endDate = this.getLastDayOfLastWeek(new Date());
    // this.init();
    this.getDetps();
  },
  components: {
    thisWeek
  }
};
</script>

<style lang="less" scoped>
.warp {
  .box {
    margin-bottom: 10px;
    width: 100%;
    height: 100%;

    .top {
      padding: 0 10px;

      .nav {
        float: left;
        width: 202px;
        height: 41px;
        border: 1px solid #ccc;
        border-radius: 15px;

        &:after {
          display: block;
          clear: both;
          content: " ";
        }

        .list {
          width: 100%;
          height: 40px;

          .item {
            float: left;
            width: 50px;
            height: 40px;
            line-height: 40px;
            text-align: center;
            border-right: 1px solid #ccc;
            cursor: pointer;

            &:first-child {
              border-top-left-radius: 15px;
              border-bottom-left-radius: 15px;
            }

            &:last-child {
              border-top-right-radius: 15px;
              border-bottom-right-radius: 15px;
              border-right: none;
            }

            &:after {
              display: block;
              clear: both;
              content: " ";
            }
          }

          .active {
            color: #fff;
            background-color: #409eff;
          }
        }
      }

      .data {
        float: left;
        margin-left: 30px;
        width: 530px;
        height: 40px;
      }
      .search {
        float: left;
        width: 80px;
        height: 40px;
      }
    }

    .content {
      width: 100%;
      height: 100%;
      background-color: red;
    }
  }
}
</style>


