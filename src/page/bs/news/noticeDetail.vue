<template>
  <div>
    <el-row class="warp" style="margin-bottom:5px">
        <el-col :span="24" class="warp-breadcrum" style="padding:10px;">
            <app-title :title="taskTitle"></app-title>
        </el-col>
        <div style="margin-left:25px" v-html="article.articleContent"></div>

    </el-row>
    
  </div>
</template>

<script>
export default {
  watch: {
    $route: ["init"]
  },
  data() {
    return {
      taskTitle:'查看详情',
      id:'',
      article:{}
    };
  },
  methods: {
    init() {
      this.id = this.$route.params.id;
      let p = {id: this.id};
      this.axios
        .post(`${this.api.baseURL}/msgArticle/findArticleDetail`, p)
        .then(res => {
          console.log(res);
          if (res.data.success) {
            this.article = res.data.data.result;
            this.taskTitle = this.article.articleTitle;
          } else {
            this.$message("出现了点意外，请重新进入");
          }
        });
    }
  },
  mounted() {
    this.init();
  }
};
</script>

<style>
.warp{
  padding-left: 2px;
  padding-right: 20px;
}
.quill-editor {
  height: 745px;
}
.ql-container {
  height: 680px;
}

.ql-snow .ql-editor img {
  max-width: 480px;
}

.ql-editor .ql-video {
  max-width: 480px;
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
</style>
