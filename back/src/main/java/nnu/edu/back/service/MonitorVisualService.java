package nnu.edu.back.service;

import nnu.edu.back.pojo.Section;
import nnu.edu.back.pojo.Substrate;

import java.util.List;
import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 *
 * @Author: Yiming
 * @Date: 2023/08/23/11:03
 * @Description:
 */
public interface MonitorVisualService {
    List<Section> getAllSection(String projectId);

    Map<String, Object> getSectionElevation(String projectId);

    List<Map<String, Object>> getFluxNameAndType(String projectId);

    Map<String, Object> getFluxByNameAndType(String projectId, String name, String type);

    List<Substrate> getSubstrate(String projectId);

    List<Map<String, Object>> getSandTransportNameAndType(String projectId);

    Map<String, Object> getSandTransportByNameAndType(String projectId, String name, String type);

    List<Map<String, Object>> getSpeedOrientationNameAndType(String projectId);

    Map<String, Object> getSpeed(String projectId, String name, String type);

    Map<String, Object> getOrientation(String projectId, String name, String type);

    List<String> getSandContentClass(String projectId);

    Map<String, Object> getSandContentValue(String projectId, String name);

    List<Map<String, Object>> test();


}
