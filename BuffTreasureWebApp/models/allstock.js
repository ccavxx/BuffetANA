/**
 * Created by slow_time on 2017/5/5.
 */
const mongoose = require('mongoose');

const stockSchema = mongoose.Schema({
    code: String,
    name: String,
    industry: String,
    bench: Array
}, {collection: 'allstocks'});
const allStock = mongoose.model('allstocks', stockSchema);
// 储存第一次查询所有股票代码和名称的结果，以便后续调用时直接使用，不用再次查询数据库
let allstocks;
// 储存第一次查询所有行业的结果，以便后续调用时直接使用，不用再次查询数据库
let all_industry;
// 储存第一次查询所有板块的结果，以便后续调用时直接使用，不用再次查询数据库
let all_benchs;
// 储存第一次查询沪深300的结果，以便后续调用时直接使用，不用再次查询数据库
let HS300;
exports.allStockDB = {

    /**
     * 获得所有股票的代码和名称
     * @param callback
     */
    getAllStockCodeAndName: (callback) => {
        if (typeof allstocks === "undefined") {
            allStock.find({}, ['code', 'name'], (err, docs) => {
                if (!err) {
                    allstocks = docs;
                }
                callback(err, docs);
            });
        }
        else {
            callback(null, [...allstocks]);
        }
    },

    /**
     * 获得沪深300所有股票代码和名称
     * @param callback
     */
    getHS300StockCodeAndName: (callback) => {
        if (typeof HS300 === "undefined") {
            allStock.find({bench : {$all : ['沪深300']}}, ['code', 'name'], (err, docs) => {
                callback(err, docs);
            });
        }
        else {
            callback(null, [...HS300]);
        }
    },

    /**
     * 获得同行业的所有股票的代码和名称
     * @param industry
     * @param callback
     */
    getStocksByIndustry: (industry, callback) => {
        allStock.find({industry: industry}, ['code', 'name'], (err, docs) => {
            callback(err, docs);
        });
    },

    /**
     * 获得属于某些板块的所有股票的代码和名称
     * @param bench 板块的列表，如果只有一个板块，则是只包含一个元素的列表
     * @param callback
     */
        getStocksByBench: (bench, callback) => {
        allStock.find({bench : {$all : bench}}, ['code', 'name'], (err, docs) => {
            callback(err, docs);
        });
    },

    /**
     * 根据所给的股票代号获得这支股票所在的行业
     * ！！！一支股票只有一个行业！！！！
     * @param code
     * @param callback
     */
    getIndustryByCode: (code, callback) => {
        allStock.findOne({code: code}, ['industry'], (err, doc) => {
            callback(err, doc);
        });
    },

    /**
     * 根据所给的股票代号获得这支股票所在的板块
     * ！！！一支股票可能从属于多个板块，所以所属板块是一个数组！！！！
     * @param code
     * @param callback
     */
    getBoardsByCode: (code, callback) => {
        allStock.findOne({code: code}, ['bench'], (err, doc) => {
            callback(err, doc);
        });
    },

    /**
     * 获得所有行业
     * @param callback
     */
    getAllIndustry: (callback) => {
        if (typeof all_industry === "undefined") {
            allStock.find({}, ['industry'], (err, docs) => {
                if (!err)
                    all_industry = docs;
                callback(err, docs);
            });
        }
        else
            callback(null, [...all_industry]);
    },

    /**
     * 获得所有板块
     * @param callback
     */
    getAllBoards: (callback) => {
        if (typeof all_benchs === "undefined") {
            allStock.find({}, ['bench'], (err, docs) => {
                if (!err)
                    all_benchs = docs;
                callback(err, docs);
            });
        }
        else
            callback(null, [...all_benchs]);
    },


    /**
     * 获得随机(目前就是前500只股票的代码和名称
     * @param callback
     */
    getRandom500StockCodeAndName: (callback) => {
        if (typeof allstocks === "undefined") {
            allStock.find({}, ['code', 'name'], (err, docs) => {
                if (!err) {
                    allstocks = docs;
                }
                callback(err, docs.slice(0,500));
            });
        }
        else {
            //callback(null,[['100001','qwe'],['100002','qwe'],['100003','qwe']]);
            callback(null, [...allstocks].slice(0,500));
        }
    },

    /**
     * 获得沪深A股所有股票代码和名称
     * @param callback
     */
    getHSAStockCodeAndName:(callback) => {
        /**
         * TODO
         * 测试用的  真正实现的的时候删掉
         */
            callback(null,['00001','hello']);
    },

    /**
     * 获得中小板所有股票代码和名称
     * @param callback
     */
    getSMEBoardCodeAndName:(callback) => {

    },

    /**
     * 获得创业板所有股票代码和名称
     * @param callback
     */
    getGEMBoardStockCodeAndName:(callback) => {

    }


};