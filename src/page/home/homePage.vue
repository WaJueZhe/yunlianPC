<template>
  <div class="content">
    <!-- 运单数量展示 -->
    <div class="card">
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="box box1" @click="gotoTaskView(1)">
            <h4>昨日任务总数</h4>
            <div class="num">{{count.ycount}}</div>
            <div class="boxphoto"><img src="../../assets/img/box1.png"></div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="box box2" @click="gotoTaskView(2)">
            <h4>今日任务总数</h4>
            <div class="num">{{count.tcount}}</div>
            <div class="boxphoto"><img src="../../assets/img/box2.png"></div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="box box3" @click="gotoTaskView(3)">
            <h4>今日异常任务</h4>
            <div class="num">{{count.tycount}}</div>
            <div class="boxphoto"><img src="../../assets/img/box3.png"></div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="box box4" @click="gotoTaskView(4)">
            <h4>昨日异常任务</h4>
            <div class="num">{{count.yycount}}</div>
            <div class="boxphoto"><img src="../../assets/img/box4.png"></div>
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- 在途运单 -->
    <div class="passage">
      <h4>在途任务</h4>
      <el-collapse class="faceplate">
        <el-collapse-item v-for="(item,indexNo) in onWayList" :key="indexNo" class="concer">
          <!-- 面板标题栏 -->
          <template slot="title">
            <el-row style="white-space: nowrap;">
              <el-col :span="3" class="bod">司机：{{item.driverName}}</el-col>
              <el-col :span="3" class="bod">电话：{{item.driverMobile}}</el-col>
              <el-col :span="3" class="bod">车牌号：{{item.vehicleNo}}</el-col>
              <el-col :span="6" class="bod bod2">任务单：{{item.taskNo}}
                <span v-show="item.referId" class="smallFont">[{{item.referId}}]</span>
              </el-col>
              <el-col :span="1" class="bod1">
                <span>在途</span>
              </el-col>
            </el-row>
          </template>
          <!-- 货物运输状态 -->
          <div class="main">
            <div class="cat">
              <!-- <img src="static/pc-CAT.jpg" alt=""> -->
            </div>

            <span v-for="(stp,sNo) in item.bsTaskStopList" :key="sNo">
              <!-- 未到提货点 -->
              <div v-if="stp.stopType=='D'&&(stp.actualDate==null||stp.actualDate=='')" class="pick1">
                <div class="tail">
                  <span class="qian">提</span>
                  <span class="hou" v-if="sNo!=item.bsTaskStopList.length-1"></span>
                </div>
                <div class="concre">
                  <p>
                    <strong>{{stp.cityName}}-{{stp.districtName}}</strong>
                  </p>
                  <p>联系人：{{stp.contactPerson}}</p>
                  <p>联系电话：{{stp.contactMobile}}</p>
                  <p>签发时间：{{stp.signTime}}</p>
                  <p>计划出发：{{stp.planDate}}</p>
                  <p>实际出发：{{stp.actualDate}}</p>
                  <ul>
                    <li>{{ForDight1(stp.totalUnits,2)}}{{stp.unitUnit}}</li>
                    <li>{{ForDight1(stp.totalVolume,2)}}{{stp.volumeUnit}}</li>
                    <li>{{ForDight1(stp.totalWeight,2)}}{{stp.weightUnit}}</li>
                  </ul>
                </div>
              </div>
              <!-- 已到提货点 -->
              <div v-if="stp.stopType=='D'&&(stp.actualDate!=null&&stp.actualDate!='')" class="pick">
                <div class="tail">
                  <span class="qian">提</span>
                  <span class="hou" v-if="sNo!=item.bsTaskStopList.length-1"></span>
                </div>
                <div class="concre">
                  <p>
                    <strong>{{stp.cityName}}-{{stp.districtName}}</strong>
                  </p>
                  <p>联系人：{{stp.contactPerson}}</p>
                  <p>联系电话：{{stp.contactMobile}}</p>
                  <p>签发时间：{{stp.signTime}}</p>
                  <p>计划出发：{{stp.planDate}}</p>
                  <p>实际出发：{{stp.actualDate}}</p>
                  <ul>
                    <li>{{ForDight1(stp.totalUnits,2)}}{{stp.unitUnit}}</li>
                    <li>{{ForDight1(stp.totalVolume,2)}}{{stp.volumeUnit}}</li>
                    <li>{{ForDight1(stp.totalWeight,2)}}{{stp.weightUnit}}</li>
                  </ul>
                </div>
              </div>
              <!-- 未到卸货点 -->
              <div v-if="stp.stopType=='U'&&(stp.signTime==null||stp.signTime=='')" class="bulk1">
                <div class="tail">
                  <span class="qian">卸</span>
                  <span class="hou" v-if="sNo!=item.bsTaskStopList.length-1"></span>
                </div>
                <div class="concre">
                  <p>
                    <strong>{{stp.cityName}}-{{stp.districtName}}</strong>
                  </p>
                  <p>联系人：{{stp.contactPerson}}</p>
                  <p>联系电话：{{stp.contactMobile}}</p>
                  <p>计划到达：{{stp.planDate}}</p>
                  <p>实际到达：{{stp.actualDate}}</p>
                  <p>签收时间：{{stp.signTime}}</p>
                  <ul>
                    <li>{{ForDight1(stp.totalUnits,2)}}{{stp.unitUnit}}</li>
                    <li>{{ForDight1(stp.totalVolume,2)}}{{stp.volumeUnit}}</li>
                    <li>{{ForDight1(stp.totalWeight,2)}}{{stp.weightUnit}}</li>
                  </ul>
                </div>
              </div>
              <!-- 已到卸货点 -->
              <div v-if="stp.stopType=='U'&&(stp.signTime!=null&&stp.signTime!='')" class="pick2">
                <div class="tail">
                  <span class="qian">卸</span>
                  <span class="hou" v-if="sNo!=item.bsTaskStopList.length-1"></span>
                </div>
                <div class="concre">
                  <p>
                    <strong>{{stp.cityName}}-{{stp.districtName}}</strong>
                  </p>
                  <p>联系人：{{stp.contactPerson}}</p>
                  <p>联系电话：{{stp.contactMobile}}</p>
                  <p>计划到达：{{stp.planDate}}</p>
                  <p>实际到达：{{stp.actualDate}}</p>
                  <p>签收时间：{{stp.signTime}}</p>
                  <ul>
                    <li>{{ForDight1(stp.totalUnits,2)}}{{stp.unitUnit}}</li>
                    <li>{{ForDight1(stp.totalVolume,2)}}{{stp.volumeUnit}}</li>
                    <li>{{ForDight1(stp.totalWeight,2)}}{{stp.weightUnit}}</li>
                  </ul>
                </div>
              </div>
            </span>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
    <!-- 统计图表 -->
    <!-- <div class="echarts">
          <app-chart></app-chart>
      </div> -->
  </div>
</template>

<script>
import Echarts from "../../components/home/echart.vue";
import localStorage from "../../js/localstorage.js";
import { getPermitsByType }  from "../../js/CookiePermitsMap.js";
import moment from "moment";
let Base64 = require("js-base64").Base64;
export default {
  data() {
    return {
      showSelectDepBox: false,
      currentDepId: localStorage.get("currentDepId"),
      radio: "0",
      activeNames: "",
      count: {
        ycount: 0,
        tcount: 0,
        tycount: 0,
        yycount: 0
      },
      onWayList: []
    };
  },
  computed: {
    getCurrentDepId() {
      return this.$store.state.currentDepId;
    }
  },
  watch: {
    getCurrentDepId(val) {
      console.log(val);
      if (val != null && val != "") {
        this.init();
      }
    }
  },
  methods: {
    // 切换折叠图触发事件
    handleChange() {
      //console.log(1);
    },
    ForDight1(Dight, How) {
      Dight = (Dight * Math.pow(10, How) / Math.pow(10, How)).toFixed(How);
      return Dight;
    },
    init() {
      // let param = new URLSearchParams();
      this.axios.post(`${this.api.baseURL}/webpage/home`).then(res => {
        //console.log(res);
        if (res.data.success) {
          console.log(res);
          if (res.data.data.count) {
            this.count.ycount = res.data.data.count.ycount;
            this.count.tcount = res.data.data.count.tcount;
            this.count.yycount = res.data.data.count.yycount;
            this.count.tycount = res.data.data.count.tycount;
          } else {
            this.count = {
              ycount: 0,
              tcount: 0,
              tycount: 0,
              yycount: 0
            };
          }
          this.onWayList = res.data.data.onWayTasks;
        } else {
          this.$message("保存失败");
        }
      });
    },
    gotoTaskView(typ) {
      if (!getPermitsByType('userAllMenuCodes').contain('m005')){ //判断是否具有运单管理权限
        return false;
      }

      let para = "";
      let today = moment().format("YYYY-MM-DD");
      let yesterday = moment()
        .add(-1, "days")
        .format("YYYY-MM-DD");
      switch (typ) {
        case 1:
          para =
            '{"createDateRange":["' + yesterday + '", "' + yesterday + '"]}';
          break;
        case 2:
          para = '{"createDateRange":["' + today + '", "' + today + '"]}';
          break;
        case 3:
          para =
            '{"exceptionStatus": "-1", "createDateRange":["' +
            today +
            '", "' +
            today +
            '"]}';
          break;
        case 4:
          para =
            '{"exceptionStatus": "-1", "createDateRange":["' +
            yesterday +
            '", "' +
            yesterday +
            '"]}';
          break;
        default:
          para = "null";
          break;
      }
      this.$router.push("/task/" + Base64.encode(para));
    }
  },
  created() {
    //console.log("部门ID:" + this.currentDepId);
    this.init();
  },
  components: {
    "app-chart": Echarts
  },
  mounted() {
    // var input = document.getElementsByClassName('el-radio__inner');
    // var tite = document.getElementsByClassName('el-radio__label');
    // var lab = document.getElementsByClassName('el-radio');
    // var ddd = document.getElementsByClassName('el-radio__input');
    // for(var i=0; i < input.length; i++){
    //   input[i].style.width = 18 + 'px';
    //   input[i].style.height = 18 + 'px';
    // }
    // for(var i=0; i < tite.length; i++){
    //   tite[i].style.fontSize = 16 + 'px';
    //   tite[i].style.marginLeft = 10 + 'px';
    //   tite[i].style.float = 'left';
    // }
    // for(var i=0; i < lab.length; i++){
    //   lab[i].style.minWidth = 130 + 'px';
    // }
    // for(var i=0; i < ddd.length; i++){
    //   ddd[i].style.float = 'left';
    // }
  }
  // beforeRouteEnter(to, from, next) {
  //   next(function(vm) {

  //   });
  // },
};
</script>

<style lang="less" scoped>
@bgCol: #eaedf1; //主页面背景色
@cardCol: #fff; //卡片视图背景色
@tilCol: #ededed; //折叠面板背景色
.content {
  width: 100%;
  padding: 10px 45px;
  background-color: @bgCol;
  box-sizing: border-box;
  //   运单数量展示
  .box {
    position: relative;
    height: 200px;
    border: 1px solid #e9e9e9;
    box-sizing: border-box;
    text-align: center;
    cursor: pointer;
    //background-color: @cardCol;
    padding: 10px;
    border-radius: 15px;
    h4 {
      float: left;
      font-weight: normal;
      padding-left: 4px;
      line-height: 20px;
      border-left: 8px solid #fff;
      color: #fff;
    }
    .num {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translateX(-50%) translateY(-50%);
      font-size: 60px;
      color: #fff;
    }

    .boxphoto {
      position: absolute;
      bottom: 20px;
      right: 20px;
    }

    &:hover .num {
      color: #e6a23c;
    }
  }
  //   在途运单展示
  .passage {
    margin-top: 60px;
    .smallFont {
      color: #e6a23c;
      font-size: 9pt;
    }

    h4 {
      font-weight: bold;
      padding-left: 10px;
      border-left: 8px solid #409eff;
      line-height: 20px;
      margin-bottom: 20px;
    }
    .faceplate {
      border: 1px solid #dcdcdc;
      .concer {
        border-bottom: 1px solid #cccccc;
        //   顶部标题栏自定义
        .bod {
          text-align: center;
          position: relative;
        }
        .bod2 {
          text-align: left;
          padding-left: 5px;
        }
        .bod::before {
          content: "";
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          right: 0;
          width: 1px;
          height: 20px;
          background-color: #c5b4b4;
        }
        .bod2::before {
          display: none;
        }
        .bod1 {
          text-align: right;
          margin-left: 2%;
          color: #409eff;
          width: none;
          float: right;
        }
        //物流信息展示
        .main {
          width: 100%;
          height: 250px;
          padding: 0 30px;
          overflow: hidden;
          box-sizing: border-box;
          white-space: nowrap;
          overflow-x: auto;
          div {
            width: 20%;
          }

          //汽车
          .cat {
            width: 100%;
            height: 80px;
            box-sizing: border-box;
            padding-top: 50px;
            padding-left: 2.5%;
            img {
              width: 4%;
              height: auto;
            }
          }
          //  提货1  灰-灰
          .pick {
            display: inline-block;
            .tail {
              .qian {
                display: inline-block;
                width: 28px;
                height: 28px;
                border-radius: 50%;
                background-color: #999999;
                text-align: center;
                line-height: 28px;
                color: #fff;
              }
              .hou {
                display: inline-block;
                margin-left: 10%;
                width: 400%;
                height: 10px;
                background-color: #999999;
              }
            }
          }

          //   卸货1  灰-绿
          .bulk {
            display: inline-block;
            .qian {
              display: inline-block;
              width: 28px;
              height: 28px;
              border-radius: 50%;
              background-color: #999999;
              text-align: center;
              line-height: 28px;
              color: #fff;
            }
            .hou {
              display: inline-block;
              width: 400%;
              height: 10px;
              margin-left: 10%;
              background-color: #23ac38;
            }
          }

          // 提货2  蓝-绿
          .pick1 {
            display: inline-block;
            .tail {
              .qian {
                display: inline-block;
                width: 28px;
                height: 28px;
                border-radius: 50%;
                background-color: #4d84ff;
                text-align: center;
                line-height: 28px;
                color: #fff;
              }
              .hou {
                display: inline-block;
                margin-left: 10%;
                width: 400%;
                height: 10px;
                background-color: #23ac38;
              }
            }
          }

          //卸货2  黄-绿
          .bulk1 {
            display: inline-block;
            .qian {
              display: inline-block;
              width: 28px;
              height: 28px;
              border-radius: 50%;
              background-color: #f68622;
              text-align: center;
              line-height: 28px;
              color: #fff;
            }
            .hou {
              display: inline-block;
              width: 400%;
              height: 10px;
              margin-left: 10%;
              background-color: #23ac38;
            }
          }

          //提货3
          .pick2 {
            //灰-灰
            display: inline-block;
            .tail {
              .qian {
                display: inline-block;
                width: 28px;
                height: 28px;
                border-radius: 50%;
                background-color: #999999;
                text-align: center;
                line-height: 28px;
                color: #fff;
              }
              .hou {
                display: inline-block;
                margin-left: 10%;
                width: 400%;
                height: 10px;
                background-color: #999999;
              }
            }
          }
          //卸货3
          .bulk2 {
            // 黄-灰
            display: inline-block;
            .qian {
              display: inline-block;
              width: 28px;
              height: 28px;
              border-radius: 50%;
              background-color: #f68622;
              text-align: center;
              line-height: 28px;
              color: #fff;
            }
            .hou {
              display: inline-block;
              width: 400%;
              height: 10px;
              margin-left: 10%;
              // background-color: #23ac38;
            }
          }

          .concre {
            display: inline-block;
            width: 100%;
            color: #383838;

            p:first-child {
              margin-top: 10px;
              margin-top: 8px;
              width: 100%;
              text-overflow: ellipsis;
              overflow: hidden;
            }

            ul li {
              margin-top: 10px;
              display: inline-block;
              border: 1px solid #cccccc;
              border-radius: 6px;
              padding: 2px 6px;
            }
          }
        }
      }
    }
  }
  //统计图表展示
  .echarts {
    width: 100%;
    height: 600px;
    margin-top: 40px;
    margin-bottom: 150px;
    background-color: #ffffff;
    box-shadow: 1px 1px 1px #cccccc;
    box-sizing: border-box;
  }
  .box1 {
    background: rgb(138, 148, 173);
  }
  .box2 {
    background: rgb(70, 154, 214);
  }
  .box3 {
    background: rgb(43, 192, 162);
  }
  .box4 {
    background: rgb(226, 124, 120);
  }

  .info {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.3);

    .info-box {
      padding-bottom: 50px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 23%;
      background-color: #fff;
      border: 3px solid #ccc;
      z-index: 222;

      .info-title {
        padding-left: 20px;
        height: 40px;
        line-height: 40px;
        font-size: 18px;
        font-weight: bold;
        background-color: #eee;
      }

      .info-cent {
        padding: 30px;

        .info-item {
          margin-bottom: 10px;
          text-align: center;
        }
      }

      .goin {
        margin: auto;
        width: 50%;
        height: 40px;
        line-height: 40px;
        text-align: center;
        font-size: 16px;
        border-radius: 10px;
        background-color: #eee;
        cursor: pointer;
      }
    }
  }

  .switchover {
    padding: 0 10px;
    position: absolute;
    top: 60px;
    right: 20px;
    width: 300px;
    background-color: #fff;

    .switchover-top {
      padding-left: 30px;
      height: 30px;
      line-height: 30px;
      font-size: 12px;
      border-bottom: 1px solid #eee;
    }

    .switchover-cent {
      padding: 20px 0;

      .switchover-item {
        padding: 0 30px;
        margin-bottom: 10px;
        border-bottom: 1px solid #eee;
      }
    }
  }
}
</style>


