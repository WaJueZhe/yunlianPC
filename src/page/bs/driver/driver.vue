<template>
  <el-row class="warp" style="margin-bottom:50px;">
    <el-col :span="24" class="warp-breadcrum" style="padding:10px;">
        <app-title :title="driverTitle"></app-title>
    </el-col>

    <el-col :span="24" class="warp-main" v-loading="loading" element-loading-text="拼命加载中">
      <!--工具条-->
      <el-col :span="24" style="padding-bottom: 0px;">
        <el-form :inline="true" :model="filters">
          <el-form-item>
            <el-input v-model="filters.driverName" placeholder="司机姓名" style="min-width: 120px;"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="filters.driverMobile" placeholder="司机手机号" style="min-width: 120px;"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch" @keyup.13="alert">查询</el-button>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="addFormVisible = true">新增</el-button>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="handleExport" :loading="exporting">导出</el-button>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="handleImport">导入</el-button>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="handleAuth">批量认证</el-button>
          </el-form-item>
        </el-form>
        <!--列表-->
      </el-col>
        <el-table :data="DriverList" style="width:100%"  @selection-change="selectionChange" highlight-current-row v-loading="loading" stripe :border="true" class="driverTable">
          
          <el-table-column type="selection" prop="id" width="55" :selectable='checkboxInit' ></el-table-column>

          <el-table-column type="index" label="序号" align="center" width="50"></el-table-column>
          <el-table-column prop="id" label="id" v-if="false"></el-table-column>
          <el-table-column prop="customerOrgId" label="customerOrgId" v-if="false"></el-table-column>
          <el-table-column prop="frontIdcardPhotoFullPath" label="司机身份证正面" v-if="false"></el-table-column>
          <el-table-column prop="backIdcardPhotoFullPath" label="司机身份证反面" v-if="false"></el-table-column>
          <el-table-column prop="licenseHomePhotoFullPath" label="驾照主页" v-if="false"></el-table-column>
          <el-table-column prop="licenseSidelinePhotoFullPath" label="驾照副页" v-if="false"></el-table-column>
          <el-table-column prop="qualificationCertificatePhotoFullPath" label="从业资格证" v-if="false"></el-table-column>
 
          <el-table-column prop="driverName" label="司机姓名" align="center" width="100"></el-table-column>
          <el-table-column prop="driverMobile" label="司机电话" align="center"></el-table-column>
          <el-table-column prop="driverIdentityId" label="身份证号码" align="center">
            <template slot-scope="scope">
                <p>{{ scope.row.driverIdentityId | identityShow}}</p>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="driverLicenseType" label="驾照类型" align="center" min-width="8%"></el-table-column> -->
          <el-table-column prop="createDate" label="创建时间" align="center">
            <template slot-scope="scope">
                <p>{{ scope.row.createDate | dateFormate}}</p>
            </template>
          </el-table-column>
          <el-table-column prop="isVerified" label="实名认证状态" align="center">
            <template slot-scope="scope">
                <p>{{ scope.row.isVerified | authFormate}}</p>
            </template>
          </el-table-column>
          <el-table-column prop="linkStatus" label="上链状态" align="center"></el-table-column>
          
          <el-table-column label="操作" fixed="right" align="center" width="120">
            
            <template slot-scope="scope">
              <!-- <i class="el-icon-caret-bottom" @click="www(scope.$index)"></i> -->
              <!-- <div class="qqq">
                <span class="bianji" style="cursor: pointer">编辑</span>
                <span class="gengduo" style="cursor: pointer" @click="ddd(scope.$index)">更多></span>
              </div> -->

              <!-- <div class="aaa" v-show="sum === scope.$index">
                <div>123123</div>
                <div>123123</div>
                <div>123123</div>
                <div>123123</div>
              </div> -->
              
              <el-button @click="showEditDialog(scope.$index,scope.row)">编辑</el-button>

              <span v-if="containPermitTypeAndCode('extra_service_list', '1')"> <!--1认证 2签名 -->
                <el-button @click="authentication(scope.$index,scope.row)" v-if="scope.row.isVerified != 1" size="small">认证</el-button>
                <el-button v-else size="small" :disabled="true">认证</el-button>
              </span>

              <el-button @click="delDriver(scope.$index,scope.row)" size="small">删除</el-button>
              
              <!-- <div v-show="number == scope.$index" class="qqq">
                <div><el-button type="info" size="small" @click="showEditDialog(scope.$index,scope.row)">编辑</el-button></div>
                <div>
                   <span v-if="containPermitTypeAndCode('extra_service_list', '1')">
                    <el-button type="primary" @click="authentication(scope.$index,scope.row)" v-if="scope.row.isVerified != 1" size="small">认证</el-button>
                    <el-button type="primary" v-else size="small" :disabled="true">认证</el-button>
                  </span>
                </div>
                <div><el-button type="warning" @click="delDriver(scope.$index,scope.row)" size="small">删除</el-button></div>
              </div> -->
            </template>
          </el-table-column>
          
        </el-table>

      <!--工具条-->
      <el-col :span="24" class="toolbar">
        <el-pagination layout="total, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-size="limit" :total="total"
          background style="float:right;">
        </el-pagination>
      </el-col>

      <!--新增弹出框-->
      <el-dialog title="新增" :visible.sync="addFormVisible" :before-close="addClose" custom-class="myClass">
          <el-form :model="addForm" label-width="110px" :rules="addFormRules" ref="addForm" label-position="right" :show-overflow-tooltip="true">

            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="姓名" prop="driverName">
                        <el-input v-model="addForm.driverName" auto-complete="off" class="editPut"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="性别" prop="driverSex">
                        <el-select v-model="addForm.driverSex" placeholder="性别" class="editPut">
                            <el-option v-for="i in driverSexTypeEnum" :key="i.val" :label="i.lbl" :value="i.val"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="年龄" prop="driverAge">
                        <el-input v-model.number="addForm.driverAge" :maxlength="2" auto-complete="off" class="editPut"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="手机" prop="driverMobile">
                        <el-input v-model="addForm.driverMobile" :maxlength="11" auto-complete="off" class="editPut"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="身份证号码" prop="driverIdentityId">
                        <el-input  v-model="addForm.driverIdentityId" :maxlength="18" auto-complete="off" class="editPut"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="驾照号码" prop="driverLicenseNumber">
                        <el-input type="text" v-model="addForm.driverLicenseNumber" auto-complete="off" class="editPut"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="驾照类型" prop="driverLicenseType">
                        <el-select v-model="addForm.driverLicenseType" placeholder="驾照类型" class="editPut">
                            <el-option v-for="i in driverLicenseTypeEnum" :key="i.val" :label="i.lbl" :value="i.val"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="驾照到期日期" prop="driverLicenseEndTime">  
                        <el-date-picker v-model="addForm.driverLicenseEndTime" format="yyyy-MM-dd" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" class="editPut">
                        </el-date-picker> 
                    </el-form-item>
                </el-col>
            </el-row>

            <!-- 折叠区域 -->
            <div class="addCollapse">

              <div>
                <el-collapse-transition>
                  <div v-show="addCollapse">
                    <el-row :gutter="20">
                      <el-col :span="12">
                        <el-form-item label="从业资格证编码" prop="driverQualCode">
                          <el-input type="text" v-model="addForm.driverQualCode" auto-complete="off" class="editPut"></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="账号" prop="bankAccountNo">
                          <el-input type="text" v-model="addForm.bankAccountNo" auto-complete="off" class="editPut"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>

                    <el-row :gutter="20">
                      <el-col :span="12">
                        <el-form-item label="开户行全称" prop="bankDetailName">
                          <el-input type="text" v-model="addForm.bankDetailName" auto-complete="off" class="editPut"></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="帐户名称" prop="bankAccountName">
                          <el-input type="text" v-model="addForm.bankAccountName" auto-complete="off" class="editPut"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="24">
                        <el-form-item label="备注" prop="remarks" label-width="20px;">
                          <el-input type="text" v-model="addForm.remarks" auto-complete="off" class="editPut editPut1"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <!-- 上传司机身份证正反面 -->
                    <el-row :gutter="20" class="uploadPhoto">
                      
                      <el-col :span="12">
                        <p>请上传司机身份证正面</p>
                        <app-uploadImg :uploadUrl="IDCardFace" @getImgsrc="IDCardFaceUrl" :operate="parentOperate"></app-uploadImg>

                      </el-col>
                      <el-col :span="12">
                        <p>请上传司机身份证反面</p>
                        <app-uploadImg :uploadUrl="IDCardCon" @getImgsrc="IDCardConUrl" :operate="parentOperate"></app-uploadImg>

                      </el-col>
                    </el-row>

                    <el-row :gutter="20" class="uploadPhoto">
                      
                      <el-col :span="12">
                        <p>请上传司机的驾驶证正页</p>
                        <app-uploadImg :uploadUrl="DriverCardFace" @getImgsrc="DriverCardFaceUrl" :operate="parentOperate"></app-uploadImg>

                      </el-col>
                      <el-col :span="12">
                        <p>请上传司机的驾驶证副页</p>
                        <app-uploadImg :uploadUrl="DriverCardCon" @getImgsrc="DriverCardConUrl" :operate="parentOperate"></app-uploadImg>

                      </el-col>
                    </el-row>
                    <el-row>
                      <p>请上传从业资格证</p>
                      <app-uploadImg :uploadUrl="JoinJobCard" @getImgsrc="JoinJobCardUrl" :operate="parentOperate"></app-uploadImg>
                    </el-row>

                  </div>
                </el-collapse-transition>
              </div>
              <div class="text" @click="addCollapse = !addCollapse">
                <span v-show="!addCollapse">点击填写更多</span>
                <span v-show="addCollapse">收起</span>
              </div>
            </div>



          </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click.native="addSubmit">保存</el-button>
        </div>
      </el-dialog>

      <!-- 编辑登录弹框 -->
      <el-dialog title="编辑" :visible.sync="editFormVisible" :before-close="editClose" custom-class="myClass">
        <el-form :model="editForm" label-width="110px" :rules="updateFormRules" ref="editForm" label-position="right">
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="姓名" prop="driverName">
                        <el-input v-model="editForm.driverName" auto-complete="off" class="editPut"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="性别" prop="driverSex">
                        <el-select v-model="editForm.driverSex" placeholder="请选择性别" class="editPut">
                            <el-option v-for="i in driverSexTypeEnum" :key="i.val" :label="i.lbl" :value="i.val"></el-option>
                        </el-select>
                    </el-form-item>     
                </el-col>
            </el-row>

            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="年龄" prop="driverAge">
                        <el-input v-model.number="editForm.driverAge" :maxlength="2" auto-complete="off" class="editPut"></el-input>
                    </el-form-item>        
                </el-col>
                <el-col :span="12">
                    <el-form-item label="手机号" prop="driverMobile">
                        <el-input v-model="editForm.driverMobile" auto-complete="off" class="editPut" :disabled="true" style="width:70%"></el-input>
                        &nbsp;<a><i class="el-icon-edit" @click="showEditMobileDialog"></i></a>
                    </el-form-item>        
                    
                </el-col>
            </el-row>

            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="身份证号码">
                        <!-- <el-input type="text" v-model="editForm.driverIdentityId" :maxlength="18" class="editPut" auto-complete="off" :disabled="true"></el-input> -->
                      <p>{{editForm.driverIdentityId|identityShow}}</p>
                    </el-form-item>        
                </el-col>
                <el-col :span="12">
                    <el-form-item label="驾照号码" prop="driverLicenseNumber">
                        <el-input type="text" v-model="editForm.driverLicenseNumber" class="editPut" auto-complete="off"></el-input>
                    </el-form-item>        
                </el-col>
            </el-row>

            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="驾照类型" prop="driverLicenseType">
                        <el-select v-model="editForm.driverLicenseType" placeholder="驾照类型" class="editPut">
                            <el-option v-for="i in driverLicenseTypeEnum" :key="i.val" :label="i.lbl" :value="i.val"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="驾照到期日期" prop="driverLicenseEndTime">  
                        <el-date-picker v-model="editForm.driverLicenseEndTime" class="editPut" format="yyyy-MM-dd" type="date" value-format="yyyy-MM-dd" placeholder="选择日期">
                        </el-date-picker> 
                    </el-form-item>
                </el-col>
            </el-row>

            <!-- 折叠区域 -->
            <div class="addCollapse">
              <div>
                <el-collapse-transition>
                  <div v-show="compile">
                    <el-row :gutter="20">
                      <el-col :span="12">
                          <el-form-item label="从业资格证编码" prop="driverQualCode">
                              <el-input type="text" v-model="editForm.driverQualCode" class="editPut" auto-complete="off"></el-input>
                          </el-form-item>        
                      </el-col>
                      <el-col :span="12">
                          <el-form-item label="账号" prop="bankAccountNo">
                              <el-input type="text" v-model="editForm.bankAccountNo" class="editPut" auto-complete="off"></el-input>
                          </el-form-item>       
                      </el-col>
                    </el-row>

                    <el-row :gutter="20">
                      <el-col :span="12">
                          <el-form-item label="开户行全称" prop="bankDetailName">
                              <el-input type="text" v-model="editForm.bankDetailName" class="editPut" auto-complete="off"></el-input>
                          </el-form-item>       
                      </el-col>
                      <el-col :span="12">
                          <el-form-item label="帐户名称" prop="bankAccountName">
                              <el-input type="text" v-model="editForm.bankAccountName" class="editPut" auto-complete="off"></el-input>
                          </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="24">
                          <el-form-item label="备注" prop="remarks" >
                              <el-input type="text" v-model="editForm.remarks" class="editPut editPut1" auto-complete="off"></el-input>
                          </el-form-item>
                      </el-col>
                    </el-row>
                    <!-- <el-table-column prop="bcInfoKey" label="区块键值" align="center" width="160"></el-table-column>
                    <el-table-column prop="bcHash" label="区块哈希" align="center" width="160"></el-table-column> -->
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
                    <el-row :gutter="20" class="uploadPhoto">
                      <el-col :span="12">
                          <!-- 上传司机身份证正面 -->
                          <p>请上传司机身份证正面</p>
                          <app-uploadImg :creatImg="editForm.frontIdcardPhotoFullPath" :creatURL="upLoadPhotoUrl" @getImgsrc="editIDfaceMethod" :index="editForm.id"></app-uploadImg>
                      </el-col>
                      <el-col :span="12">
                          <p>请上传司机身份证反面</p>
                          <app-uploadImg :creatImg="editForm.backIdcardPhotoFullPath" :creatURL="upLoadPhotoUrl" @getImgsrc="editIDconMethod" :index="editForm.id"></app-uploadImg>
                      </el-col>
                    </el-row>

                    <el-row :gutter="20" class="uploadPhoto">
                      <el-col :span="12">
                        <!-- 驾驶证正 -->
                        <p>请上传司机的驾驶证正页</p>
                        <app-uploadImg :creatImg="editForm.licenseHomePhotoFullPath" :creatURL="upLoadPhotoUrl" @getImgsrc="editJoinfaceMethod" :index="editForm.id"></app-uploadImg>
                      </el-col>
                      <el-col :span="12">
                        <!-- 驾驶证反 -->
                        <p>请上传司机的驾驶证副页</p>
                        <app-uploadImg :creatImg="editForm.licenseSidelinePhotoFullPath" :creatURL="upLoadPhotoUrl" @getImgsrc="editJoinconMethod" :index="editForm.id"></app-uploadImg>
                      </el-col>
                    </el-row>

                    <el-row :gutter="20" class="uploadPhoto">
                      <p>请上传从业资格证</p>
                      <app-uploadImg :creatImg="editForm.qualificationCertificatePhotoFullPath" :creatURL="upLoadPhotoUrl" @getImgsrc="editjobMethod" :index="editForm.id"></app-uploadImg>
                    </el-row>
                  </div>
                </el-collapse-transition>
              </div>
              <div class="text" @click="compile = !compile">
              <span v-show="!compile">点击填写更多</span>
              <span v-show="compile">收起</span>
            </div>
            </div>
          
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="abolish">取消</el-button>
          <el-button type="primary" @click.native="editSubmit">提交</el-button>
        </div>
      </el-dialog>
      
      <!--导入弹出框-->
      <el-dialog title="导入" :visible.sync="importVisible" :close-on-click-modal="false" custom-class="myClass">
          <el-form :model="importForm" label-width="100px;" :rules="importFormRules" ref="importForm">
            <el-form-item label="选择上传文件"  >
              <el-upload class="upload-demo" drag :action="updateurl" :auto-upload="false" ref="importDriverId" :onExceed="exceedExcelLimit" :limit="fileLimit"  
                :beforeUpload="beforeImportUpload" :onSuccess="afterImportUpload"  accept=".xls,.xlsx">
                <i class="el-icon-upload"></i>
                            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <div slot="tip" class="el-upload__tip">只能上传excel文件</div>
                <div class="el-upload__tip" slot="tip"> 
                    点击<a :href="driverTemplateDownloadUrl" download="司机导入模板.xlsx" class="blueFont"><b>【这里】</b></a>下载模板
                </div>
              </el-upload>
            </el-form-item>
          </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="importVisible = false">取消</el-button>
          <el-button type="primary" @click.native="importSubmit">导入</el-button>
        </div>
      </el-dialog>
    </el-col>
  </el-row>
</template>

<script>
import moment,{ relativeTimeThreshold } from "moment";
import { getCookie } from "../../../js/cookie.js";
import { getPermitsByType }  from "../../../js/CookiePermitsMap.js";
let set = new Set([]);

export default {
  data() {
    //在此自定义校验，如新录入数据，在输入后校验后台是否重复
    var checkExistsDriver = (rule, value, callback) => {
      if (this.addForm.driverMobile != "") {
        if (isNaN(this.addForm.driverMobile)) {
          callback(new Error("手机号必须为数字!"));
        } else if (this.addForm.driverMobile.indexOf("1") != 0) {
          callback(new Error("手机号必须以1开始!"));
        } else {
          let p = { driverMobile: this.addForm.driverMobile };
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
      if (reg.test(value) === false) {
        callback(new Error("您输入的身份不合法"));
      } else {
        // 后台校验
        let pa = { idCard: value };
        this.axios
          .post(`${this.api.baseURL}/common/checkIdCardFormat`, pa)
          .then(res => {
            if (!res.data.data.result) {
              //后台校验不合法
              callback(new Error("您输入的身份不正确"));
            } else {
              //后台校验合法,再次请求，校验身份证是否重复
              let p = { driverIdentityId: value };
              this.axios
                .post(
                  `${this.api.baseURL}/driver/getCountByDriverIdentityId`,
                  p
                )
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
      let regu = /^[1-9][0-9]$/;
      let driverAge = this.addForm.driverAge;
      if (driverAge != "") {
        if (isNaN(driverAge)) {
          //if (!regu.test(driverAge)) {
          callback(new Error("年龄为数字"));
        } else if (driverAge < 18 || driverAge > 60) {
          callback(new Error("年龄为18 至 60岁"));
        } else {
          callback();
        }
      } else {
        callback(); //空值则默认成功
      }
    };
    var checkDriverAge_update = (rule, value, callback) => {
      let regu = /^[1-9][0-9]$/;
      let driverAge = this.editForm.driverAge;
      if (driverAge != "") {
        if (isNaN(driverAge)) {
          callback(new Error("年龄为数字"));
        } else if (driverAge < 18 || driverAge > 60) {
          callback(new Error("年龄为18 至 60岁"));
        } else {
          callback();
        }
      } else {
        callback(); //空值则默认成功
      }
    };
    return {
      number:true,
      sum:false,
      parentOperate: 'create',
      fileLimit: 1,
      bcInfoKey: "", //区块链指
      bcHash: "", //区块哈希值
      searchKey: "",
      compile: false,
      driverUrl: "",
      driverTitle: "司机管理",
      driverTemplateDownloadUrl:
        "http://" +
        window.location.host +
        `/templatedownload/driverTemplate.xlsx`, //模板下载
      updateurl: `${this.api.baseURL}/driver/importDriver`,
      upLoadPhotoUrl: `${this.api.baseURL}/driver/uploadPhotoBase64`, // ?photoType=1都调同一个接口上传，返回一个url,1身份证正面,2身份证反面,3驾驶证正面,4驾驶证反面,5从业资格证
      // 控制折叠区域
      addCollapse: false,
      // 上传图片
      IDCardFace: {
        url: `${this.api.baseURL}/driver/uploadPhotoBase64`,
        name: "正面照"
      }, //司机正面照
      IDCardCon: {
        url: `${this.api.baseURL}/driver/uploadPhotoBase64`,
        name: "反面照"
      }, //司机反面照
      DriverCardFace: {
        url: `${this.api.baseURL}/driver/uploadPhotoBase64`,
        name: "正面照"
      }, //驾驶证正面照
      DriverCardCon: {
        url: `${this.api.baseURL}/driver/uploadPhotoBase64`,
        name: "反面照"
      }, //驾驶证反面照
      JoinJobCard: {
        url: `${this.api.baseURL}/driver/uploadPhotoBase64`,
        name: "从业资格证"
      }, //从业资格证

      ftphost: "",
      //增加页面
      identiFrontPhone_url: "static/img/white100X100.png", //初始化图片
      identiBackPhone_url: "static/img/white100X100.png",
      licenseHomePhoto_url: "static/img/white100X100.png",
      licenseSidelinePhoto_url: "static/img/white100X100.png",
      qualiCertificatePhoto_url: "static/img/white100X100.png",
      //修改页面
      identiFrontPhone_url_update: "", //初始化图片
      identiBackPhone_url_update: "",
      licenseHomePhoto_url_update: "",
      licenseSidelinePhoto_url_update: "",
      qualiCertificatePhoto_url_update: "",

      DriverList: [],
      filters: {
        driverMobile: "",
        driverName: "",
        driverIdentityId: ""
      },
      total: 0,
      page: 1,
      limit: 10,
      loading: false,
      addFormVisible: false, //新增界面是否显示
      importVisible: false, //导入界面是否显示
      addFormRules: {
        driverName: [
          { required: true, message: "请输司机名称", trigger: "blur" },
          { min: 2, max: 11, message: "名称在2到11位字符之间", trigger: "blur" }
        ],
        driverSex: [
          { required: true, message: "请输选择性别", trigger: "blur" }
        ],
        driverAge: [
          { required: true, message: "请输入年龄", trigger: "blur" },
          { type: "number", message: "年龄必须为数字值" },
          { validator: checkDriverAge, trigger: "blur" } //自定义校验
        ],
        driverMobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          {
            min: 11,
            max: 11,
            message: "手机号码错误,11位手机号",
            trigger: "blur"
          },
          { validator: checkExistsDriver, trigger: "blur" } //自定义校验
        ],
        sex: [{ required: true, message: "请选择性别", trigger: "blur" }],
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
        // remarks: [
        //     {required: true, message: '请输入描述', trigger: 'blur'},
        //     {max:60, message: '备注文字太长', trigger: 'blur'}
        // ]
      },
      updateFormRules: {
        driverName: [
          { required: true, message: "请输司机名称", trigger: "blur" },
          { min: 2, max: 11, message: "名称在2到11位字符之间", trigger: "blur" }
        ],
        driverSex: [
          { required: true, message: "请输选择性别", trigger: "blur" }
        ],
        driverAge: [
          { required: true, message: "请输入年龄", trigger: "blur" },
          { type: "number", message: "年龄必须为数字值" },
          { validator: checkDriverAge_update, trigger: "blur" } //自定义校验
        ],
        sex: [{ required: true, message: "请选择性别", trigger: "blur" }]
        // remarks: [
        //     {required: true, message: '请输入描述', trigger: 'blur'},
        //     {max:60, message: '备注文字太长', trigger: 'blur'}
        // ]
      },
      importFormRules: {
        importMobile: [
          // {required: true, message : '请输入手机号', trigger : 'blur'},
          // {min:11, max:11, message: '手机号码错误', trigger: 'blur'},
          // {validator: checkExistsDriver, trigger: 'blur'} //自定义校验
        ]
        // remarks: [
        //     {required: true, message: '请输入描述', trigger: 'blur'},
        //     {max:60, message: '备注文字太长', trigger: 'blur'}
        // ]
      },
      addForm: {
        driverName: "",
        driverAge: "",
        driverMobile: "",
        driverIdentityId: "",
        driverLicenseNumber: ""
      },
      editFormVisible: false,
      editForm: {
        id: "",
        categoryDesc: "",
        remarks: ""
      },
      importForm: {},
      importFormRules: {},
      driverSexTypeEnum: [{ val: "1", lbl: "男" }, { val: "2", lbl: "女" }], //定义下拉框的options
      driverLicenseTypeEnum: [
        { val: "A1", lbl: "A1" },
        { val: "A2", lbl: "A2" },
        { val: "A3", lbl: "A3" },
        { val: "B1", lbl: "B1" },
        { val: "B2", lbl: "B2" },
        { val: "C1", lbl: "C1" },
        { val: "C2", lbl: "C2" }
      ],
      exporting : false
    };
  },
  filters: {
    dateFormate: function(value) {
       return moment(value).format("YYYY-MM-DD HH:mm");
    },
    authFormate: function(value) {
      let ret = "";
      switch (value) {
        case 0:
          ret = "待认证";
          break;
        case 1:
          ret = "已认证";
          break;
        case 2:
          ret = "认证失败";
          break;
        default:
          break;
      }
      return ret;
    },
    identityShow:function(val){
      if(!val){
        return null;
      }
      return val.slice(0,4) +'****'+'***'+val.slice(11)
    }
  },
  methods: {
    //包含权限的类型和权限代码 
    containPermitTypeAndCode(permitType, permitCode){
      return getPermitsByType(permitType) != undefined && getPermitsByType(permitType).contain(permitCode);
    },
    handleAuth(){
      if(set.size == 0){
        this.$message.error({ showClose: true, message: "请选择司机", duration: 4000 });
        return ;
      }

      this.$confirm("您确定要提交实名认证吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
      .then(() => {
          let that = this
          let params = set
          that.axios.post(`${this.api.baseURL}/driver/authenticationList`, params).then(res =>{
            console.log(res.data)
            if (res.data.code == "200"){
              that.$message.success({ showClose: true, message: "认证成功", duration: 2000 });
            }else{
              that.$message.error({ showClose: true, message: "认证结果，认证成功："+res.data.data.successCount+"条，认证失败："+res.data.data.failCount+"条", duration: 4000 });
            }
            that.search();
          });
        })
        .catch(() => {
          this.$message({ type: "info", message: "已取消删除" });
        });
    },
    checkboxInit(row, index){
      //console.log(" checkboxInit = "+row.isVerified)
      if (row.isVerified != 1) {
        return 1;//可勾选
       } else {
        return 0;//不可勾选
       }
    },
    selectionChange(selection){
      console.log("======== selectionChange ccccc =======") 
      console.log(set)
      set.clear();
      selection.forEach(item => {
            //console.log("每一行Id:"+item.id)
            set.add(item.id);
          });
      // set.forEach(s => {
      //       console.log("每一行Id:"+s)
      // });
      console.log("set 长度："+set.size)
    },
    formatBcStatus: function(row, column) {
      return row.bcStatus && row.bcStatus == "1" ? "已上链" : "上链中";
    },
    // 新增司机身份证正面
    IDCardFaceUrl(http, url) {
      this.addForm.frontIdcardPhoto = url;
    },
    //新增司机身份证反面
    IDCardConUrl(http, url) {
      this.addForm.backIdcardPhoto = url;
    },
    // 新增驾照正面
    DriverCardFaceUrl(http, url) {
      this.addForm.licenseHomePhoto = url;
    },
    //新增驾照反面
    DriverCardConUrl(http, url) {
      this.addForm.licenseSidelinePhoto = url;
    },
    //新增从业资格证
    JoinJobCardUrl(http, url) {
      this.addForm.qualificationCertificatePhoto = url;
    },
    // 编辑司机身份证正
    editIDfaceMethod(http, url) {
      this.editForm.frontIdcardPhoto = url;
    },
    // 编辑身份证反
    editIDconMethod(http, url) {
      this.editForm.backIdcardPhoto = url;
    },
    //编辑驾驶证正
    editJoinfaceMethod(http, url) {
      this.editForm.licenseHomePhoto = url;
    },
    //编辑驾驶证反
    editJoinconMethod(http, url) {
      this.editForm.licenseSidelinePhoto = url;
    },
    //编辑从业资格证
    editjobMethod(http, url) {
      this.editForm.qualificationCertificatePhoto = url;
    },
    handleSearch() {
      if (this.filters.driverName == "") {
        this.search();
      } else {
        this.total = 0;
        this.page = 1;
        this.search();
      }
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
          driverName: that.filters.driverName,
          driverMobile: that.filters.driverMobile
        },
        orderByKeys: { createDate: "desc" }
      };
      that.axios
        .post(`${this.api.baseURL}/driver/findDriverPage`, params)
        .then(res => {
          that.DriverList = res.data.data.result.content;
          console.log(that.DriverList)
          that.total = res.data.data.result.totalRecord;
          //让身份证变成****号
          res.data.data.result.content.map(item => {
            // if (item.driverIdentityId.length === 15) {
            //   item.driverIdentityId = item.driverIdentityId.slice(0,4) +'****'+'***'+item.driverIdentityId.slice(11);
            // }
            // else {
            //   item.driverIdentityId = item.driverIdentityId.slice(0,4) +'*****'+'*****'+item.driverIdentityId.slice(14);
            // }
          });
      });
    },
    
    handleAddNew() {
      this.addFormVisible = true;
      this.addForm = {
        driverName: "",
        driverAge: "",
        driverMobile: "",
        driverIdentityId: "",
        driverLicenseNumber: "",
        identiFrontPhone_url: "", //初始化图片
        identiBackPhone_url: "",
        licenseHomePhoto_url: "",
        licenseSidelinePhoto_url: "",
        qualiCertificatePhoto_url: ""
      };
    },
    handleExport() {
      this.exporting = true;

      let that = this
        let params = {
        currentPage: 1,
          pageSize: 1000,
          searchByKeys: { driverName: that.filters.driverName, driverMobile: that.filters.driverMobile },
          orderByKeys: {createDate: 'desc'}
        }
      that.axios.post(`${this.api.baseURL}/driver/exportDriverPage`, params).then(res =>{
        that.exporting = false
        let newUrl = res.data.data.result;
        if (newUrl != ""){
          this.$notify({title: '导出成功', dangerouslyUseHTMLString: true, message: '请点击<a href="' + newUrl + '" class="blueFont"><b>【这里】</b></a>下载', duration: 0});
        }
      });
    },
    handleImport() {
      this.importVisible = true;
      this.$refs["importDriverId"].clearFiles();
    },
    handlePreview() {
      //
    },
    handleRemove() {
      //
    },
    addSubmit: function() {
      let that = this;
      this.$refs.addForm.validate(valid => {
        if (valid) {
          let para = Object.assign({}, this.addForm);
          that.axios
            .post(`${this.api.baseURL}/driver/createDriver`, para)
            .then(function(result) {
              console.log(result);
              // if (result && result.status == "200") {
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
              that.addCollapse = false;
            });
        }
      });
    },
    handlePreview() {},
    handleRemove(file) {},
    exceedExcelLimit(){
      let that = this;
      this.$confirm('上传文件个数超出限制，只能上传单个文件。 需要清除已上传的文件吗？', '提示', 
      {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'}).then(() => {
        that.$refs['importDriverId'].clearFiles();
        this.$message.success('已清除，请选择需要上传的文件')
      });
    },
    beforeImportUpload(file) {},
    afterImportUpload(response, file, fileList) {
      if (response.code != "200") {
        console.log("导入返回数据：" + response.data);
        if (response.data.resulturl && response.data.resulturl != "") {
          this.$message.error("导入错误，请在右上角下载错误明细！");
          // let newUrl = "http://www.bcscm.net/resource/" + response.data.resulturl //后台返回的串有问题，只能手工写死了
          this.ftphost = response.data.resultftphost;
          let newUrl = this.ftphost + response.data.resulturl;
          this.$notify({
            title: "导入错误",
            dangerouslyUseHTMLString: true,
            message:
              '请点击<a href="' +
              newUrl +
              '" class="blueFont" ><b>【这里】</b></a>下载错误明细，请修改后再次导入！',
            duration: 0
          });
        } else {
          this.$message.error("导入错误，请联系系统管理员！");
        }
      } else {
        this.$message.success("成功导入"+response.data.importCount+"条数据");
        this.importVisible = false;
        this.search();
      }
      this.$refs["importDriverId"].clearFiles();
    },
    importSubmit() {
      console.log(this.$refs["importDriverId"]);
      this.$refs["importDriverId"].headers.tokenId = getCookie("tokenid");
      this.$refs["importDriverId"].submit();
    },

    // 增加页面上传start
    beforeUpload_identiFrontPhone(file) {
      //身份证正面
    },
    uploadSuccess_identiFrontPhone(response, file, fileList) {
      //身份证正面
      if (response.code != "200") {
        identiFrontPhone_url = "";
        console.log("上传 身份证正面 返回数据：" + response.data);
        this.$message.error("上传身份证正面错误，请联系系统管理员！");
      } else {
        this.$message.success("上传成功！");
        this.addForm.frontIdcardPhoto = response.data.resulturl;
        this.ftphost = response.data.resultftphost;
        this.identiFrontPhone_url = this.ftphost + response.data.resulturl;
      }
      this.$refs["identiFrontPhone_ref"].clearFiles();
    },
    submitIdentiFrontPhone() {
      this.$refs["identiFrontPhone_ref"].headers.tokenId = getCookie("tokenid");
      this.$refs["identiFrontPhone_ref"].submit();
    },

    beforeUpload_identiBackPhoto(file) {
      //身份证反面
    },
    uploadSuccess_identiBackPhoto(response, file, fileList) {
      //身份证反面
      if (response.code != "200") {
        identiBackPhone_url = "";
        console.log("上传 身份证反面 返回数据：" + response.data);
        this.$message.error("上传 身份证反面 错误，请联系系统管理员！");
      } else {
        this.$message.success("上传成功！");
        this.addForm.backIdcardPhoto = response.data.resulturl;
        this.ftphost = response.data.resultftphost;
        this.identiBackPhone_url = this.ftphost + response.data.resulturl;
      }
      this.$refs["identiBackPhone_ref"].clearFiles();
    },
    submitIdentiBackPhone() {
      this.$refs["identiBackPhone_ref"].headers.tokenId = getCookie("tokenid");
      this.$refs["identiBackPhone_ref"].submit();
    },

    beforeUpload_licenseHomePhoto(file) {
      //驾驶证正面
    },
    uploadSuccess_licenseHomePhoto(response, file, fileList) {
      //驾驶证正面
      if (response.code != "200") {
        licenseHomePhoto_url = "";
        console.log("上传 身份证反面 返回数据：" + response.data);
        this.$message.error("上传 身份证反面 错误，请联系系统管理员！");
      } else {
        this.$message.success("上传成功！");
        this.addForm.licenseHomePhoto = response.data.resulturl;
        this.ftphost = response.data.resultftphost;
        this.licenseHomePhoto_url = this.ftphost + response.data.resulturl;
      }
      this.$refs["licenseHomePhoto_ref"].clearFiles();
    },
    submitLicenseHomePhotoBackPhone() {
      this.$refs["licenseHomePhoto_ref"].headers.tokenId = getCookie("tokenid");
      this.$refs["licenseHomePhoto_ref"].submit();
    },

    beforeUpload_licenseSidelinePhoto(file) {
      //驾驶证反面
    },
    uploadSuccess_licenseSidelinePhoto(response, file, fileList) {
      //驾驶证反面
      if (response.code != "200") {
        licenseSidelinePhoto_url = "";
        console.log("上传 身份证反面 返回数据：" + response.data);
        this.$message.error("上传 身份证反面 错误，请联系系统管理员！");
      } else {
        this.$message.success("上传成功！");
        this.addForm.licenseSidelinePhoto = response.data.resulturl;
        console.log("--=====----====--==");
        console.log(this.addForm.licenseSidelinePhoto);
        this.ftphost = response.data.resultftphost;
        console.log(this.ftphost);
        this.licenseSidelinePhoto_url = this.ftphost + response.data.resulturl;
      }
      this.$refs["licenseSidelinePhoto_ref"].clearFiles();
    },
    submitlicenseSidelinePhotoBackPhone() {
      this.$refs["licenseSidelinePhoto_ref"].headers.tokenId = getCookie(
        "tokenid"
      );
      this.$refs["licenseSidelinePhoto_ref"].submit();
    },

    beforeUpload_qualificationCertificatePhoto(file) {
      //从业资格证
    },
    uploadSuccess_qualificationCertificatePhoto(response, file, fileList) {
      //从业资格证
      if (response.code != "200") {
        qualiCertificatePhoto_url = "";
        console.log("上传 身份证反面 返回数据：" + response.data);
        this.$message.error("上传 身份证反面 错误，请联系系统管理员！");
      } else {
        this.$message.success("上传成功！");
        this.addForm.qualificationCertificatePhoto = response.data.resulturl;
        this.ftphost = response.data.resultftphost;
        this.qualiCertificatePhoto_url = this.ftphost + response.data.resulturl;
      }
      this.$refs["qualificationCertificatePhoto_ref"].clearFiles();
    },
    submitqualiCertificatePhotoBackPhone() {
      this.$refs[
        "qualificationCertificatePhoto_ref"
      ].headers.tokenId = getCookie("tokenid");
      this.$refs["qualificationCertificatePhoto_ref"].submit();
    },
    // 增加页面上传end

    // 修改页面上传start
    beforeUpload_identiFrontPhone_update(file) {
      //身份证正面
    },
    uploadSuccess_identiFrontPhone_update(response, file, fileList) {
      //身份证正面
      if (response.code != "200") {
        identiFrontPhone_url_update = "";
        console.log("上传 身份证正面 返回数据：" + response.data);
        this.$message.error("上传身份证正面错误，请联系系统管理员！");
      } else {
        this.$message.success("上传成功！");
        this.editForm.frontIdcardPhoto = response.data.resulturl;
        this.ftphost = response.data.resultftphost;
        this.identiFrontPhone_url_update =
          this.ftphost + response.data.resulturl;
      }
      this.$refs["identiFrontPhone_ref_update"].clearFiles();
    },
    submitIdentiFrontPhone_update() {
      this.$refs["identiFrontPhone_ref_update"].headers.tokenId = getCookie(
        "tokenid"
      );
      this.$refs["identiFrontPhone_ref_update"].submit();
    },

    beforeUpload_identiBackPhoto_update(file) {
      //身份证反面
    },
    uploadSuccess_identiBackPhoto_update(response, file, fileList) {
      //身份证反面
      if (response.code != "200") {
        identiBackPhone_url_update = "";
        console.log("上传 身份证反面 返回数据：" + response.data);
        this.$message.error("上传 身份证反面 错误，请联系系统管理员！");
      } else {
        this.$message.success("上传成功！");
        //alert(response.data.resulturl)
        this.editForm.backIdcardPhoto = response.data.resulturl;
        this.ftphost = response.data.resultftphost;
        this.identiBackPhone_url_update =
          this.ftphost + response.data.resulturl;
      }
      this.$refs["identiBackPhone_ref_update"].clearFiles();
    },
    submitIdentiBackPhone_update() {
      this.$refs["identiBackPhone_ref_update"].headers.tokenId = getCookie(
        "tokenid"
      );
      this.$refs["identiBackPhone_ref_update"].submit();
    },

    beforeUpload_licenseHomePhoto_update(file) {
      //驾驶证正面
    },
    uploadSuccess_licenseHomePhoto_update(response, file, fileList) {
      //驾驶证正面
      if (response.code != "200") {
        licenseHomePhoto_url_update = "";
        console.log("上传 身份证反面 返回数据：" + response.data);
        this.$message.error("上传 身份证反面 错误，请联系系统管理员！");
      } else {
        this.$message.success("上传成功！");
        this.editForm.licenseHomePhoto = response.data.resulturl;
        this.ftphost = response.data.resultftphost;
        this.licenseHomePhoto_url_update =
          this.ftphost + response.data.resulturl;
      }
      this.$refs["licenseHomePhoto_ref_update"].clearFiles();
    },
    submitLicenseHomePhotoBackPhone_update() {
      this.$refs["licenseHomePhoto_ref_update"].headers.tokenId = getCookie(
        "tokenid"
      );
      this.$refs["licenseHomePhoto_ref_update"].submit();
    },

    beforeUpload_licenseSidelinePhoto_update(file) {
      //驾驶证反面
    },
    uploadSuccess_licenseSidelinePhoto_update(response, file, fileList) {
      //驾驶证反面
      if (response.code != "200") {
        licenseSidelinePhoto_url_update = "";
        console.log("上传 身份证反面 返回数据：" + response.data);
        this.$message.error("上传 身份证反面 错误，请联系系统管理员！");
      } else {
        this.$message.success("上传成功！");
        this.editForm.licenseSidelinePhoto = response.data.resulturl;
        this.ftphost = response.data.resultftphost;
        this.licenseSidelinePhoto_url_update =
          this.ftphost + response.data.resulturl;
      }
      this.$refs["licenseSidelinePhoto_ref_update"].clearFiles();
    },
    submitlicenseSidelinePhotoBackPhone_update() {
      this.$refs["licenseSidelinePhoto_ref_update"].headers.tokenId = getCookie(
        "tokenid"
      );
      this.$refs["licenseSidelinePhoto_ref_update"].submit();
    },

    beforeUpload_qualificationCertificatePhoto_update(file) {
      //从业资格证
    },
    uploadSuccess_qualificationCertificatePhoto_update(
      response,
      file,
      fileList
    ) {
      //从业资格证
      if (response.code != "200") {
        qualiCertificatePhoto_url_update = "";
        console.log("上传 身份证反面 返回数据：" + response.data);
        this.$message.error("上传 身份证反面 错误，请联系系统管理员！");
      } else {
        this.$message.success("上传成功！");
        this.editForm.qualificationCertificatePhoto = response.data.resulturl;
        this.ftphost = response.data.resultftphost;
        this.qualiCertificatePhoto_url_update =
          this.ftphost + response.data.resulturl;
      }
      this.$refs["qualificationCertificatePhoto_ref_update"].clearFiles();
    },
    submitqualiCertificatePhotoBackPhone_update() {
      this.$refs[
        "qualificationCertificatePhoto_ref_update"
      ].headers.tokenId = getCookie("tokenid");
      this.$refs["qualificationCertificatePhoto_ref_update"].submit();
    },
    // 修改页面上传end

    editSubmit: function() {
      this.editFormVisible = false;
      this.compile = false;
      let that = this;
      this.$refs.editForm.validate(valid => {
        if (valid) {
          let para = Object.assign({}, this.editForm);

          //para.vehicleId = this.editForm.id
          that.axios
            .post(`${this.api.baseURL}/driver/update`, para)
            .then(function(result) {
              //console.log(result);
              if (result && result.status == "200") {
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
              
              
            });
        }
        
      });
    },
    showEditDialog(index, row) {
      this.bcInfoKey = row.bcInfoKey;
      this.bcHash = row.bcHash;
      this.editFormVisible = true;
      this.editForm = Object.assign({}, row);
      this.identiFrontPhone_url_update = "static/img/white100X100.png"; //初始化空图片
      this.identiBackPhone_url_update = "static/img/white100X100.png";
      this.licenseHomePhoto_url_update = "static/img/white100X100.png";
      this.licenseSidelinePhoto_url_update = "static/img/white100X100.png";
      this.qualiCertificatePhoto_url_update = "static/img/white100X100.png";

      if (row.frontIdcardPhotoFullPath) {
        this.identiFrontPhone_url_update = row.frontIdcardPhotoFullPath; //初始化图片
      }
      if (row.backIdcardPhotoFullPath) {
        this.identiBackPhone_url_update = row.backIdcardPhotoFullPath;
      }
      if (row.licenseHomePhotoFullPath) {
        this.licenseHomePhoto_url_update = row.licenseHomePhotoFullPath;
      }
      if (row.licenseSidelinePhotoFullPath) {
        this.licenseSidelinePhoto_url_update = row.licenseSidelinePhotoFullPath;
      }
      if (row.qualificationCertificatePhotoFullPath) {
        this.qualiCertificatePhoto_url_update =
          row.qualificationCertificatePhotoFullPath;
      }
    },
    ddd(index){
      if(this.number) {
        this.sum = index;
        this.number = false;
      }else {
        this.sum = false;
        this.number = true;
      }
    },
    delDriver(index, row) {
      this.$confirm("您确定要删除【" + row.driverName + "】吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let that = this;
          let p = { id: row.id };
          that.axios
            .post(`${this.api.baseURL}/driver/delete`, p)
            .then(function(result) {
              //console.log(result);
              if (result && result.status == "200") {
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
    authentication(index, row) {
      this.$confirm("您确定要实名认证【" + row.driverName + "】吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let that = this;
          let p = { id: row.id };
          that.axios
            .post(`${this.api.baseURL}/driver/authentication`, p)
            .then(function(result) {
              console.log(result);
              if (result && result.data.code == "200") {
                //成功
                that.$message.success({
                  showClose: true,
                  message: "认证成功",
                  duration: 2000
                });
              } else {
                that.$message.error({
                  showClose: true,
                  message: "认证失败,"+result.data.message,
                  duration: 2000
                });
              }
              that.search();
            });
        })
        .catch(() => {
          this.$message({ type: "info", message: "已取消删除" });
        });
    },
    //新增弹出框的收缩
    cancel(){
      this.addFormVisible = false;
      this.addCollapse = false;
      this.parentOperate = "cancle_" + new Date().getTime();
      console.log(" this.parentOperate = " + this.parentOperate);
    },
    addClose(){
      this.addFormVisible = false;
      this.addCollapse = false;
      this.parentOperate = "cancle_" + new Date().getTime();
      console.log(" xxx this.parentOperate = " + this.parentOperate)
    },
    //编辑弹出框的收缩
    abolish(){
      this.editFormVisible = false;
      this.compile = false;
      this.search();
    },
    editClose(){
      this.editFormVisible = false;
      this.compile = false;
      this.search();
    },
    showEditMobileDialog(){
      this.$prompt('请输入新手机号', '修改手机号', {
        confirmButtonText: '确定', cancelButtonText: '取消',
        inputPattern: /^[1][1,2,3,4,5,6,7,8,9][0-9]{9}$/,
        inputErrorMessage: '手机号码不正确'
      }).then(({ value }) => {
        // 判断手机号是否真正改了，如果没有，提示错误
        // 修改成功后，记得将model里的当前手机号改成新号码
        this.$message({
          type: 'success',
          message: '你的新手机是: ' + value
        });

        let that = this
        let params = {  
          id:that.editForm.id,
          customerOrgId: that.editForm.customerOrgId,
          driverMobileNew: value,
          driverMobileOld: that.editForm.driverMobile
        }
        that.axios.post(`${this.api.baseURL}/driver/updateDriverPhone`, params).then(res =>{  
          console.log(res)
          if(res.data.code == "200"){
            that.editForm.driverMobile = value;
          }else{
            that.$message.error("修改失败："+res.data.message);
          }
        });
        
      })
      // .catch(() => {
      //   this.$message({
      //     type: 'info',
      //     message: '取消修改手机号'
      //   });       
      // });
    }
  },
  mounted() {
    this.handleSearch();
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
.blueFont {
  color: #409eff;
}
.addInt {
  width: 75%;
  // float: right;
}
.addint1 {
  width: 92%;
}

.editPut {
  width: 80%;
}
.editPut1 {
  width: 92%;
}
.uploadPhoto {
  margin-bottom: 20px;
  border-bottom: 1px solid #ccc;
}
.addCollapse .text {
  width: 100%;
  height: 20px;
  line-height: 20px;
  text-align: center;
  color: #383838;
  cursor: pointer;
}
.driverTable .el-table__row .el-button {
  padding: 0;
  color: #409EFF;
  border: none;
  padding-right: 3px;
}
</style>
