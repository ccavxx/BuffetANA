package gui.functions;

/**
 * Created by wshwbluebird on 2017/3/4.
 */

import com.jfoenix.controls.JFXDatePicker;
import com.jfoenix.controls.JFXToggleButton;
import gui.utils.DatePickerUtil;
import io.datafx.controller.FXMLController;
import io.datafx.controller.flow.Flow;
import io.datafx.controller.flow.FlowException;
import io.datafx.controller.flow.FlowHandler;
import io.datafx.controller.flow.context.FXMLViewFlowContext;
import io.datafx.controller.flow.context.ViewFlowContext;
import io.datafx.controller.util.VetoException;
import javafx.fxml.FXML;
import javafx.scene.layout.GridPane;
import javafx.scene.layout.StackPane;

import javax.annotation.PostConstruct;
import java.time.LocalDate;


@FXMLController(value = "/resources/fxml/ui/LinesPane.fxml" , title = "Lines Pane container")
public class LinesPanelController {
    @FXMLViewFlowContext
    private ViewFlowContext context;
    @FXML
    private  JFXToggleButton  MAtoggle;
    @FXML
    private  JFXToggleButton  VOLToggle;
    @FXML
    private  JFXToggleButton  KDJToggle;
    @FXML
    private  JFXToggleButton KLinetoggle;
    @FXML
    private  GridPane gridPane;
    @FXML
    private JFXDatePicker from;
    @FXML
    private JFXDatePicker to;
    @FXML
    private StackPane root;

    /**
     *画图的handler
     */
    private FlowHandler KLineHandler;

    private FlowHandler VOLHandler;

    private FlowHandler MaHandler;

    /**
     * 存储加载线程时 生成的容器
     * add by wsw
     */
    private StackPane klinePane;

    private StackPane volPane;

    private StackPane maPane;


    //存储当前要显示的code
    private String code = "";



    @PostConstruct
    public void init() throws FlowException, VetoException {

// context = new ViewFlowContext();
        // set the default controller
        Flow klineFlow = new Flow(KlineController.class);
        Flow volFlow = new Flow(VOLLineController.class);
        Flow maFlow = new Flow(MALineController.class);


        KLineHandler = klineFlow.createHandler(context);
        VOLHandler = volFlow.createHandler(context);
        MaHandler = maFlow.createHandler(context);


        context.register("KLineHandler", KLineHandler);
        context.register("VOLHandler", VOLHandler);
        context.register("MaHandler", MaHandler);
        //
        //drawer.setContent(LineHandler.start(new AnimatedFlowContainer(Duration.millis(320), ContainerAnimations.SWIPE_LEFT)));
        maPane = MaHandler.start();
        volPane = VOLHandler.start();
        klinePane = KLineHandler.start();
        gridPane.addRow(1,klinePane);




        System.out.println("form  1231212:   "+ from.getValue());


        //为每个toggle button添加监听方法
        KLinetoggle.setOnAction(event -> {
            try {
                handleKLinetoggle();
            } catch (FlowException e) {
                e.printStackTrace();
            }
        });
        MAtoggle.setOnAction(event -> {
            try {
                handleMAtoggle();
            } catch (FlowException e) {
                e.printStackTrace();
            } catch (VetoException e) {
                e.printStackTrace();
            }
        });
        VOLToggle.setOnAction(event -> {
            try {
                handleVOLtoggle();
            } catch (FlowException e) {
                e.printStackTrace();
            }
        });
        KDJToggle.setOnAction(event -> {
            try {
                handleKDJtoggle();
            } catch (FlowException e) {
                e.printStackTrace();
            }
        });

        //初始化界面用到的各种控件
        from.setDialogParent(root);
        to.setDialogParent(root);
        //为日期选择器加上可选范围的控制
        DatePickerUtil.initDatePicker(from,to);

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
    }



    @FXML
    private void handleMAtoggle() throws FlowException, VetoException {
        if(MAtoggle.isSelected()){
            gridPane.addRow(3,maPane);
//            LocalDate first = LocalDate.of(2015, 10, 1);
//            LocalDate second = LocalDate.of(2015, 10, 5);
//            KlineController klineController =
//                    (KlineController)KLineHandler.getCurrentView().getViewContext().getController();
//            klineController.upDateGraph("asd",first,second);
        }else{
            MaHandler.destroy();
            gridPane.getChildren().remove(maPane);
        }
    }

    @FXML
    private  void handleKDJtoggle() throws FlowException{
//        if(KDJToggle.isSelected()){
//            gridPane.getChildren().add(KDJLineChild);
//        }else{
//            gridPane.getChildren().remove(KDJLineChild);
//        }
    }

    @FXML
    private void handleVOLtoggle() throws FlowException {
        if(VOLToggle.isSelected()){
            gridPane.addRow(2,volPane);
        }else{
            VOLHandler.destroy();
            gridPane.getChildren().remove(volPane);
        }
    }


    private void handleKLinetoggle() throws FlowException {
        if(KLinetoggle.isSelected()){
            gridPane.addRow(1,klinePane);
        }else{
            KLineHandler.destroy();
            gridPane.getChildren().remove(klinePane);
        }
    }

    /**
     * 设置增加监听器的动作
     */
    private void handleTime(){
        LocalDate first = from.getValue();
        LocalDate second = to.getValue();


//
//        first =LocalDate.of(2009,12,1);
//        second =LocalDate.of(2009,12,10);
//        //TODO delete

        if(first!=null && second!=null && first.isBefore(second)){
            KlineController klineController =
                    (KlineController)KLineHandler.getCurrentView().getViewContext().getController();
            klineController.upDateGraph(this.code,first,second);
            MALineController maLineController =
                    (MALineController)MaHandler.getCurrentView().getViewContext().getController();
            maLineController.upDateGraph(this.code,first,second);
            VOLLineController volLineController =
                    (VOLLineController)VOLHandler.getCurrentView().getViewContext().getController();
            volLineController.upDateGraph(this.code,first,second);
        }

    }



    public void HandleCode(String code){
        if(!this.code.equals(code)){
            this.code = code;
            handleTime();
        }
    }

}
