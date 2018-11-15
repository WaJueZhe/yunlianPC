<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
        <app-title :title="verifyManagementTitle"></app-title>
    </el-col>

    <el-table :data="tableData" style="width:100%;" highlight-current-row v-loading="loading" stripe :border="true" class="chargeManagermentTable">
      <el-table-column type="index" label="序号" align="center" width="50"></el-table-column>
      <el-table-column prop="id" label="id" v-if="false"></el-table-column>
      <el-table-column prop="enterpriseName"  label="客户名称" align="center"></el-table-column>
      <el-table-column prop="orgName"  label="客户简称" align="center"></el-table-column>
      <el-table-column prop="satrapName"  label="客户联系人" align="center" min-width="60"></el-table-column>
      <el-table-column prop="satrapPhone"  label="联系人电话" align="center"></el-table-column>
      <el-table-column prop="operateDate"  label="操作时间" align="center"></el-table-column>
      <el-table-column prop="chargeType1Count"  label="认证剩余次数" align="center" width="110">
        <template slot-scope="scope">
            <p @click="goverify(scope.row)" style="cursor: pointer;color:#409eff">{{scope.row.chargeType1Count}}</p>
        </template>
      </el-table-column>
      <el-table-column prop="chargeType2Count"  label="签名剩余次数" align="center" width="110">
        <template slot-scope="scope">
            <p  @click="goSign(scope.row)" style="cursor: pointer;color:#409eff;">{{scope.row.chargeType2Count}}</p>
        </template>
      </el-table-column>

      <el-table-column label="操作" fixed="right" width="160" align="center">
        <template slot-scope="scope">
          <el-button @click="dialogVisibleFun(scope.row.id,'2')">签名管理</el-button>
          <el-button @click="dialogVisibleFun(scope.row.id,'1')">认证管理</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 充值历史 -->
    <el-dialog :visible.sync="dialogVisible" width="50%" :before-close="handleClose">
      <div class="signature">
        <div class="signature-top">
          <div class="text">
            <i class="el-icon-edit-outline"></i>
            <span>当前剩余 {{chargeTypeName}} 次数：</span>
            <span class="number">{{balanceCountSign}}</span>
            <span>次</span>
          </div>
          <div class="btn" @click="topUp">充值</div>
        </div>
      </div>
      <div class="signature-title">充值历史</div>
      <el-table :data="tableDataSign" style="width:100%;" highlight-current-row v-loading="loading" stripe :border="true">
      <el-table-column type="index" label="序号" align="center" width="70%"></el-table-column>
      <el-table-column prop="id" label="id" v-if="false"></el-table-column>
      <el-table-column prop="chargeCount"  label="充值次数" align="center" min-width="33%"></el-table-column>
      <el-table-column prop="createByUserName"  label="操作人" align="center" min-width="33%"></el-table-column>
      <el-table-column prop="createDate"  label="操作时间" align="center" min-width="33%"></el-table-column>
    </el-table>
    <div class="paging">
       <!--弹窗工具条-->
      <el-col :span="24" class="toolbar">
        <el-pagination layout="total, prev, pager, next, jumper" @current-change="handleCurrentChangeSign" :page-size="limitSign" :total="totalSign"
          background style="float:right;">
        </el-pagination>
      </el-col>
    </div>
    </el-dialog>
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination layout="total, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-size="limit" :total="total"
        background style="float:right;">
      </el-pagination>
    </el-col>

    <!-- 充值 对话 窗口   -->
    <el-dialog :visible.sync="recharge" width="20%" :before-close="handleChargeClose" custom-class="myClass">
      <div class="recharge-box">
        <el-form :model="ruleForm2" status-icon :rules="rules2" ref="ruleForm2" label-width="70px" class="demo-ruleForm">
          <el-form-item label="充值次数" prop="chargeCount">
            <el-input v-model.number="ruleForm2.chargeCount" placeholder="请输入要充值的次数" id="chargeCountId"></el-input>
          </el-form-item>
          <el-form-item label="财务密码">
            <el-input type="password" v-model="ruleForm2.finPassword" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="recharge = false">取消</el-button>
            <el-button type="primary" @click="submitForm('ruleForm2')">确认</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </el-row>
</template>
<script>
export default {
  data() {
    var checkAge = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("充值次数不能为空"));
      }
      setTimeout(() => {
        if (!Number.isInteger(value)) {
          callback(new Error("请输入数字值"));
        } else {
          if (value < 0) {
            callback(new Error("数字值必须年大于0的正整数"));
          } else {
            callback();
          }
        }
      }, 1000);
    };
    return {
      tableDataSign: [],
      chargeTypeName: "",
      balanceCountSign: "",
      current_customerOrgId: "",
      current_chargeType: "",
      recharge: false,
      tableData: [],
      loading: false,
      total: 0,
      page: 1,
      limit: 10,
      totalSign: 0,
      pageSign: 1,
      limitSign: 10,
      verifyManagementTitle: "充值管理",
      dialogVisible: false,
      ruleForm2: {
        finPassword: "",
        customerOrgId: "",
        chargeType: "",
        chargeCount: ""
      },
      rules2: {
        chargeCount: [{ validator: checkAge, trigger: "blur" }]
      }
    };
  },
  methods: {
    dialogVisibleFun(id, chargeType) {
      this.balanceCountSign = "";
      this.current_customerOrgId = id;
      this.current_chargeType = chargeType;
      if (chargeType == "1") {
        this.chargeTypeName = "认证";
      } else {
        this.chargeTypeName = "签名";
      }
      this.dialogVisible = true;
      this.searchByChargeType();
    },
    searchByChargeType: function() {
      let that = this;
      let params = {
        currentPage: that.pageSign,
        pageSize: that.limitSign,
        searchByKeys: {
          customerOrgId: this.current_customerOrgId,
          chargeType: this.current_chargeType // 1 实名  2 签名 "
        },
        orderByKeys: {}
      };
      // that.loading = true // show loading progress
      //console.log("提交数据 = "+ JSON.stringify(params))
      that.axios
        .post(
          `${
            this.api.baseURL
          }/bsChargeTransaction/queryBsChargeHistoryByCustId`,
          params
        )
        .then(res => {
          //console.log("返回数据 = "+JSON.stringify(res.data.data.result))
          //console.log("返回数据 = "+res.data.data.result)
          if (res.data.code != 200) {
            that.$message.error({
              showClose: true,
              message: res.data.message,
              duration: 4000
            });
          } else {
            that.tableDataSign = res.data.data.result.content;
            that.totalSign = res.data.data.result.totalRecord;
            that.balanceCountSign = res.data.data.bsChargeBalance.balanceCount;
          }
        });
    },
    handleCurrentChange(val) {
      this.page = val;
      this.search();
    },
    handleCurrentChangeSign(val) {
      //  alert(val)
      this.pageSign = val;
      this.searchByChargeType();
    },
    //关闭弹窗
    handleClose(done) {
      this.search();
      done();
    },
    //关闭弹窗
    handleChargeClose(done) {
      this.searchByChargeType();
      done();
    },
    goSign(row) {
      this.$router.push({
        path: "/signManagement?customerOrgId=" + row.id
      });
    },
    goverify(row) {
      this.$router.push({
        path: "/verifyManagement?customerOrgId=" + row.id
      });
    },

    submitForm(formName) {
      let that = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = {
            finPassword: this.ruleForm2.finPassword,
            customerOrgId: this.current_customerOrgId,
            chargeType: this.current_chargeType,
            chargeCount: this.ruleForm2.chargeCount
          };
          that.axios
            .post(
              `${this.api.baseURL}/bsChargeTransaction/submitChargeByCustId`,
              params
            )
            .then(res => {
              //console.log("返回数据 = "+JSON.stringify(res.data.data.result))
              //console.log("返回数据 = "+res.data.data.result)
              if (res.data.code != 200) {
                that.$message.error({
                  showClose: true,
                  message: res.data.message,
                  duration: 4000
                });
              } else {
                that.recharge = false;
                this.searchByChargeType();
                that.ruleForm2.chargeCount = "";
                that.ruleForm2.finPassword = "";
              }
            });
        } else {
          //console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
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
        searchByKeys: {},
        orderByKeys: {}
      };
      that.axios
        .post(`${this.api.baseURL}/bsChargeBalance/queryChargeBalance`, params)
        .then(res => {
          that.tableData = res.data.data.result.content;
          that.total = res.data.data.result.totalRecord;
        });
    },
    //清空充值次数的值
    topUp() {
      this.recharge = true;
      document.querySelector("#chargeCountId").querySelector("input").vauel =
        "";
    }
  },
  mounted() {
    this.handleSearch();
  },
  activated: function() {
    this.$nextTick(function() {
      this.handleSearch();
    });
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
  }
};
</script>
<style lang="less" scoped>
.warp {
  padding: 10px;

  .residue {
    margin-bottom: 30px;

    .number {
      font-size: 24px;
      color: #409eff;
    }
  }

  .btn {
    background-color: #409eff;
  }

  .signature {
    width: 100%;
    height: 30px;

    .signature-top {
      padding-bottom: 20px;
      border-bottom: 1px solid #ccc;
      .text {
        display: inline-block;
        height: 30px;
        line-height: 30px;

        > i {
          font-size: 24px;
        }

        .number {
          font-size: 24px;
          color: #409eff;
        }
      }

      .btn {
        margin-left: 20px;
        display: inline-block;
        width: 80px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        color: #fff;
        background-color: #409eff;
        border-radius: 5px;
        cursor: pointer;
      }
    }
  }
  .signature-title {
    margin-top: 40px;
    margin-bottom: 10px;
    color: black;
    font-weight: bold;
  }
  .paging {
    margin-top: 20px;
    width: 100%;
    height: 40px;
  }

  .chargeManagermentTable .el-table__row .el-button {
    padding: 0;
    color: #409eff;
    border: none;
    padding-right: 3px;
  }
}
</style>
