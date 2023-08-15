package nnu.edu.back.dao.main;

import nnu.edu.back.pojo.Files;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Created with IntelliJ IDEA.
 *
 * @Author: Yiming
 * @Date: 2023/08/15/21:16
 * @Description:
 */
@Repository
public interface FilesMapper {
    void addFile(@Param("files") Files files);

    void batchDelete(@Param("list") List<String> list);

    List<Files> findInfoListById(@Param("list") List<String> list);

    void updateVisualIdAndType(@Param("id") String id, @Param("visualId") String visualId, @Param("type") String type);

    Files findInfoById(@Param("id") String id);


}
