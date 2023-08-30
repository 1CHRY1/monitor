import axios from "axios";
import * as echarts from "echarts";
import { type EChartsOption } from "echarts";
import { drop_url, sandUrl } from "./picData";
import { getFlux, getSectionElevation, getSubstrate, getSandContentClass, getSandContentValue } from '@/api/request';

type ProjectOption = {
    id: string;
    projectName: string;
    avatar: string;
    description: string;
    institution: string;
    location: string;
    type: string;
    uploadTime: string;
    time: string;
    visual: number;
}

type StringKeyObject = {
    [key: string]: any
}


const chartDataNameList = [
    '', '', '', '', '', '', '', '', '',
]

const colorMap = [
    ['#F29600', '#FFCF80'], ['#0A088A', '#7682FF'], ['#734D2D', '#F2E6D8'],
    ['#1B8C57', '#89D911'], ['#F25781', '#F27457'], ['#FF664F', '#FFD2C4'],
    ['#6819A8', '#E9A7F2'], ['#C92128', '#F2D8EE'], ['#730240', '#559BD9'],
    ['#456E47', '#CCFFA3'], ['#04BF8A', '#4BF2E2'], ['#00213A', '#3498BF'],
]

// Generate data
// let dottedBase = +new Date();
// let oneDay = 3600 * 1000;
let tideAmountData = [];
let sign = -1;
for (let i = 0; i < 8; i++) {
    // let date = new Date((dottedBase + oneDay * i));
    let b = Math.random() * 200;
    tideAmountData.push(b * sign);
    sign *= -1;
}

let dottedBase = +new Date();
let oneHour = 3600 * 1000;
let tideSpeedData:Array<Array<number>> = [];
let tideSpeedDataB:Array<Array<number>> = [];
let tideDirectDataB = [];
let tideDirectDataA = [];
for (let i = 0; i < 30; i++) {
    let date = new Date(dottedBase + oneHour * i);
    let b = Math.random();
    let c = Math.random();
    let a = Math.random();
    let d = Math.random();
    tideSpeedData.push([+date, b * 1.5])
    tideSpeedDataB.push([+date, c * 1.5])
    tideDirectDataA.push([+date, a * 360])
    tideDirectDataB.push([+date, d * 360])
}

var data = [];
// Parametric curve
for (var t = 0; t < 25; t += 0.001) {
    var x = (1 + 0.25 * Math.cos(75 * t)) * Math.cos(t);
    var y = (1 + 0.25 * Math.cos(75 * t)) * Math.sin(t);
    var z = t + 2.0 * Math.sin(75 * t);
    data.push(['S800', y, z]);
}

function preparePercentData(data:Array<StringKeyObject>) {
    let percentData = [];
    let num = data.length;
    let min = 100;
    let max = 0;
    for (let i = 0; i < num-1; i++) {
        if(data[i]["value"] == 0) {
            percentData.push({name: data[i]["key"] + '-' + data[i+1]["key"], value: 0});
            min = 0;
        }
        else {
            const value = data[i]["value"] - data[i+1]["value"];
            if (value < min) {
                min = value;
            }
            if (value > max) {
                max = value;
            }
            percentData.push({name: data[i]["key"] + '-' + data[i+1]["key"], value: value});
        }
    }
    percentData.push({name: data[num-1]["key"] + '-' + '0', value: data[num-1]["value"]});
    if (min < 0) {
        min = 0;
    }
    return {percentData, min, max};
}


function prepareOneFluxData(data:StringKeyObject): StringKeyObject {
    let fluxRes: StringKeyObject = {names: data["name"], minMax: [], data: [], title: []};
    for(let j=0; j < data["value"][0].length; j++) {
        let oneTimeData = [];
        for(let i = 0; i<data["name"].length; i++) {
            oneTimeData.push(data["value"][i][j]);
        }
        let min = Math.min(...oneTimeData);
        if(min > 0) {
            min = 0;
        }
        fluxRes.minMax.push([min, Math.max(...oneTimeData)]);
        fluxRes.data.push(oneTimeData);
        fluxRes.title.push(data["time"][j].slice(0, data["time"][j].length-3) + data["type"]);
    }
    return fluxRes;
}

function groupSandAmountData(sandType: Array<string>): Array<Array<String>> {
    let groupedData: StringKeyObject = {};
    for (let i = 0; i < sandType.length; i++) {
        let splitted = sandType[i].split("-");
        // console.log("splitted", splitted);
        if (splitted.length == 1) {
            groupedData[sandType[i]] = [['']];
            continue;
        }
        let positionName = splitted[0];
        let typeName = splitted[1];
        if (!(positionName in groupedData)) {
            groupedData[positionName] = [[], []];
        }
        // console.log("char", typeName.charAt(typeName.length-1))
        if (typeName.charAt(typeName.length-1) == 'D') {
            groupedData[positionName][0].push(typeName);
        }
        else {
            groupedData[positionName][1].push(typeName);
        }
    }
    let res = [];
    for(let key in groupedData) {
        // let aGroup = [];
        for(let itemList of groupedData[key]) {
            let bGroup = [];
            for(let item of itemList) {
                if(item == '') {
                    bGroup.push(key);
                }
                else {
                    bGroup.push(key + '-' +item);   
                }
            }
            res.push(bGroup);
        }
        // res.push(aGroup);
    }
    // console.log("grouped list", res)
    return res;
}


let chartOptionTest: EChartsOption[] = [
    {
        title: {
            left: 'center',
            text: '潮流量',
            top: '2%',
            textStyle: {
                fontSize: 28,
                color: 'rgba(255, 255, 255, 0.8)'
            }
        },
        tooltip: { show: true, trigger: 'item' },
        yAxis: {
            type: 'category',
            axisLine: {
                lineStyle: {
                    color: '#ccc'
                }
            },
            axisLabel: {
                fontSize: 16,
                color: 'rgba(255,255,255, 0.75)',
            },
            axisTick: { show: false },
            data: [
                'TZSD',
                'TZSX',
                'XWS',
                'ETDD',
                'ETDX',
                'XWX',
                'LSSD',
                'LSSX',
            ]
        },
        xAxis: {
            splitLine: {
                lineStyle: {
                    color: 'rgba(233,233,233, 0.2)'
                },
            },
            axisLine: {
                lineStyle: {
                    color: '#ccc'
                }
            },
            axisLabel: {
                fontSize: 16,
                color: 'rgba(255,255,255, 0.75)'
            },
            name: '(m3/s)',
            nameTextStyle: {
                color: 'rgba(255,255,255, 0.7)',
                fontSize: 14,
                fontWeight: 'bold'
            },
            min: (value) => {
                return value.min
            },
            max: (value) => {
                return value.max
            }
        },
        grid: {
            top: '14%',
            bottom: '2%',
            left: '1%',
            right: '2%',
            containLabel: true
        },
        series: [
            {
                name: '潮流量',
                type: 'pictorialBar',
                symbol: drop_url,
                barWidth: 18,
                symbolClip: true,
                symbolRepeat: true,
                symbolSize: [28, 28],
                symbolMargin: '10%',
                data: tideAmountData
            },
            {
                data: tideAmountData,
                name: '潮流量',
                type: 'pictorialBar',
                symbol: drop_url,
                barWidth: 18,
                itemStyle: {
                    opacity: 0.2
                },
                symbolRepeat: 'fixed',
                symbolSize: [28, 28],
                symbolMargin: '10%',
                symbolBoundingData: [-200, 200]
            }
        ]
    },
    {
        color: ['#dd6b66', '#8dc1a9', '#759aa0', '#e69d87', '#ea7e53', '#eedd78', '#73a373', '#73b9bc', '#7289ab', '#91ca8c', '#f49f42'],
        title: {
            left: 'center',
            text: '流向',
            top: '2%',
            textStyle: {
                fontSize: 28,
                color: 'rgba(255, 255, 255, 0.8)'
            }
        },
        legend: {
            show: true,
            orient: 'vertical',
            left: '0%',
            top: '12%',
            width: '10%',
            itemGap: 15,
            // itemWidth: 5,
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderRadius: 6,
            padding: 10,
            textStyle: {
                fontWeight: 'bold',
                color: 'rgba(255, 255, 255, 0.9)'
            },
            lineStyle: {
                width: 4
            }
        },
        // backgroundColor: '#063462c1',
        tooltip: { show: true, trigger: 'axis' },
        xAxis: {
            type: 'time',
            // name: '起点距(米)',
            nameTextStyle: {
                color: 'rgba(255,255,255, 0.7)',
                fontSize: 14,
                fontWeight: 'bold'
            },
            axisLine: {
                lineStyle: {
                    color: 'rgba(233,233,233, 0.5)'
                },
                onZero: false
            },
            splitLine: {
                show: false
            },
            axisLabel: {
                fontSize: 16,
                color: 'rgba(255,255,255, 0.75)',
                formatter: '{dd}-{hh}:00'
            },
            min: (value) => {
                return value.min
            },
            max: (value) => {
                return value.max
            },
            boundaryGap: ['5%', '5%']
        },
        yAxis: {
            type: 'value',
            name: 'm/s',
            nameTextStyle: {
                color: 'rgba(255,255,255, 0.7)',
                fontSize: 14,
                fontWeight: 'bold'
            },
            axisLine: {
                lineStyle: {
                    color: 'rgba(233,233,233, 0.5)'
                },
                onZero: false
            },
            splitLine: {
                lineStyle: {
                    color: 'rgba(255,255,255, 0.2)',
                    width: 1.5
                }
            },
            axisLabel: {
                fontSize: 16,
                color: 'rgba(255,255,255, 0.75)'
            },
            min: 0,
            max: 360,
        },
        grid: {
            top: '14%',
            bottom: '2%',
            left: '12%',
            right: '2%',
            containLabel: true
        },
        series: [
            {
                name: 'a',
                symbolSize: 4,
                data: tideDirectDataA,
                type: 'line',
                emphasis: {
                    focus: 'series'
                },
                lineStyle: {
                    width: 3,
                    // color: colorMap[0][0]
                },
                // smooth: true
                // areaStyle: {}
            },
            {
                name: 'b',
                symbolSize: 4,
                data: tideDirectDataB,
                type: 'line',
                emphasis: {
                    focus: 'series'
                },
                lineStyle: {
                    width: 3,
                    // color: colorMap[1][0]
                },
                // smooth: true
                // areaStyle: {}
            },
        ]
    },
    {
        xAxis: {},
        yAxis: {},
        visualMap: [{
            show: false,
            type: 'continuous',
            seriesIndex: 0,
            min: -10,
            max: 0,
            inRange: {
                color: ['rgba(3,4,5,0.4)', 'red'],
            }
        },
        ],
        series: [
            {
                symbolSize: 20,
                data: [
                    [1, -1],
                    [2, -2],
                    [3, -4],
                    [4, -8],
                ],
                type: 'line',
                areaStyle: {}
            },
            {
                symbolSize: 20,
                data: [
                    [1, -3],
                    [2, -10],
                ],
                type: 'line',
                areaStyle: {}
            }
        ]
    },
    {
        color: ['#91ca8c', '#f49f42', '#eedd78', '#73a373', '#73b9bc', '#7289ab', '#dd6b66', '#8dc1a9', '#759aa0', '#e69d87', '#ea7e53'],
        title: {
            left: 'center',
            text: '流速',
            top: '2%',
            textStyle: {
                fontSize: 28,
                color: 'rgba(255, 255, 255, 0.8)'
            }
        },
        legend: {
            show: true,
            orient: 'vertical',
            left: '0%',
            top: '12%',
            width: '10%',
            itemGap: 15,
            // itemWidth: 5,
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderRadius: 6,
            padding: 10,
            textStyle: {
                fontWeight: 'bold',
                color: 'rgba(255, 255, 255, 0.9)'
            },
            lineStyle: {
                width: 4
            }
        },
        // backgroundColor: '#063462c1',
        tooltip: { show: true, trigger: 'axis' },
        xAxis: {
            type: 'time',
            // name: '起点距(米)',
            nameTextStyle: {
                color: 'rgba(255,255,255, 0.7)',
                fontSize: 14,
                fontWeight: 'bold'
            },
            axisLine: {
                lineStyle: {
                    color: 'rgba(233,233,233, 0.5)'
                },
                onZero: false
            },
            splitLine: {
                show: false
            },
            axisLabel: {
                fontSize: 16,
                color: 'rgba(255,255,255, 0.75)',
                formatter: '{dd}-{hh}:00'
            },
            min: (value) => {
                return value.min
            },
            max: (value) => {
                return value.max
            },
            boundaryGap: ['5%', '5%']
        },
        yAxis: {
            type: 'value',
            name: 'm/s',
            nameTextStyle: {
                color: 'rgba(255,255,255, 0.7)',
                fontSize: 14,
                fontWeight: 'bold'
            },
            axisLine: {
                lineStyle: {
                    color: 'rgba(233,233,233, 0.5)'
                },
                onZero: false
            },
            splitLine: {
                lineStyle: {
                    color: 'rgba(255,255,255, 0.2)',
                    width: 1.5
                }
            },
            axisLabel: {
                fontSize: 16,
                color: 'rgba(255,255,255, 0.75)'
            },
            min: (value) => {
                return (value.min > 0) ? -0.25 : value.min - 0.25
            },
            max: (value) => {
                return Math.ceil(value.max * 1.2)
            },
        },
        grid: {
            top: '14%',
            bottom: '2%',
            left: '12%',
            right: '2%',
            containLabel: true
        },
        series: [
            {
                name: 'a',
                symbolSize: 4,
                data: tideSpeedData,
                type: 'line',
                emphasis: {
                    focus: 'series'
                },
                lineStyle: {
                    width: 3,
                    // color: colorMap[0][0]
                },
                // smooth: true
                // areaStyle: {}
            },
            {
                name: 'b',
                symbolSize: 4,
                data: tideSpeedDataB,
                type: 'line',
                emphasis: {
                    focus: 'series'
                },
                lineStyle: {
                    width: 3,
                    // color: colorMap[1][0]
                },
                // smooth: true
                // areaStyle: {}
            },
        ]
    },
    {
        color: ['#eedd78', '#73a373', '#73b9bc', '#dd6b66', '#8dc1a9', '#759aa0', '#e69d87', '#ea7e53', '#7289ab', '#91ca8c', '#f49f42'],
        title: {
            left: 'center',
            text: '大断面成果',
            top: '2%',
            textStyle: {
                fontSize: 28,
                color: 'rgba(255, 255, 255, 0.8)'
            }
        },
        legend: {
            show: true,
            orient: 'vertical',
            right: '0%',
            top: '12%',
            width: '10%',
            itemGap: 15,
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderRadius: 6,
            padding: 10,
            data: [
                {
                    name: '断面1',
                    // itemStyle: { color: 'red' },
                    // lineStyle: { color: 'red' },
                    textStyle: {
                        fontSize: 18,
                        color: 'rgba(233,233,233, 0.7)'
                    },
                },
            ]
        },
        xAxis: {
            type: 'value',
            name: '起点距(米)',
            nameTextStyle: {
                color: 'rgba(255,255,255, 0.7)',
                fontSize: 14,
                fontWeight: 'bold'
            },
            axisLine: {
                lineStyle: {
                    color: 'rgba(233,233,233, 0.5)'
                },
                onZero: false
            },
            splitLine: {
                show: false
            },
            axisLabel: {
                fontSize: 16,
                color: 'rgba(255,255,255, 0.75)'
            },
            min: (value) => {
                return value.min
            },
            max: (value) => {
                return value.max
            },
            boundaryGap: ['5%', '5%']
        },
        yAxis: {
            type: 'value',
            name: '高程(米)',
            nameTextStyle: {
                color: 'rgba(255,255,255, 0.7)',
                fontSize: 14,
                fontWeight: 'bold'
            },
            axisLine: {
                lineStyle: {
                    color: 'rgba(233,233,233, 0.5)'
                },
                onZero: false
            },
            splitLine: {
                lineStyle: {
                    color: 'rgba(255,255,255, 0.2)',
                    width: 1.5
                }
            },
            axisLabel: {
                fontSize: 16,
                color: 'rgba(255,255,255, 0.75)'
            },
        },
        tooltip: {
            trigger: 'axis',
        },
        // visualMap: [
        //     {
        //         show: false,
        //         type: 'continuous',
        //         seriesIndex: 0,
        //         min: -10,
        //         max: 0,
        //         inRange: {
        //             color: ['#6819A8', '#E9A7F2'],
        //         }
        //     },
        // ],
        grid: {
            top: '14%',
            bottom: '2%',
            left: '2%',
            right: '10%',
            containLabel: true
        },
        series: [
            {
                name: '断面1',
                symbolSize: 5,
                data: [
                    [2, -1],
                    [3, -2],
                    [4, -4],
                    [5, -8],
                ],
                type: 'line',
                areaStyle: {}
            },
            //   {
            //     name: '断面2',
            //     symbolSize: 5,
            //     data: [
            //       [3, -3],
            //       [4, -10],
            //       [5, -5],
            //     ],
            //     type: 'line',
            //     areaStyle: {}
            //   }
        ]
    },
    {
        title: {
            left: 'center',
            text: '输沙率',
            top: '2%',
            textStyle: {
                fontSize: 28,
                color: 'rgba(255, 255, 255, 0.8)'
            }
        },
        tooltip: { show: true, trigger: 'item' },
        yAxis: {
            type: 'category',
            axisLine: {
                lineStyle: {
                    color: '#ccc'
                }
            },
            axisLabel: {
                fontSize: 16,
                color: 'rgba(255,255,255, 0.75)',
                // formatter: '{dd}-{hh}:00'
            },
            axisTick: { show: false },
            data: [
                'TZSD',
                'TZSX',
                'XWS',
                'ETDD',
                'ETDX',
                'XWX',
                'LSSD',
                'LSSX',
            ]
        },
        xAxis: {
            splitLine: {
                lineStyle: {
                    color: 'rgba(233,233,233, 0.2)'
                },
            },
            axisLine: {
                // show: true,
                lineStyle: {
                    color: '#ccc'
                }
            },
            axisLabel: {
                fontSize: 16,
                color: 'rgba(255,255,255, 0.75)'
            },
            name: '(m3/s)',
            nameTextStyle: {
                color: 'rgba(255,255,255, 0.7)',
                fontSize: 14,
                fontWeight: 'bold'
            },
            min: -200,
            max: 200
        },
        grid: {
            top: '14%',
            bottom: '2%',
            left: '1%',
            right: '2%',
            containLabel: true
        },
        series: [
            {
                name: 'bar',
                type: 'pictorialBar',
                symbol: sandUrl,
                barWidth: 16,
                symbolClip: true,
                // itemStyle: {
                //     // borderRadius: 8,
                //     color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                //         { offset: 0, color: '#14c8d4' },
                //         { offset: 1, color: '#43eec6' }
                //     ])
                // },
                symbolRepeat: true,
                symbolSize: [32, 32],
                symbolMargin: '10%',
                data: tideAmountData
            },
            {
                data: tideAmountData,
                name: '输沙率',
                type: 'pictorialBar',
                symbol: sandUrl,
                barWidth: 18,
                itemStyle: {
                    opacity: 0.2
                },
                symbolRepeat: 'fixed',
                symbolSize: [32, 32],
                symbolMargin: '10%',
                symbolBoundingData: [-200, 200]
            }
        ]
    },
    {
        title: {
            text: '颗粒分析成果',
            left: '5%',
            top: 10,
            textStyle: {
                color: 'rgba(255, 255, 255, 0.8)',
                fontWeight: 'bolder',
                fontFamily: 'Microsoft YaHei',
                fontSize: 28,
            }
        },
        tooltip: {
            trigger: 'item',
        },
        legend: {
            orient: 'vertical',
            bottom: 'center',
            right: '1%',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderRadius: 10,
            show: true,
            padding: 10,
            height: '85%',
            textStyle: {
                color: 'white',
                fontWeight: 'bold'
            }
        },
        visualMap: {
            show: false,
            min: 5,
            max: 90,
            inRange: {
                color: '#F2C288',
                // colorSaturation: [0, 0.5],
                colorLightness: [1, 0],
            }
        },
        series: [
            {
                name: '底质颗粒百分数',
                type: 'pie',
                radius: ['16%', '82%'],
                center: ['30%', '58%'],
                roseType: 'radius',
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 8,
                    color: '#415CC2',
                    shadowBlur: 200,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                },
                label: {
                    show: false,
                    position: 'center',
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: 16,
                        fontWeight: 'bold',
                        borderColor: 'black',
                        color: 'white'
                    }
                },
                data: [
                    { value: 60, name: 'A' },
                    { value: 36, name: 'B' },
                    { value: 47, name: 'C' },
                    { value: 29, name: 'D' },
                    { value: 12, name: 'E' },
                    { value: 36, name: 'F' },
                    { value: 9, name: 'G' },
                    { value: 7, name: 'H' },
                    { value: 49, name: 'X' },
                    { value: 33, name: 'Y' },
                    { value: 27, name: 'Z' },
                    { value: 42, name: 'M' },
                ].sort(function (a, b) {
                    return b.value - a.value;
                }), 
            }
        ]
    },
    {
        xAxis: {},
        yAxis: {},
        visualMap: [{
            show: false,
            type: 'continuous',
            seriesIndex: 0,
            min: -10,
            max: 0,
            inRange: {
                color: ['rgba(3,4,5,0.4)', 'red'],
            }
        },
        ],
        series: [
            {
                symbolSize: 20,
                data: [
                    [1, -1],
                    [2, -2],
                    [3, -4],
                    [4, -8],
                ],
                type: 'line',
                areaStyle: {}
            },
            {
                symbolSize: 20,
                data: [
                    [1, -3],
                    [2, -10],
                ],
                type: 'line',
                areaStyle: {}
            }
        ]
    },
    {
        color: ['#E3A032', '#73b9bc', '#7289ab', '#91ca8c', '#f49f42', '#eedd78', '#73a373', '#dd6b66', '#8dc1a9', '#759aa0', '#e69d87', '#ea7e53'],
        title: {
            left: 'center',
            text: '含沙量',
            top: '2%',
            textStyle: {
                fontSize: 28,
                color: 'rgba(255, 255, 255, 0.8)'
            }
        },
        legend: {
            show: true,
            orient: 'horizontal',
            right: '1%',
            top: '2%',
            // width: '10%',
            itemGap: 15,
            // itemWidth: 5,
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderRadius: 6,
            padding: 10,
            textStyle: {
                fontWeight: 'bold',
                color: 'rgba(255, 255, 255, 0.9)'
            },
            lineStyle: {
                width: 4
            }
        },
        // backgroundColor: '#063462c1',
        tooltip: { show: true, trigger: 'axis' },
        xAxis: {
            type: 'time',
            // name: '起点距(米)',
            nameTextStyle: {
                color: 'rgba(255,255,255, 0.7)',
                fontSize: 14,
                fontWeight: 'bold'
            },
            axisLine: {
                lineStyle: {
                    color: 'rgba(233,233,233, 0.5)'
                },
                onZero: false
            },
            splitLine: {
                show: false
            },
            axisLabel: {
                fontSize: 16,
                color: 'rgba(255,255,255, 0.75)',
                formatter: '{dd}-{hh}:00'
            },
            min: (value) => {
                return value.min
            },
            max: (value) => {
                return value.max
            },
            boundaryGap: ['5%', '5%']
        },
        yAxis: {
            type: 'value',
            name: 'm/s',
            nameTextStyle: {
                color: 'rgba(255,255,255, 0.7)',
                fontSize: 14,
                fontWeight: 'bold'
            },
            axisLine: {
                lineStyle: {
                    color: 'rgba(233,233,233, 0.5)'
                },
                onZero: false
            },
            splitLine: {
                lineStyle: {
                    color: 'rgba(255,255,255, 0.2)',
                    width: 1.5
                }
            },
            axisLabel: {
                fontSize: 16,
                color: 'rgba(255,255,255, 0.75)'
            },
            min: (value) => {
                return (value.min > 0) ? -0.25 : value.min - 0.25
            },
            max: (value) => {
                return Math.ceil(value.max * 1.2)
            },
        },
        grid: {
            top: '14%',
            bottom: '2%',
            left: '1%',
            right: '2%',
            containLabel: true
        },
        series: [
            {
                name: 'a',
                symbolSize: 4,
                data: tideSpeedData,
                type: 'line',
                emphasis: {
                    focus: 'series'
                },
                lineStyle: {
                    width: 3,
                    // color: colorMap[0][0]
                },
                // smooth: true
                // areaStyle: {}
            },
            {
                name: 'b',
                symbolSize: 4,
                data: tideSpeedDataB,
                type: 'line',
                emphasis: {
                    focus: 'series'
                },
                lineStyle: {
                    width: 3,
                    // color: colorMap[1][0]
                },
                // smooth: true
                // areaStyle: {}
            },
        ]
    },
    {
        xAxis: {},
        yAxis: {},
        visualMap: [{
            show: false,
            type: 'continuous',
            seriesIndex: 0,
            min: -10,
            max: 0,
            inRange: {
                color: ['rgba(3,4,5,0.4)', 'red'],
            }
        },
        ],
        series: [
            {
                symbolSize: 20,
                data: [
                    [1, -1],
                    [2, -2],
                    [3, -4],
                    [4, -8],
                ],
                type: 'line',
                areaStyle: {}
            },
            {
                symbolSize: 20,
                data: [
                    [1, -3],
                    [2, -10],
                ],
                type: 'line',
                areaStyle: {}
            }
        ]
    },
    {
        xAxis: {},
        yAxis: {},
        visualMap: [{
            show: false,
            type: 'continuous',
            seriesIndex: 0,
            min: -10,
            max: 0,
            inRange: {
                color: ['rgba(3,4,5,0.4)', 'red'],
            }
        },
        ],
        series: [
            {
                symbolSize: 20,
                data: [
                    [1, -1],
                    [2, -2],
                    [3, -4],
                    [4, -8],
                ],
                type: 'line',
                areaStyle: {}
            },
            {
                symbolSize: 20,
                data: [
                    [1, -3],
                    [2, -10],
                ],
                type: 'line',
                areaStyle: {}
            }
        ]
    },
]


class ChartDataPreparer {
    public isDynamic: boolean = false;
    public dynamicIndex: number = 0;
    private requestStringData: Array<any> = [];
    constructor(
        public chartId: number,
    ) {
    }

    public async buildChartOption(currentProjectId: string): Promise<echarts.EChartsOption | echarts.EChartsOption[]> {
        switch (this.chartId) {
            case 1:
                const fluxData = await getFlux(currentProjectId);
                const fluxSeries = this.generateTideAmountChartSeries(fluxData?.data);
                const fluxOptions = this.buildTideAmountChartOption(fluxSeries);
                return fluxOptions;
            case 5:
                const sectionData = await getSectionElevation(currentProjectId);
                const sectionSeries = this.generateSectionChartSeries(sectionData?.data);
                const sectionOption = this.buildSectionChartOption(sectionSeries);
                return sectionOption;
            case 7:
                const bottomParticleData = await getSubstrate(currentProjectId);
                const bottomParticleSeries = this.generateBottomParticleChartSeries(bottomParticleData?.data);
                const bottomParticleOptions = this.buildBottomParticleChartOption(bottomParticleSeries);
                return bottomParticleOptions;
            case 9:
                this.isDynamic = true;
                const sandContentNames = await getSandContentClass(currentProjectId);
                this.requestStringData = groupSandAmountData(sandContentNames?.data);
                // const dataTest = await getSandContentValue(currentProjectId, "TZSD-AD");
                const chartOption = this.buildSandAmountChartOption(currentProjectId);
                // console.log(groupedNames);
                return chartOption;
            default:
                return chartOptionTest[(+this.chartId)-1];
        }
    }

    private buildSectionChartOption(sectionSeries: Array<object>): EChartsOption | EChartsOption[] { // 大断面
        let sectionOption: EChartsOption = {
            color: ['#dd6c6686', '#8dc1a991', '#759aa09d', '#eedc78a3', '#73a373aa', '#73babc93', '#e69d878d', '#ea7e5394', '#7289aba9', '#91ca8ca4', '#f49e4293'],
            title: {
                left: 'center',
                text: '大断面成果',
                top: '2%',
                textStyle: {
                    fontSize: 28,
                    color: 'rgba(255, 255, 255, 0.8)'
                }
            },
            legend: {
                show: true,
                orient: 'vertical',
                right: '0%',
                top: '12%',
                width: '10%',
                itemGap: 15,
                // itemWidth: 5,
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                borderRadius: 6,
                padding: 10,
                textStyle: {
                    fontWeight: 'bold',
                    color: 'rgba(255, 255, 255, 0.9)'
                },
                lineStyle: {
                    width: 4
                }
            },
            xAxis: {
                type: 'value',
                name: '起点距(米)',
                nameTextStyle: {
                    color: 'rgba(255,255,255, 0.7)',
                    fontSize: 14,
                    fontWeight: 'bold'
                },
                axisLine: {
                    lineStyle: {
                        color: 'rgba(233,233,233, 0.5)'
                    },
                    onZero: false
                },
                splitLine: {
                    show: false
                },
                axisLabel: {
                    fontSize: 16,
                    color: 'rgba(255,255,255, 0.75)'
                },
                min: (value) => {
                    return value.min
                },
                max: (value) => {
                    return value.max
                },
                boundaryGap: ['5%', '5%']
            },
            yAxis: {
                type: 'value',
                name: '高程(米)',
                nameTextStyle: {
                    color: 'rgba(255,255,255, 0.7)',
                    fontSize: 14,
                    fontWeight: 'bold'
                },
                axisLine: {
                    lineStyle: {
                        color: 'rgba(233,233,233, 0.5)'
                    },
                    onZero: false
                },
                splitLine: {
                    lineStyle: {
                        color: 'rgba(255,255,255, 0.2)',
                        width: 1.5
                    }
                },
                axisLabel: {
                    fontSize: 16,
                    color: 'rgba(255,255,255, 0.75)'
                },
                min: (value) => {
                    return value.min
                }
            },
            tooltip: {
                trigger: 'axis',
            },
            grid: {
                top: '14%',
                bottom: '2%',
                left: '2%',
                right: '10%',
                containLabel: true
            },
            series: sectionSeries
        }

        return sectionOption;
    }

    private generateSectionChartSeries(sectionData: StringKeyObject): Array<object> {
        let series = [];
        for (let name in sectionData) {
            // create series
            series.push({
                name: name,
                symbolSize: 1,
                data: sectionData[name],
                type: 'line',
                areaStyle: {}
            });
        }
        return series;
    }

    private buildTideHeightChartOption(): EChartsOption | EChartsOption[] { // 潮位
        return {};
    }

    private generateTideHeightChartSeries(): StringKeyObject {
        return {};
    }

    private buildTideAmountChartOption(changeSeries: Array<StringKeyObject>): EChartsOption[] { // 潮流量
        // console.log(changeSeries);
        let optionInit: EChartsOption = {
            title: {
                left: 'center',
                text: changeSeries[0].title[0],
                top: '2%',
                textStyle: {
                    fontSize: 20,
                    color: 'rgba(255, 255, 255, 0.8)'
                }
            },
            tooltip: { show: true, trigger: 'item' },
            yAxis: {
                type: 'category',
                axisLine: {
                    lineStyle: {
                        color: '#ccc'
                    }
                },
                axisLabel: {
                    fontSize: 16,
                    color: 'rgba(255,255,255, 0.75)',
                },
                axisTick: { show: false },
                data: changeSeries[0].names
            },
            xAxis: {
                splitLine: {
                    lineStyle: {
                        color: 'rgba(233,233,233, 0.2)'
                    },
                },
                axisLine: {
                    lineStyle: {
                        color: '#ccc'
                    }
                },
                axisLabel: {
                    fontSize: 16,
                    color: 'rgba(255,255,255, 0.75)'
                },
                name: '(m3/s)',
                nameTextStyle: {
                    color: 'rgba(255,255,255, 0.7)',
                    fontSize: 14,
                    fontWeight: 'bold'
                },
                min: changeSeries[0].minMax[0][0],
                max: changeSeries[0].minMax[0][1]
            },
            grid: {
                top: '14%',
                bottom: '2%',
                left: '1%',
                right: '2%',
                containLabel: true
            },
            series: [
                {
                    name: '潮流量',
                    type: 'pictorialBar',
                    symbol: drop_url,
                    barWidth: 18,
                    symbolClip: true,
                    symbolRepeat: true,
                    symbolSize: [28, 28],
                    symbolMargin: '10%',
                    data: changeSeries[0].data[0]
                },
                {
                    data: changeSeries[0].data[0],
                    name: '潮流量',
                    type: 'pictorialBar',
                    symbol: drop_url,
                    barWidth: 18,
                    itemStyle: {
                        opacity: 0.2
                    },
                    symbolRepeat: 'fixed',
                    symbolSize: [28, 28],
                    symbolMargin: '10%',
                    symbolBoundingData: [changeSeries[0].minMax[0][0], changeSeries[0].minMax[0][1]]
                }
            ]
        };
        let options: EChartsOption[] = [optionInit];

        for( let i = 0; i < changeSeries.length; i++){
            for(let j = 0; j < changeSeries[i].data.length; j++){
                options.push({
                    title: {
                        text: changeSeries[i].title[j]
                    },
                    xAxis: {
                        min: changeSeries[i].minMax[j][0],
                        max: changeSeries[i].minMax[j][1]
                    },
                    yAxis: {
                        data: changeSeries[i].names
                    },
                    series: [
                        {
                            name: '潮流量',
                            type: 'pictorialBar',
                            symbol: drop_url,
                            barWidth: 18,
                            symbolClip: true,
                            symbolRepeat: true,
                            symbolSize: [28, 28],
                            symbolMargin: '10%',
                            data: changeSeries[i].data[j],
                        },
                        {
                            data: changeSeries[i].data[j],
                            name: '潮流量',
                            type: 'pictorialBar',
                            symbol: drop_url,
                            barWidth: 18,
                            itemStyle: {
                                opacity: 0.2
                            },
                            symbolRepeat: 'fixed',
                            symbolSize: [28, 28],
                            symbolMargin: '10%',
                            symbolBoundingData: [changeSeries[i].minMax[j][0], changeSeries[i].minMax[j][1]]
                        }
                    ]

                });
            }
        }
        options.push({
            title: {
                text: changeSeries[0].title[0]
            },
            xAxis: {
                min: changeSeries[0].minMax[0][0],
                max: changeSeries[0].minMax[0][1]
            },
            yAxis: {
                data: changeSeries[0].names
            },
            series: [
                {
                    name: '潮流量',
                    type: 'pictorialBar',
                    symbol: drop_url,
                    barWidth: 18,
                    symbolClip: true,
                    symbolRepeat: true,
                    symbolSize: [28, 28],
                    symbolMargin: '10%',
                    data: changeSeries[0].data[0]
                },
                {
                    data: changeSeries[0].data[0],
                    name: '潮流量',
                    type: 'pictorialBar',
                    symbol: drop_url,
                    barWidth: 18,
                    itemStyle: {
                        opacity: 0.2
                    },
                    symbolRepeat: 'fixed',
                    symbolSize: [28, 28],
                    symbolMargin: '10%',
                    symbolBoundingData: [changeSeries[0].minMax[0][0], changeSeries[0].minMax[0][0]]
                }
            ]
        })
        return options;
    }

    private generateTideAmountChartSeries(fluxData: Array<StringKeyObject>): Array<StringKeyObject> {
        let changeSeries = [];
        for (let record of fluxData) {
            changeSeries.push(prepareOneFluxData(record)); 
        }
        return changeSeries;
    }

    private buildFlowVelocityChartOption(): EChartsOption | EChartsOption[] { // 流速
        return {};
    }

    private generateFlowVelocityChartSeries(): StringKeyObject {
        return {};
    }

    private async buildSandAmountChartOption(currentProjectId: string): Promise<EChartsOption> { // 沙量
        const dynamicNum = this.requestStringData.length;
        const curNames = this.requestStringData[(this.dynamicIndex%dynamicNum)];
        // console.log("names", curNames);
        const curDataSeries = [];
        for (let name of curNames) {
            const aData = await getSandContentValue(currentProjectId, name);
            const aSerieData = this.generateSandAmountChartSeries(aData?.data);
            curDataSeries.push({
                name: name,
                symbolSize: 4,
                type: 'line',
                data: aSerieData,
                emphasis: {
                    focus: 'series'
                },
                lineStyle: {
                    width: 3,
                },
            });
        }
        // console.log("data series", curDataSeries);
        if (this.dynamicIndex == 0) {
            const option: EChartsOption = {
                color: ['#f49f42', '#eedd78', '#73a373', '#E3A032', '#73b9bc', '#7289ab', '#91ca8c', '#dd6b66', '#8dc1a9', '#759aa0', '#e69d87', '#ea7e53'],
                title: {
                    left: 'center',
                    text: '含沙量',
                    top: '2%',
                    textStyle: {
                        fontSize: 28,
                        color: 'rgba(255, 255, 255, 0.8)'
                    }
                },
                legend: {
                    show: true,
                    orient: 'horizontal',
                    right: '1%',
                    top: '2%',
                    // width: '10%',
                    itemGap: 15,
                    // itemWidth: 5,
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: 6,
                    padding: 10,
                    textStyle: {
                        fontWeight: 'bold',
                        color: 'rgba(255, 255, 255, 0.9)'
                    },
                    lineStyle: {
                        width: 4
                    }
                },
                // backgroundColor: '#063462c1',
                tooltip: { show: true, trigger: 'axis' },
                xAxis: {
                    type: 'time',
                    // name: '起点距(米)',
                    nameTextStyle: {
                        color: 'rgba(255,255,255, 0.7)',
                        fontSize: 14,
                        fontWeight: 'bold'
                    },
                    axisLine: {
                        lineStyle: {
                            color: 'rgba(233,233,233, 0.5)'
                        },
                        onZero: false
                    },
                    splitLine: {
                        show: false
                    },
                    axisLabel: {
                        fontSize: 16,
                        color: 'rgba(255,255,255, 0.75)',
                        formatter: '{dd}-{hh}:00'
                    },
                    min: (value) => {
                        return value.min
                    },
                    max: (value) => {
                        return value.max
                    },
                    boundaryGap: ['5%', '5%']
                },
                yAxis: {
                    type: 'value',
                    name: 'kg/m2',
                    nameTextStyle: {
                        color: 'rgba(255,255,255, 0.7)',
                        fontSize: 14,
                        fontWeight: 'bold'
                    },
                    axisLine: {
                        lineStyle: {
                            color: 'rgba(233,233,233, 0.5)'
                        },
                        onZero: false
                    },
                    splitLine: {
                        lineStyle: {
                            color: 'rgba(255,255,255, 0.2)',
                            width: 1.5
                        }
                    },
                    axisLabel: {
                        fontSize: 16,
                        color: 'rgba(255,255,255, 0.75)'
                    },
                    min: 0,
                    max: (value) => {
                        return (value.max+0.0005).toFixed(4);
                    },
                },
                grid: {
                    top: '14%',
                    bottom: '2%',
                    left: '1%',
                    right: '2%',
                    containLabel: true
                },
                series: curDataSeries as any
            }
            return option;
        }
        else {
            return {
                series: curDataSeries as any
            };
        }
    }

    private generateSandAmountChartSeries(chartData: StringKeyObject): Array<Array<number>> {
        const resData = chartData["time"].map((key: string, index: number) => [Date.parse(key.replace(' ', 'T')), chartData["value"][index]]);
        // console.log(resData);
        return resData;
    }

    private buildBottomParticleChartOption(optionChangeData: StringKeyObject): EChartsOption[] { // 底浮
        // console.log(optionChangeData);
        let optionInit: EChartsOption = {
            // color: ['#dd6b66', '#8dc1a9', '#759aa0', '#e69d87', '#ea7e53', '#eedd78', '#73a373', '#73b9bc', '#7289ab', '#91ca8c', '#f49f42'],
            title: {
                text: optionChangeData["name"][0]+'\n底质颗分成果',
                left: '1%',
                top: 10,
                textStyle: {
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontWeight: 'bolder',
                    fontFamily: 'Microsoft YaHei',
                    fontSize: 20,
                }
            },
            tooltip: {
                trigger: 'item',
            },
            legend: {
                orient: 'vertical',
                top: '16%',
                right: '1%',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                borderRadius: 10,
                show: true,
                padding: 10,
                height: '85%',
                textStyle: {
                    color: 'white',
                    fontWeight: 'bold'
                }
            },
            visualMap: {
                show: false,
                min: optionChangeData["minMax"][0][0],
                max: optionChangeData["minMax"][0][1],
                inRange: {
                    color: '#FFEAB9',
                    colorLightness: [0.8, 0.3],
                }
            },
            series: {
                name: '底质颗粒百分数',
                type: 'pie',
                radius: ['24%', '64%'],
                center: ['32%', '58%'],
                // roseType: 'radius',
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 8,
                    color: '#415CC2',
                    shadowBlur: 200,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                },
                label: {
                    show: false,
                    position: 'center',
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: 16,
                        fontWeight: 'bold',
                        borderColor: 'black',
                        color: 'white'
                    }
                },
                data: optionChangeData["series"], 
            }
        }
        const changeNum = optionChangeData["name"].length;
        let optionArray: EChartsOption[] = [optionInit];
        for (let i=0; i< changeNum; i++) {
            const optionNew: EChartsOption = {
                title: {
                    text: optionChangeData["name"][i]+'\n底质颗分成果',
                },
                visualMap: {
                    min: optionChangeData["minMax"][i][0],
                    max: optionChangeData["minMax"][i][1],
                },
                series: {
                    data: optionChangeData["series"][i]
                }
            }
            optionArray.push(optionNew);
        }
        return optionArray;
    }

    private generateBottomParticleChartSeries(chartData: Array<StringKeyObject>): StringKeyObject {
        let optionChange: StringKeyObject = {name: [], series: [], minMax: []};
        for (const item of chartData) {
            const day = item["time"].split(' ')[0]
            optionChange.name.push(day+item["location"]+item["type"]);
            const seriesData = preparePercentData(item["level"]);
            optionChange.series.push(seriesData["percentData"]);
            optionChange.minMax.push([seriesData["min"], seriesData["max"]]);
        }
        // console.log(optionChange);
        return optionChange;
    }

    private buildSandTransChartOption(): EChartsOption { // 大断面沙量
        return {};
    }

    private generateSandTransChartSeries(): StringKeyObject {
        return {};
    }
}

export {
    ProjectOption,
    chartOptionTest,
    ChartDataPreparer
}
