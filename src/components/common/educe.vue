<template>
<el-row class="warp" style="margin-bottom:50px">
    <el-col :span="24" class="warp-breadcrum" style="padding:10px;">
        <app-title :title="reportTitle"></app-title>
    </el-col>
  <el-row>
    <el-col>
      <div class="info">
        <div class="info-box">
          <ul class="list">
            <li class="item">序号</li>
            <li class="item3">任务单号</li>
            <li class="item3">运单号</li>
            <li class="item3">路线信息</li>
            <li class="item3">司机</li>
            <li class="item3">车辆</li>
            <li class="item3">货物描述</li>
            <li class="item3">签发人</li>
            <li class="item3">签收人</li>
            <li class="item3">计划件数</li>
            <li class="item3">完成状态</li>
          </ul>
        </div>
        <div class="info-box2">
          <ul class="list">
            <li class="item">1</li>
            <li class="item3">T123456789</li>
            <li class="item3">S1234567890</li>
            <li class="item3">华南R线</li>
            <li class="item2">陈先生135132456789</li>
            <li class="item3">车辆</li>
            <li class="item3">配件</li>
            <li class="item2">陈先生135132456789</li>
            <li class="item2">陈先生135132456789</li>
            <li class="item3">23</li>
            <li class="item3">已签收</li>
          </ul>
        </div>
      </div>
    </el-col>
  </el-row>
  
</el-row>
</template>
<script>
export default {
  data () {
    return {
      reportTitle:'导出页面预览'
    }
  }
}
</script>
<style lang="less" scoped>
.warp {
  .info {
    width: 1252px;
    z-index: 99999;

    .info-box {
      width: 100%;
      height: 51px;
      border: 1px solid #ccc;
      margin-bottom: 10px;
      background-color: #eee;

      .list > li {
        float: left;
        height:50px;
        line-height: 50px;
        text-align: center;
        border-right: 1px solid #ccc;

        &:last-child {
          border-right: none;
        }
      }

      .list {
        width: 100%;
        height:50px;

        .item {
          width: 50px;
        }
        // .item2 {
        //   width: 109px;
        // }
        .item3 {
          width: 120px;
        }
      }
    }
    .info-box2 {
      width: 100%;
      height: 51px;
      border: 1px solid #ccc;
      margin-bottom: 10px;

      .list > li {
        float: left;
        height:50px;
        line-height: 50px;
        text-align: center;
        border-right: 1px solid #ccc;

        &:last-child {
          border-right: none;
        }
      }

      .list {
        width: 100%;
        height:50px;

        .item {
          width: 50px;
        }
        .item2 {
          width: 120px;

          &:nth-child(5) {
            line-height: 1.5;
          }
          &:nth-child(8) {
            line-height: 1.5;
          }
          &:nth-child(9) {
            line-height: 1.5;
          }
        }
        .item3 {
          width: 120px;
        }
      }
    }
  }
}
</style>
