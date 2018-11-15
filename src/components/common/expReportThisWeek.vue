<template>
  <div class="page-box">
    <div class="page" v-show="page" v-loading="loading">
      <div class="table">
        <div class="tab-box">
          <ul class="tab-list">
            <li class="tab-item">任务数</li>
            <li class="tab-item">运单数</li>
            <li class="tab-item">异常任务数</li>
            <li class="tab-item">异常运单数</li>
            <li class="tab-item">货损货差任务</li>
            <li class="tab-item">货损货差运单</li>
          </ul>
        </div>
        <div class="tab-box">
          <ul class="tab-list">
            <li class="tab-item">{{formData.totalTaskCount}}</li>
            <li class="tab-item">{{formData.totalShpCount}}</li>
            <li class="tab-item">{{formData.totalExpTaskCount}}</li>
            <li class="tab-item">{{formData.totalExpShpCount}}</li>
            <li class="tab-item">{{formData.totalNumTaskCount}}</li>
            <li class="tab-item">{{formData.totalNumShpCount}}</li>
          </ul>
        </div>
      </div>
      <div class="e-single">
        <ul class="e-list">
          <!-- <li class="e-item"><el-button @click="taskShpChange(1)" type="primary" plain>任务单</el-button></li>
          <li class="e-item"><el-button @click="taskShpChange(2)" type="primary" plain>运单</el-button></li> -->
          <li class="e-item" :class="{'active': actived === 'task'}" @click="tabSelect('task')">任务单</li>
          <li class="e-item" :class="{'active': actived === 'task1'}" @click="tabSelect('task1')">运单</li>
        </ul>
      </div>
      <div class="echarts">
        <div class="e-box">
          <div id="thisWeek5" style="width: 100%; height: 480px;"></div>
        </div>
        <div class="line-chart">
          <div class="line-box">
            <div id="thisWeek4" style="width: 100%; height: 480px;"></div>
          </div>
        </div>
      </div>
      <div class="text-box">
        <div class="text-top">
          <el-button type="primary" @click="handleExport" :loading="exporting" style="float: right;">导出数据</el-button>
        </div>
        <div class="info">
          <el-table :data="result.resultList" style="width:100%" highlight-current-row stripe :border="true">
            <el-table-column prop="taskNo" label="任务单号" align="center"></el-table-column>
            <el-table-column prop="shpNo" label="运单号" align="center"></el-table-column>
            <el-table-column prop="categoryDesc" label="分类" align="center"></el-table-column>
            <el-table-column prop="departmentName" label="部门" align="center"></el-table-column>
            <el-table-column prop="driverName" label="司机" align="center"></el-table-column>
            <el-table-column prop="vehicleNo" label="车辆" align="center"></el-table-column>
            <el-table-column prop="unloadCompany" label="收货单位" align="center"></el-table-column>
            <el-table-column label="异常类型" align="center">
              <template slot-scope="scope">
                <p>{{scope.row.exceptionType|expType}}</p>
              </template>
            </el-table-column>
            <el-table-column prop="itemInf" label="货物名称/编码" align="center"></el-table-column>
            <el-table-column prop="quantity" label="数量" align="center"></el-table-column>
            <el-table-column label="司机确认" align="center">
              <template slot-scope="scope">
                <p v-if="scope.row.isDriverConfirmed==0">待确认</p>
                <p v-if="scope.row.isDriverConfirmed==1">已确认</p>
              </template>
            </el-table-column>
            <el-table-column label="司机确认时间" align="center">
              <template slot-scope="scope">
                <p>{{scope.row.confirmedDate|ifNull}}</p>
              </template>
            </el-table-column>
            <el-table-column prop="shpStatus" label="完成状态" align="center">
              <template slot-scope="scope">
                <p>{{scope.row.shpStatus|shpStatus}}</p>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!--工具条-->
        <el-col :span="24" class="toolbar">
          <el-pagination @current-change="pageChange" @size-change="handleSizeChange" style="float:right;" background layout="total, sizes, prev, pager, next, jumper" :current-page="pageNo" :page-sizes="[10, 20, 50, 100]" :page-size="10" :total="total">
          </el-pagination>
        </el-col>
      </div>     
    </div>
    <educe v-show="isShow"></educe>
  </div>
</template>
<script>
// import '../../../node_modules/echarts/dist/echarts-en.min';
import educe from "./educe";
import echarts from "echarts";
export default {
  data() {
    return {
      actived: "task",
      page: true,
      loading: false,
      currentDepId: this.$store.state.currentDepId,
      lineX: [],
      taskLine: {
        totalCount: [],
        allExpCount: [],
        expCount:[],
        maxY: 0,
        title: "任务单"
      },
      shpLine: {
        totalCount: [],
        allExpCount: [],
        expCount:[],
        maxY: 0,
        title: "运单"
      },
      showLine: {},
      taskCount: {
        completed: 0,
        uncompleted: 0,
        normal: 0,
        unnormal: 0,
        ontime: 0,
        unontime: 0
      },
      shpCount: {
        completed: 0,
        uncompleted: 0,
        normal: 0,
        unnormal: 0,
        ontime: 0,
        unontime: 0
      },
      showCount: {
        completed: 0,
        uncompleted: 0,
        normal: 0,
        unnormal: 0,
        ontime: 0,
        unontime: 0
      },
      isShow: false,
      addFormVisible: false, //新增界面是否显示
      exporting: false,
      // 任务单情况
      charts: "",

      //运单情况
      charts2: "",

      //运单准时情况
      charts3: "",
      charts4: "",
      charts5: "",
      total: 0,
      pageNo: 1,
      pages: 0,
      pageSize: 10,
      result: {
        resultList: [],
        countVo: []
      },
      formData: {},
      exporting: false
    };
  },
  filters: {
    shpStatus: function(value) {
      let result = "";
      switch (value) {
        case "0":
          result = "已派车";
          break;
        case "1":
          result = "在途";
          break;
        case "2":
          result = "已签收";
          break;
        case "-1":
          result = "已取消";
          break;
        case "-2":
          result = "已终止";
          break;
      }
      return result;
    },
    ifNull: function(value) {
      if (value == null || value == "") {
        return "-";
      } else {
        return value;
      }
    },
    expType:function(value){
      let result = "";
      switch (value) {
        case 1:
          result = "货损";
          break;
        case 2:
          result = "货差";
          break;
        case 9:
          result = "其他";
          break;
        default:
          result = "其他";
          break;
      }
      return result;
    }
  },
  props: ["index", "sdate", "edate","dept"],
  watch: {
    index() {
      this.actived = "task";
      this.loadData();
    },
    dept(){
      this.actived = "task";
      this.loadData(); 
    },
    getCurrentDepId(val) {
      if (val != null && val != "") {
        this.loadData();
      }
    }
  },
  created() {
    this.loadData();
  },
  computed: {
    getCurrentDepId() {
      return this.$store.state.currentDepId;
    }
  },
  methods: {
    //导出报表
    handleExport() {
      let params = {
        startDate: this.sdate,
        endDate: this.edate,
        deptId:this.dept
      };
      this.exporting = true;
      this.axios
        .post(`${this.api.baseURL}/bi/exportBiReport`, params)
        .then(res => {
          let newUrl = res.data.data.result;
          if (newUrl != "") {
            this.$notify({
              title: "导出成功",
              dangerouslyUseHTMLString: true,
              message:
                '请点击<a href="' +
                newUrl +
                '" class="blueFont"><b>【这里】</b></a>下载',
              duration: 0
            });
          }
          this.exporting = false;
        });
    },
    handleSizeChange(val) {
      //每页显示数量变化
      this.pageSize = val;
      this.init();
    },
    pageChange(val) {
      //当前页码变化
      this.pageNo = val;
      this.init();
    },
    init() {
      this.lineX = [];
      this.lineData = [];
      this.taskLine = {
        totalCount: [],
        allExpCount: [],
        expCount:[],
        maxY: 0,
        title: "任务单"
      };
      this.shpLine = {
        totalCount: [],
        allExpCount: [],
        expCount:[],
        maxY: 0,
        title: "运单"
      };
      this.showLine = {};
      let params = {
        startDate: this.sdate,
        endDate: this.edate,
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        deptId:this.dept
      };
      this.loading = true;
      this.axios
        .post(`${this.api.baseURL}/bi/shipmentExpPandect`, params)
        .then(res => {
          console.log(res);
          if (res.data.success) {
            this.result.resultList = res.data.data.result.records;
            this.pages = res.data.data.result.pages;
            this.total = res.data.data.result.total;

            this.result.countVo = res.data.data.countVo;

            let lineData = res.data.data.dayCountList;
            if (lineData != null) {
              for (var i = 0; i < lineData.length; i++) {
                this.lineX.push(lineData[i].deliverPlanDate);
                //初始化任务单折线图数据
                this.taskLine.totalCount.push(lineData[i].totalTaskCount);
                this.taskLine.allExpCount.push(Number(lineData[i].totalExpTaskCount) + Number(lineData[i].totalNumTaskCount));
                this.taskLine.expCount.push(lineData[i].totalExpTaskCount); 
                if (i == 0) {
                  this.taskLine.maxY = lineData[i].totalTaskCount;
                } else {
                  if (this.taskLine.maxY < lineData[i].totalTaskCount) {
                    this.taskLine.maxY = lineData[i].totalTaskCount;
                  }
                }
                this.taskLine.maxY = Math.ceil(this.taskLine.maxY / 6) * 6;

                //初始化运单折线图数据
                this.shpLine.totalCount.push(lineData[i].totalShpCount);
                this.shpLine.allExpCount.push(
                  Number(lineData[i].totalExpShpCount) + Number(lineData[i].totalNumShpCount)
                );
                this.shpLine.expCount.push(lineData[i].totalExpShpCount); 
                if (i == 0) {
                  this.shpLine.maxY = lineData[i].totalShpCount;
                } else {
                  if (this.shpLine.maxY < lineData[i].totalShpCount) {
                    this.shpLine.maxY = lineData[i].totalShpCount;
                  }
                }
                this.shpLine.maxY = Math.ceil(this.shpLine.maxY / 6) * 6;
              }
            }

            this.loading = false;
          }
        });
    },
    loadData() {
      this.lineX = [];
      this.taskLine = {
        totalCount: [],
        allExpCount: [],
        expCount:[],
        maxY: 0,
        title: "任务单"
      };
      this.shpLine = {
        totalCount: [],
        allExpCount: [],
        expCount:[],
        maxY: 0,
        title: "运单"
      };
      this.showLine = {};
      let params = {
        startDate: this.sdate,
        endDate: this.edate,
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        deptId:this.dept
      };
      this.loading = true;
      this.axios
        .post(`${this.api.baseURL}/bi/shipmentExpPandect`, params)
        .then(res => {
          if (res.data.success) {
            this.result.resultList = res.data.data.result.records;
            this.pages = res.data.data.result.pages;
            this.total = res.data.data.result.total;

            this.result.countVo = res.data.data.countVo;
            this.formData = res.data.data.countVo[0];


            let lineData = res.data.data.dayCountList;

            if (lineData != null) {
              for (var i = 0; i < lineData.length; i++) {
                this.lineX.push(lineData[i].deliverPlanDate);
                //初始化任务单折线图数据
                this.taskLine.totalCount.push(lineData[i].totalTaskCount);
                this.taskLine.allExpCount.push(Number(lineData[i].totalExpTaskCount) + Number(lineData[i].totalNumTaskCount));
                this.taskLine.expCount.push(lineData[i].totalExpTaskCount);
                if (i == 0) {
                  this.taskLine.maxY = lineData[i].totalTaskCount;
                } else {
                  if (this.taskLine.maxY < lineData[i].totalTaskCount) {
                    this.taskLine.maxY = lineData[i].totalTaskCount;
                  }
                }
                this.taskLine.maxY = Math.ceil(this.taskLine.maxY / 6) * 6;

                //初始化运单折线图数据
                this.shpLine.totalCount.push(lineData[i].totalShpCount);
                this.shpLine.allExpCount.push(
                  Number(lineData[i].totalExpShpCount) + Number(lineData[i].totalNumShpCount)
                );
                this.shpLine.expCount.push(lineData[i].totalExpShpCount);
                if (i == 0) {
                  this.shpLine.maxY = lineData[i].totalShpCount;
                } else {
                  if (this.shpLine.maxY < lineData[i].totalShpCount) {
                    this.shpLine.maxY = lineData[i].totalShpCount;
                  }
                }
                this.shpLine.maxY = Math.ceil(this.shpLine.maxY / 6) * 6;
              }
              this.showLine = this.taskLine;
              this.drowAllPie();
            }
            this.loading = false;
          }
        });
    },
    drowAllPie() {
      this.$nextTick(function() {
        this.drawPie4("thisWeek4");
      });
      this.$nextTick(function() {
        this.drawPie5("thisWeek5");
      });
    },
    drawPie4(id) {
      this.charts4 = echarts.init(document.getElementById(id));
      this.charts4.setOption({
        title: {
          text: this.showLine.title + "/单量"
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: ["计划数", "异常数"]
        },
        grid: {
          top: "10%",
          left: "3%",
          right: "8%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: {
          type: "category",
          boundaryGap: true,
          data: this.lineX
        },
        yAxis: {
          type: "value",
          max: this.showLine.maxY,
          min: 0,
          splitNumber: 6
        },
        series: [
          {
            name: "计划数",
            type: "bar",
            data: this.showLine.totalCount,
            barMaxWidth: 30, //最大宽度
            itemStyle: {
              normal: {
                /*信息显示方式*/
                label: {
                  show: true,
                  position: "top",
                  formatter: "{c}"
                },
                color: "#ed7d31"
              }
            }
          },
          {
            name: "异常数",
            type: "line",
            data: this.showLine.allExpCount,
            itemStyle: {
              /*设置折线颜色*/
              normal: {
                color: "#5b9bd5"
              }
            }
          }
        ]
      });
    },
    drawPie5(id) {
      this.charts5 = echarts.init(document.getElementById(id));
      this.charts5.setOption({
        title: {
          text: this.showLine.title + "/单量"
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: ["异常数", "货损货差"]
        },
        grid: {
          top: "10%",
          left: "3%",
          right: "8%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: {
          type: "category",
          boundaryGap: true,
          data: this.lineX
        },
        yAxis: {
          type: "value",
          max: this.showLine.maxY,
          min: 0,
          splitNumber: 6
        },
        series: [
          {
            name: "异常数",
            type: "bar",
            data: this.showLine.totalCount,
            barMaxWidth: 30, //最大宽度
            itemStyle: {
              normal: {
                /*信息显示方式*/
                label: {
                  show: true,
                  position: "top",
                  formatter: "{c}"
                },
                color: "#ed7d31"
              }
            }
          },
          {
            name: "货损货差",
            type: "line",
            data: this.showLine.expCount,
            itemStyle: {
              /*设置折线颜色*/
              normal: {
                color: "#5b9bd5"
              }
            }
          }
        ]
      });
    },
    preview() {
      this.$router.push({ name: "Educe" });
      // this.isShow = true;
      // this.page = false;
      this.addFormVisible = false;
    },
    //任务单，运单按钮切换
    tabSelect(msg) {
      this.actived = msg;
      if (msg == "task") {
        this.showLine = this.taskLine;
        this.drowAllPie();
      }
      if (msg == "task1") {
        this.showLine = this.shpLine;
        this.drowAllPie();
      }
    }
  },
  mounted() {},
  components: {
    educe
  }
};
</script>
<style lang="less" scoped>
.page {
  width: 100%;
  height: 100%;

  .table {
    width: 100%;
    height: 100%;

    .tab-box {
      width: 100%;
      height: 48px;
      border: 1px solid #ccc;

      &:first-child {
        border-bottom: none;
        background-color: #eee;
      }

      .tab-list {
        width: 100%;
        height: 100%;

        .tab-item {
          float: left;
          width: 16.66666%;
          line-height: 48px;
          text-align: center;
          border-right: 1px solid #ccc;

          &:last-child {
            border-right: none;
          }

          &:after {
            display: block;
            clear: both;
            content: " ";
          }
        }
      }
    }
  }

  .box {
    width: 100%;
    height: 50px;
    background-color: #eee;

    &:nth-child(2) {
      background-color: #eaf7ff;
    }

    .list > li {
      float: left;
      height: 50px;
      line-height: 50px;
      text-align: center;
    }

    .list {
      width: 100%;
      height: 100%;

      .item {
        width: 80px;
      }
      .item2 {
        width: 100px;
      }
      .item3 {
        width: 140px;
      }
    }
  }

  .e-single {
    margin-top: 20px;
    width: 142px;
    height: 40px;
    border: 1px solid #ccc;
    border-radius: 15px;
    z-index: 99;

    .e-list {
      width: 100%;
      height: 40px;

      .e-item {
        float: left;
        width: 70px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        cursor: pointer;

        &:after {
          display: block;
          clear: both;
          content: " ";
        }

        &:first-child {
          border-right: 1px solid #ccc;
          border-top-left-radius: 15px;
          border-bottom-left-radius: 15px;
        }
        &:nth-child(2) {
          border-top-right-radius: 15px;
          border-bottom-right-radius: 15px;
        }
      }

      .active {
        color: #fff;
        background-color: #409eff;
      }
    }
  }

  .echarts {
    width: 100%;

    .e-box {
      margin-top: 20px;
      margin-bottom: 50px;
      width: 100%;
      text-align: center;

      .e-single {
        width: 100%;

        .e-mission {
          display: inline-block;
          width: 80px;
          height: 34px;
          line-height: 34px;
          color: #fff;
          border: 1px solid #ccc;
          border-radius: 5px;
          background-color: #409eff;
          cursor: pointer;
        }

        .e-waybill {
          display: inline-block;
          width: 80px;
          height: 34px;
          line-height: 34px;
          color: #fff;
          border: 1px solid #ccc;
          border-radius: 5px;
          background-color: #409eff;
          cursor: pointer;
        }
      }

      .list {
        width: 100%;
        height: 350px;

        .item {
          float: left;
          width: 33.3333%;
          height: 100%;

          &:last-child {
            margin-right: 0;
          }
        }
      }
    }

    .line-chart {
      width: 100%;

      .line-box {
        position: relative;
        margin-top: 20px;
        width: 100%;
        text-align: center;
      }
    }
  }

  .text-box {
    width: 100%;
    height: 100%;
    border-top: 1px solid #ccc;
    overflow: hidden;

    .text-top {
      margin-top: 20px;
      width: 100%;
      height: 40px;

      &:after {
        display: block;
        clear: both;
        content: " ";
      }
    }

    .info {
      margin-top: 20px;
      width: 100%;

      .info-box {
        width: 100%;
        height: 51px;
        border: 1px solid #ccc;
        margin-bottom: 10px;
        background-color: #eee;

        .list > li {
          float: left;
          height: 50px;
          line-height: 50px;
          text-align: center;
          border-right: 1px solid #ccc;

          &:last-child {
            border-right: none;
          }
        }

        .list {
          width: 100%;
          height: 50px;

          .item {
            width: 5%;
          }
          // .item2 {
          //   width: 109px;
          // }
          .item3 {
            width: 10%;
          }
        }
      }
      .info-box2 {
        width: 100%;
        height: 51px;
        border: 1px solid #ccc;
        margin-bottom: 10px;

        .list > li {
          float: left;
          height: 50px;
          line-height: 50px;
          text-align: center;
          border-right: 1px solid #ccc;

          &:last-child {
            border-right: none;
          }
        }

        .list {
          width: 100%;
          height: 50px;

          .item {
            width: 5%;
          }
          .item2 {
            width: 10%;

            &:nth-child(5) {
              line-height: 1.5;
            }
            &:nth-child(8) {
              line-height: 1.5;
            }
            &:nth-child(9) {
              line-height: 1.5;
            }
          }
          .item3 {
            width: 10%;
          }
        }
      }
    }
  }

  .select {
    .choice {
      position: relative;
      width: 150px;
      height: 27px;
      display: inline-block;

      .label {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 27px;
        line-height: 27px;

        > input {
          position: absolute;
          top: 3px;
          left: 0;
          width: 20px;
          height: 20px;
        }

        > span {
          position: absolute;
          top: 0;
          left: 25px;
        }
      }
    }
  }

  .dialog-foot {
    text-align: center;
  }
}
</style>

