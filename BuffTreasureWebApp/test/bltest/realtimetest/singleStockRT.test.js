/**
 * Created by slow_time on 2017/6/6.
 */
let realTimeTool = require('../../../bl/realtime/singleStockRT');
let it = require("mocha").it;
let describe = require("mocha").describe;
let mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/latestInfo');

mongoose.connection.on('open', function () {
    console.log('Connected to Mongoose');
});

describe('singleStockRT', function() {
    describe('#obtainRTInfoByCode()', function() {
        it('should show the RTInfo Of 000002', function(done) {
            realTimeTool.obtainRTInfoByCode('000002', (err, RTInfo) => {
                if (err) {
                    done(err);
                }
                else {
                    console.log(RTInfo);
                    done();
                }
            });
        });
    });
    describe('#updateAllStockRTInfo()', function() {
        it('should update all the info of stocks', function(done) {
            realTimeTool.updateAllStockRTInfo((err, isOK) => {
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
    describe('#getHotBoard()', function() {
        it('should show all hot boards', function(done) {
            realTimeTool.getHotBoard((err, boards) => {
                if (err) {
                    done(err);
                }
                else {
                    console.log(boards);
                    done();
                }
            });
        });
    });
    describe('#updateHotBoard()', function() {
        it('should update the hot boards', function(done) {
            realTimeTool.updateHotBoard((err, isOK) => {
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
});