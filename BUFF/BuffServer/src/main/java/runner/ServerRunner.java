package runner;

import blserviceimpl.strategy.PickleData;
import dataserviceimpl.strategy.StrategyDAOImpl;
import pick.PickStockService;
import pick.PickStockServiceImpl;
import po.StockPoolConditionPO;
import stockenum.StockPickIndex;
import stockenum.StockPool;
import stockenum.StrategyType;
import util.DayMA;
import util.RunTimeSt;
import vo.LongPeiceVO;
import vo.StockPickIndexVO;
import vo.StockPoolConditionVO;
import vo.StrategyConditionVO;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class ServerRunner {
	
	public ServerRunner() {
		//new RemoteHelper();
	}
	
	public static void main(String[] args)  {
//		List<StockPO> list =
//				StockDAOImpl.STOCK_DAO_IMPL.getStockInFoInRangeDate("1",
//						LocalDate.of(2013,1,1),LocalDate.of(2014,1,1));
//		list.forEach(t-> System.out.println(t.getDate()+"  "+t.getVolume()));

//		List<DayMA>  list2 = PickStockServiceImpl.PICK_STOCK_SERVICE
//				.getSingleCodeMAInfo("300187",LocalDate.of(2013,12,1),LocalDate.of(2014,1,1),2);
//
//		list2.stream().forEach(t-> System.out.println(t.date+"  "+t.MAValue));

        RunTimeSt.Start();


        StrategyConditionVO strategyConditionVO = new StrategyConditionVO(StrategyType
                .MA,10,10,LocalDate.of(2013,1,1),LocalDate.of(2014,1,1),10,false);

        StockPoolConditionVO stockPoolConditionVO  =new StockPoolConditionVO(StockPool.All,null,null,false);
        List<StockPickIndexVO> stockPickIndexVOs = new ArrayList<>();
        stockPickIndexVOs.add(new StockPickIndexVO(StockPickIndex.PREVIOUS_DAY_VOL,10.0,100.0));

        StrategyDAOImpl.STRATEGY_DAO.getStocksInPool(new StockPoolConditionPO(stockPoolConditionVO));

        List<PickleData> list = StrategyDAOImpl.STRATEGY_DAO.getPickleData(strategyConditionVO,
                stockPoolConditionVO,stockPickIndexVOs);
//
        System.out.println("finish");
        for(PickleData  p: list){
            System.out.println(p.beginDate+"    "+p.endDate);
            p.stockCodes.stream().forEach(t-> System.out.println(t.code+"   "+t.rankValue));
            System.out.println();
        }


//        PickStockService pickStockService = PickStockServiceImpl.PICK_STOCK_SERVICE;
//        List<LongPeiceVO> longPeiceVOs = pickStockService.getLastVol("000001",LocalDate.of(2013,1,1),LocalDate.of(2014,1,1));
//        longPeiceVOs.stream().forEach(t-> System.out.println(t.localDate+"   "+t.amount));

        RunTimeSt.getRunTime("结束");

	}
	
}
