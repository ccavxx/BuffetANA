package factory;

import blservice.comparison.ComparisonService;
import blservice.market.MarketService;
import blservice.singlestock.*;
import blservice.statistics.IndustryCorrelationService;
import blservice.statistics.SingleCodePredictService;
import blservice.strategy.IndustryAndBoardService;
import blservice.strategy.StrategyHistoryService;
import blservice.strategy.StrategyService;
import blservice.thermometer.ThermometerService;
import blstub.marketstub.MarketServiceImpl_Stub;
import blstub.singlestockstub.AllStockServiceImpl_Stub;
import blstub.singlestockstub.KLineServiceImpl_Stub;
import blstub.singlestockstub.StockDetailServiceImpl_Stub;
import blstub.singlestockstub.VolServiceImpl_Stub;

/**
 * Created by slow_time on 2017/3/8.
 */
public class BlFactoryServiceStub implements BlFactoryService {
    @Override
    public KLineService createKLineService() {
        return new KLineServiceImpl_Stub();
    }

    @Override
    public AllStockService createAllStockService() {
        return new AllStockServiceImpl_Stub();
    }

    @Override
    public ComparisonService createComparisonService() {
        return null;
    }

    @Override
    public MarketService createMarketService() {
        return new MarketServiceImpl_Stub();
    }

    @Override
    public ThermometerService createThermometerService() {
        return null;
    }

    @Override
    public BenchStockService createBenchStockService() {
        return null;
    }

    @Override
    public StrategyService createStrategyService() {
        return null;
    }

    @Override
    public IndustryCorrelationService createIndustryCorrelationService() {
        return null;
    }

    @Override
    public IndustryAndBoardService createIndustryAndBoardService() {
        return null;
    }

    @Override
    public SingleCodePredictService createSingleCodePredictService() {
        return null;
    }

    @Override
    public StrategyHistoryService createStrategyHistoryService() {
        return null;
    }

    @Override
    public MALineService createMALineService() {
        return null;
    }

    @Override
    public StockDetailService createStockDetailService() {
        return new StockDetailServiceImpl_Stub();
    }

    @Override
    public VolService createVolService() {
        return new VolServiceImpl_Stub();
    }
}
