/**
 * Created by wshwbluebird on 2017/5/9.
 */


let thermometerDB = require('../../models/thermometer').thermometerDB;
let singleStockDB = require('../../models/singleStock.js').singleStockDB;
let RTEnvironmentDB = require('../../models/RTEnvironment').RTEnvironmentDB
let stockRTInfoDB = require('../../models/stockRTInfo').stockRTInfoDB
let bl = require('./thermometerbl');


/**
 * 根据开始日期，结束日期 和观察期的天数 返回这个期间每一天的市场温度分类列表
 * TODO 划分参数可能修改!!!!!!
 * 划分说明    温度高低判断:   0.3 * 市场温度(0~100) + 0.3 * 换手率前50赚钱效应(0~100) + 0.4 * 整体赚钱效应(0~100)
 *            高温  > 55
 *            低温  < 55
 *
 *            走势趋同性判断   昨日涨停股票今日表现(-10~10) - 昨日跌停股票今日表现(-10~10)
 *            趋同  > 2.4
 *            驱反  < 2.4
 *
 *
 * @param beginDate  开始日期
 * @param endDate    结束日期
 * @param formationDays  观察期天数 (所得的新温度进行平均)
 * @param callback 形如 (err, docs) => { }
 * docs 形式
 *     {
 *        'date':  具体日期（Date 型）
          'environment': 具体环境类型  （String）   例如： Normal
      }的列表！！！  按date属性从小到大排序

 */
exports.getEachDayEnvironmentByFormation = (beginDate , endDate, formationDays, callback)=>{
    //定义 获取从那一天开始调用数据
    let searchBeginDate = new Date(beginDate - (formationDays * 5 + 5) * 24000 * 3600);

    thermometerDB.getThermometerInRangeDate(searchBeginDate,endDate, (err, docs)=>{

        let temp = 0 ;               //温度
        let earnEffect50 = 0;        //  换手率前50 赚钱效应
        let earnEffectAll = 0;       //  赚钱效应
        let lastUpToday = 0 ;        //  昨日涨停股票今日表现
        let lastDownToday = 0;       //  昨日跌停股票今日表现

        //根据计算的参数 获得分类
        /**
         *
         * @param temp 温度
         * @param earnEffect50
         * @param earnEffectAll
         * @param lastUpToday
         * @param lastDownToday
         */
        let getClassify = function(temp , earnEffect50, earnEffectAll, lastUpToday, lastDownToday) {
            // let w = temp * 0.5 + earnEffect50 *0.3 + earnEffectAll*0.2;
            let w = temp ;
            let q = lastUpToday - lastDownToday;
            let strw;
            let strq;
           // console.log(w)

            //console.log(w)
            if(w >= 60)
                strw = 'High'
            else if(w < 60)
                strw = 'Low';
            else
                return 'Normal';
            if(q > 4.8)
                strq = 'Same';
            else if(q < 4.8)
                strq = 'Opposite';
            else
                return 'Normal';
            return `${strw}And${strq}`;


        }

        //计算第一个周期
        for(let i = 0 ; i < formationDays; i++ ){
            temp += docs[i]['temperature'];               //温度
            earnEffect50 += docs[i]['lastTurnOver'];       //  换手率前50 赚钱效应
            earnEffectAll += docs[i]['moneyEffect'];      //  赚钱效应
            lastUpToday += docs[i]['lastLimitUp'];        //  昨日涨停股票今日表现
            lastDownToday += docs[i]['lastLimitDown'];      //  昨日跌停股票今日表现
        }

        let begin = 0 ;
        let end =  formationDays;
        let data = [];

        //console.log(docs);
        docs = Array.from(docs);
        for(; (docs[begin]['date']-beginDate)>=0 ; begin++){
            let oneDay = {
                'date': docs[begin]['date'],
                'environment':getClassify(temp/formationDays,earnEffect50/formationDays
                    ,earnEffectAll/formationDays,lastUpToday/formationDays,lastDownToday/formationDays)
            };

            data.push(oneDay);
            //console.log(oneDay)

            temp += docs[end]['temperature'] - docs[begin]['temperature'];               //温度
            earnEffect50 += docs[end]['lastTurnOver'] - docs[begin]['lastTurnOver'];       //  换手率前50 赚钱效应
            earnEffectAll += docs[end]['moneyEffect']- docs[begin]['moneyEffect'];         //  赚钱效应
            lastUpToday += docs[end]['lastLimitUp'] - docs[begin]['lastLimitUp'];          //  昨日涨停股票今日表现
            lastDownToday += docs[end]['lastLimitDown']- docs[begin]['lastLimitDown'];         //  昨日跌停股票今日表现
            end++;
        }

        data.reverse();
        //console.log(data)
        callback(null,data);

    });

}






/**
 * 获取某一天的市场温度环境
 * 不是实时的  基于历史的
 *
 * 如果 存在直接从数据库中提取
 * 如果不存在去计算
 *
 * @param date   日期
 * @param callback   回调函数 形如 (err, docs) => { }
 */
exports.getDailyEnvironment  = (date , callback) =>{
    thermometerDB.getThermometerByDate(date,(err,doc)=>{
        if(err){
            callback(err,null);
        }else{

            //如果要查找的市场温度信息不存在!
            if(doc === null){

               //获取返回当日信息的Promise
                console.log('BLThermometer: Calculating')
               function getStockByDate(date){
                   return new Promise(function(resolve, reject){
                       singleStockDB.getStockInfoByDate(date,(err,doc)=>{
                           //在异步操作成功时调用，并将异步操作的结果，作为参数传递出去
                           if(doc.length !==0 ) {
                               let data = {};
                               data['doc'] = doc;
                               data['date'] = date;
                               resolve(data)
                           }
                           else
                               reject();
                       });
                   })
               }

                //获取返回前一日信息的Promise
                function getStockByDateBefore(oldDoc,date){
                    date = new Date(date - 24000 * 3600);
                    //console.log(date)
                    return new Promise(function(resolve, reject){
                        singleStockDB.getStockInfoByDate(date,(err,doc)=>{
                            //TODO   最前端 怎么办 没有解决

                            //在异步操作成功时调用，并将异步操作的结果，作为参数传递出去
                            if(doc.length !==0 ) {
                                let data = {};
                                data['before'] = doc;
                                data['today'] = oldDoc;
                                resolve(data)
                            }
                            else
                                //算是另一种形式的递归调用
                                resolve(getStockByDateBefore(oldDoc,date))
                        });
                    })
                }

                //真正计算我们需要的环境内容
                function calculateThermometer(givenData) {
                    //应该是草被一份数据
                    const before = [...givenData['before']];
                    const today = [...givenData['today']];
                    //建立 要计算的数据模型
                    let curDate = today[0]['date'];
                    let limitUp = 0; //当日涨停股票的个数
                    let limitDown = 0 ; //当日跌停股票的个数
                    let halfLimitUp = 0; //当日涨超过5%股票的个数
                    let halfLimitDown = 0; //当日跌超过5%股票的个数
                    let temperature;   //市场温度 这里用通信达的计算方法 越高越好
                    let lastLimitUp;  //昨日涨停股票今日表现    反应市场的追涨情况
                    let lastLimitDown; //跌停涨停股票今日表现    反应市场的追跌情况
                    let lastTurnOver;    //换手率前50只个股赚钱效应
                    let yesUpNum = 0;      // 昨日涨停股票个数
                    let yesDownNum = 0;   // 昨日跌停股票个数
                    let yesUpValue = 0;   // 昨日涨停股票今日总体涨幅
                    let yesDownValue = 0;  // 昨日跌停股票今日总体涨幅
                    let upNum = 0;       // 今日上涨股票个数
                    let downNum = 0;     //今日下跌股票个数
                    let moneyEffect;    //率前50只个股赚钱效应

                   js = 0;
                   today.forEach((data,i) => {

                       if(data['volume']!==0) {

                           //计算今日不同涨幅股票的个数
                           if (data['changeRate'] > 0) {
                               upNum++;
                               if (data['changeRate'] >= 5) {
                                   halfLimitUp++;
                                   if (data['changeRate'] >= 10)
                                       limitUp++
                               }
                           }else if (data['changeRate'] < 0) {
                               downNum++;
                               if (data['changeRate'] <= -5) {
                                   halfLimitDown++;
                                   if (data['changeRate'] <= -10)
                                       limitDown++
                               }
                           }

                           while(js< before.length && before[js]['code']<data['code']){
                               // console.log(before[js]['code'],data['code'])
                               js++;
                           }

                           if(js< before.length && before[js]['code']===data['code']) {
                               let lastInfo = before[js];

                               if (lastInfo['changeRate'] >= 10) {
                                   yesUpNum++;
                                   yesUpValue += data['changeRate'];
                               } else if (lastInfo['changeRate'] <= -10) {
                                   yesDownNum++;
                                   yesDownValue += data['changeRate'];
                               }
                           }
                       }
                   });


                    //汇总统计信息
                    temperature =
                        limitUp* 100 /((limitDown + limitUp)===0?1:(limitDown + limitUp));
                    moneyEffect =
                        upNum*100/(downNum+upNum);

                    // console.log(yesDownValue)
                    lastLimitDown = yesDownValue / (yesDownNum===0?1:yesDownNum);
                    lastLimitUp = yesUpValue / (yesUpNum===0?1:yesUpNum);

                    //计算换手率前50 的赚钱效应

                    let changUpNum = 0;
                    let changDownNum = 0;
                    today
                        .sort((a,b) => b['turnOverRate'] - a['turnOverRate'])
                        .slice(0,50)
                        .map(d => d['changeRate'])
                        .forEach( d =>{
                            if(d > 0) changUpNum ++;
                            else if(d < 0) changDownNum ++;
                        }

                    );

                    lastTurnOver = (changUpNum * 100) / (changUpNum + changDownNum)

                    //返回统计数据
                    let thermometer = {
                        "date": curDate,
                        "limitUp": limitUp,  //当日涨停股票的个数
                        "limitDown": limitDown,  //当日跌停股票的个数
                        "halfLimitUp": halfLimitUp, //当日涨超过5%股票的个数
                        "halfLimitDown": halfLimitDown, //当日跌超过5%股票的个数
                        "temperature": temperature,  //市场温度 这里用通信达的计算方法 越高越好
                        "lastLimitUp": lastLimitUp.toFixed(5),   //昨日涨停股票今日表现    反应市场的追涨情况
                        "lastLimitDown": lastLimitDown.toFixed(5),  //跌停涨停股票今日表现    反应市场的追跌情况
                        "lastTurnOver": lastTurnOver.toFixed(5),  //换手率前50只个股赚钱效应为26%
                        "moneyEffect": moneyEffect.toFixed(5),   //总体赚钱效应在一个总体内赚钱效应  上涨家数与涨跌总家数之比
                     };
                    //console.log(thermometer)
                    return thermometer

                }

                // 把得到的结果写会数据库 的promise
                //获取返回前一日信息的Promise
                function getWriteToDB(thermometer){
                    return new Promise(function(resolve, reject){
                        thermometerDB.writeThermometerByDate(thermometer,(err,doc)=>{
                            resolve(thermometer);
                        });
                    })
                }

               //Promise  逐步返回调用
               getStockByDate(date)
                   .then((data) => getStockByDateBefore(data['doc'],data['date']))
                   .then((data) => calculateThermometer(data))
                   .then((data) => getWriteToDB(data))
                   .then(data => callback(null,data))
                   .catch(()=>callback(err,null));

            }else{
                console.log('BLThermometer:  Not Need Calculate');
                callback(err, doc)

            }

        }
    });
};


/**
 * 一般在测试中运行  将从beginDate 到 endDate 期间 每天的市场温度 计算并写入数据库
 * @param beginDate
 * @param endDate
 * @param callback
 * @constructor
 */
exports.WriteDailyEnvironmentRange  = (beginDate, endDate , callback) =>{
    let oneDayTime = 24000*3600;
    //console.log('here')
    function getWriteOneDayPromise(date) {
        //date = new Date(date - 24000 * 3600);
        return new Promise(function(resolve, reject){
            if(date  < beginDate){
                reject(new Error('nothing'));
            }else{
                bl.getDailyEnvironment(date,(err,doc)=>{

                    date = new Date(date - 24000 * 3600);
                    console.log(date)
                    resolve(getWriteOneDayPromise(date));
                })
            }
        });
    }

    getWriteOneDayPromise(endDate).then(date =>  console.log(date)).catch(err=>callback());
}

/**
 * 将当前的市场温度写入市场温度的RT数据库  ， 必须有stockRT
 * @param callback
 */
exports.writerCurrentThermometor = (callback) =>{
    stockRTInfoDB.getAllRTInfo((err,doc)=>{
        if(err){
            callback(err,null);
        }else{
            //获取返回前一日信息的Promise
            function getStockByDateBefore(oldDoc, date) {
                date = new Date(date - 24000 * 3600);
                //console.log(date)
                return new Promise(function (resolve, reject) {
                    singleStockDB.getStockInfoByDate(date, (err, doc) => {

                        //在异步操作成功时调用，并将异步操作的结果，作为参数传递出去
                        if (doc.length !== 0) {
                            let data = {};
                            data['before'] = doc;
                            data['today'] = oldDoc;
                            resolve(data)
                        }
                        else
                        //算是另一种形式的递归调用
                            resolve(getStockByDateBefore(oldDoc, date))
                    });
                })
            }

            //真正计算我们需要的环境内容
            function calculateThermometer(givenData) {
                //应该是草被一份数据
                const before = [...givenData['before']];

                const today = [...givenData['today']];

                //建立 要计算的数据模型
                let curDate = today[0]['date'];
                let limitUp = 0; //当日涨停股票的个数
                let limitDown = 0; //当日跌停股票的个数
                let halfLimitUp = 0; //当日涨超过5%股票的个数
                let halfLimitDown = 0; //当日跌超过5%股票的个数
                let temperature;   //市场温度 这里用通信达的计算方法 越高越好
                let lastLimitUp;  //昨日涨停股票今日表现    反应市场的追涨情况
                let lastLimitDown; //跌停涨停股票今日表现    反应市场的追跌情况
                let lastTurnOver;    //换手率前50只个股赚钱效应
                let yesUpNum = 0;      // 昨日涨停股票个数
                let yesDownNum = 0;   // 昨日跌停股票个数
                let yesUpValue = 0;   // 昨日涨停股票今日总体涨幅
                let yesDownValue = 0;  // 昨日跌停股票今日总体涨幅
                let upNum = 0;       // 今日上涨股票个数
                let downNum = 0;     //今日下跌股票个数
                let moneyEffect;    //率前50只个股赚钱效应

                let js = 0;
                today.forEach((data) => {
                    if (data['volume'] !== 0) {

                        //计算今日不同涨幅股票的个数
                        if (data['change_rate'] > 0) {
                            upNum++;
                            if (data['change_rate'] >= 5) {
                                halfLimitUp++;
                                if (data['change_rate'] >= 10)
                                    limitUp++
                            }
                        } else if (data['change_rate'] < 0) {
                            downNum++;
                            if (data['change_rate'] <= -5) {
                                halfLimitDown++;
                                if (data['change_rate'] <= -10)
                                    limitDown++
                            }
                        }


                        //计算昨日涨停跌停今天的平均涨幅
                        // console.log(before.length)
                        while(js< before.length && before[js]['code']<data['code']){
                            js++;
                        }

                        if(js< before.length && before[js]['code']===data['code']) {
                            let lastInfo = before[js];
                            if (lastInfo['changeRate'] >= 10) {
                                yesUpNum++;
                                yesUpValue += data['change_rate'];
                            } else if (lastInfo['changeRate'] <= -10) {
                                yesDownNum++;
                                yesDownValue += data['change_rate'];
                            }
                        }
                    }
                });


                //汇总统计信息
                temperature =
                    limitUp * 100 / ((limitDown + limitUp) === 0 ? 1 : (limitDown + limitUp));
                moneyEffect =
                    upNum * 100 / (downNum + upNum);

                lastLimitDown = yesDownValue / (yesDownNum === 0 ? 1 : yesDownNum);
                lastLimitUp = yesUpValue / (yesUpNum === 0 ? 1 : yesUpNum);

                //计算换手率前50 的赚钱效应

                let changUpNum = 0;
                let changDownNum = 0;
                today
                    .sort((a, b) => b['turnOverRate'] - a['turnOverRate'])
                    .slice(0, 50)
                    .map(d => d['change_rate'])
                    .forEach(d => {
                            if (d > 0) changUpNum++;
                            else if (d < 0) changDownNum++;
                        }
                    );

                lastTurnOver = (changUpNum * 100) / (changUpNum + changDownNum)

                //返回统计数据
                let thermometer = {
                    "limitUp": limitUp,  //当日涨停股票的个数
                    "limitDown": limitDown,  //当日跌停股票的个数
                    "halfLimitUp": halfLimitUp, //当日涨超过5%股票的个数
                    "halfLimitDown": halfLimitDown, //当日跌超过5%股票的个数
                    "temperature": temperature,  //市场温度 这里用通信达的计算方法 越高越好
                    "lastLimitUp": lastLimitUp.toFixed(5),   //昨日涨停股票今日表现    反应市场的追涨情况
                    "lastLimitDown": lastLimitDown.toFixed(5),  //跌停涨停股票今日表现    反应市场的追跌情况
                    "lastTurnOver": lastTurnOver.toFixed(5),  //换手率前50只个股赚钱效应为26%
                    "moneyEffect": moneyEffect.toFixed(5),   //总体赚钱效应在一个总体内赚钱效应  上涨家数与涨跌总家数之比
                };
                console.log(thermometer)
                return thermometer

            }

            function update (result){
                return new Promise(function(resolve,reject){
                    RTEnvironmentDB.upDate(result,(err)=>{
                    if(err)
                        console.log('save RT error')
                    })
                    resolve('ok')
                })
            }

            //Promise  逐步返回调用

            getStockByDateBefore(doc, Date.now())
                .then((data) => calculateThermometer(data))
                .then(data=>update(data))
                .then(data => callback(err, data))

        }

    });
}

