<template>
    <el-row class="warp" style="margin:5px">
        <el-col :span="24" class="warp-breadcrum" style="padding:10px;">
             <app-title :title="userTitleL"></app-title>
        </el-col>
                
        <el-col :span="24" class="warp-main" v-loading="loading" element-loading-text="拼命加载中">
            <!--工具条-->
            <el-col :span="24">
                <el-form :inline="true" :model="filters">
                    <el-form-item>
                        <el-input v-model="filters.orgName" placeholder="客户简称" style="min-width: 120px;"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-input v-model="filters.orgCode" placeholder="客户代码" style="min-width: 120px;"></el-input>
                    </el-form-item>
                    <el-form-item>
                    <el-button type="primary" @click="handleSearch" @keyup.13="alert">查询</el-button>
                    </el-form-item>
                    <el-form-item>
                    <el-button type="primary" @click="handleAddNew">新增</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        
            <!--列表-->
            <el-table :data="taskCateList" highlight-current-row v-loading="loading" stripe :border="true" class="customerListTable">
                <el-table-column type="index" label="序号" width="50" align="center">
                </el-table-column>
                <el-table-column prop="id" label="id" align="center" v-if="false"></el-table-column>
                <el-table-column prop="businessLicensePhotoFullPath" label="营业执照" v-if="false"></el-table-column>
                <el-table-column prop="cusLogoPhotoFullPath" label="客户logo" v-if="false"></el-table-column>
                <el-table-column prop="orgName" label="客户简称" align="center" :show-overflow-tooltip="true"></el-table-column>

                <el-table-column prop="enterpriseName" label="企业名称" align="center" :show-overflow-tooltip="true"></el-table-column>

                <el-table-column prop="orgCode" label="客户代码" align="center"></el-table-column>

                <el-table-column prop="satrapName" label="客户联系人" align="center"></el-table-column>
                <el-table-column prop="satrapPhone" label="联系人手机" align="center"></el-table-column>
                <el-table-column prop="email" label="联系人邮箱" align="center" min-width="100"></el-table-column>

                <el-table-column prop="createTime" label="创建时间" align="center" min-width="110"></el-table-column>
                <el-table-column prop="bcStatus" label="上链状态" align="center" :formatter="formatBcStatus" width="80"></el-table-column>
                
                <el-table-column label="操作" width="100" fixed="right" align="center">
                <template slot-scope="scope">
                    <el-button @click="showEditDialog(scope.$index,scope.row)">编辑</el-button>
                    <el-button @click="del(scope.$index,scope.row)">删除</el-button>
                </template>
                </el-table-column>              
            </el-table>

            <!--工具条-->
            <el-col :span="24" class="toolbar">
                <el-pagination layout="total, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-size="limit" :total="total" background style="float:right;">
                </el-pagination>
            </el-col>

            <!--新增弹出框-->
            <el-dialog title="新增" :visible.sync="addFormVisible" :before-close="addClose" custom-class="myClass">
                <el-form :model="addForm" label-width="100px" :rules="addFormRules" ref="addForm" label-position="right">

                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="客户简称" prop="orgName">
                                <el-input v-model="addForm.orgName" auto-complete="off" placeholder="客户简称" class="addint"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="客户代码" prop="orgCode">
                                <el-input v-model="addForm.orgCode" auto-complete="off" placeholder="客户代码" class="addint"></el-input>
                            </el-form-item>        
                        </el-col>
                    </el-row>

                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="企业名称" prop="enterpriseName">
                                <el-input v-model="addForm.enterpriseName" auto-complete="off" placeholder="企业名称" class="addint"></el-input>
                            </el-form-item>  
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="法人证件类型" prop="identityType">
                                <el-select v-model="addForm.identityType" placeholder="法人证件类型" class="addint">
                                    <el-option v-for="i in identityTypeEnum" :key="i.val" :label="i.lbl" :value="i.val"></el-option>
                                    </el-select>
                            </el-form-item>        
                        </el-col>
                    </el-row>

                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="法人名称" prop="identityName">
                                <el-input v-model="addForm.identityName" auto-complete="off" placeholder="法人名称" class="addint"></el-input>
                            </el-form-item>       
                        </el-col>
                        <el-col :span="12">   
                            <el-form-item label="法人身份证号" prop="identity" >
                                <el-input v-model="addForm.identity" :maxlength="18" auto-complete="off" placeholder="法人身份证号" class="addint"></el-input>
                            </el-form-item>        
                        </el-col>
                    </el-row>

                    <el-row :gutter="20">
                        <el-col :span="12">   
                            <el-form-item label="营业执照" prop="businessLicenseCode">
                                <el-input v-model="addForm.businessLicenseCode" auto-complete="off" placeholder="营业执照号码" class="addint"></el-input>
                            </el-form-item>        
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="运输许可证" prop="roadTransportLicenseCode">
                                <el-input v-model="addForm.roadTransportLicenseCode" auto-complete="off" placeholder="道路运输许可证号码" class="addint"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="省市区县" prop="pcdCode" >
                                <!-- 在此实现父子组件之间的传值 @pcdChange由子组件触发向父传值；  :tempPcdText="this.pcdCodeStr"触发子组件的tempPcdText监控-->
                                <add-pcd v-model="addForm.pcdCode" @pcdChange="pcdChange" :tempPcdText="this.pcdCodeStr"  :styleVal="'width:95%;'" ></add-pcd>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="详细地址" prop="address">
                                <el-input v-model="addForm.address" auto-complete="off" placeholder="详细地址" class="addint"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="联系人姓名" prop="satrapName">
                                <el-input v-model="addForm.satrapName" auto-complete="off" placeholder="客户联系人姓名" class="addint"></el-input>
                            </el-form-item>   
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="联系人电话" prop="satrapPhone">
                                <el-input v-model="addForm.satrapPhone" :maxlength="11"  auto-complete="off" placeholder="联系人电话" class="addint"></el-input>
                            </el-form-item>       
                        </el-col>
                    </el-row>
                    <el-collapse-transition>
                        <div class="apse" v-show="addShow">
                            <el-row :gutter="20">
                                <el-col :span="12">
                                    <el-form-item label="传真" prop="fax">
                                        <el-input v-model="addForm.fax" auto-complete="off" placeholder="传真" class="addint"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="联系人邮箱" prop="email"
                                      :rules="[
                                          { required: false, message: '请输入邮箱地址', trigger: 'blur' },
                                          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur,change' }
                                        ]">
                                        <el-input v-model="addForm.email" auto-complete="off" placeholder="客户联系人邮箱" class="addint"></el-input>
                                    </el-form-item>       
                                </el-col>
                            </el-row>
                            <el-row :gutter="20">
                                <el-col :span="12">
                                    <el-form-item label="网页地址" prop="webAddress">
                                        <el-input v-model="addForm.webAddress" auto-complete="off" placeholder="网页地址" class="addint"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="邮政编码" prop="zipcode">
                                        <el-input v-model="addForm.zipcode" auto-complete="off" placeholder="邮政编码" class="addint"></el-input>
                                    </el-form-item>   
                                </el-col>
                            </el-row>
                            <el-row :gutter="20" v-show="false"> <!-- 暂时不用到 -->
                                <el-col :span="12">
                                    <el-form-item label="状态" prop="status">
                                        <el-select v-model="addForm.status" placeholder="状态" class="addint">
                                            <el-option v-for="i in statusEnum" :key="i.val" :label="i.lbl" :value="i.val"></el-option>
                                            </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">      
                                </el-col>
                            </el-row>
                            <el-row :gutter="20"> 
                                <el-col :span="24">
                                    <el-form-item label="描述" prop="noti">
                                        <el-input v-model="addForm.noti" auto-complete="off" placeholder="描述" class="addint addint1"></el-input>
                                    </el-form-item>        
                                </el-col>
                            </el-row>
                            
                            <el-row :gutter="20">
                              <el-col :span="12">
                                <el-form-item label="营业执照照片" prop="businessLicensePhoto">

                                    <app-uploadImg :uploadUrl="liceCode" @getImgsrc="licemethod" :operate="parentOperate"></app-uploadImg>

                                    <!-- <el-input type="text" v-model="addForm.businessLicensePhoto" auto-complete="off" :disabled="true" v-if="false"></el-input>
                                    <el-upload class="upload-demo" list-type="picture" :action="upLoadPhotoUrl" :auto-upload="false" ref="businessLicensePhoto_ref" 
                                        :beforeUpload="beforeUpload_businessLicensePhoto" :onSuccess="uploadSuccess_businessLicensePhoto"  accept=".xls,.xlsx">
                                    <el-button size="small" type="primary">选择上传</el-button>
                                    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                                    </el-upload>
                                    <img :src="businessLicensePhoto_url" style="width:100px;height:100px;"/>
                                    <el-button type="primary" @click.native="submitbusinessLicensePhoto">上传</el-button> -->
                                </el-form-item>
                              </el-col>
                              <el-col :span="12">
                                <el-form-item label="客户logo" prop="cusLogoPhoto">

                                    <app-uploadImg :uploadUrl="clientCode" @getImgsrc="clientmethod"  :operate="parentOperate"></app-uploadImg>
                                    <!-- <el-input type="text" v-model="addForm.cusLogoPhoto" auto-complete="off" :disabled="true" v-if="false"></el-input>
                                    <el-upload class="upload-demo" list-type="picture" :action="upLoadPhotoUrl" :auto-upload="false" ref="cusLogoPhoto_ref" 
                                        :beforeUpload="beforeUpload_cusLogoPhoto" :onSuccess="uploadSuccess_cusLogoPhoto"  accept=".xls,.xlsx">
                                    <el-button size="small" type="primary">选择上传</el-button>
                                    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                                    </el-upload>
                                    <img :src="cusLogoPhoto_url" style="width:100px;height:100px;"/>
                                    <el-button type="primary" @click.native="submitcusLogoPhoto">上传</el-button> -->
                                </el-form-item>
                              </el-col>
                          </el-row>

                            <el-form-item label="客户类型" prop="type" v-show="false">
                                <el-input v-model="addForm.type" auto-complete="off" placeholder=" (没用到这字段)请选择客户类型 1 企业 2 个体户"></el-input>
                            </el-form-item>
                           
                        </div>

                        
                    </el-collapse-transition>
                    <div class="more" @click="addShow = !addShow" v-if="addShow == false">点击显示更多</div>   
                    <div class="more" @click="addShow = !addShow" v-else>收起</div>   

                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click.native="cancel">取消</el-button>
                    <el-button type="primary" @click.native="addSubmit">保存</el-button>
                </div>
            </el-dialog>
            <!-- 编辑弹出框 -->
            <el-dialog title="编辑" :visible.sync ="editFormVisible" :before-close="editClose" custom-class="myClass">
                <el-form :model="editForm" label-width="100px"  :rules="updateFormRules"  ref="editForm" label-position="right">
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="客户简称" prop="orgName">
                                <el-input v-model="editForm.orgName" auto-complete="off" placeholder="客户简称" class="addint"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="客户代码" prop="orgCode">
                                <el-input v-model="editForm.orgCode" auto-complete="off" placeholder="客户代码" class="addint" :disabled="true"></el-input>
                            </el-form-item> 
                        </el-col>
                    </el-row>

                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="企业名称" prop="enterpriseName">
                                <el-input v-model="editForm.enterpriseName" auto-complete="off" placeholder="企业名称" class="addint"></el-input>
                            </el-form-item> 
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="法人证件类型" prop="identityType">
                                <el-select v-model="editForm.identityType" placeholder="法人证件类型"  class="addint">
                                    <el-option v-for="i in identityTypeEnum" :key="i.val" :label="i.lbl" :value="i.val"></el-option>
                                </el-select>
                            </el-form-item>       
                        </el-col>
                    </el-row>

                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label=" 法人名称" prop="identityName">
                                <el-input v-model="editForm.identityName" auto-complete="off" placeholder="法人名称" class="addint"></el-input>
                            </el-form-item>       
                        </el-col>
                        <el-col :span="12">   
                            <el-form-item label="法人身份证号" prop="identity">
                                <el-input v-model="editForm.identity" :maxlength="18" auto-complete="off" placeholder="法人身份证号" class="addint"></el-input>
                            </el-form-item>      
                        </el-col>
                    </el-row>

                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="营业执照" prop="businessLicenseCode">
                                <el-input v-model="editForm.businessLicenseCode" auto-complete="off" placeholder="营业执照号码" class="addint"></el-input>
                            </el-form-item>  
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="运输许可证" prop="roadTransportLicenseCode">
                                <el-input v-model="editForm.roadTransportLicenseCode" auto-complete="off" placeholder="道路运输许可证号码" class="addint"></el-input>
                            </el-form-item>  
                        </el-col>
                    </el-row>
                    
                    <el-row :gutter="20">
                        <el-col :span="12"> 
                            <el-form-item label="省市区县" prop="pcdCode">
                                <!-- 在此实现父子组件之间的传值 @pcdChange由子组件触发向父传值；  :tempPcdText="this.pcdCodeStr"触发子组件的tempPcdText监控-->
                                <add-pcd v-model="editForm.pcdCode" @pcdChange="pcdChange" :tempPcdText="this.pcdCodeStr" :styleVal="'width:95%;'" ></add-pcd>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="地址" prop="address">
                                <el-input v-model="editForm.address" auto-complete="off" placeholder="详细地址" class="addint"></el-input>
                            </el-form-item> 
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="联系人姓名" prop="satrapName">
                                <el-input v-model="editForm.satrapName" auto-complete="off" placeholder="客户联系人姓名" class="addint"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="联系人电话" prop="satrapPhone">
                                <el-input v-model="editForm.satrapPhone" :maxlength="11" auto-complete="off" placeholder="客户联系人电话" class="addint"></el-input>
                            </el-form-item>        
                        </el-col>
                    </el-row>
                        
                    <el-collapse-transition>
                        <div class="apse" v-show="compile">
                            <el-row :gutter="20">
                                <el-col :span="12">     
                                    <el-form-item label="传真" prop="fax">
                                        <el-input v-model="editForm.fax" auto-complete="off" placeholder="传真" class="addint"></el-input>
                                    </el-form-item>   
                                </el-col>
                                <el-col :span="12">
                                  <el-form-item label="联系人邮箱" prop="email"
                                      :rules="[
                                          { required: false, message: '请输入邮箱地址', trigger: 'blur' },
                                          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur,change' }
                                        ]">
                                      <el-input v-model="editForm.email" auto-complete="off" placeholder="客户联系人邮箱" class="addint"></el-input>
                                    </el-form-item>      
                                </el-col>
                            </el-row>
                            <el-row :gutter="20">
                                <el-col :span="12">
                                    <el-form-item label="网页地址" prop="webAddress">
                                        <el-input v-model="editForm.webAddress" auto-complete="off" placeholder="网页地址" class="addint"></el-input>
                                    </el-form-item>        
                                </el-col>
                                <el-col :span="12">
                                  <el-form-item label="邮政编码" prop="zipcode">
                                      <el-input v-model="editForm.zipcode" auto-complete="off" placeholder="邮政编码" class="addint"></el-input>
                                  </el-form-item> 
                                </el-col>
                            </el-row>
                            <el-row :gutter="20">
                                <el-col :span="12">
                                    <el-form-item label="状态" prop="status" v-show="false"> <!-- 暂时不用到 -->
                                        <el-select v-model="editForm.status" placeholder="状态" class="addint">
                                            <el-option v-for="i in statusEnum" :key="i.val" :label="i.lbl" :value="i.val"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">       
                                </el-col>
                            </el-row>

                            <el-row :gutter="20">
                                <el-col :span="24">
                                    <el-form-item label="描述" prop="noti">
                                        <el-input v-model="editForm.noti" auto-complete="off" placeholder="描述" class="addint addint1"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>

                            <el-row>
                              <el-col :span="24">
                                  <el-form-item label="区块键值">
                                      <el-input type="text" v-model="bcInfoKey" class="editPut editPut1" :disabled="true" auto-complete="off"></el-input>
                                  </el-form-item>
                              </el-col>
                            </el-row>
                            <el-row>
                              <el-col :span="24">
                                  <el-form-item label="区块哈希">
                                      <el-input type="text" v-model="bcHash" class="editPut editPut1" :disabled="true" auto-complete="off"></el-input>
                                  </el-form-item>
                              </el-col>
                            </el-row>

                            <input type="hidden" v-model="editForm.id"/>
                            <el-form-item label="客户类型" prop="type" v-show="false">
                                <el-input v-model="editForm.type" auto-complete="off" placeholder=" (没用到这字段)客户类型"></el-input>
                            </el-form-item>
                            <el-form-item label="县code" prop="county" v-if="false">
                                <el-input v-model="editForm.county" auto-complete="off" placeholder="县code"></el-input>
                            </el-form-item>
                            
                            <el-row :gutter="20">
                              <el-col :span="12">
                                <el-form-item label="营业执照照片" prop="businessLicensePhoto">
                                    
                                    <app-uploadImg :creatImg="editForm.businessLicensePhotoFullPath" :creatURL="upLoadPhotoUrl"  @getImgsrc="editBusMethod" :index="editForm.id"></app-uploadImg>
                                    
                                </el-form-item>
                              </el-col>
                              <el-col :span="12">
                                <el-form-item label="客户logo" prop="cusLogoPhoto">
                            
                                    <app-uploadImg :creatImg="editForm.cusLogoPhotoFullPath" :creatURL="upLoadPhotoUrl" @getImgsrc="editCusMethod" :index="editForm.id"></app-uploadImg>

                                </el-form-item>
                              </el-col>
                          </el-row>
                        </div>
                    </el-collapse-transition>
                    

                    <div class="more" @click="compile = !compile" v-if="compile == false">点击显示更多</div>
                    <div class="more" @click="compile = !compile" v-else>收起</div>
                </el-form>
                <div slot="footer" class="dialog-footer">
                <el-button @click.native="abolish">取消</el-button>
                <el-button type="primary" @click.native="editSubmit">提交</el-button>
                </div>
            </el-dialog>         
            <!--弹出框-->
        </el-col>
        
    </el-row>

</template>

<script>
import pcdSelect from "../../../components/common/cityPicker.vue";
import { getCookie } from "../../../js/cookie.js";
export default {
  data() {
    //在此自定义校验，如新录入数据，在输入后校验后台是否重复
    var checkExistsCateDesc = (rule, value, callback) => {
      if (this.addForm.orgCode != "") {
        let p = { orgCode: this.addForm.orgCode };
        this.axios
          .post(`${this.api.baseURL}/customerOrg/getCountByOrgCode`, p)
          .then(res => {
            if (parseInt(res.data.data.result) > 0) {
              callback(new Error("已存在相同的客户代码"));
            } else callback();
          });
      } else callback(); //空值则默认成功
    };
    var checkExistsSatrapPhoneDesc = (rule, value, callback) => {
      if (this.addForm.satrapPhone != "") {
        if (isNaN(this.addForm.satrapPhone)) {
          callback(new Error("手机号必须为数字!"));
        } else if (this.addForm.satrapPhone.indexOf("1") != 0) {
          callback(new Error("手机号必须以1开始!"));
        } else {
          callback(); //空值则默认成功
        }
      } else {
        callback(); //空值则默认成功
      }
    };
    var checkExistsSatrapPhoneDescForUpdate = (rule, value, callback) => {
      if (this.editForm.satrapPhone != "") {
        if (isNaN(this.editForm.satrapPhone)) {
          callback(new Error("手机号必须为数字!"));
        } else if (this.editForm.satrapPhone.indexOf("1") != 0) {
          callback(new Error("手机号必须以1开始!"));
        } else {
          callback(); //空值则默认成功
        }
      } else {
        callback(); //空值则默认成功
      }
    };
    var checkExistsCustomerIdentity = (rule, value, callback) => {
      let reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
      if (value == "" || value == undefined) {
        callback();
      } else {
        if (reg.test(value) === false) {
          callback(new Error("您输入的身份不合法"));
        } else {
          // 后台校验
          console.log("value = " + value);
          let pa = { idCard: value };
          this.axios
            .post(`${this.api.baseURL}/common/checkIdCardFormat`, pa)
            .then(res => {
              if (!res.data.data.result) {
                //后台校验不合法
                callback(new Error("您输入的身份不正确"));
              } else {
                callback();
              }
            });
        }
      }
    };
    return {
      parentOperate: 'create',
      email: '',
      bcInfoKey:'',//区块链指
      bcHash:'',//区块哈希值
      addShow: false,
      compile: false,
      userTitleL: "客户管理",
      ftphost: "",
      upLoadPhotoUrl: `${this.api.baseURL}/customerOrg/uploadPhotoBase64`,
      //增加页面
      businessLicensePhoto_url: "static/img/white100X100.png", //初始化图片
      cusLogoPhoto_url: "static/img/white100X100.png",
      //修改页面
      businessLicensePhoto_url_update: "", //初始化图片
      cusLogoPhoto_url_update: "",

      liceCode: {
        url: `${this.api.baseURL}/customerOrg/uploadPhotoBase64`,
        name: "营业执照"
      }, //新增营业执照
      clientCode: {
        url: `${this.api.baseURL}/customerOrg/uploadPhotoBase64`,
        name: "客户logo"
      }, // 新增客户logo

      pcdCode: [],
      pcdName: [],
      pcdCodeStr: ",,", //向子组件赋值用
      taskCateList: [],
      filters: {
        orgName: "",
        orgCode: "",
        createTime: ""
      },
      total: 0,
      page: 1,
      limit: 10,
      loading: false,
      addFormVisible: false, //新增界面是否显示
      addFormRules: {
        enterpriseName: [
          { required: true, message: "请输入企业名称", trigger: "blur" },
          { min: 2, max: 60, message: "必须输入2-60个字", trigger: "blur" }
        ],
        businessLicenseCode: [
          { required: true, message: "请输入营业执照号码", trigger: "blur" },
          { min: 2, max: 60, message: "必须输入2-60个字", trigger: "blur" }
        ],
        roadTransportLicenseCode: [
          {
            required: true,
            message: "请输入道路运输许可证号码",
            trigger: "blur"
          },
          { min: 2, max: 60, message: "必须输入2-60个字", trigger: "blur" }
        ],
        identity: [
          { required: false, message: "请输入身份证号", trigger: "blur" },
          { min: 15, max: 18, message: "身份证长度15-18位", trigger: "blur" },
          { validator: checkExistsCustomerIdentity, trigger: "blur" }
        ],
        orgName: [
          { required: true, message: "请输入名称", trigger: "blur" },
          { min: 2, max: 60, message: "必须输入2-60个字", trigger: "blur" }
        ],
        pcdCode: [{ required: true, message: "请输入省市区", trigger: "blur" }],
        address: [{ required: true, message: "请输入详细", trigger: "blur" }],
        satrapName: [
          { required: true, message: "请输入机构负责人姓名", trigger: "blur" }
        ],
        orgCode: [
          { required: true, message: "请输入登录帐号", trigger: "blur" },
          { max: 32, message: "登录帐号长度不能大于32位", trigger: "blur" },
          { validator: checkExistsCateDesc, trigger: "blur" }
        ],
        satrapName: [
          { required: true, message: "请输入联系人改名", trigger: "blur" },
          { max: 20, message: "联系人改名不能大于20位", trigger: "blur" }
        ],
        satrapPhone: [
          { required: true, message: "请输入联系人手机号", trigger: "blur" },
          {
            min: 11,
            max: 11,
            message: "修改手机号长度为11位",
            trigger: "blur"
          },
          { validator: checkExistsSatrapPhoneDesc, trigger: "blur" }
        ],
        zipcode: [{ max: 6, message: "长度必须不能大于6", trigger: "blur" }],

      },
      updateFormRules: {
        enterpriseName: [
          { required: true, message: "请输入企业名称", trigger: "blur" },
          { min: 2, max: 60, message: "必须输入2-60个字", trigger: "blur" }
        ],
        businessLicenseCode: [
          { required: true, message: "请输入营业执照号码", trigger: "blur" },
          { min: 2, max: 60, message: "必须输入2-60个字", trigger: "blur" }
        ],
        roadTransportLicenseCode: [
          {
            required: true,
            message: "请输入道路运输许可证号码",
            trigger: "blur"
          },
          { min: 2, max: 60, message: "必须输入2-60个字", trigger: "blur" }
        ],
        // identity :[
        //     {required: true, message : '请输入身份证号', trigger : 'blur'},
        //     {min:15, max:18, message: '身份证长度15-18位', trigger: 'blur'},
        //     {validator: checkExistsCustomerIdentityForUpdate, trigger: 'blur'}
        // ],
        orgName: [
          { required: true, message: "请输入名称", trigger: "blur" },
          { min: 2, max: 60, message: "必须输入2-60个字", trigger: "blur" }
        ],
        pcdCode: [{ required: true, message: "请输入省市区", trigger: "blur" }],
        address: [{ required: true, message: "请输入详细", trigger: "blur" }],
        satrapName: [
          { required: true, message: "请输入机构负责人姓名", trigger: "blur" }
        ],
        // orgCode: [
        //     {required: true, message: '请输入登录帐号', trigger: 'blur'},
        //     {max:32, message: '登录帐号不能大于32位', trigger: 'blur'},
        //     {validator: checkExistsCateDesc, trigger: 'blur'}
        // ],
        satrapName: [
          { required: true, message: "请输入联系人改名", trigger: "blur" },
          { max: 20, message: "联系人改名过长", trigger: "blur" }
        ],
        satrapPhone: [
          { required: true, message: "请输入联系人手机号", trigger: "blur" },
          {
            min: 11,
            max: 11,
            message: "修改手机号长度为11位",
            trigger: "blur"
          },
          { validator: checkExistsSatrapPhoneDescForUpdate, trigger: "blur" }
        ],
        zipcode: [{ max: 6, message: "长度必须不能大于6", trigger: "blur" }]
      },
      addForm: {
        orgName: "",
        orgCode: ""
      },
      editFormVisible: false,
      editForm: {
        id: "",
        orgName: "",
        orgCode: ""
      },
      statusEnum: [{ val: "1", lbl: "启用" }, { val: "2", lbl: "停用" }],
      identityTypeEnum: [{ val: "0", lbl: "身份证" }],
      orderFlagEnum: [
        { val: 1, lbl: "1" },
        { val: 2, lbl: "2" },
        { val: 3, lbl: "3" }
      ]
    };
  },
  methods: {
    formatBcStatus: function(row, column){
      return (row.bcStatus && row.bcStatus == "1") ? "已上链" : "上链中";
    },
    //新增上传
    beforeUpload_businessLicensePhoto(file) {
      //营业执照
    },
    uploadSuccess_businessLicensePhoto(response, file, fileList) {
      if (response.code != "200") {
        businessLicensePhoto_url = "";
        console.log("上传 营业执照 返回数据：" + response.data);
        this.$message.error("上传 营业执照 错误，请联系系统管理员！");
      } else {
        this.$message.success("上传成功！");
        this.addForm.businessLicensePhoto = response.data.resulturl;
        this.ftphost = response.data.resultftphost;
        this.businessLicensePhoto_url = this.ftphost + response.data.resulturl;
      }
      this.$refs["businessLicensePhoto_ref"].clearFiles();
    },
    submitbusinessLicensePhoto() {
      this.$refs["businessLicensePhoto_ref"].headers.tokenId = getCookie(
        "tokenid"
      );
      this.$refs["businessLicensePhoto_ref"].submit();
    },
    //修改上传
    uploadSuccess_businessLicensePhoto_update(response, file, fileList) {
      if (response.code != "200") {
        businessLicensePhoto_url_update = "";
        console.log("上传 营业执照 返回数据：" + response.data);
        this.$message.error("上传 营业执照 错误，请联系系统管理员！");
      } else {
        this.$message.success("上传成功！");
        this.editForm.businessLicensePhoto = response.data.resulturl;
        this.ftphost = response.data.resultftphost;
        this.businessLicensePhoto_url_update =
          this.ftphost + response.data.resulturl;
      }
      this.$refs["businessLicensePhoto_ref_update"].clearFiles();
    },
    submitbusinessLicensePhoto_update() {
      this.$refs["businessLicensePhoto_ref_update"].headers.tokenId = getCookie(
        "tokenid"
      );
      this.$refs["businessLicensePhoto_ref_update"].submit();
    },
    uploadSuccess_cusLogoPhoto(response, file, fileList) {
      if (response.code != "200") {
        cusLogoPhoto_url = "";
        console.log("上传 客户logo 返回数据：" + response.data);
        this.$message.error("上传 客户logo 错误，请联系系统管理员！");
      } else {
        this.$message.success("上传成功！");
        this.addForm.cusLogoPhoto = response.data.resulturl;
        this.ftphost = response.data.resultftphost;
        this.cusLogoPhoto_url = this.ftphost + response.data.resulturl;
      }
      this.$refs["cusLogoPhoto_ref"].clearFiles();
    },
    submitcusLogoPhoto() {
      this.$refs["cusLogoPhoto_ref"].headers.tokenId = getCookie("tokenid");
      this.$refs["cusLogoPhoto_ref"].submit();
    },
    uploadSuccess_cusLogoPhoto_update(response, file, fileList) {
      if (response.code != "200") {
        cusLogoPhoto_url_update = "";
        console.log("上传 客户logo 返回数据：" + response.data);
        this.$message.error("上传 客户logo 错误，请联系系统管理员！");
      } else {
        this.$message.success("上传成功！");
        this.editForm.cusLogoPhoto = response.data.resulturl;
        this.ftphost = response.data.resultftphost;
        this.cusLogoPhoto_url_update = this.ftphost + response.data.resulturl;
      }
      this.$refs["cusLogoPhoto_ref_update"].clearFiles();
    },
    submitcusLogoPhoto_update() {
      this.$refs["cusLogoPhoto_ref_update"].headers.tokenId = getCookie(
        "tokenid"
      );
      this.$refs["cusLogoPhoto_ref_update"].submit();
    },
    pcdChange(msg) {
      //由子组件触发，向父组件传值。 本页面为父组件
      this.pcdCode = msg.codes;
      this.pcdName = msg.names;
      this.pcdCodeStr = msg.codes.join(",");
      //this.convertAddr2LonLat(); //重算经纬度
    },
    handleSearch() {
      this.total = 0;
      this.page = 1;
      this.search();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.search();
    },
    search: function() {
      let that = this;
      let params = {
        currentPage: that.page,
        pageSize: that.limit,
        searchByKeys: {
          orgName: that.filters.orgName,
          orgCode: that.filters.orgCode
        },
        orderByKeys: { createTime: "desc" }
      };
      that.axios
        .post(`${this.api.baseURL}/customerOrg/getPageCustomerOrg`, params)
        .then(res => {
          that.taskCateList = res.data.data.result.content;
          that.total = res.data.data.result.totalRecord;
        });
    },
    handleAddNew() {
      this.addFormVisible = true;
      this.pcdCode = [];
      this.pcdName = [];
      this.pcdCodeStr = ",,"; //触发向子组件传值
      (this.businessLicensePhoto_url = "static/img/white100X100.png"), //初始化图片
        (this.businessLicensePhoto_url_update = "static/img/white100X100.png"), //初始化图片
        (this.cusLogoPhoto_url = "static/img/white100X100.png"), //初始化图片
        (this.cusLogoPhoto_url_update = "static/img/white100X100.png"), //初始化图片
        (this.addForm = {
          satrapPhone: "",
          orgName: "",
          orgCode: "",
          status: "1",
          identityType: "0",
          orderFlag: 1
        });
    },
    addSubmit: function() {
      if (this.pcdCode == "") {
        //子组件，暂时无法再rules里面实现validate，故在此校验
        this.$message.error({
          showClose: true,
          message: "请输入省市区！",
          duration: 3000
        });
        return false;
      } else {
        this.addForm.pcdCode = this.pcdCode;
        this.addForm.pcdName = this.pcdName;
      }

      let that = this;
      this.$refs.addForm.validate(valid => {
        if (valid) {
          let para = Object.assign({}, this.addForm);
          console.log(para);
          that.axios
            .post(`${this.api.baseURL}/customerOrg/createCustomerOrg`, para)
            .then(function(result) {
              if (result && result.data.code == "200") {
                //保存成功
                that.$message.success({
                  showClose: true,
                  message: "添加成功",
                  duration: 2000
                });
                that.$refs["addForm"].resetFields();
                that.addFormVisible = false;
                that.search();
              } else {
                console.log(result.data.message);
                if (result.data.code == 403) {
                  that.$message.error({
                    showClose: true,
                    message: "添加发生异常" + result.data.message,
                    duration: 4000
                  });
                } else {
                  that.$message.error({
                    showClose: true,
                    message: "添加发生异常，请联系管理员",
                    duration: 4000
                  });
                }
              }
              that.addFormVisible = false;
              that.addShow = false;
            });
        }
      });
    },
    editSubmit: function() {
      if (this.pcdCode == "") {
        this.$message.error({
          showClose: true,
          message: "请输入省市区！",
          duration: 3000
        });
        return false;
      } else {
        this.editForm.pcdCode = this.pcdCode;
        this.editForm.pcdName = this.pcdName;
      }

      let that = this;
      this.$refs.editForm.validate(valid => {
        if (valid) {
          let para = Object.assign({}, this.editForm);
          that.axios
            .post(`${this.api.baseURL}/customerOrg/updateCustomerOrg`, para)
            .then(function(result) {
              if (result && result.data.code == "200") {
                //修改成功
                that.$message.success({
                  showClose: true,
                  message: "修改成功",
                  duration: 2000
                });
                that.$refs["editForm"].resetFields();
                that.editFormVisible = false;
                that.search();
              } else {
                that.$message.error({
                  showClose: true,
                  message: "修改失败",
                  duration: 2000
                });
              }
              that.editFormVisible = false;
              that.compile = false;
            });
        }
      });
    },
    showEditDialog(index, row) {
      this.bcInfoKey = row.bcInfoKey;
      this.bcHash = row.bcHash;
      this.editFormVisible = true; //弹出框
      this.pcdCode = [row.provinceCode, row.cityCode, row.districtCode]; //
      this.pcdName = [row.provinceName, row.cityName, row.districtName];
      this.pcdCodeStr =
        row.provinceCode + "," + row.cityCode + "," + row.districtCode; //触发向子组件传值
      this.editForm = Object.assign({}, row);
      // console.log("营业.执照");
      // console.log("营业.执照  ===== " + row.businessLicensePhotoFullPath);

      // this.businessLicensePhoto_url_update = "static/img/white100X100.png"; //初始化空图片
      // if (row.businessLicensePhotoFullPath) {
      //   this.businessLicensePhoto_url_update = row.businessLicensePhotoFullPath; //初始化图片
      // }
      // this.cusLogoPhoto_url_update = "static/img/white100X100.png"; //初始化空图片
      // if (row.cusLogoPhotoFullPath) {
      //   this.cusLogoPhoto_url_update = row.cusLogoPhotoFullPath; //初始化图片
      // }
    },
    del(index, row) {
      this.$confirm("您确定要删除【" + row.orgName + "】吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let that = this;
          let p = { id: row.id };
          that.axios
            .post(`${this.api.baseURL}/customerOrg/deleteCustomerOrg`, p)
            .then(function(result) {
              if (result && result.data.code == "200") {
                //删除成功
                that.$message.success({
                  showClose: true,
                  message: "已删除",
                  duration: 2000
                });
                that.search();
              } else {
                that.$message.error({
                  showClose: true,
                  message: "删除失败",
                  duration: 2000
                });
              }
            });
        })
        .catch(() => {
          this.$message({ type: "info", message: "已取消删除" });
        });
    },
    //新增营业执照
    licemethod(http, url) {
      //   console.log(http + "," + url);
      this.addForm.businessLicensePhoto = url;
    },
    //新增客户logo
    clientmethod(http, url) {
      //   console.log(http + "," + url);
      this.addForm.cusLogoPhoto = url;
    },
    //编辑营业执照
    editBusMethod(http, url) {
      this.editForm.businessLicensePhoto = url;
    },
    //编辑客户logo
    editCusMethod(http, url) {
      this.editForm.cusLogoPhoto = url;
    },
     cancel(){
      this.addFormVisible = false;
      this.addShow = false;
      this.parentOperate = "cancle_" + new Date().getTime();
      console.log(" this.parentOperate = " + this.parentOperate)
    },
    addClose(){
      this.addFormVisible = false;
      this.addShow = false;
      this.parentOperate = "cancle_" + new Date().getTime();
      console.log(" xxx this.parentOperate = " + this.parentOperate)
    },
    //编辑弹出框的收缩
    abolish(){
      this.editFormVisible = false;
      this.compile = false;
      this.$refs['editForm'].resetFields();
    },
    editClose(){
      this.editFormVisible = false;
      this.compile = false;
    },
  },
  mounted() {
    this.handleSearch();
  },
  components: {
    "add-pcd": pcdSelect //定义子组件
  },
  created() {
    // 主页添加键盘事件,注意,不能直接在焦点事件上添加回车
    var self = this;
    document.onkeydown = function(e) {
      var key = e.which;
      if (key == 13) {
        self.handleSearch();
      }
    };
  }
};
</script>

<style lang="less" scoped>
.warp{
  padding-left: 2px;
  padding-right: 20px;
}
.addint {
  width: 95%;
  // float: right;
}
.addint1 {
  width: 84%;
}
.editInpt {
  width: 100%;
}
.more {
  width: 100%;
  text-align: center;
  margin-bottom: 20px;
  cursor: pointer;
}
.city .el-cascader {
  width: 100% !important;
}

.customerListTable .el-table__row .el-button {
  padding: 0;
  color: #409eff;
  border: none;
  padding-right: 3px;
}
</style>
