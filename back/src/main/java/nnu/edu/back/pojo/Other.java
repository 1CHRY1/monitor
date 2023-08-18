package nnu.edu.back.pojo;

import com.alibaba.fastjson2.JSONObject;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Created with IntelliJ IDEA.
 *
 * @Author: Yiming
 * @Date: 2023/08/17/9:46
 * @Description:
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Other {
    String id;
    String name;
    String management;
    String hdHdly;
    String hdHdlyName;
    Float hdlc;
    String type;
    String picture;
    String waterwayId;
    String waterwayName;
    Float hxbz;
    Float zyb;
    Float longitude;
    Float latitude;
    JSONObject region;
    String shipWay;
}
