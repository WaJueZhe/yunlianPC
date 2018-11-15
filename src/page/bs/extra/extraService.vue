<template>
    <el-row class="warp" style="margin:5px;">

        <el-col :span="24" class="warp-breadcrum">
            <app-title :title="userTitle"></app-title>
        </el-col>

        <el-col :span="24" class="warp-main" v-loading="loading" element-loading-text="拼命加载中">
            <!--工具条-->
            <el-col :span="24" style="padding-bottom: 0px;">
                <el-form :inline="true" :model="filters">
                    <el-form-item>
                        <el-input v-model="filters.orgName" placeholder="客户名称" style="min-width: 120px;"></el-input>
                    </el-form-item>
                    <el-form-item>                        
                        <el-select v-model="filters.serviceCode" style="70%" auto-complete="off" placeholder="服务类型">
                          <el-option v-for="i in serviceCode_AllEnum" :key="i.val" :label="i.lbl" :value="i.val"></el-option>
                        </el-select>
                    </el-form-item> 
                    <el-form-item prop="serviceStatus">
                        <el-select v-model="filters.serviceStatus" placeholder="服务状态" style="width:70%">
                            <el-option v-for="i in serviceStatusEnum" :key="i.val" :label="i.lbl" :value="i.val"></el-option>
                        </el-select>
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
            <el-table :data="serviceList" highlight-current-row v-loading="loading" style="width: 100%;" stripe :border="true" class="extraServiceTable">
                <el-table-column type="index" label="序号" width="50%" align="center"></el-table-column>

                <el-table-column prop="id" label="id" v-if="false"></el-table-column>

                <el-table-column prop="customerOrgId" label="customerOrgId" v-if="false"></el-table-column>

                <el-table-column prop="orgName" label="客户名称" align="center"></el-table-column>

                <el-table-column prop="serviceCode" label="服务类型" :formatter="formatServiceCodeStatus" align="center" width="80"></el-table-column>

                <!-- <el-table-column prop="serviceName" label="服务名称" min-width="10%" align="center"></el-table-column> -->

                <el-table-column prop="serviceDesc" label="服务描述" align="center"></el-table-column>

                <el-table-column prop="serviceStatus" label="服务状态" :formatter="formatServiceStatus" align="center" width="80"></el-table-column>
                <el-table-column prop="statusReason" label="停用原因" align="center"></el-table-column>
                <el-table-column prop="startDate" label="起效时间" align="center">
                  <template slot-scope="scope">
                      <p>{{ scope.row.startDate | dateFormate}}</p>
                  </template>
                </el-table-column>
                <el-table-column prop="expiryDate" label="失效时间" align="center">
                  <template slot-scope="scope">
                      <p>{{ scope.row.expiryDate | dateFormate}}</p>
                  </template>
                </el-table-column> 
                <el-table-column label="操作" width="100" fixed="right" align="center">
                  <template slot-scope="scope">
                      <el-button @click="showEditDialog(scope.$index,scope.row)">编辑</el-button>
                      <el-button @click="del(scope.$index,scope.row)">删除</el-button> 
                  </template>
                </el-table-column>
            </el-table>

            <!--分页-->
            <el-col :span="24" class="toolbar">
                <el-pagination  layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="limit" :total="total" background style="float:right;"></el-pagination>
            </el-col>

            <!--新增弹出框-->
            <el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false" custom-class="myClass">
                <el-form :model="addForm" :rules="formRules" ref="addForm" label-width="100px" label-position="right">

                  <!-- 第一行 -->
                    <el-row :gutter="10">
                        <el-col :span="12">
                            <el-form-item label="客户id" prop="customerOrgId" v-if="false">
                                <el-input v-model="addForm.customerOrgId" style="100%"  auto-complete="off" v-if="false"></el-input>
                            </el-form-item>
                        </el-col>

                        <el-col :span="12">
                            <el-form-item label="客户名称" prop="orgName">
                                <el-autocomplete popper-class="my-autocomplete" style="width:100%" v-model="addForm.orgName" 
                                    :fetch-suggestions="queryOrgName" placeholder="客户名称" @select="handleSelectDlr">
                                    <template slot-scope="props">
                                        <div class="name">{{props.item.orgName}}</div>
                                    </template>
                                </el-autocomplete>
                            </el-form-item>
                        </el-col>

                        <el-col :span="12">
                              <el-form-item label="服务类型" prop="serviceCode">
                                  <el-select v-model="addForm.serviceCode" style="70%" auto-complete="off" placeholder="服务类型">
                                    <el-option v-for="i in serviceCode_Enum" :key="i.val" :label="i.lbl" :value="i.val"></el-option>
                                  </el-select>
                              </el-form-item>
                        </el-col>
                        <!-- <el-col :span="12">
                            <el-form-item label="服务名称" prop="serviceName">
                                <el-input v-model="addForm.serviceName" style="70%" auto-complete="off" placeholder="服务名称"></el-input>
                            </el-form-item>
                        </el-col> -->
                    </el-row>

                  <!-- 第二行 -->
                    <el-row :gutter="10">
                      <el-col :span="24">
                          <el-form-item label="服务描述" prop="serviceDesc">
                              <el-input v-model="addForm.serviceDesc" :maxlength="128" auto-complete="off" placeholder="服务描述"></el-input>
                          </el-form-item>
                      </el-col>
                    </el-row>

                  <!-- 第三行 -->
                    <el-row :gutter="10">
                        <el-col :span="12">
                          <el-form-item label="服务状态" prop="serviceStatus">
                              <el-select v-model="addForm.serviceStatus" placeholder="服务状态" style="width:100%">
                                  <el-option v-for="i in serviceStatus_2Enum" :key="i.val" :label="i.lbl" :value="i.val"></el-option>
                              </el-select>
                          </el-form-item>
                        </el-col>
                        <el-col :span="12">
                          <el-form-item label="停用原因" prop="statusReason">
                              <el-input v-model="addForm.statusReason" :maxlength="128" auto-complete="off" placeholder="停用原因"></el-input>
                          </el-form-item>
                        </el-col>
                    </el-row>

                    <!-- 第四行 -->
                    <el-row :gutter="10">
                      <el-col :span="12">
                        <el-form-item label="起效时间" prop="startDate">
                          <el-date-picker v-model="addForm.startDate" format="yyyy-MM-dd" type="date" value-format="yyyy-MM-dd" placeholder="选择日期"
                            class="add-more">
                          </el-date-picker>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="失效时间" prop="expiryDate">
                          <el-date-picker v-model="addForm.expiryDate" format="yyyy-MM-dd" type="date" value-format="yyyy-MM-dd" placeholder="选择日期"
                            class="add-more">
                          </el-date-picker>
                        </el-form-item>
                      </el-col>
                    </el-row>

                </el-form>
                <!-- 按钮 -->
                <div slot="footer" class="dialog-footer">
                    <el-button @click.native="addFormVisible = false">取消</el-button>
                    <el-button type="primary" @click.native="addSubmit">保存</el-button>
                </div>
            </el-dialog>

            <!-- 编辑弹框 -->
            <el-dialog title="编辑" :visible.sync ="editFormVisible" :close-on-click-modal="false" custom-class="myClass">
                <el-form :model="editForm" label-width="100px" :rules="formRules" ref="editForm" label-position="right">
                  <input type="hidden" v-model="editForm.id"/>
                  <input type="hidden" v-model="editForm.customerOrgId"/>
                  
                  <!-- 第一行 -->
                    <el-row :gutter="10">
                        <el-col :span="12">
                            <el-form-item label="客户id" prop="customerOrgId" v-if="false">
                                <el-input v-model="editForm.customerOrgId" style="100%"  auto-complete="off" v-if="false"></el-input>
                            </el-form-item>
                        </el-col>

                        <el-col :span="12">
                            <el-form-item label="客户名称" prop="orgName">
                              <el-input v-model="editForm.orgName" style="100%"  auto-complete="off" :disabled="true"></el-input>
                            </el-form-item>
                        </el-col>

                        <el-col :span="12">
                              <el-form-item label="服务类型" prop="serviceCode">
                                  <el-select v-model="editForm.serviceCode" style="70%" auto-complete="off" placeholder="服务类型" :disabled="true">
                                    <el-option v-for="i in serviceCode_Enum" :key="i.val" :label="i.lbl" :value="i.val"></el-option>
                                  </el-select>
                              </el-form-item>
                        </el-col> 
                    </el-row>

                  <!-- 第二行 -->
                    <el-row :gutter="10">
                      <el-col :span="24">
                          <el-form-item label="服务描述" prop="serviceDesc">
                              <el-input v-model="editForm.serviceDesc" :maxlength="128" auto-complete="off" placeholder="服务描述"  ></el-input>
                          </el-form-item>
                      </el-col>
                    </el-row>

                  <!-- 第三行 -->
                    <el-row :gutter="10">
                        <el-col :span="12">
                          <el-form-item label="服务状态" prop="serviceStatus">
                              <el-select v-model="editForm.serviceStatus" placeholder="服务状态" style="width:100%">
                                  <el-option v-for="i in serviceStatus_2Enum" :key="i.val" :label="i.lbl" :value="i.val"></el-option>
                              </el-select>
                          </el-form-item>
                        </el-col>
                        <el-col :span="12">
                          <el-form-item label="停用原因" prop="statusReason">
                              <el-input v-model="editForm.statusReason" :maxlength="128" auto-complete="off" placeholder="停用原因"></el-input>
                          </el-form-item>
                        </el-col>
                    </el-row>

                    <!-- 第四行 -->
                    <el-row :gutter="10">
                      <el-col :span="12">
                        <el-form-item label="起效时间" prop="startDate">
                          <el-date-picker v-model="editForm.startDate" format="yyyy-MM-dd" type="date" value-format="yyyy-MM-dd" placeholder="选择日期"
                            class="add-more">
                          </el-date-picker>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="失效时间" prop="expiryDate">
                          <el-date-picker v-model="editForm.expiryDate" format="yyyy-MM-dd" type="date" value-format="yyyy-MM-dd" placeholder="选择日期"
                            class="add-more">
                          </el-date-picker>
                        </el-form-item>
                      </el-col>
                    </el-row>

                </el-form>

                <div slot="footer" class="dialog-footer">
                <el-button @click.native="cancelEditForm">取消</el-button>
                <el-button type="primary" @click.native="editSubmit">提交</el-button>
                </div>
            </el-dialog> 
            
        </el-col>
    </el-row>
</template>

<script>
import moment from "moment";
let currentUpdateUserId = ""; //当前修改角色组的用户id
export default {
  data() {
    return {
      serviceCode_Enum :[
        { val: "", lbl: "" }
      ],
      serviceCode_AllEnum :[
        { val: "", lbl: "全部" }
      ],

      filteOrgName: [],  
      userTitle: "增值服务管理",
      serviceList: [],
      filters: {
        userName: "",
        userCode: "",
        createTime: ""
      }, 
      total: 0,
      page: 1,
      limit: 10,
      loading: false,
      addFormVisible: false, //新增界面是否显示
      formRules: {
        orgName: [
          { required: true, message: "请输入客户名称", trigger: "blur" },
          { min: 2, max: 60, message: "必须输入2-60个字", trigger: "blur" }
        ],
        serviceCode: [
          { required: true, message: "请输入服务代码", trigger: "blur" }
          // ,{ validator: checkExistsCateDesc, trigger: "blur" } //自定义校验
        ],
        serviceDesc: [
          { required: false, message: "请选输服务描述", trigger: "blur" }
        ],
        serviceStatus: [{ required: true, message: "请选择服务状态", trigger: "blur" }],
        statusReason: [{ required: false, message: "请选择停用原因", trigger: "blur" }],
        startDate: [{ required: true, message: "起效时间", trigger: "blur" }],
        expiryDate: [{ required: true, message: "失效时间", trigger: "blur" }]
      },
      addForm: {
        userName: "",
        userCode: "",
        status: "1"
      },
      editFormVisible: false,
      editForm: {
        id: "",
        userName: "",
        userCode: "",
        status: "1"
      },  
      statusEnum:  [{val: '1', lbl: '启用'}, {val: '0', lbl: '停用'}],
      serviceStatusEnum:  [{val: '', lbl: '全部'}, {val: '1', lbl: '启用'}, {val: '0', lbl: '停用'}],
      serviceStatus_2Enum:  [ {val: '1', lbl: '启用'}, {val: '0', lbl: '停用'}]
    };
  },
  filters: {
    dateFormate: function(value) {
       return moment(value).format("YYYY-MM-DD");
    }
  },
  methods: {
        cancelEditForm: function(){
            this.editFormVisible = false;
            this.$refs['editForm'].resetFields();
        }, 
        handleSelectDlr(item){
            this.addForm.customerOrgId = item.id;
            this.addForm.orgName = item.orgName;
            this.$refs['addForm'].validateField('orgName');
        },
        queryOrgName(queryString, cb) {
            if (!queryString) {
                queryString = "";
            }
            this.addForm.customerOrgId = "";
            //if (queryString && (queryString != "")){
                let that = this;
                let p = {orgName: queryString};
                that.axios.post(`${this.api.baseURL}/bsExtraService/queryCustomerOrg`, p).then(function(result){
                    //console.log(result);
                    if ((result) && (result.status == '200')){
                        that.filteOrgName = result.data.data.result;
                        cb(that.filteOrgName);
                    }
                });
            //}
        },
    formatServiceStatus: function(row, column){
      return (row.serviceStatus && row.serviceStatus == "0") ? "停用" : "启用";
    },  
    formatServiceCodeStatus : function(row, column){
      return (row.serviceCode && row.serviceCode == "1") ? "认证" : (row.serviceCode && row.serviceCode == "2") ? "签名" : row.serviceCode;
    },  
    //关闭添加用户弹框
    handleClose(done) {
      // this.$confirm("确认关闭？").then(_ => { done(); }).catch(_ => {});
      this.dialogVisible = false;
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
          orgName:that.filters.orgName,
          serviceCode: that.filters.serviceCode,
          serviceStatus: that.filters.serviceStatus
        },
        orderByKeys: { updateDate: "desc" }
      }; 
      that.axios
        .post(`${this.api.baseURL}/bsExtraService/findPage`, params)
        .then(res => { 
          that.serviceList = res.data.data.result.content;
          that.total = res.data.data.result.totalRecord; 
        });
    },
    handleAddNew() {
      let that = this;
      this.addFormVisible = true;
      this.addForm = {
        customerOrgId:"",
        userName: "",
        userCode: "",
        serviceStatus: "",
        statusReason: ""
      };
      
    },
    addSubmit: function() {
      if(this.addForm.serviceStatus == 0 && !this.addForm.statusReason ){
        this.$message.error({showClose: true, message: '请输入停用原因', duration: 6000});
        return ;
      }
      if(this.addForm.serviceStatus == 1){
        this.addForm.statusReason = ""
      }
      if(this.addForm.startDate >= this.addForm.expiryDate){
        this.$message.error({showClose: true, message: '失效日期要小于开始日期', duration: 6000});
        return ;
      }
      if(!this.addForm.customerOrgId){
        this.$message.error({showClose: true, message: '请重新录入客户名称，并选择查询到的客户', duration: 6000});
        return ;
      }

      let that = this;
      this.$refs['addForm'].validate(valid => {
        if (valid) {
          let para = Object.assign({}, this.addForm);
          that.axios.post(`${this.api.baseURL}/bsExtraService/createExtraService`, para)
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
                  console.log(result.data.message)
                  if(result.data.code == 400){
                      that.$message.error({showClose: true, message: '添加发生异常' + result.data.message, duration: 4000});
                  }else{
                      that.$message.error({showClose: true, message: '添加发生异常，请联系管理员', duration: 4000});
                  }
              }
            });
        }
      });
    },
    editSubmit: function() {
      if(this.editForm.serviceStatus == 0 && !this.editForm.statusReason ){
        this.$message.error({showClose: true, message: '请输入停用原因', duration: 6000});
        return ;
      }
      if(this.editForm.serviceStatus==1){
        this.editForm.statusReason = ""
      }
      if(this.editForm.startDate >= this.editForm.expiryDate){
        this.$message.error({showClose: true, message: '失效日期要小于开始日期', duration: 6000});
        return ;
      }
      let that = this;
      this.$refs.editForm.validate(valid => {
        if (valid) {
          let para = Object.assign({}, this.editForm);
          console.log("参数：" + para);
          that.axios
            .post(`${this.api.baseURL}/bsExtraService/updateExtraService`, para)
            .then(function(result) {
              //console.log(result);
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
            });
        }
      });
    },
    showEditDialog(index, row) {  
      this.editFormVisible = true;
      this.editForm = Object.assign({}, row);
    },
    del(index, row) {
      this.$confirm("您确定要删除【" + row.orgName + "】吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let that = this;
          let p = {id: row.id};
          that.axios
            .post(`${this.api.baseURL}/bsExtraService/deleteExtraService`, p)
            .then(function(result) {
              console.log(result);
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

      let para = {type: 'extra_service_list'};
      this.axios
        .post(`${this.api.baseURL}/dict/findByType`, para)
        .then(function(result) {
          //console.log(result);
          if (result && result.data.code == "200") {
            self.serviceCode_Enum = result.data.data.dicts;

            Array.prototype.push.apply(self.serviceCode_AllEnum,result.data.data.dicts);
            console.table(self.serviceCode_AllEnum)
          } else {
            console.log("error")
          }
        });

  },
};
</script>
<style lang="less" scoped>
el-button el-button--info el-button--small {
  float: none;
}
.info-box {
  text-align: center;
}
.info {
  text-align: center;
}
.userRolesNameClass{
    background: red;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis
}
.el-button+.el-button {
  margin-left: 0;
}

.extraServiceTable .el-table__row .el-button {
  padding: 0;
  color: #409eff;
  border: none;
  padding-right: 3px;
}
</style>