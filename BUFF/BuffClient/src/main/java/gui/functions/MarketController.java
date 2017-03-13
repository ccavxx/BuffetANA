package gui.functions;

import com.jfoenix.controls.*;
import com.jfoenix.controls.datamodels.treetable.RecursiveTreeObject;
import gui.ChartController.*;
import gui.sidemenu.SideMenuController;
import gui.utils.DatePickerUtil;
import gui.utils.Dialogs;
import io.datafx.controller.FXMLController;
import io.datafx.controller.flow.FlowException;
import io.datafx.controller.flow.FlowHandler;
import io.datafx.controller.flow.context.FXMLViewFlowContext;
import io.datafx.controller.flow.context.ViewFlowContext;
import io.datafx.controller.util.VetoException;
import javafx.beans.property.SimpleStringProperty;
import javafx.beans.property.StringProperty;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.fxml.FXML;
import javafx.scene.control.Label;
import javafx.scene.control.TreeItem;
import javafx.scene.control.TreeTableColumn;
import javafx.scene.layout.BorderPane;
import javafx.scene.layout.GridPane;
import javafx.scene.layout.StackPane;

import javax.annotation.PostConstruct;
import java.time.LocalDate;

/**
 * 主界面的控制器
 * @author zjy
 */
@FXMLController(value = "/resources/fxml/ui/Market.fxml" , title = "Market")
public class MarketController {
    @FXMLViewFlowContext private ViewFlowContext context;

    @FXML private StackPane root;
    @FXML private JFXTreeTableView<Share> allSharesList;
    @FXML private JFXTreeTableView<Share> recentlySharesList;
    @FXML private JFXDatePicker from;
    @FXML private JFXDatePicker to;

    @FXML private BorderPane borderPane;
    @FXML private GridPane gridPane;

    private ObservableList<Share> allShares;//所有股票列表项的集合，动态绑定JFXTreeTableView的显示
    private ObservableList<Share> recentlyShares;//最近浏览股票列表项的集合，动态绑定JFXTreeTableView的显示
    private static final String titles[]={"股票代码","股票名称","现价（元）","涨跌（元）","涨跌幅（%）"};


    @PostConstruct
    public void init(){
        //初始化界面用到的各种控件
        from.setDialogParent(root);
        to.setDialogParent(root);
        //为日期选择器加上可选范围的控制
        DatePickerUtil.initDatePicker(from,to);

        //初始化ObservableList
        allShares = FXCollections.observableArrayList();
        recentlyShares = FXCollections.observableArrayList();
        //添加要显示的行的信息		下面是一个例子
        allShares.add(new Share("2035","name1","price1","rise1","rise_percent1"));
        allShares.add(new Share("2093","name2","14.9","+0.2","+0.03"));
        recentlyShares.add(new Share("2351","name3","price3","rise3","rise_percent3"));
        recentlyShares.add(new Share("2205","name4","16.7","-0.3","-0.13"));

        initTreeTableView(allSharesList,allShares);
        initTreeTableView(recentlySharesList,recentlyShares);
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
        VOLChartController volChartController = ChartController.INSTANCE.getVOLChartController();
        volChartController.setStockCode("ALL");



        volChartController.setStartDate(first);
        volChartController.setEndDate(second);
        volChartController.drawChat();
        VolBarPane volBarPane = new VolBarPane(volChartController.getChart(),1.0);
        gridPane.addRow(1,volBarPane);

    }

    private void initTreeTableView(JFXTreeTableView<Share> treeTableView,ObservableList<Share> list){
        final TreeItem<Share> root = new RecursiveTreeItem<Share>(list, RecursiveTreeObject::getChildren);
        treeTableView.setRoot(root);

        //创建TreeTableView的列
        for(int index=0;index<titles.length;index++){
            setColumn(treeTableView,index);
        }
        //为treeTableView加上双击跳转的监听
        treeTableView.setOnMouseClicked(event -> {
            if(event.getClickCount()==2 && null!=treeTableView.getSelectionModel().getSelectedItem()){
                //System.out.println("change:"+treeTableView.getSelectionModel().getSelectedItem().getValue().ID.get());
                //跳转界面
                FlowHandler flowHandler = (FlowHandler) context.getRegisteredObject("ContentFlowHandler");
                Label SingleStock=((Label)context.getRegisteredObject("SingleStock"));
                assert SingleStock!=null:"can't find registered object:SingleStock";
                try {
                    flowHandler.handle(SingleStock.getId());
                } catch (Exception e) {
                    System.err.println("can't find object:SingleStock  ID:"+SingleStock.getId());
                }
                //切换到对应的股票信息
                SingleStockController singleStockController= (SingleStockController) context.getCurrentViewContext().getController();
                singleStockController.setStockInfo(treeTableView.getSelectionModel().getSelectedItem().getValue().ID.get());
                //改变SideMenu的选中项
                JFXListView<Label> sideList=((JFXListView)context.getRegisteredObject("sideList"));
                sideList.getSelectionModel().select(SingleStock);
            }
        });
    }

    private void setColumn(JFXTreeTableView<Share> treeTableView, int index){
        JFXTreeTableColumn<Share, String> colum=new JFXTreeTableColumn<>(titles[index]);
        colum.setPrefWidth(100);
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
        public Share(String ID, String name, String price, String rise, String rise_percent) {
            this.ID = new SimpleStringProperty(ID);
            this.name = new SimpleStringProperty(name);
            this.price = new SimpleStringProperty(price);
            this.rise = new SimpleStringProperty(rise);
            this.rise_percent = new SimpleStringProperty(rise_percent);
        }
    }
}
