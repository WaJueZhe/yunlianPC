<template>
    <el-row class="warp" style="margin-bottom:50px;">
        <el-col :span="24" class="warp-breadcrum" style="padding:10px;">
            <app-title :title="carTitle"></app-title>
        </el-col>
                
        <el-col :span="24" class="warp-main" v-loading="loading" element-loading-text="拼命加载中">
            <!--工具条-->
            <el-col :span="24" style="padding-bottom: 0px;">
                <el-form :inline="true" :model="filters">
                    <el-form-item>
                        <el-input v-model="filters.vehicleNO" placeholder="车牌号" style="min-width: 120px;"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="handleSearch" @keyup.13="alert">查询</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="handleAddNew">新增</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="handleExport" :loading="exporting">导出</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="handleImport">导入</el-button>
                    </el-form-item>
                </el-form>
        
                <!--列表-->
                <el-table :data="vehicleList" highlight-current-row v-loading="loading" style="width:100%" stripe :border="true" class="vehicleTable">
                    <el-table-column width="50" type="index" label="序号" align="center"></el-table-column>

                    <el-table-column prop="id" label="id" v-if="false"></el-table-column>

                    <el-table-column prop="vehicleNo" label="车牌号"   align="center"></el-table-column>

                    <el-table-column prop="vehicleType" label="车型"    align="center" :formatter="formatVehicleType"></el-table-column>

                    <el-table-column prop="vehicleNumberType" label="牌照类型" :formatter="formatVehicleNumberType"   align="center"></el-table-column>  
                    
                    <el-table-column prop="length3Bit" label="车长(米)"   align="center"></el-table-column>
                    <el-table-column prop="width3Bit" label="车宽(米)" align="center"></el-table-column>
                    <el-table-column prop="height3Bit" label="车高(米)"  align="center"></el-table-column>

                    <el-table-column prop="createDate" label="创建时间"  align="center" min-width="160"></el-table-column>

                    <el-table-column prop="linkStatus" label="上链状态" align="center"></el-table-column>
                    <el-table-column label="操作" fixed="right"  align="center" width="100">
                        <template slot-scope="scope" >
                            <el-button @click="showEditDialog(scope.$index,scope.row)">编辑</el-button>
                            <el-button @click="delVehicle(scope.$index,scope.row)" size="small">删除</el-button>
                        </template>
                    </el-table-column>              
                </el-table>
            </el-col>

            <!--工具条-->
            <el-col :span="24" class="toolbar">
                <el-pagination layout="total, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-size="limit" :total="total" background style="float:right;">
                </el-pagination>
            </el-col>

            <!-- 新增弹出框-->
            <el-dialog title="新增" :visible.sync="addFormVisible" :before-close="addClose" custom-class="myClass">
              <el-form :model="addForm" label-width="110px" :rules="addFormRules" ref="addForm" label-position="right">
                <!-- 必填项 -->
                <el-row :gutter="10">
                  <el-col :span="12">
                    <el-form-item label="车牌号" prop="vehicleNo">
                      <el-input v-model="addForm.vehicleNo" auto-complete="off" style="width:80%"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="牌照类型" prop="vehicleNumberType">
                      <el-select v-model="addForm.vehicleNumberType" placeholder="牌照类型" style="width:80%">
                        <el-option v-for="i in vehicleNumberTypeEnum" :key="i.val" :label="i.lbl" :value="i.val"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="10">
                  <el-col :span="12">
                    <el-form-item label="车型" prop="vehicleType">
                      <el-select v-model="addForm.vehicleType" placeholder="车型" class="add-int">
                        <el-option v-for="i in vehicleTypeEnum" :key="i.val" :label="i.lbl" :value="i.val"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="车高(米)" prop="height">
                      <el-input v-model="addForm.height" auto-complete="off" class="add-int"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="10">
                  <el-col :span="12">
                    <el-form-item label="车长(米)" prop="length">
                      <el-input v-model="addForm.length" auto-complete="off" class="add-int"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="车宽(米)" prop="width">
                      <el-input v-model="addForm.width" auto-complete="off" class="add-int"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="10">
                  <el-col :span="12">
                    <el-form-item label="最大吨位" prop="maxTon">
                      <el-input v-model="addForm.maxTon" auto-complete="off" class="add-int"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="最大方数" prop="maxSquare">
                      <el-input v-model="addForm.maxSquare" auto-complete="off" class="add-int"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <!-- 可选项 -->
                <el-row :gutter="10">
                  <el-col :span="12">
                    <el-form-item label="车架号码" prop="trailerNumber">
                      <el-input v-model="addForm.trailerNumber" auto-complete="off" class="add-more"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="行驶证号" prop="drivingLicenseNumber">
                      <el-input v-model="addForm.drivingLicenseNumber" auto-complete="off" class="add-more"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>

                  <!-- 折叠区域 -->
                <div class="addCollpase">
                  <div>
                    <el-collapse-transition>
                      <div v-show="addCollape">
                        <el-row :gutter="10">
                          <el-col :span="12">
                            <el-form-item label="行驶证开始日期" prop="drivingLicenseBeginDate">
                              <el-date-picker v-model="addForm.drivingLicenseBeginDate" format="yyyy-MM-dd" type="date" value-format="yyyy-MM-dd" placeholder="选择日期"
                                class="add-more">
                              </el-date-picker>
                            </el-form-item>
                          </el-col>
                          <el-col :span="12">
                            <el-form-item label="行驶证结束日期" prop="drivingLicenseEndDate">
                              <el-date-picker v-model="addForm.drivingLicenseEndDate" format="yyyy-MM-dd" type="date" value-format="yyyy-MM-dd" placeholder="选择日期"
                                class="add-more">
                              </el-date-picker>
                            </el-form-item>
                          </el-col>
                        </el-row>

                        <el-row :gutter="10">
                          <el-col :span="12">
                            <el-form-item label="道路运营许可证" prop="roadTransportLicenseNumber">
                              <el-input v-model="addForm.roadTransportLicenseNumber" auto-complete="off" class="add-more"></el-input>
                            </el-form-item>
                          </el-col>
                          <el-col :span="12">
                            <el-form-item label="GPS设备品牌" prop="gpsBrand">
                              <el-input v-model="addForm.gpsBrand" auto-complete="off" class="add-more"></el-input>
                            </el-form-item>
                          </el-col>
                        </el-row>

                        <el-row :gutter="10">
                          <el-col :span="12">
                            <el-form-item label="GPS设备型号" prop="gpsModel">
                              <el-input v-model="addForm.gpsModel" auto-complete="off" class="add-more"></el-input>
                            </el-form-item>
                          </el-col>
                          <el-col :span="12">
                            <el-form-item label="GPS设备编号" prop="gpsDeviceId">
                              <el-input v-model="addForm.gpsDeviceId" auto-complete="off" class="add-more"></el-input>
                            </el-form-item>
                          </el-col>
                        </el-row>

                        <el-row :gutter="10">
                          <el-col :span="12">
                            <el-form-item label="车主手机号" prop="driverPhone">
                              <el-input v-model="addForm.driverPhone" :maxlength="11" auto-complete="off" class="add-more"></el-input>
                            </el-form-item>
                          </el-col>
                          <el-col :span="12">
                            <el-form-item label="所属车队" prop="driverTeam">
                              <el-input v-model="addForm.driverTeam" auto-complete="off" class="add-more"></el-input>
                            </el-form-item>
                          </el-col>
                        </el-row>

                        <el-row :gutter="20">
                          <el-col :span="6">
                            <p>请上传驾驶证</p>
                            <!-- 上传驾驶证 -->
                            <app-uploadImg :uploadUrl="driverCade" @getImgsrc="drivermethod" :operate="parentOperate"></app-uploadImg>

                          </el-col>
                          <el-col :span="6" class="uploadImg">
                            <p>请上传驾驶证</p>
                            <img :src="vehicleLicensePhoto_url">
                          </el-col>

                          <el-col :span="6">
                            <p>请上传道路运输许可证</p>
                            <!-- 上传道路运输许可证 -->
                            <app-uploadImg :uploadUrl="rodeCade" @getImgsrc="rodemethod" :operate="parentOperate"></app-uploadImg>
                         
                          </el-col>
                          <el-col :span="6" class="uploadImg">
                            <p>请上传道路运输许可证</p>
                            <img :src="roadOperationPhoto_url">
                          </el-col>
                        </el-row>
                        </div>
                      </el-collapse-transition>
                      <div class="text" @click="addCollape = !addCollape">
                        <span v-show="!addCollape">点击填写更多</span>
                        <span v-show="addCollape">收起</span>
                      </div>
                  </div>
                </div>
                <el-input type="text" v-model="addForm.vehicleLicensePhoto" auto-complete="off" :disabled="true" v-if="false"></el-input>
                <el-input type="text" v-model="addForm.roadOperationPhoto" auto-complete="off" :disabled="true" v-if="false"></el-input>


              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click.native="cancel">取消</el-button>
                <el-button type="primary" @click.native="addSubmit">保存</el-button>
              </div>
            </el-dialog>

            <!-- 编辑弹出框 -->
            <el-dialog title="编辑" :visible.sync ="editFormVisible" :before-close="editClose" custom-class="myClass">
                <el-form :model="editForm" label-width="110px" :rules="addFormRules" ref="editForm" label-position="right">
                    <el-row :gutter="10">
                      <el-col :span="12">
                        <el-form-item label="车牌号" prop="vehicleNo">
                          <el-input v-model="editForm.vehicleNo" auto-complete="off" style="width:80%" :disabled="true"></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="牌照类型" prop="vehicleNumberType">
                            <el-select v-model="editForm.vehicleNumberType" placeholder="牌照类型" style="width:80%">
                                <el-option v-for="i in vehicleNumberTypeEnum" :key="i.val" :label="i.lbl" :value="i.val" ></el-option>
                            </el-select>                                                            
                        </el-form-item> 
                      </el-col>
                    </el-row>

                    <el-row :gutter="10">
                      <el-col :span="12">
                        <el-form-item label="车型" prop="vehicleType">
                          <el-select v-model="editForm.vehicleType" placeholder="车型" class="add-int">
                              <el-option v-for="i in vehicleTypeEnum" :key="i.val" :label="i.lbl" :value="i.val" ></el-option>
                          </el-select> 
                        </el-form-item>
                      </el-col>
                       <el-col :span="12">
                        <el-form-item label="车高(米)" prop="height">
                            <el-input v-model="editForm.height" auto-complete="off" class="add-int"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>

                    <el-row :gutter="10">
                      <el-col :span="12">
                        <el-form-item label="车长(米)" prop="length">
                            <el-input v-model="editForm.length" auto-complete="off" class="add-int"></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="车宽(米)" prop="width">
                            <el-input v-model="editForm.width" auto-complete="off" class="add-int"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>

                    <el-row :gutter="10">
                      <el-col :span="12">
                        <el-form-item label="最大吨位" prop="maxTon">
                            <el-input v-model="editForm.maxTon" auto-complete="off" class="add-int"></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="最大方数" prop="maxSquare">
                            <el-input v-model="editForm.maxSquare" auto-complete="off" class="add-int"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    
                    <el-row :gutter="10">
                      <el-col :span="12">
                        <el-form-item label="车架号码" prop="trailerNumber">
                            <el-input v-model="editForm.trailerNumber" auto-complete="off" class="add-more"></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="行驶证号" prop="drivingLicenseNumber">
                            <el-input v-model="editForm.drivingLicenseNumber" auto-complete="off" class="add-more"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>

                    
                    <!-- 折叠区域 -->
                    <div class="edieText">
                      <el-collapse-transition>
                        <div v-show="editShow">
                          <el-row :gutter="10">
                            <el-col :span="12">
                              <el-form-item label="行驶证开始日期" prop="drivingLicenseBeginDate">
                                  <el-date-picker v-model="editForm.drivingLicenseBeginDate" format="yyyy-MM-dd" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" class="add-more">
                                  </el-date-picker> 
                              </el-form-item>
                            </el-col>
                            <el-col :span="12">
                              <el-form-item label="行驶证结束日期" prop="drivingLicenseEndDate">
                                  <el-date-picker v-model="editForm.drivingLicenseEndDate" format="yyyy-MM-dd" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" class="add-more">
                                  </el-date-picker> 
                              </el-form-item>
                            </el-col>  
                          </el-row>

                            <el-row :gutter="10">
                              <el-col :span="12">
                                 <el-form-item label="道路运营许可证" prop="roadTransportLicenseNumber" class="add-more">
                                  <el-input v-model="editForm.roadTransportLicenseNumber" auto-complete="off" ></el-input>
                                </el-form-item>
                              </el-col>
                              
                              <el-col :span="12">
                                <el-form-item label="GPS设备品牌" prop="gpsBrand">
                                  <el-input v-model="editForm.gpsBrand" auto-complete="off" class="add-more"></el-input>
                                </el-form-item>
                              </el-col>
                              
                            </el-row>

                            <el-row :gutter="10">
                              <el-col :span="12">
                                <el-form-item label="GPS设备型号" prop="gpsBrand">
                                    <el-input v-model="editForm.gpsBrand" auto-complete="off" class="add-more"></el-input>
                                </el-form-item>
                              </el-col>
                              <el-col :span="12">
                                <el-form-item label="GPS设备编号" prop="gpsDeviceId">
                                    <el-input v-model="editForm.gpsDeviceId" auto-complete="off" class="add-more"></el-input>
                                </el-form-item>
                              </el-col>
                            </el-row>

                            <el-row :gutter="10">
                              <el-col :span="12">
                                <el-form-item label="车主手机号" prop="driverPhone" >
                                    <el-input v-model="editForm.driverPhone" :maxlength="11" auto-complete="off" class="add-more"></el-input>
                                </el-form-item>  
                              </el-col>
                              <el-col :span="12">
                                <el-form-item label="所属车队" prop="driverTeam" class="add-more">
                                    <el-input v-model="editForm.driverTeam" auto-complete="off"></el-input>
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
                            <!-- 上传图片 -->
                            <el-row :gutter="10">
                              <el-col :span="12">
                                <!-- <el-form-item label="请上传驾驶证" prop="vehicleLicensePhoto"> -->
                                  <p style="text-align: left;">请上传驾驶证</p>
                                  <app-uploadImg :creatImg="editForm.vehicleLicensePhotoFullPath" :creatURL="upLoadPhotoUrl" @getImgsrc="editVenMenthod" :index="editForm.id"></app-uploadImg>

                                <!-- </el-form-item> -->
                              </el-col>
                              <el-col :span="12">
                                <!-- <el-form-item label="请上传道路运输许可证" prop="roadOperationPhoto"> -->
                                 <p style="text-align: left;">请上传道路运输许可证</p>
                                  <app-uploadImg :creatImg="editForm.roadOperationPhotoFullPath" :creatURL="upLoadPhotoUrl" @getImgsrc="editRoadMethod" :index="editForm.id"></app-uploadImg>

                                <!-- </el-form-item> -->
                              </el-col>
                            </el-row>
                        </div>
                      </el-collapse-transition>
                      <p @click="editShow = !editShow" v-if="editShow == false">点击显示更多</p>
                      <p @click="editShow = !editShow" v-else>收起</p>

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
                            点击<a :href="vehicleTemplateDownloadUrl" download="车辆导入模板.xlsx" class="blueFont"><b>【这里】</b></a>下载模板
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
import { getCookie } from "../../../js/cookie.js";
export default {
  created() {
    //console.log(this.tokenId);
  },
  data() {
    var checkDriverPhone = (rule, value, callback) => {
      if (this.addForm.driverPhone != "") {
        if (isNaN(this.addForm.driverPhone)) {
          callback(new Error("手机号必须为数字!"));
        } else if (this.addForm.driverPhone.indexOf("1") != 0) {
          callback(new Error("手机号必须以1开始!"));
        } else {
          callback(); //空值则默认成功
        }
      } else {
        callback(); //空值则默认成功
      }
    };
    //在此自定义校验，如新录入数据，在输入后校验后台是否重复
    var checkExistsVehicle = (rule, value, callback) => {
      if (this.addForm.vehicleNo != "") {
        let p = { vehicleNO: this.addForm.vehicleNo };
        this.axios
          .post(`${this.api.baseURL}/vehicle_driver/getCountByVehicleNO`, p)
          .then(res => {
            //console.log(res);
            if (parseInt(res.data.data.result) > 0) {
              callback(new Error("已存在相同的车牌号!"));
            } else callback();
          });
      } else callback(); //空值则默认成功
    };
    return {
      parentOperate: 'create',
      fileLimit: 1,
      bcInfoKey:'',//区块链指
      bcHash:'',//区块哈希值
      addCollape: false, //添加弹出框
      editShow: false,
      tokenId: { tokenid: getCookie("tokenid") },
      uploadFlag: false,
      addShow: false,
      carTitle: "车辆管理",
      ftphost: "",
      codePhoto: [], //驾驶证图片

      driverCade: {
        url: `${this.api.baseURL}/vehicle_driver/uploadPhotoBase64`,
        name: "驾驶证"
      }, //驾驶证
      rodeCade: {
        url: `${this.api.baseURL}/vehicle_driver/uploadPhotoBase64`,
        name: "道路运输许可证"
      }, //道路运输许可证

      upLoadPhotoUrl: `${this.api.baseURL}/vehicle_driver/uploadPhotoBase64`,
      //增加页面
      vehicleLicensePhoto_url: "static/img/white100X100.png", //初始化图片
      roadOperationPhoto_url: "static/img/white100X100.png",
      //修改页面
      vehicleLicensePhoto_url_update: "",
      roadOperationPhoto_url_update: "",

      updateurl: `${this.api.baseURL}/vehicle_driver/importVehicle`,
      // vehicleTemplateDownloadUrl: 'http://' + window.location.host + `/src/page/bs/templatedownload/carTemplate.xlsx`,
      vehicleTemplateDownloadUrl:
        "http://" + window.location.host + `/templatedownload/carTemplate.xlsx`,
      vehicleList: [],
      filters: {
        vehicleNO: ""
      },
      vehicleNumberTypeEnum: [
        { val: "1", lbl: "大型号牌" },
        { val: "2", lbl: "小型号牌" },
        { val: "99", lbl: "其他号牌" }
      ], //定义下拉框的options
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
      total: 0,
      page: 1,
      limit: 10,
      loading: false,
      addFormVisible: false, //新增界面是否显示
      importVisible: false, //导入界面是否显示
      addFormRules: {
        vehicleNo: [
          { required: true, message: "请输入车牌号", trigger: "blur" },
          { min: 7, max: 7, message: "车牌号长度错误", trigger: "blur" }
          // , { validator: checkExistsVehicle, trigger: "blur" } //自定义校验，不可修改车牌
        ],
        vehicleNumberType: [
          { required: true, message: "请选择牌照类型", trigger: "blur" }
        ],
        driverPhone: [
          { required: false, message: "请输入手机号", trigger: "blur" },
          {
            min: 11,
            max: 11,
            message: "手机号码错误,11位手机号",
            trigger: "blur"
          },
          { validator: checkDriverPhone, trigger: "blur" } //自定义校验
        ]
      },
      addForm: {
        driverPhone: "",
        vehicleNo: "",
        vehicleNumberType: "",
        vehicleType: "",
        height: "",
        length: "",
        width: ""
      },
      editFormVisible: false,
      editForm: {
        id: "",
        categoryDesc: "",
        remarks: "",
        index: ""
      },
      importForm: {},
      importFormRules: {},
      exporting: false
    };
  },
  methods: {
    formatBcStatus: function(row, column){
      return (row.bcStatus && row.bcStatus == "1") ? "已上链" : "上链中";
    },
    //新增上传
    beforeUpload_vehicleLicensePhoto(file) {
      //车辆行驶证
    },
    uploadSuccess_vehicleLicensePhoto(response, file, fileList) {
      if (response.code != "200") {
        vehicleLicensePhoto_url = "";
        this.$message.error("上传 车辆行驶证 错误，请联系系统管理员！");
      } else {
        this.$message.success("上传成功！");
        this.addForm.vehicleLicensePhoto = response.data.resulturl;
        this.ftphost = response.data.resultftphost;

        // this.codePhoto.push(this.ftphost + response.data.resulturl)
        // 修改图片
        this.vehicleLicensePhoto_url = this.ftphost + response.data.resulturl;
      }
      this.$refs["vehicleLicensePhoto_ref"].clearFiles();
    },
    submitvehicleLicensePhoto() {
      this.$refs["vehicleLicensePhoto_ref"].headers.tokenId = getCookie(
        "tokenid"
      );
      this.$refs["vehicleLicensePhoto_ref"].submit();
    },
    beforeUpload_roadOperationPhoto(file) {
      //道路运营许可证
    },
    uploadSuccess_roadOperationPhoto(response, file, fileList) {
      //console.log(response);
      if (response.code != "200") {
        roadOperationPhoto_url = "";
        this.$message.error("上传 车辆行驶证 错误，请联系系统管理员！");
      } else {
        this.$message.success("上传成功！");
        this.addForm.roadOperationPhoto = response.data.resulturl;
        this.ftphost = response.data.resultftphost;
        this.roadOperationPhoto_url = this.ftphost + response.data.resulturl;
      }
      this.$refs["roadOperationPhoto_ref"].clearFiles();
    },
    submitroadOperationPhoto() {
      this.$refs["roadOperationPhoto_ref"].headers.tokenId = getCookie(
        "tokenid"
      );
      this.$refs["roadOperationPhoto_ref"].submit();
    },
    //修改上传
    beforeUpload_vehicleLicensePhoto_update(file) {
      //车辆行驶证
    },
    uploadSuccess_vehicleLicensePhoto_update(response, file, fileList) {
      if (response.code != "200") {
        vehicleLicensePhoto_url_update = "";
        //console.log("上传 营业执照 返回数据：" + response.data);
        this.$message.error("上传 营业执照 错误，请联系系统管理员！");
      } else {
        this.$message.success("上传成功！");
        this.editForm.vehicleLicensePhoto = response.data.resulturl;
        this.ftphost = response.data.resultftphost;
        this.vehicleLicensePhoto_url_update =
          this.ftphost + response.data.resulturl;
      }
      this.$refs["vehicleLicensePhoto_ref_update"].clearFiles();
    },
    submitvehicleLicensePhoto_update() {
      this.$refs["vehicleLicensePhoto_ref_update"].headers.tokenId = getCookie(
        "tokenid"
      );
      this.$refs["vehicleLicensePhoto_ref_update"].submit();
    },
    beforeUpload_roadOperationPhoto_update(file) {
      //道路运营许可证
    },
    uploadSuccess_roadOperationPhoto_update(response, file, fileList) {
      if (response.code != "200") {
        roadOperationPhoto_url_update = "";
        //console.log("上传 营业执照 返回数据：" + response.data);
        this.$message.error("上传 营业执照 错误，请联系系统管理员！");
      } else {
        this.$message.success("上传成功！");
        this.editForm.roadOperationPhoto = response.data.resulturl;
        this.ftphost = response.data.resultftphost;
        this.roadOperationPhoto_url_update =
          this.ftphost + response.data.resulturl;
      }
      this.$refs["roadOperationPhoto_ref_update"].clearFiles();
    },
    submitroadOperationPhoto_update() {
      this.$refs["roadOperationPhoto_ref_update"].headers.tokenId = getCookie(
        "tokenid"
      );
      this.$refs["roadOperationPhoto_ref_update"].submit();
    },

    formatVehicleNumberType: function(row, column) {
      let ret = "";
      switch (row.vehicleNumberType) {
        case "1":
          ret = "大型号牌";
          break;
        case "2":
          ret = "小型号牌";
          break;
        case "99":
          ret = "其他号牌";
          break;
        default:
          break;
      }
      return ret;
    },
    formatVehicleType: function(row, column) {
      let ret = "";
      switch (row.vehicleType) {
        case "H01":
          ret = "普通货车";
          break;
        case "H02":
          ret = "厢式货车";
          break;
        case "H04":
          ret = "罐式货车";
          break;
        case "Q00":
          ret = "牵引车";
          break;
        case "G01":
          ret = "普通挂车";
          break;
        case "G03":
          ret = "罐式挂车";
          break;
        case "G05":
          ret = "集装箱挂车";
          break;
        case "H09":
          ret = "仓栅式货车";
          break;
        case "H03":
          ret = "封闭货车";
          break;
        case "H05":
          ret = "平板货车";
          break;
        case "H06":
          ret = "集装箱车";
          break;
        case "H07":
          ret = "自卸货车";
          break;
        case "H08":
          ret = "特殊结构货车";
          break;
        case "Z00":
          ret = "专项作业车";
          break;
        case "G02":
          ret = "厢式挂车";
          break;
        case "G07":
          ret = "仓栅式挂车";
          break;
        case "G04":
          ret = "平板挂车";
          break;
        case "G06":
          ret = "自卸挂车";
          break;
        case "G09":
          ret = "专项作业挂车";
          break;
        case "X91":
          ret = "车辆运输车";
          break;
        case "X92":
          ret = "车辆运输车(单排)";
          break;
        default:
          break;
      }
      return ret;
    },
    handleExport() {
      this.exporting = true;

      let that = this
        let params = {
        currentPage: 1,
          pageSize: 1000,
          searchByKeys: { vehicleNO: that.filters.vehicleNO },
          orderByKeys: {createDate: 'desc'}
        }
      that.axios.post(`${this.api.baseURL}/vehicle_driver/exportVehiclePage`, params).then(res =>{
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
    beforeImportUpload(file) {},
    exceedExcelLimit(){
      let that = this;
      this.$confirm('上传文件个数超出限制，只能上传单个文件。 需要清除已上传的文件吗？', '提示', 
      {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'}).then(() => {
        that.$refs['importDriverId'].clearFiles();
        this.$message.success('已清除，请选择需要上传的文件')
      });
    },
    afterImportUpload(response, file, fileList) {
      if (response.code != "200") {
        //console.log("导入返回数据：" + response.data);
        if (response.data.resulturl && response.data.resulturl != "") {
          this.$message.error("导入错误，请在右上角下载错误明细！");
          // let newUrl = "http://www.bcscm.net/resource/" + response.data.resulturl; //后台返回的串有问题，只能手工写死了
          this.ftphost = response.data.resultftphost;
          let newUrl = this.ftphost + response.data.resulturl;
          this.$notify({
            title: "导入错误",
            dangerouslyUseHTMLString: true,
            message:
              '请点击<a href="' +
              newUrl +
              '" class="blueFont"><b>【这里】</b></a>下载错误明细，请修改后再次导入！',
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
      //console.log(this.$refs["importDriverId"]);
      this.$refs["importDriverId"].headers.tokenId = getCookie("tokenid");
      this.$refs["importDriverId"].submit();
    },
    handleSearch() {
      this.total = 0;
      this.page = 1;
      //增加页面
      (this.vehicleLicensePhoto_url = "static/img/white100X100.png"), //初始化图片
        (this.roadOperationPhoto_url = "static/img/white100X100.png"),
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
        searchByKeys: { vehicleNO: that.filters.vehicleNO },
        orderByKeys: { createDate: "desc" }
      };
      that.axios
        .post(`${this.api.baseURL}/vehicle_driver/findPage`, params)
        .then(res => {
          that.vehicleList = res.data.data.result.content;
          that.total = res.data.data.result.totalRecord;
          //console.log(res)
        });
    },

    handleAddNew() {
      this.addFormVisible = true;
      this.vehicleLicensePhoto_url_update = "static/img/white100X100.png"; //初始化空图片
      this.roadOperationPhoto_url_update = "static/img/white100X100.png";
      this.addForm = {
        categoryDesc: "",
        driverPhone: "",
        remarks: ""
      };
    },
    addSubmit: function() {
      //发送请求
      let that = this;
      this.$refs.addForm.validate(valid => {
        if (valid) {
          let para = Object.assign({}, this.addForm);
          //console.log("上传数据");
          //console.log(para);
          // console.table(para);
          that.axios
            .post(`${this.api.baseURL}/vehicle_driver/createVehicle`, para)
            .then(function(result) {
              //console.log(result);
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
              that.addCollape = false;
            });
        }
      });
    },
    editSubmit: function() {
      let that = this;
      this.$refs.editForm.validate(valid => {
        if (valid) {
          let para = Object.assign({}, this.editForm);

          para.vehicleId = this.editForm.id;
          //  para.drivingLicenseBeginDate = null
          //  para.drivingLicenseEndDate = null

          that.axios
            .post(`${this.api.baseURL}/vehicle_driver/update`, para)
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
              that.editFormVisible = false;
              that.editShow = false;
            });
        }
      });
    },
    showEditDialog(index, row) {
      this.bcInfoKey = row.bcInfoKey;
      this.bcHash = row.bcHash;
      this.editFormVisible = true;
      this.editForm = Object.assign({}, row);
      // console.log(this.editForm.id)
      // console.log(this.editForm.vehicleLicensePhotoFullPath)
    },
    delVehicle(index, row) {
      this.$confirm("您确定要删除【" + row.vehicleNo + "】吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let that = this;
          let p = { vehicleId: row.id };
          that.axios
            .post(`${this.api.baseURL}/vehicle_driver/delete`, p)
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
    drivermethod(http, url) {
      //新增驾驶证
      this.addForm.vehicleLicensePhoto = url;
    },
    rodemethod(http, url) {
      //新增道路运输许可证
      this.addForm.roadOperationPhoto = url;
    },
    editVenMenthod(http, url) {
      //编辑驾驶
      this.editForm.vehicleLicensePhoto = url;
    },
    editRoadMethod(http, url) {
      //编辑道路运输
      this.editForm.roadOperationPhoto = url;
    },
    //新增弹出框的收缩
    cancel(){
      this.addFormVisible = false;
      this.addCollape = false;
      this.parentOperate = "cancle_" + new Date().getTime();
      console.log(" this.parentOperate = " + this.parentOperate)
    },
    addClose(){
      this.addFormVisible = false;
      this.addCollape = false;
      this.parentOperate = "cancle_" + new Date().getTime();
      console.log(" this.parentOperate = " + this.parentOperate)
    },
    //编辑弹出框的收缩
    abolish(){
      this.editFormVisible = false;
      this.editShow = false;
    },
    editClose(){
      this.editFormVisible = false;
      this.editShow = false;
    },
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
.number {
  background-color: skyblue;
}


.add-int {
  width: 80%;
  // float: right;
}

.add-more {
  width: 80%;
  // float: right;
}
.el-collapse-item__header {
  background-color: #ffffff;
}
.coll {
  width: 100px;
  background-color: #ffffff;
}

.more {
  width: 100%;
  text-align: center;
  margin-bottom: 20px;
  cursor: pointer;
}

.loadPhoto {
  padding-bottom: 10px;
}

// 上传图片显示
.uploadImg {
  p {
    opacity: 0;
  }
  img {
    width: 148px;
    height: 148px;
    border-radius: 6px;
  }
}

// 编辑弹出框
.editPut {
  width: 90%;
}
.edieText {
  width: 100%;
  p {
    text-align: center;
    cursor: pointer;
    margin-bottom: 10px;
  }
}

.addCollpase .text {
  width: 100%;
  height: 20px;
  text-align: center;
  color: #383838;
  cursor: pointer;
}

.vehicleTable .el-table__row .el-button {
  padding: 0;
  color: #409EFF;
  border: none;
  padding-right: 3px;
}
</style>
