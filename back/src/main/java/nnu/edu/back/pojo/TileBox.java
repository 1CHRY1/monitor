package nnu.edu.back.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Created with IntelliJ IDEA.
 *
 * @Author: Yiming
 * @Date: 2023/08/15/19:09
 * @Description:
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class TileBox {
    double xMin;
    double xMax;
    double yMin;
    double yMax;
    String name;
    Integer srid;
    String visualId;
}
