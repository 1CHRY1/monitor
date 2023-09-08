<template>
    <div class="chart-container" :styleId="styleId" :order="order" :index='chartOptId'>
        <div ref="chartDom" class="echart-container"></div>
        <div class="play-button" :class="{paused: isPaused}" v-if="dynamicControl" :index='chartOptId' @click="changePlayStatus"></div>
    </div>
    
</template>
  
<script lang="ts">
export default {
    name: "chartContainer",
};
</script>
  
<script setup lang='ts'>
import * as echarts from 'echarts';
import { EChartsOption } from 'echarts';
import { onMounted, ref, toRef } from 'vue';
import { chartOptionTest, ChartDataPreparer } from '@/utils/viewerData';
// import { getSectionElevation } from '@/api/request';

interface Props {
    chartId: string,
    order: string,
    styleType: string,
    projectId: string
}

const props = defineProps<Props>();

let curProjectId = toRef(props, 'projectId')

// const test = await getSubstrate(props.projectId);
// console.log("test result", test);

const chartOptId = ref(props.chartId);
const styleId = ref(props.styleType);
const chartDom = ref<HTMLElement>();
const order = ref(props.order);
let projectId = ref(props.projectId);

const chartDatapreparer = new ChartDataPreparer(+chartOptId.value);

const changeData = () => {
    console.log(curProjectId.value);
}

let dynamicInterval = -1;

let isPaused = ref(true);
let dynamicControl = ref(false);

let changePlayStatus = () => {
    isPaused.value = !isPaused.value;
}
//   let noShown = ref(props.notShown);

//   watch(()=>props.notShown, (oldShown, newShown)=> {
//       noShown.value = !newShown;
//       console.log(noShown.value);
//   });
let optionIndex = 0;
onMounted(async () => {
    // console.log(chartDom.value);
    let chart = echarts.init(chartDom.value as HTMLElement);
    const chartOption = await chartDatapreparer.buildChartOption(projectId.value);
    // if (chartOption is EChartsOption) {

    // }

    function arrayDynamic() {
        chart.setOption((chartOption as EChartsOption[])[optionIndex+1]);
        optionIndex = (optionIndex+1)%((chartOption as EChartsOption[]).length-1);
    }

    let reqeustDynamic = async () => {
        chartDatapreparer.dynamicIndex += 1;
        const newSeries = await chartDatapreparer.buildChartOption(projectId.value);
        chart.clear();
        for(let key in newSeries) {
            (chartOption as EChartsOption)[key] = (newSeries as EChartsOption)[key]
        }
        // chartOption.series = (newSeries as EChartsOption).series;
        // console.log(chartOption);
        chart.setOption(chartOption as EChartsOption);
    }
    if (Array.isArray(chartOption)) {
        // console.log("options", chartOption)
        dynamicControl.value = true;
        chart.setOption(chartOption[0]);
        dynamicInterval = setInterval(arrayDynamic, 2000)
        changePlayStatus = () => {
            isPaused.value = !isPaused.value;
            if (dynamicInterval != -1) {
                clearInterval(dynamicInterval);
                dynamicInterval = -1;
            }
            else {
                dynamicInterval = setInterval(arrayDynamic, 2000)
            }
        
        }
    }
    else{
        // console.log("option", chartOption)
        chart.setOption(chartOption)
        if (chartDatapreparer.isDynamic === true) {
            dynamicControl.value = true;
            dynamicInterval = setInterval(reqeustDynamic, 2000)
            changePlayStatus = () => {
                isPaused.value = !isPaused.value;
                if (dynamicInterval != -1) {
                    clearInterval(dynamicInterval);
                    dynamicInterval = -1;
                }
                else {
                    dynamicInterval = setInterval(reqeustDynamic, 2000)
                }
            
            }
        }
    }
    // TODO: window.onsize doesn't work on components
    // window.onresize = function () {
    //     chart.resize();
    // };
});

defineExpose({changeData});
</script>
  
<style lang='scss' scoped>
$orders: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10;
$playButtonSize: calc(0.75vw + 0.8vh);

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
        // color: #dd6c6686, #8dc1a991, #759aa09d,#eedc78a3, #73a373aa, #73babc93, #e69d878d, #ea7e5394, #7289aba9, #91ca8ca4, #f49e4293;
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

    div.echart-container {
        width: 100%;
        height: 100%;
        border-radius: 3px;
    }

    div {
        canvas {
            border-radius: 3px;
        }
    }
}

div.play-button {
    position: absolute;
    right: 5%;
    top: 2%;
    border: 0;
    background: transparent;
    box-sizing: border-box;
    width: $playButtonSize;
    height: $playButtonSize;
    // background-color: aqua;
    border-color: transparent transparent transparent #4a8cfd;
    transition: 100ms all ease;
    cursor: pointer;

    border-style: solid;
    border-width: calc($playButtonSize/2) 0 calc($playButtonSize/2) calc($playButtonSize*0.8);

    &.paused {
        border-style: double;
        border-width: 0px 0 0px calc($playButtonSize*0.8);
    }

    &:hover {
        border-color: transparent transparent transparent #60ffdf;
    }

    &[index='9'] {
        right: 32%;
    }
}

</style>