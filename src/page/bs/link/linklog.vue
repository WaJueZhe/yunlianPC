<template>
    <el-row class="warp" style="width:100%;">
        <el-col :span="24" class="warp-breadcrum" style="padding:10px;">
            <app-title :title="linkTitle"></app-title>
        </el-col>
                
        <el-col :span="24" class="warp-main" v-loading="loading" element-loading-text="拼命加载中">
            <!--工具条-->
            <el-col :span="24" style="padding-bottom: 0px;">
                <el-form :inline="true" :model="filters" style="padding-left:5px;">
                    <el-form-item>
                        <el-select v-model="filters.searchType" placeholder="数据类型" style="width: 120px;">
                            <el-option v-for="i in searchTypeEnum" :key="i.val" :label="i.lbl" :value="i.val"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-select v-model="filters.dataStatus" placeholder="上链状态" style="width: 120px;">
                            <el-option v-for="i in dataStatusEnum" :key="i.val" :label="i.lbl" :value="i.val"></el-option>
                        </el-select>
                    </el-form-item>  
                        <el-form-item>
                            <el-date-picker v-model="filters.sendBcTime_begin" type="date" align="right" style="width:150px"
                                placeholder="发送日期 从" :picker-options="pickerOptions1">
                            </el-date-picker>
                            <el-date-picker v-model="filters.sendBcTime_end" type="date" align="right" style="width:150px"
                                placeholder="发送日期 到" :picker-options="pickerOptions1">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item>
                            <el-input v-model="filters.bcContent" placeholder="内容" style="width:150px">
                            </el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-input v-model="filters.bcRtnTHash" placeholder="返回hash" style="width:150px">
                            </el-input>
                        </el-form-item> 
                    <el-form-item><el-button type="primary" @click="handleSearch" @keyup.13="alert">查询</el-button></el-form-item> 
                    <!-- <el-form-item><el-button type="primary" @click="handleReUploadSelect(bcBaseList)">重传当前选择数据</el-button></el-form-item>
                    <el-form-item><el-button type="primary" @click="handleReUploadQuery">重传当前查询数据</el-button></el-form-item> -->
                </el-form>

                <!--列表 @select-all="selectionAllChange" @select="select" @selection-change="selectionChange" -->
                <el-table :data="bcBaseList" highlight-current-row v-loading="loading" @selection-change="selectionChange" style="width:100%;" stripe :border="true">

                    <el-table-column type="selection" prop="id"></el-table-column>

                    <el-table-column type="index" width="50" align="center" label="序号"></el-table-column>
                    <el-table-column prop="searchType" label="数据类型" align="center" width="80"></el-table-column>
                    <el-table-column prop="bcInfoKey" label="key" align="center">
                        <template slot-scope="scope">
                            <p @click="showDetail(scope.row)" style="cursor:pointer;color:#409eff">{{scope.row.bcInfoKey}}</p>
                        </template>
                    </el-table-column>
                    <el-table-column prop="dataStatus" label="上链状态" width="80" :formatter="formatDataStatus" align="center" ></el-table-column>
                    <el-table-column prop="bcInfoVersion" label="数据版本号" width="100" align="center"></el-table-column>
                    <el-table-column prop="bcContent" label="内容" align="center" :show-overflow-tooltip="true"></el-table-column>
                    <!-- <el-table-column prop="id" label="id" min-width="10%"  align="center"></el-table-column> -->
                    <el-table-column prop="sendBcTime" label="发送区块链时间" align="center" min-width="100"></el-table-column>
                    <el-table-column prop="responseBcTime" label="区块链返回时间" align="center" min-width="100"></el-table-column>
                    <el-table-column prop="bcRtnTHash" label="返回Hash" align="center"></el-table-column>
                    <el-table-column prop="bcRtnBHeight" label="Hash height" align="center" width="120"></el-table-column>
                     <el-table-column prop="bcRtnRetmsg" label="bcRtnRetmsg" v-if="false"></el-table-column>

                    <!-- <el-table-column label="操作" min-width="10%"  align="center">
                    <template slot-scope="scope" >
                        <el-button v-show="scope.row.status == '0'" icon="el-icon-delete" type="warning" @click="cancelTask(scope.$index,scope.row)" size="small">删除</el-button>
                        <el-button v-show="scope.row.status != '0'" icon="el-icon-location-outline" @click="showGps(scope.$index,scope.row)" size="small">轨迹</el-button>
                    </template>
                    </el-table-column> -->
                </el-table>
            </el-col>

            <!---->
            <el-col :span="24" class="toolbar">
                <!-- <el-button type="danger" @click="batchDeleteBook" :disabled="this.sels.length===0">批量删除</el-button> -->
                <el-pagination layout="total, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-size="limit" 
                            :total="total" background 
                            style="float:right;">
                </el-pagination>
            </el-col>
 

            <!-- 运单详情弹出框     -->
            <el-dialog :title="'区块详情：'" :visible.sync ="detailViewVisible" :close-on-click-modal="false">
                   <el-form :model="detailView" ref="detailView"> 
                        <!-- <template slot="title"><i class="header-icon el-icon-document"></i> <b>详细信息</b></template> -->
                        <el-row>
                            <el-col style="font-size:18px;background:#ededed;">key</el-col>
                            <el-col style="color:#999">{{detailView.bcInfoKey}}</el-col>
                            <el-col style="font-size:16px;background:#ededed;">区块链版本</el-col>
                            <el-col style="color:#999">{{detailView.bcVersion || '未知'}}&nbsp;</el-col>                                
                            <el-col style="font-size:16px;background:#ededed;">内容</el-col>
                            <el-col style="color:#999;word-break:break-all">{{detailView.bcContent}}&nbsp;</el-col>
                        </el-row>
                        <el-row>
                            <el-col style="font-size:16px;background:#ededed;">发送区块链时间</el-col>
                            <el-col style="color:#999">{{detailView.sendBcTime}}</el-col>
                            <el-col style="font-size:16px;background:#ededed;">区块链返回时间</el-col>
                            <el-col style="color:#999">{{detailView.responseBcTime}}</el-col>                                
                            <el-col style="font-size:16px;background:#ededed;">返回Hash</el-col>
                            <el-col style="color:#999">{{detailView.bcRtnTHash}}</el-col>                                
                        </el-row>                            
                        <el-row>
                            <el-col style="font-size:16px;background:#ededed;">区块高度</el-col>
                            <el-col style="color:#999">{{detailView.bcRtnBHeight}}</el-col>
                            <el-col style="font-size:16px;background:#ededed;">返回信息</el-col>
                            <el-col style="color:#999">{{detailView.bcRtnRetmsg}}</el-col> 
                            <el-col :span="1"></el-col>
                            <el-col :span="7"></el-col>                                
                        </el-row> 
                    </el-form>    
            </el-dialog>   

        </el-col>
    </el-row>
</template>

<script>
import { getCookie } from "../../../js/cookie.js"; 
let set = new Set("123");
export default {
  data() {
    return {
      ids:[],
      copyChooseTchIds:[],
      bcBaseList: null,
      linkTitle: "上链管理",
      loading: false,
      searchTypeEnum: [
        { val: "t_bc_shipment", lbl: "运单" },
        { val: "t_bc_shipment_actual", lbl: "运单实绩" },
        { val: "t_bc_shipment_event", lbl: "运单事件" },
        { val: "t_bc_task", lbl: "任务" },
        { val: "t_bc_task_status", lbl: "任务状态" },
        { val: "t_bc_task_evaluate", lbl: "任务评价" },
        { val: "t_bc_driver", lbl: "司机" },
        { val: "t_bc_vehicle", lbl: "车辆" },
        { val: "t_bc_gps_all_data", lbl: "车辆定位" },
        { val: "t_bc_user", lbl: "用户" },
        { val: "t_bc_customerorg", lbl: "客户" }
      ],
      dataStatusEnum: [
        { val: "", lbl: "全部" },
        { val: "0", lbl: "待上传" },
        { val: "9", lbl: "上链中" },
        { val: "1", lbl: "上链成功" },
        { val: "-1", lbl: "上链失败" }
      ],
      isFullScreen: false,
      filters: {
        searchType: "",
        dataStatus: "",
        sendBcTime_begin: "",
        sendBcTime_end: "",
        bcContent: ""
      },
      total: 0,
      page: 1,
      limit: 10,
      pickerOptions1: {
        // disabledDate(time) {
        //   return time.getTime() > Date.now();
        // },
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            }
          },
          {
            text: "昨天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", date);
            }
          },
          {
            text: "一周前",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            }
          }
        ]
      },
      detailViewVisible: false,
      detailView: {
        id: "",
        searchType: "",
        dataStatus: "",
        bcVersion: "",
        bcSignType: "",
        bcMchId: "",
        bcMchSign: "",
        bcNodeId: "",
        bcChainId: "",
        bcLedgerId: "",
        bcInfoKey: "",
        bcInfoVersion: "",
        bcState: "",
        bcContent: "",
        bcNotes: "",
        bcCommitTime: "",
        bcAccount: "",
        bcPublicKey: "",
        bcSign: "",
        bcRtnVersion: "",
        bcRtnSignType: "",
        bcRtnMchId: "",
        bcRtnMchSign: "",
        bcRtnRetcode: "",
        bcRtnRetmsg: "",
        bcRtnTHash: "",
        bcRtnBHeight: "",
        bcRtnBPrevHash: "",
        bcRtnBHash: "",
        bcRtnBTime: "",
        sendBcTime: "",
        responseBcTime: ""

        // id: "",
        // bcInfoKey: "",
        // dataStatus:"",
        // bcVersion: "",
        // bcContent: "",
        // sendBcTime: "",
        // responseBcTime: "",
        // bcRtnTHash: "",
        // bcRtnBHeight: ""
      }
    };
  },
  methods: {
    getStatusDesc: function(statCode) {
      let ret = "";
      switch (statCode) {
        case 0:
          ret = "待上传";
          break;
        case 1:
          ret = "已上链";
          break;
        case 9:
          ret = "上链中";
          break;
        case -1:
          ret = "上链失败";
          break;
        default:
          break;
      }
      return ret;
    },
    formatDataStatus: function(row, column) {
        console.log("row.dataStatus = " + row.dataStatus)
      return this.getStatusDesc(row.dataStatus);
    },
    gpsScreenSizeChange(screenSize) {
      if (screenSize && screenSize == "full") {
        this.isFullScreen = true;
      } else {
        this.isFullScreen = false;
      }
    },
    select(selection, row){
      console.log("======== select aaaaa =======")
      console.log(selection)
      console.log(row)
      console.log("======== select end =======")
    },
    selectionAllChange(selection){
      console.log("======== selectionAllChange bbbbb =======")
      console.log(selection)
      console.log("======== selectionAllChange end =======")
    },
    selectionChange(selection){
      console.log("======== selectionChange ccccc =======")
      set.add("a")
      console.log(set)
      set.forEach(s => {
            console.log("每一行Id:"+s)
          });

      // console.log("selection.length = "+selection.length) 
      // console.log(selection) 
      // let ids = new Array();
      // selection.forEach(item => {
      //       console.log("每一行Id:"+item.id)
      //       ids.push(item.id);
      //     });
          
      // console.table("======== ids = "+ids)
      // console.log("======== selectionChange end =======")
      // console.log("===========================")
      // console.log(row)
        // let flag = 0;
        // for(let i in val){
        //     if(row.id === val[i].id){
        //         flag = 1
        //         break;
        //     }
        // }
        // if(flag === 1){
        //     this.copyChooseTchIds.push(row);
        // }
        // else{
        //     for(let i in this.copyChooseTchIds){
        //         if(this.copyChooseTchIds[i].id == row.id)
        //             this.copyChooseTchIds.splice(i, 1);
        //     }
        // }
    },
    handleReUploadSelect(rows){alert(rows)
    console.log(rows);
        // this.list = rows.id;
         let ids = new Array();
        if (rows) {
          rows.forEach(row => {
            if(row.selected)
            console.log("每一行Id:"+row.id)
            ids.push(row.id);
          });
        }
        if(ids.length == 0){
          this.$message({ type: "info", message: "请选择要重转的数据" });
          return ;
        }


      // let that = this;
      // let params = {
      // };
      // that.axios.post(`${this.api.baseURL}/blockChain/reUploadSelect`, params).then(res => {
      //     console.log(" response : " + res.data.data.result.content);
      //     //let arr = res.data.data.result.content;
      //     //   this.$set(bcBaseList, arr);
      //     //that.bcBaseList = res.data.data.result.content;
      //     //that.total = res.data.data.result.totalRecord;
      //   });

    },
    handleReUploadQuery(){
      let that = this;
      let params = {
        currentPage: 1,
        pageSize: 10,
        searchByKeys: {
          searchType: that.filters.searchType,
          dataStatus: that.filters.dataStatus,
          sendBcTime_begin: that.filters.sendBcTime_begin,
          sendBcTime_end: that.filters.sendBcTime_end,
          bcContent: that.filters.bcContent
        },
        orderByKeys: {}
      };
      that.axios.post(`${this.api.baseURL}/blockChain/reUploadQuery`, params).then(res => {
          console.log(" response : " + res.data.data.result.content);
          //let arr = res.data.data.result.content;
          //   this.$set(bcBaseList, arr);
          //that.bcBaseList = res.data.data.result.content;
          //that.total = res.data.data.result.totalRecord;
        });
    },
    handleSearch() {
      this.total = 0;
      this.page = 1;
      this.search();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.search();
    },
    search: function() {
      let createFrom = "";
      let that = this;
      let params = {
        currentPage: that.page,
        pageSize: that.limit,
        searchByKeys: {
          searchType: that.filters.searchType,
          dataStatus: that.filters.dataStatus,
          sendBcTime_begin: that.filters.sendBcTime_begin,
          sendBcTime_end: that.filters.sendBcTime_end,
          bcContent: that.filters.bcContent,
          bcRtnTHash: that.filters.bcRtnTHash
        },
        orderByKeys: {}
      };
      that.axios
        .post(`${this.api.baseURL}/blockChain/queryBlockChainLog`, params)
        .then(res => {
          console.log(" response : " + res.data.data.result.content);
          let arr = res.data.data.result.content;
          //   this.$set(bcBaseList, arr);
          that.bcBaseList = res.data.data.result.content;
          that.total = res.data.data.result.totalRecord;
        });
    },
    cancelTask: function(index, row) {
      if (row.status == "0") {
        this.$confirm("您确定要删除任务【" + row.taskNo + "】吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            let that = this;
            let p = { taskId: row.id };
            that.axios
              .post(`${this.api.baseURL}/task/delete`, p)
              .then(function(result) {
                //console.log(result);
                if (result && result.status == "200") {
                  //删除成功
                  that.$message.success({
                    showClose: true,
                    message: "已删除",
                    duration: 2000
                  });
                  that.search();
                } else {
                  that.$message.error({
                    showClose: true,
                    message: "删除失败",
                    duration: 2000
                  });
                }
              });
          })
          .catch(() => {
            this.$message({ type: "info", message: "已取消删除" });
          });
      } else {
        this.$message.error({
          showClose: true,
          message: "司机已经接收该任务，不允许取消！",
          duration: 3000
        });
      }
    },
    showDetail: function(row) {
        console.log(row.id)
        console.log(row.bcInfoKey)
        console.log(" ======== "+this.detailView.bcRtnRetmsg)
      this.detailView = Object.assign({}, row);
        console.log(" ======== "+this.detailView.bcRtnRetmsg)
      this.detailViewVisible = true;
      let that = this; 
    }
  },
  mounted() {
    this.handleSearch();
  },
  created() {
    //
  },
  components: {},
  created() {
    // 主页添加键盘事件,注意,不能直接在焦点事件上添加回车
    var self = this;
    document.onkeydown = function(e) {
      var key = e.which;
      if (key == 13) {
        self.handleSearch();
      }
    };
  }
};
</script>

<style lang="less" scoped>
.blueFont {
  color: #409eff;

  > b {
    color: #409eff;
  }
}
.normalFont {
  color: #303133;
}
.smallFont {
  color: #e6a23c;
  font-size: 9pt;
}
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
.el-dialog__body {
  padding: 5px 20px;
}
.el-collapse-item__header {
  background-color: lightgrey;
}
.el-collapse-item__content {
  padding-bottom: 5px;
}
</style>
