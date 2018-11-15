<template>
    <div>
        <el-form :model="addForm" label-width="80px;" :rules="addFormRules" ref="addForm" label-position="right">
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="司机姓名" prop="driverName">
                        <el-input v-model="addForm.driverName" auto-complete="off" class="addInt"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="性别" prop="driverSex">
                        <el-select v-model="addForm.driverSex" placeholder="请选择性别" class="addInt">
                            <el-option v-for="i in driverSexTypeEnum" :key="i.val" :label="i.lbl" :value="i.val"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="司机年龄" prop="driverAge">
                        <el-input v-model="addForm.driverAge" auto-complete="off" class="addInt"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="手机" prop="driverMobile">
                        <el-input v-model="addForm.driverMobile" auto-complete="off" class="addInt"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="身份证号" prop="driverIdentityId">
                        <el-input  v-model="addForm.driverIdentityId" auto-complete="off" class="addInt"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer alignCenter" style="margin-bottom:10px;">
          <el-button type="primary" @click.native="addSubmit">保存</el-button>
          <el-button @click="resetForm">重置</el-button>
          <el-button @click="exitForm">退出</el-button>
        </div>
    </div>
</template>

<script scoped>
export default {
    data(){
        //在此自定义校验，如新录入数据，在输入后校验后台是否重复
        var checkExistsDriver = (rule, value, callback) => {
            if (this.addForm.driverMobile != "") {
                if (isNaN(this.addForm.driverMobile)) {
                callback(new Error("手机号必须为数字!"));
                } else if (this.addForm.driverMobile.indexOf("1") != 0) {
                callback(new Error("手机号必须以1开始!"));
                } else {
                let p = {driverMobile: this.addForm.driverMobile};
                this.axios
                    .post(`${this.api.baseURL}/driver/getCountByDriverMobile`, p)
                    .then(res => {
                    if (parseInt(res.data.data.result) > 0) {
                        callback(new Error("已存在相同的手机号!"));
                    } else callback();
                    });
                }
            } else {
                callback(); //空值则默认成功
            }
        };

        var checkExistsDriverIdentityId = (rule, value, callback) => {
            let reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
                if(reg.test(value) === false){
                    callback(new Error("您输入的身份不合法"));
                }else{
                // 后台校验 
                let pa = {idCard: value};
                this.axios.post(`${this.api.baseURL}/common/checkIdCardFormat`, pa)
                .then(res => {
                    if (!res.data.data.result) {
                        //后台校验不合法
                        callback(new Error("您输入的身份不正确"));
                    } else {
                        //后台校验合法,再次请求，校验身份证是否重复
                        let p = {driverIdentityId: value};
                        this.axios
                        .post(`${this.api.baseURL}/driver/getCountByDriverIdentityId`, p)
                        .then(res => {
                            if (parseInt(res.data.data.result) > 0) {
                            callback(new Error("同一客户已存在相同的身份证号!"));
                            } else {
                                callback();
                            }
                        }); 
                    }
                });
            }
        };
        var checkDriverAge = (rule, value, callback) => {
            //let regu = /^([1-9][0-9]*){2}$/;
            let driverAge = this.addForm.driverAge;
            if (driverAge != "") {
                if (isNaN(driverAge)){
                //if (!regu.test(driverAge)) {
                    callback(new Error("年龄应为两位正整数"));
                } else if (driverAge < 18 || driverAge > 65) {
                    callback(new Error("年龄为18 至 65岁"));
                } else {
                callback();
                }
            } else {
                callback(); //空值则默认成功
            }
        };
        return{
            driverSexTypeEnum: [{ val: "1", lbl: "男" }, { val: "2", lbl: "女" }], //定义下拉框的options
            addForm: {
                driverName: "",
                driverAge: "",
                driverMobile: "",
                driverIdentityId: "",
                driverLicenseNumber: ""
            },
            addFormRules: {
                driverName: [
                    { required: true, message: "请输司机名称", trigger: "blur" },
                    { min: 2, max: 11, message: "请输司机名称", trigger: "blur" }
                ],
                driverSex: [
                    { required: true, message: "请输选择性别", trigger: "blur" }
                ],
                driverAge: [
                    { required: true, message: "请输输入年龄", trigger: "blur" },
                    { min: 2, max: 2, message: "司机年龄为两位整数", trigger: "blur" },
                    { validator: checkDriverAge, trigger: "blur" } //自定义校验
                ],
                driverMobile: [
                    { required: true, message: "请输入手机号", trigger: "blur" },
                    { min: 11, max: 11, message: "手机号码错误", trigger: "blur" },
                    { validator: checkExistsDriver, trigger: "blur" } //自定义校验
                ],
                driverIdentityId: [
                    { required: true, message: "请输身份证", trigger: "blur" },
                    {
                        min: 15,
                        max: 18,
                        message: "身份证号码号15位或18位",
                        trigger: "blur"
                    },
                    { validator: checkExistsDriverIdentityId, trigger: "blur" } //自定义校验
                ]
                }
        }
    },
    methods: {
        resetForm: function(){
            this.$refs['addForm'].resetFields();
        },
        exitForm: function(){
            this.$emit("closeNewDrvDlg", '');
        },
        addSubmit: function() {
            let that = this;
            this.$refs.addForm.validate(valid => {
                if (valid) {
                    let para = Object.assign({}, this.addForm);
                    that.axios
                        .post(`${this.api.baseURL}/driver/createDriver`, para)
                        .then(function(result) {
                            //console.log(result);
                            if (result && result.status == "200") {
                                //保存成功
                                that.$message.success({ showClose: true, message: "添加成功", duration: 2000 });
                                that.$refs["addForm"].resetFields();
                                that.$emit("closeNewDrvDlg", that.addForm.driverMobile);
                            } else {
                                that.$message.error({showClose: true, message: "添加失败", duration: 2000 });
                            }
                        });
                }
            });
        }
    }
}
</script>
<style lang="less" scoped>
    .addInt {
        width: 75%;
        float: right;
    }
    .addint1 {
        width: 92%;
    }
    .alignCenter{
        width:100%;text-align:center;
    }
</style>