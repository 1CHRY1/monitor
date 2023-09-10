<template>
    <div id='main'>
        <div id="pop" v-show="false"></div>
        <div id="container">
        </div>
    </div>
</template>
<script lang="ts" setup>
import mapboxgl from 'mapbox-gl';
import "mapbox-gl/dist/mapbox-gl.css"
import { onMounted, createApp, App, ComponentPublicInstance, ref, reactive } from 'vue';
import axios from 'axios';
import * as turf from '@turf/turf';
import PopupVisual from '@/components/visual/popupVisual.vue';
import { WaterStation } from '@/type';
import { number } from 'echarts';




const lng = ref(0)
const lat = ref(0)
const WaterVarying = ref(0)
const nearStation_1 = reactive({name:'null',lng:0,lat:0,water:0})
const nearStation_2 = reactive({name:'null',lng:0,lat:0,water:0})
// const info = reactive({ lnglat: { lng: 0, lat: 0 }, water: 0, nearStations: [] })
const pop = new mapboxgl.Popup({ maxWidth: '400px' })


let ap: App | null = null;
let apd: ComponentPublicInstance | null = null;


let CJ_Layerdata: any = null;
//站点数据
const stations = new Map([
    ["anqing", { lng: 117.133573, lat: 30.5504 }],
    ["wuhu", { lng: 118.342176, lat: 30.5504 }],
    ["nanjing", { lng: 118.774702, lat: 30.5504 }],
    ["zhenjiang", { lng: 119.419657, lat: 30.5504 }],
    ["jiangyin", { lng: 120.27385, lat: 30.5504 }],
    ["xiashigang", { lng: 120.436864, lat: 30.5504 }],
    ["tianshenggang", { lng: 120.755695, lat: 30.5504 }],
    ["xuliujing", { lng: 120.992422, lat: 30.5504 }],
    ["yanglin", { lng: 121.269822, lat: 30.5504 }],
    ["wusong", { lng: 121.520963, lat: 30.5504 }],
]);


const initMap = async () => {
    const map = new mapboxgl.Map({
        container: 'container',
        style: 'mapbox://styles/johnnyt/clld6armr00f901q0dyqh7452',
        center: [120.861, 31.8813],
        zoom: 10,
        accessToken: 'pk.eyJ1Ijoiam9obm55dCIsImEiOiJja2xxNXplNjYwNnhzMm5uYTJtdHVlbTByIn0.f1GfZbFLWjiEayI6hb_Qvg'
    });

    map.on('load', async () => {
        // 添加长江面图层    
        axios.get('/resource/changjiang2.geojson').then((res) => {
            let feature = res.data.features[0];

            map.addSource('CJ', {
                type: 'geojson',
                data: feature,
            });

            map.addLayer({
                id: 'CJLayer',
                type: 'fill',
                source: 'CJ',
                paint: {
                    "fill-color": "blue",
                    "fill-opacity": 0.5
                }
            });



            map.on('mousemove', "CJLayer", e => {
                const nearStation = findNearStation(e.lngLat.lng, e.lngLat.lat);
                const hereWater = Interpolate(nearStation, e.lngLat.lng, e.lngLat.lat);

                showInfoWindow(map, e.lngLat.lng, e.lngLat.lat, hereWater, nearStation);
            })

            map.on('mouseleave', 'CJLayer', () => {
                console.log('mouse leave the CJLayer.');
                pop.remove();
            });

        }).catch((err) => {
            console.log(err);
        })

    })
}



const findNearStation = (lng: number, lat: number) => {
    //find near station
    //request water

    //循环，求最近的两站点
    let from, to;
    let minDis1 = 100000, minDis2 = 100000;
    let minName1, minName2;
    from = turf.point([lng, lat]);
    for (let item of stations) {
        to = turf.point([item[1].lng, item[1].lat]);
        let dis = turf.distance(from, to);
        if (dis < minDis1) {
            minDis1 = dis;
            minName1 = item[0];
        }
    }
    from = turf.point([lng, lat]);
    for (let item of stations) {
        to = turf.point([item[1].lng, item[1].lat]);
        let dis = turf.distance(from, to);
        if (dis < minDis2 && dis > minDis1) {
            minDis2 = dis;
            minName2 = item[0];
        }
    }
    //request station water
    let station1: WaterStation = {
        name: minName1!,
        lng :stations.get(minName1!)!.lng,
        lat :stations.get(minName1!)!.lat,
        water: 1
    }
    let station2: WaterStation = {
        name: minName2!,
        lng :stations.get(minName2!)!.lng,
        lat :stations.get(minName2!)!.lat,
        water: 2
    }
    return [station1, station2];
}

const Interpolate = (S: WaterStation[], herelng: number, herelat: number) => {
    //三角形计算
    let P = turf.point([herelng, herelat]);
    let A = turf.point([S[0].lng, S[0].lat]);
    let B = turf.point([S[1].lng, S[1].lat]);
    let AB_line = turf.lineString([[S[0].lng, S[0].lat], [S[1].lng, S[1].lat]]);
    let AP_length = turf.distance(A, P);
    let BP_length = turf.distance(B, P);
    let tri_height = turf.pointToLineDistance(P, AB_line);
    let AC_length = Math.sqrt(AP_length * AP_length - tri_height * tri_height);
    let BC_length = Math.sqrt(BP_length * BP_length - tri_height * tri_height);
    //单线性插值
    let result = S[0].water! * AC_length / (AC_length + BC_length) + S[1].water! * BC_length / (AC_length + BC_length);

    return result;
}

const showInfoWindow = (map: mapboxgl.Map, elng: number, elat: number, ewater: number, enearStations: WaterStation[]) => {
    lng.value = Number(elng.toFixed(6));
    lat.value = Number(elat.toFixed(6));
    WaterVarying.value = Number(ewater.toFixed(6));
    nearStation_1.name = enearStations[0].name;
    nearStation_1.lng = Number(enearStations[0].lng.toFixed(6));
    nearStation_1.lat = Number(enearStations[0].lat.toFixed(6));
    nearStation_1.water = Number(enearStations[0].water!.toFixed(6));

    nearStation_2.name = enearStations[1].name;
    nearStation_2.lng = Number(enearStations[1].lng.toFixed(6));
    nearStation_2.lat = Number(enearStations[1].lat.toFixed(6));
    nearStation_2.water = Number(enearStations[1].water!.toFixed(6));

     pop.setLngLat([elng, elat])
        .setDOMContent(apd!.$el)
        .addTo(map);
}


onMounted(async () => {
    await initMap();
    let info = {
        lng:lng,
        lat:lat,
        water:WaterVarying,
        station_1:nearStation_1,
        station_2:nearStation_2
    }
    ap = createApp(PopupVisual,info);
    apd = ap!.mount('#pop');

    // ap!.unmount();
    //info 作为props创建了一个popupvisual实例，挂载到#pop上
    //解绑  成一个虚空的实例
    //再setDOMContent挂载到apd上
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