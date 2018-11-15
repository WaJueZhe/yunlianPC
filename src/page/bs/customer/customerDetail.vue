<template>
    <el-row class="warp" style="margin:5px;">
        <el-col :span="24" class="warp-breadcrum">
            <app-title :title="customerTitle"></app-title>
        </el-col>
                
        <el-col :span="24" class="warp-main" v-loading="loading" element-loading-text="拼命加载中">
            <!--工具条-->
            <el-col :span="24"  style="padding-bottom: 0px;" >
                <el-form :inline="true" :model="filters" style="margin-right:true;">
                    <el-form-item>
                      
                    </el-form-item>
                </el-form>
            </el-col>
 
            <el-col>
                <el-form :model="editForm" label-width="100px" ref="editForm" >                
                  <!-- 第一行 -->
                    <el-row :gutter="10">
                        <el-col :span="12">
                            <el-form-item label="客户简称" prop="orgName"  >
                                <el-input v-model="editForm.orgName" auto-complete="off" :disabled="true"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="客户代码" prop="orgCode">
                                <el-input v-model="editForm.orgCode" auto-complete="off" :disabled="true"></el-input>
                            </el-form-item>  
                        </el-col>
                    </el-row>
 
                    <el-row :gutter="10">
                        <el-col :span="12">
                    <el-form-item label="企业名称" prop="enterpriseName">
                        <el-input v-model="editForm.enterpriseName" auto-complete="off" placeholder="企业名称" :disabled="true"></el-input>
                    </el-form-item> 
                        </el-col>
                        <el-col :span="12"> 
                    <el-form-item label="营业执照" prop="businessLicenseCode">
                        <el-input v-model="editForm.businessLicenseCode" auto-complete="off" placeholder="营业执照号码" :disabled="true"></el-input>
                    </el-form-item> 
                        </el-col>
                    </el-row>
 
                    <el-row :gutter="10">
                        <el-col :span="12"> 
                            <el-form-item label=" 法人名称" prop="identityName">
                                <el-input v-model="editForm.identityName" auto-complete="off" placeholder="法人名称"  :disabled="true"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12"> 
                            <el-form-item label="法人证件类型" prop="identityType">
                                <el-select v-model="editForm.identityType" placeholder="法人证件类型0表示身份证" :disabled="true" style="width:70%">
                                    <el-option v-for="i in identityTypeEnum" :key="i.val" :label="i.lbl" :value="i.val"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
 
                    <el-row :gutter="10">
                        <el-col :span="12">  
                            <el-form-item label="法人身份证号" prop="identity">
                                <el-input v-model="editForm.identity" auto-complete="off" placeholder="法人身份证号" :disabled="true"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12"> 
                            <el-form-item label="运输许可证" prop="roadTransportLicenseCode">
                                <el-input v-model="editForm.roadTransportLicenseCode" auto-complete="off" placeholder="道路运输许可证号码" :disabled="true" ></el-input>
                            </el-form-item> 
                        </el-col>
                    </el-row>
                     
                    <el-row :gutter="10">
                        <el-col :span="12">
                            <el-form-item label="省市区县" prop="pcdCode" :disabled="true">
                                <!-- 在此实现父子组件之间的传值 @pcdChange由子组件触发向父传值；  :tempPcdText="this.pcdCodeStr"触发子组件的tempPcdText监控-->
                                <add-pcd v-model="editForm.pcdCode" :tempPcdText="this.pcdCodeStr" :styleVal="'width:100%;'" ></add-pcd>
                            </el-form-item>             
                        </el-col>
                        <el-col :span="12"> 
                            <el-form-item label="详细地址" prop="address" >
                                <el-input v-model="editForm.address" auto-complete="off" placeholder="详细地址" :disabled="true"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
    
                    <el-row :gutter="10">
                        <el-col :span="12">
                            <el-form-item label="联系人姓名" prop="satrapName"   >
                                <el-input v-model="editForm.satrapName" auto-complete="off" placeholder="客户机构负责人姓名"  :disabled="true"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12"> 
                            <el-form-item label="联系人电话" prop="satrapPhone"   >
                                <el-input v-model="editForm.satrapPhone" auto-complete="off" placeholder="机构负责人电话" :disabled="true"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                     
                    <el-row :gutter="10">
                        <el-col :span="12">
                    <el-form-item label="邮箱" prop="email" :disabled="true" >
                        <el-input v-model="editForm.email" auto-complete="off" placeholder="邮箱"  :disabled="true"></el-input>
                    </el-form-item>
                        </el-col>
                        <el-col :span="12"> 
                    <el-form-item label="传真" prop="fax">
                        <el-input v-model="editForm.fax" auto-complete="off" placeholder="传真"  :disabled="true"></el-input>
                    </el-form-item>
                        </el-col>
                    </el-row>

                    <el-form-item label="营业执照照片" prop="businessLicensePhoto" >
                        <img :src="editForm.businessLicensePhotoFullPath" style="width:100px;height:100px;"/>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-col>
    </el-row>
</template>

<script>
import pcdSelect from '../../../components/common/cityPicker.vue'
import {getCookie} from "../../../js/cookie.js";
export default{
    data(){  
        return{
            customerTitle:'企业信息管理',
            pcdCode: [],
            pcdName: [],
            pcdCodeStr: ",,", //向子组件赋值用
            taskCateList: [],
            filters:{
            }, 
            loading: false,
            addFormVisible : false,  //新增界面是否显示 
            addForm: {
            }, 
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
            let that = this
            let params = {} 
            that.axios.post(`${this.api.baseURL}/customerOrg/getCurrentCustomerOrg`, params).then(res =>{
                let result = res.data.data.result
                that.editForm = result; 
                that.pcdCode = [result.provinceCode, result.cityCode, result.districtCode];
                that.pcdName = [result.provinceName, result.cityName, result.districtName];
                that.pcdCodeStr = result.provinceCode + "," + result.cityCode +  "," + result.districtCode  //触发向子组件传值
 
            })

        }
    },
    mounted(){
        this.handleSearch();
    },
    components: {
        "add-pcd": pcdSelect   //定义子组件
    }
}
</script>