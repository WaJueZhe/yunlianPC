<template>
    <el-row class="warp">
        <el-col :span="24" class="warp-breadcrum" style="padding:10px">
            <app-title :title="cuserListTitle"></app-title>
        </el-col>

        <el-col :span="24" class="warp-main" v-loading="loading" element-loading-text="拼命加载中">
            <!--工具条-->
            <el-col :span="24" style="padding-bottom: 0px;">
                <el-form :inline="true" :model="filters">
                    <el-form-item>
                        <el-input v-model="filters.userName" placeholder="姓名" :maxlength="20" style="min-width: 120px;"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-input v-model="filters.phone" placeholder="手机号" :maxlength="100" style="min-width: 120px;"></el-input>
                    </el-form-item>                 
                    <el-form-item><el-button type="primary" @click="handleSearch" @keyup.13="alert">查询</el-button></el-form-item>
                    <!-- <el-form-item><el-button type="primary" @click="handleAddNew">新增</el-button></el-form-item> -->
                    <el-form-item><el-button type="primary" @click="handleExport" :loading="exporting">导出</el-button></el-form-item>
                </el-form>
            </el-col>
        

            <!--列表-->
            <el-table :data="cUserList" v-loading="loading" style="width: 100%;" stripe fit border :resizable="false" class="cuserlistTable">
                <el-table-column prop="id" label="id" v-if="false"></el-table-column>
                <!-- 列显示转换 -->
                <el-table-column type="index" label="序号" align="center" width="50"></el-table-column>
                <el-table-column prop="userName" label="姓名" align="center">
                </el-table-column>
                <el-table-column prop="phone" label="手机号" align="center">
                </el-table-column>                                                                 
                <el-table-column prop="createDate" label="创建时间" align="center">
                </el-table-column>                
                <el-table-column label="操作" align="center" width="80">
                <template slot-scope="scope">
                    <el-button @click="showEditDialog(scope.$index,scope.row)">编辑</el-button>
                    <!-- <el-button type="warning" @click="delCUser(scope.$index,scope.row)" size="small">删除</el-button> -->
                </template>
                </el-table-column>
            </el-table>

            <!--工具条-->
            <el-col :span="24" class="toolbar">
                <el-pagination layout="total, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-size="limit" 
                            :total="total" background 
                            style="float:right;">
                </el-pagination>
            </el-col>

            <!--编辑弹出框-->
            <el-dialog title="编辑" :visible.sync ="editFormVisible" :close-on-click-modal="false" custom-class="myClass">
                <el-form :model="editForm" label-width="80px" :rules="addFormRules" ref="editForm">
                    <el-row :gutter="20">
                        <el-col :span="24">
                            <el-form-item label="姓名" prop="userName">
                                <el-input v-model="editForm.userName" auto-complete="off" placeholder="请输入姓名" :maxlength="20" class="addBox"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row :gutter="20">
                        <el-col :span="24">
                            <el-form-item label="手机" prop="phone">
                                <el-input v-model="editForm.phone" :maxlength="11" auto-complete="off" placeholder="请输入手机号" class="addBox" :disabled="true"></el-input>
                            </el-form-item>                            
                        </el-col>                        
                    </el-row>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click.native="cancelEditForm">取消</el-button>
                    <el-button type="primary" @click.native="editSubmit">提交</el-button>
                </div>
            </el-dialog>

            <!--编辑弹出框-->
            <el-dialog title="新增" :visible.sync ="addFormVisible" :close-on-click-modal="false" custom-class="myClass">
                <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
                    <el-row :gutter="20">
                        <el-col :span="24">
                            <el-form-item label="姓名" prop="userName">
                                <el-input v-model="addForm.userName" auto-complete="off" placeholder="请输入姓名" :maxlength="20" class="addBox"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row :gutter="20">
                        <el-col :span="24">
                            <el-form-item label="手机" prop="phone">
                                <el-input v-model="addForm.phone" :maxlength="11" auto-complete="off" placeholder="请输入手机号" class="addBox"></el-input>
                            </el-form-item>                            
                        </el-col>                        
                    </el-row>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click.native="cancelAddForm">取消</el-button>
                    <el-button type="primary" @click.native="addSubmit">提交</el-button>
                </div>
            </el-dialog>

        </el-col>

    </el-row>
</template>

</<script>
export default {
    data(){
        var checkMobile = (rule, value, callback) =>{
            const reg = /^1[3|4|5|7|8|9][0-9]{9}$/
            if (!reg.test(value)){
                callback(new Error('手机号码不正确!')) 
            }else {
                if ((this.addForm.phone != '') && (this.addFormVisible)){
                    let p = {phone: this.addForm.phone};
                    this.axios.post(`${this.api.baseURL}/sysCUser/findCUsersByPhone`, p).then(res =>{
                        //console.log(res);
                        if (parseInt(res.data.data.result) > 0){
                            callback(new Error('已存在相同的手机号码!'));
                        }else callback();
                    })
                }else callback();
            }
        }; 
        return{
            cuserListTitle: '个人用户管理',
            total: 0,
            page: 1,
            limit: 10,
            loading: false,
            exporting: false,
            addFormVisible : false,  //新增界面是否显示
            editFormVisible: false,
            filters: {},
            addForm: {},
            editForm: {},
            cUserList: [],
            addFormRules:{
                userName :[
                    {required: true, message : '输入姓名', trigger : 'blur'},
                    {min:2, max:10, message: '姓名长度应为2-10位', trigger: 'blur'},
                ],
                phone :[
                    {required: true, message : '输入手机号', trigger : 'blur'},
                    {validator: checkMobile, trigger: 'blur'}, //自定义校验
                ],
            }
        }
    },
    methods:{
        handleSearch(){
            this.total = 0;
            this.page = 1;
            this.search();
        },
        handleCurrentChange(val){
            this.page = val;
            this.search();
        },
        search(){
            let that = this;
            this.cUserList = [];
            let p = {pageNo: this.page, pageSize: this.limit, phone: this.filters.phone, userName: this.filters.userName};
            this.axios.post(`${this.api.baseURL}/sysCUser/findCUserList`, p).then(res =>{
                //console.log(res);
                if ((res.status == "200") && (res.data)){
                    if (res.data.code == "200"){
                        that.cUserList = res.data.data.cuserlist.records;
                        that.pages = res.data.data.cuserlist.pages;
                        that.total = res.data.data.cuserlist.total;
                    }else{
                        that.$message.error('查询无数据')
                    }
                }else{
                    that.$message.error('查询出错，请联系管理员');
                }
            });
        },
        showEditDialog(index, row){
            this.editFormVisible = true;
            this.editForm = Object.assign({}, row);
        },
        delCUser(index, row){
            this.$confirm('您确定要删除【' + row.addressCode + '】吗？', '提示', 
                {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'}).then(() => {
                    // do delete
                    alert('delete ...');
                });
        },
        handleAddNew(){
            this.addFormVisible = true;
            this.addForm = {};
        },
        handleExport(){
            let that = this;
            let p = {phone: this.filters.phone, userName: this.filters.userName};
            this.exporting = true;
            this.axios.post(`${this.api.baseURL}/sysCUser/exportCUserList`, p).then(res =>{
                //console.log(res);
                if ((res.status == "200") && (res.data)){
                    if (res.data.code == "200"){
                        let url = res.data.data.result;
                        if (url != ''){
                            this.$notify({title: '导出成功', dangerouslyUseHTMLString: true, message: '请点击<a href="' + url + '" class="blueFont"><b>【这里】</b></a>下载', duration: 0});
                        }
                    }else{
                        that.$message.error('查询无数据')
                    }
                }else{
                    that.$message.error('查询出错，请联系管理员');
                }
                that.exporting = false;
            });
        },
        cancelEditForm(){
            this.editFormVisible = false;
        },
        editSubmit(){
            let that = this;
            this.$refs.editForm.validate((valid) =>{
                if (valid){
                    let p = Object.assign({}, this.editForm);
                    that.axios.post(`${this.api.baseURL}/sysCUser/updateCUser`, p).then(res =>{
                        console.log(res);
                        if (res.status == "200"){
                            that.$message.success({showClose: true, message: '修改成功', duration: 2000});
                            that.editFormVisible = false;
                            that.handleSearch();
                        }else{
                            that.$message.error({showClose: true, message: '保存失败，请联系客服', duration: 2000});
                        }
                    });
                }
            });
        },
        cancelAddForm(){
            this.addFormVisible = false;
        },
        addSubmit(){
            let that = this;
            this.$refs.addForm.validate((valid) =>{
                if (valid){
                    let p = Object.assign({}, this.addForm);
                    that.axios.post(`${this.api.baseURL}/sysCUser/insertCUser`, p).then(res =>{
                        console.log(res);
                        if (res.status == "200"){
                            that.$message.success({showClose: true, message: '添加成功', duration: 2000});
                            that.addFormVisible = false;
                            that.handleSearch();
                        }else{
                            that.$message.error({showClose: true, message: '保存失败，请联系客服', duration: 2000});
                        }
                    });
                }
            });
        }
    },
    mounted(){
        this.handleSearch();
    },
}
</script>

<style>
.warp {
  padding-left: 2px;
  padding-right: 20px;
}
.blueFont {
  color: #409eff;
}
/* 子组件的长度有问题，再次覆盖该css，重新定义省市区级联输入的长度 */
.el-cascader {
  width: 70%;
}
.addBox {
  width: 70%;
}

.cuserlistTable .el-table__row .el-button {
  padding: 0;
  color: #409eff;
  border: none;
  padding-right: 3px;
}
</style>
