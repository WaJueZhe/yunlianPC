<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
        <app-title :title="verifyManagementTitle"></app-title>
    </el-col>
    <el-col :span="24" class="residue">
      <span>当前剩余次数：</span>
      <span class="number" v-if="balanceCount">{{balanceCount}}</span>
      <span class="number" v-else>0</span>
      <span>次</span>
    </el-col>
    <el-form :inline="true" :model="filters" class="demo-form-inline">
      <el-form-item label="客户" v-show="isSuperAdmin">
        <el-select v-model="filters.customerOrgId">
          <el-option v-for="i in exceptionStatusMold" :key="i.customerOrgId" :label="i.lbl" :value="i.customerOrgId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="交易类型">
        <el-select v-model="filters.consumeType" placeholder="交易类型">
          <el-option v-for="i in exceptionStatusEnum" :key="i.consumeType" :label="i.lbl" :value="i.consumeType"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="运单号">
          <el-input v-model="filters.referId" placeholder="运单号" style="width: 200px;"></el-input>
      </el-form-item>
      <el-form-item>
        <div class="block">
          <el-date-picker v-model="filters.createDate_begin" type="date" align="right" 
              placeholder="创建日期 从" :picker-options="pickerOptions1">
          </el-date-picker>
          <span class="demonstration">~</span>
          <el-date-picker v-model="filters.createDate_end" type="date" align="right" 
              placeholder="创建日期 到" :picker-options="pickerOptions1">
          </el-date-picker>
        </div>
      </el-form-item>
      <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
      </el-form-item>
      <el-form-item>
          <el-button type="primary" @click="handleExport">导出</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="tableData" style="width:100%;" highlight-current-row v-loading="loading" stripe :border="true">
      <el-table-column type="index" label="序号" align="center" width="70%"></el-table-column>
      <el-table-column prop="id" label="id" v-if="false"></el-table-column>
      <el-table-column prop="consumeType"  label="交易类型" :formatter="formatConsumeType" align="center" min-width="16%"></el-table-column>
      <el-table-column prop="consumeCount"  label="交易明细" align="center" min-width="16%"></el-table-column>
      <el-table-column prop="referId"  label="运单号" align="center" min-width="16%">
        <template slot-scope="scope">
            <p @click="showDetail(scope.row)" style="cursor:pointer;color:#409eff">{{scope.row.referId}}</p>
        </template>
      </el-table-column>
      <el-table-column prop="consumerName"  label="认证人姓名" align="center" min-width="16%"></el-table-column>
      <el-table-column prop="consumerIdentity"  label="身份证号" align="center" min-width="20%"></el-table-column>
      <el-table-column prop="createBy"  label="操作人" align="center" min-width="20%"></el-table-column>
      <el-table-column prop="createDate"  label="认证时间" align="center" min-width="16%"></el-table-column>
    </el-table>
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination layout="total, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-size="limit" :total="total"
        background style="float:right;">
      </el-pagination>
    </el-col>
    <!-- 运单详情弹出框     -->
    <el-dialog :title="'运单详情'" :visible.sync="detailViewVisible" :close-on-click-modal="false" custom-class="myClass">
      <el-form :model="detailView" ref="detailView">
        <el-collapse v-model="activeInfoList">
          <el-collapse-item name="1">
            <template slot="title">
                <i class="header-icon el-icon-document"></i>
                <b>任务信息</b>
            </template>
            <el-row class="waybillDetail">
                <el-col :span="5" align="center">任务单号</el-col>
                <el-col :span="5" align="center">任务分类</el-col>
                <el-col :span="5" align="center">参考号</el-col>
                <el-col :span="3" align="center">车牌号</el-col>
                <el-col :span="3" align="center">司机姓名</el-col>
                <el-col :span="3" align="center">手机号码</el-col>
            </el-row>
            <el-row class="waybillDetail">
                <el-col :span="5" align="center">{{detailView.taskNo}}</el-col>
                <el-col :span="5" align="center">{{detailView.categoryDesc}}&nbsp;</el-col>
                <el-col :span="5" align="center">{{detailView.referId}}&nbsp;</el-col>
                <el-col :span="3" align="center">{{detailView.vehicleNo}}&nbsp;</el-col>
                <el-col :span="3" align="center">{{detailView.driverName}}</el-col>
                <el-col :span="3" align="center">{{detailView.driverMobile}}</el-col>
            </el-row>
        </el-collapse-item>
        <el-collapse-item name="2">
            <template slot="title">
                <i class="header-icon el-icon-goods"></i>
                <b>运单信息</b>
            </template>
            <div v-for="shp in detailView.shipmentList" :key="shp.id">
                <el-row>
                    <el-col :span="3">运单号</el-col>
                    <el-col :span="7">{{shp.shpNo}} {{shp.referId}}<el-tag type="danger" v-show="shp.status==-2" size="mini">终</el-tag></el-col>
                    <el-col :span="12" v-if="shp.shipmentContract">
                      <a style="color:blue" v-for="ctr in shp.shipmentContract" :key="ctr.id" target="_blank" :href="ctr.docViewUrl">
                        <span v-if="ctr.contractType == '' || ctr.contractType == '1'">电子运单</span>
                        <span v-if="ctr.contractType == '2'">签收异常单</span>
                        <span v-if="ctr.contractType == '3'">其他</span>
                        &nbsp;
                      </a>
                  </el-col>
                </el-row>
                <el-row>
                    <el-col :span="3">货物描述</el-col>
                    <el-col :span="5">{{shp.goodsDesc}}</el-col>
                    <el-col :span="3">货物信息</el-col>
                    <el-col :span="11">
                        {{shp.totalVolume}}/{{detailView.volumeUnit}}&nbsp; {{shp.totalWeight}}/{{detailView.weightUnit}}&nbsp; {{shp.totalUnits}}/{{detailView.unitUnit}}
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="3">发货信息</el-col>
                    <el-col :span="5">{{shp.deliverContactPerson}}/{{shp.deliverContactMobile}}</el-col>
                    <el-col :span="3">发货地址</el-col>
                    <el-col :span="13">
                        {{shp.deliverFullAddress}}&nbsp;&nbsp;{{shp.deliverCompany}}
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="3">计划出发</el-col>
                    <el-col :span="5">{{shp.deliverPlanDate}}</el-col>
                    <el-col :span="3">实际出发</el-col>
                    <el-col :span="6">{{shp.deliverActualDate}}&nbsp;</el-col>
                    <el-col :span="3">实发件数</el-col>
                    <el-col :span="4" v-show="shp.isDeliverChanged == 1 && shp.deliverActualDate" class="blueFont">{{shp.totalUnitDeliver}}</el-col>
                    <el-col :span="4" v-show="shp.isDeliverChanged == 0 && shp.deliverActualDate" class="normalFont">{{shp.totalUnitDeliver}}</el-col>
                </el-row>
                <el-row>
                    <el-col :span="3">收货信息</el-col>
                    <el-col :span="5">{{shp.unloadContactPerson}}/{{shp.unloadContactMobile}}</el-col>
                    <el-col :span="3">收货地址</el-col>
                    <el-col :span="13">{{shp.unloadFullAddress}}&nbsp;&nbsp;{{shp.unloadCompany}}</el-col>
                </el-row>
                <el-row>
                    <el-col :span="3">计划到达</el-col>
                    <el-col :span="5">{{shp.unloadPlanDate}}</el-col>
                    <el-col :span="3">实际到达</el-col>
                    <el-col :span="6">{{shp.unloadActualDate}}&nbsp;
                    </el-col>
                    <el-col :span="3">实收件数</el-col>
                    <el-col :span="4" v-show="shp.isReceiveChanged == 1 && shp.unloadActualDate" class="blueFont">{{shp.totalUnitUnload}}</el-col>
                    <el-col :span="4" v-show="shp.isReceiveChanged == 0 && shp.unloadActualDate" class="normalFont">{{shp.totalUnitUnload}}</el-col>
                </el-row>
                <hr style="margin-top:5px;">
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-form>
    </el-dialog>
  </el-row>
</template>
<script>
export default {
  data () {
    return {
      balanceCount: 0,
      total: 0,
      page: 1,
      limit: 10,
      isSuperAdmin: false , // 是否超级管理员：(1-超管,2-云链平台管理员,3-企业管理员,0-普通用户,默认0)
      tableData: [],
      detailView: {
      id: "",
      taskNo: ""
      },
      loading: false,
      verifyManagementTitle:'认证管理',
      exceptionStatusEnum: [
        { consumeType: "", lbl: "全部" },
        { consumeType: "1", lbl: "用户建档时认证" },
        { consumeType: "2", lbl: "司机建档时认证" },
        { consumeType: "3", lbl: "签发实名认证" },
        { consumeType: "4", lbl: "签收实名认证" },
        { consumeType: "5", lbl: "企业认证" },
        { consumeType: "99", lbl: "充值" }
      ],
      exceptionStatusMold: [
        { customerOrgId: "", lbl: "全部" },
      ],
      filters: {
           customOrgId: "",
           consumeType: "",
           referId: "",
           createDate_begin: "",
           createDate_end: ""
      },
      pickerOptions1: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
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
      activeInfoList: ["1", "2", "4", "5"],
      detailViewVisible: false,
    }
  },
  methods: {
      // 1-司机 2-发货人 3-收货人 4-用户
    formatConsumeType: function(row, column) {
      let ret = "";
      switch (row.consumeType) {
        case "1":
          ret = "用户建档时认证";
          break;
        case "2":
          ret = "司机建档时认证";
          break;
        case "3":
          ret = "签发实名认证";
          break;
        case "4":
          ret = "签收实名认证";
          break;
        case "5":
          ret = "企业认证";
          break;
        default: ret = row.consumeType;
          break;
      }
      return ret;
    },
    handleCurrentChange (val) {
      this.page = val;
      this.search();
    },
    showDetail: function(row) {
      this.detailViewVisible = true;
      let that = this;
      let p = { shpNo: row.referId };
      this.axios
      .post(`${this.api.baseURL}/shipment/findTaskAndShipmentByshpNO`, p)
      .then(res => {
        that.detailView = res.data.data.result
        //console.log(res);
        //console.log(that.taskShpList)
      });
    },
    handleExport() {
      let that = this;
      let params = {
        currentPage: 1,
        pageSize: 30000,
        searchByKeys: {
           customerOrgId: that.filters.customerOrgId,
           consumeType: that.filters.consumeType,
           referId: that.filters.referId,
           createDate_begin: that.filters.createDate_begin,
           createDate_end: that.filters.createDate_end
        },
        orderByKeys: {}
      };
      that.axios
        .post(`${this.api.baseURL}/bsConsumeVerify/queryConsumeVerifyExport`, params)
        .then(res => {
          if(res.data.code != 200){
              that.$message.error({showClose: true, message: res.data.message, duration: 4000});
            }else{
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
            }
        });
    },
    handleSearch() {
      this.total = 0;
      this.page = 1;
      this.search();
    },
    search: function() {
      let that = this;
      let params = {
        currentPage: that.page,
        pageSize: that.limit,
        searchByKeys: {
           customerOrgId: that.filters.customerOrgId,
           consumeType: that.filters.consumeType,
           referId: that.filters.referId,
           createDate_begin: that.filters.createDate_begin,
           createDate_end: that.filters.createDate_end
        },
        orderByKeys: {}
      };
      // that.loading = true // show loading progress
      //console.log("提交数据 = "+ JSON.stringify(params))
      that.axios
        .post(`${this.api.baseURL}/bsConsumeVerify/queryConsumeVerify`, params)
        .then(res => {
          that.tableData = res.data.data.result.content;
          that.total = res.data.data.result.totalRecord;
          that.balanceCount = res.data.data.bsChargeBalance.balanceCount;
          // if(res.data.data.bsChargeBalance.balanceCount){
          //   that.balanceCount = 0
          // }else{
          //   that.balanceCount = res.data.data.bsChargeBalance.balanceCount;
          // }
          if(res.data.data.customers){
            res.data.data.customers.unshift({ customerOrgId: "", lbl: "全部" })
          }
          console.table(res.data.data.customers)
          that.exceptionStatusMold = res.data.data.customers; 
          //console.log(" res.data.data.isSuperAdmin "+res.data.data.isSuperAdmin)
          that.isSuperAdmin = (res.data.data.isSuperAdmin == 1 || res.data.data.isSuperAdmin == 2);
        });
    }
  },
  mounted() {
    this.handleSearch();
  },
  activated: function () {
    this.$nextTick(function () { 
      let customerOrgId = this.$route.query.customerOrgId
      this.$set(this.filters,"customerOrgId",customerOrgId)
      this.handleSearch();
    })
  },
  created() {
    // 主页添加键盘事件,注意,不能直接在焦点事件上添加回车
    var self = this;
    document.onkeydown = function(e) {
      var key = e.which;
      if (key == 13) {
        self.handleSearch();
      }
    };
  },
  
}
</script>
<style lang="less" scoped>
.warp {
  padding: 10px;

  .residue {
    margin-bottom: 30px;

    .number {
      font-size: 24px;
      color: #409EFF;
    }
  }
  .waybillDetail {
    border: 1px solid #ccc;

    &:last-child {
      border-top: none;
    }

    > div {
      border-right: 1px solid #ccc;
      
      &:last-child {
        border-right: none;
      }
    }
  }
}
</style>
