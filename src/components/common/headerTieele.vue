<template>
    <el-breadcrumb separator="/" class="hed">
        <el-breadcrumb-item class="title">{{title}}</el-breadcrumb-item>
    </el-breadcrumb>
</template>

<script>
export default {
  props: ["title"]
};
</script>

<style lang="less" scoped>
.hed {
  position: relative;
  width: 100%;
  height: 40px;
  line-height: 40px;
  border-bottom: 1px solid #dcdcdc;
  margin-bottom: 10px;
  .title {
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    border-left: 5px solid #409EFF;
    padding-left: 8px;
    line-height: 20px;
  }
}
</style>

