<template>
<div class="aside">
    <el-menu class="el-menu-vertical-demo" router text-color="#fff" active-text-color="#ffd04b" :collapse="$store.state.isCollapse" background-color="#545c64" style='overflow:hidden;'>
        <div>
            <el-button  @click.native="slidelay" style="width:100%;background-color:#545c64;border:none;color:#fff">
                <span v-if="$store.state.isCollapse"><img src="static/img/extends-default.png" alt=""></span>
                <span v-if="!$store.state.isCollapse"><img src="static/img/extends-1.png" alt=""></span>
            </el-button>
        </div>
        <div v-for="(item,index) in onenav" v-bind:key="item.nodeCode">
            <!-- 有多级导航栏显示这个 -->
            <el-submenu   @click.native="gettwonav(item.nodeCode,index)" v-if="item.childFlag==1" :index='item.id+""'>
                <template slot="title">
                <img :src="item.iconUrl">
                <span slot="title">{{ item.nodeName }}</span>
                </template>
                <el-menu-item-group v-for="(info) in twonav1[index]" :key="info.activeUrl"  >
                    <el-menu-item :index="info.activeUrl" style="margin-left:25px"> {{ info.nodeName }} </el-menu-item>
                </el-menu-item-group>
            </el-submenu>
            <!-- 只有一级导航栏显示以下内容 -->
            <el-menu-item v-if="item.childFlag!=1" :index="item.activeUrl"> 
              <img :src="item.iconUrl" style="width:16px;">
              <!-- <i class="el-icon-location"></i> -->
              <span slot="title">{{ item.nodeName }}</span>
            </el-menu-item>
        </div>
    </el-menu>
</div>
</template>

<script>
export default {
  data() {
    return {
      onenav: [],
      twonav1: {},
    };
  },
  methods: {
    //获取一级导航栏
    getonenav() {
      this.axios.get(this.api.getOneNav).then(res => {
        let nav = res.data.data.result;
        // if(nav == null ||　nav.length == 0){
        //   this.$alert('很抱歉，您未登录或无使用权限','提示',{  confirmButtonText: '确定', })
        // }
        for (var i = 0; i < nav.length; i++) {
          var j = i + 1;
          nav[i].id = j;
        }
        this.onenav = nav;
      });
    },
    //获取二级导航栏
    gettwonav(id, index) {
      this.axios.get(`${this.api.getOneNav}?parentNodeCode=${id}`).then(res => {
        //通过添加一个对象来渲染数据
        let data = res.data.data.result;
        //在修改定义好的数据时，要是用vue中封装好的修改数据的方法视图才会及时更新
        this.$set(this.twonav1,index,data);
      });
    },
    //通过点击来伸缩侧边导航栏
    slidelay(){
      this.$store.state.isCollapse = !this.$store.state.isCollapse;
      if(!this.$store.state.isCollapse){
        let dat = document.querySelector('aside');
        dat.style.width = 202 + 'px';
      }else{
        let dat = document.querySelector('aside');
        dat.style.width = '';
      }
    }
  },
  computed: {
    defaultActive: function() {
      return this.$route.path.replace("/", "");
    }
  },
  created() {
    this.getonenav();
  },
};
</script>

<style scoped lang="less">

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  height: 100%;
}
.el-menu--collapse{
  height: 100%;
}
.aside{
    height: 100%;
    width: 100%;
}
.el-submenu img{
  margin-right: 26px;
}
.el-menu-item img{
  margin-right: 26px 
}
.el-menu-item img{
  width: 16px;
  height: 16px;
}
.el-menu-item-group__title{
  display: none;
}
.el-submenu__title img {
  width: 16px;
  height: 16px;
}
</style>
