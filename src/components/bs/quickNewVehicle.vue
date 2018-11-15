<template>
    <div>
        <el-form :model="addForm" label-width="80px;" :rules="addFormRules" ref="addForm" label-position="right">
             <!-- 必填项 -->
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="车牌号码" prop="vehicleNo">
                        <el-input v-model="addForm.vehicleNo" auto-complete="off"  class="addInt"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="牌照类型" prop="vehicleNumberType">
                        <el-select v-model="addForm.vehicleNumberType" placeholder="牌照类型"  class="addInt">
                            <el-option v-for="i in vehicleNumberTypeEnum" :key="i.val" :label="i.lbl" :value="i.val"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="车型" prop="vehicleType">
                      <el-select v-model="addForm.vehicleType" placeholder="车型" class="addInt">
                        <el-option v-for="i in vehicleTypeEnum" :key="i.val" :label="i.lbl" :value="i.val"></el-option>
                      </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="车高(米)" prop="height">
                      <el-input v-model="addForm.height" auto-complete="off" class="addInt"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="车长(米)" prop="length">
                      <el-input v-model="addForm.length" auto-complete="off" class="addInt"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="车宽(米)" prop="width">
                      <el-input v-model="addForm.width" auto-complete="off" class="addInt"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="最大吨位" prop="maxTon">
                      <el-input v-model="addForm.maxTon" auto-complete="off" class="addInt"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="最大方数" prop="maxSquare">
                      <el-input v-model="addForm.maxSquare" auto-complete="off" class="addInt"></el-input>
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
    var checkNumber = (rule, value, callback) =>{
        if ((!value) || (value == "")){
            callback()
        }
        else if (isNaN(value)){
            callback(new Error('必须为数值!'))
        }else if (parseFloat(value) < 0){
            callback(new Error('必须为正数'))
        }else callback()
    };
    var checkExistsVehicle = (rule, value, callback) => {
      if (this.addForm.vehicleNo != "") {
        let p = {vehicleNO : this.addForm.vehicleNo};
        this.axios
          .post(`${this.api.baseURL}/vehicle_driver/getCountByVehicleNO`, p)
          .then(res => {
            if (parseInt(res.data.data.result) > 0) {
              callback(new Error("已存在相同的车牌号!"));
            } else callback();
          });
      } else callback(); //空值则默认成功
    };
    return{
        vehicleNumberTypeEnum: [{ val: "1", lbl: "大型号牌" }, { val: "2", lbl: "小型号牌" }, { val: "99", lbl: "其他号牌" }
        ],
        vehicleTypeEnum: [
            { val: "H01", lbl: "普通货车" },
            { val: "H02", lbl: "厢式货车" },
            { val: "H04", lbl: "罐式货车" },
            { val: "Q00", lbl: "牵引车" },
            { val: "G01", lbl: "普通挂车" },
            { val: "G03", lbl: "罐式挂车" },
            { val: "G05", lbl: "集装箱挂车" },
            { val: "H09", lbl: "仓栅式货车" },
            { val: "H03", lbl: "封闭货车" },
            { val: "H05", lbl: "平板货车" },
            { val: "H06", lbl: "集装箱车" },
            { val: "H07", lbl: "自卸货车" },
            { val: "H08", lbl: "特殊结构货车" },
            { val: "Z00", lbl: "专项作业车" },
            { val: "G02", lbl: "厢式挂车" },
            { val: "G07", lbl: "仓栅式挂车" },
            { val: "G04", lbl: "平板挂车" },
            { val: "G06", lbl: "自卸挂车" },
            { val: "G09", lbl: "专项作业挂车" },
            { val: "X91", lbl: "车辆运输车" },
            { val: "X92", lbl: "车辆运输车(单排)" }
        ],
        addFormRules: {
            vehicleNo: [
                { required: true, message: "请输入正确的车牌号", trigger: "blur" },
                { min: 7, max: 7, message: "车牌号长度错误", trigger: "blur" },
                { validator: checkExistsVehicle, trigger: "blur" } //自定义校验
            ],
            vehicleNumberType: [
                { required: true, message: "请选择牌照类型", trigger: "blur" }
            ],
            height: [
                {min: 1, max: 4, message: "超出规定长度", trigger: "blur"},
                {validator: checkNumber, trigger: "blur"}
            ],
            length: [
                {min: 1, max: 4, message: "超出规定长度", trigger: "blur"},
                {validator: checkNumber, trigger: "blur"}
            ],
            width: [
                {min: 1, max: 3, message: "超出规定长度", trigger: "blur"},
                {validator: checkNumber, trigger: "blur"}
            ],
            maxTon: [
                {min: 1, max: 4, message: "超出规定长度", trigger: "blur"},
                {validator: checkNumber, trigger: "blur"}
            ],
            maxSquare: [
                {min: 1, max: 4, message: "超出规定长度", trigger: "blur"},
                {validator: checkNumber, trigger: "blur"}
            ]
        },
        addForm: {
            vehicleNo: "",
            vehicleNumberType: ""
        }
    }
    },
methods: {
    resetForm: function(){
        this.$refs['addForm'].resetFields();
    },
    exitForm: function(){
        this.$emit("closeNewVhlDlg", '');
    },
    addSubmit: function() {
        let that = this;
        this.$refs.addForm.validate(valid => {
            if (valid) {
                let para = Object.assign({}, this.addForm);
                //console.table(para);
                that.axios.post(`${this.api.baseURL}/vehicle_driver/createVehicle`, para)
                    .then(function(result) 
                {
                    //console.log(result)
                    if (result && result.status == "200") {
                        //保存成功
                        that.$message.success({ showClose: true, message: "添加成功", duration: 2000});
                        that.$refs["addForm"].resetFields();
                        that.$emit("closeNewVhlDlg", that.addForm.vehicleNo);
                    } else {
                        that.$message.error({showClose: true, message: "添加失败", duration: 2000});
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
        width:100%;
        text-align:center;
    }
</style>