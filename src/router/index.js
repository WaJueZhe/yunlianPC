import Vue from 'vue';
import Router from 'vue-router';
import Login from '../page/login/login';
import Home from '../page/home/home.vue';
import UserList from '../page/bs/user/userList.vue';
import CUserList from '../page/bs/user/cuserlist.vue';
import RoleList from '../page/bs/user/roleList.vue';
import MenuList from '../page/bs/user/menuList.vue';
import MenuList_new from '../page/bs/user/menuList_new.vue';
import ConsumerList from '../page/bs/user/customerList.vue';
import SaveSetting from '../page/bs/user/saveSetting.vue';
import TaskCategory from '../page/bs/resource/taskCategory.vue';
import UsualAddress from '../page/bs/address/address.vue';
import DriverList from '../page/bs/driver/driver.vue';
import VehicleList from '../page/bs/vehicle/vehicle.vue';
import TaskList from '../page/bs/task/task.vue';
import Report from '../page/bs/report/report.vue';
import Message from '../page/bs/message/message.vue';
import Parameter from '../page/bs/parameter/parameter.vue';
import Dict from '../page/bs/dict/dict.vue';
import CustomerDetail from '../page/bs/customer/customerDetail.vue';
import About from '../page/bs/about/about.vue';
import HomePage from '../page/home/homePage.vue';
import Chart1 from '../components/home/echart1.vue';
import Chart2 from '../components/home/echart2.vue';
import Chart3 from '../components/home/echart3.vue';
import Chart4 from '../components/home/echart4.vue';
import NewTask from '../page/bs/task/newtask.vue';
import ArticleList from '../page/bs/news/articleList.vue';
// import Addarticle  from '../page/bs/news/addarticle.vue'
import Addarticle  from '../page/bs/news/newarticle.vue';
import NoticeList  from '../page/bs/news/noticeList.vue';
import NoticeDetail  from '../page/bs/news/noticeDetail.vue';

import DemoConpontent from './demo.vue'; //图片上传demo地址
import ScoreHome from '../page/bs/score/scorehome.vue';
import LinkLog from '../page/bs/link/linklog.vue';
import QueryBlockChain from '../page/bs/link/queryBlockChain.vue';
import QueryBlockChainStatus from '../page/bs/link/queryBlockChainStatus.vue';
import PersonalData from '../page/bs/personalData/personalData.vue';
import LoginJournal from '../page/bs/journal/journal.vue';
import Educe from '../components/common/educe';
import VerifyManagement from '../page/bs/verifyManagement/verifyManagement';
import SignManagement from '../page/bs/signManagement/signManagement';
import ChargeManagerment from '../page/bs/chargeManagerment/chargeManagerment';
import FinancePassword from '../page/bs/finance/financepassword.vue';
import ExtraService from '../page/bs/extra/extraService.vue';

import HelpList from '../page/bs/help/helpList.vue';
import QuestionList from '../page/bs/help/questionList.vue';

import ExpReport from '../page/bs/report/expReport.vue';

Vue.use(Router)

export default new Router({
  routes: [{
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/demo',
      name: 'demo',
      component: DemoConpontent
    },
    {
      path: '/demoLogin/:demouser',
      name: 'DemoLogin',
      component: Login
    },
    {
      path: '/app/scorehome/:tokenid',
      name: 'scorehome',
      component: ScoreHome
    },
    {
      path: '/home',
      name: 'Home',
      component: Home,
      children: [{
          path: '/user',
          name: 'UserList',
          component: UserList,
          meta: ['用户列表']
        },
        {
          path: '/cuser',
          name: 'CUserList',
          component: CUserList,
          meta: ['个人用户列表']
        },
        {
          path: '/homepage',
          name: 'homePage',
          component: HomePage,
          meta: ['默认的主页展示'],
          children: [{
            path: '/chart1',
            name: 'chart1',
            component: Chart1
          }, {
            path: '/chart2',
            name: 'chart2',
            component: Chart2
          }, {
            path: '/chart3',
            name: 'chart3',
            component: Chart3
          }, {
            path: '/chart4',
            name: 'chart4',
            component: Chart4
          }, ]
        },
        {
          path: '/order',
          name: 'RoleList',
          component: RoleList,
          meta: ['角色列表']
        },
        {
          path: '/menu',
          name: 'MenuList',
          component: MenuList,
          meta: ['权限列表']
        },
        {
          path: '/menu_new',
          name: 'MenuList_new',
          component: MenuList_new,
          meta: ['权限列表_new']
        },
        {
          path: '/customerOrg/getPageCustomerOrg',
          name: 'ConsumerList',
          component: ConsumerList,
          meta: ['客户列表']
        },
        {
          path: '/user/saveSetting',
          name: 'SaveSetting',
          component: SaveSetting,
          meta: ['安全设置']
        },
        {
          path: '/customerOrg/customerDetail',
          name: 'CustomerDetail',
          component: CustomerDetail,
          meta: ['客户详情']
        },
        {
          path: '/aboutld',
          name: 'About',
          component: About,
          meta: ['关于云单']
        },
        {
          path: '/personalData',
          name: 'PersonalData',
          component: PersonalData,
          meta: ['个人资料']
        },
        {
          path: '/journal',
          name: 'LoginJournal',
          component: LoginJournal,
          meta: ['登录日志']
        },


        // 以下是二级菜单
        {
          path: '/articleList',
          name: 'ArticleList',
          component: ArticleList,
          meta: ['公告管理']
        },
        {
          path: '/newarticle/:id',
          // path: '/addarticle/:id',
          name: 'Addarticle',
          component: Addarticle,
          meta: ['新增公告']
        },
        {
          path: '/noticeList',
          name: 'NoticeList',
          component: NoticeList,
          meta: ['消息管理']
        },
        {
          path: '/noticeDetail/:id',
          name: 'NoticeDetail',
          component: NoticeDetail,
          meta: ['消息明细']
        },
        {
          path: '/resource/taskcategory',
          name: 'TaskCategory',
          component: TaskCategory,
          meta: ['运单分类管理']
        },
        {
          path: '/address',
          name: 'UsualAddress',
          component: UsualAddress,
          meta: ['常用地址管理']
        },
        {
          path: '/driverlist',
          name: 'DriverList',
          component: DriverList,
          meta: ['司机列表']
        },
        {
          path: '/vehicleList',
          name: 'VehicleList',
          component: VehicleList,
          meta: ['车辆列表']
        }, 
        {
          path: '/task/:externalPara',
          name: 'TaskList',
          component: TaskList,
          meta: ['任务列表']
        }, 
        {
          path: '/newtask',
          name: 'NewTask',
          component: NewTask,
          meta: ['新建任务']
        }, 
        {
          path: '/report',
          name: 'Report',
          component: Report,
          meta: ['报表管理']
        },
        {
          path:'/expReport',
          name:'ExpReport',
          component:ExpReport,
          meta:['货损货差']
        }, 
        {
          path: '/educe',
          name: 'Educe',
          component: Educe,
          meta: ['导出预览']
        }, 
        {
          path: '/message',
          name: 'Message',
          component: Message,
          meta: ['消息管理']
        }, 
        {
          path: '/parameter',
          name: 'Parameter',
          component: Parameter,
          meta: ['参数管理']
        }, 
        {
          path: '/dict',
          name: 'dict',
          component: Dict,
          meta: ['字典管理']
        },
        {
          path: '/linklog',
          name: 'linklog',
          component: LinkLog,
          meta: ['链上日志']
        },
        {
          path: '/queryBlockChain',
          name: 'queryBlockChain',
          component: QueryBlockChain,
          meta: ['链上查询']
        },
        {
          path: '/queryBlockChainStatus',
          name: 'queryBlockChainStatus',
          component: QueryBlockChainStatus,
          meta: ['链上状态']
        },
        {
          path: '/verifyManagement',
          name: 'verifyManagement',
          component: VerifyManagement,
          meta: ['认证管理']
        },
        {
          path: '/signManagement',
          name: 'signManagement',
          component: SignManagement,
          meta: ['签名管理']
        },
        {
          path: '/chargeManagerment',
          name: 'chargeManagerment',
          component: ChargeManagerment,
          meta: ['充值管理']
        },
        {
          path: '/financePassword',
          name: 'financePassword',
          component: FinancePassword,
          meta: ['财务密码']
        },
        {
          path: '/extraService',
          name: 'extraService',
          component: ExtraService,
          meta: ['财务密码']
        },
        {
          path:'/helpList',
          name:'helpList',
          component:HelpList,
          meta:['帮助文章列表']
        },
        {
          path:'/questionList',
          name:'questionList',
          component:QuestionList,
          meta:['问题反馈列表']
        },


      ]
    }
  ]
})
