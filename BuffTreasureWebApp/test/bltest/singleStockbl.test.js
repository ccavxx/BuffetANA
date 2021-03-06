/**
 * Created by slow_time on 2017/5/8.
 */
let singleStockbl = require('../../bl/singleStockbl');
let expect = require('chai').expect;

// 数据库连接 MongoDB
// MongoDB
let mongoose = require('mongoose');
let describe = require("mocha").describe;
let it = require("mocha").it;
mongoose.connect('mongodb://localhost/latestInfo');

mongoose.connection.on('open', function () {
    console.log('Connected to Mongoose');
});

describe('singleStockbl', function() {
    describe('#getDailyData()', function() {
        it('should show all information of 000001 per day', function(done) {
            singleStockbl.getDailyData('600601', (err, all_day_data) => {
                if (err) {
                    done(err);
                }
                else {
                    console.log(all_day_data);
                    done();
                }
            });
        });
    });
    describe('#getWeeklyData()', function() {
        it('should show all information of 000001 per week', function(done) {
            singleStockbl.getWeeklyData('300122', (err, all_week_data) => {
                if (err) {
                    done(err);
                }
                else {
                    console.log(all_week_data);
                    done();
                }
            });
        });
    });
    describe('#getMonthlyData()', function() {
        it('should show all information of 000001 per month', function(done) {
            singleStockbl.getMonthlyData('000001', (err, all_month_data) => {
                if (err) {
                    done(err);
                }
                else {
                    console.log(all_month_data);
                    done();
                }
            });
        });
    });
    describe('#getLatestStockInfo()', function() {
        it('显示最近浏览过的股票的现价和涨跌幅', function(done) {
            singleStockbl.getLatestStockRTInfo(['000001', '000002', '603158'], (err, results) => {
                if (err) {
                    done(err);
                }
                else {
                    console.log(results);
                    done();
                }
            });
        });
    });
    describe('#getCompanyInfo()', function() {
        it('显示603223这只股票的公司简介', function(done) {
            singleStockbl.getCompanyInfo('603223', (err, companyInfo) => {
                if (err) {
                    done(err);
                }
                else {
                    console.log(companyInfo);
                    done();
                }
            });
        });
    });
    describe('#updateHotStocks()', function() {
        it('更新热门股票信息', function(done) {
            singleStockbl.updateHotStocks((err, isOK) => {
                if (err) {
                    done(err);
                }
                else {
                    console.log(isOK);
                    done();
                }
            });
        });
    });
    describe('#getHotStocks()', function() {
        it('获得热门股票信息', function(done) {
            singleStockbl.getHotStocks((err, hotStcoks) => {
                if (err) {
                    done(err);
                }
                else {
                    console.log(hotStcoks);
                    done();
                }
            });
        });
    });
});