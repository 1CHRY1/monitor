<template>
    <div :index='chartOptId' class="double-chart-container" :styleId="styleId" :order="order">
        <div class="chart left"></div>
        <div class="chart right"></div>
    </div>
</template>
  
<script lang="ts">
export default {
    name: "chartContainer",
};
</script>
  
<script setup lang='ts'>
import * as echarts from 'echarts';
import { onMounted, ref, watch } from 'vue';
// import { frontData } from '../../frontData';

type EChartsOption = echarts.EChartsOption;

interface Props {
    chartId: string,
    order: string,
    styleType: string,
    projectId: number
}

const props = defineProps<Props>();

const chartOptId = ref(props.chartId);
const styleId = ref(props.styleType);
// const chartDom = ref<HTMLElement>();
const order = ref(props.order);
let projectId = ref(props.projectId);

//   let noShown = ref(props.notShown);

//   watch(()=>props.notShown, (oldShown, newShown)=> {
//       noShown.value = !newShown;
//       console.log(noShown.value);
//   });

onMounted(() => {
    // console.log(chartDom.value);
    // let chart = echarts.init(chartDom.value as HTMLElement)
    // let chartConfig = frontData['charts'][+(chartOptId.value as string)];
    // chart.setOption(chartConfig['chartOpt'] as EChartsOption)
    // if (chartConfig['dynamicFunc'] !== undefined) {
    //     setInterval(
    //         function () {
    //             (chartConfig['dynamicFunc'] as ((chart: echarts.ECharts) => void))(chart)
    //         }, 3000
    //     );
    // }
    // TODO: window.onsize doesn't work on components
    // window.onresize = function () {
    //     chart.resize();
    // };
});
</script>
  
<style lang='scss' scoped>
$orders: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10;

div.double-chart-container {
    transition: transform 1s ease-in-out;
    width: 30%;
    height: 32%;
    border-radius: 3px;
    background-color: transparent;
    // backdrop-filter: blur(4px);
    flex-grow: 0;

    display: flex;
    flex-flow: row no wrap;
    justify-content: space-around;

    &[styleId='1'] {
        width: 30%;
        height: 32%;
    }

    &[styleId='2'] {
        width: 14%;
        height: 22%;
    }

    &[styleId='3'] {
        height: 32%;
        width: 38%;
    }

    @each $order in $orders {
        &[order='#{$order}'] {
            order: $order;
        }
    }

    div {
        canvas {
            border-radius: 3px;
        }
    }

    div.chart {
        width: 49%;
        height: 100%;
        background-color: rgba(253, 189, 189, 0.2);
        border-radius: 3px;

        div {
            canvas {
                border-radius: 3px;
            }
        }
    }
}</style>