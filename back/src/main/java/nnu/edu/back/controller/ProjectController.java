package nnu.edu.back.controller;

import com.alibaba.fastjson2.JSONObject;
import nnu.edu.back.common.auth.AuthCheck;
import nnu.edu.back.common.resolver.JwtTokenParser;
import nnu.edu.back.common.result.JsonResult;
import nnu.edu.back.common.result.ResultUtils;
import nnu.edu.back.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletResponse;

/**
 * Created with IntelliJ IDEA.
 *
 * @Author: Yiming
 * @Date: 2023/07/29/14:16
 * @Description:
 */
@RestController
@RequestMapping("/project")
public class ProjectController {
    @Autowired
    ProjectService projectService;

    @AuthCheck
    @RequestMapping(value = "/createProject", method = RequestMethod.POST)
    public JsonResult createProject(@RequestBody JSONObject jsonObject) {
        String projectName = jsonObject.getString("projectName");
        String avatar = jsonObject.getString("avatar");
        String description = jsonObject.getString("description");
        String institution = jsonObject.getString("institution");
        String location = jsonObject.getString("location");
        String time = jsonObject.getString("time");
        String type = jsonObject.getString("type");
        return ResultUtils.success(projectService.createProject(projectName, avatar, description, institution, location, time, type));
    }

    @AuthCheck
    @RequestMapping(value = "/uploadAvatar", method = RequestMethod.POST)
    public JsonResult uploadAvatar(@RequestParam MultipartFile file) {
        return ResultUtils.success(projectService.uploadAvatar(file));
    }

    @RequestMapping(value = "/getAvatar/{pictureName}", method = RequestMethod.GET)
    public void getAvatar(@PathVariable String pictureName, HttpServletResponse response) {
        projectService.getAvatar(pictureName, response);
    }

    @AuthCheck
    @RequestMapping(value = "/multipartUpload", method = RequestMethod.POST)
    public JsonResult multipartUpload(@RequestParam MultipartFile file, @RequestParam String key, @RequestParam String number) {
        projectService.multipartUpload(file, key, number);
        return ResultUtils.success();
    }

    @AuthCheck
    @RequestMapping(value = "/mergeMultipartFile", method = RequestMethod.POST)
    public JsonResult mergeMultipartFile(@RequestBody JSONObject jsonObject) {
        String key = jsonObject.getString("key");
        int total = jsonObject.getIntValue("total");
        projectService.mergeMultipartFile(key, total);
        return ResultUtils.success();
    }

    @AuthCheck
    @RequestMapping(value = "/pageQueryProject", method = RequestMethod.POST)
    public JsonResult pageQueryProject(@RequestBody JSONObject jsonObject) {
        String type = jsonObject.getString("type");
        String keyword = jsonObject.getString("keyword");
        int page = jsonObject.getIntValue("page");
        int size = jsonObject.getIntValue("size");
        return ResultUtils.success(projectService.pageQueryProject(keyword, type, page, size));
    }

}
