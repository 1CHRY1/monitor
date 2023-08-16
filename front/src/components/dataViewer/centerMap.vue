<template>
    <div class="scene-map-wrapper">
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
}

const props = defineProps<Props>();

const mapIndex = ref(props.mapId);

onMounted(() => {
    // mapbox key
    mapboxgl.accessToken = 'pk.eyJ1Ijoiam9obm55dCIsImEiOiJja2xxNXplNjYwNnhzMm5uYTJtdHVlbTByIn0.f1GfZbFLWjiEayI6hb_Qvg';

    const map = new mapboxgl.Map(
        {
            container: 'map',
            style: 'mapbox://styles/johnnyt/clld6armr00f901q0dyqh7452',
            center: [121.166, 31.770], 
            zoom:9.70
        }
    )

});

</script>
  
<style lang='scss'>
div.scene-map-wrapper {
    cursor: pointer;
    background-color: transparent;
    backdrop-filter: blur(8px);
    border-radius: 4px;
    width: 38%;
    height: 66%;

    div#map {
        border-radius: 4px;
        width: 100%;
        height: 100%;
        background: rgba(255, 255, 255, 0.2);
    }
}
</style>