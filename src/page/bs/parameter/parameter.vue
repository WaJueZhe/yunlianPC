<template>
    <el-row class="warp" style="margin:5px;">
        <el-col :span="24" class="warp-breadcrum" style="padding:10px;">
            <app-title :title="paramTitle"></app-title>
        </el-col>
                
        <el-col :span="24" class="warp-main" v-loading="loading" element-loading-text="拼命加载中">
            <!--工具条-->
            <el-col :span="24"  style="padding-bottom: 0px;">
                <el-form :inline="true" :model="filters">
                    <el-form-item>
                      <el-select v-model="filters.paramType" placeholder="请选择参数类型" style="width:70%">
                          <el-option v-for="i in paramTypeEnum" :key="i.val" :label="i.lbl" :value="i.val"></el-option>
                      </el-select> 
                    </el-form-item>
                    <el-form-item>
                        <el-input v-model="filters.paramCode" placeholder="参数代码" style="min-width: 120px;" ></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-input v-model="filters.remarks" placeholder="描述" style="min-width: 120px;"></el-input>
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
            <el-table :data="taskCateList" highlight-current-row v-loading="loading" style="width: 100%;" stripe :border="true" class="parameterTable">
                <el-table-column type="index" label="序号" width="50" align="center">
                </el-table-column>
                <el-table-column prop="id" label="id" v-if="false"></el-table-column> 
                <el-table-column prop="paramType" label="参数类型" align="center" width="80" :formatter="formatParamType">
                </el-table-column> 
                <el-table-column prop="paramCode" label="参数码" align="center" :show-overflow-tooltip="true">
                </el-table-column>
                <el-table-column prop="paramValue" label="参数值" align="center" :show-overflow-tooltip="true">
                </el-table-column>
                <el-table-column prop="remarks" label="备注" align="center" :show-overflow-tooltip="true">
                </el-table-column>
                <el-table-column prop="createBy" label="创建者" align="center" :show-overflow-tooltip="true">
                </el-table-column>
                <el-table-column prop="createDate" label="创建时间" align="center" :show-overflow-tooltip="true">
                </el-table-column> 
                <el-table-column label="操作" width="140" align="center">
                <template slot-scope="scope">
                    <el-button @click="showEditDialog(scope.$index,scope.row)">编辑</el-button>
                    <el-button @click="del(scope.$index,scope.row)">删除</el-button>
                    <el-button @click="privateParams(scope.row)" v-if="scope.row.paramType==2">个性化</el-button>
                </template>
                </el-table-column>
            </el-table>

            <!--工具条-->
            <el-col :span="24" class="toolbar">
                <!-- <el-button type="danger" @click="batchDeleteBook" :disabled="this.sels.length===0">批量删除</el-button> -->
                <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="limit" 
                    :total="total" background style="float:right;">
                </el-pagination>
            </el-col>

            <!--新增弹出框-->
            <el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false" width="30%" custom-class="myClass">
                <el-form :model="addForm" :rules="addFormRules" label-width="80px" ref="addForm" >
                  <el-form-item label="参数类型" prop="paramType">
                    <el-select v-model="addForm.paramType"  placeholder="请选择参数类型" class="addInt">
                        <el-option v-for="i in paramTypeNewEnum" :key="i.val" :label="i.lbl" :value="i.val"></el-option>
                    </el-select>
                  </el-form-item>
                        
                  <el-form-item label="参数码" prop="paramCode">
                      <el-input v-model="addForm.paramCode" auto-complete="off" placeholder="请输入参数码" class="addInt"></el-input>
                  </el-form-item>
              
                  <el-form-item label="参数值" prop="paramValue">
                      <el-input v-model="addForm.paramValue" auto-complete="off" placeholder="请输入参数值" class="addInt"></el-input>
                  </el-form-item>
              
                  <el-form-item label="备注" prop="remarks">
                      <el-input v-model="addForm.remarks" auto-complete="off" placeholder="请输入备注" class="addInt"></el-input>
                  </el-form-item>
                       
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click.native="addFormVisible = false">取消</el-button>
                    <el-button type="primary" @click.native="addSubmit">保存</el-button>
                </div>
            </el-dialog>

            <el-dialog title="编辑" :visible.sync ="editFormVisible" :close-on-click-modal="false" width="30%" custom-class="myClass">
                <el-form :model="editForm" :rules="updateFormRules" label-width="80px" ref="editForm">
                <input type="hidden" v-model="editForm.id"/>
                  <el-form-item label="参数类型" prop="paramType">
                    <el-select v-model="editForm.paramType" :disabled="true" placeholder="请选择参数类型" class="addInt">
                        <el-option v-for="i in paramTypeEnum" :key="i.val" :label="i.lbl" :value="i.val"></el-option>
                    </el-select>
                  </el-form-item>
              
                  <el-form-item label="参数码" prop="paramCode">
                      <el-input v-model="editForm.paramCode" :disabled="true" auto-complete="off" placeholder="请输入参数码" class="addInt"></el-input>
                  </el-form-item>
              
                  <el-form-item label="参数值" prop="paramValue">
                      <el-input v-model="editForm.paramValue" auto-complete="off" placeholder="请输入参数值" class="addInt"></el-input>
                  </el-form-item>
              
                  <el-form-item label="备注" prop="remarks">
                      <el-input v-model="editForm.remarks" auto-complete="off" placeholder="请输入备注" class="addInt"></el-input>
                  </el-form-item>
                
                </el-form>
                <div slot="footer" class="dialog-footer">
                <el-button @click.native="editFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="editSubmit">提交</el-button>
                </div>
            </el-dialog> 
                    
            <!--弹出框-->
            <el-dialog
                title="客户个性化参数"
                :visible.sync="dialogVisible"
                width="50%"
                :before-close="handleClose">
                <!--角色组tree-->
                
                <!--工具条-->
                <el-col :span="24" style="padding-bottom: 0px;">
                    <el-form :inline="true" :model="addForm_private"  ref="addForm_private" :rules="addFormRules_private">
                        <el-form-item label="客户" prop="custId">
                            <el-select v-model="addForm_private.custId" placeholder="请选择客户" style="width:70%" @change="selectCusstId">
                              <el-option v-for="i in custIdEnum" :key="i.val" :label="i.lbl" :value="i.val"></el-option>
                            </el-select>
                        </el-form-item> 
                        <el-form-item label="客户名" prop="custName" v-if="false">
                            <el-input v-model="addForm_private.custName"  placeholder="客户名" style="min-width: 120px;" ></el-input>
                        </el-form-item> 
                        <el-form-item label="系统参数id" prop="systemParamterId" v-if="false">
                            <el-input v-model="addForm_private.systemParamterId" placeholder="系统参数id" style="min-width: 120px;" ></el-input>
                        </el-form-item> 
                        <el-form-item label="参数代码" prop="paramCode" v-if="false">
                            <el-input v-model="addForm_private.paramCode" placeholder="参数代码" style="min-width: 120px;" ></el-input>
                        </el-form-item> 
                        <el-form-item label="参数值" prop="paramValue">
                            <el-input v-model="addForm_private.paramValue" placeholder="参数值" style="min-width: 120px;" ></el-input>
                        </el-form-item> 
                        <el-form-item>
                        <el-button type="primary" @click="addSubmit_private">增加</el-button>
                        </el-form-item> 
                    </el-form>
                </el-col>
                  <!--列表-->
                <el-table :data="taskCateList_private" highlight-current-row v-loading="loading" style="width: 100%;" stripe>
                      <el-table-column type="index" label="序号" width="150px">
                      </el-table-column>
                      <el-table-column prop="id" label="id" v-if="false"></el-table-column> 
                      <el-table-column prop="custId" label="custId" v-if="false"></el-table-column>
                      <el-table-column prop="custName" label="客户名称" width="150px" sortable >
                      </el-table-column> 
                      <el-table-column prop="paramCode" label="参数码" width="150px" sortable>
                      </el-table-column>
                      <el-table-column prop="paramValue" label="参数值" width="200px" sortable>
                      </el-table-column>   
                      <el-table-column label="操作" width="295px">
                      <template slot-scope="scope"> 
                          <el-button type="danger" @click="del_private(scope.$index,scope.row)" size="small">删除</el-button> 
                      </template>
                      </el-table-column>         
                  </el-table>
                <!--工具条-->
                <el-col :span="24" class="toolbar">
                    <!-- <el-button type="danger" @click="batchDeleteBook" :disabled="this.sels.length===0">批量删除</el-button> -->
                    <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange_private" :page-size="limit_private" 
                        :total="total_private" background style="float:right;">
                    </el-pagination>
                </el-col>

                <span slot="footer" class="dialog-footer"> 
                <el-button @click="dialogVisible = false">关闭</el-button> 
                </span> 
            </el-dialog>
        </el-col>
    </el-row>
</template>

<script>
let curUpdatePrivateParamParentId = ""; //当前修改角色组的用户id
let currentSystemParam_row = null; //当前修改系统参数行
export default {
  data() {
    //在此自定义校验，如新录入数据，在输入后校验后台是否重复
    var checkExistsCateDesc = (rule, value, callback) => {
      if (this.addForm.paramCode != "") {
        let p = {paramCode: this.addForm.paramCode};
        this.axios
          .post(`${this.api.baseURL}/systemParamter/getCountByParamCode`, p)
          .then(res => {
            if (parseInt(res.data.data.result) > 0) {
              callback(new Error("已存在相同的参数code!"));
            } else callback();
          });
      } else callback(); //空值则默认成功
    };  
    return {
      paramTitle: "参数管理",
      taskCateList: [],
      taskCateList_private: [],
      filters: {
        paramType:"",
        paramCode: "",
        remarks: "",
        createTime: ""
      },
      addForm_private:{
        customers:[],
        paramCode: "",
        remarks: ""
      },
      total: 0,
      page: 1,
      limit: 10,
      total_private: 0,//个性化参数
      page_private: 1,
      limit_private: 10,
      loading: false,
      addFormVisible: false, //新增界面是否显示
      addFormRules: {
        paramType: [
          { required: true, message: "请选择参数类型", trigger: "blur" }
        ],
        paramCode: [
          { required: true, message: "请输入参数代码", trigger: "blur" },
          { max: 50, message: "参数代码", trigger: "blur" },
          { validator: checkExistsCateDesc, trigger: "blur" } //自定义校验
        ],
        paramValue: [
            { required: true, message: "请输入参数值", trigger: "blur" },
            { max: 500, message: "参数值不能大于500个字符", trigger: "blur" }
        ],
        remarks: [
            { required: false, message: "请输备注", trigger: "blur" },
            { max: 500, message: "备注不能大于255个字符", trigger: "blur" }
        ]
      },
      addFormRules_private: {
        custId: [
          { required: true, message: "请选择客户", trigger: "blur" }
        ],
        paramValue: [
            { required: true, message: "请输入参数值", trigger: "blur" },
            { max: 500, message: "参数值不能大于500个字符", trigger: "blur" }
        ],
        remarks: [
            { required: false, message: "请输备注", trigger: "blur" },
            { max: 500, message: "备注不能大于500个字符", trigger: "blur" }
        ]
      },
      updateFormRules: {
        remarks: [
            { required: false, message: "请输备注", trigger: "blur" },
            { max: 500, message: "备注不能大于500个字符", trigger: "blur" }
        ]
      },
      addForm: {
        paramType: "1",
        paramCode: "",
        paramValue: "",
        remarks: ""
      },
      editFormVisible: false,
      editForm: {
        paramType: "",
        paramCode: "",
        paramValue: "",
        remarks: ""
      }, 
      dialogVisible: false, 
      custIdEnum: [],
      sexTypeEnum: [{ val: "1", lbl: "男" }, { val: "2", lbl: "女" }], //定义下拉框的options
      paramTypeEnum: [{ val: "", lbl: "全部查询" },{ val: "1", lbl: "全局" },{ val: "2", lbl: "定制" }],
      paramTypeNewEnum: [{ val: "1", lbl: "全局" },{ val: "2", lbl: "定制" }]
    };
  },
  methods: {
    formatParamType:function(row, column){
        let ret = ""
        switch (row.paramType) {
            case "1": ret = "全局"
                break;        
            case "2": ret = "定制"
                break;                                                      
            default:
                break;
        }
        return ret
    },
    getPrivateCustomers(currentSystemParam_row){
      let that = this
      let row = currentSystemParam_row
      // 1. 按：参数Code 查询所有客户中 未配置个性化参数 的客户列表
      let p = {paramCode: row.paramCode};
      this.axios.post(`${this.api.baseURL}/systemParamterCus/getPrivateCustomers`, p).then(res => {
        if (res.data.code == 200) { 
          that.custIdEnum = res.data.data.result;
          console.log( res.data.data.result)
        } else {
          alert("按：参数Code 查询所有客户中 未配置个性化参数 的客户列表 返回错误："+res.data.message);
        }
      }); 
    },
    getPagePrivate(currentSystemParam_row){
      let that = this
      let row = currentSystemParam_row
      // 2. 按：参数Code 查询 个性化参数列表
      let params = {
        currentPage: that.page_private,
        pageSize: that.limit_private,
        searchByKeys: { 
          paramCode: row.paramCode 
        },
        orderByKeys: { createDate: "desc" }
      }; 
      this.axios.post(`${this.api.baseURL}/systemParamterCus/getPagePrivate`, params).then(res => {
        if (res.data.code == 200) {
           that.taskCateList_private = res.data.data.result.content;
           that.total_private = res.data.data.result.totalRecord;     
           console.log("返回数据："+that.taskCateList)  
        } else { 
          alert(" 按：参数Code 查询 个性化参数列表 返回错误："+res.data.message);
        }
      });
    },
    selectCusstId(itemVal){
      console.log(itemVal)
      for (var eachOption of this.custIdEnum) {
        if(itemVal == eachOption["val"]){
          console.log( eachOption["val"] +" - " + eachOption["lbl"]);  
          this.addForm_private.custId = eachOption["val"]
          this.addForm_private.custName = eachOption["lbl"];
        }
      }
    },
    privateParams(row) {
      this.addForm_private={
        custId:"",
        custName:"",
        systemParamterId:"",
        paramCode:"",
        paramValue:"",
        remarks:""
      }

      this.addForm_private.systemParamterId = row.id
      this.addForm_private.paramCode = row.paramCode
      let that = this; 
      this.dialogVisible = true;
 
      currentSystemParam_row = row
      // 1. 按：参数Code 查询所有客户中 未配置个性化参数 的客户列表 
      this.getPrivateCustomers(currentSystemParam_row)
      
      // 2. 按：参数Code 查询 个性化参数列表 
      this.getPagePrivate(currentSystemParam_row)

    },
    del_private(index, row){
      this.$confirm("您确定要删除【" + row.paramCode + "】吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
          let that = this;
          let p = {id: row.id, paramCode: row.paramCode, custId: row.custId};
          that.axios.post(`${this.api.baseURL}/systemParamterCus/deleteByIdAndParamCodeAndCustId`, p).then(function(result) {
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
              that.getPrivateCustomers(currentSystemParam_row)  
              that.getPagePrivate(currentSystemParam_row)
            });
        })
        .catch(() => {
          this.$message({ type: "info", message: "已取消删除" });
        });
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
    handleSearchPrivate() {
      // this.total = 0;
      // this.page = 1;
      // this.search();
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
          paramType: this.filters.paramType,
          paramCode: this.filters.paramCode,
          remarks: this.filters.remarks
        },
        orderByKeys: { createDate: "desc" }
      }; 
      that.axios.post(`${this.api.baseURL}/systemParamter/findPage`, params)
        .then(res => { 
          that.taskCateList = res.data.data.result.content;
          that.total = res.data.data.result.totalRecord; 
        });
    },
    handleCurrentChange_private(val){
      this.page_private = val;
      this.search_private();
    },
    search_private: function() {
      let that = this;
      let params = {
        currentPage: that.page_private,
        pageSize: that.limit_private,
        searchByKeys: {
          paramCode: currentSystemParam_row.paramCode
        },
        orderByKeys: { createDate: "desc" }
      }; 
      that.axios.post(`${this.api.baseURL}/systemParamterCus/getPagePrivate`, params).then(res => { 
          if (res.data.code == 200) {
           that.taskCateList_private = res.data.data.result.content;
           that.total_private = res.data.data.result.totalRecord;     
           console.log("返回数据："+that.taskCateList)  
          } else {
            alert(" 按：参数Code 查询 个性化参数列表 返回错误："+res.data.message);
          } 
        });
    },
    handleAddNew() {
      this.addFormVisible = true;
      this.addForm = {
        paramType: "",
        paramCode: "",
        paramValue: "",
        remarks: ""
      };
    },
    addSubmit_private() {
      let that = this;
      this.$refs.addForm_private.validate(valid => {
        if (valid) {
          let para = Object.assign({}, this.addForm_private);
          that.axios
            .post(`${this.api.baseURL}/systemParamterCus/create`, para)
            .then(function(result) {
              if (result && result.data.code == "200") {
                //保存成功
                that.$message.success({
                  showClose: true,
                  message: "添加成功",
                  duration: 2000
                });
                that.$refs["addForm_private"].resetFields();
                
                that.getPrivateCustomers(currentSystemParam_row)  
                that.getPagePrivate(currentSystemParam_row)
                //that.search();
              } else {
                that.$message.error({
                  showClose: true,
                  message: "添加失败",
                  duration: 2000
                });
              }
            });
        }
      });

    },
    addSubmit: function() {
      let that = this;
      this.$refs.addForm.validate(valid => {
        if (valid) {
          let para = Object.assign({}, this.addForm);
          that.axios
            .post(`${this.api.baseURL}/systemParamter/create`, para)
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
                that.$message.error({
                  showClose: true,
                  message: "添加失败",
                  duration: 2000
                });
              }
            });
        }
      });
    },
    editSubmit: function() {
      let that = this;
      this.$refs.editForm.validate(valid => {
        if (valid) {
          let para = Object.assign({}, this.editForm);
          console.log("参数：" + para);
          that.axios
            .post(`${this.api.baseURL}/systemParamter/update`, para)
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
      //console.log(row);
      this.editFormVisible = true;
      this.editForm = Object.assign({}, row);
    },
    del(index, row) {
      this.$confirm("您确定要删除【" + row.paramCode + "】吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let that = this;
          let p = {id: row.id, paramCode: row.paramCode};
          that.axios
            .post(`${this.api.baseURL}/systemParamter/deleteByIdAndParamCode`, p)
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
  },
};
</script>
<style lang="less" scoped>
.warp{
  padding-left: 2px;
  padding-right: 20px;
}
el-button el-button--info el-button--small {
  float: none;
}
// .operation-right {
//   float: left;
//   margin-left: 40px;
// }
.addInt {
  width: 70%;
}
.el-button+.el-button {
  margin-left: 0;
}

.parameterTable .el-table__row .el-button {
  padding: 0;
  color: #409eff;
  border: none;
  padding-right: 3px;
}
</style>