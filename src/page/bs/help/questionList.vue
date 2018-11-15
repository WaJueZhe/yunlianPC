<template>
  <el-row class="warp" style="margin-bottom:50px">
    <el-col :span="24" class="warp-breadcrum" style="padding:10px;">
      <app-title :title="taskTitle"></app-title>
    </el-col>

    <el-col :span="24" class="warp-main">
      <!--工具条-->
      <el-col :span="24" style="padding-bottom: 0px;">
        <el-form :inline="true">
          <el-form-item>
            <el-input placeholder="问题描述/联系人/联系电话" style="min-width: 420px;" v-model="searchStr"></el-input>
          </el-form-item>
          <el-form-item>
            <el-date-picker v-model="searchTime" type="datetimerange" align="right" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00','23:59:59']">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="openNewForm">新增</el-button>
          </el-form-item>
        </el-form>

        <!-- 列表 -->
        <el-table :data="list" style="width: 100%" highlight-current-row v-loading="loading" stripe :border="true" class="questionListTable">
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item class="ques-title" label="处理记录:">
                  <br/>
                  <div>
                    <p class="pre-text">{{ props.row.receiveDesc }}</p>
                  </div>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column type="index" label="序号" width="50" align="center">
          </el-table-column>
          <el-table-column label="问题描述" prop="details">
          </el-table-column>
          <el-table-column label="状态" align="center" width="80">
            <template slot-scope="scope">
              <div class="right" v-if="scope.row.isSolved==1">已处理</div>
              <div class="right" v-if="scope.row.isSolved==0 && scope.row.isReceive==1">处理中</div>
              <div class="right" v-if="scope.row.isSolved==0 && scope.row.isReceive==0">待受理</div>
            </template>
          </el-table-column>
          <el-table-column property="createTime" label="创建时间" align="center">
            <template slot-scope="scope">
              <p>{{scope.row.createTime|toDate}}</p>
            </template>
          </el-table-column>
          <el-table-column label="联系人" prop="contactName" align="center" width="100">
          </el-table-column>
          <el-table-column label="联系电话" prop="contactTel" align="center" width="120">
          </el-table-column>
          <el-table-column property="receiveTime" label="受理时间" align="center">
            <template slot-scope="scope">
              <p>{{scope.row.receiveTime|toDate}}</p>
            </template>
          </el-table-column>
          <!-- <el-table-column property="receiver" label="受理人" align="center" width="100">
            <template slot-scope="scope">
              <p>{{scope.row.receiver}}</p>
            </template>
          </el-table-column>                          -->
          <el-table-column label="操作" align="center" width="80">
            <template slot-scope="scope">
              <el-button v-if="scope.row.isSolved==0 && scope.row.isReceive==0" @click="beginReceive(scope.row.id)">受理问题</el-button>
              <el-button v-if="scope.row.isSolved==0 && scope.row.isReceive==1" @click="openNewForm(scope.row)">完成处理</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>

      <!--工具条-->
      <el-col :span="24" class="toolbar">
        <el-pagination @current-change="pageChange" @size-change="handleSizeChange" style="float:right;" background layout="total, sizes, prev, pager, next, jumper" :current-page="pageNo" :page-sizes="[10, 20, 50, 100]" :page-size="10" :total="total">
        </el-pagination>
      </el-col>

      <!--弹出框-->
      <el-dialog title="记录受理过程记录" :visible.sync="dialogFormVisible">
        <el-form :model="form" :rules="rules" ref="formDate">
          <el-form-item label="" prop="description">
            <el-input type="textarea" :autosize="{ minRows: 5, maxRows: 10}" placeholder="请输入内容" v-model="form.description" id="textarea" wrap="hard">
            </el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitForm">保 存</el-button>
        </div>
      </el-dialog>

    </el-col>
  </el-row>
</template>

<script>
import moment from "moment";
export default {
  data() {
    return {
      rules: {
        description: [
          { required: true, message: "内容不能为空", trigger: "blur" },
          {
            min: 1,
            max: 500,
            message: "长度不能大于500个字符",
            trigger: "blur"
          }
        ]
      },
      form: {
        id: "",
        description: ""
      },
      dialogFormVisible: false,
      taskTitle: "问题反馈管理",
      searchStr: "",
      searchTime: "",
      pages: 0,
      pageNo: 1,
      pageSize: 10,
      list: [],
      total: 0
    };
  },
  filters: {
    toDate(val) {
      if (!val) {
        return null;
      }
      return moment(val).format("YYYY-MM-DD");
    }
  },
  methods: {
    openNewForm(item) {
      this.form.id = item.id;
      this.form.description = item.receiveDesc;
      this.dialogFormVisible = true;
    },
    submitForm(){
      let self = this;
      self.$refs["formDate"].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false;
          self.received();
        } else {
          return false;
        }
      });
    },
    //开始受理
    beginReceive(id) {
      let p = { id: id };
      this.axios
        .post(`${this.api.baseURL}/userQuestion/beginReceive`, p)
        .then(res => {
          if (res.data.success) {
            this.$message("受理成功");
            this.init();
          } else {
            this.$message("受理失败");
            this.init();
          }
        });
    },
    //完成处理
    received() {
      let p = { id: this.form.id, receiveDesc: this.form.description };
      this.axios
        .post(`${this.api.baseURL}/userQuestion/received`, p)
        .then(res => {
          if (res.data.success) {
            this.$message("保存成功");
            this.init();
          } else {
            this.$message("保存失败");
            this.init();
          }
        });
    },
    //查询
    handleSearch() {
      this.init();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.init();
    },
    pageChange(val) {
      this.pageNo = val;
      this.init();
    },
    init() {
      let sdate = null;
      let edate = null;
      console.log(this.searchTime);
      if (this.searchTime.length > 0) {
        sdate = moment(this.searchTime[0]).format("YYYY-MM-DD HH:mm:ss");
        edate = moment(this.searchTime[1]).format("YYYY-MM-DD HH:mm:ss");
      }
      this.list = [];
      let p = {
        createBy: null,
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        sdate: sdate,
        edate: edate,
        searchStr:this.searchStr
      };

      this.axios
        .post(`${this.api.baseURL}/userQuestion/searchQuestion`, p)
        .then(res => {
          console.log(res);
          if (res.data.success) {
            this.list = res.data.data.list.records;
          }
        });
    }
  },
  //这样写新增的数据才会出来，不用再次刷新
  // beforeRouteEnter(to, from, next) {
  //   next(function(vm) {
  //     vm.init();
  //   });
  // },
  // 这个要再次刷新新增的数据才显示出来
  mounted() {
    // var dbstr =  this.form.description.replace(/\n|\r\n/g,"<br>");
    // console.log(dbstr)
  },
  created() {
    this.init();
  }
};
</script>

<style lang="less" scoped>
.ques-title {
  font-weight: bold;
}
.pre-text {
  white-space: pre-wrap;
  word-wrap: break-word;
  word-break: break-all;
}
.warp {
  padding-left: 2px;
  padding-right: 20px;
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
.issue {
  > span {
    margin-right: 10px;
  }
}

.questionListTable .el-table__row .el-button {
  padding: 0;
  color: #409eff;
  border: none;
  padding-right: 3px;
}
</style>
