package dataserviceimpl.stockmap;

import dataservice.stockmap.StockNameToCodeDAO;
import po.StockNameAndCodePO;

import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by slow_time on 2017/3/8.
 */
public enum StockNameToCodeDAOImpl implements StockNameToCodeDAO {
    STOCK_NAME_TO_CODE_DAO_IMPL;

    public static final String MAP_FILENAME = "../Data/StockMap.csv";

    @Override
    public List<StockNameAndCodePO> getNameToCodeMap() {
        List<StockNameAndCodePO> nameToCode = null;
        BufferedReader br = null;

        try {
            br = new BufferedReader(new FileReader(MAP_FILENAME));
            nameToCode = new ArrayList<>();
            String line;

            while ((line = br.readLine()) != null) {
                String[] nameAndCode = line.split(",");
                nameToCode.add(new StockNameAndCodePO(nameAndCode[0], nameAndCode[1]));
            }
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } finally {
            if(br != null) {
                try {
                    br.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
            return nameToCode;
        }
    }
}
