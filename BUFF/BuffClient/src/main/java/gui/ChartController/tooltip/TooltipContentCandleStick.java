package gui.ChartController.tooltip;

import javafx.scene.control.Label;
import javafx.scene.layout.GridPane;

/**
 *
 * @author ss
 * @date 2016/3/24
 */

public class TooltipContentCandleStick extends GridPane {
    private Label openValue = new Label();
    private Label closeValue = new Label();
    private Label highValue = new Label();
    private Label lowValue = new Label();

    public TooltipContentCandleStick() {
        Label open = new Label("开盘:");
        Label close = new Label("收盘:");
        Label high = new Label("最高:");
        Label low = new Label("最低:");

        open.getStyleClass().add("candlestick-tooltip-label");
        close.getStyleClass().add("candlestick-tooltip-label");
        high.getStyleClass().add("candlestick-tooltip-label");
        low.getStyleClass().add("candlestick-tooltip-label");

        setConstraints(open, 0, 0);  //参数：Node  column row
        setConstraints(openValue, 1, 0);
        setConstraints(close, 0, 1);
        setConstraints(closeValue, 1, 1);
        setConstraints(high, 0, 2);
        setConstraints(highValue, 1, 2);
        setConstraints(low, 0, 3);
        setConstraints(lowValue, 1, 3);
        getChildren().addAll(open, openValue, close, closeValue, high, highValue, low, lowValue);
    }

    public void update(double open, double close, double high, double low) {
        String str = Double.toString(open);
        str = str.length()>5?  str.substring(0,5):str;
        openValue.setText(str);
        str = Double.toString(close);
        str = str.length()>5?  str.substring(0,5):str;
        closeValue.setText(str);
        highValue.setText(Double.toString(high));
        lowValue.setText(Double.toString(low));
    }
}

