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
            <el-input placeholder="标题/内容" style="min-width: 420px;" v-model="searchStr"></el-input>
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
        <el-table :data="list" style="width: 100%" highlight-current-row v-loading="loading" stripe :border="true" class="helpListTable">
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item class="ques-title" label="操作指导:">
                  <br/>
                  <div>
                    <p class="pre-text">{{ props.row.description }}</p>
                  </div>
                  <div class="issue">
                    <i class="iconfont icon-good"></i>已解决
                    <span>({{props.row.solveNum}})</span>
                    <i class="iconfont icon-bad"></i>未解决
                    <span>({{props.row.unsolveNum}})</span>
                  </div>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column type="index" label="序号" width="50" align="center">
          </el-table-column>
          <el-table-column label="问题分类" prop="categoryName" align="center">
          </el-table-column>
          <el-table-column label="问题描述" prop="title">
          </el-table-column>
          <el-table-column property="isPublished" label="状态" align="center" width="80">
            <template slot-scope="scope">
              <p v-if="scope.row.isPublished=='0'||scope.row.isPublished==null">待发布</p>
              <p style="color:green;font-weight: bold;" v-if="scope.row.isPublished=='1'">已发布</p>
            </template>
          </el-table-column>
          <el-table-column property="createTime" label="更新时间" align="center">
            <template slot-scope="scope">
              <p>{{scope.row.createTime|toDate}}</p>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="160">
            <template slot-scope="scope">
              <el-button v-if="scope.row.isPublished=='0'||scope.row.isPublished==null" @click="publish(scope.row.id)">发布</el-button>
              <el-button @click="editeItem(scope.row)">编辑</el-button>
              <el-button @click="deleteItem(scope.row.id)">删除</el-button>
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
      <el-dialog title="新增" :visible.sync="dialogFormVisible">
        <el-form :model="form" :rules="rules" ref="formDate">
          <el-form-item label="问题标题" prop="title" :label-width="formLabelWidth">
            <el-input v-model="form.title" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="所属分类" prop="category" :label-width="formLabelWidth">
            <el-select v-model="form.category" placeholder="请选择问题分类">
              <el-option v-for="(item,indexNo) in cateList" :key="indexNo" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="问题答案" prop="description" :label-width="formLabelWidth">
            <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 10}" placeholder="请输入内容" v-model="form.description" id="textarea" wrap="hard">
            </el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleNew">保 存</el-button>
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
        title: [
          { required: true, message: "请输入标题", trigger: "blur" },
          {
            min: 1,
            max: 200,
            message: "长度不能大于200个字符",
            trigger: "blur"
          }
        ],
        category: [
          { required: true, message: "请选择问题分类", trigger: "blur" }
        ],
        description: [
          { required: true, message: "请输入问题详情", trigger: "blur" },
          {
            min: 1,
            max: 1000,
            message: "长度不能大于500个字符",
            trigger: "blur"
          }
        ]
      },
      dialogFormVisible: false,
      form: {
        id: "",
        title: "",
        description: "",
        category: ""
      },
      formLabelWidth: "120px",
      taskTitle: "帮助管理",
      searchStr: "",
      searchTime: "",
      pages: 0,
      pageNo: 1,
      pageSize: 10,
      list: [],
      cateList: [],
      total: 0
    };
  },
  filters: {
    toDate(val) {
      return moment(val).format("YYYY-MM-DD");
    }
  },
  methods: {
    openNewForm() {
      this.form = {};
      this.dialogFormVisible = true;
    },
    //发布
    publish(id) {
      let p = { id: id };
      this.axios
        .post(`${this.api.baseURL}/helpArticle/publishArticle`, p)
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
    //删除
    deleteItem(id) {
      let p = { id: id };
      this.axios
        .post(`${this.api.baseURL}/helpArticle/delArticle`, p)
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
    saveItem() {
      // console.log(this.form.description)
      // var dbstr =  this.form.description.replace(/\n|\r\n/g,"<br>");
      let p = {
        id: this.form.id,
        title: this.form.title,
        category: this.form.category,
        description: this.form.description
      };
      this.axios
        .post(`${this.api.baseURL}/helpArticle/saveArticle`, p)
        .then(res => {
          if (res.data.success) {
            this.$message("保存成功");
            this.init();
          } else {
            this.$message(res.data.message);
            this.init();
          }
        });
    },
    handleNew() {
      let self = this;
      self.$refs["formDate"].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false;
          self.saveItem();
        } else {
          return false;
        }
      });
    },
    //编辑
    editeItem(item) {
      this.form.id = item.id;
      this.form.title = item.title;
      this.form.description = item.description;
      this.form.category = item.category;
      this.dialogFormVisible = true;
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
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        searchStr: this.searchStr,
        sdate: sdate,
        edate: edate
      };
      this.axios
        .post(`${this.api.baseURL}/helpArticle/searchArticle`, p)
        .then(res => {
          console.log(res);
          if (res.data.success) {
            this.list = res.data.data.list.records;
            this.total = res.data.data.list.total;
            this.pages = res.data.data.list.pages;
            this.cateList = res.data.data.category;
          } else {
            this.$message("加载失败");
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
.ques-title{
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

.helpListTable .el-table__row .el-button {
  padding: 0;
  color: #409eff;
  border: none;
  padding-right: 3px;
}
</style>
