
// const baseurl  = 'https://www.bcscm.net/etc';    //正式环境
// const resource ='https://www.bcscm.net/resource/';      //正式环境
// const socketurl = 'https://www.bcscm.net/chatApp';  //正式环境
// const weburl ='https://www.bcscm.net/myadmin/';      //正式环境



const baseurl  = 'https://test.bcscm.net/etc';    //测试环境
const resource ='https://test.bcscm.net/resource/';      //测试环境
const socketurl = 'https://test.bcscm.net/chatApp';  //测试环境
const weburl ='https://test.bcscm.net/myadmin/';      //测试环境



// const baseurl  = 'https://test.bcscm.net/etc';    //本地
// const resource ='http://119.29.249.147:8080/resource/';      //本地 -> 测试环境
// const socketurl = 'http://119.29.117.83:8088/chatApp';  //本地 -> 测试环境
// const weburl ='http://localhost:8081/';      //本地



export default {
    baseURL: baseurl,
    socketurl:socketurl,
    weburl:weburl,
    resource:resource,

    // 登录接口
    getlogin:`${baseurl}/userAuth/loginUserByUserCode`, //该接口需要两个参数
    //获取一级导航栏接口
    getOneNav:`${baseurl}/user/queryUserAllMenu`,     //该接口需要传递一个tokenid

    //获取用户列表
    getUserList:`${baseurl}/user/getPageUser`,

    //获取全部司机列表
    getDriverList:`${baseurl}/driver/driverList`,
    //添加司机
    createDriver:`${baseurl}/driver/create`,
    //删除司机
    deleteDriver:`${baseurl}/driver/delete`,
    //根据id查询司机
    getByIdDriver:`${baseurl}/driver/getById`,
      //编辑司机
    updateDriver:`${baseurl}/driver/update`,

    //获取车辆信息
  //  getVehicleList:`${baseurl}/vehicle_driver/getByVehicleId`,
    //查询首页header权限菜单
    headerMenu:`${baseurl}/user/queryUserHeaderMenu`,
    //添加用户
    adduser:`${baseurl}/user/createUser`,
    //删除用户
    deleatuser:`${baseurl}/user/deleteUser`,    //该接口需要一个usercode
    //查询用户的角色列表
    queryUserRole:`${baseurl}/userRole/getUserRoleTree`, 
    //修改用户的角色列表
    updateUserRole:`${baseurl}/userRole/updateUserRole`,

    //查询角色权限列表
    queryRoleMenu:`${baseurl}/roleMenu/getRoleMenuTree`, 
    //修改用户的角色列表
    updateRoleMenu:`${baseurl}/roleMenu/updateRoleMenu`
}