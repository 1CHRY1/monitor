package nnu.edu.back.controller;

import com.alibaba.fastjson2.JSONObject;
import nnu.edu.back.common.auth.AuthCheck;
import nnu.edu.back.common.resolver.JwtTokenParser;
import nnu.edu.back.common.result.JsonResult;
import nnu.edu.back.common.result.ResultUtils;
import nnu.edu.back.pojo.Files;
import nnu.edu.back.service.FilesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Created with IntelliJ IDEA.
 *
 * @Author: Yiming
 * @Date: 2023/08/15/21:36
 * @Description:
 */
@RestController
@RequestMapping("/files")
public class FilesController {
    @Autowired
    FilesService filesService;

    @AuthCheck
    @RequestMapping(value = "/addFile", method = RequestMethod.POST)
    public JsonResult addFile(@RequestBody Files file) {
        return ResultUtils.success(filesService.addFiles(file));
    }


    @RequestMapping(value = "/downloadFile/{id}", method = RequestMethod.GET)
    public void downloadFile(@PathVariable String id, HttpServletResponse response) {
        filesService.downloadFile(id, response);
    }

    @AuthCheck
    @RequestMapping(value = "/bindVisualData", method = RequestMethod.POST)
    public JsonResult bindVisualData(@RequestBody JSONObject jsonObject) {
        return ResultUtils.success(filesService.bindVisualData(jsonObject));
    }

    @AuthCheck
    @RequestMapping(value = "/cancelVisualBind/{fileId}", method = RequestMethod.DELETE)
    public JsonResult cancelVisualBind(@PathVariable String fileId) {
        filesService.cancelVisualBind(fileId);
        return ResultUtils.success();
    }



}
