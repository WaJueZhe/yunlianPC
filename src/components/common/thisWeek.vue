<template>
  <div class="page-box">
    <div class="page" v-show="page" v-loading="loading">
      <div class="table">
        <div class="tab-box">
          <ul class="tab-list">
            <li class="tab-item">任务</li>
            <li class="tab-item">运单</li>
            <li class="tab-item">接单数</li>
            <li class="tab-item">完成任务</li>
            <li class="tab-item">未完成任务</li>
            <li class="tab-item">签发运单</li>
            <li class="tab-item">签收运单</li>
            <li class="tab-item">异常运单</li>
            <li class="tab-item">运单准时到达数</li>
          </ul>
        </div>
        <div class="tab-box">
          <ul class="tab-list">
            <li class="tab-item">{{formData.ttlTaskCnt}}</li>
            <li class="tab-item">{{formData.ttlShipmentCnt}}</li>
            <li class="tab-item">{{formData.drvRecvShpCnt}}</li>
            <li class="tab-item">{{formData.completedTaskCnt}}</li>
            <li class="tab-item">{{formData.unCompletedTaskCnt}}</li>
            <li class="tab-item">{{formData.signedShpCnt}}</li>
            <li class="tab-item">{{formData.receivedShpCnt}}</li>
            <li class="tab-item">{{formData.exceptionShpCnt}}</li>
            <li class="tab-item">{{formData.ontimeShpCnt}}</li>
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
          <!-- <div id="thisWeek5" style="width: 100%; height: 480px;"></div> -->
          <ul class="list">
            <li class="item">
              <div id="thisWeek" style="width: 100%;height: 350px;"></div>
            </li>
            <li class="item">
              <div id="thisWeek2" style="width: 100%;height: 350px;"></div>
            </li>
            <li class="item">
              <div id="thisWeek3" style="width: 100%;height: 350px;"></div>
            </li>
          </ul>
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
          <!-- <el-button type="primary" :loading="exporting" style="float: right;margin-right:10px;">导出配置</el-button> -->
          <!-- <div class="data">导出数据</div>
        <div class="export" @click="addFormVisible = true">导出配置</div> -->
        </div>
        <div class="info">
          <el-table :data="result.resultList" style="width:100%" highlight-current-row stripe :border="true">
            <el-table-column prop="taskNo" label="任务单号" align="center"></el-table-column>
            <el-table-column prop="shpNo" label="运单号" align="center"></el-table-column>
            <el-table-column prop="categoryDesc" label="分类" align="center"></el-table-column>
            <el-table-column prop="driverName" label="司机" align="center"></el-table-column>
            <el-table-column prop="vehicleNo" label="车辆" align="center"></el-table-column>
            <el-table-column prop="unloadCompany" label="收货单位" align="center"></el-table-column>
            <el-table-column label="计划/发货/收货件数" align="center">
              <template slot-scope="scope">
                <p>{{scope.row.totalUnits|ifNull}}/{{scope.row.deliverActualUnits|ifNull}}/{{scope.row.unloadActualUnits|ifNull}}</p>
              </template>
            </el-table-column>
            <el-table-column label="计划/实际发货时间" align="center">
              <template slot-scope="scope">
                <p>{{scope.row.deliverPlanDate|ifNull}}/{{scope.row.deliverActualDate|ifNull}}</p>
              </template>
            </el-table-column>
            <el-table-column label="计划/实际到货时间" align="center">
              <template slot-scope="scope">
                <p>{{scope.row.unloadPlanDate|ifNull}}/{{scope.row.unloadActualDate|ifNull}}</p>
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
      actived: "task",
      page: true,
      loading: false,
      currentDepId: this.$store.state.currentDepId,
      lineX: [],
      taskLine: {
        planeCount: [],
        unCompletedCount: [],
        computedCount: [],
        maxY: 0,
        title: "任务单"
      },
      shpLine: {
        planeCount: [],
        unCompletedCount: [],
        computedCount: [],
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
      formData: {
        // ttlTaskCnt: '',
        // ttlShipmentCnt: '',
        // drvRecvShpCnt: '',
        // completedTaskCnt: '',
        // unCompletedTaskCnt: '',
        // signedShpCnt: '',
        // receivedShpCnt: '',
        // exceptionShpCnt: '',
        // ontimeShpCnt: '',
      },
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
        planeCount: [],
        unCompletedCount: [],
        computedCount: [],
        maxY: 0,
        title: "任务单"
      };
      this.shpLine = {
        planeCount: [],
        unCompletedCount: [],
        computedCount: [],
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
        .post(`${this.api.baseURL}/bi/shipmentPandect`, params)
        .then(res => {
          console.log(res);
          if (res.data.success) {
            this.result.resultList = res.data.data.result.records;
            this.pages = res.data.data.result.pages;
            this.total = res.data.data.result.total;

            this.result.countVo = res.data.data.countVo;

            //饼图
            this.taskCount.completed = this.result.countVo[0].completedTaskCnt;
            this.taskCount.uncompleted = this.result.countVo[0].unCompletedTaskCnt;
            this.taskCount.normal =
              this.result.countVo[0].ttlTaskCnt -
              this.result.countVo[0].exceptionTaskCnt;
            this.taskCount.unnormal = this.result.countVo[0].exceptionTaskCnt;
            this.taskCount.ontime = this.result.countVo[0].ontimeTaskCnt;
            this.taskCount.unontime = this.result.countVo[0].unOntimeTaskCnt;

            this.shpCount.completed = this.result.countVo[0].receivedShpCnt;
            this.shpCount.uncompleted =
              this.result.countVo[0].ttlShipmentCnt -
              this.result.countVo[0].receivedShpCnt;
            this.shpCount.normal =
              this.result.countVo[0].ttlShipmentCnt -
              this.result.countVo[0].exceptionShpCnt;
            this.shpCount.unnormal = this.result.countVo[0].exceptionShpCnt;
            this.shpCount.ontime = this.result.countVo[0].ontimeShpCnt;
            this.shpCount.unontime = this.result.countVo[0].unOntimeShpCnt;

            let lineData = res.data.data.dayCountList;
            if (lineData != null) {
              for (var i = 0; i < lineData.length; i++) {
                this.lineX.push(lineData[i].deliverPlanDate);
                //初始化任务单折线图数据
                this.taskLine.computedCount.push(lineData[i].completedTaskCnt);
                this.taskLine.unCompletedCount.push(
                  lineData[i].ttlTaskCnt - lineData[i].completedTaskCnt
                );
                this.taskLine.planeCount.push(lineData[i].ttlTaskCnt);
                if (i == 0) {
                  this.taskLine.maxY = lineData[i].ttlTaskCnt;
                } else {
                  if (this.taskLine.maxY < lineData[i].ttlTaskCnt) {
                    this.taskLine.maxY = lineData[i].ttlTaskCnt;
                  }
                }
                this.taskLine.maxY = Math.ceil(this.taskLine.maxY / 6) * 6;

                //初始化运单折线图数据
                this.shpLine.computedCount.push(lineData[i].receivedShpCnt);
                this.shpLine.unCompletedCount.push(
                  lineData[i].ttlShipmentCnt - lineData[i].receivedShpCnt
                );
                this.shpLine.planeCount.push(lineData[i].ttlShipmentCnt);
                if (i == 0) {
                  this.shpLine.maxY = lineData[i].ttlShipmentCnt;
                } else {
                  if (this.shpLine.maxY < lineData[i].ttlShipmentCnt) {
                    this.shpLine.maxY = lineData[i].ttlShipmentCnt;
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
        planeCount: [],
        unCompletedCount: [],
        computedCount: [],
        maxY: 0,
        title: "任务单"
      };
      this.shpLine = {
        planeCount: [],
        unCompletedCount: [],
        computedCount: [],
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
        .post(`${this.api.baseURL}/bi/shipmentPandect`, params)
        .then(res => {
          if (res.data.success) {
            this.result.resultList = res.data.data.result.records;
            this.pages = res.data.data.result.pages;
            this.total = res.data.data.result.total;

            this.result.countVo = res.data.data.countVo;
            this.formData = res.data.data.countVo[0];
            //饼图
            this.taskCount.completed = this.result.countVo[0].completedTaskCnt;
            this.taskCount.uncompleted = this.result.countVo[0].unCompletedTaskCnt;
            this.taskCount.normal =
              this.result.countVo[0].ttlTaskCnt -
              this.result.countVo[0].exceptionTaskCnt;
            this.taskCount.unnormal = this.result.countVo[0].exceptionTaskCnt;
            this.taskCount.ontime = this.result.countVo[0].ontimeTaskCnt;
            this.taskCount.unontime = this.result.countVo[0].unOntimeTaskCnt;

            this.shpCount.completed = this.result.countVo[0].receivedShpCnt;
            this.shpCount.uncompleted =
              this.result.countVo[0].ttlShipmentCnt -
              this.result.countVo[0].receivedShpCnt;
            this.shpCount.normal =
              this.result.countVo[0].ttlShipmentCnt -
              this.result.countVo[0].exceptionShpCnt;
            this.shpCount.unnormal = this.result.countVo[0].exceptionShpCnt;
            this.shpCount.ontime = this.result.countVo[0].ontimeShpCnt;
            this.shpCount.unontime = this.result.countVo[0].unOntimeShpCnt;

            let lineData = res.data.data.dayCountList;

            if (lineData != null) {
              for (var i = 0; i < lineData.length; i++) {
                this.lineX.push(lineData[i].deliverPlanDate);
                //初始化任务单折线图数据
                this.taskLine.computedCount.push(lineData[i].completedTaskCnt);
                this.taskLine.unCompletedCount.push(
                  lineData[i].ttlTaskCnt - lineData[i].completedTaskCnt
                );
                this.taskLine.planeCount.push(lineData[i].ttlTaskCnt);
                if (i == 0) {
                  this.taskLine.maxY = lineData[i].ttlTaskCnt;
                } else {
                  if (this.taskLine.maxY < lineData[i].ttlTaskCnt) {
                    this.taskLine.maxY = lineData[i].ttlTaskCnt;
                  }
                }
                this.taskLine.maxY = Math.ceil(this.taskLine.maxY / 6) * 6;

                //初始化运单折线图数据
                this.shpLine.computedCount.push(lineData[i].receivedShpCnt);
                this.shpLine.unCompletedCount.push(
                  lineData[i].ttlShipmentCnt - lineData[i].receivedShpCnt
                );
                this.shpLine.planeCount.push(lineData[i].ttlShipmentCnt);
                if (i == 0) {
                  this.shpLine.maxY = lineData[i].ttlShipmentCnt;
                } else {
                  if (this.shpLine.maxY < lineData[i].ttlShipmentCnt) {
                    this.shpLine.maxY = lineData[i].ttlShipmentCnt;
                  }
                }
                this.shpLine.maxY = Math.ceil(this.shpLine.maxY / 6) * 6;
              }
              this.showLine = this.taskLine;
              this.showCount = this.taskCount;
              this.drowAllPie();
            }
            this.loading = false;
          }
        });
    },
    drowAllPie() {
      this.$nextTick(function() {
        this.drawPie("thisWeek");
      });
      this.$nextTick(function() {
        this.drawPie2("thisWeek2");
      });
      this.$nextTick(function() {
        this.drawPie3("thisWeek3");
      });
      this.$nextTick(function() {
        this.drawPie4("thisWeek4");
      });
      this.$nextTick(function() {
        this.drawPie5("thisWeek5");
      });
    },
    drawPie(id) {
      this.charts = echarts.init(document.getElementById(id));
      this.charts.setOption({
        title: {
          text: this.showLine.title + "完成情况",
          // subtext: '虚构数据',
          left: "center"
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        color: ["#5b9bd5", "#ed7d31"],
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
            radius: "55%",
            center: ["50%", "50%"],
            label: {
              normal: {
                show: true,
                formatter: "{b}: {c}\n({d}%)"
              }
            },
            selectedMode: "single",
            data: [
              { value: this.showCount.completed, name: "完成" },
              { value: this.showCount.uncompleted, name: "未完成" }
            ],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              },
              normal: {
                borderWidth: 2,
                borderColor: "#fff"
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
          text: this.showLine.title + "异常情况",
          // subtext: '虚构数据',
          left: "center"
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        color: ["#5b9bd5", "#ed7d31"],
        legend: {
          // orient: 'vertical',
          // top: 'middle',
          bottom: 10,
          left: "center",
          data: ["正常", "异常"]
        },
        series: [
          {
            type: "pie",
            radius: "55%",
            center: ["50%", "50%"],
            selectedMode: "single",
            label: {
              normal: {
                show: true,
                formatter: "{b}: {c}\n({d}%)"
              }
            },
            data: [
              { value: this.showCount.normal, name: "正常" },
              { value: this.showCount.unnormal, name: "异常" }
            ],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              },
              normal: {
                borderWidth: 2,
                borderColor: "#fff"
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
          text: this.showLine.title + "准时情况",
          left: "center"
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        color: ["#5b9bd5", "#ed7d31"],
        legend: {
          bottom: 10,
          left: "center",
          data: ["正常", "延误"]
        },
        series: [
          {
            type: "pie",
            radius: "55%",
            center: ["50%", "50%"],
            selectedMode: "single",
            label: {
              normal: {
                show: true,
                formatter: "{b}: {c}\n({d}%)"
              }
            },
            data: [
              { value: this.showCount.ontime, name: "正常" },
              { value: this.showCount.unontime, name: "延误" }
            ],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              },
              normal: {
                borderWidth: 2,
                borderColor: "#fff"
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
          text: this.showLine.title + "/数量"
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: ["计划数", "完成数", "未完成数"]
        },
        grid: {
          top: "10%",
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
            data: this.showLine.planeCount,
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
            name: "完成数",
            type: "line",
            data: this.showLine.computedCount,
            itemStyle: {
              /*设置折线颜色*/
              normal: {
                color: "#5b9bd5"
              }
            }
          }
          // {
          //   name: "未完成数",
          //   type: "line",
          //   data: this.showLine.unCompletedCount,
          //   itemStyle : {  /*设置折线颜色*/
          //           normal : {
          //              color: "#ed7d31",
          //           }
          //       },
          // },
        ]
      });
    },
    drawPie5(id) {
      this.charts5 = echarts.init(document.getElementById(id));
      this.charts5.setOption({
        title: {
          text: this.showLine.title + "/数量"
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: ["货损", "货差", "其他"]
        },
        grid: {
          top: "10%",
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
            name: "货损",
            type: "bar",
            data: this.showLine.planeCount,
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
            name: "货差",
            type: "line",
            data: this.showLine.computedCount,
            itemStyle: {
              /*设置折线颜色*/
              normal: {
                color: "#5b9bd5"
              }
            }
          },
          // {
          //   name: "其他",
          //   type: "line",
          //   data: this.showLine.unCompletedCount,
          //   itemStyle : {  /*设置折线颜色*/
          //           normal : {
          //              color: "#ed7d31",
          //           }
          //       },
          // },
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
        this.showCount = this.taskCount;
        this.drowAllPie();
      }
      if (msg == "task1") {
        this.showLine = this.shpLine;
        this.showCount = this.shpCount;
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
          width: 11.1111%;
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

