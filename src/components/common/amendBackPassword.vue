<template>
    <div style="width:100%" class="info">

      <div class="box2">
         
        <div class="tip1">
            <img src="../../assets/logo.png" alt="">
        </div>

        <el-form :model="amendPwdForm" label-width="100px" :rules="amendPwdFormRules" ref="amendPwdForm" label-position="right">
    
            <el-form-item label="新密码" prop="newPassword">
                <el-input v-model="amendPwdForm.newPassword" auto-complete="off" type="password" placeholder="新密码" class="addint"></el-input>
            </el-form-item>       
    
            <el-form-item label="确认新密码" prop="newPassword2">
                <el-input v-model="amendPwdForm.newPassword2" auto-complete="off" type="password" placeholder="确认新密码" class="addint"></el-input>
            </el-form-item>       
     
            <el-button @click.native="close">取消</el-button>
            <el-button type="primary" @click.native="addAmend">保存</el-button>

        </el-form>

      </div>

    </div>
</template>

<script>
export default {
  props: ["showAmend"], //必须，实现从父组件向子组件赋值用
  data() {
    var checkNewPassword = (rule, value, callback) => {
      if (this.amendPwdForm.newPassword != this.amendPwdForm.newPassword2) {
        callback(new Error("两次密码不一致"));
      } else {
        callback(); //空值则默认成功
      }
    };
    return {
      disabledAmend:false,
      amendPwdFormRules: {
        newPassword: [
          { required: true, message: "请输入新的密码", trigger: "blur" },
          { min: 6, max: 16, message: "请输入6至16位", trigger: "blur" }
        ],
        newPassword2: [
          { required: true, message: "请输入确认的密码", trigger: "blur" },
          { min: 6, max: 16, message: "请输入6至16位", trigger: "blur" },
          { validator: checkNewPassword, trigger: "blur" } //自定义校验
        ]        
      },
      amendPwdForm: {
        newPassword:"",
        newPassword2:""
      }
    };
  },
  methods: {
      close(){
        this.showAmend = false;
        this.disabledAmend = false;
        this.$emit('cancleAmend',this.showAmend)
      },
      addAmend: function(){
          let that = this
          this.$refs.amendPwdForm.validate((valid) =>{
              if(valid){
                  let p = {
                      newPassword: this.amendPwdForm.newPassword
                    };
                  that.axios.post(`${this.api.baseURL}/userAuth/firstLoginUpdatePwd`, p).then((result)=>{
                      if ((result) && (result.data.code == '200')){ //修改成功
                          that.$message.success({showClose: true, message: '修改成功', duration: 4000});
                          this.close();
                      }else{
                          //console.log("修改失败,返回结果 : "+result.data.message)
                          that.$message.error({showClose: true, message: '修改失败,'+result.data.message, duration: 4000});
                      }
                  })
              }
          })
      }
  },
  mounted() {}
};
</script>

<style lang="less" scoped>
.addint{
    width: 80%;
}
.addint1{
    width: 60%;
}
.bnt{
    width: 20%;
    text-align: center;
}
.box2 {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 6px;
  text-align: center;
  padding: 0 20px;
  box-sizing: border-box;
  background-color: rgba(0, 0, 0, .1);
  .tip1 img {
    width: 24%;
  }

  .tip2 {
    margin-top: 24px;
  }
}

</style>

