<template>
    <el-row class="warp" style="padding:2px;margin-bottom:50px">
        <el-col :span="24" class="warp-breadcrum" style="padding:10px">
            <app-title :title="detailTaskTitle"></app-title>
        </el-col>
        <el-col :span="24" style="padding:10px">
            <div>
                <el-steps :active="stepActiveNO" finish-status="success" style="padding-left:50px; padding-right:50px">
                    <el-step title="基本信息">
                    </el-step>
                    <el-step title="运单信息">
                    </el-step>
                    <el-step title="确认保存">
                    </el-step>
                </el-steps>
                
                <div ref="div0" v-show="divShow[0]">
                    <el-form ref="taskForm0" :model="task" label-width="100px;" :rules="addFormRules0" label-position="left">
                        <el-row :gutter="10">
                            <el-col :span="8">
                                <el-form-item label="任务单号" prop="taskNo">
                                    <el-input v-model="task.taskNo" auto-complete="off" placeholder="系统自动生成" :max="30" :disabled="true" style="width:70%;margin-left:8px"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="项目分类" prop="categoryDesc">
                                    <el-select v-model="task.categoryDesc" placeholder="项目/分类/线路" filterable style="width:70%;margin-left:8px">
                                        <el-option v-for="item in cateDescDropDownList" :key="item.categoryDesc" :label="item.categoryDesc" :value="item.categoryDesc">
                                        </el-option>
                                    </el-select>
                                    <!-- <el-input v-model="task.categoryDesc" auto-complete="off" placeholder="项目/分类/线路" style="width:70%"></el-input> -->
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="原始单号" prop="referId">
                                    <el-input v-model="task.referId" auto-complete="off" placeholder="原始任务单号" style="width:70%;margin-left:8px"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="10">
                            <el-col :span="8">
                                <el-form-item label="司机信息" prop="driverNameTmp">
                                    <el-select v-model="task.driverNameTmp" 
                                        filterable remote reserve-keyword :remote-method="driverRemoteMethod" :loading="driverLoading"
                                        placeholder="司机姓名/手机号" style="width:70%" v-on:change="driverChanged">
                                        <el-option v-for="item in filteredDrivers" :key="item.id" :label="item.driverName + ' ' + item.driverMobile" :value="item.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="司机手机" prop="driverMobile">
                                    <el-input v-model="task.driverMobile" :disabled="true" auto-complete="off" placeholder="司机手机" style="width:70%"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="车牌号码" prop="vehicleNoTmp">
                                    <!-- <el-input v-model="task.vehicleNo" auto-complete="off" placeholder="车牌号码" style="width:70%"></el-input> -->
                                    <el-select v-model="task.vehicleNoTmp" 
                                        filterable remote reserve-keyword :remote-method="vehicleRemoteMethod" :loading="vehicleLoading"
                                        placeholder="车牌号码" style="width:70%" v-on:change="vehicleChanged">
                                        <el-option v-for="item in filteredVehicles" :key="item.id" :label="item.vehicleNo" :value="item.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="任务备注" prop="taskDesc">
                                <el-input v-model="task.taskDesc" auto-complete="off" placeholder="备注" style="width:70%;margin-left:8px"></el-input>
                            </el-form-item>  
                        </el-col>
                    </el-row>
                    <div class="alignCenter margin10px">
                        <el-button @click="next(0, 'forward')">下一步</el-button>
                    </div>
                    </el-form>
                </div>
                <div ref="div1" v-show="divShow[1]">
                    <el-form ref="taskForm1" :model="tmpShp" label-width="100px;" :rules="addFormRules1" label-position="right">
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="运单号" prop="tmp_shpNo">
                                    <el-input v-model="tmpShp.tmp_shpNo" auto-complete="off" :disabled="true" placeholder="自动生成" style="width:70%"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="原始单号" prop="tmp_referId">
                                    <el-input v-model="tmpShp.tmp_referId" auto-complete="off" placeholder="原始运单号" style="width:70%"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8"></el-col>
                        </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="发货人" prop="tmp_deliverContactPerson">
                                <el-autocomplete popper-class="my-autocomplete" style="width:70%" v-model="tmpShp.tmp_deliverContactPerson" 
                                    :fetch-suggestions="querySearchAddrDlr" placeholder="地址/地址编码/联系人" @select="handleSelectDlr">
                                    <template slot-scope="props">
                                        <div class="name">{{props.item.addressCode}}/{{props.item.addressName}}/{{props.item.currentContactPerson}}/{{props.item.currentContactMobile}}</div>
                                        <span class="addr">{{ props.item.cityName }}{{props.item.districtName}}{{props.item.street}}</span>
                                    </template>
                                </el-autocomplete>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="联系手机" prop="tmp_deliverContactMobile">
                                <el-input v-model="tmpShp.tmp_deliverContactMobile" :maxlength="11" auto-complete="off" placeholder="发货人联系手机号" style="width:70%"></el-input>
                            </el-form-item>                            
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="发货时间" prop="tmp_deliverPlanDate">
                                <el-date-picker v-model="tmpShp.tmp_deliverPlanDate" type="datetime" placeholder="计划发货时间" style="width:70%" 
                                    value-format="yyyy-MM-dd HH:mm:ss" :picker-options="dlrDatepickerOpt"></el-date-picker>
                            </el-form-item>                             
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="省市区" prop="tmp_deliverPCD">
                                <template slot="label"><span style="margin-right:4px;color:#f56c6c">*</span>省市区</template>
                                <!-- <el-input v-model="task.tmp_deliverPCD" auto-complete="off" placeholder="发货省市区" style="width:70%"></el-input> -->
                                <add-pcd v-model="tmpShp.tmp_deliverPCD" @pcdChange="pcdChangeDlr" :tempPcdText="this.pcdCodeStrDlr" :styleVal="'width: 70%;'"></add-pcd>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="详细地址" prop="tmp_deliverStreet">
                                <el-input v-model="tmpShp.tmp_deliverStreet" auto-complete="off" placeholder="详细地址" style="width:70%"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="单位名称" prop="tmp_deliverCompany">
                                <el-input v-model="tmpShp.tmp_deliverCompany" auto-complete="off" placeholder="发货单位名称" style="width:70%"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="收货人" prop="tmp_unloadContactPerson">
                                <el-autocomplete popper-class="my-autocomplete" style="width:70%" v-model="tmpShp.tmp_unloadContactPerson" 
                                    :fetch-suggestions="querySearchAddrUnd" placeholder="地址/地址编码/联系人" @select="handleSelectUnd">
                                    <template slot-scope="props">
                                        <div class="name">{{props.item.addressCode}}/{{props.item.addressName}}/{{props.item.currentContactPerson}}/{{props.item.currentContactMobile}}</div>
                                        <span class="addr">{{ props.item.cityName }}{{props.item.districtName}}{{props.item.street}}</span>
                                    </template>
                                </el-autocomplete>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="联系手机" prop="tmp_unloadContactMobile">
                                <el-input v-model="tmpShp.tmp_unloadContactMobile" :maxlength="11" auto-complete="off" placeholder="收货人联系手机号" style="width:70%"></el-input>
                            </el-form-item>                            
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="收货时间" prop="tmp_unloadPlanDate">
                                <el-date-picker v-model="tmpShp.tmp_unloadPlanDate" type="datetime" placeholder="计划收货时间" 
                                    value-format="yyyy-MM-dd HH:mm:ss" style="width:70%" :picker-options="undDatepickerOpt"></el-date-picker>
                            </el-form-item>                             
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="省市区" prop="tmp_unloadPCD">
                                <template slot="label"><span style="margin-right:4px;color:#f56c6c">*</span>省市区</template>
                                <add-pcd v-model="tmpShp.tmp_unloadPCD" @pcdChange="pcdChangeUnd" :tempPcdText="this.pcdCodeStrUnd" :styleVal="'width: 70%;'"></add-pcd>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="详细地址" prop="tmp_unloadStreet">
                                <el-input v-model="tmpShp.tmp_unloadStreet" auto-complete="off" placeholder="详细地址" style="width:70%"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="单位名称" prop="tmp_unloadCompany">
                                <el-input v-model="tmpShp.tmp_unloadCompany" auto-complete="off" placeholder="收货单位名称" style="width:70%"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="货物描述" prop="tmp_GoodsDesc">
                                <el-input v-model="tmpShp.tmp_GoodsDesc" auto-complete="off" placeholder="货物描述" style="width:70%"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="总件数" prop="tmp_totalUnits" ref="tmp_totalUnits_input">
                                <el-input-number v-model="tmpShp.tmp_totalUnits" auto-complete="off" placeholder="总件数" :min="1" style="width:70%"></el-input-number>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="总体积" prop="tmp_totalVolume">
                                <el-input v-model="tmpShp.tmp_totalVolume" auto-complete="off" placeholder="总体积 方" :min="0.01" :max="200" style="width:70%"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="总重量" prop="tmp_totalWeight">
                                <el-input v-model="tmpShp.tmp_totalWeight" auto-complete="off" placeholder="总重量 吨" :min="0.01" :max="200" style="width:70%"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-switch v-model="tmpShp.tmp_isPaidToDriver" active-text="代收货款" inactive-text="无代收货款"></el-switch>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="货款金额" prop="tmp_paidDriverAmount">
                                <el-input v-model="tmpShp.tmp_paidDriverAmount" :disabled="!tmpShp.tmp_isPaidToDriver" auto-complete="off" placeholder="代收货款金额" style="width:40%"></el-input>
                            </el-form-item>  
                        </el-col>   
                        <el-col :span="8"></el-col>
                    </el-row>
                    <div class="alignCenter margin10px">
                        <el-button @click="submitForm1" type="primary">保存</el-button>
                        <!-- <el-button @click="submitForm" :loading="isSubmiting" type="primary">提交任务</el-button> -->
                        <el-button @click="next(1, 'forward')">下一步</el-button>
                        <el-button @click="next(1, 'back')">上一步</el-button>
                        <el-button @click="resestForm1">重置</el-button>
                    </div>
                    </el-form>
                </div>  
                <div ref="div2" v-show="divShow[2]">
                    <el-row>
                        <el-col></el-col>
                    </el-row>
                    <div class="alignCenter margin10px">
                        <el-button @click="submitForm" :loading="isSubmiting" type="primary">提交任务</el-button>
                        <el-button @click="next(2, 'back')">上一步</el-button>
                    </div>
                </div>
            </div>
            <el-row>
                <el-col :span="1"></el-col>
                <el-col :span="23">
                    <div v-if="containPermitTypeAndCode('userAllMenuCodes', 'm002002') " v-show="isShowDriverDiv" ref="quicklyAddDriverDiv" class="no-data-information">未录入司机信息？点击<span class="hyperlink" @click="showDriverDialog">此处</span>快速添加</div>
                    <div v-else v-show="isShowDriverDiv" ref="quicklyAddDriverDiv" class="no-data-information">未录入司机信息？联系管理员维护司机信息</div>

                    <div v-if="containPermitTypeAndCode('userAllMenuCodes', 'm002003') " v-show="isShowVehicleDiv" ref="quicklyAddVehicleDiv" class="no-data-information">未录入车辆信息？点击<span class="hyperlink" @click="showVehicleDialog">此处</span>快速添加</div>
                    <div v-else v-show="isShowVehicleDiv" ref="quicklyAddVehicleDiv" class="no-data-information">未录入车辆信息？联系管理员维护车辆信息</div>
                </el-col>
            </el-row>
            <!-- 以下是确认信息 -->
            <el-row v-show="!divShow[0]" class="savedShipments">
                <el-col :span="12">
                    司机车辆：{{task.vehicleNo}}/{{task.driverName}}/{{task.driverMobile}}
                </el-col>
                <el-col :span="12">
                    其他信息：{{task.categoryDesc}}/{{task.referId}}
                </el-col>
            </el-row>
            
            <el-row v-for="(shp, index) in this.task.shipmentlist" :key="shp.id" class="box">
                <el-col :span="10" class="savedDetail">
                    发货地址：{{shp.deliverFullAddress}} {{shp.deliverCompany}}
                    <br>发货信息：{{shp.deliverContactPerson}} &nbsp; {{shp.deliverContactMobile}}
                    <br>货物信息：{{shp.totalUnits}}件 &nbsp; {{shp.totalVolume}}方 &nbsp; {{shp.totalWeight}}吨
                </el-col>
                <el-col :span="10" class="savedDetail">
                    收货地址：{{shp.unloadFullAddress}} {{shp.unloadCompany}}
                    <br>收货信息：{{shp.unloadContactPerson}} &nbsp; {{shp.unloadContactMobile}}
                    <br>运输时间：{{shp.deliverPlanDate}} -> {{shp.unloadPlanDate}}
                </el-col>
                <el-col :span="2" class="amend" v-show="divShow[1]">
                    <el-button icon="el-icon-edit" size="mini" @click="modifyShp(index)" class="icon"></el-button>
                    <br>
                    <el-button icon="el-icon-delete" size="mini" @click="deleteShp(index)" class="icon"></el-button>
                </el-col>
        </el-row>
        </el-col>
        <el-dialog title="新增司机" :visible.sync="addDriverFormVisible" :close-on-click-modal="false">
            <add-driver @closeNewDrvDlg="closeDriverDialog"></add-driver>
        </el-dialog>
        <el-dialog title="新增车辆" :visible.sync="addVehicleFormVisible" :close-on-click-modal="false">
            <add-vehicle @closeNewVhlDlg="closeVehicleDialog"></add-vehicle>
        </el-dialog>
    </el-row>
</template>

<script scoped>
import pcdSelect from '../../../components/common/cityPicker.vue'
import quicklyAddDriver from '../../../components/bs/quickNewDriver.vue'
import quicklyAddVehicle from '../../../components/bs/quickNewVehicle.vue'
import { getPermitsByType }  from "../../../js/CookiePermitsMap.js";
import moment from "moment";

export default {
    data(){
        var checkMobile = (rule, value, callback) =>{
            const reg = /^1[3|4|5|7|8|9][0-9]{9}$/
            if (!reg.test(value)){
                callback(new Error('手机号码不正确!')) 
            }else callback()
        }; 
        var checkNumber = (rule, value, callback) =>{
            if (isNaN(value)){
                callback(new Error('必须为数值!'))
            }else callback()
        };
        var checkPaidDriverAmount = (rule, value, callback) =>{
            //console.log(value);
            if (this.tmpShp.tmp_isPaidToDriver){
                if ((isNaN(value)) || (value == '')){
                    callback(new Error('必须为数值!'))
                }else if (parseFloat(value) <= 0){
                    callback(new Error('货款金额必须大于0'));
                }else 
                    callback()
            }else callback()
        };
        return{
            detailTaskTitle:'录入任务单',
            task: {
                taskNo: '',
                shipmentlist: []
            },
            tmpShp:{
                tmp_deliverPlanDate: '', tmp_unloadPlanDate: '', tmp_isPaidToDriver: false,
                tmp_totalUnits: 1
            },
            stepActiveNO: 0,
            divShow: [true, false, false],
            addFormRules0: {
                driverNameTmp: [
                    {required: true, message: '请输入司机姓名', trigger: 'blur'}
                ],
                driverMobile: [
                    {required: true, message: '请输入司机手机号码', trigger: 'blur'}
                ],
                vehicleNoTmp: [
                    {required: true, message : '请输入车牌号码', trigger : 'blur'}
                ],
                referId: [
                    {min:2, max:30, message: '原始单号长度应为2-30', trigger: 'blur'}
                ],
                taskDesc: [
                    {max:200, message: '任务备注太长', trigger: 'blur'}
                ]
            },
            addFormRules1: {
                tmp_referId: [
                    {min:2, max:30, message: '原始单号长度应为2-30', trigger: 'blur'}
                ],
                tmp_deliverContactPerson:[
                    {required: true, message: '请输入发货人', trigger: 'blur'},
                    {min:2, max:50, message: '发货人长度应为2-50', trigger: 'blur'}
                ],
                tmp_deliverContactMobile: [
                    {required: true, message: '请输入发货人手机号', trigger: 'blur'},
                     {validator: checkMobile, trigger: 'blur'} //自定义校验
                ],
                tmp_deliverPlanDate: [
                    {required: true, message: '请输入发货时间', trigger: 'blur'}
                ],
                tmp_deliverStreet: [
                    {required: true, message: '请输入发货详细地址', trigger: 'blur'},
                    {min:2, max:100, message: '发货详细地址长度应为2-100', trigger: 'blur'}
                ],
                tmp_deliverCompany: [
                    {min:2, max:50, message: '发货单位长度应为2-100', trigger: 'blur'}
                ],
                tmp_unloadContactPerson:[
                    {required: true, message: '请输入收货人', trigger: 'blur'},
                    {min:2, max:50, message: '收货人长度应为2-50', trigger: 'blur'}
                ],
                tmp_unloadContactMobile: [
                    {required: true, message: '请输入收货人手机号', trigger: 'blur'},
                    {validator: checkMobile, trigger: 'blur'} //自定义校验
                ],
                tmp_unloadPlanDate: [
                    {required: true, message: '请输入收货时间', trigger: 'blur'}
                ],
                tmp_unloadStreet: [
                    {required: true, message: '请输入收货详细地址', trigger: 'blur'},
                    {min:2, max:100, message: '收货详细地址长度应为2-100', trigger: 'blur'}
                ],
                tmp_unloadCompany: [
                    {min:2, max:50, message: '收货单位长度应为2-50', trigger: 'blur'}
                ],
                tmp_GoodsDesc: [
                    {required: true, message: '请输入货物描述', trigger: 'blur'},
                    {min:2, max:100, message: '货物描述长度应为2-200', trigger: 'blur'}
                ],
                tmp_totalUnits: [
                    {required: true, message: '请输入货物件数', trigger: 'blur'},
                ],
                tmp_totalVolume: [
                    {required: true, message: '请输入货物体积', trigger: 'blur'},
                    {validator: checkNumber, trigger: 'blur'} //自定义校验
                ],
                tmp_totalWeight: [
                    {required: true, message: '请输入货物重量', trigger: 'blur'},
                    {validator: checkNumber, trigger: 'blur'} //自定义校验
                ],
                tmp_paidDriverAmount: [
                    {validator: checkPaidDriverAmount, trigger: 'blur'} //自定义校验
                ]
            },
            cateDescDropDownList: [],
            filteredDrivers: [],
            driverLoading: false,
            filteredVehicles: [],
            vehicleLoading: false,
            filteredAddressDlr: [],
            filteredAddressUnd: [],
            pcdCodeDlr: [],
            pcdNameDlr: [],
            pcdCodeUnd: [],
            pcdNameUnd: [],
            pcdCodeStrDlr: ",,",
            pcdCodeStrUnd: ",,",
            isSubmiting: false,
            addDriverFormVisible: false,
            addVehicleFormVisible: false,
            isShowDriverDiv: false,
            isShowVehicleDiv: false,
            dlrDatepickerOpt: {
                disabledDate(time) {
                    return (time.getTime() > moment().add(21, "days")) || time.getTime() < moment().add(-3, "days");
                },
                shortcuts: [
                    {text: '下个整15分', onClick(picker){
                        let date1 = new Date();
                        let date2 = new Date();
                        date2.setTime(date1.getTime() + 1000 * 60 * 15); //15分钟以后
                        let minute1 = date2.getMinutes();
                        let minute2 = 0;
                        if (minute1 < 15)
                            minute2 = 0;
                        else if (minute1 < 30)
                            minute2 = 15;
                        else if (minute1 < 45)
                            minute2 = 30;
                        else
                            minute2 = 45;
                        date2.setMinutes(minute2);
                        date2.setSeconds(0);
                        date2.setMilliseconds(0);

                        picker.$emit('pick', date2);
                    }},
                    {text: '下个半点', onClick(picker){
                        let date1 = new Date();
                        let date2 = new Date();
                        date2.setTime(date1.getTime() + 1000 * 60 * 30); //30分钟以后
                        let minute1 = date2.getMinutes();
                        let minute2 = 0;
                        if (minute1 < 30)
                            minute2 = 0;
                        else
                            minute2 = 30;
                        date2.setMinutes(minute2);
                        date2.setSeconds(0);
                        date2.setMilliseconds(0);

                        picker.$emit('pick', date2);
                    }},
                    {text: '下个整点', onClick(picker){
                        let date1 = new Date();
                        let date2 = new Date();
                        date2.setTime(date1.getTime() + 1000 * 60 * 60); //60分钟以后
                        date2.setMinutes(0);
                        date2.setSeconds(0);
                        date2.setMilliseconds(0);

                        picker.$emit('pick', date2);
                    }}
                ]
            },
            undDatepickerOpt: {
                disabledDate(time) {
                    return (time.getTime() > moment().add(21, "days")) || time.getTime() < moment().add(-3, "days");
                },
                shortcuts: [
                    {text: '4小时后半点', onClick(picker){
                        let date1 = new Date();
                        date1.setTime(date1.getTime() + 4.5 * 3600 * 1000); //4小时
                        let minute1 = date1.getMinutes();
                        if (minute1 < 30)
                            date1.setMinutes(0);
                        else
                            date1.setMinutes(30);
                        date1.setSeconds(0);
                        date1.setMilliseconds(0);
                        picker.$emit('pick', date1);
                    }}, 
                    {text: '4小时后整点', onClick(picker){
                        let date1 = new Date();
                        date1.setTime(date1.getTime() + 5 * 3600 * 1000); //4小时
                        date1.setMinutes(0);
                        date1.setSeconds(0);
                        date1.setMilliseconds(0);
                        picker.$emit('pick', date1);
                    }}, 
                    {text: '8小时后半点', onClick(picker){
                        let date1 = new Date();
                        date1.setTime(date1.getTime() + 8.5 * 3600 * 1000); //8小时
                        let minute1 = date1.getMinutes();
                        if (minute1 < 30)
                            date1.setMinutes(0);
                        else
                            date1.setMinutes(30);
                        date1.setSeconds(0);
                        date1.setMilliseconds(0);
                        picker.$emit('pick', date1);
                    }}, 
                    {text: '8小时后整点', onClick(picker){
                        let date1 = new Date();
                        date1.setTime(date1.getTime() + 9 * 3600 * 1000); //8小时
                        date1.setMinutes(0);
                        date1.setSeconds(0);
                        date1.setMilliseconds(0);
                        picker.$emit('pick', date1);
                    }}, 
                    {text: '1天后半点', onClick(picker){
                        let date1 = new Date();
                        date1.setTime(date1.getTime() + 24.5 * 3600 * 1000); //8小时
                        let minute1 = date1.getMinutes();
                        if (minute1 < 30)
                            date1.setMinutes(0);
                        else
                            date1.setMinutes(30);
                        date1.setSeconds(0);
                        date1.setMilliseconds(0);
                        picker.$emit('pick', date1);
                    }}, 
                    {text: '1天后整点', onClick(picker){
                        let date1 = new Date();
                        date1.setTime(date1.getTime() + 25 * 3600 * 1000); //8小时
                        date1.setMinutes(0);
                        date1.setSeconds(0);
                        date1.setMilliseconds(0);
                        picker.$emit('pick', date1);
                    }}
                ]
            }
        }
    },
    methods: {
        //包含权限的类型和权限代码 
        containPermitTypeAndCode(permitType, permitCode){
        return getPermitsByType(permitType) != undefined && getPermitsByType(permitType).contain(permitCode);
        },
        guid() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                return v.toString(16);
            });
        },
        next(currStep, direction){ //切换步骤条
            this.isShowDriverDiv = false;
            this.isShowVehicleDiv = false;
            if (direction != "forward"){ //后退，不做校验
                this.goNext(direction);
                return;
            }
            let formId = "taskForm" + currStep;
            if ((currStep == 1) && (this.pcdCodeStrUnd == ",,")){ //运单步骤 如果reset了，则无需保存，直接去下一页
                this.goNext(direction);
                return;
            }

            this.$refs[formId].validate((valid) =>{
                if (valid){
                    if ((currStep == 1) && (this.tmpShp != {})){ //如果有录入的情况
                        // 更新运单列表 
                        if (this.refreshShipmentList()){
                            this.$message.success('已保存')
                            this.resetShpUnloadAddress();
                        }else
                            return;
                    }
                    this.goNext(direction);
                }else if (currStep == 0){
                    this.$message.error('请录入任务基本信息！');
                }
                else if ((currStep == 1) && (this.pcdCodeStrUnd != ',,')){
                    this.$message.error('您似乎有未录入完整的数据，请检查并修正。')
                }
            })
        },
        goNext(direction){
            this.divShow =  [false, false, false]
            if (direction == 'forward'){
                this.stepActiveNO++;
                //this.resestForm1();
            }
            else{
                this.stepActiveNO--;
            }
            if (this.stepActiveNO > 2){
                this.stepActiveNO = 0
            }

            this.divShow[this.stepActiveNO] = true;
        },
        loadCateDescDropDownList(){
            let that = this
            let params = {
                currentPage: 1,
                pageSize: 200,
                searchByKeys: {categoryDesc: '', remarks: ''},
                orderByKeys: {createDate: 'desc'}
            };
            that.axios.post(`${this.api.baseURL}/bsresource/getTaskCategoryList`, params).then(res =>{
                that.cateDescDropDownList = res.data.data.result.content;
            });
        },
        querySearchAddrDlr(queryString, cb) {
            if (!queryString)
                queryString = "";

            //if (queryString && (queryString != "")){
                let that = this;
                let p = {criteriaStr: queryString, addressType: 'D'};
                that.axios.post(`${this.api.baseURL}/address/selectAddressByAnything`, p).then(function(result){
                    //console.log(result);
                    if ((result) && (result.status == '200')){
                        that.filteredAddressDlr = result.data.data.result;
                        cb(that.filteredAddressDlr);
                    }
                });
            //}
        },
        querySearchAddrUnd(queryString, cb) {
            if (!queryString)
                queryString = "";
            //if (queryString && (queryString != "")){
                let that = this;
                let p = {criteriaStr: queryString, addressType: 'U'};
                that.axios.post(`${this.api.baseURL}/address/selectAddressByAnything`, p).then(function(result){
                    //console.log(result);
                    if ((result) && (result.status == '200')){
                        that.filteredAddressUnd = result.data.data.result;
                        cb(that.filteredAddressUnd);
                    }
                });
            //}
        },
        handleSelectDlr(item){
            this.tmpShp.tmp_deliverContactPerson = item.currentContactPerson;
            this.tmpShp.tmp_deliverContactMobile = item.currentContactMobile;
            this.tmpShp.tmp_deliverStreet = item.street;
            this.tmpShp.tmp_deliverCountryCode = item.countryCode;
            this.tmpShp.tmp_deliverProvinceCode = item.provinceCode;
            this.tmpShp.tmp_deliverCityCode = item.cityCode;
            this.tmpShp.tmp_deliverDistrictCode = item.districtCode;
            this.tmpShp.tmp_deliverProvinceName = item.provinceName;
            this.tmpShp.tmp_deliverCityName = item.cityName;
            this.tmpShp.tmp_deliverDistrictName = item.districtName;
            this.tmpShp.tmp_deliverLongitudeX = item.longitudeX;
            this.tmpShp.tmp_deliverLatitudeY = item.latitudeY;
            this.tmpShp.tmp_deliverCompany = item.addressName;
            this.tmpShp.tmp_deliverPCD = item.provinceCode + "," + item.cityCode + "," + item.districtCode;
            this.pcdCodeStrDlr = item.provinceCode + "," + item.cityCode + "," + item.districtCode;
            this.$refs['taskForm1'].validateField('tmp_deliverContactPerson');
        },
        handleSelectUnd(item){
            this.tmpShp.tmp_unloadContactPerson = item.currentContactPerson;
            this.tmpShp.tmp_unloadContactMobile = item.currentContactMobile;
            this.tmpShp.tmp_unloadStreet = item.street;
            this.tmpShp.tmp_unloadCountryCode = item.countryCode;
            this.tmpShp.tmp_unloadProvinceCode = item.provinceCode;
            this.tmpShp.tmp_unloadCityCode = item.cityCode;
            this.tmpShp.tmp_unloadDistrictCode = item.districtCode;
            this.tmpShp.tmp_unloadProvinceName = item.provinceName;
            this.tmpShp.tmp_unloadCityName = item.cityName;
            this.tmpShp.tmp_unloadDistrictName = item.districtName;
            this.tmpShp.tmp_unloadLongitudeX = item.longitudeX;
            this.tmpShp.tmp_unloadLatitudeY = item.latitudeY;
            this.tmpShp.tmp_unloadCompany = item.addressName;
            this.tmpShp.tmp_unloadPCD = item.provinceCode + "," + item.cityCode + "," + item.districtCode;
            this.pcdCodeStrUnd = item.provinceCode + "," + item.cityCode + "," + item.districtCode;
            this.$refs['taskForm1'].validateField('tmp_unloadContactPerson');
        },
        pcdChangeDlr(msg){ //由子组件触发，向父组件传值。 本页面为父组件
            this.pcdCodeStrDlr = msg.codes.join(",")
            this.tmpShp.tmp_deliverProvinceCode = msg.codes[0];
            this.tmpShp.tmp_deliverCityCode = msg.codes[1];
            this.tmpShp.tmp_deliverDistrictCode = msg.codes[2];
            this.tmpShp.tmp_deliverProvinceName = msg.names[0];
            this.tmpShp.tmp_deliverCityName = msg.names[1];
            this.tmpShp.tmp_deliverDistrictName = msg.names[2];
        },
        pcdChangeUnd(msg){ //由子组件触发，向父组件传值。 本页面为父组件
            this.pcdCodeStrUnd = msg.codes.join(",")
            this.tmpShp.tmp_unloadProvinceCode = msg.codes[0];
            this.tmpShp.tmp_unloadCityCode = msg.codes[1];
            this.tmpShp.tmp_unloadDistrictCode = msg.codes[2];
            this.tmpShp.tmp_unloadProvinceName = msg.names[0];
            this.tmpShp.tmp_unloadCityName = msg.names[1];
            this.tmpShp.tmp_unloadDistrictName = msg.names[2];
        },
        bd_decrypt(bdLat, bdLon) {  //将百度坐标系转换为火星坐标系
            //console.log('convert bd to gcj:' + bdLat + '---' + bdLon);
            var x = bdLon - 0.0065, y = bdLat - 0.006;    
            var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * 3.14159265358979324 * 3000.0 / 180.0);    
            var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * 3.14159265358979324 * 3000.0 / 180.0);    
            var gcjLon = z * Math.cos(theta);    
            var gcjLat = z * Math.sin(theta);  
            //console.log('converted to gcj:' + gcjLat + '---' + gcjLon);
            return {'lat' : gcjLat.toFixed(6), 'lng' : gcjLon.toFixed(6)};
        }, 
        refreshShipmentList(){
            var isContinue = true;
            var row = {id: ''};
            var dlrFullAddr = this.tmpShp.tmp_deliverProvinceName + this.tmpShp.tmp_deliverCityName + 
                    this.tmpShp.tmp_deliverDistrictName + this.tmpShp.tmp_deliverStreet;
            var undFullAddr = this.tmpShp.tmp_unloadProvinceName + this.tmpShp.tmp_unloadCityName + 
                    this.tmpShp.tmp_unloadDistrictName + this.tmpShp.tmp_unloadStreet;
            
            if ((this.tmpShp.id) && (this.tmpShp.id != '')){ 
                //console.log('=====' + this.tmpShp.id + '++++++++')
                let i = 0
                this.task.shipmentlist.forEach(element => {
                    //console.log('=====' + element.id + '++++++++')
                    if (element.id == this.tmpShp.id){ //如果是修改，先从task的列表里面移除
                        row = Object.assign({}, element);
                        this.task.shipmentlist.splice(i, 1);
                        return false;
                    }
                    i ++;
                });
            }

            this.task.shipmentlist.forEach(element => {
                if (
                        ((element.deliverFullAddress + element.deliverCompany + element.deliverContactPerson) === (dlrFullAddr + this.tmpShp.tmp_deliverCompany + this.tmpShp.tmp_deliverContactPerson)) 
                        && 
                        ((element.unloadFullAddress + element.unloadCompany + element.unloadContactPerson) === (undFullAddr + this.tmpShp.tmp_unloadCompany + this.tmpShp.tmp_unloadContactPerson))
                    ){ //避免重复录入
                    this.$message.error('已经录入了相同线路的运单，请确认录入是否准确！');
                    isContinue = false;
                    return false;
                }
            });
            if (!isContinue) 
                return false;

            if (this.tmpShp.tmp_isPaidToDriver){
                row.isPaidToDriver = '1';
                row.PaidDriverAmount = this.tmpShp.tmp_paidDriverAmount;
            }else{
                row.isPaidToDriver = '0';
                row.PaidDriverAmount = '0';
            }

            row.id = this.guid();
            row.referId = this.tmpShp.tmp_referId;
            row.categoryDesc = this.task.categoryDesc; // no change!!!
            row.deliverCountryCode = 'CN';
            row.deliverProvinceCode = this.tmpShp.tmp_deliverProvinceCode;
            row.deliverCityCode = this.tmpShp.tmp_deliverCityCode;
            row.deliverDistrictCode = this.tmpShp.tmp_deliverDistrictCode;
            row.deliverProvinceNameTemp = this.tmpShp.tmp_deliverProvinceName;
            row.deliverCityNameTemp = this.tmpShp.tmp_deliverCityName;
            row.deliverDistrictNameTemp = this.tmpShp.tmp_deliverDistrictName;
            row.deliverStreet = this.tmpShp.tmp_deliverStreet
            row.deliverFullAddress = dlrFullAddr;
            row.deliverCompany = this.tmpShp.tmp_deliverCompany;
            row.deliveryLongitudeX = this.task.tmp_deliverLongitudeX;
            row.deliveryLongitudeY = this.task.tmp_deliverLatitudeY;
            row.deliverPlanDate = this.tmpShp.tmp_deliverPlanDate;
            row.deliverContactPerson = this.tmpShp.tmp_deliverContactPerson;
            row.deliverContactMobile = this.tmpShp.tmp_deliverContactMobile;

            row.unloadCountryCode = 'CN';
            row.unloadProvinceCode = this.tmpShp.tmp_unloadProvinceCode;
            row.unloadCityCode = this.tmpShp.tmp_unloadCityCode;
            row.unloadDistrictCode = this.tmpShp.tmp_unloadDistrictCode;
            row.unloadProvinceNameTemp = this.tmpShp.tmp_unloadProvinceName;
            row.unloadCityNameTemp = this.tmpShp.tmp_unloadCityName;
            row.unloadDistrictNameTemp = this.tmpShp.tmp_unloadDistrictName;
            row.unloadStreet = this.tmpShp.tmp_unloadStreet;
            row.unloadFullAddress = undFullAddr;
            row.unloadCompany = this.tmpShp.tmp_unloadCompany;
            row.unloadLongitudeX = this.task.tmp_unloadLongitudeX;
            row.unloadLongitudeY = this.task.tmp_unloadLatitudeY;
            row.unloadPlanDate = this.tmpShp.tmp_unloadPlanDate;
            row.unloadContactPerson = this.tmpShp.tmp_unloadContactPerson;
            row.unloadContactMobile = this.tmpShp.tmp_unloadContactMobile;

            let that = this;
            var myGeo = new BMap.Geocoder();
            myGeo.getPoint(row.deliverFullAddress, function(point){
                if (point){
                    let point1 = that.bd_decrypt(point.lat, point.lng);
                    row.deliveryLongitudeX = point1.lng;
                    row.deliveryLongitudeY = point1.lat;
                }else{
                    alert('无法识别发货地址【' + row.deliverFullAddress + '】，请更正！');
                    return false;
                }
            });
            myGeo.getPoint(row.unloadFullAddress, function(point){
                if (point){
                    let point1 = that.bd_decrypt(point.lat, point.lng);
                    row.unloadLongitudeX = point1.lng;
                    row.unloadLongitudeY = point1.lat;
                }else{
                    alert('无法识别收货地址【' + row.unloadFullAddress + '】，请更正！');
                    return false;
                }
            });

            row.goodsDesc = this.tmpShp.tmp_GoodsDesc;
            row.totalUnits = this.tmpShp.tmp_totalUnits;
            row.totalVolume = this.tmpShp.tmp_totalVolume;
            row.totalWeight = this.tmpShp.tmp_totalWeight;

            row.isUseEsign = 'Y';

            var shUnit = {};
            shUnit.unitNo = "1";
            shUnit.unitDesc = this.tmpShp.tmp_GoodsDesc;
            shUnit.plannedVolume = this.tmpShp.tmp_totalVolume;
            shUnit.plannedWeight = this.tmpShp.tmp_totalWeight;
            shUnit.plannedUnits = this.tmpShp.tmp_totalUnits;
            shUnit.plannedGoodsValue = 0; //货值默认为0

            row.shipmentUnitList = [];
            row.shipmentUnitList.push(shUnit);
            this.task.shipmentlist.push(row);
            return true;
        },
        submitForm1(){
            if ((!this.tmpShp.tmp_deliverProvinceCode) || (this.tmpShp.tmp_deliverProvinceCode == "")){
                this.$message.error({showClose: true, message: '请输入发货省市区！', duration: 3000});
                return false;
            }
            if ((!this.tmpShp.tmp_unloadProvinceCode) || (this.tmpShp.tmp_unloadProvinceCode == "")){
                this.$message.error({showClose: true, message: '请输入收货省市区！', duration: 3000});
                return false;
            }
            if (this.tmpShp.tmp_unloadPlanDate && (this.tmpShp.tmp_unloadPlanDate != "")){
                if (this.tmpShp.tmp_unloadPlanDate < this.tmpShp.tmp_deliverPlanDate){
                    this.$message.error({showClose: true, message: '收货时间不能早于发货时间！', duration: 3000});
                    return false;
                }
            }

            this.$refs["taskForm1"].validate((valid) =>{
                if (valid){
                    if (this.refreshShipmentList()){
                        this.$message.success('已保存')
                        this.resetShpUnloadAddress();
                    }
                }
            })
        },
        resetShpUnloadAddress(){
            this.pcdCodeStrUnd = ",,";
            this.tmpShp.tmp_unloadProvinceCode = "";
            this.tmpShp.tmp_unloadProvinceName = "";
            this.tmpShp.tmp_unloadCityCode = "";
            this.tmpShp.tmp_unloadCityName = "";
            this.tmpShp.tmp_unloadDistrictCode = "";
            this.tmpShp.tmp_unloadDistrictName = "";
            this.tmpShp.tmp_unloadStreet = "";
            this.tmpShp.tmp_unloadLongitudeX = "";
            this.tmpShp.tmp_unloadLatitudeY = "";
            this.tmpShp.tmp_unloadContactPerson = "";
            this.tmpShp.tmp_unloadContactMobile = "";
            this.tmpShp.tmp_unloadPlanDate = "";
            this.tmpShp.tmp_unloadCompany = "";

            this.tmpShp.tmp_totalVolume = "";
            this.tmpShp.tmp_totalWeight = "";
            // this.tmpshp.tmp_totalUnits = 1;
            this.$refs["tmp_totalUnits_input"].resetField();

            this.tmpShp.tmp_referId = "";
            this.tmpShp.tmp_GoodsDesc = "";
            this.tmpShp.tmp_isPaidToDriver = false;
            this.tmpShp.tmp_paidDriverAmount = "";
        },
        resestForm1(){
            this.$refs["taskForm1"].resetFields();
            this.tmpShp = {tmp_deliverPlanDate: '', tmp_unloadPlanDate: '', tmp_isPaidToDriver: false};
            this.pcdCodeStrDlr = ",,";
            this.pcdCodeStrUnd = ",,";
        },
        deleteShp(id){
            //console.log(id)
            let that = this;
            this.$confirm('您确定要删除吗？\n\n出发：' + this.task.shipmentlist[id].deliverFullAddress + '\n目的：' + this.task.shipmentlist[id].unloadFullAddress, '提示', 
                {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'}).then(() => 
            {
                that.task.shipmentlist.splice(id, 1);
            })
            .catch(() => {
                this.$message({type: 'info', message: '已取消删除'});          
            });
        },
        modifyShp(id){
            //console.log(id)
            this.resestForm1();
            this.setTaskForm1DataByShp(this.task.shipmentlist[id]);
            //this.taskForm1 = Object.assign({}, this.task.shipmentlist[id]);
            //this.tmpShp.tmp_deliverContactMobile = this.task.shipmentlist[id].deliverContactMobile
        },
        setTaskForm1DataByShp(row){
            if ((row.isPaidToDriver) && (row.isPaidToDriver == '1')){
                this.tmpShp.tmp_isPaidToDriver = true;
                this.tmpShp.tmp_paidDriverAmount = row.PaidDriverAmount;
            }else
                this.tmpShp.tmp_isPaidToDriver = false;

            this.tmpShp.id = row.id;
            this.tmpShp.tmp_referId = row.referId;
            this.tmpShp.tmp_deliverProvinceCode = row.deliverProvinceCode;
            this.tmpShp.tmp_deliverCityCode = row.deliverCityCode;
            this.tmpShp.tmp_deliverDistrictCode = row.deliverDistrictCode;
            this.tmpShp.tmp_deliverProvinceName = row.deliverProvinceNameTemp;
            this.tmpShp.tmp_deliverCityName = row.deliverCityNameTemp;
            this.tmpShp.tmp_deliverDistrictName = row.deliverDistrictNameTemp;
            this.tmpShp.tmp_deliverCompany = row.deliverCompany;
            this.tmpShp.tmp_deliverPCD = row.deliverProvinceCode + "," + row.deliverCityCode + "," + row.deliverDistrictCode;
            this.pcdCodeStrDlr = row.deliverProvinceCode + "," + row.deliverCityCode + "," + row.deliverDistrictCode;
            this.tmpShp.tmp_deliverStreet = row.deliverStreet;
            this.tmpShp.tmp_deliverLongitudeX = row.deliveryLongitudeX;
            this.tmpShp.tmp_deliverLatitudeY = row.deliveryLongitudeY;
            this.tmpShp.tmp_deliverPlanDate = row.deliverPlanDate;
            this.tmpShp.tmp_deliverContactPerson = row.deliverContactPerson;
            this.tmpShp.tmp_deliverContactMobile = row.deliverContactMobile;

            this.tmpShp.tmp_unloadProvinceCode = row.unloadProvinceCode;
            this.tmpShp.tmp_unloadCityCode = row.unloadCityCode;
            this.tmpShp.tmp_unloadDistrictCode = row.unloadDistrictCode;
            this.tmpShp.tmp_unloadProvinceName = row.unloadProvinceNameTemp;
            this.tmpShp.tmp_unloadCityName = row.unloadCityNameTemp;
            this.tmpShp.tmp_unloadDistrictName = row.unloadDistrictNameTemp;
            this.tmpShp.tmp_unloadCompany = row.unloadCompany;
            this.tmpShp.tmp_unloadPCD = row.unloadProvinceCode + "," + row.unloadCityCode + "," + row.unloadDistrictCode;
            this.pcdCodeStrUnd = row.unloadProvinceCode + "," + row.unloadCityCode + "," + row.unloadDistrictCode;
            this.tmpShp.tmp_unloadStreet = row.unloadStreet
            this.tmpShp.tmp_unloadLongitudeX = row.unloadLongitudeX
            this.tmpShp.tmp_unloadLatitudeY = row.unloadLongitudeY
            this.tmpShp.tmp_unloadPlanDate = row.unloadPlanDate
            this.tmpShp.tmp_unloadContactPerson = row.unloadContactPerson
            this.tmpShp.tmp_unloadContactMobile = row.unloadContactMobile

            this.tmpShp.tmp_GoodsDesc = row.goodsDesc
            this.tmpShp.tmp_totalUnits = row.totalUnits
            this.tmpShp.tmp_totalVolume = row.totalVolume
            this.tmpShp.tmp_totalWeight = row.totalWeight
        },
        driverRemoteMethod(query){
            if ((query) && (query !== '')) {
                this.driverLoading = true;
                setTimeout(() => { //后台匹配符合条件的司机列表
                    let that = this;
                    let p = {criteria: query};
                    this.axios.post(`${this.api.baseURL}/driver/selectDriverListByNameMob`, p).then(function(result){
                        that.driverLoading = false;
                        if ((result) && (result.status == '200')){
                            if ((result.data.data.result.length) && (result.data.data.result.length > 0)){
                                that.filteredDrivers = result.data.data.result;
                                that.isShowDriverDiv = false;
                            }else{
                                that.isShowDriverDiv = true;
                                that.filteredDrivers = [];
                            }
                        }
                    });
                }, 500);
            } else {
                this.filteredDrivers = [];
            }
        },
        driverChanged(){
            this.filteredDrivers.forEach(element => {
                if (element.id == this.task.driverNameTmp){
                    this.task.driverId = element.id;
                    this.task.driverName = element.driverName;
                    this.task.driverMobile = element.driverMobile;
                    return;
                }
            });
        },
        vehicleRemoteMethod(query){
            if (query && (query !== '')) {
                this.vehicleLoading = true;
                setTimeout(() => { //后台匹配符合条件的车辆列表
                    let that = this;
                    let p = {criteria: query};
                    this.axios.post(`${this.api.baseURL}/vehicle_driver/selectVehicleListByNO`, p).then(function(result){
                        //console.log(result);
                        that.vehicleLoading = false;
                        if ((result) && (result.status == '200')){
                            if ((result.data.data.result.length) && (result.data.data.result.length > 0)){
                                that.filteredVehicles = result.data.data.result;
                                that.isShowVehicleDiv = false;
                            }else{
                                that.isShowVehicleDiv = true;
                                that.filteredVehicles = [];
                            }
                        }
                    });
                }, 500);
            } else {
                this.filteredVehicles = [];
            }
        },
        vehicleChanged(){
            this.filteredVehicles.forEach(element => {
                if (element.id == this.task.vehicleNoTmp){
                    this.task.vehicleId = element.id;
                    this.task.vehicleNo = element.vehicleNo;
                    return;
                }
            });
        },
        refineTaskData(){ //提交之前 补齐task的数据            
            var earlistDlrShp = this.task.shipmentlist[0]; 
            var latestUndShp = this.task.shipmentlist[0];
            var earlistDlrDate = this.task.shipmentlist[0].deliverPlanDate;
            var latestUndDate = this.task.shipmentlist[0].unloadPlanDate;
            if (this.task.shipmentlist.length > 1){
                this.task.shipmentlist.forEach(s => {
                    if (s.deliverPlanDate < earlistDlrDate){
                        earlistDlrDate = s.deliverPlanDate;
                        earlistDlrShp = s;
                    }
                    if (s.unloadPlanDate > latestUndDate){
                        latestUndDate = s.unloadPlanDate;
                        latestUndShp = s;
                    }
                });
            }

            this.task.deliverCountryCode = "CN";
            this.task.deliverProvinceCode = earlistDlrShp.deliverProvinceCode;
            this.task.deliverCityCode = earlistDlrShp.deliverCityCode;
            this.task.deliverDistrictCode = earlistDlrShp.deliverDistrictCode;
            this.task.deliverCompany = earlistDlrShp.tmp_deliverCompany;
            this.task.deliverStreet = earlistDlrShp.deliverStreet;
            this.task.deliverFullAddress = earlistDlrShp.deliverFullAddress;
            this.task.deliveryLongitudeX = earlistDlrShp.deliveryLongitudeX;
            this.task.deliveryLongitudeY = earlistDlrShp.deliveryLongitudeY;
            this.task.deliverPlanDate = earlistDlrShp.deliverPlanDate;
            this.task.deliverContactPerson = earlistDlrShp.deliverContactPerson;
            this.task.deliverContactMobile = earlistDlrShp.deliverContactMobile;

            this.task.unloadCountryCode = "CN";
            this.task.unloadCountryCode = latestUndShp.unloadCountryCode;
            this.task.unloadProvinceCode = latestUndShp.unloadProvinceCode;
            this.task.unloadCityCode = latestUndShp.unloadCityCode;
            this.task.unloadDistrictCode = latestUndShp.unloadDistrictCode;
            this.task.unloadCompany = latestUndShp.unloadCompany;
            this.task.unloadStreet = latestUndShp.unloadStreet;
            this.task.unloadFullAddress = latestUndShp.unloadFullAddress;
            this.task.unloadLongitudeX = latestUndShp.unloadLongitudeX;
            this.task.unloadLongitudeY = latestUndShp.unloadLongitudeY;
            this.task.unloadPlanDate = latestUndShp.unloadPlanDate;
            this.task.unloadContactPerson = latestUndShp.unloadContactPerson;
            this.task.unloadContactMobile = latestUndShp.unloadContactMobile;

            this.task.source = "录入";
            this.task.isUseEsign = "Y";
            this.task.volumeUnit = "方";
            this.task.weightUnit = "吨";
            this.task.unitUnit = "件";
            this.task.distanceUnit = "公里";
        },
        submitForm(){
            if (this.task.shipmentlist.length < 1){
                this.$message.error({showClose: true, message: '请先录入货物信息并保存！', duration: 2000});
                return false;
            }

            let that = this;
            let strMsg = "您要确定要保存吗？"

            if ((this.tmpShp.tmp_deliverContactPerson != "") || (this.tmpShp.tmp_unloadContactPerson != ""))
                strMsg += "您有部分信息未保存，将会自动清除未保存的信息。\n\n"

            this.$confirm('您要确定要保存吗？', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'}).then(() => {
                this.resestForm1();
                this.refineTaskData();
                this.isSubmiting = true;
                that.$message.success({showClose: true, message: '正在处理，请稍候……', duration: 2000});

                let paraJsonStr = JSON.stringify(this.task);
                let p = {taskJsonStr: paraJsonStr,source:'pc'};

                that.axios.post(`${this.api.baseURL}/task/createFromWeb`, p).then(function(result){

                    that.isSubmiting = false;
                    if ((result) && (result.status == '200')){ //保存成功
                        that.$message.success({showClose: true, message: '添加成功', duration: 2000});
                        that.resetTaskData();
                        that.$router.push("/task/null");
                    }else{
                        that.$message.error({showClose: true, message: '添加失败', duration: 2000});
                    }
                });
            })
            .catch(() => {
                this.$message({ type: 'info', message: '已取消'}); 
                that.isSubmiting = false;
            });
        },
        showDriverDialog(){
            this.addDriverFormVisible = true;
        },
        closeDriverDialog(newDriverMobile){
            this.addDriverFormVisible = false;
            // 将快速添加的司机填入  但是无法触发下拉事件？??
            //this.task.driverNameTmp = driverMobile;
            //this.driverRemoteMethod(driverMobile);
        },
        showVehicleDialog(){
            this.addVehicleFormVisible = true;
        },
        closeVehicleDialog(newVehicleNo){
            this.addVehicleFormVisible = false;
            // 同 closeDriverDialog 的做法
        },
        resetTaskData(){
            this.task = {
                taskNo: '', 
                driverNameTmp: '',
                id: '',
                referId: '', 
                driverMobile: '',
                vehicleNoTmp: '',
                taskDesc: '',
                shipmentlist: []
            };
            this.stepActiveNO = 0;
            this.divShow =  [true, false]
        }
    },
    components: {
        "add-pcd": pcdSelect,   //定义子组件
        "add-driver": quicklyAddDriver,
        "add-vehicle": quicklyAddVehicle
    },
    mounted(){
        this.loadCateDescDropDownList();
        // this.resetTaskData();
    },
    beforeRouteEnter(to, from, next) { //每次退出后再次进入此功能，清除旧数据
        next(function(vm) {
            vm.resetTaskData();
        });
    }
}

Array.prototype.contain = function(val)  
{  
     for (var i = 0; i < this.length; i++)  
    {  
       if (this[i] == val)  
      {  
       return true;  
      }  
    }  
     return false;  
}; 
</script>

<style lang="less" scoped>
    .no-data-information{
        color: black;
        font-size: 12px;
    }
    .hyperlink{
        color:blue;
        cursor: pointer;
    }
    .alignCenter{
        width:100%;text-align:center;
    }
    .margin10px{
        margin:10px
    }
    .my-autocomplete {
        li {
            line-height: normal;
            padding: 7px;
            .name {
                text-overflow: ellipsis;
                overflow: hidden;
                }
            .addr {
                font-size: 12px;
                color: #b4b4b4;
                }
            .highlighted .addr {
                color: #ddd;
                }
            }
    }
    .savedShipments{
        font-size: 12px;
        height: 50px;
        line-height: 50px;
        border-bottom: 1px solid #ccc;
    }
    .box {
        border-bottom: 1px solid #ccc;
    }
    .savedDetail {
        font-size: 12px;
        line-height: 30px;
    }
    .amend .icon {
        margin-top: 13px;
        margin-left: 20px;
        font-size: 22px;
    }
</style>
