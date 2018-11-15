<template>
  <div class="page-box">
    <div class="page" v-show="page">
      <el-table style="width:100%;background-color: #eee;" highlight-current-row v-loading="loading" stripe :border="true">
        <el-table-column prop="driverName" label="任务" align="center" min-width="10%"></el-table-column>
        <el-table-column prop="driverName" label="运单" align="center" min-width="10%"></el-table-column>
        <el-table-column prop="driverName" label="接单数" align="center" min-width="10%"></el-table-column>
        <el-table-column prop="driverName" label="完成任务" align="center" min-width="10%"></el-table-column>
        <el-table-column prop="driverName" label="未完成任务" align="center" min-width="10%"></el-table-column>
        <el-table-column prop="driverName" label="签发运单" align="center" min-width="10%"></el-table-column>
        <el-table-column prop="driverName" label="签收运单" align="center" min-width="10%"></el-table-column>
        <el-table-column prop="driverName" label="异常运单" align="center" min-width="10%"></el-table-column>
        <el-table-column prop="driverName" label="运单准时到达数" align="center" min-width="10%"></el-table-column>
      </el-table>
      <div class="echarts">
        <div class="e-box">
          <ul class="list">
            <li class="item">
              <div id="lastMonth" style="width: 450px;height: 350px;"></div>
            </li>
            <li class="item">
              <div id="lastMonth2" style="width: 450px;height: 350px;"></div>
            </li>
            <li class="item">
              <div id="lastMonth3" style="width: 450px;height: 350px;"></div>
            </li>
          </ul>
        </div>
        <div class="line-chart">
          <div class="l-box">
            <div class="l-single">
              <span class="l-mission">任务单</span>
              <span class="l-waybill">运单</span>
            </div>
            <div id="lastMonth4" style="width: 100%;height: 600px;"></div>
          </div>
        </div>
      </div>
      <div class="text-box">
        <div class="text-top">
          <el-button type="primary" style="float: right;">导出数据</el-button>
          <el-button type="primary" :loading="exporting" style="float: right;margin-right:10px;">导出配置</el-button>
          <!-- <div class="data">导出数据</div>
        <div class="export" @click="addFormVisible = true">导出配置</div> -->
        </div>
        <div class="info">
          <el-table :data="result.resultList" style="width:100%" highlight-current-row v-loading="loading" stripe :border="true">
            <el-table-column type="index" label="序号" align="center" width="70%"></el-table-column>
            <el-table-column prop="id" label="id" v-if="false"></el-table-column>
            <el-table-column prop="taskNo" label="任务单号" align="center" min-width="10%"></el-table-column>
            <el-table-column prop="shpNo" label="运单号" align="center" min-width="10%"></el-table-column>
            <el-table-column prop="categoryDesc" label="线路信息" align="center" min-width="10%"></el-table-column>
            <el-table-column prop="driverName" label="司机" align="center" min-width="10%"></el-table-column>
            <el-table-column prop="vehicleNo" label="车辆" align="center" min-width="10%"></el-table-column>
            <el-table-column prop="goodsDesc" label="货物描述" align="center" min-width="10%"></el-table-column>
            <el-table-column prop="reSigner" label="签收人" align="center" min-width="10%"></el-table-column>
            <el-table-column prop="totalUnits" label="计划件数" align="center" min-width="10%"></el-table-column>
            <el-table-column prop="shpStatus" label="完成状态" align="center" min-width="10%">
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
      <!-- 导出配置弹框 -->
      <el-dialog title="导出配置" :visible.sync="addFormVisible" :close-on-click-modal="false">
        <div class="select">
          <div class="choice">
            <label class="label">
              <input type="checkbox">
              <span>任务单号</span>
            </label>
          </div>
          <div class="choice">
            <label class="label">
              <input type="checkbox">
              <span>原始任务单号</span>
            </label>
          </div>
          <div class="choice">
            <label class="label">
              <input type="checkbox">
              <span>运单号</span>
            </label>
          </div>
          <div class="choice">
            <label class="label">
              <input type="checkbox">
              <span>原始运单号</span>
            </label>
          </div>
          <div class="choice">
            <label class="label">
              <input type="checkbox">
              <span>路线信息</span>
            </label>
          </div>
        </div>
        <div class="select">
          <div class="choice">
            <label class="label">
              <input type="checkbox">
              <span>计划员</span>
            </label>
          </div>
          <div class="choice">
            <label class="label">
              <input type="checkbox">
              <span>司机</span>
            </label>
          </div>
          <div class="choice">
            <label class="label">
              <input type="checkbox">
              <span>车辆</span>
            </label>
          </div>
          <div class="choice">
            <label class="label">
              <input type="checkbox">
              <span>签发地点</span>
            </label>
          </div>
          <div class="choice">
            <label class="label">
              <input type="checkbox">
              <span>签收地点</span>
            </label>
          </div>
        </div>
        <div class="select">
          <div class="choice">
            <label class="label">
              <input type="checkbox">
              <span>货物描述</span>
            </label>
          </div>
          <div class="choice">
            <label class="label">
              <input type="checkbox">
              <span>签发人</span>
            </label>
          </div>
          <div class="choice">
            <label class="label">
              <input type="checkbox">
              <span>签收人</span>
            </label>
          </div>
          <div class="choice">
            <label class="label">
              <input type="checkbox">
              <span>签发单位</span>
            </label>
          </div>
          <div class="choice">
            <label class="label">
              <input type="checkbox">
              <span>签收单位</span>
            </label>
          </div>
        </div>
        <div class="select">
          <div class="choice">
            <label class="label">
              <input type="checkbox">
              <span>计划签发时间</span>
            </label>
          </div>
          <div class="choice">
            <label class="label">
              <input type="checkbox">
              <span>计划签收时间</span>
            </label>
          </div>
          <div class="choice">
            <label class="label">
              <input type="checkbox">
              <span>实际签发时间</span>
            </label>
          </div>
          <div class="choice">
            <label class="label">
              <input type="checkbox">
              <span>实际签收时间</span>
            </label>
          </div>
          <div class="choice">
            <label class="label">
              <input type="checkbox">
              <span>计划件数</span>
            </label>
          </div>
        </div>
        <div class="select">
          <div class="choice">
            <label class="label">
              <input type="checkbox">
              <span>签发件数</span>
            </label>
          </div>
          <div class="choice">
            <label class="label">
              <input type="checkbox">
              <span>签收件数</span>
            </label>
          </div>
          <div class="choice">
            <label class="label">
              <input type="checkbox">
              <span>任务完成状态</span>
            </label>
          </div>
          <div class="choice">
            <label class="label">
              <input type="checkbox">
              <span>运单完成状态</span>
            </label>
          </div>
          <div class="choice">
            <label class="label">
              <input type="checkbox">
              <span>异常信息</span>
            </label>
          </div>
        </div>
        <div slot="footer" class="dialog-foot">
          <el-button @click="preview">点击预览</el-button>
          <el-button type="primary">保存</el-button>
          <!-- <el-button @click.native="addFormVisible = false">取消</el-button> -->
        </div>
      </el-dialog>
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
      page: true,
      loading: false,
      cc: [
        120,
        132,
        101,
        134,
        90,
        230,
        210,
        120,
        132,
        101,
        134,
        120,
        132,
        101,
        134,
        90,
        230,
        210,
        120,
        132,
        101,
        134,
        120,
        132,
        101,
        134,
        90,
        230,
        210,
        120
      ],
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
      total: 0,
      pageNo: 1,
      pages: 0,
      pageSize: 10,
      result: {
        resultList: []
      }
    };
  },
  filters: {
    shpStatus: function(value) {
      let result = "";
      switch (value) {
        case '0':
          result = "已派车";
          break;
        case '1':
          result = "在途";
          break;
        case '2':
          result = "已签收";
          break;
        case '-1':
          result = "已取消";
          break;
        case '-2':
          result = "已终止";
          break;
      }
      return result;
    }
  },
  props: ["sdate", "edate"],
  created() {
    //console.log(this.sdate);
    //console.log(this.edate);
    this.init();
  },
  methods: {
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
      let params = {
        startDate: this.sdate,
        endDate: this.edate,
        pageNo: this.pageNo,
        pageSize: this.pageSize
      };
      this.axios
        .post(`${this.api.baseURL}/bi/shipmentPandect`, params)
        .then(res => {
          //console.log(res);
          if (res.data.success) {
            this.result.resultList = res.data.data.result.records;
            this.pages = res.data.data.result.pages;
            this.total = res.data.data.result.total;
          }
        });
    },
    drawPie(id) {
      this.charts = echarts.init(document.getElementById(id));
      this.charts.setOption({
        title: {
          text: "任务单情况",
          // subtext: '虚构数据',
          left: "center"
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        color: ["blue", "skyblue"],
        legend: {
          // orient: 'vertical',
          // top: 'middle',
          bottom: 10,
          left: "center",
          data: ["完成", "未完成"]
        },
        series: [
          {
            type: "pie",
            radius: "65%",
            center: ["50%", "50%"],
            selectedMode: "single",
            data: [
              { value: 520, name: "完成" },
              { value: 520, name: "未完成" }
            ],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      });
    },
    drawPie2(id) {
      this.charts2 = echarts.init(document.getElementById(id));
      this.charts2.setOption({
        title: {
          text: "运单情况",
          // subtext: '虚构数据',
          left: "center"
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        color: ["blue", "skyblue", "orange"],
        legend: {
          // orient: 'vertical',
          // top: 'middle',
          bottom: 10,
          left: "center",
          data: ["签发运单", "异常运单", "签收运单"]
        },
        series: [
          {
            type: "pie",
            radius: "65%",
            center: ["50%", "50%"],
            selectedMode: "single",
            data: [
              { value: 535, name: "签发运单" },
              { value: 420, name: "异常运单" },
              { value: 634, name: "签收运单" }
            ],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      });
    },
    drawPie3(id) {
      this.charts3 = echarts.init(document.getElementById(id));
      this.charts3.setOption({
        title: {
          text: "运单准时情况",
          // subtext: '虚构数据',
          left: "center"
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        color: ["blue", "skyblue"],
        legend: {
          // orient: 'vertical',
          // top: 'middle',
          bottom: 10,
          left: "center",
          data: ["准时完成", "未准时完成"]
        },
        series: [
          {
            type: "pie",
            radius: "65%",
            center: ["50%", "50%"],
            selectedMode: "single",
            data: [
              { value: 634, name: "准时完成" },
              { value: 735, name: "未准时完成" }
            ],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      });
    },
    drawPie4(id) {
      this.charts4 = echarts.init(document.getElementById(id));
      this.charts4.setOption({
        title: {
          text: "任务单/天"
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: ["计划数", "完成数", "未完成数"]
        },
        grid: {
          left: "3%",
          right: "8%",
          bottom: "3%",
          containLabel: true
        },
        // toolbox: {
        //     feature: {
        //         saveAsImage: {}
        //     }
        // },
        xAxis: {
          type: "category",
          boundaryGap: true,
          data: [
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
            "10",
            "11",
            "12",
            "13",
            "14",
            "15",
            "16",
            "17",
            "18",
            "19",
            "20",
            "21",
            "22",
            "23",
            "24",
            "25",
            "26",
            "27",
            "28",
            "29",
            "30"
          ]
        },
        yAxis: {
          type: "value",
          max: 1200,
          min: 0,
          splitNumber: 6
        },
        series: [
          {
            name: "计划数",
            type: "line",
            stack: "总量",
            data: this.cc
          },
          {
            name: "完成数",
            type: "line",
            stack: "总量",
            data: [
              220,
              182,
              191,
              234,
              290,
              330,
              310,
              220,
              182,
              191,
              234,
              290,
              330,
              310,
              220,
              182,
              191,
              234,
              290,
              330,
              310,
              220,
              182,
              191,
              234,
              290,
              330,
              310,
              420,
              360
            ]
          },
          {
            name: "未完成数",
            type: "line",
            stack: "总量",
            data: [
              150,
              232,
              201,
              154,
              190,
              330,
              410,
              200,
              450,
              380,
              150,
              232,
              201,
              154,
              190,
              330,
              410,
              200,
              450,
              380,
              150,
              232,
              201,
              154,
              190,
              330,
              410,
              200,
              380
            ]
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
    handleCurrentChange(val) {
      this.page = val;
      // this.search();
    }
  },
  mounted() {
    this.$nextTick(function() {
      this.drawPie("lastMonth");
    });
    this.$nextTick(function() {
      this.drawPie2("lastMonth2");
    });
    this.$nextTick(function() {
      this.drawPie3("lastMonth3");
    });
    this.$nextTick(function() {
      this.drawPie4("lastMonth4");
    });
  },
  components: {
    educe
  }
};
</script>
<style lang="less" scoped>
.page {
  width: 100%;
  height: 100%;

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

  .echarts {
    width: 100%;

    .e-box {
      margin-top: 20px;
      width: 100%;
      text-align: center;

      .e-single {
        width: 100%;

        .e-mission {
          margin-right: 10px;
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
          width: 27%;
          height: 100%;
        }
      }
    }

    .line-chart {
      width: 100%;

      .l-box {
        position: relative;
        margin-top: 20px;
        width: 100%;
        text-align: center;

        .l-single {
          position: absolute;
          top: 3px;
          right: 135px;

          .l-mission {
            margin-right: 10px;
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

          .l-waybill {
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
