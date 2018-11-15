<template>
    <el-row class="warp" style="margin:5px;">
        <el-col :span="24" class="warp-breadcrum">
            <app-title :title="menuTitle"></app-title>
        </el-col>  
                
        <el-col :span="24" class="warp-main" v-loading="loading" element-loading-text="拼命加载中">
            <!--工具条-->
            <el-col :span="24" style="padding-bottom: 0px;">
                <el-form :inline="true" :model="filters">
                    <el-form-item>
                        <el-input v-model="filters.nodeName" placeholder="菜单权限名称_new" style="min-width: 120px;"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-input v-model="filters.nodeCode" placeholder="菜单权限代码_new" style="min-width: 120px;"></el-input>
                    </el-form-item>
                    <el-form-item>
                    <el-button type="primary" @click="handleSearch" @keyup.13="alert">查询_new</el-button>
                    </el-form-item>
                    <el-form-item>
                    <el-button type="primary" @click="handleAddNew">新增_new</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        
            <!--列表-->
            <el-table :data="taskCateList" highlight-current-row v-loading="loading" style="width: 100%;" stripe :border="true">
                <el-table-column type="index" label="序号" width="70%">
                </el-table-column>
                <el-table-column prop="id" label="id" v-if="false"></el-table-column>
                <el-table-column prop="nodeName" label="菜单权限名称" min-width="25%" align="center" sortable>
                </el-table-column>
                <el-table-column prop="nodeCode" label="菜单权限代码" min-width="25%" align="center" sortable>
                </el-table-column>
                <el-table-column prop="createTime" label="创建时间" min-width="25%" align="center" sortable>
                </el-table-column>
                <el-table-column label="操作" min-width="25%" align="center">
                <template slot-scope="scope">
                    <el-button size="small" @click="showEditDialog(scope.$index,scope.row)">编辑</el-button>
                    <el-button type="danger" @click="del(scope.$index,scope.row)" size="small">删除</el-button>
                </template>
                </el-table-column>              
            </el-table>

            <!--分页-->
            <el-col :span="24" class="toolbar">
                <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="limit" :total="total" background style="float:right;">
                </el-pagination>
            </el-col>

            <!--新增弹出框-->
            <el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false" custom-class="myClass">
                <el-form :model="addForm" label-width="100px;" :rules="addFormRules" ref="addForm">

                <el-row :gutter="10">
                    <el-col :span="12">
                        <el-form-item label="菜单权限名称" prop="nodeName">
                            <el-input v-model="addForm.nodeName" auto-complete="off" placeholder="请输入菜单权限名称"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="菜单请求地址" prop="activeUrl">
                            <el-input v-model="addForm.activeUrl" auto-complete="off" placeholder="请输入菜单请求地址"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="10">
                    <el-col :span="12">
                        <el-form-item label="父级菜单" prop="parentNodeName">
                            <el-input v-model="addForm.parentNodeName" auto-complete="off" @click.native="queryAllMenuTree" disabled placeholder="请选择父级菜单"></el-input>
                        </el-form-item>
                        <el-form-item label="父级菜单代码" prop="parentNodeCode" v-if="false">
                            <el-input v-model="addForm.parentNodeCode" auto-complete="off" placeholder="请选择父级菜单---代码：0"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="当前菜单权限代码" prop="nodeCode">
                            <el-input v-model="addForm.nodeCode" auto-complete="off" disabled placeholder="生成当前菜单权限代码,格式，例如一级：m001 "></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="10">
                    <el-col :span="12">
                        <el-form-item label="菜单层级" prop="nodeLevel">
                            <el-select v-model="addForm.nodeLevel" placeholder="请输入菜单层级：0，1，2..." style="width:100%">
                                <el-option v-for="i in nodeLevelEnum" :key="i.val" :label="i.lbl" :value="i.val"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="顺序标记" prop="orderFlag">
                            <el-select v-model="addForm.orderFlag" placeholder="请选择顺序标记0，1，2..." style="width:100%">
                                <el-option v-for="i in orderFlagEnum" :key="i.val" :label="i.lbl" :value="i.val"></el-option>
                            </el-select>
                        </el-form-item>   
                    </el-col>
                </el-row>

                <el-row :gutter="10">
                    <el-col :span="12">
                        <el-form-item label="是否有子节点" prop="childFlag">
                            <el-select v-model="addForm.childFlag" placeholder="请选择是否有子节点1-有，0-无" style="width:100%">
                                <el-option v-for="i in childFlagEnum" :key="i.val" :label="i.lbl" :value="i.val"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="状态" prop="status">
                            <el-select v-model="addForm.status" placeholder="请输入状态：1-可用，-0不可用" style="width:100%">
                                <el-option v-for="i in statusEnum" :key="i.val" :label="i.lbl" :value="i.val"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-form-item label="描述" prop="noti">
                    <el-input v-model="addForm.noti" auto-complete="off" placeholder="请输入备注"></el-input>
                </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click.native="addFormVisible = false">取消</el-button>
                    <el-button type="primary" @click.native="addSubmit">保存</el-button>
                </div>
            </el-dialog>


            <!--新增弹出父级菜单-->
            <el-dialog title="选择父级菜单---点击选择" :visible.sync="addFormParentTreeVisible" :close-on-click-modal="false" width="20%">
              <div>
                <div v-if="true">
                  <el-tree
                    :data="data2"
                    default-expand-all
                    node-key="id"
                    @node-click="handleNodeClick"
                    ref="tree"
                    highlight-current
                    :props="defaultProps">
                  </el-tree>                  
                </div>
                <div slot="footer" class="dialog-footer" style="text-align:right;">
                    <el-button type="primary" @click.native="addSubmitParentTree">保存</el-button>
                </div>
              </div>
            </el-dialog>


            <!-- 编辑弹出框 -->
            <el-dialog title="编辑" :visible.sync ="editFormVisible" :close-on-click-modal="false">
                <el-form :model="editForm" label-width="100px" :rules="updateFormRules" ref="editForm">
                <input type="hidden" v-model="editForm.id"/>
                <el-form-item label="菜单权限名称" prop="nodeName">
                    <el-input v-model="editForm.nodeName" auto-complete="off" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="菜单权限代码" prop="nodeCode">
                    <el-input v-model="editForm.nodeCode" auto-complete="off" :disabled="true"></el-input>
                </el-form-item>      
                
                <el-form-item label="父级菜单代码" prop="parentNodeCode">
                    <el-input v-model="editForm.parentNodeCode" auto-complete="off" :disabled="true" placeholder="请输入父级菜单代码"></el-input>
                </el-form-item>
                <el-form-item label="菜单层级" prop="nodeLevel">
                    <el-select v-model="editForm.nodeLevel" placeholder="请输入菜单层级：0，1，2..." style="width:70%">
                        <el-option v-for="i in nodeLevelEnum" :key="i.val" :label="i.lbl" :value="i.val"></el-option>
                    </el-select>
                </el-form-item>                
                <el-form-item label="是否有子节点" prop="childFlag">
                    <el-select v-model="editForm.childFlag" placeholder="请选择是否有子节点1-有，0-无" style="width:70%">
                        <el-option v-for="i in childFlagEnum" :key="i.val" :label="i.lbl" :value="i.val"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="顺序标记" prop="orderFlag">
                    <el-select v-model="editForm.orderFlag" placeholder="请选择顺序标记0，1，2..." style="width:70%">
                        <el-option v-for="i in orderFlagEnum" :key="i.val" :label="i.lbl" :value="i.val"></el-option>
                    </el-select>
                </el-form-item> 
                <el-form-item label="状态" prop="status">
                    <el-select v-model="editForm.status" placeholder="请输入状态：1-可用，-0不可用" style="width:70%">
                        <el-option v-for="i in statusEnum" :key="i.val" :label="i.lbl" :value="i.val"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="菜单请求地址" prop="activeUrl">
                    <el-input v-model="editForm.activeUrl" auto-complete="off" placeholder="请输入菜单请求地址"></el-input>
                </el-form-item>
                <el-form-item label="描述" prop="noti">
                    <el-input v-model="editForm.noti" auto-complete="off" placeholder="请输入备注"></el-input>
                </el-form-item> 
                </el-form>
                <div slot="footer" class="dialog-footer">
                <el-button @click.native="editFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="editSubmit">提交</el-button>
                </div>
            </el-dialog>         
            <!--弹出框-->
        </el-col>
    </el-row>
</template>

<script>
export default {
  data() {
    //在此自定义校验，如新录入数据，在输入后校验后台是否重复
    var checkExistsCateDesc = (rule, value, callback) => {
      if (this.addForm.nodeCode != "") {
        let p = {nodeCode: this.addForm.nodeCode};
        this.axios
          .post(`${this.api.baseURL}/menu/getCountByNodeCode`, p)
          .then(res => {
            if (parseInt(res.data.data.result) > 0) {
              callback(new Error("已存在相同的菜单代码!"));
            } else callback();
          });
      } else callback(); //空值则默认成功
    };
    return {
      data2: [],
      defaultProps: {
        children: 'children',
        label: 'roleName'
      },
      menuTitle: "菜单权限管理_new",
      taskCateList: [],
      filters: {
        nodeName: "",
        nodeCode: "",
        createTime: ""
      },
      total: 0,
      page: 1,
      limit: 10,
      loading: false,
      addFormVisible: false, //新增界面是否显示
      addFormParentTreeVisible:false,
      addFormRules: {
        nodeName: [
          { required: true, message: "请输入名称", trigger: "blur" },
          { min: 2, max: 60, message: "必须输入2-60个字", trigger: "blur" }
        ],
        nodeCode: [
          { required: true, message: "重新选择父菜单，生成菜单权限代码", trigger: "blur" },
          { max: 10, message: "code太长", trigger: "blur" },
          { validator: checkExistsCateDesc, trigger: "blur" } //自定义校验
        ],
        parentNodeName: [
          { required: true, message: "请选择父级菜单", trigger: "blur" }
        ],
        nodeLevel: [
          { required: true, message: "请选择节点级别", trigger: "blur" }
        ],
        childFlag: [
          { required: true, message: "请选择是否有子节点", trigger: "blur" }
        ],
        orderFlag: [
          { required: true, message: "请选择排序值", trigger: "blur" }
        ],
        status: [{ required: true, message: "请选择状态", trigger: "blur" }]
      },
      updateFormRules: {
        nodeName: [
          { required: true, message: "请输入名称", trigger: "blur" },
          { min: 2, max: 60, message: "必须输入2-60个字", trigger: "blur" }
        ],
        parentNodeCode: [
          { required: true, message: "请输入父级菜单代码", trigger: "blur" }
        ],
        nodeLevel: [
          { required: true, message: "请选择节点级别", trigger: "blur" }
        ],
        childFlag: [
          { required: true, message: "请选择是否有子节点", trigger: "blur" }
        ],
        orderFlag: [
          { required: true, message: "请选择排序值", trigger: "blur" }
        ],
        status: [{ required: true, message: "请选择状态", trigger: "blur" }]
      },
      addForm: {
        nodeName: "",
        nodeCode: "",
        parentNodeCode:"",
        parentNodeName:""
      },
      editFormVisible: false,
      editForm: {
        id: "",
        nodeName: "",
        nodeCode: ""
      },
      childFlagEnum: [
        { val: "", lbl: "" },
        { val: "1", lbl: "有" },
        { val: "0", lbl: "无" }
      ],
      statusEnum: [{ val: "1", lbl: "可用" }, { val: "0", lbl: "不可用" }],
      nodeLevelEnum: [{ val: "1", lbl: "一级" }, { val: "2", lbl: "二级" }],
      orderFlagEnum: [
        { val: "1", lbl: "1" },
        { val: "2", lbl: "2" },
        { val: "3", lbl: "3" },
        { val: "4", lbl: "4" }
      ]
    };
  },
  methods: {
    handleNodeClick(data) {
      console.log(data);
      this.addForm.parentNodeCode = data.id;
      this.addForm.parentNodeName = data.roleName;
      console.log( " this.addForm.parentNodeCode = "+this.addForm.parentNodeCode);
    },
    queryAllMenuTree(){
      this.addFormParentTreeVisible = true;
      this.addForm.parentNodeCode = "";
      this.addForm.parentNodeName = "";
      this.addForm.nodeCode = "";
      let that = this;
      let params = {};
      that.axios
        .post(`${this.api.baseURL}/menu/queryAllMenuTree`, params)
        .then(res => {
          console.log(res)
          that.data2 = res.data.data.result;
        });
    },
    addSubmitParentTree(){
      if(!this.addForm.parentNodeCode){
        this.$message.error({
          showClose: true,
          message: "点击选择父级菜单",
          duration: 2000
        });
        return;
      }
      // 查询生成菜单code
      let that = this;
      let params = {parentNodeCode:this.addForm.parentNodeCode};
      that.axios
        .post(`${this.api.baseURL}/menu/generateNodeCode`, params)
        .then(res => {
          console.log(res)
          that.addForm.nodeCode = res.data.data.result;
          that.addFormParentTreeVisible = false;
        });

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
          nodeName: that.filters.nodeName,
          nodeCode: that.filters.nodeCode
        },
        orderByKeys: { createTime: "desc" }
      };
      // that.loading = true // show loading progress
      that.axios
        .post(`${this.api.baseURL}/menu/getPageMenu`, params)
        .then(res => {
          //console.log(res);
          that.taskCateList = res.data.data.result.content;
          that.total = res.data.data.result.totalRecord;
          /*this.taskCateList = [
                    {id:'9e9a4a2320c44c70adc4572c87ae0824', nodeName:'AAAA', nodeCode: 'remark1'}, 
                    {id:'222', nodeName:'BBBB', nodeCode: 'remark2'}
                ]*/
        });
    },
    handleAddNew() {
      this.addFormVisible = true;
      this.addForm = {
        nodeName: "",
        nodeCode: ""
      };
    },
    addSubmit: function() {
      let that = this;
      this.$refs.addForm.validate(valid => {
        if (valid) {
          let para = Object.assign({}, this.addForm);
          that.axios
            .post(`${this.api.baseURL}/menu/createMenu`, para)
            .then(function(result) {
              //console.log(result);
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
          that.axios
            .post(`${this.api.baseURL}/menu/updateMenu`, para)
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
      this.$confirm("您确定要删除【" + row.nodeName + "】吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let that = this;
          let p = {id: row.id};
          that.axios
            .post(`${this.api.baseURL}/menu/deleteMenu`, p)
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
// 底部分页
.toolbar {
  position: fixed;
  bottom: 20px;
  right: 20px;
}
</style>
