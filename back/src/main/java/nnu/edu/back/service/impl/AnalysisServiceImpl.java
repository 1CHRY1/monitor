package nnu.edu.back.service.impl;

import com.alibaba.fastjson2.JSONArray;
import com.alibaba.fastjson2.JSONObject;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import nnu.edu.back.common.exception.MyException;
import nnu.edu.back.common.result.ResultEnum;
import nnu.edu.back.common.utils.FileUtil;
import nnu.edu.back.common.utils.ProcessUtil;
import nnu.edu.back.dao.main.*;
import nnu.edu.back.pojo.AnalysisCase;
import nnu.edu.back.pojo.AnalysisResult;
import nnu.edu.back.pojo.Files;
import nnu.edu.back.pojo.VisualFile;
import nnu.edu.back.service.AnalysisService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.*;
import java.util.*;

/**
 * Created with IntelliJ IDEA.
 *
 * @Author: Yiming
 * @Date: 2023/08/18/17:16
 * @Description:
 */
@Service
@Slf4j
public class AnalysisServiceImpl implements AnalysisService {

    @Autowired
    AnalysisCaseMapper analysisCaseMapper;

    @Autowired
    AnalysisFileRelationalMapper analysisFileRelationalMapper;

    @Autowired
    AnalysisResultMapper analysisResultMapper;

    @Autowired
    AnalysisParameterMapper analysisParameterMapper;

    @Autowired
    VisualFileMapper visualFileMapper;

    @Autowired
    FilesMapper filesMapper;

    @Value("${analysisDir}")
    String analysisDir;

    @Value("${visualDir}")
    String visualDir;

    @Value("${baseDir}")
    String baseDir;

    @Value("${tempDir}")
    String tempDir;

    @Value("${analysisParameterDir}")
    String analysisParameterDir;

    @Override
    public void addAnalysis(AnalysisCase analysisCase, String email) {
        analysisCase.setCreator(email);
        analysisCase.setLayerManage(new ArrayList<>());
        analysisCaseMapper.addAnalysis(analysisCase);
    }

    @Override
    public Map<String, Object> pageQuery(String email, String keyword, int page, int size) {
        if(!keyword.equals("")) {
            keyword = "%" + keyword + "%";
        }
        List<AnalysisCase> list = analysisCaseMapper.fuzzyQuery(email, keyword, page, size * page);
        int total = analysisCaseMapper.count(email, keyword);
        Map<String, Object> map = new HashMap<>();
        map.put("list", list);
        map.put("total", total);
        return null;
    }

    @Override
    public AnalysisCase getAnalysisInfo(String id, String email) {
        AnalysisCase analysisCase = analysisCaseMapper.getAnalysisInfo(id);
        if (email.equals(analysisCase.getCreator())) {
            return analysisCase;
        } else throw new MyException(ResultEnum.QUERY_TYPE_ERROR);
    }

    @Override
    public void addData(String id, List<Map<String, String>> list) {
        if (list.size() != 0) analysisFileRelationalMapper.addRecord(id, list);
    }

    @Override
    public List<Map<String, Object>> getData(String id) {
        return analysisFileRelationalMapper.getData(id);
    }

    @Override
    public void delData(String caseId, String dataListId, String fileId) {
        AnalysisCase analysisInfo = analysisCaseMapper.getAnalysisInfo(caseId);
        List<String> layers = analysisInfo.getLayerManage();
        boolean flag = false;
        for(String id : layers) {
            if(id.equals(fileId)) {
                layers.remove(id);
                flag = true;
                break;
            }
        }
        if (flag) analysisCaseMapper.updateLayer(caseId, layers);
        analysisFileRelationalMapper.delData(caseId, dataListId, fileId);
    }

    @Override
    public void updateLayer(String caseId, List<String> list) {
        analysisCaseMapper.updateLayer(caseId, list);
    }

    @Override
    public List<Object> getLayersInfo(String id) {
        AnalysisCase analysisCase = analysisCaseMapper.getAnalysisInfo(id);
        List<String> list = analysisCase.getLayerManage();
        List<Object> result = new ArrayList<>();
        if (list.size() != 0) {
            List<Files> filesList = analysisCaseMapper.getLayersInfo(list);
            List<AnalysisResult> analysisResultList = analysisResultMapper.getAnalysisResult(id);

            for (String layerId : list) {
                for (Files files : filesList) {
                    if (files.getId().equals(layerId)) result.add(files);
                }
                for (AnalysisResult analysisResult : analysisResultList) {
                    if (analysisResult.getId().equals(layerId)) result.add(analysisResult);
                }
            }
        }
        return result;
    }

    @Override
    public void updateProjectInfo(AnalysisCase analysisCase, String email) {
        AnalysisCase analysis = analysisCaseMapper.getAnalysisInfo(analysisCase.getId());
        if (email.equals(analysis.getCreator())) {
            analysisCaseMapper.updateBaseInfo(analysisCase);
        } else throw new MyException(ResultEnum.QUERY_TYPE_ERROR);
    }

    @Override
    public void deleteAnalysis(String caseId, String email) {
        AnalysisCase analysis = analysisCaseMapper.getAnalysisInfo(caseId);
        if (email.equals(analysis.getCreator())) {
            analysisCaseMapper.deleteAnalysis(caseId);
        } else throw new MyException(ResultEnum.QUERY_TYPE_ERROR);
    }

    @Override
    public List<Map<String, Object>> findParameterByType(String type) {
        return analysisParameterMapper.findByType(type);
    }

    @Override
    public List<AnalysisResult> getAnalysisResult(String caseId) {
        return analysisResultMapper.getAnalysisResult(caseId);
    }

    @Override
    public String addDraw(JSONObject jsonObject, String email) {
        String caseId = jsonObject.getString("caseId");
        String fileName = jsonObject.getString("fileName");
        String visualType = jsonObject.getString("visualType");
        String jsonString = jsonObject.getJSONObject("geoJson").toJSONString();
        String path = analysisDir + caseId;
        String uuid = UUID.randomUUID().toString();
        FileWriter fw = null;
        BufferedWriter bw = null;
        try {
            fw = new FileWriter(path + "/" + uuid + ".json");
            bw = new BufferedWriter(fw);
            bw.write(jsonString);
            bw.flush();
            fw.close();
            bw.close();
        } catch (Exception e) {
            e.printStackTrace();
            throw new MyException(ResultEnum.DEFAULT_EXCEPTION);
        }
        String id = UUID.randomUUID().toString();
        AnalysisResult analysisResult = new AnalysisResult(id, fileName, id + ".json", null, email, visualType, "", caseId);
        analysisResultMapper.addAnalysisResult(analysisResult);
        return id;
    }

    @Override
    public void delAnalyticData(String id, String email) {
        AnalysisResult analysisResult = analysisResultMapper.getInfoById(id);
        String creator = analysisResult.getCreator();
        String caseId = analysisResult.getCaseId();
        if (creator.equals(email)) {
            analysisResultMapper.delAnalysisResult(id);
            FileUtil.deleteFolder(analysisDir + caseId + "/" + analysisResult.getAddress());
        } else throw new MyException(ResultEnum.QUERY_TYPE_ERROR);
    }

    @Override
    public String addSection(String caseId, String sectionId, String demId, String email, String fileName) {
        AnalysisResult section = analysisResultMapper.getInfoById(sectionId);
        String address = section.getAddress();
        Files files = filesMapper.findInfoById(demId);
        String sectionPath = analysisDir + caseId + "/" + address;
        String demPath = baseDir + files.getAddress();
        JSONObject jsonObject = FileUtil.readJson(sectionPath);
        JSONArray jsonArray = jsonObject.getJSONObject("geometry").getJSONArray("coordinates");
        String tempPath = tempDir + UUID.randomUUID() + ".txt";
        String resultUUID = UUID.randomUUID().toString();
        String resultPath =  analysisDir + caseId + "/" + resultUUID + ".txt";
        String result = UUID.randomUUID().toString();
        new Thread() {
            @Override
            @SneakyThrows
            public void run() {
                Process process = ProcessUtil.saveSectionValue(tempPath, demPath, jsonArray, resultPath);
                ProcessUtil.readProcessOutput(process.getInputStream(), System.out);
                int code = process.waitFor();
                process.destroy();
                if(code == 0) {
                    AnalysisResult analysisResult = new AnalysisResult(result, fileName, resultUUID + ".txt", null, email, "section", "", caseId);
                    analysisResultMapper.addAnalysisResult(analysisResult);

                } else {

                }
            }
        }.start();
        return result;
    }

    @Override
    public String addSectionCompare(String caseId, String sectionId, String email, List<String> demList, String fileName) {
        AnalysisResult section = analysisResultMapper.getInfoById(sectionId);
        String address = section.getAddress();
        List<Files> filesList = filesMapper.findInfoListById(demList);
        List<String> rasterPathList = new ArrayList<>();
        for(Files files : filesList) {
            rasterPathList.add(baseDir + files.getAddress());
        }
        String sectionPath = analysisDir + caseId + "/" + address;
        JSONObject jsonObject = FileUtil.readJson(sectionPath);
        JSONArray jsonArray = jsonObject.getJSONObject("geometry").getJSONArray("coordinates");
        String tempPath = tempDir + UUID.randomUUID() + ".txt";
        String resultUUID = UUID.randomUUID().toString();
        String resultPath =  analysisDir + caseId + "/" + resultUUID + ".txt";
        String result = UUID.randomUUID().toString();

        new Thread() {
            @Override
            @SneakyThrows
            public void run() {
                Process process = ProcessUtil.savaSectionContrast(tempPath, rasterPathList, jsonArray, resultPath);
                ProcessUtil.readProcessOutput(process.getInputStream(), System.out);
                int code = process.waitFor();
                process.destroy();
                if(code == 0) {
                    AnalysisResult analysisResult = new AnalysisResult(result, fileName, resultUUID + ".txt", null, email, "sectionContrast", "", caseId);
                    analysisResultMapper.addAnalysisResult(analysisResult);

                } else {

                }
            }
        }.start();
        return result;
    }

    @Override
    public String addSectionFlush(String caseId, String sectionId, String benchmarkId, String referId, String email, String fileName) {
        AnalysisResult section = analysisResultMapper.getInfoById(sectionId);
        String sectionPath = analysisDir + caseId + "/" + section.getAddress();
        String address = analysisParameterMapper.findAddressByBenchmarkIdAndReferId(benchmarkId, referId, "flush");
        Files benchmark = filesMapper.findInfoById(benchmarkId);
        Files refer = filesMapper.findInfoById(referId);
        String benchmarkPath = baseDir + benchmark.getAddress();
        String referPath = baseDir + refer.getAddress();
        JSONObject jsonObject = FileUtil.readJson(sectionPath);
        JSONArray jsonArray = jsonObject.getJSONObject("geometry").getJSONArray("coordinates");
        String tempPath = tempDir + UUID.randomUUID() + ".txt";
        String resultUUID = UUID.randomUUID().toString();
        String resultPath =  analysisDir + caseId + "/" + resultUUID + ".txt";
        String result = UUID.randomUUID().toString();
        new Thread() {
            @Override
            @SneakyThrows
            public void run() {
                Process process = ProcessUtil.sectionFlush(tempPath, benchmarkPath, referPath, analysisParameterDir + address, jsonArray, resultPath);
                ProcessUtil.readProcessOutput(process.getInputStream(), System.out);
                int code = process.waitFor();
                process.destroy();
                if(code == 0) {
                    AnalysisResult analysisResult = new AnalysisResult(result, fileName, resultUUID + ".txt", null, email, "sectionFlush", "", caseId);
                    analysisResultMapper.addAnalysisResult(analysisResult);

                } else {

                }
            }
        }.start();
        return result;
    }

    @Override
    public String addRegionFlush(String caseId, String regionId, String benchmarkId, String referId, String email, String fileName) {
        AnalysisResult region = analysisResultMapper.getInfoById(regionId);
        String regionPath = analysisDir + caseId + "/" + region.getAddress();
        String address = analysisParameterMapper.findAddressByBenchmarkIdAndReferId(benchmarkId, referId, "flush");
        JSONObject jsonObject = FileUtil.readJson(regionPath);
        JSONArray jsonArray = jsonObject.getJSONObject("geometry").getJSONArray("coordinates");
        String tempPath = tempDir + UUID.randomUUID() + ".txt";
        String resultUUID = UUID.randomUUID().toString();
        String tifPath = analysisDir + caseId + "/" +resultUUID + ".tif";
        String pngPath = visualDir + "png/" + resultUUID + ".png";
        String coordinatePath = tempPath + resultUUID + ".json";
        String result = UUID.randomUUID().toString();

        new Thread() {
            @Override
            @SneakyThrows
            public void run() {
                Process process = ProcessUtil.rasterCrop(tempPath, analysisParameterDir + address, pngPath, tifPath, coordinatePath, jsonArray);
                ProcessUtil.readProcessOutput(process.getInputStream(), System.out);
                int code = process.waitFor();
                process.destroy();
                if(code == 0) {
                    String content = getPngContent("png/" + resultUUID + ".png", coordinatePath);
                    String visualId = UUID.randomUUID().toString();
                    visualFileMapper.addVisualFile(new VisualFile(visualId, resultUUID + ".png", "png", content, ""));
                    AnalysisResult analysisResult = new AnalysisResult(result, fileName, resultUUID + ".tif", null, email, "regionFlush", visualId, caseId);
                    analysisResultMapper.addAnalysisResult(analysisResult);

                } else {

                }
            }
        }.start();
        return result;
    }

    @Override
    public String computeVolume(double deep, String caseId, String regionId, String demId, String email, String fileName) {
        AnalysisResult region = analysisResultMapper.getInfoById(regionId);
        String regionPath = analysisDir + caseId + "/" + region.getAddress();
        JSONObject jsonObject = FileUtil.readJson(regionPath);
        JSONArray jsonArray = jsonObject.getJSONObject("geometry").getJSONArray("coordinates");
        String tempPath = tempDir + UUID.randomUUID() + ".txt";
        Files file = filesMapper.findInfoById(demId);
        String demPath = baseDir + file.getAddress();
        String resultId = UUID.randomUUID().toString();
        String visualId = UUID.randomUUID().toString();
        String result = UUID.randomUUID().toString();
        String resultPath = analysisDir + caseId + "/" + resultId + ".tif";
        String visualPath = visualDir + "volume/" + visualId + ".png";
        String volumePath = visualDir + "volume/" + visualId + ".txt";
        String coordinatePath = visualDir + "volume/" + visualId + ".json";

        new Thread() {
            @Override
            @SneakyThrows
            public void run() {
                Process process = ProcessUtil.computeVolume(tempPath, deep, demPath, resultPath, visualPath, jsonArray, volumePath, coordinatePath);
                ProcessUtil.readProcessOutput(process.getInputStream(), System.out);
                int code = process.waitFor();
                process.destroy();
                if(code == 0) {
                    String content = getPngContent("volume/" + visualId + ".png", coordinatePath);
                    JSONObject json = JSONObject.parseObject(content);
                    json.put("deep", deep);
                    json.put("volume", Double.valueOf(FileUtil.readTextFile(volumePath)));
                    content = json.toJSONString();
                    String visualId = UUID.randomUUID().toString();
                    visualFileMapper.addVisualFile(new VisualFile(visualId, visualId + ".png", "volume", content, ""));
                    AnalysisResult analysisResult = new AnalysisResult(result, fileName, resultId + ".json", null, email, "volume", visualId, caseId);
                    analysisResultMapper.addAnalysisResult(analysisResult);
                } else {

                }
            }
        }.start();
        return result;
    }

    private String getPngContent(String address, String path) {
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("address", address);
        File file = new File(path);
        if(!file.exists()) {
            throw new MyException(ResultEnum.NO_OBJECT);
        }
        BufferedReader br = null;
        try {
            br = new BufferedReader(new FileReader(path));
            String jsonString = "";
            String line = "";
            while((line = br.readLine()) != null) {
                jsonString += line;
            }
            br.close();
            JSONObject json = jsonObject.parseObject(jsonString);
            JSONArray jsonArray = new JSONArray();
            jsonArray.add(json.getJSONArray("ul"));
            jsonArray.add(json.getJSONArray("ur"));
            jsonArray.add(json.getJSONArray("lr"));
            jsonArray.add(json.getJSONArray("ll"));
            jsonObject.put("coordinates", jsonArray);
            file.delete();
            return jsonObject.toJSONString();
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new MyException(ResultEnum.DEFAULT_EXCEPTION);
        }
    }

    @Override
    public Map<String, Object> addElevationFlush(String caseId, String benchmarkId, String referId, String email, String fileName) {
        Map<String, Object> map = analysisParameterMapper.findByBenchmarkIdAndReferId(benchmarkId, referId, "flush");
        String id = map.get("id").toString();
        String content = map.get("content").toString();
        String resultId = UUID.randomUUID().toString();
        AnalysisResult analysisResult = new AnalysisResult(resultId, fileName, id, null, email, "elevationFlush", content, caseId);
        analysisResultMapper.addAnalysisResult(analysisResult);
        Map<String, Object> m = new HashMap<>();
        m.put("id", resultId);
        m.put("fileName", fileName);
        m.put("visualId", content);
        return m;
    }

    @Override
    public Map<String, Object> addFlushContour(String caseId, String benchmarkId, String referId, String email, String fileName) {
        Map<String, Object> map = analysisParameterMapper.findByBenchmarkIdAndReferId(benchmarkId, referId, "flushContour");
        String id = map.get("id").toString();
        String content = map.get("content").toString();
        String resultId = UUID.randomUUID().toString();
        AnalysisResult analysisResult = new AnalysisResult(resultId, fileName, id, null, email, "flushContour", content, caseId);
        analysisResultMapper.addAnalysisResult(analysisResult);
        Map<String, Object> m = new HashMap<>();
        m.put("id", resultId);
        m.put("fileName", fileName);
        m.put("visualId", content);
        return m;
    }

    @Override
    public Map<String, Object> addSlope(String caseId, String demId, String email, String fileName) {
        Map<String, Object> map = analysisParameterMapper.findSlope(demId);
        String id = map.get("id").toString();
        String content = map.get("content").toString();
        String resultId = UUID.randomUUID().toString();
        AnalysisResult analysisResult = new AnalysisResult(resultId, fileName, id, null, email, "slope", content, caseId);
        analysisResultMapper.addAnalysisResult(analysisResult);
        Map<String, Object> m = new HashMap<>();
        m.put("id", resultId);
        m.put("fileName", fileName);
        m.put("visualId", content);
        return m;
    }
}
