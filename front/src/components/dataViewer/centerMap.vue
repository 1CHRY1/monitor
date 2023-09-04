<template>
    <div class="scene-map-wrapper" :order="$props.order">
        <div id="map"></div>
    </div>
</template>
  
  
<script setup lang='ts'>
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { onMounted } from '@vue/runtime-core';
import { MapDataPreparer } from '@/utils/viewerData';
import { ref } from 'vue';

interface Props {
    mapId: string,
    order: string,
    projectId: string
}

const props = defineProps<Props>();

const mapDataPreparer = new MapDataPreparer();

let sectionData = await mapDataPreparer.prepareSectionDataSource(props.projectId)

onMounted(() => {
    // mapbox key
    mapboxgl.accessToken = 'pk.eyJ1Ijoiam9obm55dCIsImEiOiJja2xxNXplNjYwNnhzMm5uYTJtdHVlbTByIn0.f1GfZbFLWjiEayI6hb_Qvg';

    const map = new mapboxgl.Map(
        {
            container: 'map',
            style: 'mapbox://styles/johnnyt/clld6armr00f901q0dyqh7452',
            center: [121.166, 31.770],
            zoom: 9.70
        }
    )

    map.on('load', async () => {
        map.addSource('section', {
            'type': 'geojson',
            'data': sectionData[0] as any
        })

        map.addSource('sectionPt', {
            'type': 'geojson',
            'data': sectionData[1] as any
        })

        map.addLayer({
            'id': 'section',
            'type': 'line',
            'source': 'section',
            'paint': {
                'line-color': '#FAB10E',
                'line-width': [
                    'interpolate', ["linear"], ['zoom'],
                    1, 1,
                    5, 2,
                    10, 4,
                    22, 16
                ],
            }
        })

        map.addLayer({
            'id': 'sectionLabel',
            'type': 'symbol',
            'source': 'sectionPt',
            'layout': {
                'text-field': [
                    'format',
                    ['get', 'name'],
                    { 'font-scale': 0.8 },
                    '\n',
                    {},
                    ['get', 'angle'],
                    { 'font-scale': 0.5 }
                ],
                'text-variable-anchor': ["center", "left", "right", "top", "bottom", "top-left", "top-right", "bottom-left", "bottom-right"],
                'text-radial-offset': [
                    'interpolate', ["linear"], ['zoom'],
                    1, 0.07,
                    5, 0.0925,
                    10, 0.128,
                    22, 0.2
                ],
                'text-size': [
                    'interpolate', ["linear"], ['zoom'],
                    2, 0,
                    5, 4,
                    10, 16,
                    22, 64
                ],
                'text-font': ["Open Sans Bold"]
            },
            'paint': {
                'text-color': '#66fffa',
                'text-halo-color': '#009efa',
                'text-halo-width': [
                    'interpolate', ["linear"], ['zoom'],
                    1, 0,
                    5, 0,
                    9, 0.1,
                    10, 0.5,
                    22, 1.25
                ],
                'text-halo-blur': 0.3
            }
        })
    })

});

</script>
  
<style lang='scss'>
$orders: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10;

div.scene-map-wrapper {
    cursor: pointer;
    background-color: transparent;
    backdrop-filter: blur(8px);
    border-radius: 4px;
    width: 42%;
    height: 66%;

    div#map {
        border-radius: 4px;
        width: 100%;
        height: 100%;
        background: rgba(255, 255, 255, 0.2);
    }

    @each $order in $orders {
        &[order='#{$order}'] {
            order: $order;
        }
    }
}
</style>