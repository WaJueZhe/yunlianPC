<template>
  <div class="upload">
    <!-- 图片展示 -->
    <div class="cha" v-show="(creatUpload.imgurl)">
      <!-- 删除icon -->
      <div class="del"><i class="el-icon-delete" @click="delImg"></i></div>
      <img :src="creatUpload.imgurl">
      <!-- 放大icon -->
      <div class="layer"><i @click="isEnlargeImage = true" class="el-icon-view"></i></div>
    </div>
    <!-- 图片上传控件 -->
    <div class="load" v-show="(!creatUpload.imgurl)">
      <input type="file" ref="file" name="" id="form" @change="uploadIMG">
    </div>

    <!-- 图片预览弹框 -->
    <el-dialog :visible.sync="isEnlargeImage" size="large"  :append-to-body="true" top="8%" width="60%">
			<img @click="isEnlargeImage = false" style="width:100%;" :src="creatUpload.imgurl">
		</el-dialog>
    
  </div>
</template>  

<script>
export default {
  props: ["uploadUrl", "creatImg", "creatURL","index","operate"],
  data() {
    return {
      picavalue: "", // 上传的文件信息
      isEnlargeImage: false, //控制弹框
      creatUpload: {
        imgurl: null, //图片地址
        loadurl: null //上传地址
      }
    };
  }, 
  methods: {
    uploadIMG(e) {
      console.log( "e.target.files = "+e.target.files)
      //console.log( " e.dataTransfer.files = "+e.dataTransfer.files)
      let files = e.target.files || e.dataTransfer.files;
      console.log( "files.length = "+files.length)
      if (!files.length) return;
      this.picavalue = files[0];
      // console.log(this.picavalue.size / 1024);
      if (this.picavalue.size / 1024 > 5000) {
        this.$message({
          message: "图片过大不支持上传",
          type: "warning"
        });
      } else {
        this.imgPreview(this.picavalue);
      }
    },
    //获取图片
    imgPreview(file, callback) {
      let self = this;
      //判断支不支持FileReader
      if (!file || !window.FileReader) return;
      if (/^image/.test(file.type)) {
        //创建一个reader
        let reader = new FileReader();
        //将图片转成base64格式
        reader.readAsDataURL(file);
        //读取成功后的回调
        reader.onloadend = function() {
          let result = this.result;
          let img = new Image();
          img.src = result;
          // console.log("********未压缩前的图片大小********");
          // console.log(result.length);
          img.onload = function() {
            //需在图片读取完整后才提交
            // 调用图片的压缩方法
            let data = self.compress(img);
            self.creatUpload.imgurl = result;
            // console.log("*******base64转blob对象******");
            let blob = self.dataURItoBlob(data);
            // console.log(blob);
            // console.log("********将blob对象转成formData对象********");
            var formData = new FormData();

            // formData.append("file", blob);  // 压缩的图片数据放到Blob  
            formData.append("file", data);

            // console.log(formData.get("file"));
            let config = {
              headers: { "Content-Type": "multipart/form-data" }
            };
            // 发送请求;
            self.loadIMG(formData, config);
          };
        };
      }
    },
    // 压缩图片
    compress(img) {
      let canvas = document.createElement("canvas");
      let ctx = canvas.getContext("2d");
      let initSize = img.src.length;
      let width = img.width;
      let height = img.height;
      canvas.width = width;
      canvas.height = height;
      // 铺底色
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, width, height);

      //进行最小压缩 , 值越小，所绘制出的图像越模糊
      let ndata = canvas.toDataURL("image/jpeg", 0.5);
      // console.log("*******压缩后的图片大小*******");
      // console.log(ndata.length);
      if (ndata.length > 1048000) {
        this.$message({
          message: "图片过大，请选择其他图片",
          type: "warning"
        });
        return (this.imgUrl = null);
      }
      return ndata;
    },
    // base64转成bolb对象
    dataURItoBlob(base64Data) {
      var byteString;
      if (base64Data.split(",")[0].indexOf("base64") >= 0)
        byteString = atob(base64Data.split(",")[1]);
      else byteString = unescape(base64Data.split(",")[1]);
      var mimeString = base64Data
        .split(",")[0]
        .split(":")[1]
        .split(";")[0];
      var ia = new Uint8Array(byteString.length);
      for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      return new Blob([ia], { type: mimeString });
    },
    //删除事件
    delImg() {
      this.creatUpload.imgurl = null;
      this.$refs.file.value = null;
      console.log(" !this.creatUpload.imgurl = "+ !this.creatUpload.imgurl)
    },
    //上传图片
    loadIMG(data, cong) {
      this.axios.post(this.creatUpload.loadurl, data, cong).then(res => {
        if (res.data.code == 200) {
          this.$emit(
            "getImgsrc",
            res.data.data.resultftphost,
            res.data.data.resulturl
          );
          // console.log(res.data.data)
        } else {
          this.$message({
            message: "图片上传失败，请重试",
            type: "warning"
          });
        }
      });
    }
  },
  beforeMount:function () {
      console.log("  -------------- beforeMount ----------------- ")
  },
  mounted:function () {
      console.log("  -------------- mounted ----------------- ")
  },
  created:function () {
      console.log("  -------------- created ----------------- ")
  },
  beforeCreate: function () {
      console.log("  -------------- beforeCreate ----------------- ")
  },
  beforeUpdate: function () {
      console.log("  -------------- beforeUpdate ----------------- ")
  },
  updated: function () {
      console.log("  -------------- updated aaaaaaa ----------------- ")
    this.$nextTick(function () {
      // Code that will run only after the
      // entire view has been re-rendered
      console.log("  -------------- updated ----------------- ")
    })
  },
  activated:function () {
      console.log("  -------------- activated ----------------- ")
  },
  deactivated:function () {
      console.log("  -------------- deactivated ----------------- ")
  },
  beforeDestroy:function () {
      console.log("  -------------- beforeDestroy ----------------- ")
  },
  destroyed: function () {
      console.log("  -------------- destroyed ----------------- ")
  },
  created() {
    //指定初始化图片
    if (this.uploadUrl) {
      console.log('第一次，没有指定图片')
      this.creatUpload.imgurl = null;
      this.creatUpload.loadurl = this.uploadUrl.url;
    } else if (this.creatImg) {
      console.log('第一次，有指定图片')
      this.creatUpload.imgurl = this.creatImg;
      console.log(this.creatImg)
      this.creatUpload.loadurl = this.creatURL;
    } else {
      console.log('第一次，清除默认图片')
      this.creatUpload.imgurl = null;
      this.creatUpload.loadurl = this.creatURL;
    }
    console.log('传进来的id值')
    console.log(this.index)
  },
  watch: {
    index() {
      console.log('进来了 index')
      if (this.uploadUrl) {
        // console.log("没有指定图片");
        this.creatUpload.imgurl = null;
        this.creatUpload.loadurl = this.uploadUrl.url;
      } else if (this.creatImg) {
        // console.log("有指定图片");
        this.creatUpload.imgurl = this.creatImg;
        this.creatUpload.loadurl = this.creatURL;
      } else {
        // console.log("全都为空");
        this.creatUpload.imgurl = null;
        this.creatUpload.loadurl = this.creatURL;
      }
    },
    operate(oper){
      console.log('进来了 operate = ' + oper)
      if(oper && oper.indexOf("cancle_") != -1){
        console.log("清空显示")
        this.creatUpload.imgurl = null;
        this.$refs.file.value = null;
      }
    }
  }
};
</script>

<style lang="less" scoped>
.upload {
  position: relative;
  width: 200px;
  height: 230px;
  // 图片展示
  .cha {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 6px;
    border: 1px dashed #cccccc;
    overflow: hidden;
    box-sizing: border-box;
    .layer {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 2;
      width: 100%;
      height: 200px;
      background-color: rgba(0, 0, 0, 0.3);
      text-align: center;
      line-height: 200px;
      opacity: 0;
      color: #ffffff;
      border: none;
    }
    .del {
      position: absolute;
      bottom: -8px;
      right: 0;
      opacity: 0;
      z-index: 2;
      border: none;

      > i {
        font-size: 24px;
        color: #e6a23c;
        cursor: pointer;
      }
    }
    img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 200px;
      border: none;
    }
  }
  //鼠标放上时显示删除和放大
  .cha:hover .layer,
  .cha:hover .del {
    opacity: 1;
  }

  //点击上传
  .load {
    position: absolute;
    top: 0;
    left: 0;
    width: 200px;
    height: 200px;
    border: 1px dashed #cccccc;
    input {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
    }
  }
  .load::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateY(-50%);
    width: 1px;
    height: 60%;
    border-right: 3px solid #cccccc;
  }
  .load:after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%);
    width: 60%;
    height: 1px;
    border-top: 3px solid #cccccc;
  }
}
</style>


