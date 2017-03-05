package dataservice.singlestock;

import po.StockPO;

import java.time.LocalDate;
import java.util.List;

/**
 * Created by slow_time on 2017/3/5.
 */
public interface StockDAO {

    /**
     * 获得具体某一支股票的每一天的数据
     * @param code 个股的编码
     * @return 如果不存在这支股票，或者code为null则返回null，若存在，则返回每一天数据的列表
     */
    List<StockPO> getStockInfoByCode(String code);

    /**
     * 获得具体某一天的所有的股票的数据
     * @param date 日期必须在2014年4月29日与2005年2月1日之间
     * @return 若日期不在2014年4月29日与2005年2月1日之间，或日期为null则返回null
     */
    List<StockPO> getStockInfoByDate(LocalDate date);
}
