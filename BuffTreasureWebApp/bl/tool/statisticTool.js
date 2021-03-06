/**
 * Created by slow_time on 2017/5/27.
 */

/**
 * 获得协方差
 * @param a
 * @param b
 * @returns {number}
 */
exports.getCOV = (a, b) => {
    let aAve = this.getAverage(a);
    let bAve = this.getAverage(b);
    let sum = 0.0;
    for (let i = 0; i < a.length; i++) {
        sum += (a[i] - aAve) * (b[i] - bAve);
    }
    return sum / a.length;
};

/**
 * 获得平均值
 * @param a
 * @returns {number}
 */
exports.getAverage = (a) => {
    return a.reduce((x, y) => { return x + y; }) / a.length;
};

/**
 * 获得方差
 * @param a
 * @returns {number}
 */
exports.getVariance = (a)=> {
    let ave = this.getAverage(a);
    let sum = 0.0;
    a.forEach(x => {
        sum += Math.pow((x - ave), 2);
    });
    return sum / a.length;
};

/**
 * 获得标准差
 * @param a
 * @returns {number}
 */
exports.getSTD = (a) => {
    return Math.sqrt(this.getVariance(a));
};

/**
 * 获得变异系数
 * @param a
 */
exports.getCoefficientOfVariation = (a) => {
    return this.getSTD(a) / this.getAverage(a);
};