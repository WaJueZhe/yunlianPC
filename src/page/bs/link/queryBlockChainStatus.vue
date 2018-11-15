<template>
  <div class="queryBlockChainStatus-page">
    <div class="status">
      <div class="title">状态</div>
      <div class="info-box">
        <div class="left">
          <ul class="list">
            <li class="item">
              <div class="photo">
                <img src="../../../../static/img/status-1.png" alt="">
              </div>
              <div class="message">
                <div class="name">当前节点数</div>
                <div class="number">{{ fromData.pageCount.nodeCounts }}</div>
              </div>
            </li>
            <li class="item">
              <div class="photo">
                <img src="../../../../static/img/status-2.png" alt="">
              </div>
              <div class="message">
                <div class="name">数据高度</div>
                <div class="number">{{ fromData.pageCount.bcHeight }}</div>
              </div>
            </li>
            <li class="item">
              <div class="photo">
                <img src="../../../../static/img/status-3.png" alt="">
              </div>
              <div class="message">
                <div class="name">历史并发峰值</div>
                <div class="number">{{ fromData.pageCount.maxCount }}<span>笔/秒</span></div>
              </div>
            </li>
            <li class="item">
              <div class="photo">
                <img src="../../../../static/img/status-4.png" alt="">
              </div>
              <div class="message">
                <div class="name">总交易笔数</div>
                <div class="number">{{ fromData.pageCount.bcTransactionCount }}</div>
              </div>
            </li>
          </ul>
        </div>
        <div class="image-box">
          <img src="../../../../static/img/bc_status_extend.gif" alt="">
        </div>
        <div class="right">
          <div class="data" @click="refresh">
            <span class="state">上链中</span>
            <span class="image"><img src="../../../../static/img/data-1.png" alt=""></span>
            <span>0</span>
          </div>
          <div class="data">
            <span class="state">已上链</span>
            <span class="image"><img src="../../../../static/img/data-2.png" alt=""></span>
            <span>{{ fromData.pageCount.bcHeight || '0' }}</span>
          </div>
          <div class="data">
            <span class="state">异常</span>
            <span class="image"><img src="../../../../static/img/data-3.png" alt=""></span>
            <span>0</span>
          </div>
        </div>
      </div>
      <div class="title">节点</div>
      <div class="group">
        <div class="group-tit">
            <div class="node">节点Id</div>
            <div class="location">节点名称</div>
            <div class="status">状态</div>
            <div class="blockHeight">数据高度</div>
            <div class="currentHash">当前哈希值</div>
            <div class="currentTime">最新区块时间</div>
        </div>
        <div class="group-tit" v-for="(item, index) in fromData.result.content" :key="index">
            <div class="node" v-if="item.nodeId">{{ item.nodeId}}</div>
            <div class="location" v-if="item.name">{{ item.name}}</div>
            <div class="status" v-if="item.status == 1">正常</div>
            <div class="blockHeight" v-if="item.bcHeight">{{ item.bcHeight }}</div>
            <div class="currentHash" v-if="item.currentHash">{{ item.currentHash }}</div>
            <div class="currentTime" v-if="item.lastBcDate">{{ item.lastBcDate }}</div>
        </div>
      </div>
      <!--工具条-->
      <el-col :span="24" class="toolbar">
        <el-pagination layout="total, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-size="limit" :total="total"
          background style="float:right;">
        </el-pagination>
      </el-col>
    </div>
  </div>
</template>

<script>
export default{
    data(){  
        return{
          fromData:{
            pageCount:{},
              result:{
              content:[]
            }
          },
          total:0,
          page: 1,
          limit: 10,
        }
    },
    methods:{
      status () {
        let p = {
          currentPage: this.page,
          pageSize: this.limit,
        }
        this.axios.post(`${this.api.baseURL}/bcSumNodes/queryBcSumNodes`,p)
        .then(res => {
          this.fromData = res.data.data;
          console.log(this.fromData);
          this.total = res.data.data.result.totalRecord;
        });
      },
      refresh () {
        // this.status();
        location.replace(location.href);
      },
      handleCurrentChange(val) {
      this.page = val;
      this.status();
    },
    },
    mounted(){
      this.status();
    },
    created () {
      // this.status();
    },
    components: {
    }
}
</script>

<style lang="less" scoped>
  .queryBlockChainStatus-page {
    margin-left: -2px;
    padding: 0 20px;
    width: 100%;
    height: 100%;
    background-color: #eaedf1;
    overflow: hidden;

    .status {
      box-sizing: border-box;

      .title {
        margin-top: 20px;
        padding: 0 10px;
        font-size: 20px;
        border-left: 5px solid black;
      }

      .info-box {
        margin-top: 10px;
        height: 206px;
        background-color: #fff;

        &:after {
          display: block;
          clear: both;
          content: ' ';
        }

        .left {
          float: left;
          width: 50%;
          height: 206px;
          box-sizing: border-box;

          .list {
            width: 100%;
            height: 206px;

            &:after {
              display: block;
              clear: both;
              content: ' ';
            }

            .item {
              float: left;
              position: relative;
              padding: 20px;
              width: 50%;
              height: 50%;

              .photo {
                position: absolute;
                top: 20px;
                left: 20px;
              }

              .message {
                position: absolute;
                top: 25px;
                left: 100px;

                .number {
                  font-size: 22px;
                  color: #3c6bf4;

                  > span {
                    padding-left: 10px;
                    font-size: 16px;
                  }
                }
              }
            }
          }
        }

        .right {
          float: right;
          padding: 40px 0;
          width: 20%;
          height: 206px;
          box-sizing: border-box;

          .data {
            margin-bottom: 10px;
            overflow: hidden;

            .state {
              display: inline-block;
              width: 50px;
              text-align: right;
            }

            .image {
              margin-top: -2px;
              display: inline-block;
              width: 18px;
              height: 18px;
              vertical-align: middle;
            }
          }
        }

        .image-box {
          float: left;
          margin-left: 216px;
          padding: 40px 0;
          width: 100px;
          height: 206px;
          text-align: center;
          box-sizing: border-box;

          > img {
            width: 100px;
            height: 100px;
          }
        }
      }

      .group {
        margin-top: 10px;
        width: 100%;
        height: 100%;
        border: 1px solid #dededf;

        .group-tit {
          width: 100%;
          height: 48px;
          line-height: 48px;
          border-bottom: 1px solid #dededf;
          border-top: none;
          background-color: #fff;

          &:after {
            display: block;
            clear: both;
            content: ' ';
          }

          &:last-child {
            border-bottom: none;
          }

          .node {
            float: left;
            width: 20%;
            text-align: center;
          }
          .location {
            float: left;
            width: 10%;
            text-align: center;
          }
          .status {
            float: left;
            width: 7%;
            text-align: center;
          }
          .blockHeight {
            float: left;
            width: 14%;
            text-align: center;
          }
          .currentHash {
            float: left;
            width: 27%;
            text-align: center;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
          .currentTime {
            float: left;
            width: 22%;
            text-align: center;
          }
        }
      }
    }
  }
</style>
