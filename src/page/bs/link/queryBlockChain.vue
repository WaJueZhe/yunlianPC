<template>
  <div class="queryBlockChain-page">
    <div class="top">
      <span>云单可信联盟链数据查询</span>
    </div>
    <div class="box">
      <div class="list">
        <div class="item">
          <img src="../../../../static/img/blockchain-1.png" alt="">
          <div class="title">数据高度</div>
          <div class="number" >{{ fromData.blockHeightTotal.sumBcHeight }}</div>
        </div>
        <div class="item">
          <img src="../../../../static/img/blockchain-2.png" alt="">
          <div class="title">交易笔数</div>
          <div class="number">{{ fromData.blockHeightTotal.sumTranCount }}</div>
        </div>
        <div class="item">
          <img src="../../../../static/img/blockchain-3.png" alt="">
          <div class="title">您贡献的数据高度</div>
          <div class="number">{{ fromData.userBlockHeightTotal.bcHeight }}</div>
        </div>
        <div class="item">
          <img src="../../../../static/img/blockchain-4.png" alt="">
          <div class="title">您贡献的交易笔数</div>
          <div class="number">{{ fromData.userBlockHeightTotal.bcTransactionCount }}</div>
        </div>
      </div>
    </div>
    <div class="search">
      <input type="text" placeholder="请输入哈希值查询 仅限运单查询数据上链情况" v-model="bcRtnTHash_search">

        <a class="actived"><img src="../../../../static/img/search.png" alt="" @click="search"></a>

      
    </div>
    <div class="group">
      <ul class="list">
        <li class="item" v-if="fromData.result.lenght !== ''">
          <div class="hash"> 数据哈希值</div>
          <div class="time">上链时间</div>
          <div class="blockHeight">区块高度</div>
        </li>
        <li class="item" v-for="(item,index) in fromData.result" :key="index">
          <div class="hash">{{ item.bcRtnTHash }}</div>
          <div class="time">{{ item.bcCommitTime }}</div>
          <div class="blockHeight">{{ item.bcRtnBHeight }}</div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      fromData: {
        result:[],
        blockHeightTotal:{
          sumBcHeight:"0",
          sumTranCount:"0"
        },
        userBlockHeightTotal:{
          bcHeight:"0",
          bcTransactionCount:"0"
        }
      },
      bcRtnTHash_search: "",
      show: true
    };
  },
  methods: {
    search() {
      let p = {
        bcRtnTHash: this.bcRtnTHash_search
      };
      this.axios
        .post(`${this.api.baseURL}/bcSumData/queryBcSumData`, p)
        .then(res => {
          this.fromData = res.data.data;
          console.log(this.fromData);
        });
    }
  },
  mounted() {
    this.search();
  },
  components: {}
};
</script>

<style lang="less" scoped>
.queryBlockChain-page {
  margin-left: -2px;
  padding: 0 20px;
  width: 100%;
  height: 100%;
  background-color: #eaedf1;

  .top {
    height: 60px;
    line-height: 60px;
    text-align: center;
    font-size: 20px;
    color: black;

    > span {
      padding: 0 10px;
      border-left: 5px solid black;
    }
  }

  .box {
    padding: 0 80px;

    .list {
      display: flex;
      justify-content: space-between;

      .item {
        float: left;
        width: 230px;
        height: 200px;
        text-align: center;
        background-color: #fff;
        border: 1px solid #dbdbdb;
        box-shadow: 0 1px 18px #ccc;
        box-sizing: border-box;

        > img {
          padding-top: 30px;
        }

        .title {
          padding-top: 24px;
        }

        .number {
          padding-top: 8px;
          font-size: 26px;
        }
      }
    }
  }

  .search {
    position: relative;
    margin: 20px auto;
    width: 838px;
    height: 50px;
    border-radius: 6px;
    border: 1px solid #ccc;
    background-color: #fff;

    > input {
      padding-left: 30px;
      width: 776px;
      height: 100%;
      border: none;
      outline: none;
      border-radius: 6px;
    }

    > a {
      position: absolute;
      top: 0;
      right: 0;
      display: inline-block;
      width: 60px;
      height: 100%;
      background-color: #2166ff;

      > img {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
  }

  .group {
    width: 100%;

    .list {
      width: 100%;

      .item {
        width: 100%;
        height: 40px;
        background-color: #fff;
        border-bottom: 1px solid #eee;

        > div {
          border-right: 1px solid #eee;

          &:last-child {
            border-right: none;
          }
        }

        .identifying {
          float: left;
          width: 30%;
          height: 40px;
          line-height: 40px;
          text-align: center;
        }
        .release {
          float: left;
          width: 10%;
          height: 40px;
          line-height: 40px;
          text-align: center;
        }
        .time {
          float: left;
          width: 20%;
          height: 40px;
          line-height: 40px;
          text-align: center;
        }
        .hash {
          float: left;
          width: 60%;
          height: 40px;
          line-height: 40px;
          text-align: center;
        }
        .blockHeight {
          float: left;
          width: 20%;
          height: 40px;
          line-height: 40px;
          text-align: center;
        }
      }
    }
  }
}

.actived:active {
  border: 1px solid red;
}
</style>
