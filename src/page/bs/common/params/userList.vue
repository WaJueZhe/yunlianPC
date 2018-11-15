<template>
    <el-row class="warp" style="margin:5px;">
        <el-col :span="24" class="warp-breadcrum">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
            <el-breadcrumb-item>参数模块</el-breadcrumb-item>
        </el-breadcrumb>
        </el-col>
                
        <el-col :span="24" class="warp-main" v-loading="loading" element-loading-text="拼命加载中">
            <!--工具条-->
            <el-col :span="24" style="padding-bottom: 0px;">
                <el-form :inline="true" :model="filters">
                    <el-form-item>
                        <el-input v-model="filters.userName" placeholder="参数类型" style="min-width: 120px;"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-input v-model="filters.userCode" placeholder="参数代码" style="min-width: 120px;"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-input v-model="filters.userCode" placeholder="描述" style="min-width: 120px;"></el-input>
                    </el-form-item>
                    <el-form-item>
                    <el-button type="primary" @click="handleSearch">查询</el-button>
                    </el-form-item>
                    <el-form-item>
                    <el-button type="primary" @click="handleAddNew">新增</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        
            <!--列表-->
            <el-table :data="taskCateList" highlight-current-row v-loading="loading" style="width: 100%;" stripe>
                <el-table-column type="index" width="60px">
                </el-table-column>
                <el-table-column prop="id" label="id" v-if="false"></el-table-column>
                <el-table-column prop="userName" label="参数类型" width="150px" sortable>
                </el-table-column>
                <el-table-column prop="userCode" label="参数代码" width="150px" sortable>
                </el-table-column>
                <el-table-column prop="email" label="参数值" width="150px" sortable>
                </el-table-column>
                <el-table-column prop="identity" label="描述" width="150px" sortable>
                </el-table-column>
                <el-table-column label="操作" width="300px">
                <template slot-scope="scope">
                    <el-button size="small" @click="showEditDialog(scope.$index,scope.row)">编辑</el-button>
                    <el-button type="danger" @click="del(scope.$index,scope.row)" size="small">删除</el-button>
                    <el-button type="info" size="small"  @click="queryUserRoleFun(scope.row)"  style="float:right">分配用户角色</el-button>
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
            <el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false">
                <el-form :model="addForm" label-width="100px;" :rules="addFormRules" ref="addForm">
                    <el-form-item label="用户名称" prop="userName">
                        <el-input v-model="addForm.userName" auto-complete="off" placeholder="请输入用户名称"></el-input>
                    </el-form-item>
                    <el-form-item label="用户代码" prop="userCode">
                        <el-input v-model="addForm.userCode" auto-complete="off" placeholder="请输入用户代码"></el-input>
                    </el-form-item>
                    <el-form-item label="状态" prop="status">
                        <el-select v-model="addForm.status" placeholder="请选择状态1启用，0停用" style="width:70%">
                            <el-option v-for="i in statusEnum" :key="i.val" :label="i.lbl" :value="i.val"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="用户类型" prop="userType">
                        <el-select v-model="addForm.userType" placeholder="用户类型" style="width:70%">
                            <el-option v-for="i in userTypeEnum" :key="i.val" :label="i.lbl" :value="i.val"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="性别" prop="sex">
                        <el-select v-model="addForm.sex" placeholder="请选择性别" style="width:70%">
                            <el-option v-for="i in sexTypeEnum" :key="i.val" :label="i.lbl" :value="i.val"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="手机" prop="phone">
                        <el-input v-model="addForm.phone" auto-complete="off" placeholder="手机"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="addForm.email" auto-complete="off" placeholder="邮箱"></el-input>
                    </el-form-item>
                    <el-form-item label="地址" prop="address">
                        <el-input v-model="addForm.address" auto-complete="off" placeholder="地址"></el-input>
                    </el-form-item>
                    <el-form-item label="证件号" prop="identity">
                        <el-input v-model="addForm.identity" auto-complete="off" placeholder="证件号"></el-input>
                    </el-form-item>
                    <el-form-item label="证件类型" prop="identityType">
                        <el-select v-model="addForm.identityType" placeholder="请选择证件类型" style="width:70%">
                            <el-option v-for="i in identityTypeEnum" :key="i.val" :label="i.lbl" :value="i.val"></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="描述" prop="noti">
                        <el-input v-model="addForm.noti" auto-complete="off" placeholder="请输入备注"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click.native="addFormVisible = false">取消</el-button>
                    <el-button type="primary" @click.native="addSubmit">保存</el-button>
                </div>
            </el-dialog>

            <el-dialog title="编辑" :visible.sync ="editFormVisible" :close-on-click-modal="false">
                <el-form :model="editForm" label-width="100px" :rules="addFormRules" ref="editForm">
                <input type="hidden" v-model="editForm.id"/>
                <el-form-item label="用户名称" prop="userName">
                    <el-input v-model="editForm.userName" auto-complete="off" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="用户代码" prop="userCode">
                    <el-input v-model="editForm.userCode" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="phone">
                    <el-input v-model="editForm.phone" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="性别" prop="sex">
                    <el-select v-model="editForm.sex" placeholder="请选择地址类型" style="width:70%">
                        <el-option v-for="i in sexTypeEnum" :key="i.val" :label="i.lbl" :value="i.val"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="editForm.email" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="地址" prop="address">
                    <el-input v-model="editForm.address" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="证件号" prop="identity">
                    <el-input v-model="editForm.identity" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="证件类型" prop="identityType">
                    <el-select v-model="editForm.identityType" placeholder="请选择证件类型" style="width:70%">
                        <el-option v-for="i in identityTypeEnum" :key="i.val" :label="i.lbl" :value="i.val"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="微信openid " prop="wxOpenid">
                    <el-input v-model="editForm.wxOpenid" auto-complete="off"></el-input>
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
                :before-close="handleClose">
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
                <el-button type="primary" @click="updateUserRoleFun">确 定</el-button>
                </span> 
            </el-dialog>
        </el-col>
    </el-row>
</template>

<script>
let currentUpdateUserId  = "" //当前修改角色组的用户id
export default{
    data(){
        //在此自定义校验，如新录入数据，在输入后校验后台是否重复
        var checkExistsCateDesc = (rule, value, callback) =>{
            if (this.addForm.userCode != ''){
                let p = {userCode: this.addForm.userCode};
                this.axios.post(`${this.api.baseURL}/user/getCountByUserCode`, p).then(res =>{
                    if (parseInt(res.data.data.result) > 0){
                        callback(new Error('已存在相同的用户代码!')) 
                    }else callback()
                })
            }else callback()  //空值则默认成功
        };   
        var checkExistsPhoneDesc = (rule, value, callback) =>{
            if (this.addForm.phone != ''){
                let p = {phone: this.addForm.phone};
                this.axios.post(`${this.api.baseURL}/user/getCountByPhone`, p).then(res =>{
                    if (parseInt(res.data.data.result) > 0){
                        callback(new Error('已存在相同的手机号!')) 
                    }else callback()
                })
            }else callback()  //空值则默认成功
        }; 
        return{
            taskCateList: [],
            filters:{
                userName: '',
                userCode: '',
                createTime: ''
            },
            total: 0,
            page: 1,
            limit: 10,
            loading: false,
            addFormVisible : false,  //新增界面是否显示
            addFormRules :{
                userName :[
                    {required: true, message : '请输入名称', trigger : 'blur'},
                    {min:2, max:60, message: '必须输入2-60个字', trigger: 'blur'}
                ],
                userCode: [
                    {required: true, message: '请输入描述', trigger: 'blur'},
                    {max:60, message: '备注文字太长', trigger: 'blur'},
                    {validator: checkExistsCateDesc, trigger: 'blur'} //自定义校验
                ],
                status :[
                    {required: true, message : '请选择状态', trigger : 'blur'}
                ],
                identity :[
                    {required: true, message : '请输入身份证', trigger : 'blur'}
                ],
                userType :[
                    {required: true, message : '请选择证件类型', trigger : 'blur'}
                ],
                sex :[
                    {required: true, message : '请选择性别', trigger : 'blur'}
                ],
                phone :[
                    {required: true, message : '请选择手机', trigger : 'blur'},
                    {validator: checkExistsPhoneDesc, trigger: 'blur'} //自定义校验
                ],
                identityType :[
                    {required: true, message : '请选择证件类型', trigger : 'blur'}
                ]
            },
            addForm: {
                userName: "",
                userCode: ""
            },
            editFormVisible: false,
            editForm: {
                id: "",
                userName: "",
                userCode: ""                
            },
            roleTreeData: [],
            defaultProps: {
                children: 'children',
                label: 'roleName'
            },
            dialogVisible:false,
            defaultCheckedKeys:[],
            sexTypeEnum: [{val: '', lbl: ''}, {val: '1', lbl: '男'}, {val: '2', lbl: '女'}], //定义下拉框的options
            identityTypeEnum: [{val: '', lbl: ''}, {val: '0', lbl: '身份证'}],
            statusEnum:  [{val: '1', lbl: '启用'}, {val: '0', lbl: '停用'}],
            userTypeEnum: [{val: '1', lbl: '企业'}, {val: '2', lbl: '个体'}]
        }
    },
    methods:{
        queryUserRoleFun(row){
            currentUpdateUserId = row.id
            this.dialogVisible = true  
            let that = this;
            that.roleTreeData = []
            that.defaultCheckedKeys = []
            let p = {userId: row.id}
            this.axios.post(this.api.queryUserRole,p).then(res => { 
                if (res.data.code == 200) {
                that.roleTreeData = res.data.data.customerRole;
                that.defaultCheckedKeys = res.data.data.userRole;
                //console.log("that.defaultCheckedKeys = " +res.data.data.userRole)
                }else{
                alert(res.data.message)
                }
            })    
        },
        //修改用户角色组
        updateUserRoleFun(){
            let roleIds = new Array(this.$refs.tree.getCheckedKeys())
            //params.append("roleIds",roleIds);
            let p = {userId: currentUpdateUserId, roleIds: roleIds}
            this.axios.post(this.api.updateUserRole,p).then(res => {
                if (res.data.code == 200) { 
                //console.log("修改成功")
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
                searchByKeys: {userName: that.filters.userName, userCode: that.filters.userCode},
                orderByKeys: {createTime: 'desc'}
            }
            // that.loading = true // show loading progress  
            that.axios.post(`${this.api.baseURL}/user/getPageUser`, params).then(res =>{
                //console.log(res);
                that.taskCateList = res.data.data.result.content;
                that.total = res.data.data.result.totalRecord;
                /*this.taskCateList = [
                    {id:'9e9a4a2320c44c70adc4572c87ae0824', userName:'AAAA', userCode: 'remark1'}, 
                    {id:'222', userName:'BBBB', userCode: 'remark2'}
                ]*/
            })

        },
        handleAddNew(){
            this.addFormVisible = true;
            this.addForm = {
                userName: "",
                userCode: ""
            }            
        },
        addSubmit: function(){
            let that = this
            this.$refs.addForm.validate((valid) =>{
                if(valid){
                    let para = Object.assign({}, this.addForm);
                    that.axios.post(`${this.api.baseURL}/user/createUser`, para).then(function(result){
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
                    console.log("参数："+para)
                    that.axios.post(`${this.api.baseURL}/user/updateUser`, para).then(function(result){
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
            this.$confirm('您确定要删除【' + row.userName + '】吗？', '提示', 
                {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'}).then(() => 
            {
                let that = this
                let p = {id: row.id};
                that.axios.post(`${this.api.baseURL}/user/deleteUser`, p).then(function(result){
                    console.log(result);
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
    }
}
</script>