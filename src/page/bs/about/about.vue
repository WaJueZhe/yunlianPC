<template>
<div class="about-page">
    <el-row class="warp">
      <el-col :span="24" class="warp-breadcrum">
          <app-title :title="customerTitle"></app-title>
      </el-col>
    </el-row>

    <div class="introduce">
       <span class="logo"></span> 
       <span class="txt">云单是前海云链（深圳）科技有限公司基于区块链技术搭建的去中心化可信电子运单服务平台。旨在以电子运单为切入点解决现有系统纸质面单效率低，回单回款慢，耗材打印成本高，存放维护难等问题，促进平台向基于共享账本、智能合约、隐私保护为特点，存储安全、运行高效、数据不可篡改的区块链去中心化平台业务转变，推动物流供应链行业升级优化。</span>
    </div>
    <div class="title">云单更新日志</div>
    <div class="box">
      <!-- 左边日志 -->
      <div class="info">
        <ul class="list">

          <li class="item">
            <div class="time">2018-05-30</div>
            <div class="timeline-dot"></div>
            <div class="content">
              <div class="text">
                <div class="tit">Version 1.2 Release4 </div>
                  <p>1、签名查询模块优化</p>
                  <p>2、官网使用响应式适配</p>
                  <p>3、移动端优化</p>
                  <p>4、修复已知bug，优化用户体验</p>
              </div>
            </div>
          </li>

          <li class="item">
            <div class="time">2018-05-17</div>
            <div class="timeline-dot"></div>
            <div class="content">
              <div class="text">
                <div class="tit">Version 1.2 Release3 </div>
                  <p>1、移动端增加用户权限控制功能</p>
                  <p>2、移动端增加个人司机、车辆、常用地址维护</p>
                  <p>3、移动端增加C端用户发货数量限制</p>
                  <p>4、移动端增加帮助引导页</p> 
                  <p>5、移动端签发、签收增加引导查询历史功能</p>
                  <p>6、修复已知bug，优化用户体验</p>
              </div>
            </div>
          </li>

          <li class="item">
            <div class="time">2018-05-10</div>
            <div class="timeline-dot"></div>
            <div class="content">
              <div class="text">
                <div class="tit">Version 1.2 Release2 </div>
                  <p>1、移动端增加录入运单功能</p>
                  <p>2、移动端增加司机、车辆、常用地址维护</p>
                  <p>3、移动端增加实名认证功能</p>
                  <p>4、自动开通签发、签收人在移动端查看功能</p> 
                  <p>5、后台增加管理个人用户功能</p>
                  <p>6、完善1.2版本的部分功能和Bug</p>
                  <p>7、修复已知bug，优化用户体验</p>
              </div>
            </div>
          </li>

          <li class="item">
            <div class="time">2018-04-26</div>
            <div class="timeline-dot"></div>
            <div class="content">
              <div class="text">
                <div class="tit">Version 1.2 Release1 </div>
                  <p>1、PC端支持手机号登录</p>
                  <p>2、移动端支持收货人登录</p>
                  <p>3、移动端支持多种身份切换</p>
                  <p>4、移动端增加异常收货录入功能</p> 
                  <p>5、移动端增加签收历史查询功能</p>
                  <p>6、移动端优化个人设置功能</p>
                  <p>7、移动端增加司机确认异常功能</p>
                  <p>8、修复已知bug</p>
              </div>
            </div>
          </li>

          <li class="item">
            <div class="time">2018-04-10</div>
            <div class="timeline-dot"></div>
            <div class="content">
              <div class="text">
                <div class="tit">Version 1.1 Release7.1 </div>
                  <p>1、部门管理功能优化</p>
                  <p>2、报表管理支持按部门查询</p>
                  <p>3、H5司机端适配小屏手机</p>
                  <p>4、优化主页和运单管理的数据权限</p>
                  <p>5、修复若干bug</p>
              </div>
            </div>
          </li>

          <li class="item">
            <div class="time">2018-04-03</div>
            <div class="timeline-dot"></div>
            <div class="content">
              <div class="text">
                <div class="tit">Version 1.1 Release7 </div>
                  <p>1、客户管理增加组织机构功能</p>
                  <p>2、用户管理增加组织机构功能</p>
                  <p>3、修复运单查询的日期条件失效bug</p>
                  <p>4、运单录入-快捷增加车辆司机，加入权限判断</p>
                  <p>5、首页统计、报表增加用户权限过滤</p>
                  <p>6、云单平台公众号关联云单小程序</p>
                  <p>7、修复若干bug，优化首页标题栏用户体验</p>
              </div>
            </div>
          </li>

          <li class="item">
            <div class="time">2018-03-28</div>
            <div class="timeline-dot"></div>
            <div class="content">
              <div class="text">
                <div class="tit">Version 1.1 Release6 </div>
                  <p>1、微信小程序发布</p>
                  <p>2、司机端帮助中心改版</p>
                  <p>3、增加用户意见反馈收集</p>
                  <p>4、增加用户实名认证功能</p>
                  <p>5、优化用户体验</p>
                  <p>6、修复已知bug</p>
              </div>
            </div>
          </li>

          <li class="item">
            <div class="time">2018-03-22</div>
            <div class="timeline-dot"></div>
            <div class="content">
              <div class="text">
                <div class="tit">Version 1.1 Release5 </div>
                  <p>1、微信小程序预发布</p>
                  <p>2、坐标系转化火星坐标系</p>
                  <p>3、增加司机实名认证</p>
                  <p>4、运单录入增加快捷选择</p>
                  <p>5、官网、微官网上线</p>
                  <p>6、修复已知bug</p>
              </div>
            </div>
          </li>

          <li class="item">
            <div class="time">2018-03-15</div>
            <div class="timeline-dot"></div>
            <div class="content">
              <div class="text">
                <div class="tit">Version 1.1 Release4 </div>
                  <p>1、安卓App上线</p>
                  <p>2、PC端增加修改司机手机号功能</p>
                  <p>3、首页显示效果优化</p>
                  <p>4、前台图片压缩程序优化</p>
                  <p>5、微信小程序内测</p>
                  <p>6、修复BUG，优化用户使用体验</p>
                  <p>7、修复多角色权限显示bug</p>
              </div>
            </div>
          </li>

          <li class="item">
            <div class="time">2018-03-12</div>
            <div class="timeline-dot"></div>
            <div class="content">
              <div class="text">
                <div class="tit">Version 1.1 Release3.1 </div>
                  <p>1、iPhone低版本(iOS10)H5页面适配</p>
                  <p>2、安卓app接口调整</p>
                  <p>3、图片压缩优化</p>
              </div>
            </div>
          </li>

          <li class="item">
            <div class="time">2018-03-08</div>
            <div class="timeline-dot"></div>
            <div class="content">
              <div class="text">
                <div class="tit">Version 1.1 Release3 </div>
                  <p>1、增加增值服务功能模块</p>
                  <p>2、导入运单时空行的处理</p>
                  <p>3、完善财务模块剩余功能</p>
                  <p>4、H5增加游客体验入口</p>
                  <p>5、司机、车辆列表增加导出功能</p>
                  <p>6、后台增加自动计算常用地址经纬度功能</p>
                  <p>7、司机图片上传功能优化</p>
                  <p>8、修复BUG，优化用户使用体验</p>
              </div>
            </div>
          </li>

          <li class="item">
            <div class="time">2018-02-29</div>
            <div class="timeline-dot"></div>
            <div class="content">
              <div class="text">
                <div class="tit">Version 1.1 Release2 </div>
                  <p>1、增加手工终止运单功能</p>
                  <p>2、增加运单统计报表</p>
                  <p>3、增加用户充值、认证&签名扣费功能</p>
                  <p>4、后台管理增加财务密码</p>
                  <p>5、司机微信端页面可左右滑动</p>
                  <p>6、全站https切换</p>
                  <p>7、微信小程序部分功能准备</p>
                  <p>8、修复BUG，优化用户使用体验</p>
              </div>
            </div>
          </li>

          <li class="item">
            <div class="time">2018-02-09</div>
            <div class="timeline-dot"></div>
            <div class="content">
              <div class="text">
                <div class="tit">Version 1.1 Release1 </div>
                  <p>1、区块链模块：搭建联盟链</p>
                  <p>2、各项业务数据实时上链，采用共享账本形式</p>
                  <p>3、上链状态、上链数据查询，任何参与方均可查询链上数据的哈希值</p>
                  <p>4、修复BUG，优化用户使用体验</p>
              </div>
            </div>
          </li>
          <li class="item">
            <div class="time">2018-01-11</div>
            <div class="timeline-dot"></div>
            <div class="content">
              <div class="text">
                <div class="tit">Version 1.0 平台发布</div>
                  <p>2018年1月11日，由前海云链科技（深圳）有限公司与腾讯共同研发的“区块链+物流供应链”重大项目——云单1.0上线试运营，率先实现区块链在物流供应链领域的落地应用，是区块链技术非常难得且重大的应用场景。</p>
                  <p>云链科技是一家致力于应用区块链技术对物流供应链进行革新的科技创新型企业，团队拥有强大的研发实力。同时，云链科技是中国物流与采购联合会区块链应用分会会长单位，也是中国区块链生态联盟副理事长单位。</p>
              </div>
            </div>
          </li>
          
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default{
    data(){  
        return{
            customerTitle:'关于云单',
        }
    },
    methods:{  
        
    },
    mounted(){
    },
    components: {
    }
}
</script>

<style lang="less" scoped>
  .about-page {
    width: 100%;
    background-color: #f1f4f5;

    .warp {
      background-color: #fff;
    }

    .introduce {
      position: relative;
      width: 100%;
      background-color: #fff;
      display: flex;

      .logo {
        margin-top: 4px;
        display: inline-block;
        width: 84px;
        height: 37px;
        background:url('../../../../static/img/logo.png') no-repeat;
        background-size: 100% 100%;
        background-color: rgb(84, 92, 100);
        border-radius: 5px;
      }

      .txt {
        flex: 1;
        margin-left: 10px;
      }
    }

    .title {
      margin-top: 10px;
      width: 100%;
      height: 60px;
      line-height: 60px;
      font-size: 26px;
      text-align: center;
      color: #fff;
      background-color: #62a8ea;
    }

    .box {
      position: relative;      
      padding: 30px 0;
      width: 100%;
      height: 100%;

      &:before {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 50%;
        width: 2px;
        margin-left: -1px;
        content: "";
        background-color: #e4eaec;
    }

      &:after {
        display: block;
        clear: both;
        content: ' ';
      }

      .info {
        width: 100%;
        height: 100%;
        overflow: hidden;

          .list {
            width: 100%;
            height: 100%;
            
            &:after {
              display: block;
              clear: both;
              content: ' ';
            }

            .item {
              float: left;
              position: relative;
              width: 50%;
              margin-bottom: 30px;

              &:after {
                display: block;
                clear: both;
                content: ' ';
              }

              &:nth-child(2n-1) {

                .timeline-dot {
                  position: absolute;
                  top: 10px;
                  right: -8px;
                  width: 16px;
                  height: 16px;
                  background-color: #62a8ea;
                  border-radius: 50%;
                }
              }

              &:nth-child(2n) {
                margin-top: 80px;

                .time {
                  float: left;
                  margin-left: 20px;
                }

                .timeline-dot {
                  position: absolute;
                  top: 10px;
                  left: -8px;
                  width: 16px;
                  height: 16px;
                  background-color: #62a8ea;
                  border-radius: 50%;
              }

                .content {
                  float: left;
                }
              }

              &:after {
                display: block;
                clear: both;
                content: ' ';
              }

              .time {
                float: right;
                margin: 0 20px;
                width: 20%;
                text-align: center;
                font-size: 22px;
                color: black;
              }

              // .timeline-dot {
              //   position: absolute;
              //   top: 10px;
              //   right: -8px;
              //   width: 16px;
              //   height: 16px;
              //   background-color: #62a8ea;
              //   border-radius: 50%;
              // }

              .content {
                float: right;
                padding: 20px;
                width: 64%;
                height: 330px;
                border-radius: 10px;
                box-sizing: border-box;
                background-color: #fff;
                overflow: hidden;
              }

              .text {
                width: 100%;
                height: 100%;
                overflow: auto;

                > p {
                  color: #666;
                }

                .tit {
                  font-size: 22px;
                  color: black;
                }
              }
            }
        }
      }
    }
  }
</style>
