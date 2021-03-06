package gui.functions;

import blservice.market.MarketService;
import blservice.singlestock.BenchStockService;
import com.jfoenix.controls.*;
import com.jfoenix.controls.cells.editors.base.JFXTreeTableCell;
import com.jfoenix.controls.datamodels.treetable.RecursiveTreeObject;
import factory.BLFactorySeviceOnlyImpl;
import factory.BlFactoryService;
import gui.ChartController.ChartController;
import gui.ChartController.controller.KLineChartController;
import gui.ChartController.controller.VOLChartController;
import gui.ChartController.pane.KLinePane;
import gui.ChartController.pane.VolBarPane;
import gui.sidemenu.SideMenuController;
import gui.utils.DatePickerUtil;
import gui.utils.LocalHistoryService;
import io.datafx.controller.FXMLController;
import io.datafx.controller.flow.context.FXMLViewFlowContext;
import io.datafx.controller.flow.context.ViewFlowContext;
import javafx.beans.property.SimpleStringProperty;
import javafx.beans.property.StringProperty;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.fxml.FXML;
import javafx.scene.Node;
import javafx.scene.control.Label;
import javafx.scene.control.TreeItem;
import javafx.scene.control.TreeTableColumn;
import javafx.scene.layout.GridPane;
import javafx.scene.layout.Priority;
import javafx.scene.layout.StackPane;
import javafx.scene.paint.Color;
import vo.MarketStockDetailVO;

import javax.annotation.PostConstruct;
import java.rmi.RemoteException;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 主界面的控制器
 * @author zjy
 */
@FXMLController(value = "/resources/fxml/ui/Market.fxml" , title = "Market")
public class MarketController {
    @FXMLViewFlowContext private ViewFlowContext context;

    @FXML private StackPane root;
    @FXML private JFXListView plate;//的listview，只有主板、创业板、中小板三个值
    @FXML private JFXTreeTableView<Share> allSharesList;
    @FXML private JFXTreeTableView<Share> recentlySharesList;
    @FXML private JFXDatePicker from;
    @FXML private JFXDatePicker to;
    @FXML private GridPane gridPane;

    private ObservableList<Share> allShares;//所有股票列表项的集合，动态绑定JFXTreeTableView的显示
    private ObservableList<Share> recentlyShares;//最近浏览股票列表项的集合，动态绑定JFXTreeTableView的显示
    private BlFactoryService factory;
    private MarketService marketService;
    private BenchStockService benchStockService;
    private static final String titles[]={"股票代码","股票名称","现价（元）","涨跌（元）","涨跌幅（%）"};


    @PostConstruct
    public void init(){
        //初始化所要用到的逻辑层接口
        factory = new BLFactorySeviceOnlyImpl();
        marketService=factory.createMarketService();
        benchStockService = factory.createBenchStockService();

        //初始化界面用到的各种控件
        from.setDialogParent(root);
        to.setDialogParent(root);
        //为日期选择器加上可选范围的控制
        DatePickerUtil.initDatePicker(from,to);

        //初始化ObservableList
        allShares = FXCollections.observableArrayList();
        recentlyShares = FXCollections.observableArrayList();

        /**
         * 我这个lambda表达式 是不是写的有点过分
         */
        recentlyShares.addAll(LocalHistoryService.LOCAL_HISTORY_SERVICE.getList().stream()
                .map(t -> {
                    try {
                        return marketService.getHistoryStockDetailVO(t);
                    } catch (RemoteException e) {
                        //e.printStackTrace();
                        return null;
                    }
                }).filter(t->t!=null).map(share->new Share(share.code,share.name,share.currentPrice,
                        share.changeValue,share.changeValueRange*100)
                ).collect(Collectors.toList()));

        initTreeTableView(recentlySharesList,recentlyShares);
        //给板块选择listview添加监听
        plate.getSelectionModel().selectedItemProperty().addListener((observable, oldValue, newValue) -> {
            if("主板".equals(newValue)){
                //添加要显示的行的信息
                List<MarketStockDetailVO> marketStockDetailVOS = benchStockService.getMainBoardStock();
                allShares.remove(0, allShares.size());
                allShares.addAll(marketStockDetailVOS.stream().map(
                        share->new Share(share.code,share.name,share.currentPrice,
                                share.changeValue,share.changeValueRange*100)
                ).collect(Collectors.toList()));
                //初始化TreeTableView
//                initTreeTableView(allSharesList,allShares);
            }else if("创业板".equals(newValue)){
                //添加要显示的行的信息
                List<MarketStockDetailVO> marketStockDetailVOS = benchStockService.getSecondBoardStock();
                allShares.remove(0, allShares.size());
                allShares.addAll(marketStockDetailVOS.stream().map(
                        share->new Share(share.code,share.name,share.currentPrice,
                                share.changeValue,share.changeValueRange*100)
                ).collect(Collectors.toList()));
                //初始化TreeTableView
//                initTreeTableView(allSharesList,allShares);
            }else if("中小板".equals(newValue)){
                //添加要显示的行的信息
                List<MarketStockDetailVO> marketStockDetailVOS = benchStockService.getSMEBoardStock();
                allShares.remove(0, allShares.size());
                allShares.addAll(marketStockDetailVOS.stream().map(
                        share->new Share(share.code,share.name,share.currentPrice,
                                share.changeValue,share.changeValueRange*100)
                ).collect(Collectors.toList()));
                //初始化TreeTableView
//                initTreeTableView(allSharesList,allShares);
            }else {
                return;
            }
        });
        plate.getSelectionModel().select(0);//默认选择主板
        initTreeTableView(allSharesList,allShares);
//        //添加要显示的行的信息
//        List<MarketStockDetailVO> marketStockDetailVOS=null;
//        try {
//            marketStockDetailVOS=marketService.getMarketStockDetailVO();
//        } catch (RemoteException e) {
//            e.printStackTrace();
//        }
//        allShares.addAll(marketStockDetailVOS.stream().map(
//                share->new Share(share.code,share.name,share.currentPrice,
//                        share.changeValue,share.changeValueRange*100)
//        ).collect(Collectors.toList()));

        from.setValue(LocalDate.of(2014, 3, 1));
        to.setValue(LocalDate.of(2014, 3, 10));

        /**
         *  为起始时间增加监听器
         */
        from.setOnAction(event -> {
            handleTime();
        });

        /**
         * 为结束时间增加监听器
         */
        to.setOnAction(event -> {
            handleTime();
        });
        handleTime();
    }

    private void handleTime(){
        LocalDate first = from.getValue();
        LocalDate second = to.getValue();

        if(first!=null && second!=null && first.isBefore(second)) {
            updateGraph(first,second);
        }
    }

    private void updateGraph(LocalDate first ,LocalDate second){
        gridPane.getChildren().clear();
        KLineChartController kLineChartController = ChartController.INSTANCE.getKLineChartController();
        kLineChartController.setStockCode("ALL");

        kLineChartController.setStartDate(first);
        kLineChartController.setEndDate(second);
        kLineChartController.drawChat();
        KLinePane kLinePane = new KLinePane(kLineChartController.getMChart(),1.0);
        gridPane.addRow(0,kLinePane);
        gridPane.setHgrow(kLinePane, Priority.ALWAYS);

        VOLChartController volChartController = ChartController.INSTANCE.getVOLChartController();
        volChartController.setStockCode("ALL");

        volChartController.setStartDate(first);
        volChartController.setEndDate(second);
        volChartController.drawChat();
        VolBarPane volBarPane = new VolBarPane(volChartController.getChart(),1.0);
        gridPane.addRow(1,volBarPane);
        gridPane.setHgrow(volBarPane, Priority.ALWAYS);

    }

    private void initTreeTableView(JFXTreeTableView<Share> treeTableView,ObservableList<Share> list){
        final TreeItem<Share> root = new RecursiveTreeItem<Share>(list, RecursiveTreeObject::getChildren);
//        treeTableView.refresh();
        treeTableView.setRoot(root);

        //创建TreeTableView的列
        for(int index=0;index<titles.length;index++){
            setColumn(treeTableView,index);
        }
        //为treeTableView加上双击跳转的监听
        treeTableView.setOnMouseClicked(event -> {
            if(event.getClickCount()==2 && null!=treeTableView.getSelectionModel().getSelectedItem()){
                //跳转界面
                SideMenuController sideMenuController = (SideMenuController) context.getRegisteredObject(SideMenuController.class);
                Label SingleStock=((Label)context.getRegisteredObject("SingleStock"));
                assert SingleStock!=null:"can't find registered object:SingleStock";
                LocalHistoryService.LOCAL_HISTORY_SERVICE
                        .addHistoryPiece(treeTableView.getSelectionModel().getSelectedItem()
                                .getValue().ID.get());

                sideMenuController.changeView(SingleStock);
                //切换到对应的股票信息
                SingleStockController singleStockController= context.getRegisteredObject(SingleStockController.class);
                singleStockController.setStockInfo(treeTableView.getSelectionModel().getSelectedItem().getValue().ID.get());
            }
        });
    }

    private void setColumn(JFXTreeTableView<Share> treeTableView, int index){
        JFXTreeTableColumn<Share, String> colum=new JFXTreeTableColumn<>(titles[index]);
        colum.setPrefWidth(100);
        //涨的用红色表示，跌的绿色表示
        colum.setCellFactory(treeTableColum->{
            return new JFXTreeTableCell<Share, String>() {
                protected void updateItem(String var1, boolean var2) {
                    if(var1 != this.getItem()) {
                        super.updateItem(var1, var2);
                        if(var1 == null) {
                            super.setText((String)null);
                            super.setGraphic((Node)null);
                        } else {
                            super.setText(var1.toString());
                            super.setGraphic((Node)null);
                            if (getTreeTableRow().getItem() != null) {
                                if(getTreeTableRow().getItem().rise.get().startsWith("+")){
                                    setTextFill(Color.RED);
                                }else {
                                    setTextFill(Color.GREEN);
                                }
                            }
                        }
                    }
                }
            };
        });
        //设置要显示的值
        colum.setCellValueFactory((TreeTableColumn.CellDataFeatures<Share, String> param) ->{
            StringProperty propertys[]={param.getValue().getValue().ID,param.getValue().getValue().name,
                    param.getValue().getValue().price,param.getValue().getValue().rise,
                    param.getValue().getValue().rise_percent};
            if(colum.validateValue(param)) return propertys[index];
            else return colum.getComputedValue(param);
        });

        treeTableView.getColumns().add(colum);
    }


    /**
     * 要显示的股票属性
     * @author zjy
     *
     */
    private  class Share extends RecursiveTreeObject<Share>{
        StringProperty ID;
        StringProperty name;
        StringProperty price;
        StringProperty rise;
        StringProperty rise_percent;

        /**
         *
         * @param ID 股票代码
         * @param name 股票名称
         * @param price 现价
         * @param rise 涨跌（价格）
         * @param rise_percent 涨跌幅（百分比）
         */
        public Share(String ID, String name, double price, double rise, double rise_percent) {
            this.ID = new SimpleStringProperty(ID);
            this.name = new SimpleStringProperty(name);
            //设置两位小数
            this.price = new SimpleStringProperty(String.format("%.2f",price));
            //设置两位小数，如果是正的，前面加上'+'
            this.rise = new SimpleStringProperty((rise>0? "+": "")+String.format("%.2f",rise));
            //设置两位小数，如果是正的，前面加上'+'
            this.rise_percent = new SimpleStringProperty((rise_percent>0? "+": "")+String.format("%.2f",rise_percent));
        }
    }
}
