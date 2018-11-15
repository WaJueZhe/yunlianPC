<template>
    <div style="width:100%;height:100%;overflow:hidden;">
        <el-form :model="filter"  ref="filter" class="centerRow">
            <el-row :gutter="20" class="centerRow_col">
                <el-col :span="16" class="center_col">
                    <el-form-item label="" prop="vehicleNO" style="float:left">
                        <el-input size="small" v-model="filter.vehicleNO" auto-complete="off" style="width:100px" placeholder="车牌号码" class="addInt"></el-input>
                    </el-form-item>

                    <!-- 日期选择器 -->
                    <el-form-item label="" prop="gpsTimeFrom" style="float:left">
                        <el-date-picker size="small" type="datetime" v-model="filter.gpsTimeFrom"  style="width:200px" value-format="yyyy-MM-dd HH:mm" placeholder="开始时间" class="addInt" :picker-options="pickerOptions1"></el-date-picker>
                    </el-form-item>

                    <el-form-item label="" prop="gpsTimeTo" style="float:left">
                        <el-date-picker size="small" type="datetime" v-model="filter.gpsTimeTo"  style="width:200px" value-format="yyyy-MM-dd HH:mm" placeholder="结束时间" class="addInt" :picker-options="pickerOptions1"></el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="8" class="center_col col1">
                    <el-button type="primary" @click.native="queryGps" size="small">查询</el-button>
                    <el-button v-show="isShowFull" size="small" @click.native="changeScreenSize('full')">全屏</el-button>
                    <el-button v-show="isShowSmall" size="small" @click.native="changeScreenSize('small')">居中</el-button>
                    <el-button size="small" @click.native="close">退出</el-button>
                </el-col>
            </el-row>

        </el-form>

        <!-- <div id="mapContainer" ref="mapContainer" style="width:99%;height:99%;"></div> -->
        <div id="mapContainer" ref="mapContainer" class="map" :class="{ active:map == 1 }"></div>
    </div>
</template>

<script scoped>

var map = null;
export default {
    props: ["selectedTaskRow"],
    data() {
        return {
        active:false,
        map:0,
        filter: {
            vehicleNO: "云A3PV09",
            gpsTimeFrom: '',
            gpsTimeTo: ''
        },
        taskObject: {},
        screenSize: 'small',
        sizeDesc: '全屏',
        isShowFull: true,
        isShowSmall: false,
        pickerOptions1: {
            shortcuts: [
            {
                text: "今天",
                onClick(picker) {
                picker.$emit("pick", new Date());
                }
            },
            {
                text: "昨天",
                onClick(picker) {
                const date = new Date();
                date.setTime(date.getTime() - 3600 * 1000 * 24);
                picker.$emit("pick", date);
                }
            },
            {
                text: "一周前",
                onClick(picker) {
                const date = new Date();
                date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit("pick", date);
                }
            }
            ]
        }
        };
    },
    watch: {
        //selectedTaskRow 实现从父组件向子组件赋值的功能
        selectedTaskRow(val) {
            //console.log(val);
            this.taskObject = val;
            this.setDefaultValue();
            this.queryGps();
        }
    },
    created() {
        //console.log("111111111111111111111111")
        //console.log(this.selectedTaskRow);
        this.taskObject = this.selectedTaskRow;
        this.setDefaultValue();
        this.queryGps();
    },
    methods: {
        // 设置时间
        setDefaultValue: function(){
            this.filter.vehicleNO = this.taskObject.vehicleNo;
            this.filter.gpsTimeFrom = this.taskObject.deliverPlanDate + ":00";
            this.filter.gpsTimeTo = this.taskObject.unloadPlanDate + ":00";
        },
        //GCJ-02 to BD-09  
        bd_encrypt : function (gcjLat, gcjLon) {
            //console.log('convert gct to BD:' + gcjLat + "   " + gcjLon);
            let x = gcjLon, y = gcjLat;    
            let z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * 3.14159265358979324 * 3000.0 / 180.0);    
            let theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * 3.14159265358979324 * 3000.0 / 180.0);    
            let bdLon = z * Math.cos(theta) + 0.0065;    
            let bdLat = z * Math.sin(theta) + 0.006;
            //console.log('converted to BD:' + bdLat + "   " + bdLon);
            return {'lat' : bdLat,'lon' : bdLon};  
        },  
        close(){
            this.$emit("closeGpsDlg", '');
        },
        queryGps: function(){
            //console.log("query GPS Data ...")
            //console.log(this.filter)
    
            if (map == null)
                map = new BMap.Map("mapContainer");
            else
                map.clearOverlays();

            if ((this.filter.vehicleNO) && (this.filter.vehicleNO != "") && 
                (this.filter.gpsTimeFrom) && (this.filter.gpsTimeFrom != "") && 
                (this.filter.gpsTimeTo) && (this.filter.gpsTimeTo != "")){
                    let that = this;
                    this.filter.gpsTimeFrom = this.filter.gpsTimeFrom +":00";
                    this.filter.gpsTimeTo = this.filter.gpsTimeTo +":00";
                    let p = {jsonString: JSON.stringify(this.filter)};
                    that.axios
                        .post(`${this.api.baseURL}/gpsAllData/getGpsDataByVehicleNoDate`, p)
                        .then(function(result) {
                            //console.log(result);
                            if (result && result.status == "200") {
                                let t = result.data.data.result;
                                that.addLine(t);
                                that.addStartAndEndPoints();
                                //that.$message.success({ showClose: true, message: "find something", duration: 2000 });
                            } else {
                                that.$message.error({showClose: true, message: "未找到符合条件的记录！", duration: 2000 });
                            }
                        });
            }else{
                this.$message.error('请输入开始日期和结束日期');
            }
        },
        addStartAndEndPoints(){
            if ((this.taskObject.deliveryLongitudeX) && (this.taskObject.deliveryLongitudeX != "")){
                var myIcon = new BMap.Icon(`${this.api.weburl}static/img/icon_st.png`, new BMap.Size(30,30), {
                    anchor : new BMap.Size(15, 35)
                });
                // 创建标注对象并添加到地图    起点
                var tmpPoint = this.bd_encrypt(this.taskObject.deliveryLongitudeY, this.taskObject.deliveryLongitudeX);
                var bPoint = new BMap.Point(tmpPoint.lon, tmpPoint.lat);
                map.centerAndZoom(bPoint, 8); 
                var marker = new BMap.Marker(bPoint, {icon : myIcon});  // 自定义图标暂未调通
                //var marker = new BMap.Marker(bPoint);
                if (map == null)
                    map = new BMap.Map("mapContainer");
                map.addOverlay(marker);
                var label = new BMap.Label(this.taskObject.deliverFullAddress, {offset:new BMap.Size(0,-25)});
                label.setStyle({border:"none"});
                marker.setLabel(label);

                myIcon = new BMap.Icon(`${this.api.weburl}static/img/icon_en.png`, new BMap.Size(30,30), {
                    anchor : new BMap.Size(15, 35)
                });
                var tmpPoint = this.bd_encrypt(this.taskObject.unloadLongitudeY, this.taskObject.unloadLongitudeX);
                bPoint = new BMap.Point(tmpPoint.lon, tmpPoint.lat);
                map.centerAndZoom(bPoint, 8); 
                //marker = new BMap.Marker(bPoint);
                marker = new BMap.Marker(bPoint, {icon : myIcon});
                map.addOverlay(marker);
                label = new BMap.Label(this.taskObject.unloadFullAddress, {offset:new BMap.Size(0,-25)});
                label.setStyle({border:"none"});
                marker.setLabel(label);
            }
            
        },
        changeScreenSize(type){
            if (type == "full"){
                this.screenSize = "full";
                this.map = 1;
            }else{
                this.screenSize = "small";
                this.map = 0;
            }
            this.isShowSmall = !this.isShowSmall;
            this.isShowFull = !this.isShowFull;
            this.$emit("screenSizeChange", this.screenSize); //触发父组件的事件，向父组件传值，父组件的相关代码如下：
        },
        // 实际运用的话可能ajax实时读取后台数据，加载到地图上。
        //在轨迹点上创建图标，并添加点击事件，显示轨迹点信息。
        addMarker: function(point, url) {
            var myIcon = new BMap.Icon(url, new BMap.Size(28, 35), {
                anchor : new BMap.Size(15, 35)
            });
            // 创建标注对象并添加到地图   
            var tmpPoint = this.bd_encrypt(point.lat, point.lon);
            var bPoint = new BMap.Point(tmpPoint.lon, tmpPoint.lat);
            console.log(bPoint);
            //var bPoint = new BMap.Point(point.lon, point.lat);
            var marker = new BMap.Marker(bPoint, {
                icon : myIcon
            });
            map.addOverlay(marker);
        },
        //添加线
        addLine: function(points) {
            var linePoints = [], pointsLen = points.length;
            var tmpPoint = this.bd_encrypt(this.taskObject.deliveryLongitudeY, this.taskObject.deliveryLongitudeX);
            linePoints.push(new BMap.Point(tmpPoint.lon, tmpPoint.lat));
            if (pointsLen > 0) {
                // 创建标注对象并添加到地图   
                for (var i = 0; i < pointsLen; i++) {
                    tmpPoint = this.bd_encrypt(points[i].lat, points[i].lon);
                    //var bPoint = new BMap.Point(tmpPoint.lon, tmpPoint.lat);
                    linePoints.push(new BMap.Point(tmpPoint.lon, tmpPoint.lat));
                }
            }
            tmpPoint = this.bd_encrypt(this.taskObject.unloadLongitudeY, this.taskObject.unloadLongitudeX);
            linePoints.push(new BMap.Point(tmpPoint.lon, tmpPoint.lat));

            var polyline = new BMap.Polyline(linePoints, {
                strokeColor : "blue",
                strokeWeight : 6,
                strokeOpacity : 0.5
            }); //创建折线
            map.addOverlay(polyline); //增加折线
            this.setZoom(linePoints);
        },

        //根据点信息实时更新地图显示范围，让轨迹完整显示。设置新的中心点和显示级别. 
        //更新。设置不是每次增加点都重新设置显示范围。因为有可能会想放大了看。
        setZoom: function(bPoints) {
            var view = map.getViewport(eval(bPoints));
            if (map.oldView != JSON.stringify(view)) {
                var mapZoom = view.zoom;
                var centerPoint = view.center;
                map.centerAndZoom(centerPoint, mapZoom);
                map.oldView = JSON.stringify(view);
            }
        }    
    },
    mounted() {
        map = new BMap.Map("mapContainer");
        map.centerAndZoom(new BMap.Point(103.388611, 35.563611), 8);
        map.enableScrollWheelZoom(); //滚轮放大缩小
        var top_left_control = new BMap.ScaleControl({
            anchor: BMAP_ANCHOR_TOP_LEFT
        }); // 左上角，添加比例尺
        var top_left_navigation = new BMap.NavigationControl(); //左上角，添加默认缩放平移控件
        var top_right_navigation = new BMap.NavigationControl({
            anchor: BMAP_ANCHOR_TOP_RIGHT,
            type: BMAP_NAVIGATION_CONTROL_SMALL
        }); //右上角，仅包含平移和缩放按钮

        //添加控件和比例尺
        map.addControl(top_left_control);
        map.addControl(top_left_navigation);
        map.addControl(top_right_navigation);

        document.getElementsByClassName('el-dialog__body')[0].style.paddingTop = 0;
    },
};
</script>

<style lang="less" scoped>
    .centerRow {
        width: 100%;
        position: relative;
        height: 60px;
        .centerRow_col {
            width: 100%;
            height: 60px;
            line-height: 60px;
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            .center_col {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
            }
            .col1{
                right: 0;
            }
        }
    }
    .el-form-item{
        margin: 0
    }
    .map {
        width: 99%;
        height: 400px;
    }
    .active {
        height: 850px;
    }
</style>
