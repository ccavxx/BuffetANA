/**
 * Created by slow_time on 2017/5/7.
 */
let singleStockDB = require('../../models/singleStock.js').singleStockDB;
let expect = require('chai').expect;

// 数据库连接 MongoDB
// MongoDB
let mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/formal');

mongoose.connection.on('open', function () {
    console.log('Connected to Mongoose');
});

/*
 * 通过mocha test/modeltest/singleStock.test.js进行测试
 * 代码为000001的股票一共有6396条数据
 */
describe('singleStockDB', function() {
    describe('#getStockInfoByCode()', function() {
        it('should obtain 6396 records', function(done) {
            singleStockDB.getStockInfoByCode('000001', function (err, docs) {
                if (err) {
                    done(err);
                }
                else {
                    // 如果想看docs里面的内容，可以将下面的这条打印语句解注释
                    // console.log(docs);
                    expect(docs.length).to.be.equal(6396);
                    done();
                }
            });
        });
    });
});