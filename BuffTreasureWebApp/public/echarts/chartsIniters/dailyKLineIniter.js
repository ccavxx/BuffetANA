// 基于准备好的dom，初始化echarts实例
let daily_data = [];

let daily_KLineChart = echarts.init(document.getElementById('dailyKLineChart'), 'shine');
let daily_KDJChart = echarts.init(document.getElementById('daily_KDJChart'), 'shine');
let daily_MACDChart = echarts.init(document.getElementById('daily_MACDChart'), 'shine');
let daily_RSIChart = echarts.init(document.getElementById('daily_RSIChart'), 'shine');

function loadDailyKLineChart() {
    let daily_KLineChartOption = {
        title: {
            show: false,
            text: '个股',
            left: 'center'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross'
            },
            position: (pos, params, el, elRect, size) => {
                let obj = {top: 30};
                obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 200;
                return obj;
            },
            formatter: function (params) {
                let res = '';
                let index = params[0].dataIndex;
                let turnOverRate = daily_KLineChartOption.series[5].turnOverRates[index];
                let changeRate = daily_KLineChartOption.series[0].changeRates[index];

                for (let i = 0; i < params.length; i++) {
                    let value = params[i].value;

                    if (params[i].seriesName === '成交量') {
                        if (value !== '-')
                            value = Math.round(params[i].value * 100) / 100;
                        res = res + '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:' + params[i].color + '"></span>' + params[i].seriesName + ': ' + value;
                        res = res + '<br/>换手率' + ': ' + Math.round(turnOverRate * 100) / 100 + '%';
                        if (i === 0)
                            res += '<br/>';
                    } else if (params[i].seriesName === '日K') {
                        res = res + '日K' + '<br/>开盘价: ' + value[0] + '  收盘价: ' + value[1] + '<br/>最低价: ' + value[2] + ' 最高价: ' + value[3] + '<br/>涨跌幅: ' + Math.round(changeRate * 100) / 100 + '%<br/>';
                    } else {
                        if (value !== '-')
                            value = Math.round(params[i].value * 100) / 100;
                        res = res + '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:' + params[i].color + '"></span>' + params[i].seriesName + ': ' + value;
                        if (i !== params.length - 1 && params[i].seriesName === 'MA30')
                            res += '<br/>';
                    }

                    if (i !== params.length - 1)
                        res += '<br/>';
                }
                return res;
            }
        },
        legend: {
            data: ['日K', 'MA5', 'MA10', 'MA20', 'MA30'],
        },
        axisPointer: {
            link: {xAxisIndex: 'all'},
            label: {
                backgroundColor: '#777'
            }
        },
        toolbox: {
            right: 100,
            feature: {
                saveAsImage: {},
                restore: {}
            }
        },
        grid: [
            {
                top: '10%',
                height: '55%'
            },
            {
                top: '72%',
                height: '15%'
            }
        ],
        xAxis: [
            {
                type: 'category',
                data: daily_data.categoryData,
                splitNumber: 20
            },
            {
                type: 'category',
                gridIndex: 1,
                data: daily_data.categoryData,
                axisLabel: {show: false},
            }
        ],
        yAxis: [
            {
                type: 'value',
                scale: true,
                splitArea: {
                    show: false
                }
            },
            {
                type: 'value',
                scale: true,
                gridIndex: 1,
                axisLabel: {show: false},
                axisLine: {show: false},
                axisTick: {show: false},
                splitLine: {show: false}
            }
        ],
        dataZoom: [
            {
                type: 'inside',
                xAxisIndex: [0, 1],
            },
            {
                show: true,
                realtime: true,
                xAxisIndex: [0, 1],
                type: 'slider',
                startValue: -30,
                endValue: -1
            }
        ],
        series: [
            {
                name: '日K',
                type: 'candlestick',
                data: daily_data.KLineValue,
                changeRates: daily_data.changeRates,
            },
            {
                name: 'MA5',
                type: 'line',
                data: calculateMA(5),
                smooth: true,
                lineStyle: {
                    normal: {opacity: 0.5}
                }
            },
            {
                name: 'MA10',
                type: 'line',
                data: calculateMA(10),
                smooth: true,
                lineStyle: {
                    normal: {opacity: 0.5}
                }
            },
            {
                name: 'MA20',
                type: 'line',
                data: calculateMA(20),
                smooth: true,
                lineStyle: {
                    normal: {opacity: 0.5}
                }
            },
            {
                name: 'MA30',
                type: 'line',
                data: calculateMA(30),
                smooth: true,
                lineStyle: {
                    normal: {opacity: 0.5}
                }
            },
            {
                name: '成交量',
                type: 'bar',
                xAxisIndex: 1,
                yAxisIndex: 1,
                data: daily_data.volumns,
                turnOverRates: daily_data.turnOverRates
            }
        ]
    };
    let daily_KDJChartOption = {
        title: {
            show: false,
            text: 'KDJ',
            left: 'center'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross'
            },
            position: (pos, params, el, elRect, size) => {
                let obj = {top: 30};
                obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 250;
                return obj;
            },
            formatter: function (params) {
                let res = '';

                for (let i = 0; i < params.length; i++) {
                    let value = params[i].value;

                    if (value !== '-')
                        value = Math.round(params[i].value * 100) / 100;
                    res = res + '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:' + params[i].color + '"></span>' + params[i].seriesName + ': ' + value;
                    if (i !== 2)
                        res += '<br/>';
                }
                return res;
            }
        },
        legend: {
            data: ['K值', 'D值', 'J值'],
        },
        axisPointer: {
            link: {xAxisIndex: 'all'},
            label: {
                backgroundColor: '#777'
            }
        },
        toolBox: {
            show: false
        },
        grid: [
            {
                top: '25%',
                height: '70%'
            }
        ],
        xAxis: [
            {
                type: 'category',
                data: daily_data.categoryData,
                axisLabel: {show: false},
            }
        ],
        yAxis: [
            {
                scale: true,
                splitArea: {
                    show: false
                },
                splitNumber: 2,
                splitLine: {show: false}
            }
        ],
        dataZoom: [
            {
                type: 'inside',
            },
            {
                show: false,
                realtime: true,
                type: 'slider',
                startValue: -30,
                endValue: -1
            }
        ],
        series: [
            {
                name: 'K值',
                type: 'line',
                data: daily_data.kIndexes,
                itemStyle: {
                    normal: {
                        color: 'grey',
                        lineStyle: {
                            width: 1,
                        }
                    }
                }
            },
            {
                name: 'D值',
                type: 'line',
                data: daily_data.dIndexes,
                itemStyle: {
                    normal: {
                        color: 'orange',
                        lineStyle: {
                            width: 1
                        }
                    }
                }
            },
            {
                name: 'J值',
                type: 'line',
                data: daily_data.jIndexes,
                itemStyle: {
                    normal: {
                        color: 'purple',
                        lineStyle: {
                            width: 1
                        }
                    }
                }
            },
        ]
    };
    let daily_MACDChartOption = {
        title: {
            show: false,
            text: 'MACD',
            left: 'center'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross'
            },
            position: (pos, params, el, elRect, size) => {
                let obj = {top: 30};
                obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 250;
                return obj;
            },
            formatter: function (params) {
                let res = '';

                for (let i = 0; i < params.length; i++) {
                    let value = params[i].value;

                    if (value !== '-')
                        value = Math.round(params[i].value * 100) / 100;
                    res = res + '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:' + params[i].color + '"></span>' + params[i].seriesName + ': ' + value;
                    if (i !== 2)
                        res += '<br/>';
                }
                return res;
            }
        },
        legend: {
            data: ['MACD', 'DIF', 'DEA'],
        },
        axisPointer: {
            link: {xAxisIndex: 'all'},
            label: {
                backgroundColor: '#777'
            }
        },
        toolBox: {
            show: false
        },
        grid: [
            {
                top: '25%',
                height: '70%'
            }
        ],
        xAxis: [
            {
                type: 'category',
                data: daily_data.categoryData,
                axisLabel: {show: false},
                splitNumber: 20
            }
        ],
        yAxis: [
            {
                scale: true,
                splitArea: {
                    show: false
                },
                splitNumber: 2,
                axisLine: {onZero: false},
                axisTick: {show: false},
                splitLine: {show: false},
                axisLabel: {show: true}
            }
        ],
        dataZoom: [
            {
                type: 'inside',
            },
            {
                show: false,
                realtime: true,
                type: 'slider',
                startValue: -30,
                endValue: -1
            }
        ],
        series: [
            {
                name: 'MACD',
                type: 'bar',
                data: daily_data.macds,
                itemStyle: {
                    normal: {
                        color: function (params) {
                            let colorList;
                            if (params.data >= 0) {
                                colorList = '#ef232a';
                            } else {
                                colorList = '#14b143';
                            }
                            return colorList;
                        }
                    }
                }
            },
            {
                name: 'DIF',
                type: 'line',
                data: daily_data.difs
            },
            {
                name: 'DEA',
                type: 'line',
                data: daily_data.deas
            }
        ]
    };
    let daily_RSIChartOption = {
        title: {
            show: false,
            text: 'RSI',
            left: 'center'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross'
            },
            position: (pos, params, el, elRect, size) => {
                let obj = {top: 30};
                obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 250;
                return obj;
            },
            formatter: function (params) {
                let res = '';

                for (let i = 0; i < params.length; i++) {
                    let value = params[i].value;

                    if (value !== '-')
                        value = Math.round(params[i].value * 100) / 100;
                    res = res + '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:' + params[i].color + '"></span>' + params[i].seriesName + ': ' + value;
                    if (i !== 2)
                        res += '<br/>';
                }
                return res;
            }
        },
        legend: {
            data: ['RSI6', 'RSI12', 'RSI24'],
        },
        axisPointer: {
            link: {xAxisIndex: 'all'},
            label: {
                backgroundColor: '#777'
            }
        },
        toolBox: {
            show: false
        },
        grid: [
            {
                top: '25%',
                height: '70%'
            }
        ],
        xAxis: [
            {
                type: 'category',
                data: daily_data.categoryData,
                axisLabel: {show: false},
            }
        ],
        yAxis: [
            {
                scale: true,
                splitArea: {
                    show: false
                },
                splitNumber: 2,
                splitLine: {show: false}
            }
        ],
        dataZoom: [
            {
                type: 'inside',
            },
            {
                show: false,
                realtime: true,
                type: 'slider',
                startValue: -30,
                endValue: -1
            }
        ],
        series: [
            {
                name: 'RSI6',
                type: 'line',
                data: daily_data.rsi6s,
                itemStyle: {
                    normal: {
                        color: 'grey',
                        lineStyle: {
                            width: 1,
                        }
                    }
                }
            },
            {
                name: 'RSI12',
                type: 'line',
                data: daily_data.rsi12s,
                itemStyle: {
                    normal: {
                        color: 'orange',
                        lineStyle: {
                            width: 1
                        }
                    }
                }
            },
            {
                name: 'RSI24',
                type: 'line',
                data: daily_data.rsi24s,
                itemStyle: {
                    normal: {
                        color: 'purple',
                        lineStyle: {
                            width: 1
                        }
                    }
                }
            },
        ]
    };

    // 使用刚指定的配置项和数据显示图表
    daily_KLineChart.setOption(daily_KLineChartOption);
    daily_KDJChart.setOption(daily_KDJChartOption);
    daily_MACDChart.setOption(daily_MACDChartOption);
    daily_RSIChart.setOption(daily_RSIChartOption);

    echarts.connect([daily_KLineChart, daily_KDJChart, daily_MACDChart, daily_RSIChart]);

    setTimeout(() => {
        window.onresize = function () {
            daily_KLineChart.resize();
            daily_KDJChart.resize();
            daily_MACDChart.resize();
            daily_RSIChart.resize();
        }
    }, 200);
}

loadDailyKLineChart();