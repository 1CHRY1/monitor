package nnu.edu.back.service.impl;

import com.alibaba.fastjson2.JSONArray;
import nnu.edu.back.dao.waterway.WaterwayMapper;
import nnu.edu.back.pojo.Anchor;
import nnu.edu.back.service.WaterwayService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 *
 * @Author: Yiming
 * @Date: 2023/08/16/23:01
 * @Description:
 */
@Service
public class WaterwayServiceImpl implements WaterwayService {
    @Autowired
    WaterwayMapper waterwayMapper;

    @Override
    public List<Anchor> getAnchorInfoByBox(double top, double right, double bottom, double left) {
        List<Anchor> result = new ArrayList<>();
        List<Anchor> anchorList = waterwayMapper.getAllAnchorInfo();
        for (Anchor anchor : anchorList) {
            JSONArray jsonArray = anchor.getRegion().getJSONArray("point");
            double tempTop = jsonArray.getJSONArray(0).getDouble(1);
            double tempBottom = jsonArray.getJSONArray(0).getDouble(1);
            double tempRight = jsonArray.getJSONArray(0).getDouble(0);
            double tempLeft = jsonArray.getJSONArray(0).getDouble(0);
            for (int i = 1; i < jsonArray.size(); i++) {
                double lon = jsonArray.getJSONArray(i).getDouble(0);
                double lat = jsonArray.getJSONArray(i).getDouble(1);
                if (lon > tempRight) {
                    tempRight = lon;
                } else if (lon < tempLeft) {
                    tempLeft = lon;
                }
                if (lat > tempTop) {
                    tempTop = lat;
                } else if (lat < tempBottom) {
                    tempBottom = lat;
                }
            }
            if (!(tempLeft > right || tempRight < left || tempTop < bottom || tempBottom > top)) {
                result.add(anchor);
            }
        }
        return result;
    }
}
