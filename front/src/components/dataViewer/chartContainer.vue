<template>
    <div :index='chartOptId' ref="chartDom" class="chart-container" :styleId="styleId" :order="order">
    </div>
</template>
  
<script lang="ts">
export default {
    name: "chartContainer",
};
</script>
  
<script setup lang='ts'>
import * as echarts from 'echarts';
// import { BarChart, LineChart, PictorialBarChart } from 'echarts/charts';
// import { TitleComponent, TooltipComponent, GridComponent } from 'echarts/components';
// import { CanvasRenderer } from 'echarts/renderers';
import { onMounted, ref, toRef } from 'vue';
import { chartOptionTest, ChartDataPreparer } from '@/utils/viewerData';
import * as themeJson from '../../utils/dark.json';

// echarts.use([BarChart, LineChart, PictorialBarChart, TitleComponent, TooltipComponent, GridComponent, CanvasRenderer]);

interface Props {
    chartId: string,
    order: string,
    styleType: string,
    projectId: number
}
echarts.registerTheme('darkNew', themeJson);

const props = defineProps<Props>();

let curProjectId = toRef(props, 'projectId')

const chartOptId = ref(props.chartId);
const styleId = ref(props.styleType);
const chartDom = ref<HTMLElement>();
const order = ref(props.order);
let projectId = ref(props.projectId);

const chartDatapreparer = new ChartDataPreparer(+chartOptId.value, projectId.value);

const changeData = () => {
    console.log(curProjectId.value);
}

//   let noShown = ref(props.notShown);

//   watch(()=>props.notShown, (oldShown, newShown)=> {
//       noShown.value = !newShown;
//       console.log(noShown.value);
//   });

onMounted(() => {
    // console.log(chartDom.value);
    let chart = echarts.init(chartDom.value as HTMLElement);
    // chartDatapreparer.requestChartData()
    //     .then((res) => {
    //         chartDatapreparer.buildData2ChartOption(res.data);
    //         chartDatapreparer.getClean();
    //     })
    //     .catch((err) => {
    //         console.log(`request chart ${chartOptId.value} data error`, err);
    //         chartDatapreparer.getDirty();
    //     })
    let chartConfig = chartOptionTest[+(chartOptId.value)-1];
    chart.setOption(chartConfig)
    // TODO: window.onsize doesn't work on components
    // window.onresize = function () {
    //     chart.resize();
    // };
});

defineExpose({changeData});
</script>
  
<style lang='scss' scoped>
$orders: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10;

div.chart-container {
    transition: transform 1s ease-in-out;
    width: 30%;
    height: 32%;
    border-radius: 3px;
    background-color: rgba(0, 1, 67, 0.5);
    backdrop-filter: blur(4px);
    flex-grow: 0;

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
        width: 42%;
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
}</style>