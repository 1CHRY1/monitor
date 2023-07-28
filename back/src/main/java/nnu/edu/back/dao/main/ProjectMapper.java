package nnu.edu.back.dao.main;

import nnu.edu.back.pojo.Project;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

/**
 * Created with IntelliJ IDEA.
 *
 * @Author: Yiming
 * @Date: 2023/07/28/21:15
 * @Description:
 */
@Repository
public interface ProjectMapper {
    Project queryById(@Param("id") String id);
}
