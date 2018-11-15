<template>
    <el-row class="warp" style="width:100%;height:100%">
        <el-col :span="24" class="warp-breadcrum" style="padding:10px;">
            <app-title :title="taskTitle"></app-title>
        </el-col>
                
        <el-col :span="24" class="warp-main" element-loading-text="拼命加载中">
            <!--工具条-->
            <el-col :span="24" style="padding-bottom: 0px;">
                <el-form :inline="true" :model="filters" style="padding-left:5px;">
                    <el-form-item>
                      <el-date-picker
                        v-model="filters.dateRange"
                        type="datetimerange"
                        :picker-options="pickerOptions2"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        align="right">
                      </el-date-picker>
                    </el-form-item>
                    <el-form-item label="">
                        <el-input v-model="filters.str" placeholder="输入查询关键字"></el-input>
                    </el-form-item>
                    <el-form-item>
                      <el-button type="primary" @click="loadding">查询</el-button>
                    </el-form-item>
                </el-form>

                <!--列表-->
                <el-table :data="tableData" style="width: 100%" stripe :border="true">
                  <el-table-column prop="userName" label="用户名"  width="300" align="center"></el-table-column>
                  <el-table-column prop="mobile" label="手机号码"  width="140" align="center"></el-table-column>
                  <el-table-column prop="loginTime" label="登录时间" width="180" align="center">
                    <template slot-scope="scope1">
                        <p v-if="scope1.row.loginTime!=null">{{scope1.row.loginTime|toDate}}</p>
                    </template>
                  </el-table-column>
                  <!-- <el-table-column prop="ipAddress" label="IP"  width="180" align="center"></el-table-column> -->
                  <!-- <el-table-column prop="loginAddress" label="地址" width="400px" align="center"></el-table-column> -->
                </el-table>
            </el-col>

            <!--工具条-->
            <el-col :span="24" class="toolbar">
                <el-pagination
                @current-change="pageChange"
                @size-change="handleSizeChange"
                style="float:right;"
                background
                layout="total, sizes, prev, pager, next, jumper"
                :current-page="pageNo"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="10"
                :total="total">
                </el-pagination>
            </el-col>  

        </el-col>
    </el-row>
</template>

<script>
import moment from "moment";
export default {
  data() {
    return {
      tableData: [],
      taskTitle: "登录日志",
      filters: {
        dateRange:'',
        str: "",
        beginDate: "",
        endDate: ""
      },
      total: 0,
      pages: 1,
      pageNo: 1,
      pageSize: 10,
      pickerOptions2: {
        shortcuts: [
          {
            text: "最近一天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", [start, end]);
            }
          },
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
          }
        ]
      }
    };
  },
  filters: {
    toDate(val) {
      return moment(val).format("YYYY-MM-DD hh:mm:ss");
    }
  },
  methods: {
    pageChange(val) {
      //当前页码变化
      this.pageNo = val;
      this.loadding();
    },
    handleSizeChange(val) {
      //每页显示数量变化
      this.pageSize = val;
      this.loadding();
    },
    loadding() {
      let p = {
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        searchStr: this.filters.str,
        beginDate: this.filters.dateRange[0],
        endDate: this.filters.dateRange[1]
      };
      if(p.beginDate!=null&&p.beginDate!=''){
          p.beginDate = moment(p.beginDate).format("YYYY-MM-DD HH:mm:ss");
      }
      if(p.endDate!=null&&p.endDate!=''){
          p.endDate = moment(p.endDate).format("YYYY-MM-DD HH:mm:ss");
      }
      this.axios
        .post(`${this.api.baseURL}/loginLog/searchLogList`, p)
        .then(res => {
          console.log(res);
          if (res.data.success) {
            this.tableData = res.data.data.result.records;
            this.pages = res.data.data.result.pages;
            this.total = res.data.data.result.total;
          }
        });
    }
  },
  created() {
    this.loadding();
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
