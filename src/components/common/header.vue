<template>

    <el-menu :default-active="activeIndex" class="el-menu-demo" router mode="horizontal" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
        <el-row style="height:60px;overflow:hidden">
            <el-menu-item index="#" style="width:200px" class="ind1" @click="showChart1"><img src="../../assets/logohome.png" title="返回首页"></el-menu-item>
            <el-col :span="2" v-for="(item) in onenav" v-bind:key="item.nodeCode"><el-menu-item :index="item.activeUrl" :title="'进入' + item.nodeName + '功能'">{{item.nodeName}}</el-menu-item></el-col>
            
            <el-menu-item index="" style="float:right;color:orange;padding:0 10px" @click="loginout" v-show="userCode !== 'guest@yd'">
              <i class="iconfont icon-tuichu" title="退出系统"></i>
            </el-menu-item>

            <el-menu-item index="" style="float:right;padding:0 0 0 5px" @click="$store.state.switchover = !$store.state.switchover">
              <i class="el-icon-menu" style="font-size:22px;color:#fff" title="切换部门"></i>
            </el-menu-item>

            <el-menu-item index="/personalData" style="float:right;color:white" v-show="userCode !== 'guest@yd'" title="用户资料设置">
              <img src="../../assets/img/user.png">&nbsp;{{ username }}
            </el-menu-item>
            
            <el-menu-item index="#" v-show="userCode == 'guest@yd'" style="float:right;color:white;font-size:150%;color:red" @click="closeBrowser">演示用户</el-menu-item>
        </el-row>
        
    </el-menu>
</template>

<script>
import { getCookie } from "../../js/cookie.js";
import { delCookie } from "../../js/cookie.js";
import localStorage from "../../js/localstorage.js";
export default {
  data() {
    return {
      activeIndex: "",
      onenav: [],
      username: "",
      userCode: ""
    };
  },
  methods: {
    loginout: function() {
      this.$confirm("您要确定要退出吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          //console.log("请求服务器 start");
          this.axios.post(`${this.api.baseURL}/userAuth/logout`)
            .then(res => {
              //console.log("服务器端退出返回结果："+res.data.message);  
              delCookie("tokenid");
              delCookie("permitsMap"); // 权限集
              localStorage.remove("currentDepId");
              localStorage.remove("userAllDeps");
              //console.log("delete token：");  
            });
            //console.log("不等服务器返回，直接回到登录页面"); 
            this.$router.push({ path: "/" }); 
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
    getHeaderBarMenu() {
      this.axios.post(this.api.headerMenu).then(res => {
        let nav = res.data.data.result;
        this.onenav = nav;
      });
    },
    noticeSub() {
      let _this = this;
      let stompClient = this.stompClient.stompClient;
      this.stompClient.stompClient.connect({}, function(frame) {
        stompClient.subscribe("/topic/notice", function(messageOutput) {
          //console.log(messageOutput);
          var obj = JSON.parse(messageOutput.body);
          //收到信息消息的业务处理
        });

        stompClient.subscribe("/topic/article", function(messageOutput) {
          //console.log(messageOutput);
          var obj = JSON.parse(messageOutput.body);
          var item = JSON.parse(obj.text);
          //收到新公告或文章
          _this.$notify({
            title: item.articleTitle,
            dangerouslyUseHTMLString: true,
            message:
              '<a href="' +
              _this.api.weburl +
              "#/noticeDetail/" +
              item.id +
              '">' +
              item.point +
              "</a>",
            duration: 0,
            position: "bottom-right"
          });
        });
      });
    },
    closeBrowser(){
      this.$confirm("您要确定要退出吗？", "提示", { confirmButtonText: "确定", cancelButtonText: "取消", type: "warning"}).then(action => {
        var ua = navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == "micromessenger") {
          WeixinJSBridge.invoke("closeWindow", {}, function(res) {});
        } else if (ua.indexOf("alipay") != -1) {
          AlipayJSBridge.call("closeWebview");
        } else if (ua.indexOf("baidu") != -1) {
          BLightApp.closeWindow();
        } else {
          //window.close();
          window.location.href="about:blank";
          window.close(); 
        }
      });
    },
    showChart1(){
      if (this.userCode !== 'guest@yd'){
        this.$router.push({ path: "/chart1" }); 
      }
    }
  },
  created() {
    this.getHeaderBarMenu();
    this.username = getCookie("username");
    this.userCode = getCookie("userCode");
    //console.log(this.username);
    this.noticeSub();
  }
};
</script>

<style scoped lang="less">
el-menu {
  max-height: 60px;
}
.ind1 {
  position: relative;
  padding: 0;
  img {
    position: absolute;
    top: 50%;
    left: 49%;
    transform: translateX(-50%) translateY(-50%);
  }
}
.el-menu--horizontal .el-menu-item {
  border: none;
}


</style>

