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
import { getPredictionStation, getAllPredictionValue, getRegionTideStation, getWaterLevelByStationAndTime } from '@/api/request';
import { type StringKeyObject, convertRegionTideStationData2Geojson } from '@/utils/viewerData';

const lng = ref(0)
const lat = ref(0)
const WaterVarying = ref(0)
const nearStation_1 = reactive({ name: 'null', lng: 0, lat: 0, water: 0 })
const nearStation_2 = reactive({ name: 'null', lng: 0, lat: 0, water: 0 })
// const info = reactive({ lnglat: { lng: 0, lat: 0 }, water: 0, nearStations: [] })
const pop = new mapboxgl.Popup({ maxWidth: '400px' })


let ap: App | null = null;
let apd: ComponentPublicInstance | null = null;


let CJ_Layerdata: any = null;

const stations: Map<string, WaterStation> = new Map();


// let stPtCollection: StringKeyObject = {
//     'type': 'FeatureCollection',
//     'features': <Array<StringKeyObject>>[]
// }

const initStationData = async () => {
    const backend_stations = await getPredictionStation();
    const backend_values = await getAllPredictionValue();

    const stDATA = backend_stations?.data;

    for (let i = 0; i < stDATA.length; i++) {
        stations!.set(stDATA[i].nameEn, {
            name: stDATA[i].name,
            nameEn: stDATA[i].nameEn,
            lng: stDATA[i].longitude,
            lat: stDATA[i].latitude,
            water: 0,
        });

        // const aPtFeat = {
        //     "type": "Feature",
        //     "geometry": {
        //         "type": "Point",
        //         "coordinates": [
        //             stDATA[i].longitude, stDATA[i].latitude
        //         ],
        //     },
        //     "properties": {
        //         "name": stDATA[i].name,
        //     }
        // }
        // stPtCollection.features.push(aPtFeat);

    }
    const waterData = backend_values?.data;
    for (let i = 0; i < waterData.length; i++) {
        //console.log(waterData[i].name);//this name is nameEn
        stations!.get(waterData[i].name)!.water = waterData[i].res.value[0];
    }
    console.log("water data", waterData)
}

const curTime = new Date();
const curTimeStr = curTime.getFullYear() + '-0' + (curTime.getMonth() + 1) + '-' + curTime.getDate() + ' ' + curTime.getHours() + ':' + curTime.getMinutes() + ':' + curTime.getSeconds();
const ysdTime = new Date(+curTime - 24*3600*1000);
const ysdTimeStr = ysdTime.getFullYear() + '-0' + (ysdTime.getMonth() + 1) + '-' + ysdTime.getDate() + ' ' + ysdTime.getHours() + ':' + ysdTime.getMinutes() + ':' + ysdTime.getSeconds();

const initMap = async (map: mapboxgl.Map) => {

    await initStationData();

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
                    "fill-opacity": 0.
                }
            });

            map.on('mousemove', "CJLayer", e => {
                const nearStation = findNearStation(e.lngLat.lng, e.lngLat.lat);
                const hereWater = Interpolate(nearStation, e.lngLat.lng, e.lngLat.lat);

                showInfoWindow(map, e.lngLat.lng, e.lngLat.lat, hereWater, nearStation);
            })
            map.on('mouseenter', 'CJLayer', () => {
                map.getCanvas().style.cursor = 'crosshair'
            });

            map.on('mouseleave', 'CJLayer', () => {
                pop.remove();
                map.getCanvas().style.cursor = ''
            });

        }).catch((err) => {
            console.log(err);
        })

        

    })
}

const initStationsLayer = async (map: mapboxgl.Map) => {
    const regionStation = await getRegionTideStation();
    const regionStationGeojson = convertRegionTideStationData2Geojson(regionStation?.data);

    map.loadImage(
            '/resource/tideStation.png',
            (error, image) => {
                if (error) throw error;

                map.addImage('tideStation', image as (HTMLImageElement | ImageBitmap));

                map.addSource('stations', {
                    type: 'geojson',
                    data: regionStationGeojson as any,
                });

                map.addLayer({
                    id: 'stations-icon',
                    type: 'symbol',
                    source: 'stations',
                    layout: {
                        'icon-image': 'tideStation',
                        'icon-size': [
                            'interpolate', ["linear"], ['zoom'],
                            0, 0.007,
                            5, 0.0125,
                            10, 0.128,
                            22, 0.5
                        ],
                        'icon-allow-overlap': true
                    }
                })

                map.addLayer({
                    'id': 'station-label',
                    'type': 'symbol',
                    'source': 'stations',
                    'layout': {
                        'text-field': [
                            'format',
                            ['get', 'name'],
                            { 'font-scale': 0.8 },
                        ],
                        'text-variable-anchor': ["bottom", "bottom-left", "bottom-right"],
                        'text-radial-offset': [
                            'interpolate', ["linear"], ['zoom'],
                            2, 0.5,
                            5, 2,
                            10, 2,
                            22, 4
                        ],
                        'text-size': [
                            'interpolate', ["linear"], ['zoom'],
                            2, 0,
                            5, 10,
                            10, 18,
                            22, 56
                        ],
                        'text-font': ["Open Sans Bold"]
                    },
                    'paint': {
                        'text-color': '#ebe5ff',
                        'text-halo-color': '#f0800f',
                        'text-halo-width': [
                            'interpolate', ["linear"], ['zoom'],
                            1, 0,
                            5, 0.2,
                            9, 0.1,
                            10, 0.5,
                            22, 1.
                        ],
                        'text-halo-blur': 0.3
                    }
                })

                map.on('mouseenter', 'stations-icon', () => {
                    map.getCanvas().style.cursor = 'pointer'
                })
                map.on('mouseleave', 'stations-icon', () => {
                    map.getCanvas().style.cursor = ''
                })
            }
        )

        for (let aStation of regionStationGeojson.features) {
            const stationData = await getWaterLevelByStationAndTime(aStation.properties.type, aStation.properties.name, ysdTimeStr, curTimeStr);
            console.log(aStation.properties.name, stationData?.data);
        }
}

const findNearStation = (lng: number, lat: number) => {
    //find near station
    //request water

    //循环，求最近的两站点
    let from, to;
    let minDis1 = 100000, minDis2 = 100000;
    let minName1, minName2;
    from = turf.point([lng, lat]);
    console.log(stations.size);

    for (let item of stations) {
        // console.log(item);
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
        nameEn: minName1!,
        name: stations.get(minName1!)!.name,
        lng: stations.get(minName1!)!.lng,
        lat: stations.get(minName1!)!.lat,
        water: stations.get(minName1!)!.water
    }
    let station2: WaterStation = {
        nameEn: minName2!,
        name: stations.get(minName2!)!.name,
        lng: stations.get(minName2!)!.lng,
        lat: stations.get(minName2!)!.lat,
        water: stations.get(minName2!)?.water
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
    nearStation_1.name = enearStations[0].name!;
    nearStation_1.lng = Number(enearStations[0].lng.toFixed(6));
    nearStation_1.lat = Number(enearStations[0].lat.toFixed(6));
    nearStation_1.water = Number(enearStations[0].water!.toFixed(6));

    nearStation_2.name = enearStations[1].name!;
    nearStation_2.lng = Number(enearStations[1].lng.toFixed(6));
    nearStation_2.lat = Number(enearStations[1].lat.toFixed(6));
    nearStation_2.water = Number(enearStations[1].water!.toFixed(6));

    pop.setLngLat([elng, elat])
        .setDOMContent(apd!.$el)
        .addTo(map);
}


onMounted(async () => {
    const map = new mapboxgl.Map({
        container: 'container',
        style: 'mapbox://styles/johnnyt/clld6armr00f901q0dyqh7452',
        center: [120.861, 31.8813],
        zoom: 10,
        accessToken: 'pk.eyJ1Ijoiam9obm55dCIsImEiOiJja2xxNXplNjYwNnhzMm5uYTJtdHVlbTByIn0.f1GfZbFLWjiEayI6hb_Qvg'
    });
    await initMap(map);
    let info = {
        lng: lng,
        lat: lat,
        water: WaterVarying,
        station_1: nearStation_1,
        station_2: nearStation_2
    }
    ap = createApp(PopupVisual, info);
    apd = ap!.mount('#pop');

    await initStationsLayer(map);
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