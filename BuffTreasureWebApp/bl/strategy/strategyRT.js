/**
 * Created by wshwbluebird on 2017/6/9.
 */

let RTStockDB = require('../../models/RTSTock').RTStockDB;
let StrategyDB = require('../../models/strategy').strategyDB;


/**
 *
 *  "profitAbility" : profitAbility,            // 盈利能力：策略的盈亏比(回测期间总利润除以总亏损)越大，该项分值越高；
    "stability" : stability,                    // 稳定性：策略的波动越小，该项分值越高
    "chooseStockAbility" : chooseStockAbility,  // 选股能力：策略的成功率越大，该项分值越高
    "absoluteProfit" : absoluteProfit,          // 绝对收益：策略的年化收益率越大，该项分值越高
    "antiRiskAbility" : antiRiskAbility,        // 抗风险能力：策略的回撤越小，该项分值越高；
    "strategyScore" : strategyScore
 * @type {callback} 形如 (err,doc)
 * doc 格式
 */


/**
 * 按综合能力推荐的股票 5 只
 * 返回结果为数组 长度为6 的数组   index = 0 的地方 为推荐的持仓天数
 * index = 1 - 5 分别是一个长度为5 的二维数组 第一位为股票代码 ，第二位为股票名字
 * [10,
 [ '000627', '天茂集团' ],
 [ '002024', '苏宁云商' ],
 [ '002065', '东华软件' ],
 [ '002153', '石基信息' ],
 [ '000503', '海虹控股' ]
    ]
 * @param callback
 */
exports.getRccomandStockHighScore = (callback)=>{
    RTStockDB.getStock('strategyScore',(err,doc)=>{
        callback(err,doc)
    })
}

/**
 * 按盈利能力推荐的股票 5 只
 * 返回结果为数组 长度为6 的数组   index = 0 的地方 为推荐的持仓天数
 * index = 1 - 5 分别是一个长度为5 的二维数组 第一位为股票代码 ，第二位为股票名字
 * [10,
 [ '000627', '天茂集团' ],
 [ '002024', '苏宁云商' ],
 [ '002065', '东华软件' ],
 [ '002153', '石基信息' ],
 [ '000503', '海虹控股' ]
 ]
 * @param callback
 */
exports.getRccomandStockProfit = (callback)=>{
    RTStockDB.getStock('profitAbility',(err,doc)=>{
        callback(err,doc)
    })

}


/**
 * chooseStockAbility
 * 按选股能力(策略胜率)能力推荐的股票 5 只
 * 返回结果为数组 长度为6 的数组   index = 0 的地方 为推荐的持仓天数
 * index = 1 - 5 分别是一个长度为5 的二维数组 第一位为股票代码 ，第二位为股票名字
 * [10,
 [ '000627', '天茂集团' ],
 [ '002024', '苏宁云商' ],
 [ '002065', '东华软件' ],
 [ '002153', '石基信息' ],
 [ '000503', '海虹控股' ]
 ]
 * @param callback
 */
exports.getRccomandStockWinRate = (callback)=>{
    RTStockDB.getStock('antiRiskAbility',(err,doc)=>{
        callback(err,doc)
    })

}


/**
 * 按选抗风险能力能力推荐的股票 5 只
 * 返回结果为数组 长度为6 的数组   index = 0 的地方 为推荐的持仓天数
 * index = 1 - 5 分别是一个长度为5 的二维数组 第一位为股票代码 ，第二位为股票名字
 * [10,
 [ '000627', '天茂集团' ],
 [ '002024', '苏宁云商' ],
 [ '002065', '东华软件' ],
 [ '002153', '石基信息' ],
 [ '000503', '海虹控股' ]
 ]
 * @param callback
 */
exports.getRccomandStockAntiRiskAbility = (callback)=>{
    RTStockDB.getStock('chooseStockAbility',(err,doc)=>{
        callback(err,doc)
    })
}

/**
 * 高温 ，趋同
 * @param callback 形如(err,doc)
 * doc{JSON} 形式
 * 形如：
 * {
 "HighAndSame": ['id'  ,'HighAndSame综合得分' ,'HighAndSame盈利能力' ,'HighAndSame绝对收益' ,'HighAndSame选股能力' ,'HighAndSame抗风险能力' ,'HighAndSame稳定性'],
 "HighAndOpposite": ['id' ,'HighAndOpposite综合得分' ,'HighAndOpposite盈利能力' ,'HighAndOpposite绝对收益' ,'HighAndOpposite选股能力' ,'HighAndOpposite抗风险能力' ,'HighAndOpposite稳定性'],
 "LowAndSame": ['id' ,'LowAndSame综合得分' ,'LowAndSame盈利能力' ,'LowAndSame绝对收益' ,'LowAndSame选股能力' ,'LowAndSame抗风险能力' ,'LowAndSame稳定性'],
 "LowAndOpposite": ['id' ,'LowAndOpposite综合得分' ,'LowAndOpposite盈利能力' ,'LowAndOpposite绝对收益' ,'LowAndOpposite选股能力' ,'LowAndOpposite抗风险能力' ,'LowAndOpposite稳定性'],
 "Normal": ['id' ,'Normal综合得分' ,'Normal盈利能力' ,'Normal绝对收益' ,'Normal选股能力' ,'Normal抗风险能力' ,'Normal稳定性'],
 }
 *
 */
exports.getRtStrategyALL = (callback) =>{

    const mapTable = {
        'LowAndOpposite':'markLO',
        'HighAndOpposite':'markHO',
        'LowAndSame':'markLS',
        'HighAndSame':'markHS',
        'Normal':'markNormal'

    }
    let getBestStrategy = function (env,data) {
        return new Promise((resolve,reject)=>{
            StrategyDB.getBestStrategyByEnv(env,'strategyScore',1,(err,datas)=>{
                let doc = datas[0][mapTable[env]]
                let list = [];
                list.push(datas[0]['_id'])
                list.push(doc['strategyScore']);
                list.push(doc['profitAbility']);
                list.push(doc['absoluteProfit']);
                list.push(doc['chooseStockAbility']);
                list.push(doc['antiRiskAbility']);
                list.push(doc['stability'])
                data[env] = list;
                resolve(list)
            })

        })
    }

    getBestStrategy('HighAndSame',{})
        .then(t=>getBestStrategy('HighAndOpposite',t))
        .then(t=>getBestStrategy('LowAndSame',t))
        .then(t=>getBestStrategy('LowAndOpposite',t))
        .then(t=>getBestStrategy('Normal',t))
        .then(t=>callback(null,t))
        .catch(r=>callback(r,null))
}

