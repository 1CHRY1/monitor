package nnu.edu.back.controller;

import com.alibaba.fastjson2.JSONObject;
import nnu.edu.back.common.auth.AuthCheck;
import nnu.edu.back.common.resolver.JwtTokenParser;
import nnu.edu.back.common.result.JsonResult;
import nnu.edu.back.common.result.ResultUtils;
import nnu.edu.back.pojo.AnalysisCase;
import nnu.edu.back.service.AnalysisService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 *
 * @Author: Yiming
 * @Date: 2023/08/18/16:52
 * @Description:
 */
@RestController
@RequestMapping("/analysis")
public class AnalysisController {
    @Autowired
    AnalysisService analysisService;

    @AuthCheck
    @RequestMapping(value = "/addAnalysis", method = RequestMethod.POST)
    public JsonResult addAnalysis(@RequestBody AnalysisCase analysisCase, @JwtTokenParser("email") String email) {
        analysisService.addAnalysis(analysisCase, email);
        return ResultUtils.success();
    }

    @AuthCheck
    @RequestMapping(value = "/pageQuery", method = RequestMethod.POST)
    public JsonResult pageQuery(@RequestBody JSONObject jsonObject, @JwtTokenParser("email") String email) {
        return ResultUtils.success(analysisService.pageQuery(email, jsonObject.getString("keyword"), jsonObject.getIntValue("page"), jsonObject.getIntValue("size")));
    }

    @AuthCheck
    @RequestMapping(value = "/getAnalysisInfo/{projectId}", method = RequestMethod.GET)
    public JsonResult getAnalysisInfo(@PathVariable String projectId, @JwtTokenParser("email") String email) {
        return ResultUtils.success(analysisService.getAnalysisInfo(projectId, email));
    }

    @AuthCheck
    @RequestMapping(value = "/addData", method = RequestMethod.POST)
    public JsonResult addData(@RequestBody JSONObject jsonObject) {
        String projectId = jsonObject.getString("projectId");
        List<Map<String, String>> list = jsonObject.getObject("list", List.class);
        analysisService.addData(projectId, list);
        return ResultUtils.success();
    }

    @AuthCheck
    @RequestMapping(value = "/getData/{id}", method = RequestMethod.GET)
    public JsonResult getData(@PathVariable String id) {
        return ResultUtils.success(analysisService.getData(id));
    }

    @AuthCheck
    @RequestMapping(value = "/delData/{caseId}/{dataListId}/{fileId}", method = RequestMethod.DELETE)
    public JsonResult delData(@PathVariable String caseId, @PathVariable String dataListId, @PathVariable String fileId) {
        analysisService.delData(caseId, dataListId, fileId);
        return ResultUtils.success();
    }

    @AuthCheck
    @RequestMapping(value = "/updateLayer/{caseId}", method = RequestMethod.POST)
    public JsonResult updateLayer(@PathVariable String caseId, @RequestBody List<String> list) {
        analysisService.updateLayer(caseId, list);
        return ResultUtils.success();
    }

    @AuthCheck
    @RequestMapping(value = "/getLayersInfo/{projectId}", method = RequestMethod.GET)
    public JsonResult getLayersInfo(@PathVariable String projectId) {
        return ResultUtils.success(analysisService.getLayersInfo(projectId));
    }


    @AuthCheck
    @RequestMapping(value = "/updateAnalysisInfo", method = RequestMethod.PATCH)
    public JsonResult updateProjectInfo(@RequestBody AnalysisCase analysisCase, @JwtTokenParser("email") String email) {
        analysisService.updateProjectInfo(analysisCase, email);
        return ResultUtils.success();
    }

    @AuthCheck
    @RequestMapping(value = "/deleteAnalysis/{caseId}", method = RequestMethod.DELETE)
    public JsonResult deleteAnalysis(@PathVariable String caseId, @JwtTokenParser("email") String email) {
        analysisService.deleteAnalysis(caseId, email);
        return ResultUtils.success();
    }

    @AuthCheck
    @RequestMapping(value = "/findParameterByType/{type}", method = RequestMethod.GET)
    public JsonResult findParameterByType(@PathVariable String type) {
        return ResultUtils.success(analysisService.findParameterByType(type));
    }

    @AuthCheck
    @RequestMapping(value = "/getAnalysisResult/{caseId}", method = RequestMethod.GET)
    public JsonResult getAnalysisResult(@PathVariable String caseId) {
        return ResultUtils.success(analysisService.getAnalysisResult(caseId));
    }

    @AuthCheck
    @RequestMapping(value = "/addDraw", method = RequestMethod.POST)
    public JsonResult addDraw(@RequestBody JSONObject jsonObject, @JwtTokenParser("email") String email) {
        return ResultUtils.success(analysisService.addDraw(jsonObject, email));
    }

    @AuthCheck
    @RequestMapping(value = "/delAnalyticData/{id}", method = RequestMethod.DELETE)
    public JsonResult delAnalyticData(@PathVariable String id, @JwtTokenParser("email") String email) {
        analysisService.delAnalyticData(id, email);
        return ResultUtils.success();
    }

    @AuthCheck
    @RequestMapping(value = "/addSection", method = RequestMethod.POST)
    public JsonResult addSection(@RequestBody JSONObject jsonObject, @JwtTokenParser("email") String email) {
        String projectId = jsonObject.getString("projectId");
        String sectionId = jsonObject.getString("sectionId");
        String demId = jsonObject.getString("demId");
        String fileName = jsonObject.getString("fileName");
        return ResultUtils.success(analysisService.addSection(projectId, sectionId, demId, email, fileName));
    }

    @AuthCheck
    @RequestMapping(value = "/addSectionCompare", method = RequestMethod.POST)
    public JsonResult addSectionCompare(@RequestBody JSONObject jsonObject, @JwtTokenParser("email") String email) {
        String projectId = jsonObject.getString("projectId");
        String sectionId = jsonObject.getString("sectionId");
        String fileName = jsonObject.getString("fileName");
        List<String> demList = jsonObject.getObject("demList", List.class);
        return ResultUtils.success(analysisService.addSectionCompare(projectId, sectionId, email, demList, fileName));
    }

    @AuthCheck
    @RequestMapping(value = "/addSectionFlush", method = RequestMethod.POST)
    public JsonResult addSectionFlush(@RequestBody JSONObject jsonObject, @JwtTokenParser("email") String email) {
        String projectId = jsonObject.getString("projectId");
        String sectionId = jsonObject.getString("sectionId");
        String benchmarkId = jsonObject.getString("benchmarkId");
        String referId = jsonObject.getString("referId");
        String fileName = jsonObject.getString("fileName");
        return ResultUtils.success(analysisService.addSectionFlush(projectId, sectionId, benchmarkId, referId, email, fileName));
    }

    @AuthCheck
    @RequestMapping(value = "/addRegionFlush", method = RequestMethod.POST)
    public JsonResult addRegionFlush(@RequestBody JSONObject jsonObject, @JwtTokenParser("email") String email) {
        String projectId = jsonObject.getString("projectId");
        String regionId = jsonObject.getString("regionId");
        String benchmarkId = jsonObject.getString("benchmarkId");
        String referId = jsonObject.getString("referId");
        String fileName = jsonObject.getString("fileName");
        return ResultUtils.success(analysisService.addRegionFlush(projectId, regionId, benchmarkId, referId, email, fileName));
    }

    @AuthCheck
    @RequestMapping(value = "/computeVolume", method = RequestMethod.POST)
    public JsonResult computeVolume(@RequestBody JSONObject jsonObject, @JwtTokenParser("email") String email) {
        Double deep = jsonObject.getDouble("deep");
        String projectId = jsonObject.getString("projectId");
        String regionId = jsonObject.getString("regionId");
        String demId = jsonObject.getString("demId");
        String fileName = jsonObject.getString("fileName");
        return ResultUtils.success(analysisService.computeVolume(deep, projectId, regionId, demId, email, fileName));
    }

    @AuthCheck
    @RequestMapping(value = "/addElevationFlush", method = RequestMethod.POST)
    public JsonResult addElevationFlush(@RequestBody JSONObject jsonObject, @JwtTokenParser("email") String email) {
        String projectId = jsonObject.getString("projectId");
        String benchmarkId = jsonObject.getString("benchmarkId");
        String referId = jsonObject.getString("referId");
        String fileName = jsonObject.getString("fileName");
        return ResultUtils.success(analysisService.addElevationFlush(projectId, benchmarkId, referId, email, fileName));
    }

    @AuthCheck
    @RequestMapping(value = "/addFlushContour", method = RequestMethod.POST)
    public JsonResult addFlushContour(@RequestBody JSONObject jsonObject, @JwtTokenParser("email") String email) {
        String projectId = jsonObject.getString("projectId");
        String benchmarkId = jsonObject.getString("benchmarkId");
        String referId = jsonObject.getString("referId");
        String fileName = jsonObject.getString("fileName");
        return ResultUtils.success(analysisService.addFlushContour(projectId, benchmarkId, referId, email, fileName));
    }

    @AuthCheck
    @RequestMapping(value = "/addSlope", method = RequestMethod.POST)
    public JsonResult addSlope(@RequestBody JSONObject jsonObject, @JwtTokenParser("email") String email) {
        String projectId = jsonObject.getString("projectId");
        String demId = jsonObject.getString("demId");
        String fileName = jsonObject.getString("fileName");
        return ResultUtils.success(analysisService.addSlope(projectId, demId, email, fileName));
    }




}
