package stockenum;

import java.time.LocalDate;
import java.util.function.Predicate;

/**
 * 选股指标的类型
 * Created by slow_time on 2017/3/24.
 */


//TODO   以后就在这里添加参数
public enum StockPickIndex implements FilterMode {
    /**
     * 前一日成交量
     */
    PREVIOUS_DAY_VOL {
        @Override
        public Predicate<String> getFilter(LocalDate begin, LocalDate end, String code, Double lowerBound, Double upBound) {

           Predicate<String> pre = new Predicate<String>() {
               @Override
               public boolean test(String s) {
                   return false;
               }
           };
            return null;
        }
    },
    /**
     * 昨日涨幅
     */
    PREVIOUS_DAY_UPRATE {
        @Override
        public Predicate<String> getFilter(LocalDate begin, LocalDate end, String code, Double lowerBound, Double upBound) {
            return null;
        }
    }
}
