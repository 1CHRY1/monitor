<template>
    <div class="scene-map-wrapper" :order="mapOrder">
        <div id="map"></div>
    </div>
</template>
  
  
<script setup lang='ts'>
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { onMounted } from '@vue/runtime-core';
// import { frontData } from '../../frontData';
import { ref } from 'vue';

interface Props {
    mapId: string, 
    order: string
}

const props = defineProps<Props>();

const mapIndex = ref(props.mapId);

const mapOrder = ref(props.order);

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