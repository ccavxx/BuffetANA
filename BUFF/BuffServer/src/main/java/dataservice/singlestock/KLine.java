package dataservice.singlestock;

import po.DailyKLinePO;

import java.time.LocalDate;
import java.util.ArrayList;

/**
 * Created by slow_time on 2017/3/3.
 */
public interface KLine {
    /**
     * 用户点击某只个股时，未进行日期的选择时，获得默认的日K线图
     * @param name 个股的名称
     * @return 默认时间段的该个股的每日的K线数据
     */
    ArrayList<DailyKLinePO> getDefaultDailyKLine(String name);

    /**
     * 用户进行具体个股日K线图搜索时，输入了起始日期后，调用的方法
     * @param name 个股名称
     * @param beginDate 日K线图的开始日期，需在2014年4月29日至2005年2月1日之间，且在endDate之前
     * @param endDate 日K线图的结束日期，需在2014年4月29日至2005年2月1日之间，且在beginDate之后
     * @return 指定日期范围内的该个股的每日的K线数据
     */
    ArrayList<DailyKLinePO> getConcreteDailyssKLine(String name, LocalDate beginDate, LocalDate endDate);
}