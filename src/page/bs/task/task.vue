<template>
    <el-row class="warp" style="margin-bottom:50px;">
        <el-col :span="24" class="warp-breadcrum" style="padding:10px;">
            <app-title :title="taskTitle"></app-title>
        </el-col>

        <el-col :span="24" class="warp-main" v-loading="loading" element-loading-text="拼命加载中">
            <!--工具条-->
            <el-col :span="24" style="padding-bottom: 0px;">
                <el-form :inline="true" :model="filters" style="padding-left:5px;">
                    <el-form-item>
                        <el-input v-model="filters.taskNo" placeholder="任务单号/原单号" style="width: 150px;"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-select v-model="filters.status" placeholder="状态" style="width: 100px;">
                            <el-option v-for="i in taskStatusEnum" :key="i.val" :label="i.lbl" :value="i.val"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-select v-model="filters.categoryDesc" placeholder="分类" style="width: 150px;">
                            <el-option label="--全部--" value=""></el-option>
                            <el-option v-for="item in cateDescDropDownList" :key="item.categoryDesc" :label="item.categoryDesc" :value="item.categoryDesc"></el-option>
                        </el-select>
                    </el-form-item>
                    <!-- <el-form-item>
                        <el-input v-model="filters.vehicleNo" placeholder="车牌" style="width:100px;"></el-input>
                    </el-form-item> -->
                    <el-form-item>
                        <el-input v-model="filters.driverName" placeholder="车牌/司机/手机" style="width: 180px;"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="handleSearch" @keyup.13="alert">查询</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="handleExport" :loading="exporting">导出</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="handleImport">导入</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="handleNew">新增</el-button>
                    </el-form-item>
                    <el-form-item>
                        <a class="smallFont" @click="showMoreCriteria" ref="moreCriteriaText">更多条件>></a>
                    </el-form-item>
                    <el-row ref="moreCriteria" v-if="isShowMoreCriteria">
                        <el-col :span="24">
                            <el-form-item>
                                <el-date-picker v-model="filters.beginDate" type="date" align="right" placeholder="创建日期 从" :picker-options="pickerOptions1">
                                </el-date-picker>
                                <el-date-picker v-model="filters.endDate" type="date" align="right" placeholder="创建日期 到" :picker-options="pickerOptions1">
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item>
                                <el-select v-model="filters.exceptionStatus" placeholder="是否异常" style="width:100px">
                                    <el-option v-for="i in exceptionStatusEnum" :key="i.val" :label="i.lbl" :value="i.val"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <!-- <el-form-item><el-button type="primary" @click="handleAddNew">新增</el-button></el-form-item> -->
                </el-form>

                <!--列表-->
                <el-table :data="taskList" highlight-current-row v-loading="loading" style="width:100%;" stripe :border="true" class="taskTable">
                    <el-table-column type="expand">
                        <template slot-scope="props">
                            <el-form label-position="left" inline class="demo-table-expand">
                                <el-form-item label="出发地址">
                                    <span>{{ props.row.deliverFullAddress}}</span>
                                </el-form-item>
                                <el-form-item label="目的地址">
                                    <span>{{ props.row.unloadFullAddress}}</span>
                                </el-form-item>
                                <el-form-item label="计划出发">
                                    <span>{{ props.row.deliverPlanDate}}</span>
                                </el-form-item>
                                <el-form-item label="计划到达">
                                    <span>{{ props.row.unloadPlanDate}}</span>
                                </el-form-item>
                                <el-form-item label="实际出发">
                                    <span>{{ props.row.deliverActualDate}}</span>
                                </el-form-item>
                                <el-form-item label="实际达到">
                                    <span>{{ props.row.unloadActualDate}}</span>
                                </el-form-item>
                                <el-form-item label="原始单号">
                                    <span>{{ props.row.referId}}</span>
                                </el-form-item>
                                <el-form-item label="区块键值">
                                    <span>{{ props.row.bcInfoKey}}</span>
                                </el-form-item>
                                <el-form-item label="区块哈希">
                                    <span>{{ props.row.bcHash}}</span>
                                </el-form-item>
                            </el-form>
                        </template>
                    </el-table-column>
                    <el-table-column type="index" width="50" align="center" label="序号"></el-table-column>
                    <el-table-column prop="id" label="id" v-if="false"></el-table-column>

                    <el-table-column prop="taskNo" label="任务单号" align="center">
                        <template slot-scope="scope">
                            <p @click="showDetail(scope.row)" style="cursor:pointer;color:#409eff">{{scope.row.taskNo}}</p>
                            <p :v-show="scope.row.referId != ''" class="smallFont">{{scope.row.referId}}</p>
                        </template>
                    </el-table-column>

                    <el-table-column prop="status" label="任务状态" :formatter="formatStatus" align="center"  width="80"></el-table-column>
                    <el-table-column prop="categoryDesc" label="分类" align="center" width="100"></el-table-column>
                    <el-table-column prop="deliverPlanDate" label="计划出发" align="center" min-width="90"></el-table-column>
                    <!-- <el-table-column prop="deliverFullAddress" label="出发地址" width="300px" sortable></el-table-column> -->
                    <!-- <el-table-column prop="unloadPlanDate" label="计划结束" width="150px" sortable></el-table-column> -->
                    <!-- <el-table-column prop="unloadFullAddress" label="结束地址" width="300px" sortable></el-table-column> -->
                    <el-table-column prop="vehicleNo" label="车辆司机" align="center" sortable :formatter="formatVehDrv"></el-table-column>
                    <el-table-column prop="stopCount" label="站点数" align="center" :formatter="formatStopCount" width="70"></el-table-column>
                    <el-table-column prop="createDate" label="创建时间" align="center" min-width="90"></el-table-column>
                    <el-table-column prop="totalWeight" label="体积重量件数" align="center" :formatter="formatVolWtUnit"></el-table-column>
                    <el-table-column prop="bcStatus" label="上链状态" align="center" :formatter="formatBcStatus" width="80"></el-table-column>
                    <el-table-column label="操作" width="80" fixed="right" align="center">
                        <template slot-scope="scope">
                            <el-button v-show="scope.row.status == '0'" icon="el-icon-delete" @click="cancelTask(scope.$index,scope.row)">删除</el-button>
                            <el-button v-show="scope.row.status != '0'" icon="el-icon-location-outline" @click="showGps(scope.$index,scope.row)">轨迹</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>

            <!---->
            <el-col :span="24" class="toolbar">
                <!-- <el-button type="danger" @click="batchDeleteBook" :disabled="this.sels.length===0">批量删除</el-button> -->
                <el-pagination layout="total, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-size="limit" :total="total" background style="float:right;">
                </el-pagination>
            </el-col>

            <!--弹出框-->
            <el-dialog title="批量导入运输任务" :visible.sync="importFormVisible" :close-on-click-modal="false" custom-class="myClass">
                <el-form :model="importForm" label-width="100px;" :rules="importFormRules" ref="importForm">
                    <!-- <el-form-item label="名称" prop="categoryDesc">
                        <el-input v-model="addForm.categoryDesc" auto-complete="off" placeholder="请输入分类名称"  style="width:70%"></el-input>
                    </el-form-item> -->
                    <el-upload class="upload-demo" drag :action="importControl" :beforeUpload="beforeExcelUpload" :onSuccess="afterExcelUpload" 
                          :onExceed="exceedExcelLimit" :limit="fileLimit" :auto-upload="false" accept=".xls,.xlsx" ref="importControl">
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">将文件拖到此处，或
                            <em>点击上传</em>
                        </div>
                        <div class="el-upload__tip" slot="tip">
                            只能上传excel文件，且不超过5MB<br> 点击
                            <b>
                                <a :href="taskTemplateDownloadUrl" download="任务导入模板.xlsx" class="blueFont">【这里】</a>
                            </b>下载模板
                        </div>
                    </el-upload>

                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click.native="importFormVisible = false">取消</el-button>
                    <el-button type="primary" @click.native="importSubmit" :loading="importing_task">导入</el-button>
                </div>
            </el-dialog>

            <!-- 运单详情弹出框     -->
            <el-dialog :title="'任务——' + detailView.taskNo + getReferId4DetailDlg(detailView.referId) + '——' + getStatusDesc(detailView.status)" :visible.sync="detailViewVisible" :close-on-click-modal="false" custom-class="myClass">
                <el-form :model="detailView" ref="detailView">
                    <el-collapse v-model="activeInfoList">
                        <el-collapse-item name="1">
                            <template slot="title">
                                <i class="header-icon el-icon-document"></i>
                                <b>任务信息</b>
                            </template>
                            <el-row>
                                <el-col :span="3">任务单号</el-col>
                                <el-col :span="5">{{detailView.taskNo}}</el-col>
                                <el-col :span="3">任务分类</el-col>
                                <el-col :span="5">{{detailView.categoryDesc}}&nbsp;</el-col>
                                <el-col :span="3">参考号</el-col>
                                <el-col :span="5">{{detailView.referId}}&nbsp;</el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="3">司机姓名</el-col>
                                <el-col :span="5">{{detailView.driverName}}</el-col>
                                <el-col :span="3">手机号码</el-col>
                                <el-col :span="5">{{detailView.driverMobile}}</el-col>
                                <el-col :span="3">车牌号</el-col>
                                <el-col :span="5">{{detailView.vehicleNo}}</el-col>
                            </el-row>
                        </el-collapse-item>
                        <el-collapse-item name="2">
                            <template slot="title">
                                <i class="header-icon el-icon-goods"></i>
                                <b>运单信息</b>
                            </template>
                            <div v-for="shp in taskShpList" :key="shp.id">
                                <el-row>
                                    <el-col :span="3">运单号</el-col>
                                    <el-col :span="5">{{shp.shpNo}} {{shp.referId}}<el-tag type="danger" v-show="shp.status==-2" size="mini">终</el-tag></el-col>
                                    <el-col :span="12" v-if="shp.shipmentContract">
                                      <a style="color:blue" v-for="ctr in shp.shipmentContract" :key="ctr.id" target="_blank" :href="ctr.docViewUrl">
                                        <span v-if="ctr.contractType == '' || ctr.contractType == '1'">电子运单</span>
                                        <span v-if="ctr.contractType == '2'">签收异常单</span>
                                        <span v-if="ctr.contractType == '3'">其他</span>
                                        &nbsp;
                                      </a>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="3">货物描述</el-col>
                                    <el-col :span="5">{{shp.goodsDesc}}</el-col>
                                    <el-col :span="3">货物信息</el-col>
                                    <el-col :span="6">
                                        {{shp.totalVolume}}/{{detailView.volumeUnit}}&nbsp; {{shp.totalWeight}}/{{detailView.weightUnit}}&nbsp; {{shp.totalUnits}}/{{detailView.unitUnit}}
                                    </el-col>
                                    <el-col :span="3" v-show="shp.isPaidToDriver == 1">代收货款</el-col>
                                    <el-col :span="4" v-show="shp.isPaidToDriver == 1">{{shp.paidDriverAmount}} 元</el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="3">发货信息</el-col>
                                    <el-col :span="5">{{shp.deliverContactPerson}}/{{shp.deliverContactMobile}}</el-col>
                                    <el-col :span="3">发货地址</el-col>
                                    <el-col :span="13">
                                        {{shp.deliverFullAddress}}&nbsp;&nbsp;{{shp.deliverCompany}}
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="3">计划出发</el-col>
                                    <el-col :span="5">{{shp.deliverPlanDate}}</el-col>
                                    <el-col :span="3">实际出发</el-col>
                                    <el-col :span="6">{{shp.deliverActualDate}}&nbsp;</el-col>
                                    <el-col :span="3">实发件数</el-col>
                                    <el-col :span="4" v-show="shp.isDeliverChanged == 1 && shp.deliverActualDate" class="blueFont">{{shp.totalUnitDeliver}}</el-col>
                                    <el-col :span="4" v-show="shp.isDeliverChanged == 0 && shp.deliverActualDate" class="normalFont">{{shp.totalUnitDeliver}}</el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="3">收货信息</el-col>
                                    <el-col :span="5">{{shp.unloadContactPerson}}/{{shp.unloadContactMobile}}</el-col>
                                    <el-col :span="3">收货地址</el-col>
                                    <el-col :span="13">{{shp.unloadFullAddress}}&nbsp;&nbsp;{{shp.unloadCompany}}</el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="3">计划到达</el-col>
                                    <el-col :span="5">{{shp.unloadPlanDate}}</el-col>
                                    <el-col :span="3">实际到达</el-col>
                                    <el-col :span="6">{{shp.unloadActualDate}}&nbsp;
                                    </el-col>
                                    <el-col :span="3">实收件数</el-col>
                                    <el-col :span="4" v-show="shp.isReceiveChanged == 1 && shp.unloadActualDate" class="blueFont">{{shp.totalUnitUnload}}</el-col>
                                    <el-col :span="4" v-show="shp.isReceiveChanged == 0 && shp.unloadActualDate" class="normalFont">{{shp.totalUnitUnload}}</el-col>
                                </el-row>
                                <el-row>
                                    <el-button @click="shipmentClose(shp.id)" v-show="shp.status!=-2&&shp.status!=-1&&shp.status!=2&&detailView.status!=98&&detailView.status!=99&&detailView.status!=10" size="mini" type="primary" icon="el-icon-warning">终止运单</el-button>
                                </el-row>
                                <hr style="margin-top:5px;">
                            </div>
                        </el-collapse-item>
                        <!-- <el-collapse-item name="3">
                            <template slot="title"><i class="header-icon el-icon-news"></i><b>承运信息</b></template>
                        </el-collapse-item> -->
                        <el-collapse-item name="4" v-show="taskStopDtlList.length > 0">
                            <template slot="title">
                                <i class="header-icon el-icon-edit-outline"></i>
                                <b>签收拍照信息</b>
                            </template>
                            <el-row>
                                <el-col :span="8">
                                    <b>收货地址信息</b>
                                </el-col>
                                <el-col :span="4">
                                    <b>收货单位</b>
                                </el-col>
                                <el-col :span="6">
                                    <b>收货备注</b>
                                </el-col>
                                <el-col :span="6">
                                    <b>签收照片</b>
                                </el-col>
                            </el-row>
                            <el-row v-for="stp in this.taskStopDtlList" :key="stp.id">
                                <el-col :span="8">{{stp.provinceName}}{{stp.cityName}}{{stp.districtName}}{{stp.street}}</el-col>
                                <el-col :span="4" v-if="stp.stopCompany">{{stp.stopCompany}}</el-col>
                                <el-col :span="4" style="color:#999" v-else>未知</el-col>
                                <el-col :span="6">{{stp.stopDesc}}</el-col>
                                <el-col :span="6">
                                    <a style="color:blue" v-for="pic in stp.picArray" :key="pic.text" target="_blank" :href="pic.url">
                                        图片{{pic.text}}
                                    </a>
                                </el-col>
                            </el-row>
                        </el-collapse-item>
                        <el-collapse-item name="5">
                            <template slot="title">
                                <i class="header-icon el-icon-info"></i>
                                <b>其他信息</b>
                            </template>
                            <el-row>
                                <el-col :span="3">备注</el-col>
                                <el-col :span="21">{{detailView.taskDesc}}</el-col>
                            </el-row>
                            <el-row v-show="(detailView.bcStatus) && (detailView.bcStatus == 1)">
                                <el-col :span="3">区块键值</el-col>
                                <el-col :span="9">{{detailView.bcInfoKey}}</el-col>
                                <el-col :span="3">区块哈希</el-col>
                                <el-col :span="9">{{detailView.bcHash}}</el-col>
                            </el-row>
                        </el-collapse-item>
                        <el-collapse-item title="操作日志" name="6">
                            <template slot="title">
                                <i class="header-icon el-icon-tickets"></i>
                                <b>操作日志</b>
                            </template>
                            <el-row>
                                <el-col :span="3" align="center">
                                    <b>操作时间</b>
                                </el-col>
                                <el-col :span="16" align="center">
                                    <b>操作描述</b>
                                </el-col>
                                <el-col :span="3" align="center">
                                    <b>操作人</b>
                                </el-col>
                            </el-row>

                                <el-row  v-for="(stat, index) in taskStatusList" :key="stat.id" :class="{ line:index%2==0 }">
                                    <el-col v-if="stat.type!='7'" :span="3" align="center">{{stat.doTime}}</el-col>
                                    <el-col v-if="stat.type=='1'" :span="16" style="padding-left:40px;">任务创建,共<span style="color:red">{{stat.p1}}</span>个运单</el-col>
                                    <el-col v-if="stat.type=='2'" :span="16" style="padding-left:40px;">司机已接单</el-col>
                                    <el-col v-if="stat.type=='36'&&stat.p4=='D'" :span="16" style="padding-left:40px;">运单 {{stat.p1}} 已签发<br><span style="color:gray">签发点：</span>{{stat.p2}} <span style="color:blue" v-if="stat.p3>3">非指定点签发</span> {{stat.uName}}{{stat.p5}} <span v-show="stat.p6" style="color:blue">签发{{stat.p6}}</span></el-col>
                                    <el-col v-if="stat.type=='36'&&stat.p4=='U'" :span="16" style="padding-left:40px;">运单 {{stat.p1}} 已签收<br><span style="color:gray">签收点：</span>{{stat.p2}} <span style="color:blue" v-if="stat.p3>3">非指定点签收</span> {{stat.uName}}{{stat.p5}} <span v-show="stat.p6" style="color:blue">签收{{stat.p6}}</span></el-col>
                                    <el-col v-if="stat.type=='45'&&stat.p4=='D'" :span="16" style="padding-left:40px;">运单 {{stat.p1}} 已起运<br><span style="color:gray">起运点：</span>{{stat.p2}} <span style="color:blue" v-if="stat.p3>3">非指定点起运</span></el-col>
                                    <el-col v-if="stat.type=='45'&&stat.p4=='U'" :span="16" style="padding-left:40px;">运单 {{stat.p1}} 已到货<br><span style="color:gray">到货点：</span>{{stat.p2}} <span style="color:blue" v-if="stat.p3>3">非指定点到货</span></el-col>
                                    <el-col v-if="stat.type!='7'" :span="3" align="center">{{stat.uName}}</el-col>
                                </el-row>
                                <el-row  v-for="(stat, index) in taskStatusList" :key="stat.id" :class="{ line:index%2==0 }">
                                    <el-col v-if="stat.type=='7'" :span="3" align="center">{{stat.doTime}}</el-col>
                                    <el-col v-if="stat.type=='7'" :span="16" style="padding-left:40px;">任务结束</el-col>
                                    <el-col v-if="stat.type=='7'" :span="3" align="center">自动结束</el-col>
                                </el-row>

                        </el-collapse-item>
                    </el-collapse>
                </el-form>
            </el-dialog>
            <!-- 行驶轨迹弹出框 -->
            <el-dialog :title="'行驶轨迹' + detailView.taskNo" :visible.sync="gpsViewVisible" :fullscreen="isFullScreen" :close-on-click-modal="false">
                <!-- :fullscreen="true" -->
                <add-BaiduMap v-model="detailView.taskNo" :selectedTaskRow="this.selectedTask" @screenSizeChange="gpsScreenSizeChange" @closeGpsDlg="closeGpsDialog()"></add-BaiduMap>
            </el-dialog>
            <!--弹出框-->

        </el-col>
    </el-row>
</template>

<script>
import baiduMapComp from "../../../components/gps/showGpsByVehicle.vue";
import { getCookie } from "../../../js/cookie.js";
import BMap from "BMap"; //引用baiduMap相关的API
import moment from "moment";
let Base64 = require("js-base64").Base64;
export default {
  data() {
    return {
      fileLimit: 1,
      taskTitle: "运单管理",
      externalPara: "null",
      taskList: [],
      taskShpList: [],
      taskStatusList: [],
      taskStopDtlList: [],
      taskStopRcvPics: [],
      selectedTask: {},
      taskStatusEnum: [
        { val: "", lbl: "全部查询" },
        { val: "0", lbl: "未接单" },
        { val: "1", lbl: "已接单" },
        { val: "2", lbl: "执行中" },
        { val: "10", lbl: "已完成" },
        { val: "98", lbl: "已拒绝" },
        { val: "99", lbl: "已取消" }
        // {val: '99', lbl: '已取消'}
      ],
      exceptionStatusEnum: [
        { val: "", lbl: "" },
        { val: "1", lbl: "正常" },
        { val: "-1", lbl: "异常" }
      ],
      gpsViewVisible: false,
      isFullScreen: false,
      cateDescDropDownList: [],
      filters: {
        taskNo: "",
        vehicleNo: "",
        driverName: "",
        beginDate: "",
        endDate: "",
        exceptionStatus: ""
      },
      total: 0,
      page: 1,
      limit: 10,
      detailItem:{},
      loading: false,
      exporting: false,
      importing_task: false,
      importFormVisible: false,
      importForm: {},
      importFormRules: {},
      importControl: `${this.api.baseURL}/task/importExcelFromWeb`,
      // taskTemplateDownloadUrl: 'http://' + window.location.host + `/src/page/bs/templatedownload/taskTemplate.xlsx`,
      taskTemplateDownloadUrl:
        "http://" +
        window.location.host +
        `/templatedownload/taskTemplate.xlsx`,
      isShowMoreCriteria: false,
      pickerOptions1: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            }
          },
          {
            text: "昨天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", date);
            }
          },
          {
            text: "一周前",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            }
          }
        ]
      },
      activeInfoList: ["1", "2", "4", "5"],
      detailViewVisible: false,
      detailView: {
        id: "",
        taskNo: ""
      }
    };
  },
  methods: {
    shipmentClose(shpId) {
      this.$confirm("此操作将终止运单执行, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let params = {
          shpId: shpId
        };
        this.axios
          .post(`${this.api.baseURL}/shipment/shipmentClose`, params)
          .then(res => {
            if (res.data.code == 200) {
              this.$message({
                type: "success",
                message: "运单已终止!"
              });
              this.showDetail(this.detailItem);
            } else {
              this.$message.error("运单终止失败");
            }
          });
      });
    },
    getLocationByXY(x, y) {
      var myGeo = new BMap.Geocoder();
      // 根据坐标得到地址描述
      var xx = myGeo.getLocation(new BMap.Point(x, y), function(result) {
        if (result) {
          //console.log(result.address);
          return result.address;
        } else {
          return "";
        }
      });
      //console.log(xx);
    },
    getStatusDesc: function(statCode) {
      let ret = "未接单";
      switch (statCode) {
        case "0":
          ret = "未接单";
          break;
        case "1":
          ret = "已接单";
          break;
        case "2":
          ret = "执行中";
          break;
        case "10":
          ret = "已完成";
          break;
        case "98":
          ret = "已拒绝";
          break;          
        case "99":
          ret = "已取消";
          break;
        default:
          break;
      }
      return ret;
    },
    getReferId4DetailDlg: function(refID) {
      return refID && refID != "" ? "/" + refID : "";
    },
    formatVehDrv: function(row, column) {
      return row.vehicleNo + "/" + row.driverName + "/" + row.driverMobile;
    },
    formatVolWtUnit: function(row, column) {
      let wt =
        row.totalWeightActual && row.totalWeightActual != ""
          ? row.totalWeightActual
          : row.totalWeight;
      let vl =
        row.totalVolumeActual && row.totalVolumeActual != ""
          ? row.totalVolumeActual
          : row.totalVolume;
      let un =
        row.totalUnitsActual && row.totalUnitsActual != ""
          ? row.totalUnitsActual
          : row.totalUnits;
      return (parseInt(wt) + row.weightUnit + "/" + parseInt(vl) + row.volumeUnit + "/" + parseInt(un) + row.unitUnit);
    },
    formatStatus: function(row, column) {
      return this.getStatusDesc(row.status);
    },
    formatBcStatus: function(row, column) {
      return row.bcStatus && row.bcStatus == "1" ? "已上链" : "上链中";
    },
    formatStopCount: function(row, column) {
      return row.completeStopInfo + '/' + row.stopCount;
    },
    dateFormat: function(row, column) {
      var date = row[column.property];
      if (date == undefined) {
        return "";
      }
      // console.log(row)
      return moment(date).format("YYYY-MM-DD HH:mm");
    },
    gpsScreenSizeChange(screenSize) {
      if (screenSize && screenSize == "full") {
        this.isFullScreen = true;
      } else {
        this.isFullScreen = false;
      }
    },
    handleSearch() {
      //console.log(window.location.href)
      //console.log(window.location.host)
      //console.log(document.domain)
      this.total = 0;
      this.page = 1;
      this.search();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.search();
    },
    handleExport() {
      this.exporting = true;
      let that = this;
      let params = {
        currentPage: 1,
        pageSize: 10000000,
        searchByKeys: {
          taskNo: that.filters.taskNo,
          //vehicleNo: that.filters.vehicleNo,
          driverName: that.filters.driverName,
          beginDate: that.filters.beginDate,
          endDate: that.filters.endDate,
          status: that.filters.status,
          isException: that.filters.exceptionStatus,
          categoryDesc: that.filters.categoryDesc
        },
        orderByKeys: { createDate: "desc" }
      };
      if(params.searchByKeys.beginDate!=null && params.searchByKeys.beginDate!='' && params.searchByKeys.beginDate!=undefined){
        params.searchByKeys.beginDate = moment(params.searchByKeys.beginDate).format("YYYY-MM-DD HH:mm")
      }
      if(params.searchByKeys.endDate!=null && params.searchByKeys.endDate!='' && params.searchByKeys.endDate!=undefined){
        params.searchByKeys.endDate = moment(params.searchByKeys.endDate).format("YYYY-MM-DD HH:mm")
      }
      that.axios
        .post(`${this.api.baseURL}/task/exportTasks`, params)
        .then(res => {
          // console.log(res)
          let newUrl = res.data.data.result;
          if (newUrl != "") {
            this.$notify({
              title: "导出成功",
              dangerouslyUseHTMLString: true,
              message:
                '请点击<a href="' +
                newUrl +
                '" class="blueFont" target="_blank"><b>【这里】</b></a>下载',
              duration: 0
            });
          }
          that.exporting = false;
        });
    },
    beforeExcelUpload(file) {
      let excelfileExtend = ".xls,.xlsx"; //设置文件格式
      let fileExtend = file.name
        .substring(file.name.lastIndexOf("."))
        .toLowerCase();
      if (excelfileExtend.indexOf(fileExtend) <= -1) {
        this.$message.error("文件格式错误");
        return false;
      } else {
        this.$message.success("正在处理，请稍候……");
      }
    },
    afterExcelUpload(response, file, fileList) {
      this.importing_task = false;
      if (response.code != "200") {
        if (response.data.resulturl && response.data.resulturl != "") {
          this.$message.error("导入错误，请在右上角下载错误明细！");
          let newUrl = response.data.resulturl;
          // const h = this.$createElement;
          this.$notify({
            title: "导入错误",
            dangerouslyUseHTMLString: true,
            message:
              '请点击<a href="' +
              newUrl +
              '" style: "color: #409eff"><b>【这里】</b></a>下载错误明细，请修改后再次导入！',
            duration: 0
          });
        } else {
          this.$message.error("导入错误，请联系系统管理员！");
        }
      } else {
        this.$message.success("导入成功！");
        this.importFormVisible = false;
        this.search();
      }
    },
    exceedExcelLimit(){
      let that = this;
      this.$confirm('上传文件个数超出限制，只能上传单个文件。 需要清除已上传的文件吗？', '提示', 
      {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'}).then(() => {
          that.$refs['importControl'].clearFiles();
          this.$message.success('已清除，请选择需要上传的文件')
      });
    },
    handleImport() {
      this.importFormVisible = true;
      try{
        this.$refs["importControl"].clearFiles();
      }catch(e){}
    },
    handleNew() {
      this.$router.push("/newtask");
    },
    importSubmit() {
      let that = this;
      this.$confirm("您确定要导入任务吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          that.importing_task = true;
          this.$refs["importControl"].headers.tokenId = getCookie("tokenid");
          this.$refs["importControl"].submit();
        })
        .catch(() => {
          this.$message({ type: "info", message: "已取消" });
        });
    },
    search: function() {
      //alert('search:' + this.externalPara);
      let createFrom = "";
      let that = this;
      let params = {
        currentPage: that.page,
        pageSize: that.limit,
        searchByKeys: {
          taskNo: that.filters.taskNo,
          //vehicleNo: that.filters.vehicleNo,
          driverName: that.filters.driverName,
          beginDate: that.filters.beginDate,
          endDate: that.filters.endDate,
          status: that.filters.status,
          isException: that.filters.exceptionStatus,
          categoryDesc: that.filters.categoryDesc
        },
        orderByKeys: { createDate: "desc" }
      };
      if(params.searchByKeys.beginDate!=null && params.searchByKeys.beginDate!='' && params.searchByKeys.beginDate!=undefined){
        params.searchByKeys.beginDate = moment(params.searchByKeys.beginDate).format("YYYY-MM-DD HH:mm")
      }
      if(params.searchByKeys.endDate!=null && params.searchByKeys.endDate!='' && params.searchByKeys.endDate!=undefined){
        params.searchByKeys.endDate = moment(params.searchByKeys.endDate).format("YYYY-MM-DD HH:mm")
      }
      // that.loading = true // show loading progress
      
      that.axios
        .post(`${this.api.baseURL}/task/findTasks`, params)
        .then(res => {
          that.taskList = res.data.data.result.content;
          that.total = res.data.data.result.totalRecord;
        });
    },
    showMoreCriteria: function() {
      if (this.isShowMoreCriteria) {
        this.isShowMoreCriteria = false;
        this.$refs["moreCriteriaText"].innerHTML = "更多条件>>";
      } else {
        this.isShowMoreCriteria = true;
        this.$refs["moreCriteriaText"].innerHTML = "隐藏条件>>";
      }
      //this.isShowMoreCriteria = !this.isShowMoreCriteria
    },
    showGps: function(index, row) {
      this.gpsViewVisible = true;
      this.selectedTask = row;
    },
    closeGpsDialog: function() {
      this.gpsViewVisible = false;
    },
    cancelTask: function(index, row) {
      if (row.status == "0") {
        this.$confirm("您确定要删除任务【" + row.taskNo + "】吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            let that = this;
            let p = { taskId: row.id };
            that.axios
              .post(`${this.api.baseURL}/task/delete`, p)
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
      } else {
        this.$message.error({
          showClose: true,
          message: "司机已经接收该任务，不允许取消！",
          duration: 3000
        });
      }
    },
    showDetail(row) {
      this.detailItem=row;
      this.taskShpList = [];
      this.taskStatusList = [];
      this.taskStopDtlList = [];
      this.taskStopRcvPics = [];
      this.detailView = Object.assign({}, row);
      this.detailViewVisible = true;
      //console.log("------");
      //console.log(this.detailView);
      let that = this;
      let p = { taskId: row.id };
      this.axios
        .post(`${this.api.baseURL}/task/findShipmentsByTaskId`, p)
        .then(res => {
          that.taskShpList = res.data.data.result;
          //console.log(that.taskShpList)
        });
      //
      this.axios
        .post(`${this.api.baseURL}/task/getTaskStatusByTaskId`, p)
        .then(res => {
          //console.log(res);
          that.taskStatusList = res.data.data.result;
        });
      this.axios
        .post(`${this.api.baseURL}/taskStop/findTaskStopDtlByTaskId`, p)
        .then(res => {
          if (res.data.data && res.data.data.result) {
            let tmpList = res.data.data.result;
            let tmpLst2 = new Array();
            tmpList.forEach(e => {
              if (e.stopPics && e.stopPics != "") {
                let pics = e.stopPics.split("、");
                let picJson = new Array(pics.length);
                for (let i = 0; i < pics.length; i++) {
                  let t = {
                    text: i + 1,
                    url: `${this.api.resource}${pics[i]}`
                  };
                  picJson[i] = t;
                }
                e.picArray = picJson;
                tmpLst2.push(e);
              }
            });
            that.taskStopDtlList = tmpLst2;
            // console.log(tmpLst2);
          }
        });
    },
    initCreteria: function() {
      if (this.externalPara && this.externalPara.length > 15) {
        //console.log(this.externalPara);
        //初始化查询条件
        //let tmp = '{"exceptionStatus": "1", "createDateRange":["2018-01-27", "2018-01-29"]}';
        let tmp = this.externalPara;
        let j = JSON.parse(tmp);
        this.filters.exceptionStatus = j.exceptionStatus;
        this.filters.beginDate = j.createDateRange[0];
        this.filters.endDate = j.createDateRange[1];
        this.isShowMoreCriteria = true;
      } else {
        this.filters = {
          taskNo: "",
          vehicleNo: "",
          driverName: "",
          beginDate: "",
          endDate: "",
          exceptionStatus: ""
        };
        this.isShowMoreCriteria = false;
      }
    },
    loadCateDescDropDownList(){
      let that = this
      let params = {
          currentPage: 1,
          pageSize: 200,
          searchByKeys: {categoryDesc: '', remarks: ''},
          orderByKeys: {categoryDesc: 'asc'}
      };
      that.axios.post(`${this.api.baseURL}/bsresource/getTaskCategoryList`, params).then(res =>{
          that.cateDescDropDownList = res.data.data.result.content;
      });
    },
  },
  watch: {
    $route: {
      handler(val) {
        this.externalPara = Base64.decode(this.$route.params.externalPara);
        this.initCreteria();
        this.handleSearch();
      }
    }
  },
  mounted() {
    this.externalPara = Base64.decode(this.$route.params.externalPara);
    this.initCreteria();
    this.handleSearch();
    this.loadCateDescDropDownList();
  },
  components: {
    "add-BaiduMap": baiduMapComp //定义子组件
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
.warp {
  padding-left: 2px;
  padding-right: 20px;
}
.blueFont {
  color: #409eff;

  > b {
    color: #409eff;
  }
}
.normalFont {
  color: #303133;
}
.smallFont {
  color: #e6a23c;
  font-size: 9pt;
}
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
.el-dialog__body {
  padding: 5px 20px;
}
.el-collapse-item__header {
  background-color: lightgrey;
}
.el-collapse-item__content {
  padding-bottom: 5px;
}
.line {
    background-color: #c5c5c5;
}

.taskTable .el-table__row .el-button {
  padding: 0;
  color: #409eff;
  border: none;
  padding-right: 3px;
}
</style>
