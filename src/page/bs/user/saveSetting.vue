<template>
    <el-row class="warp" style="margin:5px;">
        <el-col :span="24" class="warp-breadcrum" style="padding:10px;">
            <app-title :title="pcdTitle"></app-title>
        </el-col>

                
        <el-col :span="24" class="warp-main" v-loading="loading" element-loading-text="拼命加载中">
            <!-- 工具条 -->
            <el-col :span="24"  style="padding-bottom: 0px;">
                <el-form :inline="true" :model="filters" style="margin-right:true;">
                    <el-tabs v-model="activeName">
                        <el-tab-pane label="安全管理" name="first">
                            <!-- 弹出框 -->
                            <!-- <el-col> -->
                                <el-form :model="addForm" label-width="100px" :rules="addFormRules" ref="addForm">
                                <!-- 第一行 -->
                                    <el-row :gutter="20"> 
                                        <el-col :span="12" class="code">
                                            <el-form-item label="旧密码" prop="oldPassword">
                                                <el-input type="password" v-model="addForm.oldPassword" auto-complete="off" placeholder="请输入老密码" class="input"></el-input>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                    <el-row :gutter="20"> 
                                        <el-col :span="12">
                                            <el-form-item label="新密码" prop="newPassword" >
                                                <el-input type="password" v-model="addForm.newPassword" auto-complete="off" placeholder="请输入新密码" class="input"></el-input>
                                            </el-form-item> 
                                        </el-col>
                                    </el-row>
                                    <el-row :gutter="20"> 
                                        <el-col :span="12">
                                            <el-form-item label="确认新密码" prop="newPassword2" >
                                                <el-input type="password" v-model="addForm.newPassword2" auto-complete="off" placeholder="请确认新密码" class="input"></el-input>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>

                                    <el-button type="primary" @click.native="updateSubmit">保存</el-button>
                                
                                </el-form>
                            <!-- </el-col> -->
                        </el-tab-pane>
                        <el-tab-pane label="更换手机号" name="second">
                            <el-col>
                                <el-form :model="phoneForm" label-width="100px" :rules="newPhoneRules" ref="phoneForm" label-position="right">
                                    <el-row :gutter="20"> 
                                        <el-col :span="12">
                                            <el-form-item label="旧手机号" prop="oldPhone">
                                                <el-input v-model="phoneForm.oldPhone" :maxlength="11" auto-complete="off" placeholder="请输入旧的手机号码" :disabled="disabledFlag" class="input"></el-input>
                                                <el-button type="primary" :disabled="disabledFlag" @click.native="sendCheckCode"  class="bnt">{{msg}}</el-button>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                    <el-row :gutter="20"> 
                                        <el-col :span="12">
                                            <el-form-item label="验证码" prop="checkCode">
                                                <el-input v-model="phoneForm.checkCode" :maxlength="4" auto-complete="off" placeholder="手机验证码" class="input"></el-input>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                    <el-row :gutter="20"> 
                                        <el-col :span="12">
                                            <el-form-item label="新手机号" prop="newPhone">
                                                <el-input v-model="phoneForm.newPhone" :maxlength="11" auto-complete="off" placeholder="请输入新的手机号码" class="input"></el-input>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                    <el-button type="primary" @click.native="changePhone">更改手机</el-button>
                                </el-form>
                            </el-col>
                        </el-tab-pane>
                    </el-tabs>
                </el-form>
            </el-col>

            <!-- 弹出框
            <el-col>
                <el-form :model="addForm" label-width="100px;" :rules="addFormRules" ref="addForm">
                  第一行
                    <el-row :gutter="10"> 
                        <el-col :span="12">
                            <el-form-item label="老密码" prop="oldPassword">
                                <el-input type="password" v-model="addForm.oldPassword" auto-complete="off" placeholder="请输入老密码"></el-input>
                            </el-form-item> 
                            <el-form-item label="新密码" prop="newPassword">
                                <el-input type="password" v-model="addForm.newPassword" auto-complete="off" placeholder="请输入新密码"></el-input>
                            </el-form-item> 
                            <el-form-item label="确认新密码" prop="newPassword2">
                                <el-input type="password" v-model="addForm.newPassword2" auto-complete="off" placeholder="请确认新密码"></el-input>
                            </el-form-item>
                        </el-col> 
                    </el-row> 

                    <el-button type="primary" @click.native="updateSubmit">保存</el-button>
                   
                </el-form>
            </el-col> -->
         </el-col>
    </el-row>
</template>

<script>
import {getCookie} from "../../../js/cookie.js";
import { delCookie } from "../../../js/cookie.js";
export default{
    data(){
        var checkNewPassword = (rule, value, callback) =>{
            if(this.addForm.newPassword2 == ""){
                callback(new Error('输入确认密码!')) 
            }else if (this.addForm.newPassword != this.addForm.newPassword2){
                callback(new Error('两次密码不一致!')) 
            }else{
                callback()  //空值则默认成功
            }
        };
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
        return{
            msg:'发送验证码',
            disabledFlag:false,
            activeName: 'first',
            pcdTitle:'安全设置',
            pcdCode: [],
            pcdName: [],
            pcdCodeStr: ",,", //向子组件赋值用
            taskCateList: [],
            filters:{
            }, 
            loading: false,
            addFormVisible : false,  //新增界面是否显示
            addFormRules :{
                oldPassword: [
                    {required: true, message: '请输入老密码', trigger: 'blur'},
                    {min:6,max:16, message: '密码长度 6 ~ 16  位', trigger: 'blur'}
                ],
                newPassword: [
                    {required: true, message: '请输入新密码', trigger: 'blur'},
                    {min:6,max:16, message: '密码长度 6 ~ 16  位', trigger: 'blur'}
                ],
                newPassword2: [
                    {required: true, message: '请输入新密码', trigger: 'blur'},
                    {min:6,max:16, message: '密码长度 6 ~ 16 位', trigger: 'blur'},
                    {validator: checkNewPassword, trigger: 'blur'}
                ]
            },
            newPhoneRules :{
                oldPhone: [
                    {required: true, message: '请输入旧的手机号码', trigger: 'blur'},
                    {min:11,max:11, message: '手机错误，11位手机号', trigger: 'blur'},
                    { validator: checkExistsPhoneDesc, trigger: "blur" } //自定义校验
                ],
                checkCode: [
                    // {required: true, message: '请输入验证码', trigger: 'blur'},
                    {min:4,max:4, message: '请输入4位验证码', trigger: 'blur'},
                ],
                newPhone: [
                    // {required: true, message: '请输入新的手机号码', trigger: 'blur'},
                    {min:11,max:11, message: '手机错误，11位手机号', trigger: 'blur'},
                    { validator: checkExistsPhoneDesc, trigger: "blur" } //自定义校验
                ],
            },
            addForm: {
                oldPassword: "",
                newPassword: "",
                newPassword2: ""
            },
            phoneForm: {
                oldPhone: "",
                checkCode: "",
                newPhone: "",
            },
            editFormVisible: true,
            editForm: {
                id: "",
                orgName: "",
                orgCode: "",
                pcdCode: [],
                pcdName: [],
                pcdCodeStr: ",," //向子组件赋值用             
            },  
            identityTypeEnum: [{val: '0', lbl: '身份证'}]
        }
    },
    methods:{
    //     handleClick(tab, event) {
    //     console.log(tab, event);
    //   },
        pcdChange(msg){ //由子组件触发，向父组件传值。 本页面为父组件
            this.pcdCode = msg.codes;
            this.pcdName = msg.names;
            this.pcdCodeStr = msg.codes.join(",")
            //this.convertAddr2LonLat(); //重算经纬度
        },
        handleSearch(){
            this.search();
        }, 
        search: function(){
            this.addForm.oldPassword = "";
            this.addForm.newPassword = "";
            this.addForm.newPassword2 = "";
            // let that = this
            // let params = {} 
            // that.axios.post(`${this.api.baseURL}/customerOrg/getCurrentCustomerOrg`, params).then(res =>{
            //     let result = res.data.data.result
            //     that.editForm = result;    
            // })

        },
        updateSubmit: function(){
            let that = this
            this.$refs.addForm.validate((valid) =>{
                if(valid){
                    let p = {oldPassword: this.addForm.oldPassword, newPassword: this.addForm.newPassword};
                    that.axios.post(`${this.api.baseURL}/userAuth/updatePassword`, p).then(function(result){
                        if ((result) && (result.data.code == '200')){ //保存成功
                            that.$message.success({showClose: true, message: '修改成功', duration: 2000});
                            that.$refs['addForm'].resetFields();
                            that.addFormVisible = false;
                            delCookie("tokenid");
                            that.$router.push({ path: "/" }); 
                            //that.search();
                        }else{
                            that.$message.error({showClose: true, message: result.data.message, duration: 2000});
                        }
                    })
                }
            })
        },
        // 验证码倒计时
        time(){
          this.disabledFlag = true;
          let count = 60;
          let self = this;
          clearInterval(timer);
          let timer = setInterval(() => {
              count --;
              self.msg = "重新发送(" + count + ")"; 
              if(count == 0){
                  self.msg = '发送验证码';
                  self.disabledFlag = false;
                  clearInterval(timer);
              }
          }, 1000);
      },
        //更换手机的验证码
        sendCheckCode() {
            if(this.phoneForm.oldPhone == '') {
                this.$alert('请输入旧的手机号码', '温馨提示', {
                confirmButtonText: '确定',
            });
            return;
          };
        //   this.time();
            let that = this
            this.$refs.phoneForm.validate((valid) =>{
                if(valid){
                    let p = {phone: this.phoneForm.oldPhone};
                    that.axios.post(`${this.api.baseURL}/userAuth/updateUserPhoneSendCheckCode`, p).then((result)=>{
                        if ((result) && (result.data.code == '200')){ //发送成功
                            that.$message.success({showClose: true, message: '发送成功', duration: 4000});
                            that.time();
                        }else{
                            // console.log(result.data.message)
                            that.$message.error({showClose: true, message: '发送失败，' + result.data.message, duration: 4000});
                        }
                    })
                }
            })
        },
        //更换手机
        changePhone: function(){
            if (this.phoneForm.oldPhone == '') {
                this.$alert('请输入旧的手机号码', '温馨提示', {
                confirmButtonText: '确定',
              });
              return;
            }
            if (this.phoneForm.checkCode == '') {
                this.$alert('请输入验证码', '温馨提示', {
                confirmButtonText: '确定',
              });
              return;
            }
            if (this.phoneForm.newPhone == '') {
                this.$alert('请输入新的手机号码', '温馨提示', {
                confirmButtonText: '确定',
              });
              return;
            }
            let self = this
            self.$refs.phoneForm.validate((valid) =>{
                if(valid){
                    let p = {phone: self.phoneForm.oldPhone, newPhone: self.phoneForm.newPhone, checkCode: self.phoneForm.checkCode};
                    self.axios.post(`${self.api.baseURL}/userAuth/updateUserPhoneByCheckCode`, p).then(function(result){
                        if ((result) && (result.data.code == '200')){ //保存成功
                            self.$message.success({showClose: true, message: '修改成功', duration: 2000});
                            self.$refs['phoneForm'].resetFields();
                            // that.addFormVisible = false;
                            // delCookie("tokenid");
                            self.$router.push({ path: '/user/saveSetting' });
                            //that.search();
                        }else{
                            self.$message.error({showClose: true, message: result.data.message  + "  ", duration: 2000});
                        }
                    })
                }
            })
        },
    },
    mounted(){
        this.handleSearch();
    }
}
</script>

<style lang="less" scoped>
.addint{
    width: 80%;
}
.addint1{
    width: 60%;
}
.bnt{
    text-align: center;
}
.input {
    width: 200px;
    margin-left: -80px;
}
</style>