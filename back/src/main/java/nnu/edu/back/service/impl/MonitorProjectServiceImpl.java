package nnu.edu.back.service.impl;

import nnu.edu.back.common.exception.MyException;
import nnu.edu.back.common.result.ResultEnum;
import nnu.edu.back.dao.dynamic.DynamicMapper;
import nnu.edu.back.pojo.Flux;
import nnu.edu.back.pojo.SandTransport;
import nnu.edu.back.pojo.Section;
import nnu.edu.back.pojo.Substrate;
import nnu.edu.back.service.MonitorProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 *
 * @Author: Yiming
 * @Date: 2023/08/23/11:03
 * @Description:
 */
@Service
public class MonitorProjectServiceImpl implements MonitorProjectService {
    @Autowired
    DynamicMapper dynamicMapper;

    @Override
    public List<Section> getAllSection(String projectId) {
        return dynamicMapper.getAllSection(projectId);
    }

    @Override
    public Map<String, Object> getSectionElevation(String projectId) {
        Map<String, Object> map = new HashMap<>();
        List<Section> sections = dynamicMapper.getAllSection(projectId);
        for (Section section : sections) {
            List<List<Double>> list = new ArrayList<>();
            List<Map<String, Object>> m = dynamicMapper.getDistanceAndElevationByName(projectId, section.getName());
            for (Map<String, Object> elevation : m) {
                List<Double> values = new ArrayList<>();
                values.add((Double) elevation.get("distance"));
                values.add((Double) elevation.get("elevation"));
                list.add(values);
            }
            map.put(section.getName(), list);
        }
        return map;
    }

    @Override
    public List<Map<String, Object>> getFluxNameAndType(String projectId) {
        return dynamicMapper.getFluxNameAndType(projectId);
    }

    @Override
    public Map<String, Object> getFluxByNameAndType(String projectId, String name, String type) {
        if (type.equals("small")) type = "小潮";
        else if (type.equals("large")) type = "大潮";
        else throw new MyException(ResultEnum.QUERY_TYPE_ERROR);
        List<Flux> fluxList = dynamicMapper.getFluxByNameAndType(projectId, name, type);
        Map<String, Object> res = new HashMap<>();
        List<String> time = new ArrayList<>();
        List<Double> value = new ArrayList<>();
        res.put("name", name);
        for (Flux flux : fluxList) {
            time.add(flux.getTime());
            value.add(flux.getValue() == null ? 0 : flux.getValue());
        }
        res.put("time", time);
        res.put("value", value);
        return res;
    }

    @Override
    public List<Substrate> getSubstrate(String projectId) {
        List<Substrate> substrateList = dynamicMapper.getAllSubstrate(projectId);
        return substrateList;
    }

    @Override
    public List<Map<String, Object>> getSandTransportNameAndType(String projectId) {
        return dynamicMapper.getSandTransportNameAndType(projectId);
    }

    @Override
    public Map<String, Object> getSandTransportByNameAndType(String projectId, String name, String type) {
        if (type.equals("small")) type = "小潮";
        else if (type.equals("large")) type = "大潮";
        else throw new MyException(ResultEnum.QUERY_TYPE_ERROR);
        List<SandTransport> sandTransportList = dynamicMapper.getSandTransportByNameAndType(projectId, name, type);
        Map<String, Object> res = new HashMap<>();
        List<String> time = new ArrayList<>();
        List<Double> value = new ArrayList<>();
        res.put("name", name);
        for (SandTransport sandTransport : sandTransportList) {
            time.add(sandTransport.getTime());
            value.add(sandTransport.getValue() == null ? 0 : sandTransport.getValue());
        }
        res.put("time", time);
        res.put("value", value);
        return res;
    }

    @Override
    public Map<String, Object> getSpeed(String projectId, String name) {

        return null;
    }

    @Override
    public List<Map<String, Object>> test() {
        String sql = "select * from section";
        return dynamicMapper.test("c5221577-6578-9e72-67dd-a66914ee7afd", sql);
    }
}
