<template>
<div class="backgroun">
  <div class="left"></div>
  <div class="right"></div>
    <div class="login bod">
      <!-- <div class="visitor"><span class="" style="color: #aaa;" @click="visitorLogin()">游客访问</span></div> -->
      <div class="box">
        <div class="box2">
          <div class="tip1">
              <img src="../../assets/logo.png" alt="">
          </div>
          <el-form :model="loginForm" status-icon :rules="loginForm" ref="loginForm" label-width="100px" class="demo-ruleForm">

            <el-input  style="font-size:14px" placeholder="请输入用户账号"  type="text" v-model="loginForm.username" auto-complete="off" :autofocus="autoFocus" :disabled="isGuestAccess"></el-input>

            <el-input style="font-size:14px" class="tip2" placeholder="请输入登录密码" type="password" v-model="loginForm.password" auto-complete="off" :disabled="isGuestAccess"></el-input>
  
            <el-button  class="tip2" style="width:100%" type="primary" @click="submitForm()" @keyup.13="alert">登录</el-button>

            <el-row class="int">
                <el-col :span="10">
                  <a href = "#" @click="findBackPwd" v-show="!isGuestAccess">找回密码</a>
                </el-col>
            </el-row>
  
          </el-form>
        </div>

      </div>
    </div>
    <!-- 修改密码出框 -->
    <el-dialog title="修改密码" :visible.sync="amendPwdFormVisible" :close-on-click-modal="false" width="30%" custom-class="blk" :append-to-body="true">
        <amend-pwd :showAmend="amendPwdFormVisible" @cancleAmend="closeamendPwd" background-color="skyblue"></amend-pwd>
    </el-dialog>
    <!-- 找回密码出框 -->
    <el-dialog title="找回密码" :visible.sync="findPwdFormVisible" :close-on-click-modal="false" width="30%">
        <find-pwd :showFlag="findPwdFormVisible" @cancleEvent="closeFindPwd"  ></find-pwd>
    </el-dialog>
</div>

</template>

<script>
import amendBackPassword from "../../components/common/amendBackPassword.vue";
import findBackPassword from "../../components/common/findBackPassword.vue";
import { setCookie, getCookie }  from "../../js/cookie.js";
import { getPermitsByType }  from "../../js/CookiePermitsMap.js";
import localStorage from "../../js/localstorage.js";

export default {
  data() {
    return {
      loginForm: {
        username: "",
        password: ""
      },
      radio: true,
      autoFocus: true,
      amendPwdFormVisible: false,
      findPwdFormVisible: false,
      demoUser: '',
      isGuestAccess: false
    };
  },
  methods: {
    //提交用户信息并跳转到首页
    submitForm() {
      //修改密码
      // this.amendPwdFormVisible = true;
      this.axios
        .post(
          `${this.api.getlogin}?userCode=${this.loginForm.username}&password=${
            this.loginForm.password
          }`
        )
        .then(res => {
          if (res.data.code == 200) {
            // //console.log(" 返回 权限集 res.data.data.permitsMap = "+ JSON.stringify(res.data.data.permitsMap))
            //权限集
            let permitsMap = res.data.data.permitsMap //格式：{"key1":[],"key2":[]} ,例如:{"extra_service_list":["1"],"userAllMenuCodes":["m008001","m008"]}
            var permitsMapStr = JSON.stringify(permitsMap);
            setCookie("permitsMap", permitsMapStr, 1000 * 60);
            // //console.log("cookiePermitsMap.userAllMenuCodes = "+ getPermitsByType("userAllMenuCodes"))
            // //console.log("cookiePermitsMap.userAllMenuCodes.contain('m002002') = "+ getPermitsByType("userAllMenuCodes").contain("m002002"))
            
            let tokenid = res.headers.tokenid;
            setCookie("tokenid", tokenid, 1000 * 60);
            let username = res.data.data.result.userName;
            setCookie("username", username, 1000 * 60);
            let userCode = res.data.data.result.userCode;
            setCookie("userCode", userCode, 1000 * 60);
            if(res.data.data.isFirstLogin == 1 ){//首次登录 1首次，0非首次
              this.amendPwdFormVisible = true;
            }else {
              if (userCode == 'guest@yd'){
                this.$router.push("/queryBlockChainStatus");
              }else{
                this.$router.push("/chart1");
                localStorage.remove("currentDepId");
                localStorage.remove("userAllDeps");
                localStorage.set("userAllDeps", window.JSON.stringify(res.data.data.result.loginUserAllDepts));
                //this.$route.currentDepId = null;
              }
            }
            // //console.log(res.data.data.result.userName)
          } else if(res.data.code == 400){
            this.$message.error("登录失败,"+res.data.message);
          } else {
            //console.log(res.data.message)
            this.$message.error("登录失败，联系管理员");
          }
        });
    },
    
    //找回密码
    findBackPwd() {
      this.findPwdFormVisible = true;
    },
    closeFindPwd(showFlag) {
      this.findPwdFormVisible = showFlag;
    },
    closeamendPwd(showAmend) {
      this.amendPwdFormVisible = showAmend;
    },
    initUserLoginInfo(){
      this.loginForm.username = this.demoUser;
      if (this.demoUser == 'guest@yd'){
        this.loginForm.password = '654321';
        this.isGuestAccess = true;
      }
    },
    //检查浏览器的宽度
    reminder () {
      let windowWidth = window.innerWidth;
      if(windowWidth < 1366 ){
        this.$message({message : '为了更好的体验云单平台，建议您将分辨率调整至1366*768以上或选择合适的显示设备', duration: 8000});
      }
    },
    visitorLogin(){
      this.$confirm("您即将以<strong>游客身份</strong>体验云单，请确认是否继续？", "提示", { confirmButtonText: "确定", cancelButtonText: "取消", type: "warning", dangerouslyUseHTMLString: true}).then(() => {
        this.$router.push({ path: "/demoLogin/guest@yd" });
      });
      
    }
  },
  beforeRouteEnter(to, from, next) {
    next(function(vm) {
      vm.reminder();
    });
  },
  created() {
    // 主页添加键盘事件,注意,不能直接在焦点事件上添加回车
    var lett = this;
    document.onkeydown = function(e) {
      // var key = e.which;
      var key = e.which;
      console.log(e)
      if (key == 13) {
        lett.submitForm();
      }
    };

    this.demoUser = this.$route.params.demouser;
    this.initUserLoginInfo();
  },
  watch: {
    $route: {
      handler(val) {
        // this.demoUser = Base64.decode(this.$route.params.demouser);
        this.demoUser = this.$route.params.demouser;
        this.initUserLoginInfo();
      }
    }
  },
  components: {
    "find-pwd": findBackPassword, //定义子组件
    "amend-pwd": amendBackPassword, //定义子组件
  }
};
</script>


<style lang="less" scoped>
.backgroun {
  position: relative;
  width: 100%;
  height: 100%;

  .blk {
    background-color: skyblue !important;
  }

  .visitor {
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
    // z-index: 1;
  }
}
.left {
  position: absolute;
  top: 0;
  left: 0;
  // z-index: 1;
  width: 50%;
  height: 100%;
  background-image: url("../../assets/repeat.png");
  background-size: auto 100%;
}
.right {
  position: absolute;
  top: 0;
  right: 0;
  // z-index: 1;
  width: 50%;
  height: 100%;
  background-image: url("../../assets/repeate-right.png");
  background-size: auto 100%;
}
.bod {
  position: relative;
  width: 100%;
  height: 100%;
  // z-index: 22;
  background-image: url("../../assets/background-img.png");
  background-size: auto 100%;
  background-repeat: no-repeat;
  background-origin: content-box;
  background-position: center center;
}
.box {
  position: absolute;
  top: 50%;
  left: 50%;
  // z-index: 222;
  transform: translateX(-50%) translateY(-50%);
  width: 450px;
  height: 340px;
  box-sizing: border-box;
  overflow: hidden;
  padding: 12px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  .box2 {
    position: relative;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.3);
    border-radius: 6px;
    text-align: center;
    padding: 0 20px;
    box-sizing: border-box;
    .tip1 img {
      width: 24%;
    }

    .tip2 {
      margin-top: 24px;
      font-size: 16px;
    }
  }
}
.el-col-10 {
    float: right;
    padding-top: 5px;

    > a {
      color:#444;
    }
}

</style>




