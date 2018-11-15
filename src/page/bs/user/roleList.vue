<template>
    <el-row class="warp" style="margin:5px;">
        <el-col :span="24" class="warp-breadcrum">
            <app-title :title="roleListTiele"></app-title>
        </el-col>
                
        <el-col :span="24" class="warp-main" v-loading="loading" element-loading-text="拼命加载中">
            <!--工具条-->
            <el-col :span="24" style="padding-bottom: 0px;">
                <el-form :inline="true" :model="filters">
                    <el-form-item>
                        <el-input v-model="filters.roleName" placeholder="角色名称" style="min-width: 120px;"></el-input>
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
            <el-table :data="taskCateList" highlight-current-row v-loading="loading" style="width: 100%;" stripe :border="true" class="roleListTable">
                <el-table-column type="index" label="序号" width="50" align="center">
                </el-table-column>
                <el-table-column prop="id" label="id" v-if="false"></el-table-column>
                <el-table-column prop="roleName" label="角色名称" align="center" sortable>
                </el-table-column>
                <el-table-column prop="noti" label="角色描述" align="center" sortable>
                </el-table-column>
                <el-table-column prop="createTime" label="创建时间" align="center" sortable>
                </el-table-column>
                <el-table-column label="操作" width="200" align="center">
                <template slot-scope="scope">
                    <el-button @click="showEditDialog(scope.$index,scope.row)">编辑</el-button>
                    <el-button @click="del(scope.$index,scope.row)">删除</el-button>
                    <el-button @click="queryRoleMenuFun(scope.row)">分配角色权限</el-button>
                </template>
                </el-table-column>              
            </el-table>

            <!--工具条-->
            <el-col :span="24" class="toolbar">
                <!-- <el-button type="danger" @click="batchDeleteBook" :disabled="this.sels.length===0">批量删除</el-button> -->
                <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="limit" 
                            :total="total" background 
                            style="float:right;">
                </el-pagination>
            </el-col>

            <!--弹出框-->
            <el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false" width="30%" custom-class="myClass">
                <el-form :model="addForm" label-width="100px" :rules="addFormRules" ref="addForm" label-position="right">
                    <el-form-item label="角色名称" prop="roleName">
                        <el-input v-model="addForm.roleName" auto-complete="off" placeholder="请输入角色名称" style="width:80%"></el-input>
                    </el-form-item>
                    <el-form-item label="描述" prop="noti">
                        <el-input v-model="addForm.noti" auto-complete="off" placeholder="请输入备注" style="width:80%;"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click.native="addFormVisible = false">取消</el-button>
                    <el-button type="primary" @click.native="addSubmit">保存</el-button>
                </div>
            </el-dialog>

            <el-dialog title="编辑" :visible.sync ="editFormVisible" :close-on-click-modal="false" width="30%" custom-class="myClass">
                <el-form :model="editForm" label-width="100px" :rules="updateFormRules" ref="editForm" label-position="right">
                <input type="hidden" v-model="editForm.id"/>
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="editForm.roleName" auto-complete="off" :disabled="true"></el-input>
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
            <el-dialog
                title="提示"
                :visible.sync="dialogVisible"
                width="50%"
                :before-close="handleClose" custom-class="myClass">
                <!--角色组tree-->
                <el-tree
                        :data="roleTreeData"
                        show-checkbox
                        default-expand-all
                        node-key="id"
                        ref="tree"
                        :default-checked-keys=defaultCheckedKeys
                        :props="defaultProps">
                        </el-tree> 
                <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="updateRoleMenuFun">确 定</el-button>
                </span> 
            </el-dialog>

        </el-col>
    </el-row>
</template>

<script>
let currentUpdateRoleId  = "" //当前修改角色权限 组的用户id
export default{
    data(){
        return{
            roleListTiele:'角色管理',  
            taskCateList: [],
            filters:{
                roleName: '',
                createTime: ''
            },
            total: 0,
            page: 1,
            limit: 10,
            loading: false,
            addFormVisible : false,  //新增界面是否显示
            addFormRules :{
                roleName :[
                    {required: true, message : '请输入名称', trigger : 'blur'},
                    {min:2, max:60, message: '必须输入2-60个字', trigger: 'blur'}
                ]
            },
            updateFormRules :{
                roleName :[
                    {required: true, message : '请输入名称', trigger : 'blur'},
                    {min:2, max:60, message: '必须输入2-60个字', trigger: 'blur'}
                ]
            },
            addForm: {
                roleName: ""
            },
            editFormVisible: false,
            editForm: {
                id: "",
                roleName: ""              
            },
            roleTreeData: [],
            defaultProps: {
                children: 'children',
                label: 'roleName'
            },
            dialogVisible:false,
            defaultCheckedKeys:[]
        }
    },
    methods:{
        queryRoleMenuFun(row){
            currentUpdateRoleId = row.id
            this.dialogVisible = true  
            let that = this;
            that.roleTreeData = []
            that.defaultCheckedKeys = []
            let p = {roleId: row.id};
            this.axios.post(this.api.queryRoleMenu, p).then(res => { 
                if (res.data.code == 200) {
                that.roleTreeData = res.data.data.customerMenus;
                that.defaultCheckedKeys = res.data.data.roleMenus;
                console.log("that.defaultCheckedKeys = " +res.data.data.userRole)
                }else{
                alert(res.data.message)
                }
            })    
        },
        //修改角色权限
        updateRoleMenuFun(){
            //params.append("roleId", currentUpdateRoleId);
            console.log("currentUpdateRoleId = "+currentUpdateRoleId)
            console.log("this.$refs.tree.getCheckedKeys() = "+this.$refs.tree.getCheckedKeys())
            let menuIds = new Array(this.$refs.tree.getCheckedKeys())
            console.log("menuIds = "+menuIds)
            //params.append("menuIds",menuIds);
            let p = {
                roleId: currentUpdateRoleId,
                menuIds: this.$refs.tree.getCheckedKeys()
            };
            let last=JSON.stringify(p)
            console.log("最后 string ："+last)
            this.axios.post(this.api.updateRoleMenu, p).then(res => {
                if (res.data.code == 200) { 
                console.log("修改成功")
                this.dialogVisible = false
                }else{
                alert("修改失败：" + res.data.message)
                }
            }) 
        },
        //关闭添加用户弹框
        handleClose(done) {
        // this.$confirm("确认关闭？").then(_ => { done(); }).catch(_ => {});
        this.dialogVisible = false
        },
        handleSearch(){
            this.total = 0;
            this.page = 1;
            this.search();
        },
        handleCurrentChange(val){
            this.page = val;
            this.search();
        },
        search: function(){
            let that = this
            let params = {
                currentPage: that.page,
                pageSize: that.limit,
                searchByKeys: {roleName: that.filters.roleName},
                orderByKeys: {createTime: 'desc'}
            }
            that.axios.post(`${this.api.baseURL}/role/getPageRole`, params).then(res =>{
                that.taskCateList = res.data.data.result.content;
                that.total = res.data.data.result.totalRecord;
            })

        },
        handleAddNew(){
            this.addFormVisible = true;
            this.addForm = {
                roleName: ""
            }            
        },
        addSubmit: function(){
            let that = this
            this.$refs.addForm.validate((valid) =>{
                if(valid){
                    let para = Object.assign({}, this.addForm);
                    that.axios.post(`${this.api.baseURL}/role/createRole`, para).then(function(result){
                        //console.log(result);
                        if ((result) && (result.data.code == '200')){ //保存成功
                            that.$message.success({showClose: true, message: '添加成功', duration: 2000});
                            that.$refs['addForm'].resetFields();
                            that.addFormVisible = false;
                            that.search();
                        }else{
                            that.$message.error({showClose: true, message: '添加失败', duration: 2000});
                        }
                    })
                }
            })
        },
        editSubmit: function(){
            let that = this
            this.$refs.editForm.validate((valid) =>{
                if(valid){
                    let para = Object.assign({}, this.editForm);
                    that.axios.post(`${this.api.baseURL}/role/updateRole`, para).then(function(result){
                        //console.log(result);
                        if ((result) && (result.data.code == '200')){ //修改成功
                            that.$message.success({showClose: true, message: '修改成功', duration: 2000});
                            that.$refs['editForm'].resetFields();
                            that.editFormVisible = false;
                            that.search();
                        }else{
                            that.$message.error({showClose: true, message: '修改失败', duration: 2000});
                        }
                    })
                }
            })
        },
        showEditDialog(index, row){
            //console.log(row);
            this.editFormVisible = true;
            this.editForm = Object.assign({}, row);
        },
        del(index, row){
            this.$confirm('您确定要删除【' + row.roleName + '】吗？', '提示', 
                {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'}).then(() => 
            {
                let that = this
                let p = {id: row.id};
                that.axios.post(`${this.api.baseURL}/role/deleteRole`, p).then(function(result){
                    //console.log(result);
                    if ((result) && (result.data.code == '200')){ //删除成功
                        that.$message.success({showClose: true, message: '已删除', duration: 2000});
                        that.search();
                    }else{
                        that.$message.error({showClose: true, message: '删除失败', duration: 2000});
                    }
                })
            }).catch(() => {
                this.$message({type: 'info', message: '已取消删除'});          
            });
        }
    },
    mounted(){
        this.handleSearch();
    },
    created() {
    // 主页添加键盘事件,注意,不能直接在焦点事件上添加回车
    var lett = this;
    document.onkeydown = function(e) {
      var key = e.which;
      if (key == 13) {
        lett.submitForm();
      }
    };
  },
}
</script>
<style>
.roleListTable .el-table__row .el-button {
  padding: 0;
  color: #409eff;
  border: none;
  padding-right: 3px;
}
</style>
