<template>
    <div id = 'main'>
        <header></header>
        <div id="pop" style=" width: 0;height: 0;"></div>
        <div id="container">
        </div>
    </div>
</template>
<script lang="ts" setup>
import header from '@/layout/Header.vue';
import mapboxgl from 'mapbox-gl';
import "mapbox-gl/dist/mapbox-gl.css"
import { onMounted,defineComponent, createApp,App,ComponentPublicInstance } from 'vue';
import axios from 'axios';
import * as turf from '@turf/turf'
import PopupVisual from '@/components/visual/popupVisual.vue';
import {WaterStation} from '@/type'


let ap: App|null = null;
let apd:ComponentPublicInstance|null = null;




let CJ_Layerdata: any = null;
//站点数据
const stations = new Map([
            ["anqing", {lng:117.133573,lat: 30.5504}],
            ["wuhu", {lng:118.342176,lat: 30.5504}],
            ["nanjing", {lng:118.774702,lat: 30.5504}],
            ["zhenjiang", {lng:119.419657,lat: 30.5504}],
            ["jiangyin", {lng:120.27385,lat: 30.5504}],
            ["xiashigang", {lng:120.436864,lat: 30.5504}],
            ["tianshenggang", {lng:120.755695,lat: 30.5504}],
            ["xuliujing", {lng:120.992422,lat: 30.5504}],
            ["yanglin", {lng:121.269822,lat: 30.5504}],
            ["wusong", {lng:121.520963,lat: 30.5504}],
          ]);


const initMap = async ()=>{
    const map = new mapboxgl.Map({
    container: 'container',
    style: 'mapbox://styles/johnnyt/clld6armr00f901q0dyqh7452',
    center: [120.861, 31.8813],
    zoom: 10,
    accessToken:'pk.eyJ1Ijoiam9obm55dCIsImEiOiJja2xxNXplNjYwNnhzMm5uYTJtdHVlbTByIn0.f1GfZbFLWjiEayI6hb_Qvg'
    });

    map.on('load',async () => {
        // 添加长江面图层    
        axios.get('/resource/changjiang2.geojson').then((res)=>{
        let feature = res.data.features[0];

        map.addSource('CJ', {
            type:'geojson',
            data:feature,
        });

        map.addLayer({
            id:'CJLayer',
            type:'fill',
            source:'CJ',
            paint:{
                "fill-color":"blue",
                "fill-opacity":0.5
            }
        });

        // var marker:any = null;
        //点击事件 --> 计算信息
        map.on("click", "CJLayer", function (e) {
            //   if(marker!=null) {
            //     marker.remove();
            //   }
            //点击的地方加个点符号
            //   marker = new mapboxgl.Marker()
            //                 .setLngLat([e.lngLat.lng, e.lngLat.lat])
            //                 .addTo(map);
            //step1  计算最近两站点
            const nearStations = findNearStation(e.lngLat.lng,e.lngLat.lat);

            //step2  插值水位
            const hereWater = Interpolate(nearStations,e.lngLat.lng,e.lngLat.lat); 

            //step3  信息窗口显示  用vue
            showInfoWindow(map,e.lngLat.lng,e.lngLat.lat,hereWater,nearStations);
            });

        }).catch((err)=>{
            console.log(err);
        })
       
    })
}



const findNearStation = (lng:number,lat:number)=>{
    //find near station
    //request water

    //循环，求最近的两站点
    let from,to;
    let minDis1 = 100000 , minDis2 = 100000;
    let minName1,minName2;
    from = turf.point([lng,lat]);
    for(let item of stations){
        to = turf.point([item[1].lng,item[1].lat]);
        let dis = turf.distance(from,to);
        if(dis<minDis1){
            minDis1 = dis;
            minName1 = item[0];
        }
    }
    from = turf.point([lng,lat]);
    for(let item of stations){
        to = turf.point([item[1].lng,item[1].lat]);
        let dis = turf.distance(from,to);
        if(dis<minDis2 && dis>minDis1){
            minDis2 = dis;
            minName2 = item[0];
        }
    }
    //request station water
    let station1:WaterStation = {
        name:minName1!,
        pos:stations.get(minName1!)!,
        water:1
    }
    let station2:WaterStation = {
        name:minName2!,
        pos:stations.get(minName2!)!,
        water:2
    }
    return [station1,station2];
}

const Interpolate = (S:WaterStation[],herelng:number,herelat:number) => {
    //三角形计算
    let P = turf.point([herelng,herelat]);
    let A = turf.point([S[0].pos.lng,S[0].pos.lat]);
    let B = turf.point([S[1].pos.lng,S[1].pos.lat]);
    let AB_line = turf.lineString([[S[0].pos.lng,S[0].pos.lat],[S[1].pos.lng,S[1].pos.lat]]);
    let AP_length = turf.distance(A,P);
    let BP_length = turf.distance(B,P);
    let tri_height = turf.pointToLineDistance(P,AB_line);
    let AC_length = Math.sqrt(AP_length*AP_length - tri_height*tri_height);
    let BC_length = Math.sqrt(BP_length*BP_length - tri_height*tri_height);
    //单线性插值
    let result = S[0].water!*AC_length/(AC_length+BC_length) + S[1].water!*BC_length/(AC_length+BC_length); 

    return result;
}


const showInfoWindow = (map:mapboxgl.Map,lng:number,lat:number,water:number,nearStations:WaterStation[])=>{
    
    ap = createApp(PopupVisual,{lnglat : {lng,lat},water:water,nearStations:nearStations});
    apd = ap.mount('#pop');
    ap.unmount();
            
    new mapboxgl.Popup({maxWidth:'400px'})
        .setLngLat([lng,lat])
        .setDOMContent(apd.$el)
        .addTo(map);
    
}



onMounted(async()=>{
   await initMap();
})


</script>
<style lang="scss" scoped>

    #main {
        width: 100%;
        height: 100%;
        #container {
            width: 100%;
            height: 100%;
        }
    }

    
</style>