<template>
  <div>
    <el-row class="warp" style="padding:2px;margin-bottom:50px">
        <el-col :span="24" class="warp-breadcrum" style="padding:10px;">
            <app-title :title="taskTitle"></app-title>
        </el-col>
        <el-form :model="formDate" :rules="rules" ref="formDate" :label-position="labelPosition" label-width="80px">
          <el-form-item label="文章标题" prop="title">
            <el-input v-model="formDate.title" style="width:60%"></el-input>
          </el-form-item>
          <el-form-item label="作者" prop="author">
                <el-input v-model="formDate.author" style="width:60%"></el-input>
          </el-form-item>

            <el-form-item label="是否置顶">
              <el-switch v-model="formDate.isTop"></el-switch>
          </el-form-item>
          <el-form-item v-if="formDate.isTop" label="置顶到期" prop="topDate">
            <el-date-picker
                  v-model="formDate.topDate"
                  type="date"
                  :picker-options="pickerOptions1"
                  placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="公告内容" >
              <editor ref="myTextEditor" prop="context"
                      :fileName="'myFile'"
                      :canCrop="canCrop"
                      :uploadUrl="uploadUrl"
                      v-model="formDate.context"></editor>
              <!-- <div v-html="formDate.content"></div> -->
          </el-form-item>
          <el-form-item>
            <el-button style="margin-top:20px" type="primary" @click="submitForm('formDate')">保存</el-button>
            <el-button @click="$router.push('/articleList')">取消</el-button>
          </el-form-item>
        </el-form>        

    </el-row>
    
  </div>
</template>

<script>
import editor from "../../../components/common/Quilleditor.vue";
import moment from "moment";
export default {
  watch: {
    $route: ["init"]
  },
  data() {
    return {
      pickerOptions1:{
        disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7;
          }
      },
      canCrop:false,
      uploadUrl: this.api.baseURL+'/common/uploadPic',
      item: "",
      taskTitle: "发布公告",
      labelPosition: "right",
      formDate: {
        title: "",
        author: "",
        context: "",
        isTop: false,
        topDate: ""
      },
      articleInfo: {
        id: "",
        articleTitle: "",
        articleContent: "",
        articleLevel: "",
        articleType: "1",
        author: "",
        topTime: ""
      },
      rules: {
        title: [
          { required: true, message: "请输入标题", trigger: "blur" },
          { min: 1, max: 50, message: "长度不能大于50个字符", trigger: "blur" }
        ],
        author: [
          { required: true, message: "请输入作者", trigger: "blur" },
          { min: 1, max: 50, message: "长度不能大于50个字符", trigger: "blur" }
        ],
        topDate: [
          {
            type: "date",
            required: true,
            message: "请选择日期",
            trigger: "change"
          }
        ],
        context: [
          { required: true, message: "请输入内容", trigger: "blur" },
          {
            min: 1,
            max: 2000,
            message: "长度不能大于2000个字符",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.submit();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    saveItem(item) {
      console.log(item);
      let param = Object.assign({}, item);
      this.axios
        .post(`${this.api.baseURL}/msgArticle/saveArticle`, param)
        .then(res => {
          if (res.data.success) {
            this.$message("保存成功");
            this.$router.push("/articleList");
          } else {
            this.$message("保存失败");
          }
        });
    },
    submit() {
      console.log(this.formDate);
      this.articleInfo.articleTitle = this.formDate.title;
      this.articleInfo.articleContent = this.formDate.context;
      if (this.formDate.isTop) {
        this.articleInfo.articleLevel = "0";
        if (this.formDate.topDate == "" || this.formDate.topDate == null) {
        }
        this.articleInfo.topTime = moment(this.formDate.topDate).format(
          "YYYY-MM-DD"
        );
      } else {
        this.articleInfo.articleLevel = "1";
        this.articleInfo.topTime = "";
      }
      this.articleInfo.author = this.formDate.author;

      if (this.item != null && this.item != "") {
        this.articleInfo.id = this.item.id;
      }
      this.saveItem(this.articleInfo);
    },
    init() {
      this.item = this.$route.params.id;
      console.log(this.item);
      if (this.item == null || this.item == "add" || this.item == "") {
        this.taskTitle = "发布公告";
        this.formDate.title = "";
        this.formDate.context = "";
        this.formDate.author = "";
        this.formDate.isTop = false;
      } else {
        this.taskTitle = "编辑公告";
        this.formDate.title = this.item.articleTitle;
        this.formDate.context = this.item.articleContent;
        this.formDate.author = this.item.author;
        if (this.item.articleLevel == 0) {
          this.formDate.isTop = true;
          this.formDate.topDate = this.item.topTime;
        } else {
          this.formDate.isTop = false;
          this.formDate.topDate = "";
        }
      }
    }
  },
  mounted() {
    this.init();
  },
  components: {
    editor
  }
};
</script>

<style>
.quill-editor {
  height: 345px;
}
.ql-container {
  height: 280px;
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
