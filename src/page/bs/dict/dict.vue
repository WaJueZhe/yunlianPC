<template>
    <el-row class="warp" style="margin-bottom:50px;">
        <el-col :span="24" class="warp-breadcrum" style="padding:10px;">
            <app-title :title="dictListTitle"></app-title>
        </el-col>
                
        <el-col :span="24" class="warp-main" v-loading="loading" element-loading-text="拼命加载中">
            <!--工具条-->
            <el-col :span="24" style="padding-bottom: 0px;">
                <el-form :inline="true" :model="filters">
                    <el-form-item>
                        <el-input v-model="filters.type" placeholder="类型" style="min-width: 120px;" @keyup.enter.native="handleSearch"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-input v-model="filters.description" placeholder="描述" style="min-width: 120px;" @keyup.enter.native="handleSearch"></el-input>
                    </el-form-item>
                    <el-form-item>
                    <el-button type="primary" @click="handleSearch" @keyup.13="alert">查询</el-button>
                    </el-form-item>
                    <el-form-item>
                    <el-button type="primary" @click="handleAddNew">新增</el-button>
                    </el-form-item>                
                </el-form>

        
                <!--列表-->
                <el-table :data="dictList" highlight-current-row v-loading="loading" style="width: 100%;" stripe :border="true" class="dictTable">
                    <el-table-column type="index" label="序号" width="50" align="center">
                    </el-table-column>
                    <el-table-column prop="id" label="id" v-if="false" align="center"></el-table-column>   
                    <el-table-column prop="sort" label="sort" v-if="false"></el-table-column>                   
                    <el-table-column prop="value" label="键值" align="center" width="120" sortable>
                    </el-table-column>
                     <el-table-column prop="label" label="标签" align="center" sortable>
                    </el-table-column>
                     <el-table-column prop="type" label="类型" align="center" sortable>
                    </el-table-column>
                    <el-table-column prop="description" label="描述" align="center" sortable>
                    </el-table-column>
                      <el-table-column prop="sort" label="排序" align="center" width="100" sortable>
                    </el-table-column>
                    <el-table-column label="操作" width="100" align="center">
                    <template slot-scope="scope" >
                        <el-button @click="showEditDialog(scope.$index,scope.row)">编辑</el-button>
                        <el-button @click="delUser(scope.$index,scope.row)">删除</el-button>
                    </template>
                    </el-table-column>              
                </el-table>
            </el-col>

            <!--工具条-->
            <el-col :span="24" class="toolbar">            
                <el-pagination layout="total, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-size="limit" 
                            :total="total" background 
                            style="float:right;">
                </el-pagination>
            </el-col>

            <!--弹出框-->
            <el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false" custom-class="myClass">
                <el-form :model="addForm" label-width="100px" :rules="addFormRules" ref="addForm" label-position="right">
                  <el-form-item label="键值" prop="value" style="width:49%;display:inline-block;" >
                      <el-input v-model="addForm.value" auto-complete="off" style="width:70%"></el-input>
                  </el-form-item>
              
                  <el-form-item label="标签" prop="label" style="width:49%;display:inline-block;" >
                      <el-input v-model="addForm.label" auto-complete="off" style="width:70%"></el-input>
                  </el-form-item>                            

                  <el-form-item label="类型" prop="type" style="width:49%;display:inline-block;" >
                      <el-input v-model="addForm.type" auto-complete="off" style="width:70%"></el-input>
                  </el-form-item>
                  <el-form-item label="描述" prop="description" style="width:49%;display:inline-block;" >
                      <el-input v-model="addForm.description" auto-complete="off" style="width:70%"></el-input>
                  </el-form-item>
                  <el-form-item label="排序" prop="sort" style="width:49%;display:inline-block;" >
                      <el-input v-model="addForm.sort" auto-complete="off"  style="width:70%"></el-input>
                  </el-form-item>

                  <el-form-item label="备注" prop="remarks" style="width:49%;display:inline-block;" >
                      <el-input v-model="addForm.remarks" auto-complete="off" style="width:70%"></el-input>
                  </el-form-item>

                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click.native="addFormVisible = false">取消</el-button>
                    <el-button type="primary" @click.native="addSubmit">保存</el-button>
                </div>
            </el-dialog>

            <!--编辑框-->
            <el-dialog title="编辑" :visible.sync ="editFormVisible" :close-on-click-modal="false" custom-class="myClass">
                <el-form :model="editForm" label-width="100px" :rules="addFormRules" ref="editForm" label-position="right">
                    <el-form-item label="id" prop="id " style="width:49%;display:inline-block;" v-if="false">
                        <el-input v-model="editForm.id" auto-complete="off" style="width:70%" ></el-input>
                    </el-form-item>  
                    <el-form-item label="键值" prop="value " style="width:49%;display:inline-block;">
                        <el-input v-model="editForm.value" auto-complete="off" style="width:70%" ></el-input>
                    </el-form-item>         
                    <el-form-item label="标签" prop="label" style="width:49%;display:inline-block;">
                        <el-input v-model="editForm.label" auto-complete="off" style="width:70%"></el-input>
                    </el-form-item>
                    <el-form-item label="类型" prop="type" style="width:49%;display:inline-block;">
                        <el-input v-model="editForm.type" auto-complete="off" style="width:70%" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="描述" prop="description" style="width:49%;display:inline-block;">
                        <el-input v-model="editForm.description" auto-complete="off" style="width:70%"></el-input>
                    </el-form-item>
                    <el-form-item label="排序" prop="sort" style="width:49%;display:inline-block;">
                        <el-input v-model="editForm.sort" auto-complete="off" style="width:70%"></el-input>
                    </el-form-item>
                    <el-form-item label="备注" prop="remarks" style="width:49%;display:inline-block;">
                        <el-input v-model="editForm.remarks" auto-complete="off" style="width:70%"></el-input>
                    </el-form-item>                 
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
export default{    
    data(){    
        var checkSortNumber = (rule, value, callback) =>{
            const reg = /^\+?[1-9][0-9]*$/;
            if (!reg.test(value)){
                callback(new Error('排序应为正整数!')) 
            }else callback()
        };          
        return{ 
            dictListTitle:'字典管理',  
            dictList: [],
            filters:{
                type: '',
                value:'',
                label:'',
                description: "",
                sort: ""
            },
            
            total: 0,
            page: 1,
            limit: 8,
            loading: false,
            addFormVisible : false,  //新增界面是否显示
            importVisible: false, //导入界面是否显示 
            addForm: {
                value: "",
                label: "",
                type: "",
                description: "",
                sort: "",
                remarks: ""
            },
            addFormRules :{
                value :[
                    {required: true, message : '请输入键值', trigger : 'blur'}
                ],
                label:[
                    {required: true, message : '请输入标签', trigger : 'blur'}
                ],
                type:[
                    {required: true, message : '请输入类型', trigger : 'blur'}
                ],
                description:[
                    {required: true, message : '请输入描述', trigger : 'blur'}
                ],
                sort:[
                    {required: true, message : '请输入排序值', trigger : 'blur'},
                    {validator: checkSortNumber, trigger: 'blur'}
                ]
            },            
            editFormVisible: false,
            editForm: {
                id: "",
                // value: "",
                // label: "",
                // type: "",
                // description: "",
                // sort: "",
                // remarks: ""           
            },
            importForm: {},
            importFormRules: {}
        }
    },
    methods:{
        cancelEditForm: function(){
            this.editFormVisible = false;
            this.$refs['editForm'].resetFields();
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
                searchByKeys: {type: that.filters.type, description: that.filters.description},
                orderByKeys: {createDate: 'desc'}
            }
            that.axios.post(`${this.api.baseURL}/dict/findPage`, params).then(res =>{
                if(res.data.code == 200){
                    that.dictList = res.data.data.result.content;
                    that.total = res.data.data.result.totalRecord;
                }else{
                    that.$message.error({showClose: true, message: res.data.message, duration: 4000});
                }
            })
        },
        handleAddNew(){
            this.addFormVisible = true;
            this.addForm = {
                value: "",
                label: "",
                type: "",
                description: "",
                sort: "",
                remarks: ""
            }            
        },
        addSubmit: function(){
            let that = this
            this.$refs.addForm.validate((valid) =>{
                if(valid){
                    let para = Object.assign({}, this.addForm);                  
                    that.axios.post(`${this.api.baseURL}/dict/create`, para).then(function(result){                      
                        if ((result) && (result.status == '200')){ //保存成功
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
                  
                    that.axios.post(`${this.api.baseURL}/dict/update`, para).then(function(result){
                        //console.log(result);
                        if ((result) && (result.status == '200')){ //修改成功
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
        delUser(index, row){
            this.$confirm('您确定要删除【' + row.value + '】吗？', '提示', 
                {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'}).then(() => 
            {
                let that = this
                let p = {id: row.id,
                    type: row.type,
                    value: row.value,
                    label: row.label
                };
                that.axios.post(`${this.api.baseURL}/dict/delete`, p).then(function(result){
                    //console.log(result);
                    if ((result) && (result.status == '200')){ //删除成功
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
    var self = this;
    document.onkeydown = function(e) {
      var key = e.which;
      if (key == 13) {
        self.handleSearch();
      }
    };
  },
}
</script>
<style lang="less" scoped>
.warp{
  padding-left: 2px;
  padding-right: 20px;
}

.dictTable .el-table__row .el-button {
  padding: 0;
  color: #409eff;
  border: none;
  padding-right: 3px;
}
</style>
