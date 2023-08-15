package nnu.edu.back.dao.main;

import nnu.edu.back.pojo.DataRelational;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 *
 * @Author: Yiming
 * @Date: 2023/08/15/20:16
 * @Description:
 */
@Repository
public interface DataRelationalMapper {
    void batchDeleteByDataListId(@Param("list") List<String> list);

    List<Map<String, Object>> findFilesByDataListId(@Param("dataListId") String dataListId);

    List<String> findFileIdByDataListId(@Param("dataListId") String dataListId);

    List<String> findDataListIdsByFileId(@Param("fileId") String fileId);

    void batchInsert(@Param("list") List<DataRelational> list);

    void batchDelete(@Param("list") List<String> list, @Param("dataListId") String dataListId);
}
