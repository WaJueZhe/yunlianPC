<template>
    <el-row class="warp" style="padding:2px;margin-bottom:50px">
        <el-col :span="24" class="warp-breadcrum" style="padding:10px">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }"><b>首页</b></el-breadcrumb-item>
            <el-breadcrumb-item>消息管理</el-breadcrumb-item>
        </el-breadcrumb>
        </el-col>
    <h2>消息管理</h2>
    </el-row>
</template>
