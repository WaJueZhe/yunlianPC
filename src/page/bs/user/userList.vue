<template>
    <el-row class="warp" style="margin:5px;">

        <el-col :span="24" class="warp-breadcrum">
            <app-title :title="userTitle"></app-title>
        </el-col>

        <el-col :span="24" class="warp-main" v-loading="loading" element-loading-text="拼命加载中">
            <!--工具条-->
            <el-col :span="24" style="padding-bottom: 0px;margin-left:17%;">
                <el-form :inline="true" :model="filters">
                    <el-form-item>
                        <el-input v-model="filters.userName" placeholder="姓名" style="min-width: 120px;"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-input v-model="filters.userCode" placeholder="登录名" style="min-width: 120px;"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="handleSearch" @keyup.13="alert">查询</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="handleAddNew">新增</el-button>
                    </el-form-item>
                    <el-form-item>
                      <el-button type="primary" @click="addMenberAlready">添加已有成员</el-button>
                    </el-form-item>
                    <el-form-item>
                      <el-button  @click="handleAuth">批量认证</el-button>
                    </el-form-item>
                </el-form>
            </el-col>

            <div class="custom-tree-container">
              <div class="block">
                <div class="block-top">
                  <span>&nbsp;部门组织</span>
                  <div class="icon">
                    <i class="el-icon-circle-plus-outline" @click="addDepartment" title="新增部门"></i>
                    <i class="el-icon-remove-outline" @click="delDepartment" title="删除部门"></i>
                    <i class="el-icon-edit" @click="updateDepartment" title="编辑部门"></i>
                  </div>
                </div>
                <el-tree
                  :data="data4"
                  node-key="id"
                  ref="treeDepts"
                  default-expand-all
                  :highlight-current = "true"
                  :expand-on-click-node="false"
                  :render-content="renderContent"
                  @node-click="deptNodeClick"
                  >
                </el-tree>
              </div>
            </div>

            <!--添加已有成员弹出框-->
            <el-dialog
              :title="'增加部门人员：' + detailView.departmentName"
              :visible.sync="addMenberFormVisible" :close-on-click-modal="false" class="addMenber" custom-class="myClass">
                <div class="menber">
                  <div class="menber-left">
                    <div class="l-tit">请选择新的部门：</div>
                    <div class="l-content">
                      <el-tree
                      :data="data5"
                      node-key="id"
                      ref="treeMemberDepts"
                      highlight-current
                      :expand-on-click-node="false"
                      default-expand-all
                      @node-click="changeDeptNodeClick"
                      >
                </el-tree>
                    </div>
                  </div>
                  <div class="menber-middle">
                    <div class="m-content">
                      <div class="m-top">
                        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                        <div style="margin: 15px 0;"></div>
                        <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
                          <el-checkbox v-for="(city, index) in cities" :label="city" :key="index">{{city.name}}</el-checkbox>
                        </el-checkbox-group>
                      </div>
                    </div>
                  </div>
                  <div class="menber-right">
                    <div class="r-tit">已选成员：</div>
                    <div class="r-content">
                      <div class="r-item" v-for="(item, index) in selectList" :key="index">
                        <div class="r-name">
                          <span>{{item.name}}</span>
                          <i class="el-icon-close" @click="delmenber(index)"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button @click.native="addMenberFormVisible = false">取消</el-button>
                    <el-button type="primary" @click.native="submitAddMember">保存</el-button>
                </div>
            </el-dialog>

            <!--弹出框 添加部门 -->
            <el-dialog title="添加部门" :visible.sync="addDeptFormVisible" :close-on-click-modal="false" class="addSection" custom-class="myClass">
                <el-form :model="addDeptForm" :rules="addDeptFormRules" ref="addDeptForm" label-position="right">
                  
                  <el-row :gutter="10">
                    <el-col :span="24">
                        <el-form-item label="上级部门" prop="parentDepName">
                            <el-input v-model="addDeptForm.parentDepId" v-if="false" auto-complete="off" placeholder="上级部门id"></el-input>
                            <el-input v-model="addDeptForm.parentDepName" :disabled="true" auto-complete="off" placeholder="上级部门名称"></el-input>
                        </el-form-item>
                    </el-col>
                  </el-row>

                  <el-row :gutter="10">
                    <el-col :span="24">
                        <el-form-item label="部门名称" prop="departmentName">
                            <el-input v-model="addDeptForm.departmentName" :maxlength="20" auto-complete="off" placeholder="请输入部门名称"></el-input>
                        </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="10">
                    <el-col :span="24">
                        <el-form-item label="排序号(排序号越小，部门树排名越靠上）" prop="sortNo">
                            <el-input v-model.number="addDeptForm.sortNo" auto-complete="off" placeholder=""></el-input>
                        </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click.native="addDeptFormVisible = false">取消</el-button>
                    <el-button type="primary" @click.native="addDeptSubmit">保存</el-button>
                </div>
            </el-dialog>

            <!-- 编辑弹出框 -->
            <el-dialog title="编辑部门" :visible.sync="updateDeptFormVisible" :close-on-click-modal="false" class="updateSection" custom-class="myClass">
                <el-form :model="updateDeptForm" :rules="updateDeptFormRules" ref="updateDeptForm" label-position="right">
                  <el-row :gutter="10">
                    <el-col :span="24">
                        <el-form-item label="部门名称" prop="departmentName">
                          <el-input v-model="updateDeptForm.id" v-if="false" auto-complete="off" placeholder="当前部门id" ></el-input>
                          <el-input v-model="updateDeptForm.departmentName" :maxlength="20" auto-complete="off" placeholder="请输入部门名称"></el-input>
                        </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="10">
                    <el-col :span="24">
                        <el-form-item label="排序号(排序号越小，部门树排名越靠上）" prop="sortNo">
                            <el-input v-model.number="updateDeptForm.sortNo" auto-complete="off" placeholder=""></el-input>
                        </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click.native="updateDeptFormVisible = false">取消</el-button>
                    <el-button type="primary" @click.native="updateDeptSubmit">保存</el-button>
                </div>
            </el-dialog>
        
            <!--列表-->
            <el-table :data="taskCateList" highlight-current-row v-loading="loading" @selection-change="selectionChange"  class="table" stripe :border="true">
              
                <el-table-column type="selection" prop="id" :selectable='checkboxInit' ></el-table-column>

                <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>

                <el-table-column prop="id" label="id" v-if="false"></el-table-column>

                <el-table-column prop="customerOrgId" label="customerOrgId" v-if="false"></el-table-column>

                <el-table-column prop="userCode" label="登录名" align="center"></el-table-column>

                <el-table-column prop="id" label="id" v-if="false"></el-table-column>

                <el-table-column prop="userName" label="姓名" align="center" width="80"></el-table-column>

                <el-table-column prop="userRolesName" label="所属角色" align="center"></el-table-column>

                <el-table-column prop="phone" label="手机号码" align="center"></el-table-column>

                <!-- <el-table-column prop="email" label="邮箱" min-width="10%" align="center"></el-table-column> -->

                <!-- <el-table-column prop="identity" label="身份证号码" min-width="10%" align="center" sortable></el-table-column> -->

                <el-table-column prop="modifyTime" label="修改时间" align="center" sortable></el-table-column>

                <!-- <el-table-column prop="createTime" label="创建时间" min-width="10%" align="center" sortable></el-table-column> -->
                
              <el-table-column prop="isVerified" label="认证状态" align="center" width="80">
                <template slot-scope="scope">
                    <p>{{ scope.row.isVerified | authFormate}}</p>
                </template>
              </el-table-column>

                <el-table-column prop="bcStatus" label="上链状态" align="center" width="80" :formatter="formatBcStatus"></el-table-column>
                <el-table-column label="操作" width="160" fixed="right" align="center">
                  <template slot-scope="scope">
                      <el-button @click="showEditDialog(scope.$index,scope.row)" title="编辑用户信息">编辑</el-button>
                      <el-button @click="queryUserRoleFun(scope.row)" title="分配角色">角色</el-button>
                              
                      <el-button @click="authentication(scope.$index,scope.row)" v-if="scope.row.isVerified != 1" title="用户实名认证">认证</el-button>
                      <el-button v-else :disabled="true" title="已认证">认证</el-button>

                      <el-button @click="del(scope.$index,scope.row)" title="删除用户">删除</el-button>
                  </template>
                </el-table-column>
            </el-table>

            <!--分页-->
            <el-col :span="24" class="toolbar">
                <el-pagination  layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="limit" :total="total" background style="float:right;"></el-pagination>
            </el-col>

            <!--新增弹出框-->
            <el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false" custom-class="myClass">
                <el-form :model="addForm" :rules="addFormRules" ref="addForm" label-width="100px" label-position="right">

                  <!-- 第一行 -->
                    <el-row :gutter="10">
                        <el-col :span="12">
                            <el-form-item label="登录名" prop="userCode" style="width:90%;display:inline-block">
                                <el-input v-model="addForm.userCode" style="100%" :maxlength="7"  auto-complete="off" placeholder="登录名"></el-input>
                            </el-form-item>
                            <span>{{customerOrgSuffix}}</span>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="姓名" prop="userName">
                                <el-input v-model="addForm.userName" style="70%" auto-complete="off" placeholder="姓名"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>

                  <!-- 第二行 -->
                    <el-row :gutter="10">
                      <el-col :span="12">
                          <el-form-item label="性别" prop="sex">
                              <el-select v-model="addForm.sex" placeholder="性别" style="width:100%">
                                  <el-option v-for="i in sexTypeEnum" :key="i.val" :label="i.lbl" :value="i.val"></el-option>
                              </el-select>
                          </el-form-item>
                      </el-col>
                      <el-col :span="12">
                          <el-form-item label="手机" prop="phone">
                              <el-input v-model="addForm.phone" :maxlength="11" auto-complete="off" placeholder="手机"></el-input>
                          </el-form-item>
                      </el-col>
                    </el-row>

                  <!-- 第三行 -->
                    <el-row :gutter="10">
                        <el-col :span="12">
                          <el-form-item label="证件类型" prop="identityType" style="width:100%">
                                <el-select v-model="addForm.identityType" placeholder="证件类型" style="width:100%">
                                    <el-option v-for="i in identityTypeEnum" :key="i.val" :label="i.lbl" :value="i.val"></el-option>
                                </el-select>
                          </el-form-item>
                        </el-col>
                        <el-col :span="12">
                          <el-form-item label="证件号" prop="identity">
                              <el-input v-model="addForm.identity" :maxlength="18" auto-complete="off" placeholder="证件号"></el-input>
                          </el-form-item>
                        </el-col>
                    </el-row>

                    <!-- 第四行 -->
                    <el-row :gutter="10">
                      <el-col :span="12">
                        <el-form-item label="邮箱" prop="email"
                            :rules="[
                                { required: false, message: '请输入邮箱地址', trigger: 'blur' },
                                { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur,change' }
                              ]">
                            <el-input v-model="addForm.email" auto-complete="off" placeholder="邮箱"></el-input>
                          </el-form-item>   
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="描述" prop="noti">
                            <el-input v-model="addForm.noti" auto-complete="off" placeholder="描述"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>

                    <!-- 无用字段? -->
                    <el-form-item label="用户类型" prop="userType" v-if="false">
                        <el-select v-model="addForm.userType" placeholder="用户类型" style="width:70%">
                            <el-option v-for="i in userTypeEnum" :key="i.val" :label="i.lbl" :value="i.val"></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="状态" prop="status" v-if="false" >
                        <el-input v-model="addForm.status" auto-complete="off" placeholder="请选择状态1启用，0停用"></el-input>
                    </el-form-item>

                    <el-form-item label="地址" prop="address" v-if="false">
                        <el-input v-model="addForm.address" auto-complete="off" placeholder="地址"></el-input>
                    </el-form-item>
                </el-form>
                <!-- 按钮 -->
                <div slot="footer" class="dialog-footer">
                    <el-button @click.native="addFormVisible = false">取消</el-button>
                    <el-button type="primary" @click.native="addSubmit">保存</el-button>
                </div>
            </el-dialog>

            <!-- 编辑弹框 -->
            <el-dialog title="编辑" :visible.sync ="editFormVisible" :close-on-click-modal="false" custom-class="myClass">
                <el-form :model="editForm" label-width="100px" :rules="updateFormRules" ref="editForm" label-position="right">
                  <input type="hidden" v-model="editForm.id"/>
                  <!-- 第一行 -->
                  <el-row :gutter="10">
                    <el-col :span="12">
                      <el-form-item label="登录名" prop="userCode">
                          <el-input v-model="editForm.userCode" auto-complete="off" :disabled="true"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="姓名" prop="userName">
                          <el-input v-model="editForm.userName" auto-complete="off" ></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <!-- 第二行 -->
                  <el-row :gutter="10">
                    <el-col :span="12">
                      <el-form-item label="手机" prop="phone">
                          <el-input v-model="editForm.phone" :maxlength="11" auto-complete="off" ></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="邮箱" prop="email"
                          :rules="[
                              { required: false, message: '请输入邮箱地址', trigger: 'blur' },
                              { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur,change' }
                            ]">
                          <el-input v-model="editForm.email" auto-complete="off" placeholder="邮箱"></el-input>
                        </el-form-item>  
                    </el-col>
                  </el-row>
                  <!-- 第三行 -->
                  <el-row :gutter="10">
                    <el-col :span="12">
                      <el-form-item label="证件类型" prop="identityType" >
                          <el-select v-model="editForm.identityType" placeholder="证件类型" style="width:100%" >
                              <el-option v-for="i in identityTypeEnum" :key="i.val" :label="i.lbl" :value="i.val"></el-option>
                          </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="证件号" prop="identity">
                          <el-input v-model="editForm.identity" :maxlength="18" auto-complete="off" ></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <!-- 第四行 -->
                  <el-row :gutter="10">
                    <el-col :span="12">
                      <el-form-item label="性别" prop="sex">
                          <el-select v-model="editForm.sex" placeholder="性别" style="width:100%">
                              <el-option v-for="i in sexTypeEnum" :key="i.val" :label="i.lbl" :value="i.val"></el-option>
                          </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="微信openid " prop="wxOpenid">
                          <el-input v-model="editForm.wxOpenid" auto-complete="off"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <!-- 第五行 -->
                  <el-row :gutter="10">
                    <el-col :span="12">
                      <el-form-item label="地址" prop="address">
                          <el-input v-model="editForm.address" auto-complete="off"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="描述" prop="noti">
                          <el-input v-model="editForm.noti" auto-complete="off" placeholder="描述"></el-input>
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

                </el-form>
                <div slot="footer" class="dialog-footer">
                <el-button @click.native="cancelEditForm">取消</el-button>
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
                <el-tree :data="roleTreeData" show-checkbox default-expand-all node-key="id" ref="tree" :default-checked-keys=defaultCheckedKeys :props="defaultProps">

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
let id = 1000;
let currentUpdateUserId  = "" //当前修改角色权限 组的用户id
let currentDeptNode_data = null; // 当前部门节点数据
let currentDeptNode_node = null; // 当前部门节点node
let currentDeptNode_id = null; // 当前部门节点id
let set = new Set([]);
export default {
  data() {
    const data = [];
    
    //在此自定义校验，如新录入数据，在输入后校验后台是否重复
    var checkExistsCateDesc = (rule, value, callback) => {
      if (this.addForm.userCode != "") {
        let p = {userCode: this.addForm.userCode};
        this.axios.post(`${this.api.baseURL}/user/getCountByUserCode`, p)
          .then(res => {
            if(res.data.data.result == undefined){
              this.$message.error({showClose: true, message: '添加发生异常,确认客户是否已经被删除', duration: 4000});
            }
            else if (parseInt(res.data.data.result) > 0) {
              callback(new Error("已存在相同的用户登录名!"));
            } else {
              callback();
            }
          });
      } else callback(); //空值则默认成功
    };
    var checkExistsPhoneDesc = (rule, value, callback) => {
      if (this.addForm.phone != "") {
        if (isNaN(this.addForm.phone)) {
          callback(new Error("手机号必须为数字!"));
        }else if(this.addForm.phone.indexOf("1") != 0) {
          callback(new Error("手机号必须以1开始!"));
        }else {
          let p = {phone: this.addForm.phone};
          this.axios.post(`${this.api.baseURL}/user/getCountByPhone`, p)
            .then(res => {
              console.log("返回结果："+res.data.data.result)
              if ( res.data.data.result && parseInt(res.data.data.result) > 0) {
                callback(new Error("手机号已经存在!"));
              } else {
                console.log("修改操作，查询手机返回:"+res.data.message);
                // 未知错误，也不处理，直接过了。新增加的后台方法，也判断手机号了。
	              callback(); //空值则默认成功
              }
            });
        }
      } else {
        callback(); //空值则默认成功
      }
    };
    var checkExistsPhoneDescUpdate =  (rule, value, callback) => {
      if (this.editForm.phone != "") {
        if (isNaN(this.editForm.phone)) {
          callback(new Error("手机号必须为数字!"));
        }else if(this.editForm.phone.indexOf("1") != 0) {
          callback(new Error("手机号必须以1开始!"));
        }else {
          let p = {id: this.editForm.id, phone: this.editForm.phone};
          this.axios.post(`${this.api.baseURL}/user/getCountByPhoneAndUserId`, p)
            .then(res => {
              console.log("返回结果："+res.data.data.result)
              if(res.data.data.result && parseInt(res.data.data.result) > 0){
                callback(new Error(res.data.message));
              } else {
                console.log("修改操作，查询手机返回:"+res.data.message);
                // 未知错误，也不处理，直接过了。修改的后台方法，也判断手机号了。
	              callback(); //空值则默认成功
              }
            });
        }
      } else {
        callback(); //空值则默认成功
      }
    };
    var checkExistsUserIdentity = (rule, value, callback) => {
      let reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        if(reg.test(value) === false){
            callback(new Error("您输入的身份不合法"));
        }else{
          // 后台校验 
          let pa = {idCard: value};
          this.axios.post(`${this.api.baseURL}/common/checkIdCardFormat`, pa)
          .then(res => {
              if (!res.data.data.result) {
                  //后台校验不合法
                  callback(new Error("您输入的身份不正确"));
              } else {
                  callback();
              }
          });
          // let arr = [...value];
          // let preArr = arr.slice(0, 4);
          // let afterArr = arr.slice(-4);
          // let midArr = arr.slice(4, arr.length - 4);
          // midArr = midArr.map(function () {
          //   return '*';
          // });
          // let result = preArr.concat(midArr, afterArr);
          // return result.join('');
      }
      
    };

    //添加部门的修改规则
    var checkAge = (rule, value, callback) => {
      ///console.log('值为：'+value)
        if (!value) {
          return callback(new Error('请输入正整数排序号'));
        }
        setTimeout(() => {
          if (!Number.isInteger(value) || value < 0) {
            callback(new Error('请输入正整数排序号'));
          } else {
            callback();
          }
        }, 1000);
      };

    // //修改部门的修改规则
    // var amendAge = (rule, value, callback) => {
    //   console.log('值为：'+value)
    //     if (!value) {
    //       return callback(new Error('排序号不能为空'));
    //     }
    //     setTimeout(() => {
    //       if (!Number.isInteger(value)) {
    //         callback(new Error('请输入正整数'));
    //       } else {
    //         callback();
    //       }
    //     }, 1000);
    //   };

    return {
      detailView: {
        departmentName: ""
      },
      checkAll: false,
      checkedCities: [],
      cities: {}, //{'上海':'10', '北京':'11', '广州':'12', '深圳':'13', '东莞':'14', '佛山':'15'},
      isIndeterminate: false,

      selectList:[],
      cityArr: [],//获取对象中内容的数组
      idArr: [],//获取对象中id的数组

      data4: JSON.parse(JSON.stringify(data)),
      data5: JSON.parse(JSON.stringify(data)),

      bcInfoKey:'',//区块链指
      bcHash:'',//区块哈希值
      userTitle: "用户管理",
      taskCateList: [],
      filters: {
        userName: "",
        userCode: "",
        createTime: ""
      },
      customerOrgSuffix:"",
      total: 0,
      page: 1,
      limit: 10,
      loading: false,
      addFormVisible: false,    //新增界面是否显示
      addDeptFormVisible: false,     //部门增加界面是否显示
      updateDeptFormVisible: false, //部门编辑界面是否显示
      addMenberFormVisible: false,            //调整部门界面是否显示
      addFormRules: {
        userName: [
          { required: true, message: "请输入名称", trigger: "blur" },
          { min: 2, max: 60, message: "必须输入2-60个字", trigger: "blur" }
        ],
        userCode: [
          { required: true, message: "登录帐号", trigger: "blur" },
          { max: 7, message: "登录帐号长度不能大于7位", trigger: "blur" },
          { validator: checkExistsCateDesc, trigger: "blur" } //自定义校验
        ],
        identity: [
          { required: true, message: "请输入身份证", trigger: "blur" },
          { min: 15, max: 18, message: "身份证长度15-18位", trigger: "blur" },
          { validator: checkExistsUserIdentity, trigger: "blur" } //自定义校验
        ],
        sex: [{ required: true, message: "请选择性别", trigger: "blur" }],
        phone: [
          { required: true, message: "请选输入手机号", trigger: "blur" },
          { min: 11, max: 11, message: "手机号码错误,11位手机号", trigger: "blur" },
          { validator: checkExistsPhoneDesc, trigger: "blur" } //自定义校验
        ],
        identityType: [
          { required: true, message: "请选择证件类型", trigger: "blur" }
        ]
      },
      addDeptFormRules: {
        sortNo: [
            { validator: checkAge, trigger: 'blur' }
          ],
        departmentName: [
           { min: 1, max: 16, message: "部门名称最大16位", trigger: "blur" },
           { required: true, message: "请输入部门名称", trigger: "blur" }
          ]
      },
      updateDeptFormRules: {
        sortNo: [
            { validator: checkAge, trigger: 'blur' }
          ],
        departmentName: [
           { min: 1, max: 16, message: "部门名称最大16位", trigger: "blur" },
           { required: true, message: "请输入部门名称", trigger: "blur" }
          ]
      },
      updateFormRules: {
        userName: [
          { required: true, message: "请输入名称", trigger: "blur" },
          { min: 2, max: 60, message: "必须输入2-60个字", trigger: "blur" }
        ],
        sex: [{ required: true, message: "请选择性别", trigger: "blur" }],
        identityType: [
          { required: true, message: "请选择证件类型", trigger: "blur" }
        ],
        phone: [
          { required: true, message: "请选输入手机号", trigger: "blur" },
          { min: 11, max: 11, message: "手机号码错误,11位手机号", trigger: "blur" },
          { validator: checkExistsPhoneDescUpdate, trigger: "blur" } //自定义校验
        ]
      },
      addForm: {
        userName: "",
        userCode: "",
        status: "1"
      },
      addDeptForm: {
        departmentName:"",
        sortNo:'',
        parentDepId:""
      },
      updateDeptForm: {
        id:"",
        departmentName:"",
        sortNo:''
      },
      editFormVisible: false,
      editForm: {
        id: "",
        userName: "",
        userCode: "",
        status: "1"
      },
      roleTreeData: [],
      defaultProps: {
        children: "children",
        label: "roleName"
      },
      dialogVisible: false,
      defaultCheckedKeys: [],
      sexTypeEnum: [{ val: "1", lbl: "男" }, { val: "2", lbl: "女" }], //定义下拉框的options
      identityTypeEnum: [{ val: "0", lbl: "身份证" }],
      statusEnum:  [{val: '1', lbl: '启用'}, {val: '0', lbl: '停用'}],
      userTypeEnum: [{ val: "1", lbl: "企业" }, { val: "2", lbl: "个体" }]
    };
  },
  filters: {
    authFormate: function(value) {
      let ret = "";
      switch (value) {
        case 0:
          ret = "待认证";
          break;
        case 1:
          ret = "已认证";
          break;
        case 2:
          ret = "认证失败";
          break;
        default:
          break;
      }
      return ret;
    }
  },
  methods: {
    submitAddMember(){
      let deptUserIds = [];
      for(let i=0;i<this.selectList.length;i++){
        deptUserIds.push(this.selectList[i].id)
      }
      this.idArr = deptUserIds;
      console.log(this.idArr)
      let that = this;
      let p = { deptId: that.currentDeptNode_id,
                userIds: that.idArr
              };
              //console.log(JSON.stringify(p))
               
      this.axios.post(`${this.api.baseURL}/depUser/addDeptUsers`, p).then(res => { 
          if (res.data.code == 200) {
            that.$message.success({
              showClose: true,
              message: "添加成功",
              duration: 2000
            });
            // 
            that.selectList = [];
            that.cityArr = [];
            that.checkedCities = [];
            that.checkAll = false;
            that.isIndeterminate = false;
            that.addMenberFormVisible = false;
          }else if(res.data.code == 400){
            that.$message.error({showClose: true, message: res.data.message , duration: 4000});
          }else{
            console.log(res.data.message)
            that.$message.error({showClose: true, message: "系统错误，联系管理员" , duration: 4000});
          }
      })
    },
      getDepts(){
        let that = this;
        let p = {id: ""};
        this.axios.post(`${this.api.baseURL}/department/getChildDepts`, p).then(res => {
            //console.log("that.defaultCheckedKeys = " +JSON.stringify(res.data.data.result))
            if (res.data.code == 200) {
              //console.log("返回数据："+res.data.data.result)
              that.data4 =  res.data.data.result;
              if(res.data.data.result && res.data.data.result.length > 0){ // 至少都会返回一个机构根节点数据 
                this.currentDeptNode_id = res.data.data.result[0].id ; // 查询用户、删除用户、增加用户，都可以只用到这个判断就可以，但增加部门、删除部门、修改部门必须要判断到树的节点数据，因为要更新页面的树
                this.handleSearch();
              }
              
            }else if(res.data.code == 400){
              that.$message.error({showClose: true, message: res.data.message , duration: 4000});
            }else{
              //console.log(res.data.message)
              that.$message.error({showClose: true, message: "系统错误，联系管理员" , duration: 4000});
            }
        })
      },
      
   //删除已选成员
  delmenber(index){
    this.selectList.splice(index,1);
    this.checkedCities.splice(index,1);
    this.checkAll = this.selectList === this.cities.length;
    this.isIndeterminate = this.selectList.length > 0 && this.selectList.length < this.cities.length;
    },
    //添加成员选择框
    handleCheckAllChange(val) {
    this.checkedCities = val ? this.cities.slice(0) : [];
    this.isIndeterminate = false;
    this.selectList = val ? this.cities.slice(0) : [];
    },
    handleCheckedCitiesChange(value) {
    let checkedCount = value.length;
    this.checkAll = checkedCount === this.cities.length;
    this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
    this.selectList = value.slice(0);
  },
    deptNodeClick(clickNode_data,node,vueComponent){
      // console.log("进入 deptNodeClick 方法")
      // console.log(clickNode_data)
      // console.log(node)
      // console.log(vueComponent)

      let all_el = document.getElementsByClassName('el-tree-node__content')      
      for(var i=0; i< all_el.length;i++){
        all_el[i].style.background = ''
        all_el[i].style.borderBottom = ''
        console.log(all_el[i].style.background)
      }      
      // vueComponent.$el.childNodes[0].style.color = '#a9cffb'
      // vueComponent.$el.childNodes[0].style.color = '#409EFF' 
      vueComponent.$el.childNodes[0].style.background = '#a9cffb' 
      vueComponent.$el.childNodes[0].style.borderBottom = '1px solid #7a85d8' 

      this.currentDeptNode_data = clickNode_data
      this.currentDeptNode_node = node
      this.currentDeptNode_id = this.$refs.treeDepts.getCurrentKey() // 查询用户、删除用户、增加用户，都可以只用到这个判断就可以，但增加部门、删除部门、修改部门必须要判断到树的节点数据，因为要更新页面的树

      this.addDeptForm.parentDepId = this.currentDeptNode_id // 当前增加 节点的父节点 id
      this.addDeptForm.parentDepName = this.$refs.treeDepts.getCurrentNode().label // 当前增加 节点的父节点 名称
      
      this.updateDeptForm.id = this.$refs.treeDepts.getCurrentNode().id // 当前修改当前部门的id
      this.updateDeptForm.departmentName = this.$refs.treeDepts.getCurrentNode().label // 当前修改当前部门的名称 
      
      this.detailView.departmentName = this.$refs.treeDepts.getCurrentNode().label // 部门人员修改 显示部门名称

      // 查询部门的用户
      this.search();
    },
    
    changeDeptNodeClick(){
        let that = this;
        // 查询的部门，不是增加的部门
        let p = {deptId: this.$refs.treeMemberDepts.getCurrentKey()};
        this.axios.post(`${this.api.baseURL}/depUser/getDeptAllUsers`, p).then(res => {
            if (res.data.code == 200) { 
              //console.log("that.defaultCheckedKeys = " +JSON.stringify(res.data.data.result)) 
              that.cities = res.data.data.result;
            }else{
              alert(res.data.message)
            }
        })  
    },
    append(currentNode_data, id, name) {
      let data = currentNode_data;// 当前节点
      const newChild = { id: id, label: name, children: [] }
      if (!data.children) {
        this.$set(data, 'children', []);
      }
      data.children.push(newChild);
    },
    removeDept(node, data) {
      //console.info("进入 remove 方法")
      //console.table(node)
      //console.table(data)

      const parent = node.parent;
      const children = parent.data.children || parent.data;
      const index = children.findIndex(d => d.id === data.id);
      children.splice(index, 1);
    },
    renderContent(h, { node, data, store }) {
      console.log(" 进入 renderContent 方法 = "+data)
      console.table(data)
      console.table(node)
      return (
        <span class="custom-tree-node" style="width:100%;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;">
          <span style="font-size: 14px;">{node.label} </span>
        </span>
        );
    },
    clearCurrentDeptData(){
      //console.log("进入 clearCurrentDeptData 方法，清空当前部门的页面数据")
      this.currentDeptNode_data = null; // 当前部门节点数据
      this.currentDeptNode_node = null; // 当前部门节点node
      this.currentDeptNode_id = null; // 当前部门节点id 

      this.addDeptForm.parentDepName = "" // 部门增加页面的上级部门名称
      this.addDeptForm.parentDepId = "" // 部门增加页面的上级部门id
      
      this.updateDeptForm.id = "" // 部门修改页面的当前部门id
      this.updateDeptForm.departmentName = "" // 部门修改页面的当前部门名称

      this.detailView.departmentName = "" // 部门人员修改 显示部门名称
      //console.log("this.currentDeptNode_data = " + this.currentDeptNode_data)
      //console.log("this.currentDeptNode_node = " + this.currentDeptNode_node)
      //console.log("this.currentDeptNode_id = " + this.currentDeptNode_id)
      //console.log("this.addDeptForm.parentDepName = " + this.addDeptForm.parentDepName)
      //console.log("this.addDeptForm.parentDepId = " + this.addDeptForm.parentDepId)
      //console.log("this.updateDeptForm.id = " + this.updateDeptForm.id)
      //console.log("this.updateDeptForm.departmentName = " + this.updateDeptForm.departmentName)
    },
    cancelEditForm: function(){
        this.editFormVisible = false;
        this.$refs['editForm'].resetFields();
    }, 
    formatBcStatus: function(row, column){
      return (row.bcStatus && row.bcStatus == "1") ? "已上链" : "上链中";
    },    
    queryUserRoleFun(row) {
      currentUpdateUserId = row.id;
      this.dialogVisible = true;
      let that = this;
      that.roleTreeData = [];
      that.defaultCheckedKeys = [];
      let p = {userId:  row.id};
      this.axios.post(this.api.queryUserRole, p).then(res => {
        if (res.data.code == 200) {
          that.roleTreeData = res.data.data.customerRole;
          that.defaultCheckedKeys = res.data.data.userRole;
          //console.log("that.defaultCheckedKeys = " + res.data.data.userRole);
        } 
        // else {
        //   alert(res.data.message);
        // }
      });
    },
    //修改用户角色组
    updateUserRoleFun() {
      //params.append("userId", currentUpdateUserId);
      //console.log("currentUpdateUserId = " + currentUpdateUserId);
      let roleIds = new Array(this.$refs.tree.getCheckedKeys());
      //console.log("roleIds = " + roleIds);
      //params.append("roleIds", roleIds);
      let p = {userId: currentUpdateUserId, roleIds: this.$refs.tree.getCheckedKeys()};
      this.axios.post(this.api.updateUserRole, p).then(res => {
        if (res.data.code == 200) {
          //console.log("修改成功");
          this.dialogVisible = false;
          this.search();
        } else {
          alert("修改失败：" + res.data.message);
        }
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
    handleCurrentChange(val) {
      this.page = val;
      this.search();
    },
    search: function() {
      
      if(this.currentDeptNode_id == null || this.currentDeptNode_id == "" ){
        this.$message.error({showClose: true, message: '请先点击选择部门', duration: 4000});
        return ;
      }

      let searchDeptId = this.currentDeptNode_id
      //console.log("查询部门的id = "+searchDeptId)
      let that = this;
      let params = {
        currentPage: that.page,
        pageSize: that.limit,
        searchByKeys: {
          departmentId:searchDeptId,
          userName: that.filters.userName,
          userCode: that.filters.userCode
        },
        orderByKeys: { createTime: "desc" }
      };
      // that.loading = true // show loading progress
      that.axios
        .post(`${this.api.baseURL}/user/getPageUser`, params)
        .then(res => {
          ////console.log(res);
          that.customerOrgSuffix = res.data.data.customerOrgSuffix
          that.taskCateList = res.data.data.result.content;
          that.total = res.data.data.result.totalRecord;
          /*this.taskCateList = [
                    {id:'9e9a4a2320c44c70adc4572c87ae0824', userName:'AAAA', userCode: 'remark1'}, 
                    {id:'222', userName:'BBBB', userCode: 'remark2'}
                ]*/
        });
    },
    handleAddNew() {
      if(this.currentDeptNode_id == null || this.currentDeptNode_id == "" ){
        this.$message.error({showClose: true, message: '请先点击选择部门', duration: 4000});
        return ;
      }
      this.addFormVisible = true;
      this.addForm = {
        userName: "",
        userCode: "",
        status: "1",
        identityType: "0",
        sex: "1"
      };
    },
    addSubmit: function() {
      if(this.currentDeptNode_id == null || this.currentDeptNode_id == "" ){
        this.$message.error({showClose: true, message: '请先点击选择部门', duration: 4000});
        return ;
      }
      
      let that = this;
      this.$refs['addForm'].validate(valid => {
        if (valid) {
          let para = Object.assign({}, this.addForm);
          para.departmentId = that.currentDeptNode_id;
          that.axios.post(`${this.api.baseURL}/user/createUser`, para)
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
                  //console.log(result.data.message)
                  if(result.data.code == 403){
                      that.$message.error({showClose: true, message: '添加发生异常，' + result.data.message, duration: 4000});
                  }else{
                      that.$message.error({showClose: true, message: '添加发生异常，请联系管理员', duration: 4000});
                  }
              }
            });
        }
      });
    },
    updateDeptSubmit: function() {
      if(this.updateDeptForm.id == null || this.updateDeptForm.id == "" ){
        this.$message.error({showClose: true, message: '请先点击选择修改的上级部门', duration: 4000});
        return ;
      }
      let that = this;
      this.$refs['updateDeptForm'].validate(valid => {
        if (valid) {
          let para = Object.assign({}, this.updateDeptForm);
          that.axios.post(`${this.api.baseURL}/department/updateDept`, para)
            .then(function(result) {
              ////console.log(result);
              if (result && result.data.code == "200") {
                //保存成功
                that.$message.success({
                  showClose: true,
                  message: "修改成功",
                  duration: 2000
                });
                //console.log(" 修改 = "+result.data.data.result.departmentName)
                that.$refs.treeDepts.getCurrentNode().label = result.data.data.result.departmentName
                that.updateDeptFormVisible = false;
                //that.search();
              } else {
                  //console.log(result.data.message)
                  if(result.data.code == 400){
                      that.$message.error({showClose: true, message: '修改发生异常' + result.data.message, duration: 4000});
                  }else{
                      that.$message.error({showClose: true, message: '修改发生异常，请联系管理员', duration: 4000});
                  }
              }
            });
        }
      });
    },
    addDeptSubmit: function() {
      if(this.addDeptForm.parentDepId == ""){
        this.$message.error({showClose: true, message: '请先点击选择新增的上级部门', duration: 4000});
        return ;
      }
      let that = this;
      this.$refs['addDeptForm'].validate(valid => {
        if (valid) {
          let para = Object.assign({}, this.addDeptForm);
          that.axios.post(`${this.api.baseURL}/department/addDept`, para)
            .then(function(result) {
              ////console.log(result);
              if (result && result.data.code == "200") {
                //保存成功
                that.$message.success({
                  showClose: true,
                  message: "添加成功",
                  duration: 2000
                });
                that.append(that.currentDeptNode_data, result.data.data.result.id, result.data.data.result.departmentName)                
                that.addDeptFormVisible = false;
                //that.search();
              } else {
                  //console.log(result.data.message)
                  if(result.data.code == 400){
                      that.$message.error({showClose: true, message: '添加发生异常，' + result.data.message, duration: 4000});
                  }else{
                      that.$message.error({showClose: true, message: '添加发生异常，请联系管理员', duration: 4000});
                  }
              }
              that.addDeptForm.sortNo = '';
            });
        }
      });
    },
    editSubmit: function() {
      let that = this;
      this.$refs.editForm.validate(valid => {
        if (valid) {
          let para = Object.assign({}, this.editForm);
          //console.log("参数：" + para);
          that.axios
            .post(`${this.api.baseURL}/user/updateUser`, para)
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
              } else if (result && result.data.code == "400"){
                that.$message.error({
                  showClose: true,
                  message: "修改失败"+result.data.message,
                  duration: 2000
                });
              } else {
                console.log(result.data.message);
                that.$message.error({
                  showClose: true,
                  message: "修改失败,联系管理员",
                  duration: 2000
                });
              }
            });
        }
      });
    },
    showEditDialog(index, row) {
      this.bcInfoKey = row.bcInfoKey;
      this.bcHash = row.bcHash;
      this.editFormVisible = true;
      this.editForm = Object.assign({}, row);
    },
    del(index, row) {
      if(this.currentDeptNode_id == null || this.currentDeptNode_id == "" ){
        this.$message.error({showClose: true, message: '请先点击选择部门', duration: 4000});
        return ;
      }
      
      let that = this;
      let p = {userId: row.id};
      that.axios
        .post(`${this.api.baseURL}/depUser/getUserAllDepts`, p)
        .then(function(result) {
          //console.log(result);
          //console.log(result.data.data.result);
          if (result && result.data.code == "200") {
            let confirmMsg = "";
            if(result.data.data.result.length > 1){
              confirmMsg = "确认把用户【" + row.userName + "】从组中移除？";
            }else{
              confirmMsg = "确认删除用户【" + row.userName + "】？"
            }

            that.$confirm(confirmMsg, "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            })
              .then(() => {
                let p = {userId: row.id, departmentId: that.currentDeptNode_id};
                that.axios
                  .post(`${that.api.baseURL}/user/deleteUser`, p)
                  .then(function(result) {
                    //console.log(result);
                    if (result && result.data.code == "200") {
                      //删除成功
                      that.$message.success({ showClose: true, message: "已删除", duration: 2000 });
                      that.search();
                    } else if(result && result.data.code == "400"){
                      that.$message.error({ showClose: true, message: "删除失败,"+result.data.message, duration: 2000 });
                    }else {
                      //console.log(result.data.message)
                      that.$message.error({ showClose: true, message: "删除失败,联系管理员", duration: 2000});
                    }
                  });
              })
              .catch(() => {
                that.$message({ type: "info", message: "已取消删除" });
              });

          } else if(result && result.data.code == "400"){
            that.$message.error({
              showClose: true,
              message: "查询失败,"+result.data.message,
              duration: 2000
            });
          }else {
            //console.log(result.data.message)
            that.$message.error({
              showClose: true,
              message: "查询失败,联系管理员",
              duration: 2000
            });
          }
        });
    },
    authentication(index, row) {
      this.$confirm("您确定要实名认证【" + row.userName + "】吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let that = this;
          let p = { id: row.id };
          that.axios
            .post(`${this.api.baseURL}/user/authentication`, p)
            .then(function(result) {
              //console.log(result);
              if (result && result.data.code == "200") {
                //成功
                that.$message.success({
                  showClose: true,
                  message: "认证成功",
                  duration: 2000
                });
              } else {
                that.$message.error({
                  showClose: true,
                  message: "认证失败,"+result.data.message,
                  duration: 2000
                });
              }
              that.search();
            });
        })
        .catch(() => {
          this.$message({ type: "info", message: "已取消删除" });
        });
    },
    handleAuth(){
      if(set.size == 0){
        this.$message.error({ showClose: true, message: "请选择用户", duration: 4000 });
        return ;
      }

      this.$confirm("您确定要提交实名认证吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
      .then(() => {
          let that = this
          let params = set
          that.axios.post(`${this.api.baseURL}/user/authenticationList`, params).then(res =>{
            //console.log(res.data)
            if (res.data.code == "200"){
              that.$message.success({ showClose: true, message: "认证成功", duration: 2000 });
            }else{
              that.$message.error({ showClose: true, message: "认证结果，认证成功："+res.data.data.successCount+"条，认证失败："+res.data.data.failCount+"条", duration: 4000 });
            }
            that.search();
          });
        })
        .catch(() => {
          this.$message({ type: "info", message: "已取消删除" });
        });
    },
    checkboxInit(row, index){
      //console.log(" checkboxInit = "+row.isVerified)
      if (row.isVerified != 1) {
        return 1;//可勾选
       } else {
        return 0;//不可勾选
       }
    },
    selectionChange(selection){
      //console.log("======== selectionChange ccccc =======") 
      //console.log(set)
      set.clear();
      selection.forEach(item => {
            //console.log("每一行Id:"+item.id)
            set.add(item.id);
          });
      // set.forEach(s => {
      //       console.log("每一行Id:"+s)
      // });
      //console.log("set 长度："+set.size)
    },
    updateDepartment(){
      if(!this.currentDeptNode_data){
        this.$message.error({showClose: true, message: '请先点击选择要编辑的部门', duration: 4000});
        return ;
      }
      
      // 要显示排序号，所以要按id查询
      let that = this
      let params = {id:this.currentDeptNode_data.id}
      that.axios.post(`${this.api.baseURL}/department/queryByDeptId`, params).then(res =>{
        //console.log(res.data)
        if (res.data.code == "200"){
          // 查询成功
          this.updateDeptForm.sortNo = res.data.data.result.sortNo 
        }else if(res.data.code == "400"){
          that.$message.error({ showClose: true, message: "查询失败"+res.data.data.message, duration: 4000 });
        }else{
          //console.log("res.data.data.message = "+res.data.data.message)
          that.$message.error({ showClose: true, message: "查询失败,联系管理员", duration: 4000 });
        }
      });

      this.updateDeptFormVisible = true
    
    },   
    addMenberAlready(){
      if(!this.currentDeptNode_node){
        this.$message.error({showClose: true, message: '请先点击选择部门', duration: 4000});
        return ;
      }
      //console.log("进入 addMenberAlready 方法")
      this.data5 = this.data4
      this.addMenberFormVisible = true

    },
    addDepartment(){
       this.addDeptForm.departmentName = '';
      //  if(Math.round(this.addDeptForm.sortNo*100)/100){
         
      //  }
      if(this.addDeptForm.parentDepId == null || this.addDeptForm.parentDepId == ""){
        this.$message.error({showClose: true, message: '请先点击选择上级部门', duration: 4000});
        return ;
      }
      this.addDeptFormVisible = true
    },
    delDepartment(){
      if(this.addDeptForm.parentDepId == null || this.addDeptForm.parentDepId == ""){
        this.$message.error({showClose: true, message: '请先点击选择要删除部门', duration: 4000});
        return ;
      }
      //console.log("进入 delDepartment 方法")
      //console.table(this.currentDeptNode_data)
      //console.log(this.currentDeptNode_data.id)
      //console.log(this.currentDeptNode_data.label)
      this.$confirm('删除部门【 '+this.currentDeptNode_data.label+'】, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

          let that = this
          let params = {id:this.currentDeptNode_data.id}
          that.axios.post(`${this.api.baseURL}/department/delete`, params).then(res =>{
            //console.log(res.data)
            if (res.data.code == "200"){
              that.$message.success({ showClose: true, message: "删除成功", duration: 2000 });
              that.removeDept(this.currentDeptNode_node,this.currentDeptNode_data)
              // 清空当前部门的页面数据
              that.clearCurrentDeptData()
            }else if(res.data.code == "400"){
              that.$message.error({ showClose: true, message: "删除失败，"+res.data.message, duration: 4000 });
            }else{
              //console.log("res.data.data.message = "+res.data.message)
              that.$message.error({ showClose: true, message: "删除失败,联系管理员", duration: 4000 });
            }
            // that.search();
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
  },
  mounted() {
    //this.handleSearch();

    document.getElementsByClassName('addMenber')[0].children[0].style.width = 800 + 'px';
    document.getElementsByClassName('addSection')[0].children[0].style.width = '30%';
    document.getElementsByClassName('updateSection')[0].children[0].style.width = '30%';

    console.log(document.getElementsByClassName('el-tree-node__label'))

  },
  // beforeRouteEnter(to, from, next) {
  //   next(function(vm) {
  //     vm.handleCheckedCitiesChange();
  //   });
  // },
  created() {
    // 部门树
    this.getDepts();
    // 主页添加键盘事件,注意,不能直接在焦点事件上添加回车
    var self = this;
    document.onkeydown = function(e) {
      var key = e.which;
      if (key == 13) {
        self.handleSearch();
      }
    };
    this.cityArr = Object.keys(this.cities);
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
.table {
  float: right;
  width: 83%;
}
.table .el-table__row .el-button {
  padding: 0;
  color: #409eff;
  border: none;
  padding-right: 3px;
}
.custom-tree-container {
  margin-top: -60px;
  float: left;
  width: 17%;
}
.myClass {
  width: 30%;
  background-color: #eee;
}
.block {

  .block-top {
    margin-bottom: 10px;
    color: #409EFF;
    font-size: 20px;
    &::after {
      display: block;
      clear: both;
      content: ' ';
    }

    > span {
      float: left;
    }

    .icon {
      float: right;
      margin-right: 20px;

      > i {
        margin-right: 5px;
        font-size: 20px;
        color: #409EFF;
        cursor: pointer;
      }
    }
  }
}
.menber {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;

  .menber-left {
    width: 33.3333%;
    margin-right: 20px;
    padding: 10px;
    border: 1px solid #eee;
   

    .l-content {
      min-height: 200px;
    }
  }
  .menber-middle {
    width: 33.3333%;
    margin-right: 30px;
    padding: 10px;
    border: 1px solid #eee;

    .el-checkbox+.el-checkbox {
      margin-left: 27px;

      &:nth-child(3n+1) {
        margin-left: 0;
      }
    }
  }
  .menber-right {
    width: 33.3333%;
    padding: 10px;
    border: 1px solid #eee;

    .r-content {
      .r-name {
        margin-bottom: 5px;
        background-color: #eee;

        > i {
          padding-top: 2px;
          float: right;
          font-size: 18px;
          cursor: pointer;
        }
      }
    }
  }
}

.on {
  background-color: #000;
}

</style>