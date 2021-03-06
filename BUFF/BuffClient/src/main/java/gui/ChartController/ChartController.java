package gui.ChartController;

import factory.BLFactorySeviceOnlyImpl;
import factory.BlFactoryService;
import gui.ChartController.chart.NormHistChart;
import gui.ChartController.controller.*;

/**
 * Created by wshwbluebird on 2017/3/11.
 */
public enum ChartController  {
    INSTANCE;
    private KLineChartController kLineChartController = null;

    private VOLChartController volChartController  =null;

    private MAChartController maChartController = null;

    private TheVOLChartController theVOLChartController = null;

    private UpDownChartController upDownChartController =null;

    private NormHistChartController normHistChartController = null;

    private DotChartController dotChartController  =null;

    private BlFactoryService factory;

     ChartController(){
        factory =  new BLFactorySeviceOnlyImpl();
        this.kLineChartController = new KLineChartController();
        this.maChartController = new MAChartController();
        this.volChartController = new VOLChartController();
        this.theVOLChartController = new TheVOLChartController();
        this.upDownChartController = new UpDownChartController();
        this.normHistChartController = new NormHistChartController();
        this.dotChartController = new DotChartController();
         plugServiceIn();
    }

    public void setFactory(BlFactoryService factory){
        this.factory = factory;
        plugServiceIn();

    }

    /**
     * 把factory生成的service注入到 特定的controller中
     */
    private void plugServiceIn(){
        this.volChartController.setVolService(factory.createVolService());
        this.kLineChartController.setkLineService(factory.createKLineService());
        this.maChartController.setMaLineService(factory.createMALineService());
        this.theVOLChartController.setThermometerService(factory.createThermometerService());
        this.upDownChartController.setThermometerService(factory.createThermometerService());
        this.kLineChartController.setMarketService(factory.createMarketService());
        this.volChartController.setMarketService(factory.createMarketService());
        this.dotChartController.setSingleCodePredictService(factory.createSingleCodePredictService());
    }


    public KLineChartController getKLineChartController() {
        return this.kLineChartController;
    }

    public VOLChartController getVOLChartController() {
        return this.volChartController;
    }

    public MAChartController getMAChartController() {
        return this.maChartController;
    }

    public TheVOLChartController getTheVOLChartController() {
        return this.theVOLChartController;
    }

    public UpDownChartController getUpDownChartController() {return this.upDownChartController;}

    public NormHistChartController getNormHistChartController() {return this.normHistChartController;}

    public DotChartController getDotChartController() {return this.dotChartController;}

}
