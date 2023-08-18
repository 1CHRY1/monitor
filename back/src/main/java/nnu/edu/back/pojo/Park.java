package nnu.edu.back.pojo;

import com.alibaba.fastjson2.JSONObject;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Created with IntelliJ IDEA.
 *
 * @Author: Yiming
 * @Date: 2023/08/17/9:32
 * @Description:
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Park {
    String id;
    String name;
    String hdHdly;
    String hdHdlyName;
    Float hdlc;
    String tyAnb;
    String tyAnbName;
    String type;
    String width;
    String usage;
    Float longitude;
    Float latitude;
    String picture;
    String waterwayId;
    String waterwayName;
    String management;
    JSONObject region;
    String shipWay;
}
