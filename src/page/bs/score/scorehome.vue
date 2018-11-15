<template>
    <el-row class="warp" style="padding:2px;margin-bottom:50px">
        <el-col :span="24" class="warp-breadcrum" style="padding:10px">
            <app-title :title="scoreTitle"></app-title>
        </el-col>

        <el-col :span="24" class="warp-main" element-loading-text="拼命加载中">
            TOKEN ID
            <div>{{this.tokenId}}</div>
        </el-col>
    </el-row>
</template>

<script>
export default {
    data(){
        return{
            scoreTitle: '积分商城',
            tokenId: '无'
        }
    },
    methods: {
    },
    mounted(){
        this.tokenId = this.$route.params.tokenid;
    },
    watch: {
        $route: {
            handler(val){
                this.tokenId = this.$route.params.tokenid;
            }
        }
    }
}
</script>
