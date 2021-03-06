package blserviceimpl.util;

import po.StockPO;
import vo.*;

/**
 * Created by slow_time on 2017/3/7.
 */
public class PO2VOUtil {

    //Suppress default constructor for noninstantiability
    private PO2VOUtil() {
        throw new AssertionError();
    }


    public static StockDetailVO stockPO2StockDetailVO(StockPO stockPO) {
        if(stockPO == null)
            return null;
        StockDetailVO stockDetailVO = new StockDetailVO(stockPO.getHigh_Price(), stockPO.getLow_Price(),
                stockPO.getOpen_Price(), stockPO.getClose_Price(), stockPO.getVolume(), stockPO.getAdjCloseIndex());
        return stockDetailVO;
    }

    /**
     *
     * @param stockPO1
     * @param stockPO2
     * @return 如果stockPO1或stockPO2中，任意一个为null或者任意一个的收盘价等于0，则返回null
     */
    public static StockBriefInfoVO stockPO2StockBriefInfoVO(StockPO stockPO1, StockPO stockPO2) {
        if(stockPO1 == null || stockPO2 == null)
            return null;
        if(stockPO2.getVolume() == 0)
            return null;
        StockBriefInfoVO stockBriefInfoVO = new StockBriefInfoVO(stockPO2.getName(), stockPO2.getDate(), stockPO2.getCode(),
                stockPO2.getClose_Price(), (stockPO2.getAdjCloseIndex() - stockPO1.getAdjCloseIndex()) / stockPO1.getAdjCloseIndex());
        return stockBriefInfoVO;
    }

    public static MarketStockDetailVO stockPO2MarketStockDetailVO(StockPO stockPO1, StockPO stockPO2) {
        if(stockPO1 == null || stockPO2 == null)
            return null;
        if(stockPO2.getVolume() == 0)
            return null;
        MarketStockDetailVO marketStockDetailVO = new MarketStockDetailVO(stockPO1.getCode(), stockPO1.getName(),
                stockPO1.getClose_Price(), stockPO1.getAdjCloseIndex() - stockPO2.getAdjCloseIndex(),
                (stockPO1.getAdjCloseIndex() - stockPO2.getAdjCloseIndex()) / stockPO2.getAdjCloseIndex());
        return marketStockDetailVO;
    }

    public static KLinePieceVO stockPO2KLinePieceVO(StockPO stockPO) {
        return new KLinePieceVO(stockPO.getDate(), stockPO.getHigh_Price(), stockPO.getLow_Price(),
                stockPO.getOpen_Price(), stockPO.getClose_Price());
    }

    public static StockVolVO stockPO2StockVolVO(StockPO stockPO) {
        return new StockVolVO(stockPO.getDate(), stockPO.getVolume(), stockPO.getOpen_Price() > stockPO.getClose_Price());
    }
}
