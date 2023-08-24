package nnu.edu.back.controller;

import nnu.edu.back.common.result.JsonResult;
import nnu.edu.back.common.result.ResultUtils;
import nnu.edu.back.service.MonitorProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

/**
 * Created with IntelliJ IDEA.
 *
 * @Author: Yiming
 * @Date: 2023/08/23/11:01
 * @Description:
 */
@RestController
@RequestMapping("/project")
public class MonitorProjectController {
    @Autowired
    MonitorProjectService monitorProjectService;

    @RequestMapping(value = "/getAllSection/{projectId}", method = RequestMethod.GET)
    public JsonResult getAllSection(@PathVariable String projectId) {
        return ResultUtils.success(monitorProjectService.getAllSection(projectId));
    }

    @RequestMapping(value = "/getSectionElevation/{projectId}", method = RequestMethod.GET)
    public JsonResult getSectionElevation(@PathVariable String projectId) {
        return ResultUtils.success(monitorProjectService.getSectionElevation(projectId));
    }

    @RequestMapping(value = "/getFluxNameAndType/{projectId}", method = RequestMethod.GET)
    public JsonResult getFluxNameAndType(@PathVariable String projectId) {
        return ResultUtils.success(monitorProjectService.getFluxNameAndType(projectId));
    }

    @RequestMapping(value = "/getFluxByNameAndType/{projectId}/{name}/{type}", method = RequestMethod.GET)
    public JsonResult getFluxByNameAndType(@PathVariable String projectId, @PathVariable String name, @PathVariable String type) {
        return ResultUtils.success(monitorProjectService.getFluxByNameAndType(projectId, name, type));
    }

    @RequestMapping(value = "/getSubstrate/{projectId}", method = RequestMethod.GET)
    public JsonResult getSubstrate(@PathVariable String projectId) {
        return ResultUtils.success(monitorProjectService.getSubstrate(projectId));
    }

    @RequestMapping(value = "/getSandTransportNameAndType/{projectId}", method = RequestMethod.GET)
    public JsonResult getSandTransportNameAndType(@PathVariable String projectId) {
        return ResultUtils.success(monitorProjectService.getSandTransportNameAndType(projectId));
    }

    @RequestMapping(value = "/getSandTransportByNameAndType/{projectId}/{name}/{type}", method = RequestMethod.GET)
    public JsonResult getSandTransportByNameAndType(@PathVariable String projectId, @PathVariable String name, @PathVariable String type) {
        return ResultUtils.success(monitorProjectService.getSandTransportByNameAndType(projectId, name, type));
    }

    @RequestMapping(value = "/getSpeed/{projectId}/{name}", method = RequestMethod.GET)
    public JsonResult getSpeed(@PathVariable String projectId, @PathVariable String name) {
        return ResultUtils.success(monitorProjectService.getSpeed(projectId, name));
    }


    @RequestMapping("/test")
    public JsonResult test() {
        return ResultUtils.success(monitorProjectService.test());
    }
}
