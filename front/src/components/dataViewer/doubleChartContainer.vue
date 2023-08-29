<template>
    <div :index='chartOptId' class="double-chart-container" :styleId="styleId" :order="order">
        <div class="table-container left" ref="chartLeft">
            <dataTable />
        </div>
        <div class="chart right"  ref="chartLeft"></div>
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
import { chartOptionTest, ChartDataPreparer } from '@/utils/viewerData';
import dataTable from './dataTable.vue';

type EChartsOption = echarts.EChartsOption;

interface Props {
    chartId: string,
    order: string,
    styleType: string,
    projectId: string
}

const props = defineProps<Props>();

const chartOptId = ref(props.chartId);
const styleId = ref(props.styleType);
const order = ref(props.order);
let projectId = ref(props.projectId);

const chartLeft = ref<HTMLElement>();
const chartRight = ref<HTMLElement>();

const chartPreparer = new ChartDataPreparer(+chartOptId.value.substring(0, 1));

//   let noShown = ref(props.notShown);

//   watch(()=>props.notShown, (oldShown, newShown)=> {
//       noShown.value = !newShown;
//       console.log(noShown.value);
//   });

let optionIndex = 1;

onMounted(async () => {
    // console.log(chartDom.value);
    // let echartLeft = echarts.init(chartLeft.value as HTMLElement);
    let chartRight = echarts.init(chartLeft.value as HTMLElement);

    const chartOption = await chartPreparer.buildChartOption(projectId.value);
    console.log(chartOption);
    if (Array.isArray(chartOption)) {
        chartRight.setOption(chartOption[0]);
        setInterval(() => {
            chartRight.setOption(chartOption[optionIndex]);
            optionIndex = (optionIndex+1)%(chartOption.length-1) + 1;
        }, 2000)
    }
    else{
        chartRight.setOption(chartOption)
    }
    // let chartConfig = chartOptionTest[+(chartOptId.value.substring(0, 1))-1];
    
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
    overflow: hidden;
    // backdrop-filter: blur(4px);
    flex-grow: 0;

    display: flex;
    flex-flow: row no wrap;
    justify-content: space-around;

    &[styleId='1'] {
        width: 28%;
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
        background-color: rgba(0, 1, 67, 0.5);
        border-radius: 3px;

        div {
            canvas {
                border-radius: 3px;
            }
        }
    }

    div.table-container {
        width: 49%;
        height: 100%;
        background-color: rgba(0, 1, 67, 0.5);
        border-radius: 3px;

        div {
            canvas {
                border-radius: 3px;
            }
        }
    }
}</style>