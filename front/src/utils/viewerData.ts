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

let chartOptionTest: EChartsOption[] = [
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
                    itemStyle: {color: 'red'}, 
                    lineStyle: {color: 'red'}, 
                    textStyle: {
                        fontSize: 18,
                        color: 'rgba(233,233,233, 0.7)'
                    }, 
                },
                {
                    name: '断面2',
                    itemStyle: {color: 'red'}, 
                    lineStyle: {color: 'red'}
                },
                // {
                //     name: '断面3',
                //     itemStyle: {color: 'red'}, 
                //     lineStyle: {color: 'red'}
                // },
                // {
                //     name: '断面4',
                //     itemStyle: {color: 'red'}, 
                //     lineStyle: {color: 'red'}
                // },
                // {
                //     name: '断面5',
                //     itemStyle: {color: 'red'}, 
                //     lineStyle: {color: 'red'}
                // },
                // {
                //     name: '断面6',
                //     itemStyle: {color: 'red'}, 
                //     lineStyle: {color: 'red'}
                // },
                // {
                //     name: '断面7',
                //     itemStyle: {color: 'red'}, 
                //     lineStyle: {color: 'red'}
                // },
                // {
                //     name: '断面8',
                //     itemStyle: {color: 'red'}, 
                //     lineStyle: {color: 'red'}
                // },
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
                color: 'rgba(255,255,255, 0.5)'
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
                color: 'rgba(255,255,255, 0.5)'
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
            bottom: '6%',
            left: '4%',
            right: '10%'
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
        let sectionOption: EChartsOption =  {
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
                bottom: '6%',
                left: '4%',
                right: '10%'
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
            if(i > colorMap.length - 1) {
                colorMap.push(["#" + Math.floor(Math.random()*16777215).toString(16), "#" + Math.floor(Math.random()*16777215).toString(16)]);
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
        return {legendData, visualMap, series};
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
