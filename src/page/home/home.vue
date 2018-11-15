<template>
<div class="hom">
    <el-row>
      <el-col :span="24" class="hed">
        <app-header></app-header>
      </el-col>
    </el-row>

    <div class="main">
      <aside>
            <app-aside></app-aside>
      </aside>
      <section>
        <!-- <keep-alive> -->
            <router-view></router-view>
        <!-- </keep-alive> -->
      </section>

      <!-- 提示框 -->
      <div class="info" v-show="showSelectDepBox">
        <div class="info-box">
          <div class="info-title">请选择当前所在的部门</div>
          <div class="info-cent">
            <div class="info-item" v-for="(item, index) in depList" :key="index">
              <el-radio v-model="selectedDep" :label="item.id">{{item.departmentName}}</el-radio>
            </div>
          </div>
          <div class="goin" @click="selectDepartment">进入</div>
        </div>
      </div>

      <transition name="fade">
        <div class="switchover" v-show="$store.state.switchover" v-on:mouseover='$store.state.switchover = true' v-on:mouseout='$store.state.switchover = false'>
          <div class="switchover-top">切换所在部门</div>
          <div class="switchover-cent">
            <el-radio-group v-model="selectedDep" @change="switchDep" style="width:100%">
            <div class="switchover-item" v-for="(item, index) in depList" :key="index">
              <el-radio :label="item.id">{{item.departmentName}}</el-radio>
            </div>
            </el-radio-group>
          </div>
        </div>
      </transition>
    </div>

  <!-- <app-aside2></app-aside2> -->
</div>

</template>

<script>
import { getCookie } from "../../js/cookie.js";
import localStorage from "../../js/localstorage.js";
export default {
  data(){
    return{
      showSelectDepBox:false,
      depList:[''],
      selectedDep: '',
      userCode: ""
    }
  },
  methods: {
    selectDepartment(){
      //alert(this.selectedDep);
      if (this.selectedDep != ''){
        //向后台发送命令，更改当前部门
        let that = this;
        let p = {"id": that.selectedDep};
        this.axios.post(`${this.api.baseURL}/userAuth/switchLoginDept`, p).then(result => {
          if (result.data.code == "200"){
            localStorage.set("currentDepId", that.selectedDep);
            that.$store.state.currentDepId = localStorage.get("currentDepId");
            that.showSelectDepBox = false;
          }else{
            this.$message.error("发生错误，请联系管理员！");
          }
        });
      }else{
        this.$message.error("请选择部门！");
      }
    },
    switchDep(val){
      
      this.$confirm("您确定要切换所在部门吗？", "提示", { confirmButtonText: "确定", cancelButtonText: "取消", type: "warning", dangerouslyUseHTMLString: true}).then(() => {
        this.selectDepartment();
        this.$router.push("/chart1");
        this.$message.success('已切换！');
      });
    },
    setShowSelectDep(){
      this.depList = JSON.parse(localStorage.get("userAllDeps"));
      if (this.depList.length == 1){ //只有1个部门，直接设置，不弹出框
        this.selectedDep = this.depList[0].id;
        let p = {"id": this.selectedDep};
        let that = this;
        this.axios.post(`${this.api.baseURL}/userAuth/switchLoginDept`, p).then(function(result){
          if (result.data.code == "200"){
            localStorage.set("currentDepId", that.selectedDep);
            that.$store.state.currentDepId = localStorage.get("currentDepId");
            that.showSelectDepBox = false;
            return;
          }else{
            this.$message.error("设置用户所在部门发生错误，请联系管理员！");
          }
        });
      }
      //console.log(localStorage.get("currentDepId"));
      if ((localStorage.get("currentDepId") == '') || ((localStorage.get("currentDepId") == null))){ //没有设置当前部门 才显示部门选择框
        //console.log(1)
        this.showSelectDepBox = true;
      }else{
        this.showSelectDepBox = false;
        this.selectedDep = localStorage.get("currentDepId");
        //console.log(2)
      }
    },
  },
  mounted() {
    this.userCode = getCookie("userCode");
    if (this.userCode == 'guest@yd'){
      this.$store.state.isCollapse = true; //演示用户，默认隐藏左边菜单
    }
    if (!this.$store.state.isCollapse) {
      let dat = document.querySelector("aside");
      // let sed = document.querySelector("section");
      dat.style.width = 202 + "px";
      // sed.style.width = 202 + "px";
    } else {
      let dat = document.querySelector("aside");
      // let sed = document.querySelector("section");
      dat.style.width = "";
      // sed.style.width = "";
    };

    // var tite = document.getElementsByClassName('el-radio__label');
    // var lab = document.getElementsByClassName('el-radio');
    // var ddd = document.getElementsByClassName('el-radio__input');
    // for(let i=0; i < input.length; i++){
    //   input[i].children[0].children[0].style.float = 'left';
    //   input[i].children[0].children[0].style.paddingRight = 10 + 'px';
    // }
    // for(var i=0; i < tite.length; i++){
    //   tite[i].style.paddingLeft = 0;
    // }
    // for(var i=0; i < lab.length; i++){
    //   lab[i].style.minWidth = 130 + 'px';
    // }
    // for(var i=0; i < ddd.length; i++){
    //   ddd[i].style.float = 'left';
    // }
  },
  beforeRouteEnter(to, from, next) {
    next(function(vm) {
      vm.setShowSelectDep();
      //if (vm.window.localStorage.getItem("currentDepId") == ''){ //没有设置当前部门 才显示部门选择框
      /*if (localStorage.get("currentDepId") != ''){ //没有设置当前部门 才显示部门选择框
        vm.showSelectDepBox = false;
      }else{
        vm.showSelectDepBox = true;
      }*/
    });
  },
};
</script>

<style lang="less" scoped>
.hom {
  width: 100%;
  height: 100vh;
  overflow-x: hidden;
}
/* 内容 */
.main {
  min-height: 100vh;
  display: flex;
}
aside {
  /* min-width: 50px; */
  min-height: 100%;
  /* height: 100vh; */
}
section {
  flex: 1;
}

.hed {
  height: 60px;
}

/* showsidebar {
  overflow-x: hidden;
  overflow-y: auto;
} */

.info {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,.3);

  .info-box {
    padding-bottom: 50px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 25%;
    background-color: #fff;
    border: 3px solid #ccc;
    z-index: 222;

    .info-title {
      padding-left: 20px;
      height: 40px;
      line-height: 40px;
      font-size: 18px;
      font-weight: bold;
      background-color: #eee;
    }

    .info-cent {
      padding: 20px;

      .info-item {
        overflow: hidden;

        .el-radio {
          white-space: pre-wrap;

          &::after {
            display: block;
            clear: both;
            content: ' ';
          }

          .el-radio__input {
            float: left !important;
            padding-right: 10px !important;
          }
        }
      }
    }

    .goin {
      margin: auto;
      width: 50%;
      height: 40px;
      line-height: 40px;
      text-align: center;
      font-size: 16px;
      border-radius: 10px;
      background-color: #eee;
      cursor: pointer;
    }
  }
}

.switchover {
  padding: 0 10px;
  position: absolute;
  top: 60px;
  right: 20px;
  width: 300px;
  background-color: #fff;
  border: 1px solid #ccc;
  z-index: 9999999;

  .switchover-top {
    padding-left: 30px;
    height: 30px;
    line-height: 30px;
    font-size: 12px;
    border-bottom: 1px solid #eee;
  }

  .switchover-cent {

    .switchover-item {
      padding: 10px 0;
      border-bottom: 1px solid #eee;

      .el-radio {
          white-space: pre-wrap;
        }
    }
  }
}
</style>



