<template>
    <div style="width:100%">
         
        <el-form :model="findPwdForm" label-width="100px" :rules="findPwdFormRules" ref="findPwdForm" label-position="right">

            <el-form-item label="登录帐号" prop="userCode" >
                <el-input v-model="findPwdForm.userCode" auto-complete="off" placeholder="登录帐号" class="addint" :disabled="disabledFlag" style="80%"></el-input>
            </el-form-item>       

            <el-form-item label="手 机号" prop="phone" >
                <el-input v-model="findPwdForm.phone" auto-complete="off" :maxlength="11" placeholder="手机号" class="addint addint1" :disabled="disabledFlag" style="80%"></el-input>
                <!-- <el-button type="primary" @click.native="sendCheckCode" :disabled="disabledFlag" class="bnt">{{msg}}</el-button> -->
                <span @click="sendCheckCode" :disabled="disabledFlag" class="bnt">{{msg}}</span>
            </el-form-item>
            
            
            <el-form-item label="手机验证码" prop="checkCode">
                <el-input v-model="findPwdForm.checkCode" :maxlength="4" auto-complete="off" placeholder="手机验证码" class="addint"></el-input>
            </el-form-item>
    
            <el-form-item label="新密码" prop="newPassword">
                <el-input v-model="findPwdForm.newPassword" :maxlength="16" auto-complete="off" type="password" placeholder="新密码" class="addint"></el-input>
            </el-form-item>       
    
            <el-form-item label="确认新密码" prop="newPassword2">
                <el-input v-model="findPwdForm.newPassword2" :maxlength="16" auto-complete="off" type="password" placeholder="确认新密码" class="addint"></el-input>
            </el-form-item>       
     
            <div class="alignCenter">
                <el-button type="primary" @click.native="addSubmit" @keyup.13="alert">提交</el-button>
                <el-button @click.native="close">取消</el-button>
            </div>
        </el-form>

    </div>
</template>

<script>
export default {
  props: ["showFlag"], //必须，实现从父组件向子组件赋值用
  data() {
    var checkExistsPhoneDesc = (rule, value, callback) => {
      if (value != "") {
        if (isNaN(value)) {
          callback(new Error("手机号必须为数字!"));
        }else if(value.indexOf("1") != 0) {
          callback(new Error("手机号必须以1开始!"));
        }else {
	        callback(); //空值则默认成功
        }
      } else {
        callback(); //空值则默认成功
      }
    };
    var checkNewPassword = (rule, value, callback) => {
       if (this.findPwdForm.newPassword != this.findPwdForm.newPassword2) {
        callback(new Error("两次密码不一致"));
      } else {
        callback(); //空值则默认成功
      }
    };
    return {
      msg:'发送验证码',
      disabledFlag:false,
      findPwdFormRules: {
        userCode: [
          { required: true, message: "登录帐号", trigger: "blur" },
          { min: 3, max: 20, message: "登录帐号至少3位", trigger: "blur" }
        ],
        phone: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { min: 11,max: 11,message: "手机号码错误,11位手机号",trigger: "blur"},
          { validator: checkExistsPhoneDesc, trigger: "blur" } //自定义校验
        ],
        checkCode: [
        //   { required: true, message: "请输入验证码", trigger: "blur" },
          { min: 4, max: 4, message: "请输入4位验证码", trigger: "blur" }
        ],
        newPassword: [
        //   { required: true, message: "请输入新的密码", trigger: "blur" },
          { min: 6, max: 16, message: "请输入6至16位", trigger: "blur" },
        ],
        newPassword2: [
        //   { required: true, message: "请输入确认的密码", trigger: "blur" },
          { min: 6, max: 16, message: "请输入6至16位", trigger: "blur" },
          { validator: checkNewPassword, trigger: "blur" } //自定义校验
        ]        
      },
      findPwdForm: {  
        userCode:"",
        phone:"",
        checkCode:"",
        newPassword:"",
        newPassword2:""
      }
    };
  },
  methods: {
      close(){
        this.showFlag = false;
        this.disabledFlag = false;
        this.$emit('cancleEvent',this.showFlag)
      },
      time(){
          this.disabledFlag = true;
          let count = 60;
          let self = this;
          let timer = setInterval(function(){
              count --;
              self.msg = "重新发送(" + count + ")"; 
              if(count == 0){
                  self.msg = '重新发送';
                  self.disabledFlag = false;
                  clearInterval(timer);
              }
          }, 1000);
      },
      sendCheckCode: function(){
         if(this.findPwdForm.userCode == '') {
                this.$alert('请输入登录账号', '温馨提示', {
                confirmButtonText: '确定',
            });
            return;
          }
          if(this.findPwdForm.phone == '') {
                this.$alert('请输入手机号码', '温馨提示', {
                confirmButtonText: '确定',
            });
            return;
          }
        let that = this
        this.$refs.findPwdForm.validate((valid) =>{
            if(valid){
                let p = {userCode: this.findPwdForm.userCode, phone: this.findPwdForm.phone};
                that.axios.post(`${this.api.baseURL}/userAuth/getBackUserPwdSendCheckCode`, p).then((result)=>{
                    if ((result) && (result.data.code == '200')){ //发送成功
                        that.$message.success({showClose: true, message: '发送成功', duration: 4000});
                        that.time();
                    }else{
                        // console.log(result.data.message)
                        that.$message.error({showClose: true, message: '发送失败' + result.data.message, duration: 4000});
                    }
                })
            }
        })
      },
      addSubmit: function(){
          if(this.findPwdForm.userCode == '') {
                this.$alert('请输入登录账号', '温馨提示', {
                confirmButtonText: '确定',
            });
            return;
          }
          if(this.findPwdForm.phone == '') {
                this.$alert('请输入手机号码', '温馨提示', {
                confirmButtonText: '确定',
            });
            return;
          }
          else if(this.findPwdForm.checkCode == '') {
                this.$alert('请输入验证码', '温馨提示', {
                confirmButtonText: '确定',
            });
            return;
          }
          let that = this
          this.$refs.findPwdForm.validate((valid) =>{
              if(valid){
                  let p = {
                      userCode: this.findPwdForm.userCode, 
                      phone: this.findPwdForm.phone, 
                      checkCode: this.findPwdForm.checkCode,
                      newPassword: this.findPwdForm.newPassword
                    };
                  that.axios.post(`${this.api.baseURL}/userAuth/getBackUserPwdInsureCheckCode`, p).then((result)=>{
                      if ((result) && (result.data.code == '200')){ //修改成功
                          that.$message.success({showClose: true, message: '修改成功', duration: 4000});
                          this.close();
                      }else{
                          this.disabledFlag = true;
                        //   console.log(result.data.message) 
                          that.$message.error({showClose: true, message: '修改失败' + result.data.message, duration: 4000});
                      }
                  })
              }
          })
      }
  },
  mounted() {
    //   this.addSubmit();
  },
  created() {
    // 主页添加键盘事件,注意,不能直接在焦点事件上添加回车
    var self = this;
    document.onkeydown = function(e) {
      var key = e.which;
      if (key == 13) {
        return;
      }
    };
  },
};
</script>

<style lang="less" scoped>
.addint{
    width: 80%;
}
.addint1{
    width: 60%;
}
.el-form-item {
  .bnt{
      display: inline-block;
      width: 90px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      color: #fff;
      border: 1px solid #409EFF;
      border-radius: 5px;
      background-color: #409EFF;
      cursor: pointer;
  }
}
.alignCenter{
    text-align:center;
}
</style>

