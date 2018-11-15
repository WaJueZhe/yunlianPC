<template>
    <el-row class="warp">
        <el-col :span="24" class="warp-breadcrum" style="padding:10px">
            <app-title :title="financePassTitle"></app-title>
        </el-col>

        <el-col :span="24" class="warp-main" v-loading="loading" element-loading-text="拼命加载中">
            <el-col :offset="2" :span="12" style="padding-bottom: 0px;">
                <el-form :inline="true" :model="pass" :rules="passFormRule" ref="passForm">
                    <el-row :gutter="10">
                        <el-col :span="24">
                            <img src="../../../../static/img/set_fin_pass_user.png" width="24px" height="24px"/>
                            <b>财务密码设置
                            </b>
                            <hr>
                            <br>
                        </el-col>
                    </el-row>
                    <el-row :gutter="10">
                        <el-col :span="24">
                            <el-form-item label="请输入新密码" prop="finPassword">
                                <el-input type="password" v-model="pass.finPassword" :maxlength="20" placeholder="请输入新密码"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="请确认新密码" prop="finPassword2">
                                <el-input type="password" v-model="pass.finPassword2" :maxlength="20" placeholder="请再次输入新密码"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="请输入验证码" prop="smsCode">
                                <el-input v-model="pass.smsCode" :maxlength="6" placeholder="输入验证码" :disabled="isExistMobile"></el-input>
                            </el-form-item>
                            <el-button @click="sendSmsCode" ref="btnSendSmsCode" :disabled="!show">
                                <span v-show="show">验证码 {{pass.mobileNOMask}}</span>
                                <span v-show="!show" class="count">{{count}} 秒</span>
                            </el-button>
                        </el-col>
                        <el-col :offset="3">
                            <el-button type="primary" @click="submitPassword" :disabled="isExistMobile">保存</el-button>
                            <el-button @click="resetForm">重置</el-button>
                        </el-col>
                        <input type="hidden" v-model="pass.mobileNO">
                    </el-row>
                </el-form>
            </el-col>
        </el-col>
    </el-row>
</template>

<script scoped>
export default {
    data(){
        var validatePasswordTheSame = (rule, value, callback) =>{
            if ((this.pass.finPassword != '') && (this.pass.finPassword2 != '')){
                if (this.pass.finPassword != this.pass.finPassword2){
                    callback(new Error("两次输入的密码不一致！"));
                }else{
                    // 清除之前的校验错误
                    //
                    callback();
                }
            }else{
                callback();
            }
        }; 
        return{
            financePassTitle : '设置财务密码',
            pass: {
                finPassword: '',
                finPassword2: '',
                smsCode: '',
                mobileNO: '',
                mobileNOMask: ''
            },
            loading: false,
            isExistMobile: false,
            show: true,
            count: '',
            timer: null,
            passFormRule: {
                finPassword: [
                    {required: true, message : '请输入新密码', trigger : 'blur'},
                    {min:6, message: '密码长度太短，至少6位', trigger: 'blur'},
                    {validator: validatePasswordTheSame, trigger: 'blur'} //自定义校验
                ],
                finPassword2: [
                    {required: true, message : '请再次确认新密码', trigger : 'blur'},
                    {min:6, message: '密码长度太短，至少6位', trigger: 'blur'},
                    {validator: validatePasswordTheSame, trigger: 'blur'} //自定义校验
                ],
                smsCode: [
                    {required: true, message : '请输入验证码', trigger : 'blur'}
                ]
            }
        }
    },
    methods:{
        submitPassword: function(){
            let that = this;
            this.$refs.passForm.validate((valid) =>{
                if (valid){
                    //开始保存
                    let para = Object.assign({}, this.pass);
                    that.axios.post(`${this.api.baseURL}/sysFinancePassword/updatePassword`, para).then(function(result){
                        // console.log(result);
                        if ((result) && (result.data.code == '200')){
                            that.$message.success({showClose: true, message: '修改成功，请谨慎保管您的专用财务密码！', duration: 2000});
                            that.$refs['passForm'].resetFields();
                        }else{
                            that.$message.error({showClose: true, message: '修改失败：' + result.data.message, duration: 3000});
                        }
                    });
                }
            })
        },
        sendSmsCode: function(){
            const TIME_COUNT = 60;
            let that = this;
            let p = {"phone": this.pass.mobileNO};
            that.axios.post(`${this.api.baseURL}/sysFinancePassword/sendSmsCode`, p).then(function(result){
                if ((result) && (result.data.code == '200')){
                    that.$message.success({showClose: true, message: '短信已发送至手机号：' + that.pass.mobileNO + '！', duration: 2000});
                    if (!that.timer) {
                        that.count = TIME_COUNT;
                        that.show = false;
                        that.timer = setInterval(() => {
                            if (that.count > 0 && that.count <= TIME_COUNT) {
                                that.count--;
                            } else {
                                that.show = true;
                                clearInterval(that.timer);
                                that.timer = null;
                            }
                        }, 1000)
                    }
                }else{
                    that.$message.error({showClose: true, message: '短信发送失败：' + result.data.message + '!', duration: 3000});
                }
            });
        },
        resetForm: function(){
            // 不能用resetFields
            this.pass.finPassword = '';
            this.pass.finPassword2 = '';
            this.pass.smsCode = '';
            this.$refs['passForm'].clearValidate();
        }
    },
    mounted(){
        let that = this;
        that.axios.get(`${this.api.baseURL}/user/getUser`).then(function(result){
            // console.log(result);
            if ((result) && (result.data.code == '200')){
                let t = result.data.data.result.phone;
                that.pass.mobileNO = t;
                that.pass.mobileNOMask = t.substring(0, 3) + '****' + t.substring(7);
            }else{
                that.$message.error({showClose: true, message: '你还未添加联系手机号，请点击右上角的用户图标前往设置！', duration: 3000});
                that.isExistMobile = true;
            }
            // console.log(that.pass.mobileNO);
        });
    }
}
</script>
