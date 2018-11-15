<template>
    <el-row class="warp" style="margin-bottom:50px">
        <el-col :span="24" class="warp-breadcrum" style="padding:10px;">
            <app-title :title="taskTitle"></app-title>
        </el-col>
                
        <el-col :span="24" class="warp-main" v-loading="loading" element-loading-text="拼命加载中">
            <!--工具条-->
            <el-col :span="24" style="padding-bottom: 0px;">
                <el-form :inline="true">
                    <el-form-item>
                        <el-input placeholder="标题/内容" style="min-width: 420px;" v-model="searchStr"></el-input>
                    </el-form-item>
                    <el-form-item><el-button type="primary" @click="handleSearch" @keyup.13="alert">查询</el-button></el-form-item>
                    <el-form-item><el-button type="primary" @click="handleNew">新增</el-button></el-form-item>
                </el-form>

                <el-table
                    ref="singleTable"
                    :data="list"
                    highlight-current-row
                    style="width: 100%" stripe :border="true" class="articleListTable">
                    <el-table-column
                    type="index"
                    label="序号"
                    align="center"
                    width="50">
                    </el-table-column>
                    <el-table-column
                    property="sendDate"
                    label="发布日期"
                    align="center">
                    <template slot-scope="scope1">
                        <div v-if="scope1.row.sendDate==null||scope1.row.sendDate==''"><el-tag type="warning">未发布</el-tag></div>
                        <p v-if="scope1.row.sendDate!=null&&scope1.row.sendDate!=''">{{scope1.row.sendDate}}</p>
                    </template>
                    </el-table-column>
                    <el-table-column
                    property="topTime"
                    label="置顶到期日"
                    align="center">
                    <template slot-scope="scope">
                        <p v-if="scope.row.topTime">{{scope.row.topTime|toDate}}</p>
                    </template>
                    </el-table-column>
                    <el-table-column
                    property="articleTitle"
                    label="标题"
                    align="center">
                    <template slot-scope="scope">
                        <strong @click="itemDetail(scope.row.id)" v-if="scope.row.articleLevel==0" style="cursor:pointer;color:red">{{scope.row.articleTitle}}</strong>
                        <p @click="itemDetail(scope.row.id)" v-if="scope.row.articleLevel==1" style="cursor:pointer">{{scope.row.articleTitle}}</p>
                    </template>
                    </el-table-column>
                    <el-table-column label="操作"  width="160" align="center">
                    <template slot-scope="scope" >
                        <el-button v-if="scope.row.sendDate==null||scope.row.sendDate==''" @click="publish(scope.row)">发布</el-button>
                        <el-button v-if="scope.row.sendDate==null||scope.row.sendDate==''" @click="editeItem(scope.row)">编辑</el-button>
                        <el-button @click="deleteItem(scope.row)">删除</el-button>                       
                    </template>
                    </el-table-column>
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
            <!--弹出框-->

        </el-col>
    </el-row>
</template>

<script>
import moment from "moment";
export default {
  data() {
    return {
      taskTitle: "公告管理",
      loading: false,
      searchStr: "",
      pages: 0,
      pageNo: 1,
      pageSize: 10,
      toplist: [],
      list: [],
      total: 0
    };
  },
  filters: {
    toDate(val){
      return moment(val).format("YYYY-MM-DD")
    }
  },
  methods: {
    //删除
    deleteItem(item) {
      let p = { id: item.id };
      this.axios
        .post(`${this.api.baseURL}/msgArticle/deleteArticle`, p)
        .then(res => {
          if (res.data.success) {
            this.$message("删除成功");
            this.init();
          } else {
            this.$message("删除失败");
            this.init();
          }
        });
    },
    //发布
    publish(item) {
      let p = { id: item.id };
      this.axios
        .post(`${this.api.baseURL}/msgArticle/publishArticle`, p)
        .then(res => {
          if (res.data.success) {
            this.$message("发布成功");
            this.init();
          } else {
            this.$message("发布失败");
            this.init();
          }
        });
    },
    itemDetail(id) {
      this.$router.replace({
        name: "NoticeDetail",
        params: {
          id: id
        }
      });
    },
    handleNew() {
      this.$router.replace({
        name: "Addarticle",
        params: {
          id: "add"
        }
      });
    },
    //编辑
    editeItem(item) {
      this.$router.replace({
        name: "Addarticle",
        params: {
          id: item
        }
      });
    },
    //查询
    handleSearch() {
      this.init();
    },
    handleSizeChange(val) {
      //每页显示数量变化
      console.log("每页显示" + val);
      this.pageSize = val;
      this.init();
    },
    pageChange(val) {
      //当前页码变化
      console.log("当前页" + val);
      this.pageNo = val;
      this.init();
    },
    init() {
      this.list = [];
      this.toplist = [];
      let p = {
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        searchStr: this.searchStr
      };
      this.axios
        .post(`${this.api.baseURL}/msgArticle/findArticleList`, p)
        .then(res => {
          console.log(res);
          if (res.data.success) {
            this.toplist = res.data.data.topList.records;
            this.list = res.data.data.generalList.records;
            this.list = this.toplist.concat(this.list);
            this.pages = res.data.data.generalList.pages;
            this.total = res.data.data.generalList.total;
          } else {
            this.$message("加载失败");
          }
        });
    }
  },
  //这样写新增的数据才会出来，不用再次刷新
  beforeRouteEnter(to, from, next) {
    next(function(vm) {
      vm.init();
    });
  },
  //这个要再次刷新新增的数据才显示出来
  // mounted() {
  //   this.init();
  // },
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
.warp{
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

.articleListTable .el-table__row .el-button {
  padding: 0;
  color: #409eff;
  border: none;
  padding-right: 3px;
}
</style>
