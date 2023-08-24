import axios from "axios";
import * as echarts from "echarts";
import { type EChartsOption } from "echarts";

type ProjectOption = {
    id: number;
    name: string;
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

const drop_url = 'image://https://s1.ax1x.com/2022/05/19/OqSwp6.png';

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
let tideSpeedData = [];
let tideSpeedDataB = [];
let tideDirectDataB = [];
let tideDirectDataA = [];
for (let i = 0; i < 30; i++) {
    let date = new Date(dottedBase + oneHour * i);
    let b = Math.random();
    let c = Math.random();
    let a = Math.random();
    let d = Math.random();
    tideSpeedData.push([+date, b*1.5])
    tideSpeedDataB.push([+date, c*1.5])
    tideDirectDataA.push([+date, a*360])
    tideDirectDataB.push([+date, d*360])
}

var data = [];
// Parametric curve
for (var t = 0; t < 25; t += 0.001) {
    var x = (1 + 0.25 * Math.cos(75 * t)) * Math.cos(t);
    var y = (1 + 0.25 * Math.cos(75 * t)) * Math.sin(t);
    var z = t + 2.0 * Math.sin(75 * t);
    data.push(['S800', y, z]);
}

let chartOptionTest: EChartsOption[] = [
    {
        title: {
            left: 'center',
            text: '潮流量',
            top: '2%',
            textStyle: {
                fontSize: 28,
                color: '#ffff'
            }
        },
        tooltip: { show: true, trigger: 'axis' },
        legend: {
            show: true,
            orient: 'vertical',
            right: '0%',
            top: '3%',
            width: '10%',
            itemGap: 15,
            data: [{
                name: 'bar',
                // itemStyle: { color: 'red' },
                // lineStyle: { color: 'red' },
                textStyle: {
                    fontSize: 18,
                    color: 'rgba(233,233,233, 0.8)'
                },
            }],
        },
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
            // name: '断面',
            // nameTextStyle: {
            //     color: 'rgba(255,255,255, 0.7)',
            //     fontSize: 14,
            //     fontWeight: 'bold',
            // },
            // nameLocation: 'start',
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
        },
        grid: {
            top: '14%',
            bottom: '2%',
            left: '1%',
            right: '2%',
            containLabel: true
        },
        series: {
            name: 'bar',
            type: 'pictorialBar',
            symbol: 'roundRect',
            barWidth: 18,
            itemStyle: {
                // borderRadius: 8,
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: '#14c8d4' },
                    { offset: 1, color: '#43eec6' }
                ])
            },
            symbolRepeat: true,
            symbolSize: [20, 28],
            symbolMargin: '10%',
            data: tideAmountData
        },
    },
    // {
    //     tooltip: { show: true, trigger: 'item' },
    //     series: [
    //         {
    //             type: 'gauge',
    //             anchor: {
    //                 show: true,
    //                 showAbove: true,
    //                 size: 18,
    //                 itemStyle: {
    //                     color: '#FAC858'
    //                 }
    //             },
    //             radius: '90%',
    //             center: ['25%', '50%'],
    //             pointer: {
    //                 icon: 'path://M2090.36389,615.30999 L2090.36389,615.30999 C2091.48372,615.30999 2092.40383,616.194028 2092.44859,617.312956 L2096.90698,728.755929 C2097.05155,732.369577 2094.2393,735.416212 2090.62566,735.56078 C2090.53845,735.564269 2090.45117,735.566014 2090.36389,735.566014 L2090.36389,735.566014 C2086.74736,735.566014 2083.81557,732.63423 2083.81557,729.017692 C2083.81557,728.930412 2083.81732,728.84314 2083.82081,728.755929 L2088.2792,617.312956 C2088.32396,616.194028 2089.24407,615.30999 2090.36389,615.30999 Z',
    //                 width: 8,
    //                 length: '80%',
    //                 // offsetCenter: [0, '8%']
    //             },
    //             progress: {
    //                 show: true,
    //                 overlap: true,
    //                 roundCap: true
    //             },
    //             axisLine: {
    //                 roundCap: true,
    //                 lineStyle: {
    //                     color: [[1, '#c0dde2c1']]
    //                 }
    //             },
    //             axisTick: {
    //                 // splitNumber: 3,
    //                 lineStyle: {
    //                     width: 2,
    //                     color: '#999'
    //                 }
    //             },
    //             axisLabel: {
    //                 color: 'rgba(233, 233, 233, 0.8)',
    //                 fontSize: 16
    //             },
    //             data: [
    //                 {
    //                     value: 20,
    //                     name: 'Good',
    //                     title: {
    //                         offsetCenter: ['-40%', '120%'],
    //                         color: 'rgba(233, 233, 233, 0.8)'
    //                     },
    //                     detail: {
    //                         offsetCenter: ['-40%', '130%'],
    //                         color: 'rgba(233, 233, 233, 0.8)'
    //                     },
    //                 },
    //                 {
    //                     value: 40,
    //                     name: 'Better',
    //                     title: {
    //                         offsetCenter: ['120%', '50%']
    //                     },
    //                     detail: {
    //                         offsetCenter: ['120%', '50%']
    //                     },

    //                 },
    //                 {
    //                     value: 60,
    //                     name: 'Perfect',
    //                     // title: {
    //                     //     offsetCenter: ['40%', '120%']
    //                     // },
    //                     // detail: {
    //                     //     offsetCenter: ['40%', '130%']
    //                     // },
    //                 }
    //             ],

    //             title: {
    //                 offsetCenter: ['40%', '120%']
    //               },
    //             detail: {
    //                 // show: false,
    //                 width: 40,
    //                 height: 14,
    //                 fontSize: 14,
    //                 color: '#fff',
    //                 backgroundColor: 'inherit',
    //                 borderRadius: 3,
    //                 formatter: '{value}%',
    //                 offsetCenter: ['30%', '80%']
    //             },
    //             startAngle: 90,
    //             endAngle: 450,
    //             min: 0,
    //             max: 360,
    //             splitNumber: 12
    //         }
    //     ]
    // },
    {
        color: ['#dd6b66', '#8dc1a9', '#759aa0', '#e69d87', '#ea7e53', '#eedd78', '#73a373', '#73b9bc', '#7289ab', '#91ca8c', '#f49f42'], 
        title: {
            left: 'center',
            text: '流向',
            top: '2%',
            textStyle: {
                fontSize: 28,
                color: '#ffff'
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
            left: '1%',
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
                color: '#ffff'
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
        title: {
            left: 'center',
            text: '大断面成果',
            top: '2%',
            textStyle: {
                fontSize: 28,
                color: '#ffff'
            }
        },
        legend: {
            show: true,
            orient: 'vertical',
            right: '0%',
            top: '12%',
            width: '10%',
            itemGap: 15,
            data: [
                {
                    name: '断面1',
                    itemStyle: { color: 'red' },
                    lineStyle: { color: 'red' },
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
        visualMap: [
            {
                show: false,
                type: 'continuous',
                seriesIndex: 0,
                min: -10,
                max: 0,
                inRange: {
                    color: ['#6819A8', '#E9A7F2'],
                }
            },
        ],
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

class DataViewerPreparer {
    private _isDirty: boolean;
    private _isPrepared = false;
    private _requestUrl = '';
    private _currentData = {};

    constructor(
        private _currentProject: ProjectOption
    ) {
        this._requestUrl = this.buildRequestUrl();
        this._isDirty = false;
        this.requestData()
            .then((res) => {
                this._currentData = res.data;
                console.log("Data Requested.");
            })
            .catch(err => {
                console.log(err);
                this._isDirty = true;
            })
    }

    private buildRequestUrl(): string {
        return `/project/${this._currentProject.id}`
    }

    private async requestData(): Promise<any> {
        console.log("Requeting data...");
        return await axios.get(this._requestUrl);
    }

    get currentData(): any {
        return this._currentData;
    }

    get isDirty(): boolean {
        return this._isDirty;
    }

    set currentProject(newProject: ProjectOption) {
        console.log(`Current Project Changed to ${newProject.name}`);
        this._currentProject = newProject
        this._isDirty = true
        this._requestUrl = this.buildRequestUrl();
        this._currentData = {}
        this.requestData()
            .then((res) => {
                this._currentData = res.data;
            })
            .catch(err => {
                console.log(err);
                this._isDirty = true;
            })
        if (Object.keys(this._currentData).length != 0) {
            this._isDirty = false;
            console.log("Data Changed.")
        }
    }

    public prepareData(): any {
        if (this._isDirty) {
            console.log("Data not Ready for preparation.");
            return null;
        }
        if (this._isPrepared) {
            console.log("Data has been prepared.")
            return null;
        }
    }


}


class ChartDataPreparer {
    private _isDirty = false;
    private _requestUrl: string = '';
    private _isPrepared = false;
    private _currentData: StringKeyObject = {};
    private _currentChartOption: EChartsOption | EChartsOption[] = {};

    constructor(
        public _chartId: number,
        public _currentProjectId: number
    ) {
        // this._requestUrl = this.buildRequestUrl();
        // this.requestData()
        //     .then((res) => {
        //         this._currentData = res.data;
        //         console.log("Data Requested.");
        //         this._currentChartOption = this.buildData2ChartOption();
        //     })
        //     .catch(err => {
        //         console.log(err);
        //         this._isDirty = true;
        //     })
    }

    public async requestChartData(): Promise<any> {
        console.log("Requeting data...");
        let dataType = chartDataNameList[this._chartId];
        this._requestUrl = `/${dataType}/${this._currentProjectId}`
        return await axios.get(this._requestUrl);
    }

    public getDirty() {
        this._isDirty = true;
    }

    public getClean() {
        this._isDirty = false;
    }

    public buildData2ChartOption(requestedData: StringKeyObject): EChartsOption | EChartsOption[] {
        if (this._isDirty) {
            console.log("Data not Ready for preparation.");
            return {};
        }
        if (this._isPrepared) {
            console.log("Data has been prepared.")
            return this._currentChartOption;
        }
        this._currentData = requestedData;
        switch (this._chartId) {
            case 5:
                this._currentChartOption = this.buildSectionChartOption();
                this._isPrepared = true;
                return this._currentChartOption;
            default:
                return chartOptionTest[0];
        }
    }

    private buildSectionChartOption(): EChartsOption | EChartsOption[] { // 大断面
        let generatedPart = this.generateSectionChartSeries();
        let sectionOption: EChartsOption = {
            title: {
                left: 'center',
                text: '大断面成果',
                top: '2%',
                textStyle: {
                    fontSize: 28,
                    color: '#ffff'
                }
            },
            legend: {
                show: true,
                orient: 'vertical',
                right: '0%',
                top: '12%',
                width: '10%',
                itemGap: 15,
                data: generatedPart['legendData']
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
                    color: 'rgba(255,255,255, 0.6)'
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
                    color: 'rgba(255,255,255, 0.6)'
                },
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
            series: generatedPart['series'],
            visualMap: generatedPart['visualMap'],
        }

        return sectionOption;
    }

    private generateSectionChartSeries(): StringKeyObject {
        let series = [];
        let visualMap = [];
        let legendData = [];
        let i = 0;
        for (let name in this._currentData) {
            if (i > colorMap.length - 1) {
                colorMap.push(["#" + Math.floor(Math.random() * 16777215).toString(16), "#" + Math.floor(Math.random() * 16777215).toString(16)]);
            }
            // create legend data
            legendData.push({
                name: name,
                itemStyle: {
                    color: colorMap[i][0],
                },
                lineStyle: {
                    color: colorMap[i][0],
                }
            });

            // create series
            series.push({
                name: name,
                symbolSize: 5,
                data: this._currentData[name],
                type: 'line',
                areaStyle: {}
            });

            let yArray = [];
            for (let aXy of this._currentData[name]) {
                yArray.push(aXy[1]);
            }
            // create visualmaps
            visualMap.push({
                show: false,
                type: 'continuous',
                seriesIndex: i,
                min: Math.min(...yArray),
                max: Math.max(...yArray),
                inRange: {
                    color: colorMap[i],
                }
            })
            i += 1;
        }
        return { legendData, visualMap, series };
    }

    private buildTideHeightChartOption(): EChartsOption | EChartsOption[] { // 潮位
        return {};
    }

    private generateTideHeightChartSeries(): StringKeyObject {
        return {};
    }

    private buildTideAmountChartOption(): EChartsOption | EChartsOption[] { // 潮流量
        return {};
    }

    private generateTideAmountChartSeries(): StringKeyObject {
        return {};
    }

    private buildFlowVelocityChartOption(): EChartsOption | EChartsOption[] { // 流速
        return {};
    }

    private generateFlowVelocityChartSeries(): StringKeyObject {
        return {};
    }

    private buildSandAmountChartOption(): EChartsOption | EChartsOption[] { // 沙量
        return {};
    }

    private generateSandAmountChartSeries(): StringKeyObject {
        return {};
    }

    private buildFloatParticleChartOption(): EChartsOption | EChartsOption[] { // 浮浮
        return {};
    }

    private generateFloatParticleChartSeries(): StringKeyObject {
        return {};
    }

    private buildBottomParticleChartOption(): EChartsOption | EChartsOption[] { // 底浮
        return {};
    }

    private generateBottomParticleChartSeries(): StringKeyObject {
        return {};
    }

    private buildSectionSandChartOption(): EChartsOption | EChartsOption[] { // 大断面沙量
        return {};
    }

    private generateSectionSandChartSeries(): StringKeyObject {
        return {};
    }
}

export {
    ProjectOption,
    DataViewerPreparer,
    chartOptionTest,
    ChartDataPreparer
}
