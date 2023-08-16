package nnu.edu.back.dao.waterway;

import nnu.edu.back.pojo.Anchor;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Created with IntelliJ IDEA.
 *
 * @Author: Yiming
 * @Date: 2023/08/16/22:25
 * @Description:
 */
@Repository
public interface WaterwayMapper {
    List<Anchor> getAllAnchorInfo();

    List<Anchor> pageQueryAnchor(@Param("size") int size, @Param("start") int start, @Param("keyword") String keyword);

    int countAnchor(@Param("keyword") String keyword);
}
