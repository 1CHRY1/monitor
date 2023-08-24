package nnu.edu.back.dao.dynamic;

import nnu.edu.back.pojo.Flux;
import nnu.edu.back.pojo.SandTransport;
import nnu.edu.back.pojo.Section;
import nnu.edu.back.pojo.Substrate;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 *
 * @Author: Yiming
 * @Date: 2023/08/23/11:04
 * @Description:
 */
@Repository
public interface DynamicMapper {
    List<Section> getAllSection(String id);

    List<Map<String, Object>> getDistanceAndElevationByName(String id, @Param("sectionName") String sectionName);

    List<Map<String, Object>> getFluxNameAndType(String id);

    List<Flux> getFluxByNameAndType(String id, @Param("name") String name, @Param("type") String type);

    List<Substrate> getAllSubstrate(String id);

    List<Map<String, Object>> getSandTransportNameAndType(String id);

    List<SandTransport> getSandTransportByNameAndType(String id, @Param("name") String name, @Param("type") String type);

    List<Map<String, Object>> getSpeedOrientationNameAndType(String id);

    List<Map<String, Object>> getSpeedByNameAndType(String id, @Param("name") String name, @Param("type") String type);

    List<Map<String, Object>> test(String id, @Param("sql") String sql);
}
